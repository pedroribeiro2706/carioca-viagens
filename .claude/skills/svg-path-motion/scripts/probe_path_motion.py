"""Geometric probe for an SVG path-motion animation (see the svg-path-motion skill).

READ-ONLY: it drives a real browser, scrolls, and MEASURES. It never edits the
project. Use it to prove the moving element stays on its path across widths and
scroll positions, that rotation introduced no smoothOrigin offset, and that the
element advances monotonically along the path.

Usage:
    python probe_path_motion.py <url> [--selector CSS] [--widths 1440,1200,1024]

`--selector` is a CSS selector that resolves to the container div that holds the
inline <svg> for the animated element (the element with the runtime <g> wrapper).
If omitted, the probe auto-discovers every container matching
`div[aria-hidden] > svg` and reports each one. Adapt the selector to your markup.

Requires: playwright (`pip install playwright && playwright install chrome`).
The probe uses channel="chrome", a normal viewport, and page scrolling — it does
NOT resize the window to the page height (that would break vh-based CSS).

What it DOES check:
  - element-reference-to-path nearest distance (is the element on the line),
    which is direction-agnostic — valid whether the raw path parameter grows or
    shrinks during travel;
  - applied rotation and that svgOrigin introduced no smoothOrigin xOffset/yOffset;
  - console errors and failed network requests.

What it does NOT check (do these separately — see references/validation.md):
  - the "nothing revealed ahead of the element" guarantee. This probe measures
    on-path distance, not the reveal endpoint. Confirm reveal-behind visually at a
    cusp, or add a reveal-endpoint assertion.
  - Caveats to read the output with:
    * The "avanço monotônico" line assumes the raw parameter INCREASES with
      progress; if your element travels toward raw t=0, bestT decreases and that
      line will say "NAO" even though motion is correct. The distance number is
      still valid.
    * The moving group is found as the first <g> with a transform attribute. If
      the artwork has its own transformed <g>, pass --selector and/or tag the
      runtime wrapper so the probe targets it unambiguously.
    * Near a self-intersection or where the path passes close to itself,
      nearest-point can match the wrong branch and read ~0 even if the element is
      on the other branch — a possible false PASS. Verify those spots visually.
  - The default auto-discovery selector (`div[aria-hidden] > svg`) is one common
    shape; pass --selector for any other markup. It is not meant to be universal.
"""

import argparse
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

from playwright.sync_api import sync_playwright  # noqa: E402

# Auto-discovers animated containers: a wrapper holding an inline <svg> whose
# longest stroked <path> is the trajectory and which has a transformed <g>
# (the runtime icon wrapper). Returns an index list the caller can measure.
JS_DISCOVER = r"""
(selector) => {
  let containers;
  if (selector) {
    containers = Array.from(document.querySelectorAll(selector));
  } else {
    containers = Array.from(document.querySelectorAll('div[aria-hidden] > svg')).map(s => s.parentElement);
  }
  window.__pm = containers.map(c => {
    const svg = c.querySelector('svg');
    if (!svg) return null;
    const strokes = Array.from(svg.querySelectorAll('path')).filter(p => getComputedStyle(p).fill === 'none');
    if (!strokes.length) return null;
    const traj = strokes.reduce((a, b) => b.getTotalLength() > a.getTotalLength() ? b : a);
    const sec = c.closest('section') || document.body;
    return { c, svg, traj, sec };
  });
  return window.__pm.map((x, i) => x ? ({
    index: i,
    trajLen: x.traj.getTotalLength(),
    hasRotatedWrapper: !!Array.from(x.svg.querySelectorAll('g')).find(g => g.getAttribute('transform')),
    hasMask: !!x.svg.querySelector('mask'),
  }) : null).filter(Boolean);
}
"""

JS_SECTION = r"""
(idx) => { const {sec} = window.__pm[idx]; const r = sec.getBoundingClientRect();
  return { top: r.top + scrollY, h: r.height, vh: innerHeight }; }
"""

# Nearest-point distance (element reference -> nearest path point), applied
# rotation, and smoothOrigin offsets. Independent of external progress math.
JS_MEASURE = r"""
(idx) => {
  const { svg, traj } = window.__pm[idx];
  const len = traj.getTotalLength();
  const ctm = traj.getScreenCTM();
  if (!ctm) return { mounted: false };
  const toScreen = (p) => { const pt = svg.createSVGPoint(); pt.x = p.x; pt.y = p.y; return pt.matrixTransform(ctm); };
  const wrapper = Array.from(svg.querySelectorAll('g')).find(g => g.getAttribute('transform'));
  if (!wrapper) return { mounted: false };
  const wb = wrapper.getBBox();
  const ap = svg.createSVGPoint(); ap.x = wb.x + wb.width / 2; ap.y = wb.y + wb.height / 2;
  const a = ap.matrixTransform(wrapper.getScreenCTM());
  let best = Infinity, bestT = 0;
  for (let i = 0; i <= 1500; i++) {
    const s = toScreen(traj.getPointAtLength(i / 1500 * len));
    const d = Math.hypot(s.x - a.x, s.y - a.y);
    if (d < best) { best = d; bestT = i / 1500; }
  }
  const m = wrapper.transform.baseVal.consolidate();
  const rot = m ? Math.atan2(m.matrix.b, m.matrix.a) * 180 / Math.PI : 0;
  const g = wrapper._gsap || {};
  return { mounted: true, nearest: best, bestT, rot: +rot.toFixed(1),
           xOffset: g.xOffset ?? 0, yOffset: g.yOffset ?? 0 };
}
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("url")
    ap.add_argument("--selector", default=None)
    ap.add_argument("--widths", default="1440,1200,1024")
    ap.add_argument("--positions", default="0.1,0.3,0.5,0.7,0.9,1.0")
    args = ap.parse_args()
    widths = [int(w) for w in args.widths.split(",")]
    positions = [float(p) for p in args.positions.split(",")]

    console_errors = []
    failed = []
    worst_overall = 0.0

    with sync_playwright() as pw:
        b = pw.chromium.launch(channel="chrome")
        for W in widths:
            pg = b.new_page(viewport={"width": W, "height": 900})
            pg.on("console", lambda m: console_errors.append(f"[{W}] {m.type}: {m.text}") if m.type == "error" else None)
            pg.on("requestfailed", lambda r: failed.append(f"[{W}] {r.url}"))
            pg.goto(args.url, wait_until="networkidle")
            pg.wait_for_timeout(600)
            found = pg.evaluate(JS_DISCOVER, args.selector)
            if not found:
                print(f"[{W}px] nenhum container de path-motion encontrado")
                pg.close()
                continue
            for f in found:
                idx = f["index"]
                info = pg.evaluate(JS_SECTION, idx)
                start = info["top"] - info["vh"]
                end = info["top"] + info["h"]
                print(f"\n[{W}px] container idx={idx} trajLen={f['trajLen']:.0f} "
                      f"rotWrapper={f['hasRotatedWrapper']} mask={f['hasMask']}")
                prev_t = None
                mono = True
                for prog in positions:
                    pg.evaluate("(y) => scrollTo(0, y)", start + prog * (end - start))
                    pg.wait_for_timeout(250)
                    m = pg.evaluate(JS_MEASURE, idx)
                    if not m.get("mounted"):
                        print(f"   prog {prog:>4}: nao montado")
                        continue
                    worst_overall = max(worst_overall, m["nearest"])
                    off_ok = abs(m["xOffset"]) < 0.01 and abs(m["yOffset"]) < 0.01
                    if prev_t is not None and m["bestT"] < prev_t - 0.02:
                        mono = False
                    prev_t = m["bestT"]
                    print(f"   prog {prog:>4}: nearest={m['nearest']:.3f}px "
                          f"rot={m['rot']:>7.1f} offset0={'ok' if off_ok else 'NAO'} bestT={m['bestT']:.3f}")
                print(f"   avanco monotonico ao longo do path: {'sim' if mono else 'NAO'}")
            pg.close()
        b.close()

    print("\n=== RESUMO ===")
    print(f"pior nearest-point em todas as larguras/posicoes: {worst_overall:.3f} px "
          f"({'PASS <1px' if worst_overall < 1.0 else 'FALHA >=1px'})")
    print(f"erros de console: {len(console_errors)}")
    for e in console_errors:
        print("   ", e)
    print(f"requisicoes falhas: {len(failed)}")
    for r in failed:
        print("   ", r)


if __name__ == "__main__":
    main()

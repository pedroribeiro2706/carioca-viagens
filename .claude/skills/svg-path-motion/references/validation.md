# Validation — geometric and visual

This effect fails in sub-pixel ways. A single screenshot at one scroll position
hides an element that's 4px off the path at other positions, a trail that peeks
ahead near a cusp, or a rotation that jumps at a self-intersection. Validate by
*measuring geometry in the live DOM* across a grid of widths × scroll positions,
then confirm with a few screenshots. Don't rely on eyeballing one frame.

Run the ready-made probe in `scripts/probe_path_motion.py` (Playwright), or lift
the JS below into any driver / devtools console.

## The single most useful measurement: nearest point on the path

"Is the element on the line?" is answered by the distance from the element's
reference point (rendered, i.e. after transform) to the *nearest* point on the
trajectory. Nearest-point — not the point at the `t` you think it's at — because
it's independent of your own progress bookkeeping: if the element is on the line
but at a slightly different arc position than your external calculation assumed,
nearest-point is still ~0, and you avoid chasing a phantom error.

```js
// Run in page context. Returns nearest-point distance in screen px.
function nearestPathDistance(container) {
  const svg = container.querySelector('svg')
  const strokes = [...svg.querySelectorAll('path')].filter(p => getComputedStyle(p).fill === 'none')
  const traj = strokes.reduce((a, b) => b.getTotalLength() > a.getTotalLength() ? b : a)
  const len = traj.getTotalLength()
  const ctm = traj.getScreenCTM()
  const toScreen = (p) => { const pt = svg.createSVGPoint(); pt.x = p.x; pt.y = p.y; return pt.matrixTransform(ctm) }
  const wrapper = [...svg.querySelectorAll('g')].find(g => g.getAttribute('transform'))
  const wb = wrapper.getBBox()
  const ap = svg.createSVGPoint(); ap.x = wb.x + wb.width / 2; ap.y = wb.y + wb.height / 2
  const a = ap.matrixTransform(wrapper.getScreenCTM())
  let best = Infinity
  for (let i = 0; i <= 1500; i++) {
    const s = toScreen(traj.getPointAtLength(i / 1500 * len))
    best = Math.min(best, Math.hypot(s.x - a.x, s.y - a.y))
  }
  return best
}
```

Pass bar: **< 1px at every sampled width × scroll position**, not just the ends.
The ends often pass even with a broken rotation origin (θ is small there); the
middle of the travel, at the sharp turns, is where the origin bug shows.

## Rotation-origin proof: no smoothOrigin offset

After setting `svgOrigin`, confirm GSAP didn't bake a compensation offset (which
would mean you set it too late — see Pitfall 1):

```js
const wrapper = [...svg.querySelectorAll('g')].find(g => g.getAttribute('transform'))
const c = wrapper._gsap   // { xOffset, yOffset, xOrigin, yOrigin, rotation, ... }
// expect: Math.abs(c.xOffset) < 0.01 && Math.abs(c.yOffset) < 0.01
```

## Nothing ahead: reveal endpoint vs element

Read the mask path's animated `stroke-dasharray` / `stroke-dashoffset`, compute
the revealed segment's leading end as a fraction of length, and confirm it equals
the element's `rawT` (within tolerance) — never past it. In practice, the
nearest-point test plus a visual check at a cusp is enough; add this only if you
suspect a direction inversion.

## Overlap sweep (does the element hit content?)

If the element shares space with text/cards, sweep widths × scroll positions and
intersect the element's rendered bounding box with each content box. Treat a
shallow (few-px) bounding-box overlap as a *candidate*, not a verdict: a rotated
icon's bbox corner can clip a text box while the visible artwork doesn't touch a
glyph. Confirm the worst candidate visually before acting. Tune the `ceiling`
table (architecture §7) to keep the element clear on narrow widths.

## Rotation continuity

Sample rotation across the full range and assert no jump above a threshold (e.g.
15°) between adjacent samples — catches discontinuities at self-intersections or
where the tangent sampling flips.

```js
// sample applyProgress across [0,1] and read wrapper rotation; diff adjacent samples
```

## Screenshots

After the geometry passes, capture a handful of frames across the scroll range
(and at 2–3 widths). Confirm visually: element sits on the revealed tip, dashes/
dots intact, nothing ahead, rotation faces travel. For a long page, screenshot
per-section rather than full-page (headless full-page composition can misrender).
A useful trick: draw a marker at `getPointAtLength(rawT·len)` and confirm it lands
in the element's center.

## Reduced motion & breakpoint

- Set `prefers-reduced-motion: reduce`, load, scroll fully: the frame must be
  *identical* before and after (static, no ScrollTrigger).
- Below `minWidth`: the element's container is `display:none` and the scroll logic
  isn't mounted.
- Cross the breakpoint at runtime (resize): the trigger is killed and the DOM
  restored; no duplicate mask under StrictMode/HMR.

## Cleanup

Unmount (or route away) and assert the inline SVG equals the original import: no
`<mask>`, no created `<defs>`, no `<g>` wrapper, no residual transform attribute.

## Environment notes

- The probe drives a real browser (Playwright, `channel="chrome"`), a normal
  viewport, and scrolls the page — it does **not** resize the window to the page
  height (that breaks any `vh`-based CSS and invalidates the measurement).
- Serve the built/dev site over http; `file://` won't run module scripts the same
  way and some drivers can't open it.
- Report the actual widths/positions sampled and the worst numbers found. If a
  tool (browser channel, display) isn't available in the environment, say so and
  fall back to code inspection — don't report validation you didn't run.

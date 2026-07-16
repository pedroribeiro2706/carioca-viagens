---
name: svg-path-motion
description: >-
  Build a scroll-linked animation where an element travels along an SVG path
  while the path is revealed ONLY behind it, with optional rotation that follows
  the path tangent. Use this whenever an icon/marker/object should "draw",
  "travel", "trace", or "recede along" a route/path/line as the user scrolls — a
  plane along a flight path, a dot along a map route, a pin receding along a
  trail, a marker along a track, a cursor along a wire — especially when the
  revealed line must trail behind the moving element and never appear ahead of
  it, when the path is dashed or dotted and its pattern must survive, or when the
  element should turn to face its direction of travel. Trigger even if the user
  only describes the effect ("a plane that flies along a dotted line as I
  scroll", "reveal the route behind a moving pin", "make the icon follow the
  curve and rotate into the turns") without naming GSAP, SVG paths, or
  getPointAtLength. Pairs with the `gsap` skill: that one covers GSAP /
  ScrollTrigger / DrawSVG fundamentals; THIS one is the specialized recipe for
  the path-follow + reveal-behind + tangent-rotation pattern and the subtle
  geometry bugs it hides. Not for simple fade/slide reveals, generic
  scroll-triggered entrances, or CSS-only line drawing.
---

# SVG Path Motion (scroll-linked, reveal-behind, tangent rotation)

An element rides along an SVG `<path>` as the user scrolls. The path is drawn in
*behind* the element and never ahead of it, so it reads as the element leaving a
trail. Optionally the element rotates to face its direction of travel. It is
responsive, honors reduced motion, cleans up fully, and never mutates the
original SVG.

This is a deceptively hard effect. The visible bugs (element "detaches" from the
line, rotates too early, a dotted line turns solid, the trail peeks ahead) all
trace back to a handful of geometry mistakes. This skill encodes the working
architecture and the fixes so you don't rediscover them.

## Relationship to the `gsap` skill

Load the **`gsap`** skill for the primitives: `ScrollTrigger` (scrub, start/end,
refresh, cleanup), `DrawSVGPlugin`, `useGSAP`, `gsap.matchMedia`. Do not restate
those here — read `gsap/references/gsap-scrolltrigger.md` and
`gsap/references/gsap-plugins.md` when you need API detail.

This skill sits on top of them and answers the questions GSAP's docs don't: how
to keep position, reveal, and rotation reading from **one** geometric source; why
the element drifts off the path when it rotates; how to reveal a *dashed* path
without destroying its dashes; how to detect travel direction at runtime instead
of guessing from the `d` attribute.

## The one idea that prevents most bugs

**Position, reveal, and tangent must all be computed from the same path
parameter `t`** — a single fraction in `[0,1]` mapped through
`path.getPointAtLength(t * path.getTotalLength())`.

Everything the element does at a given moment is a function of one `t`:

- **Position**: `getPointAtLength(t·len)` → translate the element there.
- **Reveal**: draw the path from its start up to exactly `t` (mask or DrawSVG).
- **Tangent**: sample the path just around `t` to get the heading.

If you instead derive these from three separately-computed progress values, they
will *look* equal but land on different points the moment there is a direction
inversion, a calibration offset, or an eased remap. Numerically-close is not
geometrically-equal. Keep `t` as the single source of truth and pass it —
literally the same variable — into all three.

## Core architecture

Implement as one framework-agnostic controller (a React hook, a Vue composable,
or a plain init function). The shape is the same everywhere:

1. **Resolve elements at runtime** from the inline SVG:
   - the **icon** = the filled shape(s) that move (may include sibling
     decorations — a dot inside a pin, a window on a plane);
   - the **trajectory** = the stroked `<path>` with the greatest total length;
   - optional **caps** = shorter stroked paths at the ends that reveal with the
     trajectory but aren't part of travel.
   Return a controlled failure (log + bail) if the expected shapes aren't found,
   rather than animating an ambiguous target.

2. **Wrap the icon parts in a runtime `<g>`.** Sibling shapes must move as a
   unit, so group them under one wrapper that becomes the single transform
   target. Record how to unwrap for cleanup.

3. **Measure the rest point once.** The combined bbox center of the icon parts,
   measured *before* any transform, is `restPoint`. This is both the translation
   reference and — critically — the rotation origin (see Pitfall 1).

4. **Detect travel direction at runtime** (`detectArrivalAtRawStart`): compare
   the distance from `restPoint` to the path's raw `t=0` point vs its raw `t=1`
   point. The nearer end is where the element "arrives". Never read this from the
   `d` string — that guess has been wrong before.

5. **Set up reveal** according to stroke style (see Pitfall 2): solid → DrawSVG
   directly on the path; dashed/dotted → DrawSVG on a solid copy inside a
   `<mask>`, leaving the authored `stroke-dasharray` untouched.

6. **Drive one `applyProgress(t)`** from `ScrollTrigger` (`scrub: true`), and
   also call it once synchronously right after setup (before revealing the
   element) so a page loaded mid-scroll paints the correct frame — no flash of
   the whole path or a mispositioned icon.

7. **`gsap.matchMedia`** gates everything on a visibility breakpoint and
   `prefers-reduced-motion` (see Responsiveness and Reduced motion below).

8. **Clean up completely**: kill the ScrollTrigger, revert matchMedia, remove the
   runtime mask/`<defs>`, unwrap the `<g>`. The original SVG must end byte-identical.

Read `references/architecture.md` for the full annotated controller with all
helper functions.

## Configuration contract

Keep the controller generic and pass everything that varies between animations
through options. This is the seam that lets one implementation serve a plane, a
pin, a rocket, a train, etc.

```ts
interface PathMotionConfig {
  // WHERE the SVG and scroll live
  container: Element        // wrapper holding the inline SVG; scope for lookups
  scrollTrigger: Element    // element whose scroll drives progress (usually the section)

  // WHAT moves and along what (defaults resolve from the SVG; override to be explicit)
  resolveIcon?: (svg: SVGSVGElement) => SVGGraphicsElement[]   // default: filled shapes + siblings
  resolveTrajectory?: (svg: SVGSVGElement) => SVGPathElement   // default: longest stroked path
  resolveCaps?: (svg: SVGSVGElement) => SVGPathElement[]       // default: other stroked paths

  // HOW FAR along the path the element travels at scroll end, as a function of
  // viewport width. Either a constant or a calibration table (width -> ceiling
  // in [0,1]); interpolate linearly between points, clamp outside. Lets a narrow
  // viewport keep the element "further out" so it never collides with content.
  ceiling: number | ReadonlyArray<{ width: number; ceiling: number }>

  // ROTATION
  autoRotate?: boolean      // default false. A pin points at its place, not its heading — leave it off.
  rotationOffsetDeg?: number | ((iconPath: SVGPathElement, restPoint: Pt) => number)
                            // default: derive from artwork geometry (farthest contour point = "nose")

  // REVEAL
  strokeStyle?: 'solid' | 'dashed' | 'dotted'  // default: auto-detect from computed stroke-dasharray

  // RESPONSIVENESS
  minWidth?: number         // px below which the whole thing is hidden & unmounted (default e.g. 641)
  reducedMotionProgress?: number | 'ceiling'   // static t under prefers-reduced-motion (default 'ceiling')
}
```

The important properties and *why they exist*:

- **`ceiling`** is the single knob for "how much of the path is used" and it is
  width-dependent on purpose: on a narrow screen you often want the element to
  stay near its entry so it doesn't overlap text. Calibrate it geometrically (see
  `references/validation.md`), don't eyeball it.
- **`autoRotate`** is per-element, not global: directional objects (plane, arrow,
  rocket) rotate; place-markers (pin, dot) don't. Rotating a pin breaks its
  visual meaning.
- **`rotationOffsetDeg`** defaults to a value *derived from the artwork*, not from
  the icon's rest orientation. The rest orientation was never proven to align with
  the tangent, so using it as "zero" bakes in an error. The farthest point on the
  icon's own contour from its centroid is a reliable "nose".
- **`strokeStyle`** decides reveal technique. This is the difference between a
  dotted trail that stays dotted and one that turns into a solid bar.

## Minimal examples

### Without rotation — a pin receding along a trail

```ts
usePathMotion({
  container: pinWrapperEl,
  scrollTrigger: sectionEl,
  ceiling: [
    { width: 1440, ceiling: 0.42 },
    { width: 1024, ceiling: 0 },   // narrow: stay at entry, don't crowd the text
  ],
  // autoRotate omitted → false. A pin keeps pointing down at its location.
})
```

### With rotation — a plane flying a dotted flight path

```ts
usePathMotion({
  container: planeWrapperEl,
  scrollTrigger: sectionEl,
  ceiling: [
    { width: 1440, ceiling: 0.9 },
    { width: 900,  ceiling: 0.08 },
    { width: 700,  ceiling: 0 },
  ],
  autoRotate: true,          // plane turns into the curves...
  // rotationOffsetDeg defaults to the artwork-derived nose angle,
  // so "0°" means the nose is aligned with the tangent.
  // strokeStyle auto-detects 'dotted' → reveals via mask, dots preserved.
})
```

The `ceiling` numbers above are **illustrative, not universal** — they depend on
the specific artwork and layout. Derive them geometrically for your own path (see
`references/validation.md`); don't copy these values.

Full annotated implementations (React hook with `useGSAP`, and a vanilla
version) are in `references/architecture.md`.

## Pitfalls

These are the bugs this skill exists to prevent. Full explanations, math, and
fixes in `references/pitfalls.md`; the essentials:

1. **Rotation origin must equal the translation reference (`restPoint`).** If you
   translate the element's *center* onto the path but let GSAP rotate around the
   bbox *corner* (the SVG default is `0% 0%`), rotation shoves the element off the
   path by `[R(θ)−I]·(restPoint − origin)`, magnitude ≈ `2·R·sin(θ/2)`. It grows
   with angle, so the element visibly "detaches" and looks like it's turning
   before the curve. Fix: set the rotation origin to `restPoint` (GSAP
   `svgOrigin: "x y"`) **once, before the first transform**, so `smoothOrigin`
   doesn't freeze a compensating offset. This is the single most common failure.

2. **Preserve authored `stroke-dasharray` with a mask.** `DrawSVG` overwrites
   `stroke-dasharray` with its own visible/gap pair — which erases an authored
   dash/dot pattern, turning a dotted trail solid. For dashed/dotted paths, apply
   `DrawSVG` to a **solid copy** of the path inside a `<mask>` and mask the real
   path; the visible path's dasharray is never touched. Solid paths can use
   `DrawSVG` directly.

3. **Never let the trajectory show ahead of the element.** The revealed segment
   must end at *exactly* the element's current `t`. Because reveal direction
   depends on which raw end is the arrival point, compute it from the runtime
   direction detection — not from assuming `t=0` is the start. This guarantee
   covers the **main trajectory**; short end-caps are revealed by global progress
   and are exempt (fine for tiny remates — see `references/architecture.md` §6 if
   your caps are large or dashed).

4. **Position / reveal / tangent must share the one `t`.** (The core idea above.)
   Don't recompute progress three times.

5. **Clipping at the viewBox.** An inline `<svg>` clips to its viewBox
   (implicit `overflow: hidden`). If the moving icon leaves the viewBox, apply
   `overflow: visible` to the `<svg>` element specifically — keep the section's
   own `overflow` as the outer bound so nothing bleeds into neighbors.

6. **StrictMode / HMR duplication.** Runtime-created masks and wrappers can
   duplicate under React 18 StrictMode's double-invoke or a hot reload. Use stable
   ids (`useId`), namespace SVG class names (`cls-N` collides between two inlined
   SVGs on one page), and make cleanup fully idempotent so a second init starts clean.

7. **Don't wrap the high-frequency callback in `contextSafe`.** ScrollTrigger's
   `onUpdate` fires hundreds of times per second; re-registering the function each
   call can grow GSAP's context until the stack overflows. Cleanup is already
   guaranteed by killing the trigger and reverting matchMedia.

## Responsiveness, reduced motion, cleanup

- **Compute position from width at mount *and* on resize** — not resize-only.
  Most visitors load directly at a narrow width and fire no resize event; they
  must still see the correct frame on first paint. `ceiling` resolves against
  `window.innerWidth` inside `applyProgress`, and `ScrollTrigger.refresh` (auto-
  debounced on resize) re-reads it.
- **Below `minWidth`, don't mount the scroll logic at all** — hide via CSS and let
  `matchMedia` skip the branch. Cheaper and avoids animating invisible nodes.
- **Reduced motion**: no ScrollTrigger. Place the element statically at
  `reducedMotionProgress` (default the width's ceiling) with the trail revealed to
  that point, and recalc on resize. Motion-sensitive users get a correct still
  frame, not a frozen-mid-animation one.
- **Cleanup restores the DOM**: kill trigger, `mm.revert()`, remove the runtime
  mask/`<defs>`, unwrap the `<g>`. Verify the SVG file itself was never written —
  inline it from a raw import and manipulate the live DOM only.

## Validation

Do not trust "looks right" — this effect fails in sub-pixel ways that screenshots
at one scroll position hide. Validate both geometrically and visually. The recipes
(a Playwright probe that measures element-to-path distance across widths and
scroll positions, an overlap sweep, and a rotation-continuity check) are in
`references/validation.md`, with a ready-to-run script in
`scripts/probe_path_motion.py`.

Minimum bar before calling it done:

- Element sits on the path: nearest-point distance < 1px at every sampled width ×
  scroll position (not just the ends).
- Nothing revealed ahead of the element at any `t`.
- With rotation: heading is continuous (no jumps) across the full range; the
  rotation origin introduced no `xOffset`/`yOffset` (proof the element pivots in
  place).
- Hidden and unmounted below `minWidth`.
- Reduced motion: identical frame before and after a full scroll.
- Original SVG unchanged after cleanup.

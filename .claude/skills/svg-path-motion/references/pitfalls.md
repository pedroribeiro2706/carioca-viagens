# Pitfalls — the bugs this pattern hides, with fixes

Each of these was a real, hard-won failure. They're ordered by how often they
bite. The theme: this effect fails in *geometry*, not in *API usage* — the GSAP
calls all look correct while the result is visibly wrong.

## 1. Rotation origin must equal the translation reference

**Symptom.** The element looks like it starts turning *before* it reaches a
curve, and drifts off the line — worst at the sharpest turns, fine where the path
is straight.

**Cause.** You translate the element's *center* (`restPoint`) onto the path
point, but GSAP rotates around a *different* origin. For SVG, GSAP's default
origin is the element's bbox top-left corner (`0% 0%`), not its center. When
origin ≠ the point you translated, rotation moves the element by

```
displacement = [R(θ) − I] · (restPoint − origin)
|displacement| = 2 · |restPoint − origin| · sin(θ/2)
```

so the error is zero when θ=0 and grows with the turn angle. The path, the
revealed trail, and the tangent are all correct — it's the *drawing* of the
element that's displaced, which reads as "the line is ahead of me / I'm turning
early."

**Why it's easy to miss.** With no rotation (a pin), θ=0 always, so the bug is
invisible. It only appears once you enable `autoRotate`, which makes it look like
a rotation bug when it's really an origin bug.

**Fix.** Set the rotation origin to the same `restPoint` the translation uses,
**once, before the first transform is applied**:

```ts
if (autoRotate) gsap.set(wrapper, { svgOrigin: `${restPoint.x} ${restPoint.y}` })
```

- Use `svgOrigin` (absolute user-space coords) rather than `transformOrigin: "50% 50%"`
  when you want it provably identical to the translation reference — same variable,
  one source of truth. `"50% 50%"` also works *if* the wrapper's bbox center
  equals `restPoint`, but that's indirect.
- **Timing matters.** GSAP's `smoothOrigin` (on by default for SVG) compensates a
  *mid-animation* origin change by baking an `xOffset`/`yOffset` so the element
  doesn't jump. If you set the origin after rotation is already applied, it
  freezes the current (wrong) offset. Setting it while the matrix is still
  identity means the compensation is zero.
- **Proof it worked:** the element's nearest-point-to-path distance drops to
  sub-pixel at every angle, and the GSAP transform cache shows `xOffset === 0 &&
  yOffset === 0`.

## 2. Preserve authored `stroke-dasharray` — reveal through a mask

**Symptom.** A dotted or dashed trajectory turns into a solid line as it's
revealed.

**Cause.** `DrawSVGPlugin` implements the reveal by writing its own
`stroke-dasharray` (a single visible-segment / huge-gap pair) plus a
`stroke-dashoffset`. If the path already had an authored dash pattern (e.g.
`stroke-dasharray: 7.02 7.02` for dots), DrawSVG *overwrites* it, so the dots
vanish and you get a solid stroke.

**Fix.** Don't animate DrawSVG on the visible path. Put a **solid copy** of the
path inside a `<mask>`, mask the real path with it, and animate DrawSVG on the
copy. The mask reveals the real path progressively while the real path keeps its
own dasharray untouched. Full `createTrajectoryMask` in `architecture.md` §5.

**When you don't need it.** A solid trajectory has no authored dasharray to
protect — animate DrawSVG on it directly and skip the mask.

## 3. Never let the trajectory appear ahead of the element

**Symptom.** A sliver of the path is visible in front of the element, breaking the
"leaving a trail" illusion.

**Cause.** The revealed segment's end doesn't coincide with the element's current
position, usually because the reveal was computed in the wrong direction. Which
raw end (`t=0` or `t=1`) is the "start" of the reveal depends on which end the
element arrives at.

**Fix.** Compute reveal direction from the same runtime direction detection used
for position (`detectArrivalAtRawStart`), and build the DrawSVG segment with
`segmentFor(arrivalAtRawStart, rawT)` (architecture §5). Both the element and the
reveal endpoint then move from the same `rawT`, so the trail always ends exactly
under the element.

## 4. One `t`, not three progress values

**Symptom.** Small, position-dependent mismatches between where the element is,
where the trail ends, and where it's pointing — none individually large, but the
effect feels "loose."

**Cause.** Position, reveal, and tangent were each computed from a separately
derived progress number. With a direction inversion (`1 - clamped`), a
width-dependent `ceiling` multiplier, or an eased remap in the mix, those numbers
can be *numerically close but geometrically different points*.

**Fix.** Compute `iconRawT` once in `applyProgress` and pass that exact value into
position, reveal, and tangent. If you later add easing, ease the single input
before deriving `iconRawT` — never ease one consumer and not the others.

## 5. Clipping at the viewBox

**Symptom.** The moving element gets cut off at the edge of its SVG box at the
extremes of travel.

**Cause.** An inline `<svg>` clips its contents to the viewBox (implicit
`overflow: hidden`). When the element (now transform-translated) extends past the
viewBox, it's clipped.

**Fix.** Apply `overflow: visible` to the `<svg>` element specifically (e.g. a
scoped `[&>svg]:overflow-visible` utility, or an inline style). Keep the *outer*
container's `overflow` (the section) as the real bound so the element doesn't
bleed into neighboring sections. Confirm the viewBox is actually the clip source
before changing anything — measure the icon bbox against the viewBox rather than
assuming.

## 6. StrictMode / HMR duplication

**Symptom.** Two masks, two wrappers, or doubled transforms after a hot reload or
in React 18 dev (StrictMode double-invokes effects).

**Cause.** The controller creates DOM (mask, `<defs>`, `<g>`) on init. A second
init without a clean teardown stacks a second copy.

**Fix.**
- Stable ids: derive the mask id from `useId()` (React) or another stable token,
  not a random per-call value.
- **Namespace SVG class names.** Two inlined SVGs on one page will both contain
  `cls-1`, `cls-2`… from their `<style>` blocks; those collide. Rewrite `cls-N` →
  `${prefix}-cls-N` in the raw string (both in the `<style>` and the `class`
  attributes) before inlining. Operate on the in-memory string, never the file.
- Make cleanup fully idempotent (remove-if-present), so a re-init starts from a
  clean DOM.

## 7. `contextSafe` in the scroll callback overflows the stack

**Symptom.** After a bit of scrolling, a stack overflow originating in GSAP's
context bookkeeping.

**Cause.** Wrapping the `onUpdate` handler in `contextSafe` re-registers the
function into the GSAP context on *every* call. `onUpdate` fires hundreds of times
per second during scroll, so the context grows unbounded.

**Fix.** Call `applyProgress` directly in `onUpdate`. `contextSafe` is for rare
handlers (clicks); high-frequency scroll callbacks don't need it, and cleanup is
already handled by killing the trigger and reverting matchMedia.

## 8. Don't feed rotation from the icon's rest orientation

**Symptom.** With `autoRotate` on, the element is consistently rotated by a fixed
wrong angle (e.g. always ~30° off) even where the path is straight.

**Cause.** The rotation offset was taken to be "whatever the icon looks like at
rest = 0°." But the artwork's rest orientation was never proven to align with the
path tangent, so it bakes in a constant error.

**Fix.** Derive the offset from the artwork's own geometry: the farthest point on
the icon's contour from its centroid is the "nose" (`computeNoseAngleDeg`,
architecture §4). `rotationOffsetDeg = -noseAngle` makes "0°" mean *nose aligned
with the tangent*, independent of how the icon happened to be drawn.

## 9. Choosing `getPointAtLength` over MotionPathPlugin (and when NOT to)

`MotionPathPlugin` is a valid, first-class tool for moving an element along a
path, and it does tangent rotation for you (`autoRotate`) and accepts fractional
`start`/`end`. If all you need is "move this element along this path on scroll,
rotating into the turns," MotionPathPlugin is often the simpler choice — reach
for it and read `gsap/references/gsap-plugins.md`.

This skill uses manual `getPointAtLength(t·len)` + a manual translate
(`target − restPoint`) instead, for two concrete reasons — not because
MotionPathPlugin is broken:

1. **One `t` must drive three things.** Position, the reveal endpoint, and the
   tangent all have to read the *same* fractional parameter (the core idea of
   this skill). Computing position with MotionPath and the reveal/tangent
   separately reintroduces the sync problem (Pitfall 4). Driving everything from
   one `getPointAtLength` call keeps them provably in step.
2. **A specific `align` gotcha we hit.** When the moving target is a `<g>`
   wrapper created at runtime and you use MotionPath's `align` to a path while
   also setting fractional `start`/`end`, the alignment didn't resolve to the
   expected transform in our setup (align keys off the path's raw geometry, which
   interacted badly with the runtime wrapper). This is a narrow interaction, not
   a general MotionPath failure — if you hit it, aligning to the real path
   element (not a runtime wrapper) or positioning manually both avoid it.

So: prefer MotionPathPlugin for a plain path-follow; use the manual approach here
because the synchronized reveal is the whole point.

## 10. `getBBox()` returns an empty rect while the element is `display:none`

**Symptom.** On a viewport that starts *below* `minWidth` (where the container is
hidden) and is then widened past the breakpoint, the element is mispositioned or
rotates around the wrong point — even though everything works when the page loads
wide.

**Cause.** `restPoint` (and the nose angle, and the combined bbox) come from
`getBBox()`, which returns a zero rect for an element inside a `display:none`
subtree. If you measure those at mount while the container is still hidden, you
cache garbage geometry that never gets corrected when the breakpoint is crossed.

**Fix.** Defer the bbox-dependent measurements (`restPoint`, nose angle, the
runtime `<g>` wrap that depends on them) to the first time the element becomes
visible — i.e. compute them inside the `matchMedia` `isVisible` branch, not at
mount — or re-measure on the transition into visibility. This keeps a
narrow→wide resize correct without needing a full remount, and it preserves the
single-`t` design. (Surfaced during skill evals: a run that measured at mount
produced an empty bbox below the breakpoint.)

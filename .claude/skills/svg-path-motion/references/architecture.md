# Architecture — the reusable path-motion controller

This is the full shape of the controller referenced from `SKILL.md`. It is
framework-agnostic in structure; a React `useGSAP` version and a vanilla version
are both shown. Adapt names to your codebase — the *structure* and the *order of
operations* are what matter, not the exact identifiers.

## Table of contents

1. Element resolution
2. Wrapping the icon
3. Rest point + direction detection
4. Rotation offset from artwork
5. Reveal setup (solid vs dashed/dotted)
6. `applyProgress(t)` — the single source of truth
7. Width → ceiling mapping
8. matchMedia: breakpoint + reduced motion + ScrollTrigger
9. Cleanup
10. React (`useGSAP`) wrapper
11. Vanilla wrapper

---

## 1. Element resolution

Resolve the moving icon, the trajectory, and the caps from the *live* inline SVG.
Never transcribe the path `d` by hand — that has silently dropped authored
`stroke-dasharray` and swapped in a generic shape before. Inline the SVG from a
raw import (`?raw` in Vite, `raw-loader`, etc.) and read the DOM.

```ts
const SVG_NS = "http://www.w3.org/2000/svg"

function isStrokeOnly(el: SVGGraphicsElement) {
  return getComputedStyle(el).fill === "none"
}

interface Resolved {
  svgEl: SVGSVGElement
  iconParts: SVGGraphicsElement[]   // filled shapes + filled sibling decorations
  trajectoryEl: SVGPathElement      // longest stroked path
  capEls: SVGPathElement[]          // remaining stroked paths (end flourishes)
}

function resolveElements(root: Element): Resolved | null {
  const svgEl = root.querySelector("svg")
  if (!svgEl) return null

  const paths = Array.from(svgEl.querySelectorAll("path"))
  const strokePaths = paths.filter(isStrokeOnly)
  const filledPaths = paths.filter((p) => !isStrokeOnly(p))
  if (filledPaths.length === 0 || strokePaths.length === 0) return null

  const trajectoryEl = strokePaths.reduce((longest, cand) =>
    cand.getTotalLength() > longest.getTotalLength() ? cand : longest
  )
  if (trajectoryEl.getTotalLength() === 0) return null
  const capEls = strokePaths.filter((p) => p !== trajectoryEl)

  // Filled siblings that aren't <path> (e.g. a <circle> dot inside a pin) don't
  // show up in `paths` but must travel with the icon body.
  const parent = filledPaths[0].parentElement
  const siblingShapes = parent
    ? (Array.from(parent.querySelectorAll(":scope > circle, :scope > ellipse, :scope > rect, :scope > polygon")) as SVGGraphicsElement[])
    : []

  return { svgEl, iconParts: [...filledPaths, ...siblingShapes], trajectoryEl, capEls }
}
```

The "longest stroked path is the trajectory" heuristic is robust for route
artwork (the trail dwarfs the end caps). If your SVG doesn't fit it, pass explicit
`resolveIcon` / `resolveTrajectory` selectors via the config contract instead.

## 2. Wrapping the icon

The transform target is a runtime `<g>` grouping all icon parts, so decorations
move as a unit. Keep an `unwrap` closure for cleanup.

**Precondition — shared coordinate context.** The parts should live under one
common, untransformed-relative-to-each-other parent (the usual case: siblings
inside one `<g>`). The wrapper is inserted at the first part's parent; moving a
part *out of a differently-transformed ancestor* into the wrapper changes its
rendered position, because it loses that ancestor's transform. If your icon's
pieces are scattered under different transformed groups, don't wrap them
individually — wrap at their common ancestor, or flatten the artwork first. Guard
this in `resolveElements` (e.g. require the filled parts to share a parent)
rather than discovering it as a visual glitch.

Record each part's original slot up front so `unwrap` restores the exact DOM —
not all parts collapsed next to the first one — even if they weren't a single
contiguous run:

```ts
function wrapIconParts(iconParts: SVGGraphicsElement[]) {
  const origins = iconParts.map((el) => ({
    el, parent: el.parentNode as Node, next: el.nextSibling,
  }))
  const anchor = iconParts[0]
  const wrapper = document.createElementNS(SVG_NS, "g")
  ;(anchor.parentNode as Node).insertBefore(wrapper, anchor)
  iconParts.forEach((el) => wrapper.appendChild(el))

  const unwrap = () => {
    // Restore in reverse so each recorded `next` sibling is already back in
    // place before we insert before it (a forward pass would try to insert
    // before a node still sitting in the wrapper).
    for (let i = origins.length - 1; i >= 0; i--) {
      const { el, parent, next } = origins[i]
      parent.insertBefore(el, next)
    }
    wrapper.remove()
  }
  return { wrapper, unwrap }
}
```

## 3. Rest point + direction detection

`restPoint` = combined bbox center of the icon parts, measured **before** any
transform. It is both the translation reference and the rotation origin.

> Measure it while the element is **visible**. `getBBox()` returns a zero rect
> inside a `display:none` subtree, so if the container starts hidden below
> `minWidth`, measuring at mount caches garbage. Defer this measurement (and the
> nose angle, and the `<g>` wrap) into the `matchMedia` `isVisible` branch of §8,
> or re-measure on the transition into visibility. See Pitfall 10.

```ts
const box = iconParts.reduce((acc, el) => {
  const b = el.getBBox()
  return {
    minX: Math.min(acc.minX, b.x),         minY: Math.min(acc.minY, b.y),
    maxX: Math.max(acc.maxX, b.x + b.width), maxY: Math.max(acc.maxY, b.y + b.height),
  }
}, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity })
const restPoint = { x: (box.minX + box.maxX) / 2, y: (box.minY + box.maxY) / 2 }
```

Direction: which raw end of the path is the "arrival" (where the element rests)?
Detect it from geometry, at runtime.

```ts
function detectArrivalAtRawStart(path: SVGPathElement, restPoint: Pt): boolean {
  const total = path.getTotalLength()
  const start = path.getPointAtLength(0)
  const end = path.getPointAtLength(total)
  const dStart = Math.hypot(start.x - restPoint.x, start.y - restPoint.y)
  const dEnd = Math.hypot(end.x - restPoint.x, end.y - restPoint.y)
  return dStart < dEnd
}
```

This assumes the element **rests near one distinct end** of the path — the design
premise of the effect. It is ambiguous for a **closed loop** (`start ≈ end`) or a
path whose two ends are roughly equidistant from `restPoint` (a symmetric path, or
an element that rests mid-path). If your case is like that, don't rely on the
heuristic — pass the travel direction explicitly through the config.

## 4. Rotation offset from artwork

"Rotation zero" should mean *the nose is aligned with the tangent*. Derive the
nose direction from the artwork itself — the farthest contour point from the
centroid — not from the icon's rest orientation (never proven aligned).

```ts
const NOSE_SAMPLES = 200
function computeNoseAngleDeg(iconPath: SVGPathElement, centroid: Pt): number {
  const total = iconPath.getTotalLength()
  let farthest = centroid, maxDist = -1
  for (let i = 0; i <= NOSE_SAMPLES; i++) {
    const p = iconPath.getPointAtLength((i / NOSE_SAMPLES) * total)
    const d = Math.hypot(p.x - centroid.x, p.y - centroid.y)
    if (d > maxDist) { maxDist = d; farthest = p }
  }
  return (Math.atan2(farthest.y - centroid.y, farthest.x - centroid.x) * 180) / Math.PI
}
// rotationOffsetDeg = -computeNoseAngleDeg(iconPath, restPoint)  // only when autoRotate
```

Tangent at a given raw `t`, in the true travel direction:

```ts
const EPS = 0.01
function computeTangentDeg(rawT: number): number {
  const dir = trajectoryArrivalAtRawStart ? -1 : 1
  let a = rawT
  let b = clamp(0, 1, rawT + dir * EPS)
  if (b === a) { a = clamp(0, 1, rawT - dir * EPS); b = rawT }  // at an endpoint, sample backward
  const p1 = trajectoryEl.getPointAtLength(a * len)
  const p2 = trajectoryEl.getPointAtLength(b * len)
  return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI
}
```

Note EPS is a **forward** difference: it biases the heading slightly toward the
upcoming point. That is usually fine and even desirable (the object anticipates
the turn a little). If a reviewer reports the object rotating *too* early, switch
to a **centered** difference (`t ± EPS/2`) — but change it deliberately and in
isolation, and re-check continuity. Don't touch it pre-emptively.

## 5. Reveal setup (solid vs dashed/dotted)

Detect the style from the computed `stroke-dasharray`. `"none"` → solid.

- **Solid**: `DrawSVG` directly on the trajectory path.
- **Dashed / dotted**: build a `<mask>` containing a *solid* copy of the path and
  mask the real path with it; animate `DrawSVG` on the **mask** copy. The visible
  path's authored dasharray is never rewritten.

```ts
function createTrajectoryMask(svgEl: SVGSVGElement, trajectoryEl: SVGPathElement, maskId: string) {
  let defs = svgEl.querySelector("defs")
  const createdDefs = !defs
  if (!defs) { defs = document.createElementNS(SVG_NS, "defs"); svgEl.insertBefore(defs, svgEl.firstChild) }

  const strokeWidth = parseFloat(getComputedStyle(trajectoryEl).strokeWidth) || 2
  const mask = document.createElementNS(SVG_NS, "mask")
  mask.setAttribute("id", maskId)
  mask.setAttribute("maskUnits", "userSpaceOnUse")

  const maskPath = document.createElementNS(SVG_NS, "path") as SVGPathElement
  maskPath.setAttribute("d", trajectoryEl.getAttribute("d") ?? "")
  maskPath.setAttribute("fill", "none")
  maskPath.setAttribute("stroke", "#fff")
  maskPath.setAttribute("stroke-width", String(strokeWidth + 2))   // slightly fatter so it fully covers
  maskPath.setAttribute("stroke-linecap", "round")
  maskPath.setAttribute("stroke-linejoin", "round")
  mask.appendChild(maskPath)
  defs.appendChild(mask)
  // Preserve any authored mask on the trajectory — restore it on cleanup rather
  // than blindly removing, so the SVG really ends byte-identical.
  const priorMask = trajectoryEl.getAttribute("mask")   // usually null
  trajectoryEl.setAttribute("mask", `url(#${maskId})`)

  const cleanup = () => {
    if (priorMask === null) trajectoryEl.removeAttribute("mask")
    else trajectoryEl.setAttribute("mask", priorMask)
    mask.remove()
    if (createdDefs) defs!.remove()
  }
  return { maskPath, cleanup }
}
```

Pick the reveal target once, per `strokeStyle`, and hand it to `applyProgress`
(§6): a solid path needs no mask, so DrawSVG animates it directly.

```ts
// dashed/dotted: a mask copy protects the authored dasharray; solid: the path
// itself. Capture BOTH the reveal target and the cleanup closure — discarding
// the cleanup (as `createTrajectoryMask(...).maskPath` alone would) leaks the
// mask/<defs>; §9 calls cleanupMask?.().
let revealTarget: SVGPathElement
let cleanupMask: (() => void) | undefined
if (strokeStyle === "solid") {
  revealTarget = trajectoryEl
} else {
  const built = createTrajectoryMask(svgEl, trajectoryEl, maskId)
  revealTarget = built.maskPath
  cleanupMask = built.cleanup
}
```

The DrawSVG segment string that reveals from the origin up to `rawT`, in the
correct direction:

```ts
function segmentFor(arrivalAtRawStart: boolean, rawT: number): string {
  return arrivalAtRawStart ? `${rawT * 100}% 100%` : `0% ${rawT * 100}%`
}
```

## 6. `applyProgress(t)` — the single source of truth

One function. Given an effective progress in `[0,1]`, it derives the raw path
parameter and drives position, rotation, and every reveal from it.

```ts
function applyProgress(effectiveProgress: number) {
  const clamped = clamp(0, 1, effectiveProgress)
  const iconRawT = trajectoryArrivalAtRawStart ? 1 - clamped : clamped

  // POSITION — translate restPoint onto the path point. Manual getPointAtLength
  // (rather than MotionPathPlugin) so this exact iconRawT also drives the reveal
  // and tangent from one source; see Pitfall 9 for the tradeoff. MotionPathPlugin
  // is a fine choice when you don't need that synchronized reveal.
  const target = trajectoryEl.getPointAtLength(iconRawT * len)
  gsap.set(wrapper, {
    x: target.x - restPoint.x,
    y: target.y - restPoint.y,
    ...(autoRotate ? { rotation: computeTangentDeg(iconRawT) + rotationOffsetDeg } : {}),
  })

  // REVEAL — same iconRawT. `revealTarget` is the mask copy for a dashed/dotted
  // path (§5), OR the trajectory path itself for a solid one (no mask needed —
  // DrawSVG rewriting a solid path's dasharray is harmless). Same code either
  // way; only what it points at changes, per config `strokeStyle`.
  gsap.set(revealTarget, { drawSVG: segmentFor(trajectoryArrivalAtRawStart, iconRawT) })
  capEls.forEach((cap, i) => {
    const arr = capArrivalAtRawStart[i]
    const capRawT = arr ? 1 - clamped : clamped
    gsap.set(cap, { drawSVG: segmentFor(arr, capRawT) })
  })
}
```

**Scope of the "nothing ahead" guarantee.** It holds for the **main trajectory**,
whose reveal endpoint is tied to `iconRawT`. The **caps** are revealed by the
*global* `clamped` progress, not by whether the element has physically reached
each cap — so the cap at the far (arrival) end can show a sliver before the
element gets there. This is deliberate and fine for tiny end-flourishes (a few
units), which is what caps are for. If your "caps" are large, or carry an authored
dash/dot pattern, this breaks down twice: they may read as trajectory shown ahead,
and `gsap.set(cap, { drawSVG })` here rewrites their `stroke-dasharray` directly
(no mask), erasing an authored pattern. In that case treat them as trajectories
instead — give each its own `iconRawT`-tied reveal and, if dashed, its own mask
(§5) — or make cap handling a config policy. For plain remates, leave it as is.

The rotation origin is what makes the position line up under rotation — set it
once at setup, see step 10/11 and Pitfall 1.

## 7. Width → ceiling mapping

`ceiling` may be a constant or a table. Interpolate linearly between points
(ordered widest → narrowest), clamp outside the range.

```ts
function computeCeiling(width: number, points: ReadonlyArray<{width:number; ceiling:number}>): number {
  const widest = points[0], narrowest = points[points.length - 1]
  const w = clamp(narrowest.width, widest.width, width)
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i], b = points[i + 1]
    if (w <= a.width && w >= b.width) return mapRange(b.width, a.width, b.ceiling, a.ceiling, w)
  }
  return narrowest.ceiling
}
const getCeiling = () => computeCeiling(window.innerWidth, ceilingPoints)
```

`gsap.utils.clamp` and `gsap.utils.mapRange` do the clamping/interpolation.

## 8. matchMedia: breakpoint + reduced motion + ScrollTrigger

```ts
const mm = gsap.matchMedia()
mm.add(
  { isVisible: `(min-width: ${minWidth}px)`, reduceMotion: "(prefers-reduced-motion: reduce)" },
  (ctx) => {
    const { isVisible, reduceMotion } = ctx.conditions as { isVisible: boolean; reduceMotion: boolean }
    if (!isVisible) return

    // The element is visible now → getBBox() is valid. Do the bbox-dependent prep
    // HERE, not at mount: wrapIconParts (§2), measure restPoint + nose angle (§3–4),
    // and, if autoRotate, set svgOrigin at restPoint (§1). Doing it at mount caches a
    // zero bbox while the element is display:none below the breakpoint (Pitfall 10).
    // Direction-agnostic setup with no getBBox (resolveElements, the reveal target /
    // mask from §5) can happen either at mount or here.

    if (reduceMotion) {
      applyProgress(getCeiling())
      gsap.set(root, { opacity: 1 })
      let id: ReturnType<typeof setTimeout>
      const onResize = () => { clearTimeout(id); id = setTimeout(() => applyProgress(getCeiling()), 150) }
      window.addEventListener("resize", onResize)
      return () => { window.removeEventListener("resize", onResize); clearTimeout(id) }
    }

    const trigger = ScrollTrigger.create({
      trigger: scrollTriggerEl,
      start: "top bottom", end: "bottom top", scrub: true,
      onUpdate: (self) => applyProgress(self.progress * getCeiling()),
      onRefresh: (self) => applyProgress(self.progress * getCeiling()),  // resize path: recompute, don't re-tween
    })

    applyProgress(trigger.progress * getCeiling())   // sync once, synchronously...
    gsap.set(root, { opacity: 1 })                   // ...then reveal (no flash of full path / wrong position)

    return () => { trigger.kill() }
  },
  container   // scope
)
```

Start the container at `opacity: 0` in markup; the controller reveals it only
after the first correct frame is applied.

## 9. Cleanup

```ts
return () => {
  mm.revert()
  gsap.killTweensOf([wrapper, revealTarget, ...capEls])
  cleanupMask?.()   // only exists for the dashed/dotted branch; solid created no mask
  unwrap()
}
```

After this runs, the inline SVG is back to exactly what was imported: no mask, no
`<defs>` you created, no `<g>` wrapper, no leftover transforms. (For a solid path
there was never a mask to remove — `revealTarget` was the path itself, and DrawSVG
tweens on it are killed above.)

## 10. React (`useGSAP`) wrapper

```ts
export function usePathMotion(opts: PathMotionOptions) {
  const maskIdBase = useId().replace(/[^a-zA-Z0-9_-]/g, "")
  useGSAP(() => {
    const root = opts.containerRef.current
    const sectionEl = opts.sectionRef.current
    if (!root || !sectionEl) return
    const resolved = resolveElements(root)   // structural only — no getBBox
    if (!resolved) { console.error("[usePathMotion] unexpected SVG structure", root); return }
    // Mount-safe setup (no getBBox): choose the reveal target / build the mask (§5),
    // using `route-motion-mask-${maskIdBase}` as the id.
    // Then matchMedia (§8). All getBBox-dependent work — wrapIconParts, restPoint,
    // nose angle, and `gsap.set(wrapper, { svgOrigin: ... })` — happens INSIDE the
    // isVisible branch (see §8), because getBBox returns a zero rect while the
    // element is display:none below the breakpoint (Pitfall 10). Return cleanup (§9).
  }, { scope: opts.containerRef })
}
```

`useGSAP` handles the effect lifecycle and calls the returned cleanup on unmount.
`useId` gives a stable, collision-free mask id across StrictMode re-invocation.

## 11. Vanilla wrapper

```ts
export function initPathMotion(opts: PathMotionOptions): () => void {
  const root = opts.container
  const resolved = resolveElements(root)
  if (!resolved) return () => {}
  const ctx = gsap.context(() => {
    // steps 2–8 identical; the bbox-dependent prep (wrap, restPoint, nose, svgOrigin)
    // goes inside the matchMedia isVisible branch, not here (§8 / Pitfall 10).
  }, root)
  return () => ctx.revert()   // plus the manual unwrap/mask cleanup from step 9
}
```

Call the returned disposer on teardown (route change, component destroy). `gsap.context`'s
`revert()` is the vanilla equivalent of `useGSAP`'s automatic cleanup.

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useId } from "react"
import type { RefObject } from "react"

gsap.registerPlugin(useGSAP, DrawSVGPlugin, ScrollTrigger)

/**
 * Especificação: design/design.md Seções 9 e 19. Pin (Sobre) e avião
 * (Atendimento) avançam pela própria trajetória tracejada do SVG conforme o
 * usuário rola a seção, até um teto máximo definido pela largura da
 * viewport — não mais um reposicionamento estático por breakpoint (1ª
 * iteração, rejeitada: ver HANDOFF.md Seção 14 e
 * C:\Users\Pedro\.claude\plans\declarative-leaping-catmull.md).
 */

const SVG_NS = "http://www.w3.org/2000/svg"

/** Largura mínima (px) em que esta lógica roda — abaixo disso o elemento já fica oculto via CSS (tablet:block). */
const RECEDE_WIDTH = 641
const REDUCED_MOTION_RESIZE_DEBOUNCE_MS = 150

/**
 * Um ponto de calibração (largura -> teto de progresso 0–1 alcançável ao
 * longo do path). `ceiling` é o valor de `effectiveProgress` atingido quando
 * o scroll da seção chega a 100% nessa largura — não mais uma posição de
 * repouso fixa (ver HANDOFF.md Seção 14, plano revisado). A lista deve estar
 * ordenada por `width` decrescente (mais larga primeiro). Entre pontos
 * consecutivos a interpolação é linear; fora da faixa, o valor do ponto mais
 * próximo é usado (clamp).
 */
export interface CalibrationPoint {
  width: number
  ceiling: number
}

function computeCeiling(width: number, points: readonly CalibrationPoint[]): number {
  const widest = points[0]
  const narrowest = points[points.length - 1]
  const clampedWidth = gsap.utils.clamp(narrowest.width, widest.width, width)

  for (let i = 0; i < points.length - 1; i++) {
    const wide = points[i]
    const narrow = points[i + 1]
    if (clampedWidth <= wide.width && clampedWidth >= narrow.width) {
      return gsap.utils.mapRange(narrow.width, wide.width, narrow.ceiling, wide.ceiling, clampedWidth)
    }
  }
  return narrowest.ceiling
}

/** Renomeia `cls-N` -> `${prefix}-cls-N` de forma determinística, tanto no `<style>` quanto nos atributos `class`. Evita colisão quando duas SVGs com os mesmos nomes de classe são inlinadas na mesma página. Não modifica o arquivo original — opera só na string em memória. */
export function namespaceSvgClasses(svg: string, prefix: string): string {
  return svg.replace(/\bcls-(\d+)\b/g, `${prefix}-cls-$1`)
}

interface UseRouteMotionOptions {
  /** Ref do container (wrapper da SVG inlinada) que delimita as buscas do GSAP. */
  containerRef: RefObject<HTMLDivElement | null>
  /** Ref da `<section>` inteira — trigger do ScrollTrigger (a posição do ícone é função do scroll pela seção, não só da largura). */
  sectionRef: RefObject<HTMLElement | null>
  /** Pontos de calibração largura -> teto, específicos de cada elemento (ver Sobre/AtendimentoCards). */
  calibration: readonly CalibrationPoint[]
  /**
   * Gira o wrapper do ícone para acompanhar a tangente do path conforme ele
   * avança — só faz sentido para elementos com uma "frente" direcional (ex.
   * o avião). Default `false`: um pin de mapa aponta convencionalmente para
   * baixo/para o local marcado, não para a direção de deslocamento — girá-lo
   * quebraria essa leitura visual, então o pin mantém o comportamento atual
   * (sem rotação).
   */
  autoRotate?: boolean
}

function isStrokeOnly(el: SVGGraphicsElement) {
  return getComputedStyle(el).fill === "none"
}

interface ResolvedElements {
  svgEl: SVGSVGElement
  /** Ícone: o(s) path(s)/forma(s) preenchida(s) que representam o pin/avião — pode incluir decorações irmãs preenchidas (ex. o ponto interno do pin), que precisam se mover junto com o corpo do ícone. */
  iconParts: SVGGraphicsElement[]
  /** Path de traço mais longo — a trajetória tracejada principal. */
  trajectoryEl: SVGPathElement
  /** Os dois remates curtos nas pontas da trajetória (não fazem parte do deslocamento do ícone, mas precisam da mesma lógica de revelação). */
  capEls: SVGPathElement[]
}

/**
 * Localiza o(s) path(s) do ícone (preenchidos), o path da trajetória
 * tracejada (o path de traço com maior comprimento total) e os remates
 * (os demais paths de traço). Retorna null se a estrutura esperada não for
 * encontrada — quem chama deve tratar isso como falha controlada, sem
 * prosseguir com alvo ambíguo.
 */
function resolveElements(root: HTMLDivElement): ResolvedElements | null {
  const svgEl = root.querySelector("svg")
  if (!svgEl) return null

  const paths = Array.from(svgEl.querySelectorAll("path"))
  const strokePaths = paths.filter(isStrokeOnly)
  const filledPaths = paths.filter((p) => !isStrokeOnly(p))
  if (filledPaths.length === 0 || strokePaths.length === 0) return null

  const trajectoryEl = strokePaths.reduce((longest, candidate) =>
    candidate.getTotalLength() > longest.getTotalLength() ? candidate : longest
  )
  if (trajectoryEl.getTotalLength() === 0) return null
  const capEls = strokePaths.filter((p) => p !== trajectoryEl)

  // Formas preenchidas irmãs do primeiro path do ícone (ex.: o <circle> do
  // ponto interno do pin) não são <path>, então não aparecem em `paths`
  // acima, mas precisam se mover junto com o corpo do ícone.
  const parent = filledPaths[0].parentElement
  const siblingShapes = parent
    ? (Array.from(parent.querySelectorAll(":scope > circle, :scope > ellipse, :scope > rect, :scope > polygon")) as SVGGraphicsElement[])
    : []

  return { svgEl, iconParts: [...filledPaths, ...siblingShapes], trajectoryEl, capEls }
}

/**
 * Agrupa as partes do ícone num `<g>` criado em runtime, que se torna o
 * único alvo do transform do MotionPath — sem isso, decorações irmãs (ex.
 * o ponto interno do pin, que é um `<circle>` irmão do path do corpo, não
 * um filho dele) ficariam para trás quando só o path principal se move.
 * Retorna o wrapper e uma função que desfaz o agrupamento, restaurando o
 * DOM original (necessário para cleanup correto/idempotente).
 */
function wrapIconParts(iconParts: SVGGraphicsElement[]): { wrapper: SVGGElement; unwrap: () => void } {
  const anchor = iconParts[0]
  const parent = anchor.parentNode as Node
  const nextSibling = anchor.nextSibling
  const wrapper = document.createElementNS(SVG_NS, "g")
  parent.insertBefore(wrapper, anchor)
  iconParts.forEach((el) => wrapper.appendChild(el))

  const unwrap = () => {
    iconParts.forEach((el) => parent.insertBefore(el, nextSibling))
    wrapper.remove()
  }

  return { wrapper, unwrap }
}

/**
 * Determina, para um path de traço, se a ponta "de chegada" (mais perto do
 * ícone em repouso, sem transform) corresponde ao início bruto (t=0%) ou ao
 * fim bruto (t=100%) da parametrização nativa do SVG. Detectado em runtime
 * via `getPointAtLength` — nunca assumido por leitura manual do atributo
 * `d` (essa suposição manual já ficou invertida uma vez, ver plano).
 */
function detectArrivalAtRawStart(path: SVGPathElement, restPoint: { x: number; y: number }): boolean {
  const total = path.getTotalLength()
  const start = path.getPointAtLength(0)
  const end = path.getPointAtLength(total)
  const distStart = Math.hypot(start.x - restPoint.x, start.y - restPoint.y)
  const distEnd = Math.hypot(end.x - restPoint.x, end.y - restPoint.y)
  return distStart < distEnd
}

const NOSE_SAMPLE_COUNT = 200

/**
 * Ângulo (graus, convenção `atan2` no espaço local do SVG, y para baixo) do
 * eixo "de repouso -> ponta" do ícone, medido geometricamente a partir do
 * próprio artwork — não a partir da tangente do path em nenhum ponto
 * específico. Amostra pontos ao longo do contorno do path do ícone
 * (`getPointAtLength`, funciona em qualquer path independente de fill) e usa
 * o ponto mais distante do centróide como a "ponta" (bico) — validado
 * visualmente nesta sessão (o ponto encontrado cai exatamente na ponta do
 * avião, não numa asa). Deliberadamente não usa a orientação atual em
 * repouso como referência de "rotação zero": essa orientação nunca foi
 * validada como alinhada à tangente, então usá-la preservaria um erro.
 */
function computeNoseAngleDeg(iconPath: SVGPathElement, centroid: { x: number; y: number }): number {
  const total = iconPath.getTotalLength()
  let farthest = centroid
  let maxDist = -1
  for (let i = 0; i <= NOSE_SAMPLE_COUNT; i++) {
    const point = iconPath.getPointAtLength((i / NOSE_SAMPLE_COUNT) * total)
    const dist = Math.hypot(point.x - centroid.x, point.y - centroid.y)
    if (dist > maxDist) {
      maxDist = dist
      farthest = point
    }
  }
  return (Math.atan2(farthest.y - centroid.y, farthest.x - centroid.x) * 180) / Math.PI
}

/**
 * Cria uma `<mask>` com uma cópia sólida (sem dasharray) do path tracejado
 * principal, aplicada de volta ao path original via atributo `mask`. Isso
 * permite revelar progressivamente o traço via DrawSVGPlugin sem jamais
 * tocar no `stroke-dasharray` autoral do path visível.
 *
 * Validado empiricamente antes de integrar (spike isolado): aplicar
 * `drawSVG` direto num path com `stroke-dasharray: 7.02 7.02` autoral faz o
 * GSAP sobrescrever o dasharray por um par segmento-visível/gap
 * (ex. "290.622px, 436.034px"), o que apaga os tracinhos finos do desenho e
 * produz um traço sólido — não corresponde às imagens de referência. Usar
 * uma máscara com uma cópia solida evita esse problema: o path visível
 * nunca tem seu dasharray alterado, só a máscara por cima dele muda.
 */
function createTrajectoryMask(
  svgEl: SVGSVGElement,
  trajectoryEl: SVGPathElement,
  maskId: string
): { maskPath: SVGPathElement; cleanup: () => void } {
  let defs = svgEl.querySelector("defs")
  const createdDefs = !defs
  if (!defs) {
    defs = document.createElementNS(SVG_NS, "defs")
    svgEl.insertBefore(defs, svgEl.firstChild)
  }

  const strokeWidth = parseFloat(getComputedStyle(trajectoryEl).strokeWidth) || 2

  const mask = document.createElementNS(SVG_NS, "mask")
  mask.setAttribute("id", maskId)
  mask.setAttribute("maskUnits", "userSpaceOnUse")

  const maskPath = document.createElementNS(SVG_NS, "path") as SVGPathElement
  maskPath.setAttribute("d", trajectoryEl.getAttribute("d") ?? "")
  maskPath.setAttribute("fill", "none")
  maskPath.setAttribute("stroke", "#ffffff")
  maskPath.setAttribute("stroke-width", String(strokeWidth + 2))
  maskPath.setAttribute("stroke-linecap", "round")
  maskPath.setAttribute("stroke-linejoin", "round")
  mask.appendChild(maskPath)
  defs.appendChild(mask)

  trajectoryEl.setAttribute("mask", `url(#${maskId})`)

  const cleanup = () => {
    trajectoryEl.removeAttribute("mask")
    mask.remove()
    if (createdDefs) defs.remove()
  }

  return { maskPath, cleanup }
}

/** Segmento `drawSVG` (em % da parametrização bruta do path) que revela do ponto de origem até `rawT` — a direção depende de qual ponta bruta é a chegada. */
function segmentFor(arrivalAtRawStart: boolean, rawT: number): string {
  return arrivalAtRawStart ? `${rawT * 100}% 100%` : `0% ${rawT * 100}%`
}

export function useRouteMotion({ containerRef, sectionRef, calibration, autoRotate = false }: UseRouteMotionOptions) {
  const maskIdBase = useId().replace(/[^a-zA-Z0-9_-]/g, "")

  useGSAP(
    () => {
      const root = containerRef.current
      const sectionEl = sectionRef.current
      if (!root || !sectionEl) return

      const resolved = resolveElements(root)
      if (!resolved) {
        console.error(
          "[useRouteMotion] estrutura de SVG inesperada: não encontrei ícone (path preenchido) e/ou trajetória (path de traço) dentro do container. Motion não será aplicado.",
          root
        )
        return
      }
      const { svgEl, iconParts, trajectoryEl, capEls } = resolved

      // BBox combinado de todas as partes do ícone, medido ANTES de qualquer
      // transform ser aplicado — é a posição "de chegada" (repouso) usada
      // para detectar a direção de cada path por proximidade.
      const combinedBBox = iconParts.reduce(
        (acc, el) => {
          const box = el.getBBox()
          return {
            minX: Math.min(acc.minX, box.x),
            minY: Math.min(acc.minY, box.y),
            maxX: Math.max(acc.maxX, box.x + box.width),
            maxY: Math.max(acc.maxY, box.y + box.height),
          }
        },
        { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
      )
      const restPoint = {
        x: (combinedBBox.minX + combinedBBox.maxX) / 2,
        y: (combinedBBox.minY + combinedBBox.maxY) / 2,
      }

      const { wrapper, unwrap } = wrapIconParts(iconParts)

      // Origem de rotação = restPoint — exatamente o ponto que a translação
      // leva até o path (mesma variável, fonte de verdade única). Sem isto o
      // GSAP gira o wrapper em torno do canto do bbox do ícone (default de SVG
      // é "0% 0%"), deslocando-o para fora do path por [R(θ)-I]·(restPoint -
      // origem) — o avião "descola" da linha e parece antecipar a curva.
      // Definida ANTES do primeiro applyProgress, com a matriz ainda em
      // identidade, para o smoothOrigin do GSAP não congelar nenhum
      // xOffset/yOffset de compensação. Só quando há rotação (autoRotate): o
      // pin não recebe nenhuma mudança de transform.
      if (autoRotate) gsap.set(wrapper, { svgOrigin: `${restPoint.x} ${restPoint.y}` })

      const trajectoryArrivalAtRawStart = detectArrivalAtRawStart(trajectoryEl, restPoint)
      const capArrivalAtRawStart = capEls.map((cap) => detectArrivalAtRawStart(cap, restPoint))
      const trajectoryLength = trajectoryEl.getTotalLength()

      // Offset de rotação: constante, calculado uma única vez a partir da
      // geometria do próprio ícone (ver computeNoseAngleDeg) — não a partir
      // da tangente no ponto de repouso. A orientação de repouso atual
      // nunca foi validada como alinhada à tangente; usá-la como referência
      // de "rotação zero" preservaria essa orientação não aprovada.
      const rotationOffsetDeg = autoRotate ? -computeNoseAngleDeg(iconParts[0] as SVGPathElement, restPoint) : 0

      const ROTATION_SAMPLE_EPSILON = 0.01

      /** Ângulo (graus) da tangente do path em `rawT`, na direção real de deslocamento (não a direção bruta t=0->1 do path). */
      function computeTangentDeg(rawT: number): number {
        const directionSign = trajectoryArrivalAtRawStart ? -1 : 1
        let a = rawT
        let b = gsap.utils.clamp(0, 1, rawT + directionSign * ROTATION_SAMPLE_EPSILON)
        if (b === a) {
          // Extremidade do path (não há intervalo na direção de viagem) —
          // amostra para trás, mantendo a ordem a->b no sentido de viagem.
          a = gsap.utils.clamp(0, 1, rawT - directionSign * ROTATION_SAMPLE_EPSILON)
          b = rawT
        }
        const p1 = trajectoryEl.getPointAtLength(a * trajectoryLength)
        const p2 = trajectoryEl.getPointAtLength(b * trajectoryLength)
        return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI
      }

      const maskId = `route-motion-mask-${maskIdBase}`
      const { maskPath, cleanup: cleanupMask } = createTrajectoryMask(svgEl, trajectoryEl, maskId)

      function applyProgress(effectiveProgress: number) {
        const clamped = gsap.utils.clamp(0, 1, effectiveProgress)

        // Posição do ícone calculada diretamente via getPointAtLength, e
        // aplicada como translação simples (wrapper -> ponto do path menos o
        // centro de repouso do próprio wrapper). Não usa o modo
        // `align`/`alignOrigin` do MotionPathPlugin: esse modo calcula o
        // alinhamento a partir do primeiro ponto (`M`) bruto do atributo `d`
        // do path de alinhamento, ignorando o `start`/`end` fracionário —
        // funciona por coincidência quando o alvo é o próprio path original,
        // mas produz transform "none" (sem efeito visual) para um `<g>`
        // wrapper criado em runtime (confirmado via inspeção do DOM ao
        // integrar). getPointAtLength é direto, previsível e já é usado para
        // a detecção de direção logo acima.
        const iconRawT = trajectoryArrivalAtRawStart ? 1 - clamped : clamped
        const targetPoint = trajectoryEl.getPointAtLength(iconRawT * trajectoryLength)
        gsap.set(wrapper, {
          x: targetPoint.x - restPoint.x,
          y: targetPoint.y - restPoint.y,
          ...(autoRotate ? { rotation: computeTangentDeg(iconRawT) + rotationOffsetDeg } : {}),
        })

        gsap.set(maskPath, { drawSVG: segmentFor(trajectoryArrivalAtRawStart, iconRawT) })

        capEls.forEach((cap, i) => {
          const arrivalAtRawStart = capArrivalAtRawStart[i]
          const capRawT = arrivalAtRawStart ? 1 - clamped : clamped
          gsap.set(cap, { drawSVG: segmentFor(arrivalAtRawStart, capRawT) })
        })
      }

      // Nota: `applyProgress` é chamado diretamente (sem `contextSafe`) nos
      // callbacks assíncronos abaixo. `contextSafe` reregistra a função no
      // contexto do GSAP a cada invocação (bom para handlers raros como
      // cliques); `onUpdate` do ScrollTrigger dispara centenas de vezes por
      // segundo durante o scroll, e esse reregistro repetido fez a estrutura
      // interna de contexto do GSAP crescer sem limite (stack overflow em
      // `Context.getTweens`, confirmado ao rodar no dev server). A limpeza
      // correta já é garantida por `trigger.kill()` (para o ScrollTrigger) e
      // pela remoção do listener de resize (ramo reduced-motion) — nenhuma
      // das duas depende de contextSafe.
      const getCeiling = () => computeCeiling(window.innerWidth, calibration)

      const mm = gsap.matchMedia()

      mm.add(
        {
          isVisible: `(min-width: ${RECEDE_WIDTH}px)`,
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isVisible, reduceMotion } = context.conditions as {
            isVisible: boolean
            reduceMotion: boolean
          }
          if (!isVisible) return

          if (reduceMotion) {
            // Sem ScrollTrigger: posição estática no teto seguro da largura
            // atual, com o traço revelado só até esse ponto. Recalculado no
            // resize (sem tween), sem listener de scroll.
            applyProgress(getCeiling())
            gsap.set(root, { opacity: 1 })

            let resizeTimeoutId: ReturnType<typeof setTimeout> | undefined
            const handleResize = () => {
              clearTimeout(resizeTimeoutId)
              resizeTimeoutId = setTimeout(() => {
                applyProgress(getCeiling())
              }, REDUCED_MOTION_RESIZE_DEBOUNCE_MS)
            }
            window.addEventListener("resize", handleResize)

            return () => {
              window.removeEventListener("resize", handleResize)
              clearTimeout(resizeTimeoutId)
            }
          }

          const trigger = ScrollTrigger.create({
            id: `route-motion-${maskId}`,
            trigger: sectionEl,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => applyProgress(self.progress * getCeiling()),
            // Resize durante scroll: sem tween concorrente — o próprio
            // ScrollTrigger.refresh() (auto-debounced no resize) dispara
            // onRefresh, que só recalcula o teto e reaplica o progresso
            // atual (leitura, não nova animação).
            onRefresh: (self) => applyProgress(self.progress * getCeiling()),
          })

          // Sincroniza uma vez, de forma síncrona, logo após criar o
          // trigger — sem esperar o primeiro evento de scroll. Evita
          // qualquer frame com posição/reveal desatualizados em
          // carregamento direto numa largura/posição de scroll
          // intermediária. Só revela o elemento (opacity) depois disso.
          applyProgress(trigger.progress * getCeiling())
          gsap.set(root, { opacity: 1 })

          return () => {
            trigger.kill()
          }
        },
        containerRef
      )

      return () => {
        mm.revert()
        gsap.killTweensOf([wrapper, maskPath, ...capEls])
        cleanupMask()
        unwrap()
      }
    },
    { scope: containerRef }
  )
}

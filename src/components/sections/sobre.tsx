import { MapPin } from "lucide-react"
import { useRef } from "react"
import type { CSSProperties } from "react"

import pinSvgRaw from "@/assets/elements/pin-carioca-blue.svg?raw"
import { Wrap } from "@/components/layout/container"
import { Chip } from "@/components/ui/chip"
import { Eyebrow } from "@/components/ui/eyebrow"
import { namespaceSvgClasses, useRouteMotion } from "@/hooks/use-route-motion"
import { content } from "@/lib/content"

const railLineBackground: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(180deg, var(--color-hair) 0 5px, transparent 5px 11px)",
}

const pinMarkup = namespaceSvgClasses(pinSvgRaw, "pin")

/**
 * Teto de progresso (0–1) alcançável ao longo da trajetória por largura de
 * viewport — atingido quando o scroll da seção chega a 100% (ver
 * HANDOFF.md Seção 14, plano revisado com ScrollTrigger + DrawSVG).
 *
 * Recalibrado nesta sessão junto com o avião (mesma causa raiz: o valor
 * antigo, máx. 0.1 em 1440px, era herdado da calibração estática da 1ª
 * iteração e nunca revalidado para este modelo scroll-linked). Mesma
 * metodologia de busca geométrica (getPointAtLength + bbox do ícone vs.
 * heading real, intervalo [0, candidato] inteiro, margem de segurança
 * subtraída do maior valor sem sobreposição).
 */
const PIN_CALIBRATION = [
  { width: 1440, ceiling: 0.42 },
  { width: 1300, ceiling: 0.16 },
  { width: 1200, ceiling: 0.1 },
  { width: 1100, ceiling: 0.05 },
  { width: 1024, ceiling: 0 },
  { width: 641, ceiling: 0 },
] as const

function Sobre() {
  const { sobre } = content
  const pinRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  useRouteMotion({ containerRef: pinRef, sectionRef, calibration: PIN_CALIBRATION })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-off-white py-[72px] tablet:py-[104px]"
    >
      {/*
        Pin: ícone + trajetória tracejada como SVG inline (design.md Seção 9).
        Posição controlada pelo scroll da seção, até um teto por largura —
        src/hooks/use-route-motion.ts (ScrollTrigger + getPointAtLength +
        DrawSVGPlugin). Começa com opacity-0: o hook só revela o elemento
        depois de aplicar a posição/máscara inicial corretas, evitando
        qualquer frame com a trajetória inteira visível ou o ícone fora do
        lugar.
      */}
      <div
        ref={pinRef}
        aria-hidden="true"
        className="absolute top-10 right-0 hidden h-40 w-auto opacity-0 tablet:block [&>svg]:block [&>svg]:h-full [&>svg]:w-auto [&>svg]:overflow-visible"
        dangerouslySetInnerHTML={{ __html: pinMarkup }}
      />
      <Wrap className="relative z-[1] max-w-[980px]">
        <div className="grid grid-cols-1 gap-7 tablet:grid-cols-[64px_1fr]">
          <div
            aria-hidden
            className="mb-4 flex flex-row items-center gap-2 tablet:mb-0 tablet:flex-col tablet:gap-0 tablet:pt-1.5"
          >
            <MapPin className="size-[22px] shrink-0 text-carioca-blue" />
            <div
              className="hidden w-px flex-1 tablet:mt-3.5 tablet:block tablet:min-h-[140px]"
              style={railLineBackground}
            />
          </div>
          <div>
            <div className="text-left">
              <Eyebrow>{sobre.eyebrow}</Eyebrow>
              <h2 className="text-left text-[clamp(1.9rem,3.2vw,2.5rem)] font-extrabold">
                {sobre.title}
              </h2>
            </div>
            <p className="mt-[22px] max-w-[680px] text-left text-[1.15rem] leading-[1.78] font-normal text-graphite">
              {sobre.textBefore}{" "}
              <Chip size="inline">{sobre.chipInline}</Chip>{" "}
              {sobre.textAfter}
            </p>
          </div>
        </div>
      </Wrap>
    </section>
  )
}

export { Sobre }

import { Check, MapPin } from "lucide-react"
import type { CSSProperties } from "react"

import heroPoster from "@/assets/hero/hero-reel-poster.webp"
import heroReel from "@/assets/hero/hero-reel.mp4"
import logoClaraNova from "@/assets/logo/logo-horizontal-clara-nova.svg"
import { WrapWide } from "@/components/layout/container"
import { Chip } from "@/components/ui/chip"
import { Eyebrow } from "@/components/ui/eyebrow"
import { buttonVariants } from "@/components/ui/button"
import { content } from "@/lib/content"

/**
 * Base institucional atrás da mídia — o gradiente da marca que era o
 * placeholder da Hero (design.md Seção 7) permanece como último fallback,
 * visível se o vídeo e o poster falharem.
 */
const heroBackground: CSSProperties = {
  backgroundImage: [
    "radial-gradient(1100px 700px at 82% 8%, color-mix(in srgb, var(--color-light-blue) 35%, transparent), transparent 60%)",
    "linear-gradient(128deg, var(--color-deep-blue) 0%, var(--color-carioca-blue) 52%, var(--color-carioca-green) 100%)",
  ].join(", "),
}

/**
 * Camada de legibilidade sobre o vídeo — design.md Seção 7 é explícito: a
 * mídia nunca pode reduzir a legibilidade do texto. Escurece o rodapé (onde
 * ficam título, subtítulo e CTAs) e a base esquerda, mantendo o topo mais
 * limpo para a imagem respirar. Usa os tokens da marca, não preto neutro,
 * para o escurecimento não sujar a paleta.
 */
const heroOverlay: CSSProperties = {
  backgroundImage: [
    "linear-gradient(180deg, color-mix(in srgb, var(--color-deep-blue) 32%, transparent) 0%, color-mix(in srgb, var(--color-deep-blue) 22%, transparent) 34%, color-mix(in srgb, var(--color-deep-blue) 82%, transparent) 62%, color-mix(in srgb, var(--color-deep-blue) 95%, transparent) 100%)",
    "linear-gradient(90deg, color-mix(in srgb, var(--color-deep-blue) 72%, transparent) 0%, color-mix(in srgb, var(--color-deep-blue) 30%, transparent) 45%, transparent 70%)",
  ].join(", "),
}

/** Linha pontilhada divisória — elemento estrutural, não decorativo. design.md Seção 8. */
const dividerBackground: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(90deg, var(--color-light-blue) 0 12px, transparent 12px 26px)",
}

function Hero() {
  const { hero } = content

  return (
    <section
      className="relative flex min-h-screen flex-col overflow-hidden text-off-white"
      style={heroBackground}
    >
      {/*
        Reel institucional: cena do avião + cena do carro, 6s, em loop com
        fade pelo preto nas duas pontas para o reinício não dar salto.
        A cena do saguão do aeroporto entra depois.

        Camadas, de baixo para cima: gradiente da marca (fallback final) →
        poster estático → vídeo → véu de legibilidade → conteúdo (z-[1]).
        O poster fica sempre montado, então quem tem `prefers-reduced-motion`
        ou vídeo bloqueado vê a imagem, nunca um buraco.
      */}
      <img
        src={heroPoster}
        alt=""
        aria-hidden
        className="absolute inset-0 size-full object-cover"
      />
      <video
        src={heroReel}
        poster={heroPoster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="absolute inset-0 size-full object-cover motion-reduce:hidden"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={heroOverlay}
      />

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-[2] h-[3px] opacity-90"
        style={dividerBackground}
      />

      <div className="relative z-[1] border-b border-hair-light bg-ink/35">
        <WrapWide className="flex flex-wrap items-center justify-between gap-4 py-[9px] font-mono text-[0.7rem] tracking-[0.08em] text-off-white/82 uppercase">
          <span className="flex flex-wrap items-center gap-2.5">
            <span>{hero.utilityLeft}</span>
            <Chip size="sm">{hero.utilityLeftTag}</Chip>
          </span>
          <span>
            <strong className="font-medium text-light-blue">
              {hero.utilityRightStrong}
            </strong>{" "}
            · {hero.utilityRightRest}
          </span>
        </WrapWide>
      </div>

      <header className="relative z-[1] border-b border-hair-light">
        <WrapWide className="flex items-center justify-between gap-5 py-5">
          <img
            src={logoClaraNova}
            alt="Carioca Viagens"
            className="w-[200px]"
          />
          <a
            href="#contato"
            className={buttonVariants({ variant: "outline" })}
          >
            {hero.ctaPrimary}
          </a>
        </WrapWide>
      </header>

      <div className="relative z-[1] flex flex-1 items-end">
        <span className="absolute top-9 right-10 z-[1] flex items-center gap-2 rounded-full border border-hair-light bg-ink/40 py-2.5 pr-4 pl-3 font-mono text-[0.68rem] tracking-[0.08em] text-off-white/88 uppercase">
          <MapPin className="size-3.5 text-light-green" />
          {hero.locus}
        </span>
        <WrapWide className="relative z-[1] w-fit pb-[72px]">
          <Eyebrow tone="on-dark" className="mb-5">
            {hero.eyebrow}
          </Eyebrow>
          <h1 className="max-w-[920px] text-[clamp(2.8rem,6.2vw,5.2rem)] leading-[1.03] font-extrabold tracking-[-0.03em] text-off-white">
            {hero.titleLine1}
            <br />
            <span className="font-accent-serif text-light-blue italic">
              {hero.titleAccent}
            </span>
          </h1>
          <p className="mt-6 max-w-[480px] text-[1.15rem] text-off-white/86">
            {hero.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap gap-3.5">
            <a
              href="#contato"
              className={buttonVariants({ variant: "solid" })}
            >
              <Check className="size-4" />
              {hero.ctaPrimary}
            </a>
            <a
              href="#contato"
              className={buttonVariants({ variant: "outline" })}
            >
              {hero.ctaSecondary}
            </a>
          </div>
        </WrapWide>
      </div>
    </section>
  )
}

export { Hero }

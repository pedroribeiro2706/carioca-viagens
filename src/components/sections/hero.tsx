import { Check, MapPin } from "lucide-react"
import type { CSSProperties } from "react"

import logoClaraNova from "@/assets/logo/logo-horizontal-clara-nova.svg"
import { WrapWide } from "@/components/layout/container"
import { Chip } from "@/components/ui/chip"
import { Eyebrow } from "@/components/ui/eyebrow"
import { buttonVariants } from "@/components/ui/button"
import { content } from "@/lib/content"

/**
 * Fundo institucional [PROVISÓRIO] — design.md Seção 7. Overlay + gradiente
 * diagonal com os tokens reais da marca (nunca gradiente decorativo
 * arbitrário). Substituído por mídia real numa etapa futura.
 */
const heroBackground: CSSProperties = {
  backgroundImage: [
    "radial-gradient(1100px 700px at 82% 8%, color-mix(in srgb, var(--color-light-blue) 35%, transparent), transparent 60%)",
    "linear-gradient(180deg, color-mix(in srgb, var(--color-deep-blue) 35%, transparent) 0%, color-mix(in srgb, var(--color-deep-blue) 90%, transparent) 78%, var(--color-deep-blue) 100%)",
    "linear-gradient(128deg, var(--color-deep-blue) 0%, var(--color-carioca-blue) 52%, var(--color-carioca-green) 100%)",
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
        <span className="absolute right-10 bottom-6 z-[1] max-w-[260px] text-right font-mono text-[0.68rem] tracking-[0.1em] text-off-white/55 uppercase">
          {hero.placeholderNote[0]}
          <br />
          {hero.placeholderNote[1]}
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

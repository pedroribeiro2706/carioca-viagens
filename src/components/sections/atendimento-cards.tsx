import { cva, type VariantProps } from "class-variance-authority"
import {
  ArrowUpRight,
  Handshake,
  Headset,
  type LucideIcon,
  PlaneTakeoff,
} from "lucide-react"

import aviaoIcon from "@/assets/elements/aviao-carioca-blue.svg"
import { Wrap } from "@/components/layout/container"
import { CornerGuides } from "@/components/ui/corner-guides"
import { Eyebrow } from "@/components/ui/eyebrow"
import { content } from "@/lib/content"
import { cn } from "@/lib/utils"

const ICONS: Record<string, LucideIcon> = {
  headset: Headset,
  planeTakeoff: PlaneTakeoff,
  handshake: Handshake,
}

/**
 * Variantes de cor dos cards — design.md Seção 13 ("Contraste de texto —
 * decisão final"). `card-blue`/`card-green` usam os tokens já corrigidos
 * para WCAG AA (--color-card-blue-bg / --color-card-green-text); nunca
 * recalcular esses valores fora de src/index.css.
 */
const cardVariants = cva(
  "relative col-span-1 grid aspect-square grid-rows-[27fr_10fr_20fr_3fr_40fr] overflow-hidden rounded-[10px] border text-left",
  {
    variants: {
      variant: {
        blue: "border-transparent bg-[var(--color-card-blue-bg)] text-ink-on-blue",
        green: "border-transparent bg-carioca-green text-[var(--color-card-green-text)]",
        dark: "border-transparent bg-near-black text-ink-on-dark",
      },
    },
  }
)

const ruleVariants = cva("block h-[0.75px] shrink-0", {
  variants: {
    variant: {
      blue: "bg-[color-mix(in_srgb,var(--color-pale-blue)_50%,transparent)]",
      green: "bg-[color-mix(in_srgb,var(--color-deep-blue)_22%,transparent)]",
      dark: "bg-[color-mix(in_srgb,var(--color-pale-blue)_50%,transparent)]",
    },
  },
})

const microVariants = cva(
  "font-mono text-[0.7rem] tracking-[0.1em] uppercase",
  {
    variants: {
      variant: {
        blue: "text-ink-on-blue",
        green: "text-[var(--color-card-green-text)]",
        dark: "text-light-green",
      },
    },
  }
)

type CardVariant = VariantProps<typeof cardVariants>["variant"]

function AtendimentoCard({
  variant,
  index,
  micro,
  titleLines,
  desc,
  icon,
}: {
  variant: CardVariant
  index: string
  micro: string
  titleLines: readonly [string, string]
  desc: string
  icon: string
}) {
  const Icon = ICONS[icon]

  return (
    <div className="rounded-[30px] shadow-[9px_12px_16px_-9px_rgba(12,33,50,0.5)]">
      <div className={cardVariants({ variant })}>
        <div className="row-start-1 flex min-h-0 flex-col justify-center gap-1.5 px-5 pt-[30px]">
          <div className="flex shrink-0 items-center gap-2.5">
            <Icon className="size-[18px] shrink-0" strokeWidth={1.6} />
            <span className={microVariants({ variant })}>{micro}</span>
          </div>
          <span className={ruleVariants({ variant })} />
          <h3 className="m-0 flex flex-col gap-1.5 text-inherit">
            <span className="font-display text-[1.75rem] leading-[0.8] font-extralight tracking-[0.075em] uppercase">
              {titleLines[0]}
            </span>
            <span className={ruleVariants({ variant })} />
            <span className="font-display text-[1.75rem] leading-[0.8] font-extralight tracking-[0.075em] uppercase">
              {titleLines[1]}
            </span>
          </h3>
          <span className={ruleVariants({ variant })} />
        </div>

        <div className="row-start-3 flex min-h-0 items-center justify-between gap-4 px-5">
          <p className="m-0 max-w-full font-body text-[1.05rem] leading-[1.2] font-thin">
            <span className="mr-1.5 inline-block align-baseline font-mono text-[2.5em] leading-none font-thin">
              {index}
            </span>
            {desc}
          </p>
          <ArrowUpRight
            className="size-[52px] shrink-0"
            strokeWidth={0.85}
          />
        </div>

        <div
          className={cn(
            "relative row-start-5 border-t",
            variant === "green"
              ? "border-[color-mix(in_srgb,var(--color-deep-blue)_14%,transparent)] bg-[color-mix(in_srgb,var(--color-deep-blue)_8%,transparent)]"
              : "border-off-white/16 bg-off-white/10"
          )}
        >
          <CornerGuides
            size="sm"
            borderClassName={
              variant === "green"
                ? "border-[color-mix(in_srgb,var(--color-deep-blue)_30%,transparent)]"
                : "border-off-white/40"
            }
          />
        </div>
      </div>
    </div>
  )
}

function AtendimentoCards() {
  const { atendimento } = content

  return (
    <section className="relative overflow-hidden bg-sand py-[108px] tablet:py-[116px]">
      <img
        src={aviaoIcon}
        alt=""
        aria-hidden="true"
        className="absolute top-[50px] left-0 hidden h-[265px] w-auto tablet:block"
      />
      <Wrap className="relative z-[1] text-center">
        <div className="mx-auto w-fit text-left">
          <Eyebrow>{atendimento.eyebrow}</Eyebrow>
          <h2 className="text-left text-[clamp(1.9rem,3.2vw,2.5rem)] font-extrabold">
            {atendimento.title}
          </h2>
        </div>
        <p className="mx-auto mt-5 max-w-[620px] text-[1.08rem] text-graphite">
          {atendimento.intro}
        </p>
        <div className="mt-[60px] grid grid-cols-1 items-stretch gap-[26px] desktop:grid-cols-3">
          {atendimento.cards.map((card) => (
            <AtendimentoCard
              key={card.index}
              variant={card.variant}
              index={card.index}
              micro={card.micro}
              titleLines={card.titleLines}
              desc={card.desc}
              icon={card.icon}
            />
          ))}
        </div>
      </Wrap>
    </section>
  )
}

export { AtendimentoCards }

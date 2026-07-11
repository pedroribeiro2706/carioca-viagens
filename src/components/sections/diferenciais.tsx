import { Clock, CreditCard, type LucideIcon, Plane, Settings } from "lucide-react"
import type { CSSProperties } from "react"

import { WrapWide } from "@/components/layout/container"
import { Chip } from "@/components/ui/chip"
import { CornerGuides } from "@/components/ui/corner-guides"
import { Eyebrow } from "@/components/ui/eyebrow"
import { content } from "@/lib/content"

const ICONS: Record<string, LucideIcon> = {
  clock: Clock,
  plane: Plane,
  creditCard: CreditCard,
  settings: Settings,
}

const mediaBackground: CSSProperties = {
  backgroundImage: [
    "linear-gradient(160deg, color-mix(in srgb, var(--color-carioca-blue) 85%, transparent), color-mix(in srgb, var(--color-carioca-green) 70%, transparent))",
    "repeating-linear-gradient(0deg, color-mix(in srgb, var(--color-off-white) 8%, transparent) 0 1px, transparent 1px 64px)",
    "repeating-linear-gradient(90deg, color-mix(in srgb, var(--color-off-white) 8%, transparent) 0 1px, transparent 1px 64px)",
  ].join(", "),
}

function Diferenciais() {
  const { diferenciais } = content

  return (
    <section className="bg-off-white py-[100px]">
      <WrapWide className="grid grid-cols-1 items-stretch gap-16 tablet:grid-cols-2">
        <div>
          <Eyebrow>{diferenciais.eyebrow}</Eyebrow>
          <h2 className="text-left text-[clamp(1.9rem,3.2vw,2.5rem)] font-extrabold">
            {diferenciais.title}
          </h2>
          <div className="mt-9 border-t border-hair">
            {diferenciais.items.map((item) => {
              const Icon = ICONS[item.icon]
              return (
                <div
                  key={item.label}
                  className="grid grid-cols-[32px_1fr] items-center gap-[22px] border-b border-hair py-[26px]"
                >
                  <Icon className="size-[22px] text-carioca-blue" />
                  <span className="font-display text-[1.2rem] font-semibold text-ink">
                    {item.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        <div
          className="relative h-[260px] overflow-hidden rounded-[3px] tablet:h-full tablet:min-h-[340px]"
          style={mediaBackground}
        >
          <CornerGuides />
          <Chip
            variant="on-dark"
            className="absolute top-5 right-5 border-off-white/55 bg-ink/32 text-off-white"
          >
            {diferenciais.mediaChip}
          </Chip>
          <span className="absolute right-5 bottom-5 left-5 font-mono text-[0.66rem] tracking-[0.08em] text-off-white/85 uppercase">
            {diferenciais.mediaNote[0]}
            <br />
            {diferenciais.mediaNote[1]}
          </span>
        </div>
      </WrapWide>
    </section>
  )
}

export { Diferenciais }

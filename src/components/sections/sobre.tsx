import { MapPin } from "lucide-react"
import type { CSSProperties } from "react"

import pinIcon from "@/assets/elements/pin-carioca-blue.svg"
import { Wrap } from "@/components/layout/container"
import { Chip } from "@/components/ui/chip"
import { Eyebrow } from "@/components/ui/eyebrow"
import { content } from "@/lib/content"

const railLineBackground: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(180deg, var(--color-hair) 0 5px, transparent 5px 11px)",
}

function Sobre() {
  const { sobre } = content

  return (
    <section className="relative overflow-hidden bg-off-white py-[72px] tablet:py-[104px]">
      <img
        src={pinIcon}
        alt=""
        aria-hidden="true"
        className="absolute top-10 right-0 hidden h-40 w-auto tablet:block"
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

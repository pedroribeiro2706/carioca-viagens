import type { CSSProperties } from "react"

import { content } from "@/lib/content"

/** `.band` — faixa de transição/placeholder de mídia. design.md Seção 11. */
const bandBackground: CSSProperties = {
  backgroundImage:
    "linear-gradient(125deg, color-mix(in srgb, var(--color-carioca-blue) 94%, transparent), color-mix(in srgb, var(--color-carioca-green) 86%, transparent))",
}

function MediaBand() {
  return (
    <div
      className="relative h-[42vh] min-h-[300px] overflow-hidden"
      style={bandBackground}
    >
      <span className="absolute bottom-[26px] left-10 font-mono text-[0.7rem] tracking-[0.1em] text-off-white/75 uppercase">
        {content.band.note}
      </span>
    </div>
  )
}

export { MediaBand }

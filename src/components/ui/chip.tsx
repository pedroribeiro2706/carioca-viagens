import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

/**
 * Chip de wayfinding — componente próprio do projeto (não é o Badge do
 * shadcn/ui). Cobre `.chip`, `.chip.on-dark`, o `.tag` da utility-strip/hero
 * (variant="default" size="sm") e o `.chip-inline` embutido em texto corrido
 * (size="inline"). design.md Seção 17.
 */
const chipVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-[3px] border font-mono",
  {
    variants: {
      variant: {
        default: "border-carioca-blue text-carioca-blue",
        "on-dark": "border-light-blue text-light-blue",
      },
      size: {
        default: "px-[13px] py-1.5 text-[0.68rem] uppercase tracking-[0.06em]",
        sm: "px-[7px] py-[3px] text-[0.65rem] uppercase tracking-[0.1em]",
        inline:
          "-translate-y-px mx-px px-2 py-0.5 align-middle text-[0.95rem] font-medium normal-case tracking-normal",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ChipProps
  extends ComponentPropsWithoutRef<"span">,
    VariantProps<typeof chipVariants> {}

function Chip({ className, variant, size, ...props }: ChipProps) {
  return (
    <span
      data-slot="chip"
      className={cn(chipVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Chip, chipVariants }

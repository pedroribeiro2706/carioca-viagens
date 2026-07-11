import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

/** `.eyebrow` — microtítulo mono uppercase, wayfinding. design.md Seção 3/12. */
const eyebrowVariants = cva(
  "mb-[22px] block text-left font-mono text-[0.85rem] font-medium uppercase tracking-[0.1em]",
  {
    variants: {
      tone: {
        default: "text-carioca-blue",
        "on-dark": "text-light-blue",
      },
    },
    defaultVariants: { tone: "default" },
  }
)

export interface EyebrowProps
  extends ComponentPropsWithoutRef<"span">,
    VariantProps<typeof eyebrowVariants> {}

function Eyebrow({ className, tone, ...props }: EyebrowProps) {
  return (
    <span className={cn(eyebrowVariants({ tone, className }))} {...props} />
  )
}

export { Eyebrow, eyebrowVariants }

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Botão Carioca Viagens — base técnica do shadcn/ui (Base UI), estética 100%
 * definida por design/design.md Seção 17. Não usar variantes/tamanhos do
 * shadcn padrão; apenas os dois estilos aprovados existem: solid e outline
 * (com a variante on-light para uso sobre fundo claro).
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-carioca border px-[26px] py-[14px] font-body text-[0.92rem] font-medium tracking-[0.01em] no-underline transition-[background-color,opacity] duration-150 ease-out outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        solid: "border-carioca-green bg-carioca-green text-deep-blue hover:opacity-[0.88]",
        outline: "border-hair-light bg-transparent text-off-white hover:bg-black/30",
        "outline-on-light": "border-carioca-blue bg-transparent text-carioca-blue hover:bg-black/5",
      },
    },
    defaultVariants: {
      variant: "solid",
    },
  }
)

function Button({
  className,
  variant,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

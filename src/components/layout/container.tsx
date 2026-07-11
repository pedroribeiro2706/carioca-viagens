import type { ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

/** `.wrap` do mockup — conteúdo geral (Sobre, Atendimento). design.md Seção 5. */
function Wrap({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1180px] px-10", className)}
      {...props}
    />
  )
}

/** `.wrap-wide` do mockup — seções wide (Hero, Diferenciais, Operacional, Contato, Clientes). */
function WrapWide({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1440px] px-10", className)}
      {...props}
    />
  )
}

export { Wrap, WrapWide }

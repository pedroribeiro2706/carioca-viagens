import { cn } from "@/lib/utils"

/**
 * Cantos-guia de placeholder de mídia — reutilizados em Diferenciais e nos
 * cards de Atendimento (design.md Seção 11: "linguagem visual de placeholder
 * do sistema"). `size="sm"` corresponde às dimensões menores usadas dentro
 * dos cards de Atendimento (`.oferta-media .corner`).
 */
function CornerGuides({
  className,
  borderClassName = "border-off-white/55",
  size = "default",
}: {
  className?: string
  borderClassName?: string
  size?: "default" | "sm"
}) {
  const isSm = size === "sm"

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      <span
        className={cn(
          "absolute border-t-[1.5px] border-l-[1.5px]",
          borderClassName,
          isSm ? "top-3.5 left-3.5 size-3.5" : "top-5 left-5 size-[22px]"
        )}
      />
      <span
        className={cn(
          "absolute border-r-[1.5px] border-b-[1.5px]",
          borderClassName,
          isSm ? "bottom-3.5 right-3.5 size-3.5" : "bottom-5 right-5 size-[22px]"
        )}
      />
    </div>
  )
}

export { CornerGuides }

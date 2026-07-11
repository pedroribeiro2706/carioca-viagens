import type { SVGProps } from "react"

/**
 * Ícones de marca (Instagram, Facebook, WhatsApp) — mantidos como SVG
 * customizado em vez de lucide-react, conforme decisão condicional de
 * design.md Seção 18: nenhuma biblioteca de ícones de marca disponível
 * oferece o mesmo traço linear consistente do restante do sistema (marcas
 * oficiais de redes sociais são desenhadas como glifos sólidos/preenchidos).
 * Paths portados 1:1 da sprite original em design/mocks/10-cards-refinamento.html.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function baseProps({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  }
}

function InstagramIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M14 21v-7h3l.5-4H14V7.5A1.5 1.5 0 0 1 15.5 6H17V2h-2.5A5 5 0 0 0 9.5 7v3H7v4h2.5v7z" />
    </svg>
  )
}

function WhatsappIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
    </svg>
  )
}

export { InstagramIcon, FacebookIcon, WhatsappIcon }

import geselLogo from "@/assets/clientes/gesel.svg"
import leonardoLogo from "@/assets/clientes/leonardo.svg"
import miguelLogo from "@/assets/clientes/miguel.svg"
import somerjLogo from "@/assets/clientes/somerj.svg"
// wp.svg embute uma referência externa quebrada (arquivo fora do projeto,
// path de máquina do designer original) e não renderiza — usando o PNG
// como fallback até que um SVG válido seja fornecido. Ver relatório final.
import wpLogo from "@/assets/clientes/wp.png"
import { WrapWide } from "@/components/layout/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { content } from "@/lib/content"

const LOGO_SRC: Record<string, string> = {
  gesel: geselLogo,
  leonardo: leonardoLogo,
  miguel: miguelLogo,
  somerj: somerjLogo,
  wp: wpLogo,
}

/**
 * Grid fluido (auto-fit/minmax) em vez da grade fixa de 5 colunas do
 * mockup — design.md Seção 15, decisão técnica já travada para a
 * implementação React (não quebra visualmente se a lista de clientes mudar).
 */
function Clientes() {
  const { clientes } = content

  return (
    <section className="bg-off-white py-[100px] text-center">
      <WrapWide>
        <div className="mx-auto mb-12 w-fit max-w-[640px] text-left">
          <Eyebrow>{clientes.eyebrow}</Eyebrow>
          <h2 className="text-left text-[clamp(1.9rem,3.2vw,2.5rem)] font-extrabold">
            {clientes.title}
          </h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] border-t border-l border-hair">
          {clientes.logos.map((logo) => (
            <div
              key={logo.file}
              className="flex aspect-[3/2] items-center justify-center border-r border-b border-hair p-5"
            >
              <img
                src={LOGO_SRC[logo.file]}
                alt={logo.name}
                className="max-h-[50%] max-w-[80%] w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </WrapWide>
    </section>
  )
}

export { Clientes }

import geselLogo from "@/assets/clientes/gesel.svg"
import inpoLogo from "@/assets/clientes/inpo.svg"
import miguelLogo from "@/assets/clientes/miguel.svg"
import somerjLogo from "@/assets/clientes/somerj.svg"
import { WrapWide } from "@/components/layout/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { content } from "@/lib/content"

const LOGO_SRC: Record<string, string> = {
  gesel: geselLogo,
  inpo: inpoLogo,
  miguel: miguelLogo,
  somerj: somerjLogo,
}

/**
 * Colunas fixas por breakpoint em vez de auto-fit/minmax puro — design.md
 * Seção 15 pedia grid fluido, mas o auto-fit reorganiza continuamente
 * conforme a largura e passa por composições intermediárias desequilibradas
 * (ex.: 3 logos em cima + 1 embaixo). Com 4 clientes fixos: mobile 1 coluna
 * (empilhado), tablet e desktop/wide mantêm as 4 logos numa linha só.
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
        <div className="grid grid-cols-1 border-t border-l border-hair tablet:grid-cols-4">
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

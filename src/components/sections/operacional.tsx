import { Check } from "lucide-react"

import { WrapWide } from "@/components/layout/container"
import { Chip } from "@/components/ui/chip"
import { Eyebrow } from "@/components/ui/eyebrow"
import { content } from "@/lib/content"

function OpList({ items }: { items: readonly string[] }) {
  return (
    <ul className="m-0 flex flex-col gap-4 p-0">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 border-b border-off-white/9 pb-4 text-[1rem] text-off-white/88"
        >
          <Check className="mt-[3px] size-4 shrink-0 text-carioca-green" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function Operacional() {
  const { operacional } = content

  return (
    <section className="bg-deep-blue py-[104px] text-off-white">
      <WrapWide>
        {/* Bloco do título centralizado é composição do desktop; no mobile
            alinha à esquerda como as demais seções. */}
        <div className="mx-auto mb-14 w-fit max-w-[640px] text-left max-sm:mx-0">
          <Eyebrow tone="on-dark">{operacional.eyebrow}</Eyebrow>
          <h2 className="text-left text-[clamp(1.9rem,3.2vw,2.5rem)] font-extrabold text-off-white">
            {operacional.title}
          </h2>
        </div>

        <div>
          <div className="mb-[22px] border-b border-hair-light pb-3.5">
            <span className="font-mono text-[0.85rem] leading-[normal] font-medium uppercase tracking-[0.1em] text-light-green">
              {operacional.corporativo.label}
            </span>
          </div>
          {/*
            gap-12 é o vão entre as DUAS COLUNAS do desktop; empilhado
            (1 coluna), ele virava um buraco de 48px acima do primeiro item
            da coluna B ("Atendimento emergencial"). Empilhado, o vão segue
            o ritmo da lista (gap-4).
          */}
          <div className="grid grid-cols-1 gap-4 desktop:grid-cols-2 desktop:gap-12">
            <OpList items={operacional.corporativo.colA} />
            <div className="flex flex-col">
              <OpList items={operacional.corporativo.colB} />
              {/* No mobile os chips encolhem para caberem os três na mesma linha. */}
              <div className="flex flex-wrap gap-2.5 pt-[18px] max-sm:gap-2">
                {operacional.corporativo.chips.map((chip) => (
                  <Chip
                    key={chip}
                    variant="on-dark"
                    className="max-sm:px-2 max-sm:py-1 max-sm:text-[0.6rem] max-sm:tracking-[0.04em]"
                  >
                    {chip}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="my-14" />

        <div>
          <div className="mb-[22px] border-b border-hair-light pb-3.5">
            <span className="font-mono text-[0.85rem] leading-[normal] font-medium uppercase tracking-[0.1em] text-light-green">
              {operacional.receptivo.label}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 desktop:grid-cols-2 desktop:gap-12">
            <OpList items={operacional.receptivo.colA} />
            <OpList items={operacional.receptivo.colB} />
          </div>
        </div>
      </WrapWide>
    </section>
  )
}

export { Operacional }

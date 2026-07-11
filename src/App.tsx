import { AtendimentoCards } from "@/components/sections/atendimento-cards"
import { Clientes } from "@/components/sections/clientes"
import { ContatoFooter } from "@/components/sections/contato-footer"
import { Diferenciais } from "@/components/sections/diferenciais"
import { Hero } from "@/components/sections/hero"
import { MediaBand } from "@/components/sections/media-band"
import { Operacional } from "@/components/sections/operacional"
import { Sobre } from "@/components/sections/sobre"

/** Ordem de seções — design.md Seção 5 / CLAUDE.md "Page architecture". */
function App() {
  return (
    <>
      <Hero />
      <Sobre />
      <MediaBand />
      <Diferenciais />
      <AtendimentoCards />
      <Operacional />
      <Clientes />
      <ContatoFooter />
    </>
  )
}

export default App

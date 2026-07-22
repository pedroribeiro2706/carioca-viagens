/**
 * Conteúdo textual visível ao cliente — Carioca Viagens.
 *
 * Fonte única e autoritativa: references/conteudo-apresentacao.md.
 * Não editar texto aqui sem checar contra esse arquivo primeiro.
 *
 * Duas exceções documentadas e já aprovadas (não são texto inventado livre):
 * 1. `sobre.textBefore/chipInline/textAfter` — mesmo texto oficial da seção 01,
 *    reestruturado para embutir o chip "Carioca Viagens" (aprovado por Pedro,
 *    ver HANDOFF.md Seção 9 / design.md Seção 10).
 * 2. `atendimento.cards[].desc` — expansões funcionais curtas dos itens da
 *    seção 03, aprovadas e documentadas em design/design.md Seção 13.
 */
export const content = {
  hero: {
    utilityLeft: "Carioca Viagens · Rio de Janeiro, RJ",
    utilityLeftTag: "RIO · GIG",
    utilityRightStrong: "Operacional desde 1999",
    utilityRightRest: "Corporativo · Lazer · Receptivo",
    locus: "Sede — Flamengo, RJ",
    placeholderNote: [
      "— vídeo institucional em loop (placeholder)",
      "imagem de fallback + overlay para legibilidade",
    ],
    eyebrow: "— Abertura",
    titleLine1: "Nossa agência.",
    titleAccent: "Sua agência.",
    subtitle:
      "Viagens corporativas com atendimento próximo e operação eficiente.",
    ctaPrimary: "Fale conosco",
    ctaSecondary: "Solicite atendimento",
  },
  sobre: {
    eyebrow: "— Sobre",
    title: "Olá, muito prazer",
    textBefore: "Somos a",
    chipInline: "Carioca Viagens",
    textAfter:
      "e atuamos no mercado nacional e internacional, atendendo viagens corporativas, de lazer e receptivos. Desde 1999 conquistando a confiança e recebendo a credibilidade de inúmeros clientes que a elegeram sua agência de conta corrente. O atendimento personalizado, ágil e qualificado facilita a realização de metas a custos mais viáveis. Na busca pela excelência, estabelecemos parcerias com grandes operadoras e consolidadoras que flexibilizam a negociação, sem comprometer a qualidade dos serviços.",
  },
  band: {
    note: "— placeholder de fotografia/vídeo · viagem corporativa",
  },
  diferenciais: {
    eyebrow: "— Diferenciais",
    title: "O que nossos clientes buscam?",
    items: [
      { icon: "clock", label: "Agilidade no atendimento" },
      { icon: "plane", label: "Eficiência nos processos de viagens" },
      {
        icon: "creditCard",
        label: "Melhores preços e condições de pagamento",
      },
      { icon: "settings", label: "Soluções operacionais" },
    ],
    mediaChip: "— Corporativo · Lazer · Receptivo",
    mediaNote: ["— atendimento em movimento", "placeholder de imagem/vídeo"],
  },
  atendimento: {
    eyebrow: "— Atendimento",
    title: "O que nós oferecemos?",
    intro:
      "Atendimento as solicitações de maneira adequada e eficiente. Para isso, buscamos entender o perfil e as necessidades de cada cliente individualmente e dar o retorno esperado. Nos colocamos a disposição por diversos meios de comunicação tais como presencial, telefone, WhatsApp, e-mail, para que possamos atender de forma ágil e segura. A Carioca Viagens oferece ainda:",
    cards: [
      {
        variant: "blue",
        index: "01",
        micro: "ASSISTÊNCIA · 24H",
        titleLines: ["ASSISTÊNCIA", "EMERGENCIAL"],
        desc: "plantão para resolver imprevistos a qualquer hora.",
        icon: "headset",
        image: "assistencia",
      },
      {
        variant: "green",
        index: "02",
        micro: "RESERVAS · ONLINE",
        titleLines: ["SISTEMA DE", "RESERVAS ON LINE"],
        desc: "Reserve aéreo e hotel em poucos cliques.",
        icon: "planeTakeoff",
        image: "reservas",
      },
      {
        variant: "dark",
        index: "03",
        micro: "REDE · GLOBAL",
        titleLines: ["MELHORES CANAIS", "DE DISTRIBUIÇÃO"],
        desc: "Tarifas das melhores operadoras do mundo.",
        icon: "handshake",
        image: "aviao",
      },
    ],
  },
  operacional: {
    eyebrow: "— Operacional",
    title: "Nosso operacional",
    corporativo: {
      label: "Corporativo",
      colA: [
        "Reserva de aéreo e hotel on line com self booking (opcional)",
        "Locação de carro",
        "Seguro viagem",
        "Organização de eventos",
        "Locação de sala, equipamentos (som, iluminação, telão, palco, gerador)",
      ],
      colB: [
        "Atendimento emergencial",
        "Relatório de vendas em PDF, Excel e gráficos",
        "Vendas por centro de custo",
        "STUR WEB: plataforma de gestão operacional e financeira.",
      ],
      chips: ["Self booking", "Relatórios", "Centro de custo"],
    },
    receptivo: {
      label: "Receptivo",
      colA: ["Reserva de aéreo e hotel on line"],
      colB: ["Passeios privativos com ou sem guia"],
    },
  },
  clientes: {
    eyebrow: "— Clientes",
    title: "Nossos clientes",
    logos: [
      { name: "Gesel", file: "gesel" },
      { name: "Inpo", file: "inpo" },
      { name: "Miguel Pinto Guimarães Arquitetos Associados", file: "miguel" },
      { name: "Somerj", file: "somerj" },
    ],
  },
  contato: {
    eyebrow: "— Contato",
    title: "Vamos conversar",
    addressLabel: "Nossa sede",
    addressLines: [
      "R. Senador Vergueiro, 116/603",
      "Flamengo - Rio de Janeiro, RJ",
      "22230-001",
    ],
    email: "carioca@cariocaviagens.com.br",
    whatsapp: ["+55 21 99928-6244", "+55 21 98816-6588"],
    instagram: {
      handle: "@carioca.viagens",
      url: "https://www.instagram.com/carioca.viagens/",
    },
    facebook: { handle: "cariocaviagens", url: "#" },
    copyright: "Carioca Viagens © 1999–2026",
  },
} as const

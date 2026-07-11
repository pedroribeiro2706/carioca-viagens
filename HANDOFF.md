# HANDOFF — Carioca Viagens (apresentação digital)

> Atualizado em 2026-07-11. Ver Seção 0 para a mudança mais recente (migração de diretório). Sessão anterior (2026-07-10) revisou criticamente o mockup 08, criou os cards de Atendimento (rodadas 09-10), obteve aprovação final do Pedro para essa seção e produziu `design/design.md`. Objetivo agora: permitir que uma sessão nova ("fresh") inicie a implementação React sem perder contexto.

## 0. Migração de diretório (2026-07-11)

O projeto foi **movido** de:

```
G:\Pedro\Brain\01_Projetos\Carioca Viagens
```

para:

```
G:\Pedro\Dev\Clientes\carioca-viagens
```

**Motivo:** separar o projeto deployável (código, futuro deploy React/Vercel) do vault pessoal `Brain/`, que é PKM/conhecimento, não harness de execução de código. A partir de agora, este projeto deve ser tratado como **aplicação React independente**, com seu próprio repositório Git (inicializado nesta mesma sessão, checkpoint `chore: checkpoint design system aprovado`).

No local antigo (`Brain/01_Projetos/Carioca Viagens`) restou apenas um `MOVED.md` apontando para este novo caminho — todo o conteúdo real vive só aqui agora.

Estado do projeto nesta migração:
- `design/design.md` é o **contrato principal de implementação** (existe, completo, 22 seções).
- `design/mocks/10-cards-refinamento.html` é a **referência visual/técnica aprovada** (ver Seção 6).
- `references/conteudo-apresentacao.md` é a **fonte oficial de conteúdo textual** (ver Seção 3).
- **Todos os pontos `[REVISAR]` do `design/design.md` foram fechados** nesta sessão (contraste dos cards de Atendimento, border-radius, grid de Clientes, breakpoints, ícones de marca — ver Seção 12 e o próprio `design.md`).
- Os **cards de Atendimento já têm as correções finais de contraste aplicadas diretamente no mockup** (`10-cards-refinamento.html`) e documentadas em `design/design.md` Seção 13 — card verde e card azul corrigidos via `color-mix`, ambos passando WCAG AA.
- **Próximo passo real**: implementar React + TypeScript + Vite + Tailwind + shadcn/ui a partir do `design/design.md`.
- **GSAP e Higgsfield ainda não devem ser usados** nesta próxima etapa — entram só depois do layout React estar estável (GSAP) e da necessidade de mídia real (Higgsfield), como já documentado no próprio `design.md`.

## 1. Objetivo do projeto

Construir uma apresentação digital / site de marketing para a Carioca Viagens (agência de viagens no Rio de Janeiro, atuando desde 1999 em corporativo, lazer e receptivo), com uma versão em PDF derivada do mesmo sistema visual posteriormente.

Não é apenas um redesign de slides — o projeto primeiro estabelece um Design System coerente e só depois usa esse sistema para construir a experiência digital responsiva.

Posicionamento central: **"Viagens corporativas com atendimento próximo e operação eficiente."**

Todo o conteúdo visível ao cliente deve estar em português do Brasil.

## 2. Estrutura atual de arquivos

```
Carioca Viagens/
├── CLAUDE.md                          # regras de execução do projeto
├── design-brief.md                    # marca, design system, direção criativa
├── project-card.md                    # contexto estratégico do projeto
├── HANDOFF.md                         # este arquivo
├── handoff-sessao.md                  # handoff de uma sessão anterior (04→v3)
├── .claude/skills/                    # marketing-ui, gsap, shadcn (locais ao projeto)
├── design/
│   ├── mocks/                         # 01 a 10 (ver seção 5)
│   └── design.md                      # Design System completo — contrato de implementação (ver Seção 0)
└── references/
    ├── conteudo-apresentacao.md       # fonte oficial de todo texto visível
    ├── apresentação-...-antiga.pdf    # referência visual/histórica
    ├── apresentação-...-nova.pdf      # referência visual/histórica secundária
    ├── logo-carioca-viagens-*.svg     # logos (coloridas + claras, horizontal + vertical; versões "-nova" são as mais recentes e preferíveis)
    ├── logo clientes/                 # 5 logos reais de clientes (gesel, leonardo, miguel, somerj, wp) — aplicadas desde o mockup 08
    ├── elements/                      # SVGs proprietários de rota (pin/avião "carioca blue", já recoloridos — ver seção 13)
    ├── seções/                        # referências visuais (screenshots + anotações do usuário) para pin/avião/rodapé
    ├── cards/, hero/                  # referências visuais externas (inspiração — card-exemplo-10.png inspirou os cards de Atendimento)
    └── screenshot-0X-*.png            # screenshot mais recente de cada rodada de mockup (ver seção 7)
```

## 3. Documentos principais

- **`CLAUDE.md`** — regras de execução: hierarquia de fontes (conteudo-apresentacao.md > design-brief.md > project-card.md), fluxo criativo obrigatório (3 direções → aprovação → design.md → implementação → motion → responsividade → PDF), regras anti-AI-slop, stack sugerido (React + TS + Vite + Tailwind + shadcn + GSAP).
- **`design-brief.md`** — paleta oficial com hex confirmados, princípios de marca, nota de acessibilidade verificada (contraste do Light Graphite).
- **`project-card.md`** — contexto estratégico/histórico do projeto; em caso de conflito, `design-brief.md` e `conteudo-apresentacao.md` têm prioridade sobre ele.
- **`references/conteudo-apresentacao.md`** — **única fonte autorizada** para todo texto visível ao cliente. Nunca reescrever, resumir ou traduzir esse conteúdo sem pedido explícito (exceção já concedida: as linhas de descrição novas dos 3 cards de Atendimento, ver seção 9).

## 4. Skills instaladas

Locais ao projeto (`.claude/skills/`): **marketing-ui** (guia a direção visual/landing pages — usada em todas as rodadas), **gsap** (motion — ainda não usada, aguardando aprovação de layout), **shadcn** (componentes React — só na fase de implementação).

## 5. Histórico resumido dos mockups (`design/mocks/`)

| Arquivo | O que mudou |
|---|---|
| `01-airport-wayfinding.html` | Direção 1: sinalização de aeroporto, navegacional |
| `02-corporate-carioca.html` | Direção 2: corporativo, humano, azul/verde fortes |
| `03-editorial-journey.html` | Direção 3: editorial, fotografia grande, narrativo |
| `04-sintese-editorial-wayfinding.html` (+ v2, v3) | Síntese: base Editorial Journey + microtipografia/sinalização da Wayfinding. Paleta oficial e logo real aplicados |
| `05-refinamento-visual.html` | Hero atmosférica, cards ricos, ícones Lucide, Fraunces testado em vários títulos, avião/pin numa faixa dedicada |
| `06-ajustes-finos.html` | Separou linha divisória da Hero dos elementos gráficos; removeu Fraunces fora da Hero; corrigiu alinhamento dos cards |
| `07-ajustes-de-compreensao.html` | Avião/pin reposicionados como elementos "entrando" pela lateral; logo do rodapé testada em vertical; 3 cores nos cards |
| `08-ajustes-por-referencia-visual.html` | Avião/pin com SVGs originais; rodapé com logo horizontal; **logos reais de clientes aplicadas**. Última rodada antes da revisão crítica desta sessão |
| `09-cards-atendimento.html` | Pós revisão crítica do mockup 08. Cards de Atendimento redesenhados para estrutura de duas zonas (painel colorido + zona de placeholder), inspirados em `references/cards/card-exemplo-10.png` |
| `10-cards-refinamento.html` | 3 sub-rodadas de ajuste fino nos cards de Atendimento (ver seção 9) até a aprovação final do Pedro. **Arquivo atual/base.** |

## 6. Arquivo HTML mais recente aprovado como base visual

**`design/mocks/10-cards-refinamento.html`**

Não sobrescrever — todas as rodadas seguiram o padrão de criar um novo arquivo numerado a partir do anterior. Qualquer próxima rodada de mockup estático deve gerar `11-*.html` a partir deste. (A próxima etapa de fato, no entanto, é `design/design.md`, não mais um novo mockup — ver seção 11.)

## 7. Screenshot mais recente correspondente

**`references/screenshot-10-cards-refinamento-final.png`** — screenshot da seção Atendimento isolada, capturado depois da aprovação final do Pedro (com a sombra já aplicada). Gerado via Playwright direto do HTML, servido com `python -m http.server` a partir da **raiz do projeto** (não de `design/mocks/` — ver seção 13).

Não existe um screenshot full-page da página inteira nesta sessão (só a seção Atendimento foi recapturada). Antes de qualquer revisão crítica formal futura, gerar um full-page novo do arquivo `10-*.html`.

## 8. Direção visual atual

- **Evolução da Editorial Journey**: a base estrutural do site é a direção 3 (`03-editorial-journey.html`) — editorial, off-white quente, respiro generoso, fotografia/mídia grande.
- **Elementos específicos da Airport Wayfinding** (direção 1) incorporados como camada de microtipografia/sinalização, não como base visual completa: barra de utilidade no topo, eyebrows mono uppercase, chips com pin, labels tipo "RIO · GIG".
- **Paleta oficial** (`design-brief.md`): Carioca Blue `#2E83C5`, Carioca Green `#71B73B`, Light Blue `#51B6E8`, Light Green `#9DC86C`, Graphite `#615E5D`, Light Graphite `#7B7B79`. Sem amarelo. Deep Blue/Ink são tons derivados (não oficiais) — não inventar cores novas fora desse sistema.
- **Logos claras novas**: usar sempre as versões `-nova.svg` — `logo-carioca-viagens-horizontal-lettering-claro-nova.svg` (header e rodapé) sobre fundos escuros, sem plaqueta/caixa. Em fundos claros, usar a versão colorida padrão (`logo-carioca-viagens-horizontal.svg`).
- **Tipografia**: Manrope (títulos), Inter (corpo), IBM Plex Mono (eyebrows/labels/chips/microtítulos). **Fraunces itálico é exclusivo da Hero** ("Sua agência." em itálico, cor light-blue) — tentativas de misturar em outros títulos foram testadas e revertidas por feedback negativo do usuário; não reintroduzir sem pedido explícito.

## 9. Decisões visuais já aprovadas

- O chip mono "CARIOCA VIAGENS" embutido no texto corrido da seção Sobre deve ser **mantido** — é assinatura tipográfica intencional, não ruído (confirmado pelo Pedro em 2026-07-10).
- Os placeholders de mídia com gradiente (Hero, Diferenciais, zona inferior dos cards de Atendimento) são **temporários** — serão substituídos por imagem/vídeo real em etapa posterior, possivelmente via **Higgsfield MCP**. Não travar o tratamento de gradiente como final no design.md.
- Os cards da seção Atendimento agora seguem lógica em **duas zonas** (painel de conteúdo em cima + zona de placeholder de imagem embaixo, proporção ~57%/43% via CSS Grid `fr`), com **título em caixa alta mais leve/elegante** (`font-weight: 200` no Manrope, confirmado no código — o texto de descrição e o numeral mono usam peso ainda mais leve, `font-weight: 100`). Card com formato quadrado (`aspect-ratio: 1/1`), sombra sutil aplicada via wrapper dedicado (ver seção 13).
- A área inferior dos cards permanece **vazia como placeholder de imagem futura** — não é decoração a mais, é uma zona reservada e documentada (cantos-guia no mesmo padrão usado em Hero/Diferenciais).
- **Não é necessário preencher esses placeholders agora.** Pedro confirmou satisfação final com os cards de Atendimento nesta sessão (2026-07-10) — considerar essa seção travada/aprovada, não reabrir sem pedido explícito.

## 10. Pontos provisórios

- A Hero será refinada novamente somente quando houver imagem/vídeo real — tamanho de fonte, enquadramento de mídia e posicionamento final dependem disso.
- Imagens/vídeos serão gerados ou escolhidos em etapa posterior, possivelmente com **Higgsfield** (MCP mencionado pelo Pedro em 2026-07-10 como ferramenta pretendida para essa etapa).
- Clientes: 5 logos reais já estão aplicadas na seção (`references/logo clientes/`: gesel, leonardo, miguel, somerj, wp), mas essa lista pode não ser a versão final — falta definir uma regra de grid flexível (auto-fit/minmax) para quando a quantidade de clientes mudar.
- Responsividade será otimizada depois, na fase de implementação (React + TS + Vite + Tailwind + shadcn + GSAP) — o design.md deve especificar a regra de breakpoint mobile (Pedro confirmou que vale a pena travar isso agora, mesmo sem implementação visual fina ainda).

## 11. Próximo passo recomendado

~~Criar `design/design.md`~~ — **feito** (ver Seção 0). Próximo passo real agora: implementar React + TypeScript + Vite + Tailwind + shadcn/ui a partir do `design/design.md`, usando `10-cards-refinamento.html` como referência visual/técnica. GSAP e Higgsfield continuam fora de escopo até o layout React estar estável.

## 12. Observação técnica importante

**Resolvido em `design/design.md` (Seção 2 e 13).** O mockup `10-cards-refinamento.html` misturava tokens CSS (`var(--...)`) com valores hex hardcoded nos cards de Atendimento. Isso foi endereçado de duas formas:
- Os tons antes soltos foram formalizados como tokens (`--ink-on-dark`) ou corrigidos via `color-mix()` aplicado no seletor específico do componente (cards azul e verde, ver Seção 13 do `design.md` — correção de contraste WCAG AA, já aplicada no mockup).
- `design/design.md` já orienta explicitamente a implementação React/Tailwind a mapear os tokens de forma semântica e evitar hex solto em componentes novos.

`--pale-blue` e `--dark-green` (criados nas rodadas anteriores) estão documentados em `design/design.md` Seção 2, embora ainda não estejam no `design-brief.md` original — tratar `design.md` como fonte de verdade para tokens a partir de agora.

## 13. Armadilhas técnicas conhecidas (adicional — além do solicitado, mas relevante para quem for editar os mesmos arquivos)

- **Servidor local para screenshot**: iniciar sempre na raiz do projeto (`Carioca Viagens/`), nunca em `design/mocks/`. Os assets usam caminho relativo `../../references/...`; servir a partir de `design/mocks/` quebra silenciosamente pin, avião e logos de clientes (404 sem erro visível no HTML/CSS).
- **`overflow: hidden` corta o próprio `box-shadow`**: `.oferta-card` precisa de `overflow:hidden` para cortar a zona de mídia nos cantos arredondados, mas isso também corta a sombra do mesmo elemento. Fix: sombra vive num wrapper externo (`.oferta-card-frame`, sem overflow), clipping fica no card interno.
- **Transparência de token de cor**: aplicar no seletor de uso específico (`color-mix(in srgb, var(--token) 50%, transparent)`), nunca redefinindo a variável — senão todo outro uso do mesmo token herda a transparência.
- **`color: inherit` só funciona se toda a cadeia de ancestrais usar `inherit`**: um único elo intermediário com regra de cor própria (mesmo genérica, tipo `h1,h2,h3{color:var(--ink)}`) quebra a herança para os descendentes abaixo dele. Já causou dois bugs de especificidade nesta sessão (título quase invisível no card preto; descrição em tom acastanhado ilegível por herdar de `.atendimento-center p`). Sempre conferir visualmente (zoom no screenshot) depois de qualquer `color:inherit` novo em componente com texto aninhado.
- **Percentuais de `flex-basis` aninhados não se somam como esperado** — cada `%` resolve contra o container imediato, não o ancestral mais distante. Para proporções verticais/horizontais exatas com mais de um nível de wrapper, preferir CSS Grid com `grid-template-rows`/`columns` em `fr`.
- **Teto matemático de contraste no card azul**: Carioca Blue (`#2e83c5`) limita o contraste máximo de texto claro a ~4:1 — abaixo do AA de 4,5:1 para texto normal, mesmo com branco puro sólido. Fisicamente não dá pra resolver só trocando a cor do texto; exigiria mudar o painel ou o tamanho da fonte.
- **Avião/pin**: sempre referenciar os SVGs originais via `<img src="...">` (`references/elements/pin point carioca blue.svg`, `aviao carioca blue.svg`) — nunca transcrever o `path` manualmente (já causou perda do `stroke-dasharray` e substituição acidental por ícone genérico).
- **Screenshot full-page pode compor errado em página longa** (bug de composição do Chromium headless, não do HTML/CSS) — mitigação: screenshot por `<section>` isolada. Detalhes em `Brain/10_Knowledge/Screenshots de página inteira em ambiente de dev local — Playwright e as armadilhas do vh.md`.
- **Fraunces é exclusivo da Hero** — não reintroduzir em outros títulos sem pedido explícito (já revertido uma vez por feedback negativo).

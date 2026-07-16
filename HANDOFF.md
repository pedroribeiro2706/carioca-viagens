# HANDOFF — Carioca Viagens (apresentação digital)

> Atualizado em 2026-07-15 (fim de sessão) — ver Seção 14 para o estado completo (7 commits + deploy Vercel + 2ª iteração de GSAP implementada e agora **aprovada visualmente pelo Pedro**, ainda **não commitada**) e Seção 15 para o prompt de início da próxima sessão. **Estado crítico a entender antes de qualquer coisa**: a 2ª iteração de GSAP (ScrollTrigger + máscara SVG + rotação por tangente) está implementada, validada programaticamente (lint, build, sobreposição, reduced-motion, resize, cleanup) e **revisada visualmente e aprovada pelo Pedro em 2026-07-15**. A última correção desta sessão foi a **origem de rotação do avião** (`svgOrigin` fixado no `restPoint` — antes o avião girava em torno do canto do bbox do ícone e "descolava" do path até ~88px, parecendo girar antes da curva; agora fica sobre a linha com precisão sub-pixel). O commit ainda **não foi feito** — aguardando autorização explícita do Pedro (Seção 14, subseção "Aprovação visual"). Existe **uma melhoria futura já mapeada e ainda não autorizada**: simplificar/encurtar a trajetória do avião para que o percurso termine antes de a seção sair da viewport — **não implementar sem pedido explícito**. Histórico técnico completo dos ciclos de diagnóstico desta sessão em `C:\Users\Pedro\.claude\plans\expressive-hugging-honey.md` (percurso curto, rotação ausente, clipping) e no plano anterior `C:\Users\Pedro\.claude\plans\declarative-leaping-catmull.md` (arquitetura ScrollTrigger + DrawSVG original). Seção 0 documenta a migração de diretório (2026-07-11).

> **Atualização 2026-07-15 (tarde) — supersede o parágrafo acima quanto ao commit:** a 2ª iteração de GSAP (pin/avião) foi **commitada, publicada em produção (Vercel) e aprovada**. O estado atual da sessão está na **Seção 16** (skill `svg-path-motion` aprovado como v1, eval ambíguo concluído sem revelar falha, validações de triggering/sonda ainda pendentes, próxima etapa Higgsfield). Ler a Seção 16 antes de agir.

> **Ambiente técnico:** antes de trabalhar com Higgsfield, mídia ou configuração de ferramentas (CLI, skills, MCP), ler também `PROJECT_ENVIRONMENT.md` (stack real, ferramental e regras de uso).

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
- Clientes: 5 logos reais já estão aplicadas na seção (`references/logo clientes/`: gesel, leonardo, miguel, somerj, wp), mas essa lista pode não ser a versão final. ~~Falta definir uma regra de grid flexível~~ — **resolvido em 2026-07-12**: grid de colunas fixas por breakpoint (mobile 1 coluna, tablet/desktop/wide 5 colunas), ver `design.md` Seção 15 e Seção 14 abaixo.
- Responsividade será otimizada depois, na fase de implementação (React + TS + Vite + Tailwind + shadcn + GSAP) — o design.md deve especificar a regra de breakpoint mobile (Pedro confirmou que vale a pena travar isso agora, mesmo sem implementação visual fina ainda).

## 11. Próximo passo recomendado

~~Criar `design/design.md`~~ — **feito** (ver Seção 0). ~~Implementar React + TypeScript + Vite + Tailwind + shadcn/ui~~ — **feito e em produção contínua**, ver Seção 14. ~~Revisão visual manual da 2ª iteração de GSAP de pin/avião~~ — **feita e aprovada em 2026-07-15** (ver Seção 14, subseção "Aprovação visual"). Próximo passo real agora: **commit da 2ª iteração de GSAP** (aguardando autorização explícita do Pedro — nada commitado ainda) e, depois, novo deploy Vercel (a versão publicada atual não tem GSAP). A simplificação da trajetória do avião é melhoria futura **não autorizada** — não implementar sem pedido. Higgsfield continua fora de escopo até haver necessidade real de mídia gerada.

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

## 14. Estado da implementação React (atualizado em 2026-07-12, fim de sessão)

### Caminho do projeto

```
G:\Pedro\Dev\Clientes\carioca-viagens
```

### Versionamento

Repositório Git próprio neste diretório (não é submódulo do `Dev/`, é o repo do projeto). **Working tree limpo** — confirmado via `git status` (`nothing to commit, working tree clean`) ao final desta sessão.

Commits principais, em ordem:

1. `chore: checkpoint design system aprovado` — checkpoint do design system antes da migração/implementação.
2. `feat: implementa base React da apresentação` — scaffold Vite + TypeScript, Tailwind configurado, shadcn/ui inicializado como infraestrutura técnica (não define estética), tokens Carioca em `src/index.css`, todos os componentes de seção implementados, assets copiados para `src/assets`.
3. `fix: ajusta responsividade de atendimento e operacional` — primeira rodada de correção de breakpoints nessas duas seções.
4. `docs: registra decisões responsivas e preparação para GSAP` — atualização de `design/design.md` e deste `HANDOFF.md` com as decisões descritas abaixo.
5. `fix: ajusta comportamento responsivo de clientes e elementos gráficos` — grid de Clientes revisado; pin/avião revertidos à posição original aprovada.
6. `chore: adiciona favicon e metadados sociais` (`f7b9287`) — favicon oficial (`public/favicon.svg`, `.ico`, `apple-touch-icon.png`, extraído do ícone já usado no logo `-nova`) e metadados completos em `index.html` (Open Graph, Twitter Card, `theme-color`, `public/og-image.png` 1200×630).
7. `docs: atualiza estado do projeto após metadados` (`ca91972`) — HANDOFF.md corrigido para refletir favicon/metadados concluídos (a versão anterior do handoff estava desatualizada nesse ponto).
8. `chore: ignora configuração local da vercel` (`c36ecf2`) — adiciona `.vercel/` ao `.gitignore` antes do primeiro deploy.

**Working tree após o commit 8 (`c36ecf2`) não está mais limpo** — ver "Trabalho de GSAP em andamento (não commitado)" abaixo.

### Estado atual da implementação

- React + TypeScript + Vite implementado e funcional (`npm run dev`, `npm run build`).
- Tailwind v4 configurado, tokens Carioca mapeados em `src/index.css` (cores, tipografia, radius, hairlines, color-mix dos cards).
- shadcn/ui configurado **apenas como infraestrutura técnica** — só o componente `Button` foi instalado e reescrito com os tokens Carioca (não usa a estética padrão do shadcn); `Badge` avaliado e não instalado por falta de uso real no design.
- Componentes principais implementados: Hero, Sobre, MediaBand, Diferenciais, AtendimentoCards, Operacional, Clientes, ContatoFooter, Button, Chip, Eyebrow, CornerGuides.
- Assets (logos, elementos gráficos pin/avião, logos de clientes) copiados para `src/assets/`.
- `npm run lint` e `npm run build` verificados limpos antes de cada commit desta sessão (lint só com warnings esperados de fast-refresh do shadcn).
- Git limpo ao final da sessão.

### Decisões visuais/estruturais consolidadas

- `design/design.md` é o **contrato principal de implementação**.
- `design/mocks/10-cards-refinamento.html` é a **referência visual/técnica aprovada**.
- `references/conteudo-apresentacao.md` é a **fonte oficial de conteúdo textual**.
- Todos os pontos `[REVISAR]` do `design.md` estão fechados — não há pendência de decisão de design em aberto.
- Cards de Atendimento: contraste corrigido (WCAG AA nos três cards), estrutura em duas zonas preservada, título em caixa alta, numeração, seta diagonal e placeholder de imagem inferior preservados. **Empilham (1 coluna) até 1024px e viram 3 colunas a partir do desktop (1025px+)**.
- Seção Operacional: **empilha (1 coluna) até 1024px e vira 2 colunas a partir do desktop (1025px+)**, mesmo padrão de breakpoint dos cards.
- Item STUR WEB usa a **versão curta do mockup** ("STUR WEB: plataforma de gestão operacional e financeira."), não a versão longa do `conteudo-apresentacao.md` — exceção documentada a pedido do Pedro.
- Grid de Clientes revisado: o grid fluido (`auto-fit`/`minmax`) documentado originalmente em `design.md` Seção 15 foi testado e rejeitado por gerar composições desequilibradas (ex. 4 logos em cima + 1 embaixo). Decisão atual: **mobile 1 coluna (empilhado), tablet/desktop/wide 5 colunas numa linha só** — sem estado intermediário. `design.md` Seção 15 já reflete essa decisão revisada.
- Elementos gráficos de Sobre (pin) e Atendimento (avião): **não devem ser reposicionados por breakpoint como solução final** — essa abordagem foi tentada e revertida a pedido do Pedro. Estão hoje na posição estática original (`right:0`/`left:0`), aceitando sobreposição temporária com o texto em larguras intermediárias. A solução definitiva é uma **animação GSAP futura**: o elemento se desloca sobre a própria trajetória tracejada do SVG, "recuando" pelo path conforme a largura reduz — com a posição calculada a partir da largura atual **já no `mount`**, e recalculada em `resize` (**além de**, não em vez de, reagir ao resize — a maioria dos visitantes carrega a página direto numa largura estreita, sem gerar evento de resize). Especificação completa em `design/design.md` Seções 9 e 19.

### Estado da revisão responsiva

- Revisão manual feita pelo Pedro no navegador (não apenas inspeção de código).
- Cards de Atendimento: corrigidos e aprovados.
- Seção Operacional: corrigida e aprovada.
- Logos de Clientes: testadas e consideradas ok na versão atual (colunas fixas por breakpoint).
- Elementos gráficos de Sobre/Atendimento: comportamento atual aceito como temporário — refinamento real fica para a etapa de GSAP/motion.
- Teste em celular real via rede local foi considerado (`npm run dev -- --host`), mas **não foi confirmado como testado com sucesso** nesta sessão — possível que o Firewall do Windows ou o perfil de rede (pública vs. privada) bloqueie o acesso de outro dispositivo à porta do Vite; se isso ocorrer, é necessário liberar a porta no Firewall ou ajustar o perfil de rede.

### Pendências técnicas conhecidas

- Favicon oficial e metadados básicos: **concluídos** (`f7b9287`) — ver detalhe abaixo.
- Preview/deploy: **feito** (Vercel) — ver "Deploy Vercel" abaixo, com uma ressalva conhecida.
- GSAP: **2ª iteração implementada e validada programaticamente, não commitada, aguardando revisão visual manual do Pedro** — ver seção dedicada abaixo. Este é o item ativo da próxima sessão.
- Higgsfield / mídia real ainda não usado — todos os blocos de mídia continuam placeholder.
- Versão PDF ainda não iniciada.

### Favicon e metadados sociais (concluído em 2026-07-13, commit `f7b9287`)

- Favicon oficial extraído do ícone já usado no logo oficial (`src/assets/logo/logo-horizontal-clara-nova.svg`) — recorte programático via parser XML (sem transcrever paths manualmente), sem alterar cores ou geometria.
- Arquivos gerados em `public/`: `favicon.svg` (vetor), `favicon.ico` (16/32/48px), `apple-touch-icon.png` (180×180, fundo off-white sólido), `og-image.png` (1200×630, cartão Open Graph montado com logo + gradiente institucional + tagline oficial, sem copy nova).
- `index.html` completo com `theme-color`, favicons, Open Graph e Twitter Card. Único placeholder restante é `og:url` (comentado, aguardando domínio de produção pós-deploy).
- Nenhuma referência ao favicon padrão do Vite permanece no projeto.

### Deploy Vercel (concluído em 2026-07-13)

- Projeto `carioca-viagens` criado no escopo pessoal do Pedro (`pedroribeiro2706s-projects`), via `vercel` CLI (login manual do Pedro, deploy disparado por mim).
- URLs: deployment único `carioca-viagens-ep026tnh7-pedroribeiro2706s-projects.vercel.app`, aliasado em `carioca-viagens.vercel.app`.
- **Ressalva conhecida**: mesmo sem `--prod`, o primeiro deploy de um projeto novo é automaticamente promovido a "Production" pela própria Vercel (não há deploy anterior para comparar) — comportamento documentado da plataforma, não erro de comando. Se o Pedro quiser um preview "de verdade" (não-produção), precisa de um segundo deploy com `--target=preview` ou equivalente.
- `.vercel/` corretamente ignorado (`c36ecf2`), sem duplicar a entrada que a própria CLI tentou adicionar automaticamente ao `.gitignore` (revertida para manter o arquivo como commitado).
- Build remoto validado sem erro. Investigação à parte sobre não-determinismo do tamanho do CSS do Tailwind (build local variou 33–145kB entre instalações limpas) foi **encerrada a pedido do Pedro** após validação visual manual dele mostrar consistência entre local e deploy — tratar como hipótese não comprovada, só reabrir se surgir sintoma visual reproduzível (layout quebrado, estilo ausente).

### GSAP — pin/avião: 2ª iteração implementada e validada programaticamente (não commitada, aguardando revisão visual manual)

**Histórico**: a 1ª iteração (`MotionPathPlugin` posicionando por largura, sem scroll, sem revelação de traço) foi diagnosticada como incorreta contra 3 imagens de referência (`aviao-01.png`, `aviao-01b.png`, `aviao-02.png`) e substituída por um plano revisado (`C:\Users\Pedro\.claude\plans\declarative-leaping-catmull.md`). Esse plano foi executado nesta sessão — o que segue é o estado resultante, já revisado por um segundo ciclo de feedback do Pedro (percurso curto, rotação ausente, clipping — diagnosticado e corrigido, plano em `C:\Users\Pedro\.claude\plans\expressive-hugging-honey.md`).

#### Estado da implementação

Animação responsiva e vinculada ao scroll implementada para o avião (seção Atendimento), o pin (seção Sobre) e as respectivas trajetórias tracejadas. Arquitetura (`src/hooks/use-route-motion.ts`):
- GSAP + `ScrollTrigger` (`scrub: true`, `trigger` = seção inteira, `start: "top bottom"`, `end: "bottom top"`) dirigindo um `effectiveProgress` único por elemento.
- Posição do ícone via `getPointAtLength` direto sobre o path da trajetória (não `MotionPathPlugin`/`align` — ver "Correções concluídas" no plano anterior desta mesma sessão; o modo `align`/`alignOrigin: "auto"` do `MotionPathPlugin` calculava o alinhamento a partir do primeiro ponto bruto do `d`, ignorando o `start`/`end` fracionário, e não produzia efeito visual num `<g>` wrapper criado em runtime).
- Rotação do avião (só avião, não pin) via ângulo da tangente do path + offset constante calculado geometricamente a partir do próprio artwork (ponto mais distante do centróide do path do ícone = ponta do bico).
- Máscara SVG (`<mask>` com cópia sólida do path da trajetória) para revelar o tracejado via `DrawSVGPlugin` sem tocar no `stroke-dasharray` autoral do path visível (aplicar `drawSVG` direto no path original sobrescreveria o dasharray por um par segmento/gap, apagando os tracinhos finos — confirmado num spike isolado).
- `useGSAP` (cleanup automático) + `gsap.matchMedia` com breakpoint de visibilidade em 641px e condição `prefers-reduced-motion`.
- SVG inline (`dangerouslySetInnerHTML`) com classes namespaced (`namespaceSvgClasses`) para evitar colisão de `cls-N` entre as duas SVGs na mesma página.
- Cleanup completo: `ScrollTrigger.kill()` por instância, remoção da máscara/`<defs>` criados em runtime, "unwrap" do `<g>` wrapper do ícone (restaura o DOM original), listener de resize removido no ramo reduced-motion.

#### Comportamentos considerados corretos

- O avião começa no ponto correto.
- O scroll controla avanço e recuo (reversível).
- A trajetória é revelada progressivamente; nada aparece à frente do ícone.
- O progresso é responsivo à largura da viewport (tabela de calibração por breakpoint).
- Abaixo de 641px, pin, avião e trajetórias ficam ocultos (`display:none` via CSS, `matchMedia` não monta a lógica de scroll).
- Reduced motion usa posicionamento estático seguro (teto da largura atual, sem `ScrollTrigger`).
- Resize durante o scroll recalcula o estado instantaneamente, sem tween concorrente.
- Os SVGs originais (`aviao-carioca-blue.svg`, `pin-carioca-blue.svg`) permanecem intactos — nenhuma alteração de arquivo, só manipulação de DOM em runtime.

#### Correções concluídas na iteração mais recente (2026-07-14, plano `expressive-hugging-honey.md`)

**Percurso**: o teto (`ceiling`) antigo vinha da calibração estática da 1ª iteração (posição de repouso fixa), nunca revalidado para o modelo scroll-linked, e limitava excessivamente o movimento. Recalibrado via varredura geométrica (`getPointAtLength` + bbox do ícone vs. retângulo real do heading/parágrafo, amostrando todo o intervalo `[0, candidato]` em passos de 2%, com margem de segurança subtraída do maior valor sem sobreposição). Avião: até ~90% do path em 1440px (era 35%). Pin: até ~42% (era 10%). Mapeamento do scroll permanece **linear**, sem easing (decisão explícita do Pedro — ritmo fica para uma rodada separada).

**Rotação**: o avião agora acompanha a tangente da trajetória. Offset calculado a partir da geometria do artwork (não da orientação atual em repouso, que nunca foi validada como correta) e da direção visual do bico. Pin permanece sem rotação (convenção de pin aponta para o local, não para a direção de deslocamento). Validada sem saltos relevantes (0 saltos >15° em 300 amostras ao longo de todo o path).

**Clipping**: causa era o `overflow` implícito (`hidden`) do próprio `<svg>` inline — a bbox do ícone excedia o `viewBox` (~81 unidades no ponto de origem), confirmado matematicamente antes de qualquer alteração (não só assumido). Corrigido com `[&>svg]:overflow-visible` isolado no SVG do avião e do pin. A seção mantém `overflow-hidden` (limite externo da composição, reconfirmado que nada vaza para as seções vizinhas).

#### Correção de origem de rotação do avião (2026-07-15)

Última correção antes da aprovação visual. Sintoma relatado pelo Pedro: o avião parecia **começar a girar antes de alcançar a curva**. Diagnóstico medido no navegador (sonda Playwright read-only, não presumido): o `gsap.set(wrapper, { rotation })` girava o wrapper do ícone em torno do **canto do bbox** (default de origem de SVG no GSAP é `"0% 0%"`), enquanto a translação levava o **centro** do bbox (`restPoint`) até o path. Com origem ≠ ponto de translação, a rotação deslocava o ícone por `[R(θ)−I]·(restPoint − origem)` — módulo `≈ 2·R·sin(θ/2)`, medido em **17 a 88px fora do path** conforme o ângulo. A trajetória e a tangente estavam corretas; o que "descolava" era o desenho do avião, criando a ilusão de linha/curva à frente dele.

Correção (1 linha em `src/hooks/use-route-motion.ts`, logo após `wrapIconParts`, **antes** do primeiro `applyProgress`):
```ts
if (autoRotate) gsap.set(wrapper, { svgOrigin: `${restPoint.x} ${restPoint.y}` })
```
Fixa a origem de rotação no **mesmo `restPoint`** que a translação usa (mesma variável — fonte de verdade única entre posição, reveal e rotação). Aplicada com a matriz ainda em identidade, para o `smoothOrigin` do GSAP não congelar nenhum `xOffset`/`yOffset` de compensação. Gated em `autoRotate`: o **pin não recebe nenhuma mudança de transform** (permanece byte-idêntico). Não altera SVG original, layout, calibração, máscara, breakpoint, reduced motion nem cleanup. `ROTATION_SAMPLE_EPSILON` deliberadamente **não** tocado (decisão do Pedro: só mexer se a antecipação da tangente ainda incomodasse após a origem — não incomodou).

Validação pós-correção (sonda Playwright read-only, 1440/1200/1024px):
- Distância avião ↔ ponto mais próximo do path: **≤ 0,199px** em todas as larguras/posições (era 17–88px).
- `xOffset`/`yOffset` do smoothOrigin: **0** em todas as amostras (nenhuma compensação injetada).
- Varredura de sobreposição refeita (88 combinações): 12 flags de **canto de bounding-box** de avião rotacionado (profundidade máx. 17px horizontal); inspeção visual do pior caso (700px) confirma que o artwork fica na margem esquerda, cauda parando ~16px antes do texto — **sem colisão de pixels**.
- Screenshots 1440px (8 frames, equivalentes a `aviao-04a..h.png`): avião ocupa a ponta do tracejado revelado em cada posição, sem linha à frente; rotação acompanha a tangente.
- `npm run lint` limpo; `npm run build` limpo.

#### Aprovação visual (2026-07-15)

Pedro revisou a implementação no navegador e **aprovou o estado funcional atual**. Comportamentos confirmados corretos por ele:
- Nenhuma trajetória aparece à frente do avião ou do pin; as linhas surgem **apenas atrás** dos elementos.
- O avião segue corretamente o path.
- O avião rotaciona conforme a tangente e **só começa a girar ao chegar à curva**.
- O pin percorre corretamente sua trajetória **sem rotação**.
- Ao voltar o scroll, todas as animações se **invertem de forma contínua**.
- Breakpoint, responsividade, reduced motion e cleanup continuam funcionando.

**Melhoria futura mapeada, NÃO autorizada:** simplificar/encurtar a trajetória do avião para que o percurso termine **antes** de a seção sair da viewport. Nenhuma mudança nessa trajetória foi feita nem autorizada nesta sessão — não implementar sem pedido explícito do Pedro.

#### Validações já executadas

- `npm run lint`: limpo. `npm run build`: limpo.
- 198 combinações largura × progresso (9 larguras × 11 posições de scroll × pin/avião): zero sobreposições com heading/parágrafo.
- Reduced motion: posição idêntica antes/depois de scroll completo (estático confirmado).
- Resize durante scroll: recalcula instantaneamente para o novo teto.
- Cleanup: `ScrollTrigger` morto/revertido ao cruzar o breakpoint de 641px (transform congela, não responde mais a scroll); sem duplicação de `<mask>` sob o double-invoke do React 18 StrictMode (dev).
- Rotação: validada em 300 amostras ao longo de todo o path, sem saltos.

**Estado exato do working tree (`git status --short`, fim desta sessão, nada commitado):**
```
 M HANDOFF.md
 M package-lock.json
 M package.json
 M src/components/sections/atendimento-cards.tsx
 M src/components/sections/sobre.tsx
?? gpt.md
?? references/elements/aviao-01.png
?? references/elements/aviao-01b.png
?? references/elements/aviao-02.png
?? references/elements/aviao-03a.png
?? references/elements/aviao-03b.png
?? references/elements/aviao-03c.png
?? references/elements/aviao-03d.png
?? references/elements/aviao-03e.png
?? references/elements/aviao-04a.png
?? references/elements/aviao-04b.png
?? references/elements/aviao-04c.png
?? references/elements/aviao-04d.png
?? references/elements/aviao-04e.png
?? references/elements/aviao-04f.png
?? references/elements/aviao-04g.png
?? references/elements/aviao-04h.png
?? src/hooks/
```
`gpt.md` continua não relacionado a este trabalho (untracked, origem desconhecida, não tocar). `references/elements/aviao-03a..e.png` (percurso/rotação/clipping) e `aviao-04a..h.png` (revisão da rotação/origem) são as imagens de referência que o Pedro anexou nos ciclos de feedback desta sessão. A subpasta `src/hooks/` (untracked) contém `use-route-motion.ts`, o hook único da animação — inclui a correção de origem de rotação de 2026-07-15.

### Próxima etapa recomendada

1. ~~Revisão visual manual do Pedro~~ — **feita e aprovada em 2026-07-15** (ver subseção "Aprovação visual").
2. **Commit da 2ª iteração de GSAP** — aguardando autorização explícita do Pedro. Nada commitado ainda. Arquivos recomendados para o commit: `src/hooks/use-route-motion.ts` (novo), `src/components/sections/sobre.tsx`, `src/components/sections/atendimento-cards.tsx`, `package.json`, `package-lock.json`, `HANDOFF.md`. **Não** incluir `gpt.md` (alheio) nem as imagens `references/elements/aviao-0*.png` no mesmo commit sem decisão do Pedro sobre versioná-las.
3. Depois de commitado, novo deploy Vercel (a versão publicada atual não tem nenhum GSAP).
4. **Melhoria futura NÃO autorizada**: simplificar/encurtar a trajetória do avião para o percurso terminar antes de a seção sair da viewport — só implementar com pedido explícito.
5. Higgsfield / mídia real.
6. Versão PDF (por último).

## 15. Próximo prompt sugerido

Para iniciar a próxima sessão, usar este prompt:

```
Estamos no projeto Carioca Viagens em:

G:\Pedro\Dev\Clientes\carioca-viagens

Leia primeiro, nesta ordem:

- HANDOFF.md (Seção 14 — subseções "Correção de origem de rotação do avião (2026-07-15)" e "Aprovação visual (2026-07-15)": contexto completo do que já foi feito, por quê, e o que foi aprovado)
- C:\Users\Pedro\.claude\plans\expressive-hugging-honey.md (diagnóstico e correções: percurso, rotação, clipping)
- src/hooks/use-route-motion.ts, src/components/sections/sobre.tsx, src/components/sections/atendimento-cards.tsx (estado atual — 2ª iteração, aprovada visualmente, NÃO commitada)

Confirme `git status` contra o estado exato documentado na Seção 14.

Estado desta sessão: a implementação de pin/avião está pronta, validada programaticamente (lint, build, sobreposição, reduced-motion, resize, cleanup, rotação sem saltos) e **aprovada visualmente pelo Pedro em 2026-07-15**. A última correção foi a origem de rotação do avião (`svgOrigin` no `restPoint`). Nada foi commitado.

Objetivo mais provável desta sessão: **commit da 2ª iteração de GSAP**, se o Pedro autorizar. Comece confirmando com ele se pode commitar.

Passos:
1. Confirme com o Pedro a autorização para commitar (ele pode querer revisar mais uma vez antes).
2. Arquivos recomendados para o commit: `src/hooks/use-route-motion.ts` (novo), `src/components/sections/sobre.tsx`, `src/components/sections/atendimento-cards.tsx`, `package.json`, `package-lock.json`, `HANDOFF.md`. NÃO incluir `gpt.md` (alheio) nem as imagens `references/elements/aviao-0*.png` sem decisão explícita do Pedro sobre versioná-las.
3. Após o commit, considerar novo deploy Vercel (a versão publicada atual não tem GSAP).
4. Melhoria futura mapeada e **NÃO autorizada**: simplificar/encurtar a trajetória do avião para o percurso terminar antes de a seção sair da viewport — só implementar com pedido explícito. Não reabrir percurso, rotação, clipping, calibração ou arquitetura sem motivo concreto novo.

Escopo protegido, não alterar: cards, tipografia, conteúdo, mídia, utility strip, layout geral, Design System, os SVGs originais, ou qualquer animação fora de pin/avião/trajetórias.
```

## 16. Estado atual (2026-07-15, tarde)

- **Animações de trajetória GSAP (pin/avião): concluídas, publicadas e aprovadas.** Commitadas, em produção na Vercel e aprovadas visualmente pelo Pedro (detalhe técnico completo na Seção 14 — subseções "Correção de origem de rotação do avião" e "Aprovação visual"). Este item está **fechado**.
- **Skill `svg-path-motion` aprovado como v1.** Skill reutilizável (`.claude/skills/svg-path-motion/`) que codifica o padrão de mover um elemento ao longo de um path SVG vinculado ao scroll, com revelação atrás e rotação opcional por tangente. Passou por três rodadas de revisão crítica (bugs reais corrigidos: vazamento de máscara, preservação de atributo `mask`, `svgOrigin` antes do primeiro transform, lifecycle/getBBox) e garantias escopadas com honestidade.
- **Eval ambíguo/degenerado concluído sem revelar falha.** Caso adversário (path fechado, repouso no meio, ícone/trajetória ambíguos, artwork sem bico, `<g>` com transform autoral) rodado com skill e baseline. O skill orientou corretamente resolvers explícitos, direção configurada, fonte geométrica única, cleanup/reduced-motion/breakpoint — sem escolher silenciosamente errado. Nenhuma alteração no skill foi necessária.
- **Validações ainda pendentes** (por limitação de ambiente, não por defeito do skill): triggering automatizado (bloqueado por `WinError 10038` no runner paralelo do skill-creator no Windows) e sonda Playwright contra os componentes de eval (sem browser nos subagentes; a sonda já foi validada contra a produção pin/avião). Detalhes, comandos de retomada e critérios objetivos de conclusão em **`.claude/skills/svg-path-motion/PENDING_VALIDATION.md`**.
- **Próxima etapa: Higgsfield** — geração/seleção de mídia real para os placeholders (Hero, Diferenciais, zona inferior dos cards de Atendimento).
- **Depois do Higgsfield**, ainda haverá **mais animações GSAP** em títulos, subtítulos, cards e outros elementos da página — o trabalho de motion não termina no pin/avião.

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

## 17. Fase de mídia Higgsfield — Hero (2026-07-17/18)

> **Antes de tudo, ler `PROJECT_ENVIRONMENT.md` (ambiente/ferramental) e `design/assets/MANIFEST.md`** (proveniência de TODOS os assets gerados: modelo, params, custo, URL, base). O MANIFEST é a fonte de verdade de custos/arquivos desta fase.

### Ambiente Higgsfield (verificado)
- **Plano: Starter** (~**147,5 créditos** ao pausar; **reserva mínima 30** intocável). `seedance_2_0` **exige Pro/Ultimate → bloqueado no Starter**; **`seedance_2_0_mini` roda no Starter** (480p 1cr/s, 720p 2,5cr/s, dur. 4–15s, start+end image, `--generate_audio false`).
- Caminho de execução: **skill `higgsfield-generate` → CLI `higgsfield`** (a skill é wrapper da CLI). O **MCP** também está exposto agora, mas é o **mesmo backend** — não adiciona capacidade; e **não há ferramenta de substituição de fundo em vídeo com máscara controlada** (verificado via `models_explore`). `remove_background` (vídeo) é auto (encaixe incerto).
- Editores de imagem preservativos: **`flux_kontext`** (edição por instrução, **1,5 cr**), `bytedance_image_upscale` (**2 cr**). `topaz_image` falhou 3× sem cobrança (instável em 2026-07-16).

### Hero stills — CONCLUÍDOS E APROVADOS
- Desktop master: **`design/assets/hero/hero-desktop-master-01-4k.png`** (4096×2323).
- Mobile master: **`design/assets/hero/hero-mobile-master-02-4k.png`** (2323×4096).
- Direção "Rota Clara": executivo de costas num terminal de aeroporto ao entardecer/dia, Rio sutil pelo vidro, interior legível, base-esquerda limpa para texto. Masters via upscale `bytedance` de composições `gpt_image_2` (medium/2k).

### Cena 1 — VÍDEO (em andamento, o foco ao pausar)
- **Baseline aprovado (criativo + movimento): `hero-video-scene1-test2-480p.mp4`** (seedance_2_0_mini, start+end, 480p). Seu 1º frame (entardecer Rio) = **`hero-video-scene1-frame1-rio-tarde.png`**; frame final (Londres) foi `...-endend.png`.
- **Melhor iteração de transição: `hero-video-scene1-test6-480p.mp4`** (v6, 6s) — usa os frames do test2 como start/end + reforços: começa no dusk, dusk mais longo, **troca de cidade DURANTE a noite** (Londres acesa ~1s antes do amanhecer), amanhecer só revela. **test3 foi descartado** como referência. Todos os testes em 480p.
- **APRENDIZADO-CHAVE (decisão do Pedro):** **parar a edição generativa de quadro completo** — `flux_kontext` sobre o quadro inteiro **re-renderiza tudo e causa deriva** em enquadramento, executivo, figurantes, **avião/finger**, exposição e geometria. Confirmado nos Quadros 3/4 (o avião/finger sumiram; Londres veio no nível do pátio, não distante).

### NOVA estratégia aprovada: composição por camadas no After Effects
Travar o **vídeo test2** como base e **substituir SÓ a paisagem distante além do pátio**, preservando 100%: interior, executivo, figurantes+movimentos, avião, finger, pista, caixilhos e reflexos.
- **Ferramentas verificadas:** **After Effects 2026 instalado**; **plugin CEP Higgsfield instalado** (`ai.higgsfield.cep` 1.0.36, mira **AE + Premiere**, painel Janela→Extensões→Higgsfield — é painel de **geração**, não de roto/matte); UXP do Photoshop **não confirmado** ativo. Python+numpy+PIL+**ffmpeg bundled** (imageio-ffmpeg) OK; **cv2 ausente** (instalável). ffmpeg só via `imageio_ffmpeg.get_ffmpeg_exe()`.
- **Limite honesto:** o agente **não opera a GUI do AE**. Divisão: **agente prepara** placas de teste + **script `.jsx`** de setup + receita escrita; **Pedro roda o AE** (roto da faixa de céu, composição, render `aerender`). **O ponto crítico é o matte** (separar fundo distante de avião/finger/caixilhos/reflexos) — trabalho manual no AE.
- **Placas:** os frames **Q2/Q3/Q4** (`hero-video-scene1-frame2-rio-noite.png` / `frame3-londres-noite.png` / `frame4-londres-dia.png`) são **só material de teste** (Q3/Q4 provavelmente NÃO encaixam: Londres saiu em escala/altura de pátio, não distante). Se não servirem → **gerar 3 placas dedicadas** (Rio noite / Londres noite sutil / Londres amanhecer), coerentes entre si; **custo ~9 cr** (3× `gpt_image_2` medium/2k @3) — **confirmar custo e parar antes de gerar**. Londres deve ser reconhecível **sutil/distante** (Big Ben/Palace/London Eye), **não hiper-postal**.

### TODO próxima sessão (retomar por aqui)
1. Extrair as faixas distantes de Q2/Q3/Q4 como placas de teste e **avaliar encaixe** (perspectiva/escala/horizonte vs. test2).
2. Escrever a **receita AE** + **script `.jsx`** de setup (import test2, placas, pilha, máscara-semente, keyframes de transição sincronizados à luz interna do test2; re-screen dos reflexos).
3. Se as placas de teste não servirem: **propor custo e gerar 3 placas dedicadas** (parar antes de gerar).
4. Pedro roda a **prova de conceito no AE**.

**Escopo protegido (mantido):** sem alterar código do site, sem integrar assets, sem commit/push/deploy. Nada da fase de vídeo foi commitado. Verificar localização dos `.mp4` no início da próxima sessão (URLs no MANIFEST como backup).

---

## 18. Cena 1 — Parte 1 CONCLUÍDA · virada de estratégia (2026-07-19/20)

> **LER PRIMEIRO:** `docs/higgsfield-playbook.md` (já referenciado no `CLAUDE.md` do projeto, carrega sozinho). Ele contém as lições caras desta fase — qual modelo para qual situação, custos medidos e protocolos obrigatórios. Depois, `design/assets/MANIFEST.md` para proveniência.

### Duas estratégias ABANDONADAS (não retomar sem motivo novo)
1. **Morph Rio→Londres dentro do mesmo plano** — o seedance interpola entre os frames; com frame final de outra cidade, ele **inventa um skyline transitório**. Foi a origem do bug "a cidade virou outra".
2. **Composição por camadas no After Effects** — substituir fundo atrás de sujeito **em movimento**, através de 5+ vãos de vidro, é tarefa real de VFX (garbage matte + Roto Brush). Descartada por custo/benefício. Resíduos (`ae/`, `plates/`) movidos para `old/`.

### Estratégia VIGENTE: frames-âncora
**Controlar a narrativa pelos frames inicial e final; deixar o seedance apenas interpolar.** Se ambos os âncoras são a mesma cidade, o modelo não tem para onde inventar. Validado em 5 gerações consecutivas — o skyline do Rio nunca mais derivou.

### Entregável da Parte 1 (Rio entardecer → Rio noite)
- **Âncora inicial:** `design/assets/hero/hero-video-scene1-frame1-rio-tarde-master.png` (5504×3072)
- **Âncora final:** `design/assets/hero/hero-video-scene1-frame2-rio-noite-master.png` (5504×3072, com correção manual da mão/relógio feita pelo Pedro no Photoshop)
- **VÍDEO FINAL:** `design/assets/hero/mp4/hero-video-scene1-parte1-FINAL-1080p.mp4` (1882×1080 · 5,04s · 24fps · sem áudio)
- **Status:** ⏳ **aguardando aprovação final do Pedro** — única questão aberta: se a suavização do upscale incomoda.

### Divisão de trabalho que funcionou
**IA para relight/síntese · Photoshop para correção determinística.** O Pedro corrigiu no Photoshop (a) um figurante duplicado pela IA e (b) a mão/relógio — ambos comprovados por diff como cirúrgicos (0,099% e 1,18% dos pixels, blocos únicos, zero alteração em skyline/avião). **Inpainting com máscara é do Photoshop; o Higgsfield no Starter não oferece isso.**

### Armadilhas caras descobertas (detalhes no playbook)
- **Duplicação de personagem é sistemática no 720p nativo** (2/2 tiragens) e ausente no 480p (2/2), com os mesmos âncoras. Gatilho: deslocamento excessivo de um personagem entre os frames. **Prompt não segura** (trava anti-duplicação testada e falhou). Custou 25 cr em tiragens descartadas.
- **Solução:** `bytedance_video_upscale` (preset `aigc`) custa **0,1 cr** e preserva o movimento aprovado. ~100× mais barato que insistir no render nativo.
- **PROTOCOLO OBRIGATÓRIO:** em todo render final, **comparar o quadro 0 contra o start-image** antes de aprovar.
- `end_image` é **alvo, não restrição** — o modelo pode ultrapassar a pose final.
- Render em resolução maior é **geração nova, não upscale** — o movimento varia.

### Créditos
Parte 1 custou **47,1 cr**. Saldo: **100,4 cr** (reserva 30 intocada). Plano Starter: `seedance_2_0` e `nano_banana_pro` seguem **bloqueados**.

### ⚠️ PARTE 1 NÃO FECHOU — 3 pistas NÃO TESTADAS (retomar por aqui)

**Veredito do Pedro (2026-07-20):** o `FINAL-1080p` foi **reprovado** — a suavização do upscale ficou excessiva. Estamos perto, mas empacados. **Não concluir que "o modelo é limitado" antes de esgotar estas três pistas** — nenhuma delas foi testada:

1. **Corrigir o GATILHO e re-render nativo.** A duplicação é reprodutível (720p 2/2 sim · 480p 2/2 não, mesmos âncoras) e o gatilho identificado é o **deslocamento excessivo do figurante mais próximo** entre frame1 e frame2. **Nunca tentamos reduzir esse deslocamento.** Caminho: remover/recuar aquele figurante no frame2 (Photoshop — ele passaria a sair de quadro, conceito que o Pedro já aceitou), depois render **nativo em 720p**. Resolveria os dois problemas de uma vez: sem duplicata **e** sem maciez de upscale.

2. **Testar OUTRO modelo de vídeo.** A sessão inteira usou **só `seedance_2_0_mini`**. Candidato mais promissor: **`kling3_0`** — aceita **start-image E end-image** (mesma abordagem de âncoras) e a documentação o descreve para *"cena de plano único sem dinâmica forte"*, que é **exatamente** o nosso plano (câmera travada, movimento sutil). Também não testados: `kling2_6`, `veo3_1`, `grok_video_v15` (só start-image), `seedance_1_5_pro`. **Verificar disponibilidade no Starter e custo antes** (bloqueio de plano falha sem cobrar).

3. **Upscale com `model_version: pro`.** O upscale reprovado usou `standard` (default). O schema oferece `pro` — pode amaciar menos. Custa ~0,1 cr testar.

**Ordem sugerida:** (2) primeiro — é barato descobrir se outro modelo simplesmente não tem o defeito, e resolveria sem retrabalho do Pedro. Se nenhum servir, (1), que é a correção estrutural.

### ATUALIZAÇÃO 2026-07-20 — Kling substituiu o seedance; Parte 1 FECHADA

> A "PARTE 1 NÃO FECHOU" acima está **resolvida**. A pista 2 (testar outro modelo) foi a certa.

- **Upgrade de plano:** Starter → **Plus**. Destravou `kling3_0 --mode pro` (1080p nativo) e demais modelos que estavam gated. Saldo pós-upgrade: ~1000 cr.
- **PARTE 1 — APROVADA (final oficial):** `design/assets/hero/mp4/hero-video-scene1-parte1-kling3-PRO-5s.mp4` (1928×1076, 5s). Substitui o `FINAL-1080p` (upscale) que o Pedro reprovou por maciez. Ressalva aceita: um cruzamento estranho de mãos no gesto do relógio — Pedro deu por satisfeito.
- **Frames-âncora da Parte 1 (com MULHER):** `hero-video-scene1-frame1-rio-tarde-novo.png` (início) e `hero-video-scene1-frame1-rio-noite-novo.png` (fim — apesar do nome, é o frame2/noite). O 2º figurante virou **mulher executiva** (Photoshop, mesma camada nos dois frames = identidade garantida; diff comprovou edição cirúrgica). *Renomear o "-noite-novo" para frame2 algum dia, evita confusão.*
- **`kling3_0` é o modelo de vídeo padrão agora.** Detalhes/custos/limites no `docs/higgsfield-playbook.md` §7 (atualizado hoje).

### PARTE 2 (escurecimento: Rio noite → morro some) — TRAVADA no movimento
- **Objetivo técnico atingido:** `hero-video-scene1-parte2-escurecimento-3s-v2.mp4` (kling pro, 3s) faz a **montanha desaparecer** ficando só as luzes; sem duplicata. Frame final `hero-video-scene1-parte2-frame-final-rio-noite.png` (Pedro escureceu no Photoshop) foi o que garantiu o sumiço.
- **REPROVADO pelo Pedro:** os pedestres **"patinam no mesmo lugar"** (pernas mexem, corpo não translada) porque os dois âncoras têm os personagens na MESMA posição. Lição confirmada e registrada no playbook §7.
- **DECISÃO EM ABERTO (Pedro vai pensar e volta amanhã):** como resolver os pedestres na Parte 2 — reposicioná-los no frame final (Photoshop), OU tirá-los de quadro, OU deixá-los realmente parados de forma crível. **O start-image da Parte 2 é o último quadro EXTRAÍDO do vídeo da Parte 1** (`hero-video-scene1-parte2-frame-inicial-rio-noite.png`), não o frame estático — manter assim para continuidade.

### DECUPAGEM combinada da Cena 1 (4 trechos)
1. Rio entardecer → Rio noite ✅ (Parte 1, aprovada)
2. Escurece até o morro sumir ⚠️ (Parte 2, travada no movimento dos pedestres)
3. Luzes de Londres começam a aparecer (ainda no escuro) — **a troca de cidade acontece aqui**, no escuro, sem contorno de morro que denuncie
4. Dia clareia e revela Londres (avião/pista/água iguais; muda só da água/luzes para cima)

### PRÓXIMO PASSO — Parte 2 (continuação) e depois Parte 3
"**Levamos você ao mundo**" (intenção confirmada pelo Pedro: alcance internacional, **o destino específico não importa**), partindo do frame Rio-noite. **Decisão em aberto, merece brainstorming:** plano novo limpo (gerar um clipe de destino separado e unir por corte/dissolve) × transição editada × outra abordagem. A Parte 1 **funciona sozinha** como asset, então não estamos reféns da Parte 2.

**Escopo protegido:** nada commitado; sem alterar código do site; sem integrar assets em `src/`.

---

## 19. Sessão 2026-07-21 — mídia real na Hero, Band e cards · PUBLICADO

> **LER ANTES DE QUALQUER COISA:** `docs/higgsfield-playbook.md` **§8** (aprendizados desta
> sessão — negação em prompt, estado × relação, ffmpeg de graça) e `design/assets/MANIFEST.md`
> (proveniência e a reorganização de pastas).

### 🚀 O site está NO AR: https://carioca-viagens.vercel.app

Publicado em produção com Hero, Band, cards e rodapé novos. Verificado no site publicado: os dois
vídeos tocando em loop. **PR #1 aberto** — https://github.com/pedroribeiro2706/carioca-viagens/pull/1
(5 commits, branch `feat/midia-hero-band-cards`).

**Atenção à ordem:** a produção foi publicada **direto do branch**, antes do merge, porque o
cliente estava esperando. Mesclar o PR **não muda nada no ar** — só alinha o histórico da `main`,
que ainda está no estado de 13/07.

### DECUPAGEM DO VÍDEO DA HERO — três cenas de momento

**Não existia em documento nenhum antes desta sessão.** A informação estava só na conversa, e o
Pedro teve que reexplicar. Agora está aqui e no MANIFEST.

1. **Cena 1 — saguão do aeroporto.** ⏸️ **EM STAND-BY por decisão do Pedro.** Subdividida em 4
   partes; ver §18. A Parte 2 (`hero-video-scene1-parte2-v4-escuro.mp4`) está tecnicamente
   aprovada (escurecimento no alvo, pedestres transladando) mas **sem veredito visual**.
2. **Cena 2 — avião.** ✅ Executiva branca na poltrona da janela, trabalhando no celular.
   **Entregue:** `reel/mp4/hero-video-scene2-aviao-v2-reverso.mp4` — a v2 cortada em 2,54s e
   **invertida** (ideia do Pedro). A inversão resolveu de graça a queda de expressão, fazendo a
   cena *terminar* no sorriso. Aceita como provisória; o Pedro quer refazer melhor depois.
3. **Cena 3 — carro.** ✅ Executiva negra saindo do carro alugado.
   **Escolhida:** `reel/mp4/hero-video-scene3-carro-4s-camera-acompanha.mp4` — câmera acompanha,
   corpo inteiro em quadro do começo ao fim. A variante com o funcionário da locadora
   (`...-recebe-chave.mp4`) foi **rejeitada**: o funcionário domina o primeiro plano e a
   protagonista vira coadjuvante.

**Reel montado:** `reel/mp4/hero-reel-cena2-cena3-FINAL.mp4` — 6,08s, dissolvência de 0,5s entre
as cenas e fade pelo preto nas duas pontas. É o que está na Hero.

### REORGANIZAÇÃO DE PASTAS

| Pasta | Conteúdo |
|---|---|
| `design/assets/reel/` | **as três cenas do vídeo da Hero** (movidas de `hero/` nesta sessão) |
| `design/assets/hero/` | só os stills da Hero (`stills/`, `mobile/`) + `old/`, `references/`, `photoshop/` |
| `design/assets/cards/` | zonas de mídia dos cards |
| `design/assets/band/` | painel de voos |

**Não movido de propósito:** `hero/photoshop/` guarda PSDs de trabalho do Pedro da Cena 1 —
arquivo do Photoshop pode ter camadas vinculadas por caminho. Decisão dele pendente.

### DECISÃO DE TRATAMENTO: duotone REPROVADO nas imagens dos cards

O duotone foi aprovado como direção em 2026-07-16 e reconfirmado no início desta sessão, mas
**testado contra as imagens finais foi reprovado** — elas vivem de luz e cor quente, e o duotone
destrói exatamente isso (o dourado da janela do avião vira cinza, a madeira da mala vira oliva).
As imagens entraram **cruas**, com overlay preto de 18% que clareia para 6% no hover.

Detalhe técnico em `docs/higgsfield-playbook.md` §8.10.

### PENDÊNCIAS ABERTAS

1. **Conectar a Vercel ao GitHub.** Hoje o projeto é linkado só por CLI: merge no PR **não
   publica**, e cada deploy exige `vercel --prod` manual. Conectar resolve e ainda dá URL de
   preview por PR. É clique no painel da Vercel — só o Pedro pode fazer.
2. **Refazer a medição de contraste da Hero quando a Cena 1 entrar** — a luminância atrás do
   texto muda. Método correto: **mediana** do fundo, não média (ver playbook §8.11).
3. **Band no mobile:** em 390px a faixa fica com 86px de altura. Nada cortado, mas fina. Resolver
   com recorte dedicado, cortado numa **junção entre colunas**.
4. **Cards viram flip-cards** no futuro (decisão do Pedro). Por isso o hover atual é só
   zoom + clareamento — construir mais agora seria retrabalho.
5. **Cena 1 do saguão** entra no reel depois; a Parte 2 aguarda veredito visual.
6. **Arquivos fora do git** que deveriam entrar: `docs/higgsfield-playbook.md` (referenciado pelo
   `CLAUDE.md` do projeto como leitura obrigatória!), `design/higgsfield.md`, e o `CLAUDE.md` e
   `HANDOFF.md` modificados.

### PREFERÊNCIAS DE TRABALHO QUE O PEDRO CORRIGIU NESTA SESSÃO

Registrar porque eu errei nelas repetidamente:

- **Asset gerado vai DIRETO para a pasta do projeto**, nunca para o scratchpad. Ele não tem o
  caminho do scratchpad e não consegue abrir. Errei três vezes.
- **Uma imagem por rodada**, não três. Variantes quase idênticas são desperdício de crédito.
  Três só quando estivermos genuinamente explorando direção.
- **Nunca afirmar sem verificar.** Errei duas vezes hoje de forma grave: disse que a mulher tinha
  passado para a porta do motorista (não tinha, eu deduzi pela posição do farol), e escrevi três
  URLs inventadas no MANIFEST em vez de lê-las dos arquivos.

### PRÓXIMO PROMPT SUGERIDO

```
Projeto Carioca Viagens em G:\Pedro\Dev\Clientes\carioca-viagens

Leia nesta ordem:
- HANDOFF.md Seção 19 (esta sessão: o que foi publicado e o que ficou pendente)
- docs/higgsfield-playbook.md Seção 8 (aprendizados de prompt — evita queimar crédito)
- design/assets/MANIFEST.md (proveniência e organização de pastas)

O site está no ar em https://carioca-viagens.vercel.app com Hero, Band e cards
já com mídia real. PR #1 aberto e não mesclado.

Carregue a skill higgsfield-generate ANTES de gerar qualquer mídia — na sessão
anterior eu não carreguei e isso custou ~10 créditos em renders queimados.

Pergunte ao Pedro por onde ele quer seguir. Os candidatos são: conectar a
Vercel ao GitHub, retomar a Cena 1 do saguão, refazer a Cena 2 com mais
qualidade, o recorte mobile da Band, ou os flip-cards.
```

---

## 20. Sessão 2026-07-22 (manhã) — segundo WhatsApp no rodapé · PUBLICADO · + notas de React no Brain

Sessão curta e de escopo estreito: uma correção de conteúdo pedida pelo Pedro **antes** de começar
a integração Vercel↔GitHub, que continua **não feita** e segue como próximo passo.

### ✅ O que entrou no ar

**Segundo número de WhatsApp no rodapé**, logo abaixo do existente:

| | |
|---|---|
| Número adicionado | `+55 21 98816-6588` |
| Commit | `7311762 feat: adiciona segundo WhatsApp ao rodape` |
| Branch | `feat/midia-hero-band-cards` (já no GitHub; PR #1 recebeu o commit) |
| Deploy | `vercel --prod` → aliased para https://carioca-viagens.vercel.app |

**Como foi implementado** (importa para quem for mexer em contato de novo):

- `src/lib/content.ts` — o campo `whatsapp` **deixou de ser string e virou array**:
  `whatsapp: ["+55 21 99928-6244", "+55 21 98816-6588"]`. Um terceiro número agora custa
  uma linha aqui e **zero** alteração de componente.
- `src/components/sections/contato-footer.tsx` — a `<ul>` do WhatsApp passou a mapear a lista
  (`.map()` com `key={numero}`). Não houve decisão visual nova: o markup já era `<ul>/<li>` com
  um item só, e o `gap-4` do contêiner já definia o espaçamento.
- `references/conteudo-apresentacao.md` — fonte-de-verdade do conteúdo atualizada junto, como
  manda o `CLAUDE.md` do projeto.

**Verificação:** `npm run lint` (só os 3 warnings pré-existentes de fast-refresh em `button.tsx`,
`chip.tsx`, `eyebrow.tsx` — nenhum novo) e `npm run build` passaram. Em produção, baixei o
`index.html` publicado, li qual bundle ele carrega (`/assets/index-Ciniz6i4.js`) e confirmei as
duas strings de telefone dentro dele. Técnica barata e objetiva de verificar deploy sem screenshot
— vale reusar.

### 📚 O Pedro pediu para entender o código, não só receber o resultado

Depois da correção ele pediu o **passo a passo manual** — como faria essa edição sem agente — e
perguntou especificamente sobre: `npm run dev` ser ou não obrigatório, a diferença entre `.ts` e
`.tsx`, e o que é o bundle publicado. Isso virou conhecimento permanente no vault.

**Criado em `G:\Pedro\Brain\10_Knowledge\engineering\react\`** (4 notas atômicas + README, todas
com frontmatter conforme `Templates/Template - Conhecimento.md`):

1. `Conteúdo separado da apresentação em React — o padrão content.ts.md`
2. `JSX e as extensões .tsx e .jsx — por que a extensão importa.md`
3. `Renderizar listas em React com .map() e a função da key.md`
4. `Dev server, build e bundle — os três estados de um projeto Vite.md`

A nota-âncora `10_Knowledge/engineering/Web Apps - Stack e Convenções Kriya.md` ganhou uma seção
"Notas de React" linkando as quatro (o ponto de conexão estava vazio: ela citava React na stack
sem nenhuma nota abaixo), e `engineering/README.md` passou a declarar a subpasta.

> **Preferência registrada:** ao escrever no vault, o Pedro exige título descritivo, frontmatter
> completo e **roteamento pensado** (pasta certa, wikilinks nos dois sentidos) — não aceita nota
> solta. Ele mesmo cobrou isso nesta sessão.

**Divergência encontrada no vault e registrada** em `Brain/context/backlog.md`, seção PKM, como
`[Sprint]`: o campo de maturidade do frontmatter é `status:` na rule path-scoped e no template,
mas `stage:` no `10_Knowledge/INDEX.md` e no `engineering/README.md`. A prática real usa `status:`
— foi o que segui. **Não corrigi** os arquivos divergentes: é manutenção do vault, escopo de uma
sessão do Brain.

### PENDÊNCIAS ABERTAS

Todas as 6 pendências da §19 continuam válidas. A #6 mudou de estado:

1. **Conectar a Vercel ao GitHub** — **segue como o próximo passo recomendado.** Continua sendo
   clique no painel da Vercel, só o Pedro pode fazer. Enquanto não for feito, todo deploy exige
   `vercel --prod` manual e merge do PR não publica nada. Esta sessão publicou pela CLI de novo.
2. Refazer a medição de contraste da Hero quando a Cena 1 entrar (mediana, não média — playbook §8.11).
3. Band no mobile: 86px de altura em 390px, resolver com recorte dedicado cortado numa junção entre colunas.
4. Cards viram flip-cards no futuro — por isso o hover atual é só zoom + clareamento.
5. Cena 1 do saguão entra no reel depois; Parte 2 aguarda veredito visual.
6. **Arquivos fora do git — estado atualizado em 2026-07-22:** `docs/higgsfield-playbook.md`,
   `design/higgsfield.md` e o `HANDOFF.md` **já foram commitados** em `060a62f`. Continuam de fora:
   `CLAUDE.md` (modificado, não commitado), `gpt.md` e `TASK_PROJECT_ENVIRONMENT_AND_GIT_SYNC.md.md`
   (untracked, nunca lidos por mim — o Pedro não pediu), e 18 PNGs em `references/elements/`
   (`aviao-*.png`, untracked). **Esta §20 também está por commitar.**

### Estado do repositório no fim da sessão

`feat/midia-hero-band-cards` está 7 commits à frente de `main`. `main` continua no estado de 13/07.
A produção veio do branch, não da `main` — mesclar o PR **não muda nada no ar**, só alinha o histórico.

### PRÓXIMO PROMPT SUGERIDO

```
Projeto Carioca Viagens em G:\Pedro\Dev\Clientes\carioca-viagens

Leia nesta ordem:
- HANDOFF.md Seção 20 (última sessão) e Seção 19 (o grosso do estado atual)
- docs/higgsfield-playbook.md Seção 8 — SÓ se for gerar mídia
- design/assets/MANIFEST.md — SÓ se for mexer em assets

O site está no ar em https://carioca-viagens.vercel.app, com o segundo WhatsApp
já publicado. PR #1 aberto e não mesclado; produção sai do branch pela CLI.

Comece pela integração Vercel↔GitHub — é o próximo passo acordado e destrava
preview por PR e deploy automático no merge. Parte é clique no painel da Vercel
(só o Pedro faz); me diga o que preparar do lado do repositório.

Se for gerar mídia, carregue a skill higgsfield-generate ANTES — pular isso já
custou ~10 créditos em renders queimados.

Outros candidatos, se o Pedro preferir: retomar a Cena 1 do saguão, refazer a
Cena 2 com mais qualidade, o recorte mobile da Band, ou os flip-cards.
```

---

## 21. Sessão 2026-07-22 (tarde) — integração Vercel↔GitHub CONCLUÍDA · deploy manual encerrado

A pendência nº 1 que arrastava desde a §19 **foi resolvida**. O deploy agora é automático a cada
push; `vercel --prod` deixou de ser necessário.

### ✅ O que ficou pronto

| | |
|---|---|
| Repositório conectado | `pedroribeiro2706/carioca-viagens` → projeto `carioca-viagens` |
| Como foi feito | Vercel GitHub App instalado pelo Pedro + `npx vercel git connect --yes` |
| PR #1 | **MERGED** — merge commit `eff6d4c` |
| Deploy de produção | automático a partir do merge, `● Ready` em 17s |
| `main` local | sincronizada com o remoto, contém tudo que está no ar |

**Fluxo a partir de agora:** push em `main` → produção; push em qualquer outra branch → preview
com URL própria + comentário automático da Vercel no PR.

### A ordem que trava a integração (custou duas tentativas)

`vercel git connect` **falha** enquanto o Vercel GitHub App não estiver instalado na conta GitHub —
e o erro não diz isso ("Failed to connect... make sure there aren't any typos"). Na UI da Vercel o
sintoma é o dropdown **"Select a Git Namespace" aparecer vazio**, com a mensagem "Install the GitHub
application for the accounts you wish to Import from to continue".

**Ordem correta, sempre:**

1. **Install** — https://github.com/apps/vercel/installations/new → conta pessoal → repository access
2. **Connect** — só então o repositório aparece na lista da Vercel (ou `vercel git connect` passa)

Clicar em "Connect Git Repository" antes do Install leva de volta à tela vazia. Foi exatamente o
laço em que a sessão entrou.

**O `gh` CLI não ajuda aqui:** `gh api user/installations` responde **403** — o token OAuth do `gh`
não tem autorização para listar ou instalar GitHub Apps. Verificar instalação de app é ação de UI,
não dá para automatizar por aqui.

### Verificação do pipeline (feita em duas etapas, de propósito)

**Etapa A — preview, sem risco.** Commit de documentação (`b2a69ab`) na branch → push. O deploy de
preview nasceu **10s depois do push**, `● Ready` em 36s, com alias estável por branch. Comprovou o
mecanismo sem tocar em produção. O Pedro abriu e confirmou: idêntico à produção.

**Etapa B — merge, definitiva.** PR #1 mesclado → deploy de produção automático, `● Ready` em 17s.
Produção conferida: HTTP 200 e `98816-6588` presente no bundle.

> **Evidência que vale guardar:** o build da Vercel gerou o **mesmo hash de bundle** do deploy manual
> anterior (`index-Ciniz6i4.js`). O `src/` não mudou nesta sessão — só documentação — e o build remoto
> reproduziu bit a bit o local. O ambiente de build da Vercel está consistente com a máquina do Pedro.

### Armadilhas técnicas novas (as três custaram tempo real)

1. **Previews ficam atrás do Deployment Protection.** A URL de preview responde **302 → `vercel.com/sso-api`**
   para quem não está logado na conta Vercel. Não é erro de build. Se um dia for preciso mandar preview
   para o cliente, liberar em *Settings → Deployment Protection*.
2. **O Bash tool é Git Bash, não PowerShell.** Usar here-string `@'...'@` numa mensagem de commit fez
   o `@` virar a primeira linha da mensagem. Corrigido com `git commit --amend -F <arquivo>`. Para
   mensagem multilinha com acento, o caminho seguro é **escrever num arquivo e passar com `-F`**.
3. **`gh pr merge` é barrado pelo classificador do auto mode**, não por falta de regra de permissão.
   O Pedro destravou rodando `! gh pr merge 1 --merge` no prompt.

### Regra de permissão adicionada

`.claude/settings.local.json` ganhou `"Bash(gh pr merge *)"` (37 regras no total, JSON validado).
O arquivo é ignorado por um `.gitignore` **global** do Pedro — `C:\Users\Pedro/.config/git/ignore`,
linha 3 — então não vai para o repositório e não afeta outras máquinas.

> ⚠️ **Não testada.** O bloqueio original veio do classificador do auto mode, não da ausência da regra.
> Pelo schema das settings a regra deve valer (`autoMode.classifyAllShell` está no padrão, desligado),
> mas isso **só se confirma no próximo merge**. Se ainda pedir permissão, a causa é outra.

### PENDÊNCIAS ABERTAS

A nº 1 saiu da lista. As demais seguem da §19/§20, renumeradas:

1. **Contraste da Hero** — refazer a medição quando a Cena 1 entrar (mediana, não média — playbook §8.11).
2. **Band no mobile** — 86px de altura em 390px; resolver com recorte dedicado cortado numa junção entre colunas.
3. **Flip-cards** — os cards viram flip no futuro; por isso o hover atual é só zoom + clareamento.
4. **Cena 1 do saguão** — entra no reel depois; Parte 2 aguarda veredito visual.
5. **Arquivos fora do git — estado em 2026-07-22 (tarde):** `CLAUDE.md` e `HANDOFF.md` **foram
   commitados** em `b2a69ab`. Continuam untracked: `gpt.md`, `TASK_PROJECT_ENVIRONMENT_AND_GIT_SYNC.md.md`
   (nunca lidos por mim — o Pedro não pediu), 18 PNGs em `references/elements/` (`aviao-*.png`, 3,3 MB)
   e `Vercel.png` na raiz (screenshot que o Pedro salvou durante esta sessão). **Esta §21 também está
   por commitar.** Decisão sobre o destino desses arquivos nunca foi tomada.
6. **A branch `feat/midia-hero-band-cards` continua existindo** local e no remoto, já mesclada.
   Não foi deletada — decisão do Pedro.

### Estado do repositório no fim da sessão

`main` local e remota estão em `eff6d4c`, sincronizadas, e contêm tudo que está em produção. Pela
primeira vez o histórico e o ar batem: não existe mais "produção que veio do branch". O working tree
tem só os untracked da pendência nº 5.

### PRÓXIMO PROMPT SUGERIDO

```
Projeto Carioca Viagens em G:\Pedro\Dev\Clientes\carioca-viagens

Leia nesta ordem:
- HANDOFF.md Seção 21 (última sessão) e Seção 19 (o grosso do estado atual)
- docs/higgsfield-playbook.md Seção 8 — SÓ se for gerar mídia
- design/assets/MANIFEST.md — SÓ se for mexer em assets

O site está no ar em https://carioca-viagens.vercel.app. A integração Vercel↔GitHub
está ATIVA: push em main publica produção sozinho, push em outra branch gera preview.
Não rode `vercel --prod` manual. Estamos na main, sincronizada.

Retomar os ajustes da aplicação. Ordem sugerida na sessão anterior, por impacto visual:
1. contraste da Hero  2. layout mobile da Band  3. flip-cards

Regra do harness global: invocar /frontend-design antes de escrever código de UI e
/superpowers:brainstorming antes de implementar feature nova ou mudar comportamento visual.

Se for gerar mídia, carregue a skill higgsfield-generate ANTES — pular isso já
custou ~10 créditos em renders queimados.
```

---

## 22. Sessão 2026-07-22 (noite) — faxina de arquivos · Clientes atualizada · plano do carrossel Diferenciais

### O que foi feito nesta sessão

| Commit | Conteúdo |
|---|---|
| `f8d5240` | HANDOFF §21 commitado (fechamento da sessão da tarde) |
| `1f41ddb` | Reorganização de `references/`: `historico/` (fora do git, ex-elements + ex-seções), `layouts/` (screenshots), `logo carioca viagens/`, `psd/`; PDFs das apresentações → `docs/`; paths atualizados no CLAUDE.md |
| `3df7332` | Raiz limpa: `gpt.md` e `handoff-sessao.md` removidos (conteúdo integralmente coberto por este HANDOFF), PROJECT_ENVIRONMENT.md atualizado para o deploy contínuo |
| `050c293` | `PASSO-A-PASSO-DESIGN-SYSTEM.md` → `docs/` (instrução consumida, preservada como artefato do processo) |
| `8511e8b` | **Seção Clientes**: saem WP Capital e Leonardo; Gesel substituída por vetor puro (a anterior embutia raster com caminho quebrado e renderizava incompleta); **entra INPO**; grid 5→4 colunas. Verificado no preview local com Playwright antes do push |

Raiz do projeto agora só tem documentos vivos: `CLAUDE.md`, `HANDOFF.md`, `design-brief.md`, `PROJECT_ENVIRONMENT.md`, `project-card.md`. O `TASK_PROJECT_ENVIRONMENT_AND_GIT_SYNC.md` e o `Vercel.png` foram para `references/historico/` / excluídos, respectivamente.

Pendência pequena: o alt text da INPO ficou `"Inpo"` (padrão de "Gesel"/"Somerj"). Confirmar com o Pedro se prefere `"INPO"` em maiúsculas.

### PRÓXIMA TAREFA — carrossel na seção Diferenciais (decidido, NADA executado ainda)

Alvo: o painel de mídia da seção **"O que nossos clientes buscam?"** (Diferenciais) — hoje um placeholder de gradiente com label "ATENDIMENTO EM MOVIMENTO / PLACEHOLDER DE IMAGEM/VÍDEO" e chip "CORPORATIVO · LAZER · RECEPTIVO".

Decisões já tomadas com o Pedro:

- **Formato: carrossel de imagens estilo Instagram** — setas laterais, bolinhas de posição, autoavanço a cada 5s. **Não usar vídeo**: Hero (vídeo) + band (animação) + vetores pin/avião já dão o movimento da página; outro vídeo seria excessivo.
- **Até 5 imagens.** Uma delas é a **foto real da Flavinha Salles, gestora da agência**: `design/assets/diferenciais/flavinha.jpeg` (existe, verificado — atenção: a pasta é `diferenciais`, com "i", não "diferencias").
- **Conteúdo a comunicar**: os 4 diferenciais (Agilidade no atendimento · Eficiência nos processos de viagens · Melhores preços e condições de pagamento · Soluções operacionais) + a amplitude Corporativo · Lazer · Receptivo, mantendo o foco corporativo da apresentação.
- **Requisitos do componente**: pausar autoplay em hover/interação, swipe no mobile, autoplay desligado sob `prefers-reduced-motion`, setas/bolinhas na microtipografia wayfinding (IBM Plex Mono), imagens com a linguagem visual do site (não stock genérico).

Processo obrigatório, nesta ordem — não pular etapas:

1. `/superpowers:brainstorming` — conceito editorial slide a slide (o que cada imagem comunica e como as 5 se distribuem entre os temas) → documento curto de direção por slide.
2. **Aprovação do Pedro** do documento de direção. Não gerar nada antes disso.
3. Ler `docs/higgsfield-playbook.md` **antes** de gerar qualquer imagem (regra do CLAUDE.md; pular isso já custou ~10 créditos em sessões passadas).
4. Gerar as imagens (Higgsfield) conforme a direção aprovada — a foto da Flavinha é real, não gerada.
5. `/frontend-design` antes do código do componente carousel (React).
6. GSAP fica **depois** — as animações de títulos/imagens dos cards são a etapa seguinte ao carrossel, não parte dela.

### Atualização 2026-07-23 (manhã) — brainstorming do carrossel CONCLUÍDO

Design aprovado pelo Pedro e consolidado em
`docs/superpowers/specs/2026-07-23-carrossel-diferenciais-design.md` — **ler esse
spec antes de qualquer execução do carrossel**. Pontos que mudaram desde o plano
original acima: o Pedro preparou `design/assets/diferenciais/flavinha.png` (crop
horizontal já na proporção do painel — usar essa, não a `flavinha.jpeg` vertical);
o slide de Soluções operacionais será gerado **sem tela visível** (gestão de
telas anti-AI-slop, ver spec); alt text da INPO confirmado como `"Inpo"`.
Próximo passo: plano de implementação (skill `superpowers:writing-plans`) →
gerar as 4 imagens (aprovação do Pedro imagem a imagem) → componente → publicar.

### Backlog do projeto

- **Sincronizar slide ativo do carrossel ↔ item da lista de Diferenciais** (o
  item da lista acende quando o slide correspondente está ativo) — ideia do
  brainstorming de 2026-07-23, candidata à etapa GSAP. Não implementar junto com
  o carrossel.

# design.md — Design System, Carioca Viagens

> Consolidação do Design System aprovado ao final das rodadas de mockup 01–10 (`design/mocks/`), com base em `CLAUDE.md`, `HANDOFF.md`, `design-brief.md`, `project-card.md`, `references/conteudo-apresentacao.md` e no arquivo `design/mocks/10-cards-refinamento.html` (referência visual e técnica mais atual).
>
> Este documento é o **contrato de implementação** para a próxima etapa (React + TypeScript + Vite + Tailwind + shadcn + GSAP). Não implementa nada — apenas trava decisões e expõe o que ainda está em aberto.
>
> Convenções usadas abaixo:
> - **[LOCKED]** — decisão aprovada por Pedro, não reabrir sem pedido explícito.
> - **[PROVISÓRIO]** — decisão funcional para seguir adiante, mas com expectativa de revisão (mídia real, Higgsfield, etc.).
> - **[REVISAR]** — ponto identificado nesta sessão que precisa de decisão do Pedro antes ou durante a implementação em React.

---

## 1. Conceito visual final

**[LOCKED]**

- **Base estrutural**: Editorial Journey (`03-editorial-journey.html`) — editorial, off-white quente, respiro generoso, fotografia/mídia grande, ritmo de rolagem narrativo.
- **Camada complementar**: Airport Wayfinding (`01-airport-wayfinding.html`) — não é a base visual, é uma camada de microtipografia e sinalização sobreposta: utility strip no topo, eyebrows mono em caixa alta, chips com pin, labels tipo "RIO · GIG", numeração 01/02/03 nos cards.
- **Posicionamento**: *"Viagens corporativas com atendimento próximo e operação eficiente."* — viagem corporativa com atendimento humano.
- A marca deve parecer moderna, visual, profissional, humana e confiável — nunca uma landing page SaaS genérica, um dashboard, ou turismo clichê.
- A experiência digital tem potencial explícito para imagem, vídeo e microanimação (GSAP) numa etapa posterior — o sistema já reserva espaço e linguagem visual (cantos-guia, chips, media-notes) para isso.

Por que essa combinação funciona para a Carioca:
- **Editorial Journey** dá ritmo, respiro e sofisticação — necessário para não repetir o aspecto "slide antigo" da apresentação de origem.
- **Airport Wayfinding** dá precisão, sinalização e o vocabulário de rota/deslocamento que já está embutido na logo (mapa, caminho, rota).
- A combinação logo + paleta azul/verde institucional + elementos gráficos de rota (pin, avião) torna o sistema proprietário da Carioca — não é um template genérico com cores trocadas.

---

## 2. Paleta oficial e tokens

**[LOCKED]**

Tokens definidos em `design/mocks/10-cards-refinamento.html` (verificados linha a linha nesta sessão):

```css
:root {
  --ink: #0c2132;
  --deep-blue: #0f2c42;
  --carioca-blue: #2e83c5;
  --carioca-green: #71b73b;
  --light-blue: #51b6e8;
  --pale-blue: #e0f0ff;
  --light-green: #9dc86c;
  --dark-green: #39681d;
  --graphite: #615e5d;
  --light-graphite: #7b7b79;
  --off-white: #f7f3ec;
  --sand: #efe6d8;
  --near-black: #141414;
  --hair: rgba(12, 33, 50, 0.14);
  --hair-light: rgba(247, 243, 236, 0.24);
  --display: "Manrope", sans-serif;
  --body: "Inter", sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --accent-serif: "Fraunces", serif;
  --radius: 6px;
}
```

### Papel de cada token

| Token | Hex/valor | Papel |
|---|---|---|
| `--ink` | `#0c2132` | Texto principal e títulos (h1/h2/h3) em fundo claro. |
| `--deep-blue` | `#0f2c42` | Fundos escuros institucionais — Hero, Operacional, Contato. Corresponde ao "Deep Blue" exploratório do `design-brief.md`, agora com hex confirmado pela implementação. |
| `--carioca-blue` | `#2e83c5` | Azul institucional principal — **oficial e locked** (`design-brief.md`). |
| `--carioca-green` | `#71b73b` | Verde institucional principal — **oficial e locked**. |
| `--light-blue` | `#51b6e8` | Acento azul claro — **oficial, papel de apoio**. Linhas, chips e textos em fundo escuro, nunca dominante. |
| `--pale-blue` | `#e0f0ff` | Apoio muito claro para ícones e linhas finas sobre azul (`.icon-blue`, `.oferta-rule`). |
| `--light-green` | `#9dc86c` | Acento verde claro — **oficial, papel de apoio**. Detalhes e labels em fundo escuro. |
| `--dark-green` | `#39681d` | Contraste para texto sobre fundo verde (card verde de Atendimento). |
| `--graphite` | `#615e5d` | Texto de corpo em fundo claro — **oficial e locked**, substitui preto puro. |
| `--light-graphite` | `#7b7b79` | Metadados, legendas e textos secundários — **oficial e locked**, com restrição de uso (ver nota de contraste abaixo). |
| `--off-white` | `#f7f3ec` | Fundo principal claro. |
| `--sand` | `#efe6d8` | Fundo quente da seção Atendimento. Corresponde à "Areia/Creme" exploratória do `design-brief.md` — hex ainda não elevado a status oficial, mas já em uso consolidado nos mockups 09-10. |
| `--near-black` | `#141414` | Card escuro/premium (card 3 de Atendimento) e elementos de alto contraste. Não documentado no `design-brief.md` original — introduzido durante os mockups como neutro adicional. |
| `--hair` | `rgba(12,33,50,0.14)` | Linhas finas/divisórias em fundo claro. |
| `--hair-light` | `rgba(247,243,236,0.24)` | Linhas finas/divisórias em fundo escuro. |

**Nota de acessibilidade herdada do `design-brief.md` (verificada, não recalculada nesta sessão):** `--light-graphite` (`#7b7b79`) contra `--off-white` (`#f7f3ec`) tem contraste de 3,83:1 — passa para texto grande (≥24px, ou ≥19px bold), falha para corpo de texto pequeno. Regra: usar `--light-graphite` só em legendas, eyebrows e labels — nunca em parágrafo pequeno. Para corpo pequeno, usar `--graphite` (5,81:1, passa AA).

### Novos tokens a formalizar (hoje hex soltos no mockup)

O mockup ainda mistura tokens com hex hardcoded em dois pontos específicos (`.oferta-card.card-blue` e `.oferta-card.card-dark`). Para a implementação final, formalizar como tokens nomeados:

| Nome sugerido | Hex | Uso atual no mockup |
|---|---|---|
| `--ink-on-blue` | `#ffffff` | Texto do card azul de Atendimento (`color` do `.oferta-card.card-blue` e `.micro`). **Valor revisado e aplicado** — o hex original do mockup (`#eaf6ff`) foi substituído por branco puro como parte da correção de contraste da Seção 13, já implementada em `10-cards-refinamento.html`. |
| `--ink-on-dark` | `#f0efec` | Texto do card escuro de Atendimento (`color` do `.oferta-card.card-dark`). Sem alteração — contraste já confirmado (16:1). |

A dúvida anterior sobre `--ink-on-blue` (`#eaf6ff`) ser quase idêntico a `--pale-blue` (`#e0f0ff`) fica resolvida como efeito colateral da correção de contraste: com o texto do card azul migrando para branco puro (`#ffffff`), os dois tokens deixam de ser quase-duplicados — `--pale-blue` permanece só para ícone/linha, `--ink-on-blue` passa a ser branco puro dedicado a texto. Nenhuma unificação necessária.

**Regra para a implementação (Tailwind):**
- Evitar valores HEX soltos no código de componentes.
- Usar tokens CSS/Tailwind sempre que possível.
- Um valor hardcoded só deve existir se for deliberadamente documentado como novo token nesta tabela.
- Mapear os tokens acima para o tema Tailwind de forma semântica (ex.: `ink`, `deep-blue`, `brand-blue`, `brand-green`, etc.), não como `blue-500` genérico.

---

## 3. Tipografia

**[LOCKED]**

O `design-brief.md` original sugeria Montserrat/Inter como direção inicial, mas delegava a decisão final a este documento ("Typography must be locked only after the visual direction is approved... documented in design/design.md"). A decisão final, validada nos mockups 04–10, substitui essa sugestão inicial:

- **Manrope** — títulos principais (h1/h2/h3) e componentes editoriais.
- **Inter** — corpo de texto, parágrafos, botões e textos funcionais.
- **IBM Plex Mono** — microtipografia: labels, metadados, chips, eyebrows, elementos de utilidade/wayfinding.
- **Fraunces itálico** — exclusivo da Hero, aplicado apenas em "Sua agência." (`.hero-title-accent`). Tentativas de estendê-la a outros títulos foram testadas e revertidas por feedback negativo do Pedro — **não reintroduzir sem pedido explícito**.

### Regras de aplicação

- Títulos principais (h1/h2) usam `letter-spacing: -0.015em` (h1/h2/h3 no geral) a `-0.03em` (h1 da Hero) — tracking levemente negativo para dar presença sem parecer condensado.
- IBM Plex Mono é sempre usado em caixa alta com letter-spacing positivo (`0.06em`–`0.1em`), para reforçar a sensação de sinalização/wayfinding.
- Os títulos dos cards de Atendimento (`.title-line`) usam Manrope em caixa alta, peso **200** (mais leve que qualquer outro título do sistema) — decisão intencional para um efeito elegante, distinto da hierarquia bold do restante do site. Não generalizar esse peso para outros títulos.
- Evitar misturar mais de 4 famílias tipográficas (já no limite: Manrope, Inter, IBM Plex Mono, Fraunces).
- Hierarquia prioriza clareza e leitura rápida sobre efeito decorativo.

### Escala verificada no mockup

| Elemento | Font | Peso | Tamanho |
|---|---|---|---|
| `h1` (Hero) | Manrope | 800 | `clamp(2.8rem, 6.2vw, 5.2rem)` |
| `h2` | Manrope | 800 | `clamp(1.9rem, 3.2vw, 2.5rem)` |
| `h3` | Manrope | 600 | `1.05rem` |
| `.eyebrow` | IBM Plex Mono | 500 | `0.85rem` |
| `.micro` | IBM Plex Mono | 400 | `0.7rem` |
| `.oferta-title .title-line` (cards) | Manrope | **200** | `1.75rem` |
| `.oferta-desc` (cards) | Inter | **100** | `1.05rem`, `line-height: 1.2` |
| `.oferta-index` (numeral 01/02/03) | IBM Plex Mono | **100** | `2.5em` |
| Corpo (`p`, Sobre) | Inter | 400 | `1.15rem`, `line-height: 1.78` |

**[LOCKED — resolvido]** Os pesos 100/200 usados nos cards de Atendimento (título, descrição e numeral) permanecem deliberadamente leves — essa é uma escolha estética confirmada pelo Pedro, não revertida. O problema de legibilidade que esse peso agravava foi endereçado por correção de cor (Seção 13), não por engordar a fonte. Nota: a descrição (`.oferta-desc`) teve o tamanho ajustado de `0.85rem` para `1.05rem` e o `line-height` de `1.5` para `1.2` (ajuste do Pedro, com o texto também encurtado para caber em 2 linhas) — o peso 100 continua igual.

---

## 4. Logo

**[LOCKED]**

- **Fundo escuro** (Hero, rodapé/Contato): versão horizontal clara nova —
  `references/logo-carioca-viagens-horizontal-lettering-claro-nova.svg`
- **Fundo claro**: versão colorida padrão —
  `references/logo-carioca-viagens-horizontal.svg`
- Nunca usar plaquetas, caixas ou fundos artificiais atrás da logo.
- Presença institucional clara, sem dominar a composição — sempre com respiro generoso ao redor.
- Não distorcer, recolorir ou recriar a logo em código (path manual). Sempre referenciar o arquivo SVG original via `<img>`.

### Aplicações verificadas no mockup

- **Header/Hero**: `.logo-lg` (`width: 200px`), dentro de `.brand`, alinhada à esquerda do CTA "Fale conosco".
- **Rodapé**: `.logo-footer` (`width: 225px`), topo da coluna esquerda de Contato, acima do endereço.
- **PDF** (futuro): aplicação a definir na etapa de preparação do PDF (Seção 22, item 10) — não coberta pelos mockups atuais.

Não existe, nos mockups, aplicação da versão vertical da logo — apenas horizontal. **Não usar logo vertical** (regra explícita também no rodapé, PASSO-A-PASSO Seção 16).

---

## 5. Layout, grid e ritmo

**[LOCKED]**

- Estrutura de landing/presentation page digital — não é uma sequência de slides estáticos.
- Dois contêineres de largura, ambos confirmados no CSS do mockup:
  - `.wrap` — `max-width: 1180px` — conteúdo geral (Sobre, Atendimento).
  - `.wrap-wide` — `max-width: 1440px` — seções wide (Hero, Diferenciais, Operacional, Contato, Clientes).
- Margens laterais de `40px` (`padding: 0 40px`) em ambos os contêineres.
- Ritmo vertical amplo: seções variam entre `72px`–`116px` de padding vertical (`.sobre`: 72/104px; `.atendimento`: 108/116px; `.operacional`: 104px; `.clientes`/`.diferenciais`: 100px; `.contato`: 100/48px).

### Alternância de seções (verificada na ordem real do HTML)

```
Hero (deep-blue, gradiente escuro)
  ↓
Sobre (off-white)
  ↓
Band — faixa de mídia/transição (gradiente azul/verde, 42vh)
  ↓
Diferenciais (off-white)
  ↓
Atendimento (sand)
  ↓
Operacional (deep-blue)
  ↓
Clientes (off-white)
  ↓
Contato (gradiente escuro deep-blue → carioca-blue → carioca-green)
```

Essa alternância clara/escura/sand é o principal recurso de ritmo visual da página — reforça também a divisão entre blocos de conteúdo e blocos de mídia/transição.

- Linhas finas (`--hair` / `--hair-light`) estruturam listas e divisores sem peso visual (`.dif-list`, `.dif-row`, `.op-list li`, `.foot-note`).

### Versão PDF (futuro)

- Virá depois da versão digital estável, derivada deste mesmo sistema.
- Formato editorial 16:9 (conforme `project-card.md` e `CLAUDE.md`).
- A versão digital é a origem/fonte de verdade do sistema — o PDF adapta, não o contrário.

---

## 6. Breakpoints e responsividade

**[LOCKED]**

Escala de breakpoints para a implementação React/Tailwind:

| Nome | Faixa |
|---|---|
| Mobile | até 640px |
| Tablet | 641px–1024px |
| Desktop | 1025px–1439px |
| Wide | 1440px+ |

**Decisão (confirmada pelo Pedro):** manter esta escala de 4 faixas como a definição final, mesmo o mockup `10-cards-refinamento.html` implementando hoje só um único breakpoint (`@media (max-width: 900px)`, que cai no meio da faixa "Tablet"). Isso não volta a ser testado no HTML estático — a implementação React/Tailwind é quem deve testar mobile, tablet, desktop e wide diretamente, já usando a escala completa acima desde o início.

### Regras responsivas (mobile, verificadas no mockup + especificadas no PASSO-A-PASSO)

- Hero mantém impacto visual, mas reduz densidade de metadados no mobile (`.utility-strip .wrap-wide` empilha em coluna).
- Grids de duas colunas viram uma coluna: `.dif-layout`, `.op-cols`, `.contato-columns`, `.sobre-grid` — todos com `grid-template-columns: 1fr` abaixo de 900px.
- Cards de Atendimento (`.oferta-cards`) viram stack vertical (`grid-template-columns: 1fr`).
- `.sobre-rail` muda de coluna para linha (`flex-direction: row`), e a linha pontilhada vertical (`.rail-line`) é ocultada.
- `.dif-media` reduz para `height: 260px` (de `min-height: 340px` no desktop).
- `.logo-grid` (Clientes) vai de 5 para 2 colunas — mas ver Seção 15 para a recomendação de grid fluido.
- `.support-graphic` (pin/avião) é **totalmente oculto** no mobile (`display: none`) — não reduzido, removido.
- Tipografia já usa `clamp()` em h1/h2 — manter esse padrão para escala responsiva sem breakpoints extras de fonte.
- CTAs devem permanecer fáceis de tocar (área mínima recomendada 44×44px — não verificado explicitamente no mockup, aplicar na implementação).
- Ícones e chips devem preservar contraste em qualquer breakpoint.

---

## 7. Hero

**[LOCKED — estrutura]** · **[PROVISÓRIO — mídia]**

Estrutura verificada (`.hero`):

- Fundo escuro com overlay: gradiente radial azul claro (82% 8%) + gradiente linear vertical deep-blue + gradiente diagonal institucional (`#0f2c42 → #2e83c5 → #71b73b`, 128deg). Isso é o **placeholder** de mídia — ver Seção 11.
- **Utility strip** (topo, acima do header): `Carioca Viagens · Rio de Janeiro, RJ` + chip `RIO · GIG` à esquerda; `Operacional desde 1999 · Corporativo · Lazer · Receptivo` à direita.
- **Header integrado à Hero** (não separado): logo horizontal clara (`.logo-lg`) + CTA outline "Fale conosco" no canto superior direito.
- **Hero locus** (chip flutuante, canto superior direito do body): ícone map-pin + "Sede — Flamengo, RJ".
- **Nota de placeholder de mídia** (canto inferior direito, discreta): "— vídeo institucional em loop (placeholder) / imagem de fallback + overlay para legibilidade" — remover em produção.
- **Título**: "Nossa agência." (Manrope 800) + quebra de linha + "Sua agência." em `.hero-title-accent` (Fraunces itálico 700, cor light-blue).
- **Subtítulo**: "Viagens corporativas com atendimento próximo e operação eficiente." (texto oficial de `conteudo-apresentacao.md`, usado aqui como tagline).
- **CTAs**: principal `.btn-solid` "Fale conosco" (ícone check) + secundário `.btn-outline` "Solicite atendimento".
- **Divisória inferior**: linha pontilhada estrutural (`.hero::after`) — ver Seção 8.

### Regras de mídia (placeholder → real)

- Gradiente atual é **temporário** — será substituído por imagem ou vídeo institucional real, possivelmente via Higgsfield (Seção 20).
- Vídeo, quando implementado: 6–10s, loop contínuo, tema atmosférico de mobilidade corporativa (aeroporto, janela de avião, chegada na cidade), sempre com fallback estático.
- Overlay deve ser preservado para garantir contraste do texto sobre a mídia.
- Evitar clichê genérico de Hero de SaaS (gradiente decorativo sem relação com a marca) — o gradiente atual já usa as cores institucionais reais (`--deep-blue`, `--carioca-blue`, `--carioca-green`), não uma paleta arbitrária.
- Tamanho de fonte, enquadramento de mídia e posicionamento final do H1 serão reavaliados quando a mídia real entrar (`HANDOFF.md` Seção 10).

---

## 8. Linha pontilhada divisória

**[LOCKED]**

- Elemento estrutural de transição entre Hero e Sobre — implementado como `.hero::after`, um pseudo-elemento absoluto de `3px` de altura na borda inferior da Hero.
- CSS verificado: `repeating-linear-gradient(90deg, var(--light-blue) 0 12px, transparent 12px 26px)`, `opacity: 0.9`.
- É **diferente** dos elementos gráficos de apoio (pin, avião, rotas curvas da Seção 9) — este é reto, horizontal, sempre presente, e funciona como fronteira formal entre seções.
- Presença sutil mas visível — não decorativa, é sinalização estrutural (linguagem Wayfinding).
- Cor: `--light-blue` (usado aqui porque a Hero é fundo escuro). Em uma futura aplicação sobre fundo claro, usar `--carioca-blue`.
- Candidata natural a animação GSAP futura via `stroke-dashoffset` ou técnica equivalente para dar sensação de "traçado" — não implementada ainda (Seção 19).

---

## 9. Elementos gráficos de apoio: pin, avião e rotas curvas

**[LOCKED]**

Arquivos de referência (verificados em `references/elements/`):
- `pin point carioca blue.svg`
- `aviao carioca blue.svg`

Regras de uso:
- Elementos proprietários de apoio visual — **não são** a linha divisória estrutural da Seção 8.
- Aparecem hoje em duas seções, um por vez (não precisam aparecer juntos nem em todas as seções):
  - **Sobre** (`.sobre .support-graphic`): pin, `top: 40px; right: 0; height: 160px`.
  - **Atendimento** (`.atendimento .support-graphic`): avião, `top: 50px; left: 0; height: 265px`.
- Cada elemento deve parecer "entrar" na composição vindo de fora da tela — trajetória tracejada curva começa fora da tela, objeto principal fica dentro.
- Não devem sobrepor textos, cards, placeholders ou conteúdo principal — ocupam áreas vazias laterais.
- Cor oficial: Carioca Blue (os arquivos já vêm recoloridos como "carioca blue").
- **Sempre referenciar via `<img src="...">`** — nunca transcrever o `path` manualmente. Já causou perda de `stroke-dasharray` e substituição acidental por ícone genérico em uma rodada anterior (`HANDOFF.md` Seção 13).
- Ocultos completamente no mobile (`display: none` abaixo de 900px) — não reduzidos.
- Candidatos a animação discreta futura via GSAP (Seção 19).

**[PROVISÓRIO — decisão de 2026-07-12, aguardando implementação GSAP]** Na implementação React atual, pin e avião estão fixos na posição original desta seção (`right:0`/`left:0`), o que causa sobreposição visual com o texto em larguras intermediárias (tablet/desktop estreito). Isso foi identificado, uma correção estática via CSS foi tentada e revertida a pedido do Pedro — a posição correta não é um valor fixo por breakpoint, e sim uma animação: o elemento deve se mover **sobre a própria trajetória tracejada**, recuando ao longo do path conforme a largura reduz, em vez de saltar entre posições. Ver especificação completa na Seção 19.

---

## 10. Seção Sobre

**[LOCKED]**

Estrutura verificada (`.sobre`):

- Fundo `--off-white`.
- Grid de duas colunas: `.sobre-grid` (`64px 1fr`) — trilho à esquerda (`.sobre-rail`, ícone map-pin + linha pontilhada vertical decorativa) + conteúdo à direita.
- Microtítulo: `.eyebrow` "— Sobre".
- Título: "Olá, muito prazer" (h2).
- Texto: conteúdo oficial da seção 01 de `references/conteudo-apresentacao.md`, reproduzido literalmente no mockup — verificado idêntico.
- Dentro do texto, o chip inline `.chip-inline` "Carioca Viagens" deve ser **mantido** — é assinatura tipográfica intencional, confirmada pelo Pedro em 2026-07-10, não é ruído decorativo.
- Pin (`.support-graphic`) aparece como apoio visual lateral, canto superior direito.
- Leitura confortável: `font-size: 1.15rem`, `line-height: 1.78`, `max-width: 680px` — sem excesso de decoração.

No mobile: `.sobre-grid` colapsa para uma coluna, `.sobre-rail` muda para linha horizontal e a linha pontilhada vertical some.

---

## 11. Blocos de mídia

**[PROVISÓRIO]**

Todos os blocos de mídia abaixo são placeholders com gradiente institucional (azul/verde) — **nenhum é tratamento final**:

| Bloco | Localização | Papel |
|---|---|---|
| Hero | `.hero` (background) | Atmosfera de abertura — mídia full-bleed futura. |
| Band | `.band`, entre Sobre e Diferenciais | Faixa de transição, `42vh`, nota "placeholder de fotografia/vídeo · viagem corporativa". |
| Diferenciais | `.dif-media` | Painel de mídia lateral, com cantos-guia, chip "Corporativo · Lazer · Receptivo" e nota "atendimento em movimento". |
| Cards de Atendimento | `.oferta-media` (zona inferior de cada card) | Reservado para imagem futura por card — sem label/chip, só cantos-guia. |

Regras:
- Evitar repetir o mesmo gradiente como solução visual "final" em várias seções — hoje ele é aceitável porque está explicitamente marcado como placeholder (media-notes, cantos-guia), não porque é a escolha estética definitiva.
- Cantos-guia (`.corner.tl` / `.corner.br`), labels mono e overlays são a linguagem visual de placeholder do sistema — reutilizar esse padrão para qualquer novo bloco de mídia futuro, para manter consistência.
- Mídia real será adicionada em etapa posterior, possivelmente via Higgsfield (Seção 20) — **não usar Higgsfield nesta etapa**.
- Sempre prever fallback estático quando a mídia final for vídeo.

---

## 12. Seção Diferenciais

**[LOCKED]**

- Layout de duas colunas no desktop (`.dif-layout`, `1fr 1fr`, `gap: 64px`): lista à esquerda, mídia à direita.
- Lista (`.dif-list`) com linhas finas (`border-top`/`border-bottom: 1px solid var(--hair)`), cada linha (`.dif-row`) com ícone semântico (`clock`, `plane`, `cards`, `gear`) + texto (Manrope 600, 1.2rem).
- Conteúdo (idêntico a `conteudo-apresentacao.md` seção 02): Agilidade no atendimento · Eficiência nos processos de viagens · Melhores preços e condições de pagamento · Soluções operacionais.
- Painel de mídia (`.dif-media`): cantos-guia, chip `on-dark` "— Corporativo · Lazer · Receptivo", nota "atendimento em movimento / placeholder de imagem/vídeo".
- Mídia deve receber imagem/vídeo real no futuro — evitar que o painel pareça caixa vazia (por isso os cantos-guia + chip + nota, que dão função visual mesmo sem imagem).
- No mobile: lista e mídia empilham (`grid-template-columns: 1fr`), mídia reduz para `height: 260px`.

---

## 13. Cards de Atendimento

**[LOCKED]**

Padrão aprovado no mockup 10, componente `.oferta-card` dentro de `.oferta-card-frame`:

- **Duas zonas por card**: área superior informativa/editorial (`grid-row: 1` a `3`, cabeçalho + linha + título + linha + numeral/descrição/seta) + área inferior reservada para imagem futura (`.oferta-media`, `grid-row: 5`).
- Estrutura de linhas via CSS Grid `grid-template-rows: 27fr 10fr 20fr 3fr 40fr` — proporção vertical exata definida em `fr` sobre a altura própria do card (que vem de `aspect-ratio: 1/1`), não em `%` aninhado. Essa escolha corrigiu um bug de proporção de uma rodada anterior (percentuais de `flex-basis` aninhados não somam como esperado — ver `HANDOFF.md` Seção 13).
- Cards quadrados (`aspect-ratio: 1/1`) no desktop.
- **Cantos arredondados — dois raios diferentes, intencional**: `border-radius: 10px` no `.oferta-card` (cantos mais fechados, ajuste do Pedro nesta rodada — era 20px) e `border-radius: 30px` no `.oferta-card-frame` (sombra mais suave e generosa). A divergência entre os dois valores **é decisão deliberada**, não resíduo do refactor: o wrapper usa um raio maior propositalmente para produzir uma sombra mais suave, enquanto o card interno usa um raio menor para o clipping da mídia e para os cantos gerais ficarem menos arredondados. Não unificar os dois valores.
- **Sombra vive no wrapper** (`.oferta-card-frame { box-shadow: 9px 12px 16px -9px rgba(12,33,50,0.5) }`), nunca no `.oferta-card` — porque este último precisa de `overflow: hidden` para clipar a zona de mídia, e `overflow: hidden` corta a própria sombra do elemento que a define (armadilha documentada em `HANDOFF.md` Seção 13).
- Variação cromática entre os três cards — cores de texto revisadas nesta rodada por acessibilidade, ver subseção de contraste abaixo:
  - `card-blue` — fundo `--carioca-blue`, texto `#ffffff` branco puro (era `#eaf6ff`; ver Seção 2, token `--ink-on-blue` atualizado).
  - `card-green` — fundo `--carioca-green`, texto em `--dark-green` escurecido via `color-mix` (era `--dark-green` puro).
  - `card-dark` — fundo `--near-black`, texto `#f0efec` (novo token `--ink-on-dark`) — sem alteração.
- Microtítulo IBM Plex Mono (`.micro`, ex. "ASSISTÊNCIA · 24H").
- Título em caixa alta, peso 200 (`.title-line`), quebrado em duas linhas com uma linha fina (`.oferta-rule.title-rule`) entre elas.
- Numeração `01`/`02`/`03` (`.oferta-index`, IBM Plex Mono, peso 100, `2.5em`).
- Descrição curta (`.oferta-desc`, Inter, peso 100, `1.05rem`, `line-height: 1.2` — aumentada e mais compacta nesta rodada, era `0.85rem`/`1.5`). `.oferta-text` usa `max-width: 100%` (era `75%`) — o texto não precisa mais de um teto artificial porque o `.oferta-row` já é flex com o ícone de seta em largura fixa (`52px`, `flex-shrink: 0`), então a descrição naturalmente ocupa só o espaço restante.
- Seta diagonal (`.oferta-arrow`, ícone `i-arrow-up-right`).
- Ícone semântico por card (`headset`, `plane-takeoff`, `handshake`).
- Cantos-guia (`.oferta-media .corner`) na área de mídia inferior, ainda vazia.

### Conteúdo dos três cards (verificado no mockup, expansão funcional da fonte oficial)

| # | Título | Microtítulo | Descrição | Fonte oficial correspondente |
|---|---|---|---|---|
| 01 | Assistência Emergencial | ASSISTÊNCIA · 24H | "plantão para resolver imprevistos a qualquer hora." | "Suporte emergencial" — seção 03 |
| 02 | Sistema de Reservas On Line | RESERVAS · ONLINE | "Reserve aéreo e hotel em poucos cliques." | "Sistema de reservas on line" — seção 03 |
| 03 | Melhores Canais de Distribuição | REDE · GLOBAL | "Tarifas das melhores operadoras do mundo." | "Parceria com os melhores canais de distribuição do mundo" — seção 03 |

Descrições encurtadas pelo Pedro nesta rodada (01 perdeu "pronto"; 02 perdeu "com agilidade e") especificamente para caber com folga em 2 linhas. São expansões funcionais provisórias derivadas do conteúdo oficial (exceção explícita já aprovada à regra de não reescrever `conteudo-apresentacao.md`) — se o texto final precisar ser 100% literal, revisar antes da produção.

A área inferior (`.oferta-media`) permanece vazia por enquanto porque receberá imagem futura — não é decoração a mais, é zona reservada e documentada. Na implementação React, o componente de card deve aceitar uma prop de imagem opcional para essa zona.

### Contraste de texto — decisão final

Cálculo original (fórmula WCAG de luminância relativa) e o efeito das mudanças de fonte desta rodada:

| Card | Fundo | Texto original | Contraste original | Efeito do aumento de fonte (0,85rem→1,05rem) |
|---|---|---|---|---|
| `card-blue` | `#2e83c5` | `#eaf6ff` | 3,7:1 | **Nenhum.** 16,8px continua abaixo do limiar de "texto grande" do WCAG (24px) — a exigência continua sendo 4,5:1, e o contraste é só função de cor, não de tamanho. |
| `card-green` | `#71b73b` | `#39681d` | 2,69:1 | Nenhum, mesma razão. |
| `card-dark` | `#141414` | `#f0efec` | 16,02:1 | Já passava com folga; irrelevante. |

**Card verde — [LOCKED]:** cor de texto escurecida. Em vez de redefinir o token `--dark-green` globalmente (ele só é usado dentro do card verde hoje, mas a regra geral da Seção 2 é nunca redefinir o token base, e sim aplicar `color-mix` no seletor de uso), aplicar nos dois seletores que usam `--dark-green` dentro do card verde:

```css
.oferta-card.card-green,
.oferta-card.card-green .micro {
  color: color-mix(in srgb, var(--dark-green) 60%, black 40%);
  /* equivalente a ~#223e11 */
}
```

Contraste resultante contra o fundo `--carioca-green` (`#71b73b`): **4,84:1** — passa AA para título (28px), micro (11px) e descrição (16,8px) simultaneamente, com uma única mudança de cor. Fundo do card verde **não muda**. Verificado nesta sessão com o mesmo método de cálculo.

**Card azul — [LOCKED, aplicado no mockup]:** ao contrário do verde, o azul tem um teto físico de contraste — mesmo com texto branco puro (`#ffffff`, o máximo teoricamente possível), o contraste contra `--carioca-blue` (`#2e83c5`) chegava a apenas ~4,06:1, ainda abaixo de 4,5:1 (achado já registrado em `HANDOFF.md` Seção 13 na sessão anterior, reconfirmado aqui). Corrigir só a cor do texto não era suficiente para este card — foi necessário escurecer também o painel, no mesmo espírito da correção do verde:

```css
.oferta-card.card-blue {
  background: color-mix(in srgb, var(--carioca-blue) 93%, black 7%);
  /* equivalente a ~#2b7ab7 — escurecimento sutil, 7% */
  color: #ffffff; /* era #eaf6ff */
}
```

Contraste resultante: **4,59:1** — passa AA. O escurecimento de 7% no fundo é discreto e não altera a identidade do azul institucional fora deste componente específico (aplicado só no seletor do card; `--carioca-blue` global permanece intocado).

**Ajuste adicional feito na mesma correção:** o micro-label do card azul (`.oferta-card.card-blue .micro`) usava `var(--pale-blue)` (`#e0f0ff`), que mesmo contra o novo fundo mais escuro ficava em ~3,96:1 — ainda abaixo de 4,5:1 para texto pequeno (11,2px). Alterado para `#ffffff` (mesmo tom do texto principal do card), alcançando os mesmos **4,59:1**. Não fazia parte do pedido original, mas é consequência direta de aplicar a mesma correção de forma consistente — sem isso, o card ainda teria uma falha WCAG residual não intencional.

Estado atual: as três cores de texto dos cards de Atendimento (`card-blue`, `card-green`, `card-dark`, incluindo os respectivos `.micro`) passam AA. Já aplicado em `design/mocks/10-cards-refinamento.html`.

Ver também Seção 22.

---

## 14. Seção Operacional

**[LOCKED]**

- Fundo `--deep-blue`, texto `--off-white`.
- Microtítulos IBM Plex Mono, labels em `--light-green`.
- Listas com checkmarks (`i-check`), linhas finas (`--hair-light`).
- Chips operacionais: "Self booking", "Relatórios", "Centro de custo".
- Organização verificada no mockup (`conteudo-apresentacao.md` seção 04):
  - **Corporativo**: duas colunas internas — 5 itens (reserva aéreo/hotel self booking, locação de carro, seguro viagem, organização de eventos, locação de sala/equipamentos) + 4 itens (atendimento emergencial, relatórios PDF/Excel/gráficos, vendas por centro de custo, STUR WEB) + chips.
  - Divisor (`.op-divider`).
  - **Receptivo**: duas colunas internas, 1 item + 1 item (reserva aéreo/hotel online; passeios privativos com ou sem guia).
- Seção já considerada madura pelo histórico do projeto — evitar áreas vazias e colunas desbalanceadas ao revisar.

---

## 15. Seção Clientes

**[LOCKED — estrutura visual]** · **[LOCKED — decisão técnica de implementação]**

- Fundo `--off-white`, título centralizado com eyebrow "— Clientes" / "Nossos clientes".
- 5 logos reais aplicadas: gesel, leonardo, miguel (Miguel Pinto Guimarães Arquitetos Associados), somerj, wp (WP Capital).
- O mockup estático usa `grid-template-columns: repeat(5, 1fr)` (fixo) só porque é uma exploração visual sem necessidade de lidar com uma lista dinâmica — isso **não muda a direção visual nem o mockup HTML**.
- **Decisão técnica para a implementação em React (revisada em 2026-07-12, substitui a decisão original abaixo):**
  - Testado em React com grid fluido `auto-fit`/`minmax` — na prática, o `auto-fit` reorganiza continuamente conforme a largura e passa por composições intermediárias desequilibradas (ex.: 4 logos em cima + 1 embaixo), o que o Pedro rejeitou visualmente.
  - Substituído por **colunas fixas por breakpoint**, já que a lista de clientes hoje é fixa em 5: **mobile (até 640px) 1 coluna** (empilhado verticalmente, igual ao padrão dos cards de Atendimento), **tablet e desktop/wide (a partir de 641px) 5 colunas** numa linha só — sem estado intermediário de 2 ou 3 colunas.
  - Preferir os arquivos `.svg` (já existentes em `references/logo clientes/`) em vez dos `.png` — já aplicado, com uma exceção: `wp.svg` está quebrado (referencia um arquivo externo fora do projeto) e usa `wp.png` como fallback até que um SVG válido seja fornecido.
  - ~~Decisão original (2026-07-11, obsoleta): grid fluido com `auto-fit`/`minmax` (`repeat(auto-fit, minmax(160px, 1fr))`).~~ Mantida aqui só como histórico — não reintroduzir sem novo pedido explícito.
- Logos devem ser normalizadas em peso óptico (tratamento consistente, preferencialmente monocromático ou com contraste equalizado) — ainda não verificado se os 5 arquivos atuais já têm esse tratamento aplicado.

---

## 16. Rodapé / Contato

**[LOCKED]**

- Fundo escuro/gradiente institucional (mesmo gradiente diagonal da Hero: `deep-blue → carioca-blue → carioca-green`, com overlay adicional).
- Título "Vamos conversar".
- Duas colunas (`.contato-columns`):
  - **Esquerda** (`.contato-brand-col`): logo horizontal clara (`.logo-footer`) + label "Nossa sede" + endereço completo (R. Senador Vergueiro, 116/603, Flamengo - Rio de Janeiro, RJ, 22230-001).
  - **Direita** (`.contato-info-col`): três grupos de contato — E-mail (carioca@cariocaviagens.com.br), WhatsApp · Telefone ((21) 98816-6588 / (21) 2221-1410), Redes sociais (Instagram @carioca.viagens, Facebook cariocaviagens).
- Labels em IBM Plex Mono (`.micro`), ícones consistentes (mesma sprite SVG do restante do site).
- Usar sempre a logo horizontal clara nova — **nunca a versão vertical**.
- `.foot-note`: copyright "Carioca Viagens © 1999–2026" + nota de identificação do mockup ("Mockup 10 — Cards Refinamento — não implementado") — **remover a nota de mockup em produção**, manter apenas o copyright.
- No mobile: `.contato-columns` colapsa para uma coluna; `.contato-info-col` perde `height: 100%` e ganha `gap: 36px`.

---

## 17. CTAs, chips e botões

**[LOCKED]**

- **CTA principal** (`.btn-solid`): fundo `--carioca-green`, texto `--deep-blue`, hover `opacity: 0.88`.
- **CTA secundário** (`.btn-outline`): borda `--hair-light`, texto `--off-white`, fundo transparente, hover `background: rgba(0,0,0,0.3)`. Variante `.on-light` (borda/texto `--carioca-blue`) para uso sobre fundo claro.
- Todos os botões: `border-radius: var(--radius)` = **6px**, padding `14px 26px`, Inter 500.
- Estado `:focus-visible`: `outline: 2px solid var(--light-blue); outline-offset: 2px` — acessibilidade de teclado já coberta no mockup.
- Chips (`.chip`): IBM Plex Mono, borda fina 1px `--carioca-blue` (ou `--light-blue` na variante `.on-dark`), `border-radius: 3px` (nota: diferente do `--radius` de 6px dos botões — os chips usam um raio menor e mais "quadrado", intencionalmente).
- Evitar botões genéricos — o par verde-sólido/outline-claro já é suficientemente distintivo da marca; não introduzir um terceiro estilo de botão sem necessidade.

---

## 18. Ícones

**[LOCKED — direção]** · **[PENDENTE — migração técnica, ver Seção 22]**

- Biblioteca principal para a implementação React: **lucide-react**.
- O mockup atual usa uma sprite SVG inline (`<symbol>` no `<body>`) com ícones customizados, mas **os paths já correspondem ao icon set Lucide** (verificado nesta sessão comparando a geometria dos paths): `i-clock`, `i-cards`, `i-gear`, `i-check`, `i-mail`, `i-phone`, `i-headset`, `i-plane-takeoff`, `i-handshake`, `i-map-pin`, `i-arrow-up-right`, `i-plane`. A migração para `lucide-react` deve ser direta — mapear cada `symbol id` para o nome do componente Lucide equivalente (`Clock`, `CreditCard`, `Settings`, `Check`, `Mail`, `Phone`, `Headset`, `PlaneTakeoff`, `Handshake`, `MapPin`, `ArrowUpRight`, `Plane`).
- **[LOCKED — decisão condicional]** `i-instagram`, `i-facebook` e `i-whatsapp` são ícones de marca (brand icons) — o pacote `lucide-react` principal é genérico e não cobre ícones de marca de forma consistente. Ordem de preferência para a implementação:
  1. Tentar uma biblioteca externa de ícones de marca (ex. `simple-icons`/`@icons-pack/react-simple-icons`, ou os ícones de marca do `react-icons`, como `react-icons/fa` ou `react-icons/si`) para os três.
  2. Se a biblioteca escolhida não tiver os três com qualidade/estilo adequado ao sistema (traço consistente com o restante dos ícones lineares), manter esses três como SVG customizado — que é exatamente o que já são hoje no mockup — em vez de forçar uma solução Lucide ou misturar estilos incompatíveis.
  - Não forçar Lucide para esses três em nenhuma hipótese.
- Todos os ícones: stroke consistente (`stroke-width` entre 0.85 e 1.6 conforme o contexto — arrow dos cards é mais fina, 0.85; ícones de lista são 1.4–1.6), cantos arredondados (`stroke-linecap`/`stroke-linejoin: round`), sem preenchimentos desnecessários (`fill: none`, exceto o ponto do ícone Instagram).
- Uso semântico consolidado: clock/agilidade, plane/processos de viagem, cards/pagamento, gear/operacional, headset/suporte, handshake/parcerias, map-pin/endereço, check/lista de operacional.
- SVGs proprietários (fora do padrão de ícone de linha) ficam restritos a pin e avião de apoio (Seção 9) — nunca migrar esses dois para Lucide, são artwork de marca, não iconografia utilitária.

---

## 19. Motion principles

**[PROVISÓRIO — nada implementado ainda]**

- GSAP entra **apenas depois** de layout, conteúdo e este Design System estarem aprovados e estáveis em React — não usar GSAP nesta etapa.
- Animações devem apoiar a narrativa de viagem/rota, não decorar por decorar.
- Animações recomendadas (a implementar futuramente):
  - Linha de rota (Seção 8) desenhando via scroll (`stroke-dashoffset` ou equivalente).
  - Entrada sutil da Hero (fade/translate no H1, subtítulo e CTAs).
  - Hover/press nos cards de Atendimento (`.oferta-card`).
  - Microinterações em CTAs (já há `transition` em `.btn`, mas apenas CSS — GSAP pode refinar).
  - Movimento sutil em blocos de mídia (Seção 11), quando a mídia real entrar.
  - **Pin/avião "recuando" pela trajetória (Seção 9) — especificação travada em 2026-07-12, ainda não implementada:**
    - O elemento (pin em Sobre, avião em Atendimento) se desloca **sobre o próprio path tracejado do SVG**, não por um recálculo estático de `left`/`right`. Conforme a largura da viewport reduz, o elemento "recua" pela trajetória — a sensação é de que ele está percorrendo a rota de volta, não pulando de posição.
    - **Importante — não é só reativo a resize**: a posição de repouso do elemento no path é **função da largura atual**, calculada já no carregamento da página (`on mount`), e recalculada em qualquer `resize` subsequente. Não implementar como "anima só quando o usuário arrasta a borda da janela" — a maioria dos visitantes (celular, tablet) carrega a página direto numa largura estreita, sem nenhum evento de resize acontecer, e precisa ver o elemento já na posição correta desde o primeiro paint. (Confirmado por Pedro em 2026-07-12: "além de" escutar resize, não "em vez de".)
    - Candidato técnico: GSAP `MotionPath` (ou interpolação manual ao longo do `path` do SVG via `getPointAtLength`), com a fração do path mapeada a partir da largura da viewport.
    - Até essa animação existir, pin/avião ficam na posição original da Seção 9 (`right:0`/`left:0`), aceitando sobreposição com o texto em larguras intermediárias — decisão consciente do Pedro para não travar um valor estático que seria descartado assim que o GSAP entrar.
- Evitar animar tudo — nem toda seção precisa de motion.
- Evitar scroll-reveal genérico aplicado indiscriminadamente a todas as seções.
- Sempre respeitar `prefers-reduced-motion` (não implementado no mockup HTML/CSS atual — deve ser adicionado junto com o GSAP).
- Preferir `transform` e `opacity` para performance; evitar propriedades que causam layout-thrashing.

---

## 20. Mídia e Higgsfield

**[PROVISÓRIO — não usar nesta etapa]**

- Imagens e vídeos reais ainda não foram produzidos — todos os blocos da Seção 11 permanecem placeholder.
- Higgsfield (MCP mencionado pelo Pedro em 2026-07-10) poderá ser usado em etapa posterior para gerar assets de Hero, faixa de mídia e cards de Atendimento.
- Antes de gerar qualquer mídia, definir prompts específicos para pelo menos:
  - Hero institucional (mobilidade corporativa, elegante, calma).
  - Viagem corporativa (executivo em deslocamento).
  - Aeroporto/mobilidade (janela de avião, terminal).
  - Atendimento humano (interação real, não genérica).
  - Cidade/chegada.
- Evitar imagens turísticas genéricas e aparência de stock artificial — consistente com as restrições já definidas em `design-brief.md`.
- Sempre prever fallback estático para qualquer vídeo gerado.
- Mídia deve reforçar profissionalismo, mobilidade e atendimento humano — nunca lazer/turismo genérico, mesmo a Carioca também atendendo lazer e receptivo.

---

## 21. Regras anti-AI-slop

**[LOCKED]**

Não usar:
- Gradientes como solução visual final para tudo (hoje são placeholder documentado, não solução definitiva).
- Cards SaaS genéricos.
- Blobs decorativos aleatórios sem relação com a logo ou o motivo de rota.
- Ícones improvisados fora do padrão Lucide/linha consistente.
- Texto comercial inventado fora de `conteudo-apresentacao.md` sem marcá-lo como provisório (as descrições dos cards de Atendimento, Seção 13, são a exceção já aprovada e documentada).
- Sombras, blur, vidro (glassmorphism) ou efeitos decorativos em excesso.
- Transformar a página em dashboard.
- Transformar a marca em turismo genérico — o componente corporativo/operacional é central, não acessório.

Manter:
- Identidade visual ancorada em logo, paleta oficial, motivo de rota e wayfinding, atendimento humano.
- Revisão de contraste, espaçamento e hierarquia antes de cada nova implementação — a Seção 13 desta sessão é o exemplo do tipo de verificação esperada (cálculo real de contraste, não estimativa).

---

## 22. Pendências para próximas etapas

1. Implementar React + TypeScript + Vite + Tailwind.
2. Configurar shadcn, se fizer sentido para componentes base — sem deixar a estética padrão do shadcn substituir o Design System da Carioca (regra já em `CLAUDE.md`).
3. Migrar ícones para `lucide-react`; para Instagram/Facebook/WhatsApp, tentar biblioteca externa de ícones de marca antes de recorrer ao SVG customizado atual (Seção 18 — decisão condicional já travada).
4. Transformar os tokens da Seção 2 em tokens Tailwind/CSS, incluindo `--ink-on-blue` (agora `#ffffff`) e `--ink-on-dark`, e portar os `color-mix` dos cards verde e azul (Seção 13, já aplicados no mockup) para o equivalente Tailwind.
5. Substituir os placeholders de mídia (Seção 11) por mídia real.
6. Possivelmente usar Higgsfield para gerar as imagens/vídeos (Seção 20) — não usar antes disso.
7. Adicionar GSAP somente após o layout estar estável em React (Seção 19).
   - **Item específico e já especificado, aguardando essa etapa**: animação de pin/avião "recuando" pela trajetória tracejada conforme a largura reduz (Seção 9 e Seção 19) — posição calculada a partir da largura atual já no carregamento (`on mount`) e recalculada em `resize`, não apenas reativa ao evento de resize. Até lá, os dois elementos ficam na posição original (`right:0`/`left:0`), podendo sobrepor texto em larguras intermediárias — aceito conscientemente pelo Pedro em 2026-07-12.
8. Otimizar responsividade adotando a escala de 4 breakpoints da Seção 6 diretamente na implementação (mobile, tablet, desktop, wide) — decisão confirmada, não é mais necessário testar via HTML estático.
9. ~~Implementar o grid fluido (`auto-fit`/`minmax`)~~ — **feito e revisado em 2026-07-12**: grid fluido testado e substituído por colunas fixas por breakpoint (Seção 15) por gerar composições desequilibradas. Logos em SVG já implementadas (exceto `wp`, que usa PNG por o SVG de origem estar quebrado).
10. Preparar a versão PDF depois da versão digital estável, em formato editorial 16:9 (Seção 5) — aplicação da logo em PDF ainda não definida (Seção 4).

Pendência aberta desde 2026-07-12: animação GSAP de pin/avião (item 7 acima) — todo o resto não tem pontos `[REVISAR]` em aberto.

---

*Fim do documento.*

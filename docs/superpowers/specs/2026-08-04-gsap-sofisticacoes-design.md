# Design — Sofisticações de motion (GSAP)

Data: 2026-08-04
Origem: backlog item 2 do `HANDOFF.md`. **Absorve o item 3** (sync carrossel ↔ lista
em Diferenciais), que virou o acento 3 desta rodada.
Decisões tomadas com o Pedro nas sessões de 2026-07-27, 07-28 e 08-04.

## Objetivo

Motion em duas frentes, não uma ou outra:

1. **Acabamento e percepção de produto caro** — entrada dos títulos, cards com peso,
   cadência na descida da página.
2. **Resposta ao cursor** — hover e press dos CTAs.

## Princípios que a rodada respeita

- O `CLAUDE.md` do projeto proíbe scroll-reveal genérico em todas as seções. A tensão
  se resolve assim: **uma base rítmica repetida vira linguagem** (repetição deliberada,
  não preguiça) e **só três acentos custam trabalho autoral**.
- Preferir `transform` e `opacity`. Nada que force layout.
- **Movimento diluído em scroll longo não é percebido.** Aprendizado registrado em
  `atendimento-cards.tsx`: a 1ª versão prendia a escala da foto ao scroll e o Pedro
  não via o movimento — "12% diluídos por centenas de pixels ficam abaixo do limiar".
  No hover, os mesmos 6% são imediatos e legíveis. Motion perceptível acontece em
  intervalo curto.
- Uma camada temporal não compete com a outra: o avião é **scroll-linked** (sem ritmo
  próprio), a entrada é **evento** (~1s, uma vez). Argumento do Pedro, aceito — a
  ressalva original de conflito era conservadora demais.

## Infraestrutura verificada em 2026-08-04

Verificado nesta sessão, lendo os arquivos:

- Dependências já instaladas: `gsap@^3.15.0`, `@gsap/react@^2.1.2`,
  `embla-carousel-react@^8.6.0`. **Nada a adicionar.**
- `src/hooks/use-route-motion.ts` (452 linhas) já faz
  `gsap.registerPlugin(useGSAP, DrawSVGPlugin, ScrollTrigger)`. **GSAP e ScrollTrigger
  já estão em produção** — não há custo de bootstrap. Isto corrige a anotação anterior
  do handoff de que o motion existente seria "CSS-only": o hover dos cards é CSS, o
  pin/avião é GSAP.
- O hook já trata movimento reduzido com `gsap.matchMedia()` e a chave
  `reduceMotion: "(prefers-reduced-motion: reduce)"` (linhas 378–383). **É o padrão a
  seguir** no motion novo — não inventar outro mecanismo.
- Consumidores atuais do hook: `sobre.tsx` (pin) e `atendimento-cards.tsx` (avião).
- A linha de 3px do rodapé da Hero existe: `hero.tsx`, `div` com
  `absolute inset-x-0 bottom-0 z-[2] h-[3px] opacity-90` e `style={dividerBackground}`.
- `button.tsx` (42 linhas) é Base UI + `cva`, com três variantes aprovadas: `solid`,
  `outline`, `outline-on-light`. Hover atual: `opacity .88` no solid, `bg-black/30` no
  outline, transição de 150ms.

## Tokens de motion — fonte única

Arquivo novo: **`src/lib/motion.ts`**. Motivo: a simulação de calibragem usou uma
moldura de 540px, mais curta que a página real. O efeito acumulado só se prova no site,
e a calibragem final tem que ser mudar três números, não caçar animação por componente.

| Token | Valor | Uso |
|---|---|---|
| `ENTER_DISTANCE` | `44` px | deslocamento vertical da entrada |
| `ENTER_DURATION` | `1.0` s | duração da entrada |
| `ENTER_STAGGER` | `0.14` s | intervalo entre elementos irmãos |
| `ENTER_SCALE_FROM` | `0.965` | escala inicial (chega em 1) |
| `EASE` | `"power4.out"` | curva de todas as entradas |
| `HERO_STAGGER` | `0.08` s | exceção declarada: intervalo interno do bloco da Hero |

`HERO_STAGGER` é menor que `ENTER_STAGGER` de propósito. Na Hero os quatro elementos
(eyebrow, `h1`, subtítulo, CTAs) chegam **juntos, logo atrás da linha de rota**, como um
bloco — não em cascata. Em 140ms a chegada arrastaria para além dos 1,9s e atrasaria o
CTA. É a única exceção ao stagger uniforme, e ela existe porque a Hero é o único lugar
onde outro gesto (a linha) carrega a cadência.

Personalidade "C / Amplo", escolhida em demonstração comparativa no navegador, aplicada
de forma **uniforme em todas as seções**. Foi testada contra a alternativa "base
calibrada + acentos em C cheio" numa simulação com as 6 seções reais; o Pedro rolou as
duas e preferiu o uniforme. Decisão com evidência — não reabrir sem motivo novo.

O equivalente em CSS (para o que não passa por GSAP) são custom properties em
`src/index.css`, com a mesma curva escrita como `cubic-bezier(.22, 1, .36, 1)`.

## Base rítmica — todas as seções

Aplicar ao cabeçalho de cada seção (o bloco `Eyebrow` + `h2` + subtítulo), com o
stagger entre os elementos do próprio cabeçalho.

**Alcance:** a base cobre **só o cabeçalho**. O corpo de cada seção fica parado, exceto
onde um acento diz o contrário — os três cards de Atendimento sobem porque o acento 2
os inclui explicitamente. Uma seção sem acento anima o cabeçalho e nada mais; é isso que
mantém a promessa de não fazer scroll-reveal em tudo.

Seções que recebem: `sobre`, `atendimento-cards`, `operacional`, `diferenciais`,
`clientes`, `contato-footer` (as seis que usam `Eyebrow`).
Seções que **não** recebem: `media-band` e `diferenciais-carousel` — não têm cabeçalho
próprio.

**Trigger: uma vez só.** Cada seção revela na primeira entrada na viewport e fica. Não
re-anima ao subir e descer de novo (`ScrollTrigger` com `once: true`).

## Acento 1 — Hero · "Chegada / wayfinding"

Escolhido pelo Pedro entre três opções animadas. É a única das três que estende o
vocabulário do avião/pin já em produção em vez de criar um segundo idioma de movimento.

Sequência, total ~1,9s:

1. **Faixa utilitária** entra lateralmente, como painel de aeroporto.
2. **Logo**.
3. **A linha de 3px do rodapé corre da esquerda para a direita** — `scaleX 0 → 1`,
   `transform-origin: left`, ~1,4s — como uma rota sendo traçada.
4. **Bloco principal** chega logo atrás, em intervalo curto (~80ms entre elementos):
   eyebrow → `h1` → subtítulo → CTAs.

O `h1` entra como uma unidade. A opção "B · a virada" (pausa de 0,6s entre "Nossa
agência." e "Sua agência.") foi apresentada e **não** foi escolhida: custava ~2,8s com
o CTA invisível.

## Acento 2 — Cards de Atendimento · "C sozinho"

Decidido em 2026-08-04, depois de comparar C contra C+B no navegador.

**O que acontece:** o card sobe (base rítmica) e, logo em seguida, **a zona de foto
preenche de baixo para cima** — um gesto forte por card, leitura limpa. Stagger de
140ms entre os três cards.

**O que não acontece:** as réguas horizontais do card **não** correm da esquerda para a
direita. A opção C+B foi vista e recusada — dois movimentos por card × três cards lê
como ocupado demais, e as réguas têm 0,75px, discretas demais para justificar um gesto
autoral.

Grade do card, já mapeada: `aspect-square`,
`grid-rows-[27fr_10fr_20fr_3fr_40fr]` — ícone+micro / título em duas linhas com réguas /
index + descrição + seta `ArrowUpRight` / zona de foto 2,5:1.

**O hover atual dos cards fica como está** — foto em `scale(1.06)` a 500ms `ease-out` e
a lâmina que clareia, tudo em CSS puro sob `motion-safe:` e `group-hover:`. Não adicionar
lift do card nem deslocamento da seta `ArrowUpRight`: a ousadia desta seção já está
gasta na foto preenchendo, e o card ganharia três gestos simultâneos.
*Decisão minha, tomada na redação da spec — confirmar na revisão.*

## Acento 3 — Diferenciais · sync carrossel ↔ lista

**Comportamento:** o item da lista acende quando o slide correspondente fica ativo. No
slide da Flavinha (índice 0) **nenhum item fica aceso** — palavras do Pedro: "só ativa
quando estiver realmente no slide correto".

O pareamento é **1:1 com offset de 1** (`item[i]` ↔ `slide[i+1]`), e já existe no
conteúdo: a lista tem 4 itens, o carrossel tem 5 slides, e as legendas dos slides 2–5 já
numeram `01 ·` a `04 ·` com os mesmos rótulos dos itens.

| Lista (`diferenciais.items`) | Slide (`diferenciais.slides`) |
|---|---|
| — | `— FLAVINHA SALLES · GESTORA` |
| Agilidade no atendimento | `— 01 · AGILIDADE NO ATENDIMENTO` |
| Eficiência nos processos de viagens | `— 02 · EFICIÊNCIA NOS PROCESSOS DE VIAGENS` |
| Melhores preços e condições de pagamento | `— 03 · MELHORES PREÇOS E CONDIÇÕES DE PAGAMENTO` |
| Soluções operacionais | `— 04 · SOLUÇÕES OPERACIONAIS` |

**Custo baixo.** `diferenciais-carousel.tsx` já rastreia o índice ativo
(`const [current, setCurrent] = useState(0)` alimentado por
`api.on("select", () => setCurrent(api.selectedScrollSnap()))`) e já usa esse valor para
trocar a legenda. Falta elevar esse estado ao pai (`diferenciais.tsx`, que renderiza
lista e carrossel lado a lado no mesmo grid). O caminho inverso — clicar no item da
lista e ir ao slide — sai de graça com `api.scrollTo(i + 1)`.

Precedentes do componente a respeitar: autoplay de 3s com `setInterval`, pausa no hover
(`hoveringRef`) e movimento reduzido já tratado (o autoplay não inicia).

## Microinterações de CTA — "C · Preenchimento"

Decidido em 2026-08-04, vendo as três direções rodando dentro de um recorte da Hero.

**O que acontece no hover:** a superfície do botão **preenche de baixo para cima** —
`scaleY 0 → 1`, `transform-origin: bottom`, 320ms, mesma curva. É o mesmo gesto da foto
subindo nos cards de Atendimento, então o sistema fecha em dois lugares.

Por variante:

| Variante | Camada que sobe |
|---|---|
| `solid` | `light-green` sobre o `carioca-green` |
| `outline` | `off-white` a 14% |
| `outline-on-light` | `carioca-blue` a 10% |

**Press, em todas as variantes:** compressão `scale(0.985)` em 80ms.

Descartadas com o Pedro: "A · Peso" (subir 2px + sombra) — correto em qualquer site, e
esse é o limite: não é da Carioca; e "B · Rota" (linha de 2px correndo na base) — no
contexto da Hero ela cai logo abaixo de um bloco de texto denso e some.

Implementação em CSS puro no `buttonVariants` de `button.tsx`, com pseudo-elemento e
`isolation: isolate`. Não é caso de GSAP.

## Reduced motion — fade sem deslocamento

Com `prefers-reduced-motion: reduce`:

- **Entradas** viram `opacity 0 → 1`. Sem os 44px, sem a escala de 0,965.
- **Hover dos CTAs** troca de cor direto, sem a superfície subindo.
- **Press** continua desligado (é `transform`).

Racional: o desconforto vestibular vem de deslocamento e paralaxe, não de opacidade.
E é coerente com o que o projeto já faz nos três tratamentos existentes — pin/avião em
posição estática, autoplay do carrossel desligado, zoom da foto sob `motion-safe:`:
reduzimos, não desligamos.

Mecanismo: `gsap.matchMedia()` com a chave `reduceMotion`, como em `use-route-motion.ts`.
Para o que é CSS, `motion-reduce:` do Tailwind.

## Mobile

**Implementar rodando igual ao desktop**, testar no aparelho e só então avaliar. Palavras
do Pedro: "a princípio gostaria de ver como é que ele funciona rodando igual. Se não
ficar bom, a gente pode discutir sobre reduzir ou ainda não rodar, mas acho que é
necessário testar".

Testar em **360px e 412px** — a calibragem do Galaxy A53 descoberta na §24 do handoff.

## Verificação (antes de publicar)

- `npm run build` e `npx oxlint` limpos.
- Cada animação verificada na página real, não em simulação de moldura curta.
- Descida completa da página em 1440px, conferindo o efeito acumulado da base rítmica —
  é isto que a simulação não conseguiu provar.
- 360px e 412px no aparelho do Pedro.
- Com movimento reduzido ligado no Windows: nada desliza, tudo aparece.
- Teclado: foco visível em todos os CTAs (a `focus-visible` atual não pode regredir).

## Ordem de execução — um commit por animação

Mesma disciplina da sessão §24: commits atômicos, para permitir `git revert` individual
sem derrubar as outras.

1. `src/lib/motion.ts` — tokens, sem consumidor ainda.
2. Base rítmica nos cabeçalhos das seis seções.
3. Acento 1 — Hero.
4. Acento 2 — cards de Atendimento.
5. Acento 3 — sync Diferenciais.
6. Microinterações de CTA.
7. Tratamento de `prefers-reduced-motion` (se não sair junto de cada passo).
8. Atualizar `design/design.md` §19 — hoje está marcado
   `[PROVISÓRIO — nada implementado ainda]`, o que é falso desde 2026-07-15, quando o
   pin/avião entrou em produção.

## Fora de escopo

- Lift do card e deslocamento da seta `ArrowUpRight` no hover dos cards.
- Qualquer motion em `media-band` e no interior do `diferenciais-carousel` além do sync.
- A pausa dramática entre as duas linhas do `h1` da Hero (opção B, recusada).
- Réguas dos cards correndo da esquerda para a direita (opção C+B, recusada).

# Sofisticações de motion (GSAP) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar a base rítmica de entrada em seis seções, três acentos autorais (Hero, cards de Atendimento, sync de Diferenciais) e a microinteração de preenchimento dos CTAs, conforme a spec aprovada.

**Architecture:** Tokens de motion centralizados em `src/lib/motion.ts` (fonte única, para calibrar mudando números num arquivo só). Um hook genérico e declarativo — `useEnterMotion` — anima qualquer elemento marcado com `data-enter` dentro de um escopo, com `ScrollTrigger` de disparo único; as seções não escrevem GSAP, só marcam elementos. A Hero, por ter sequência própria com quatro tempos, ganha um hook dedicado (`useHeroMotion`) sem ScrollTrigger. Os CTAs não passam por GSAP: são pseudo-elemento CSS no `buttonVariants`.

**Tech Stack:** React 19 + TypeScript + Vite + Tailwind v4 + `gsap@^3.15.0` + `@gsap/react@^2.1.2` + `embla-carousel-react@^8.6.0`. **Nenhuma dependência nova.**

## Global Constraints

- **Spec de origem:** `docs/superpowers/specs/2026-08-04-gsap-sofisticacoes-design.md`. Ela é a autoridade; este plano a executa. Em conflito, a spec vence.
- **Nenhuma dependência nova.** GSAP, ScrollTrigger e Embla já estão instalados e em produção.
- **Preferir `transform` e `opacity`.** Nada que force layout (sem animar `height`, `top`, `margin`, `width`).
- **Padrão de movimento reduzido:** `gsap.matchMedia()` com a chave `reduceMotion: "(prefers-reduced-motion: reduce)"`, exatamente como `src/hooks/use-route-motion.ts:378-383`. Não inventar outro mecanismo. Para o que é CSS, `motion-reduce:` do Tailwind.
- **Sob movimento reduzido:** entradas viram `opacity 0 → 1` (sem os 44px, sem a escala de 0,965); hover dos CTAs troca de cor direto, sem a superfície subindo; press continua desligado.
- **Trigger de entrada: uma vez só.** `ScrollTrigger` com `once: true`. Não re-anima ao subir e descer de novo.
- **Um commit por animação**, mensagem em português, para permitir `git revert` individual. Mesma disciplina da sessão §24 do `HANDOFF.md`.
- **Não há framework de teste no projeto** (`scripts` = dev/build/lint/preview; nenhuma dependência de teste). O ciclo de verificação de cada tarefa é o que a spec define: `npm run build` limpo, `npx oxlint` limpo e conferência visual na página real rodando. Não instalar framework de teste — está fora do escopo da spec e é decisão do Pedro.
- **`npx oxlint` tem 3 warnings pré-existentes** de fast-refresh em componentes de UI (`button.tsx`, `eyebrow.tsx`, `chip.tsx` exportam `cva` junto do componente). Elas são o baseline aceito: o critério é **não aumentar** o número de warnings, não zerá-lo.
- **Copy visível não muda.** Nenhuma tarefa deste plano altera texto client-facing (`src/lib/content.ts`).
- **Fora de escopo (não implementar):** lift do card e deslocamento da seta `ArrowUpRight` no hover; motion em `media-band` e no interior do `diferenciais-carousel` além do sync; pausa dramática entre as duas linhas do `h1`; réguas dos cards correndo da esquerda para a direita.

## File Structure

**Criados:**

| Arquivo | Responsabilidade |
|---|---|
| `src/lib/motion.ts` | Tokens numéricos de motion. Sem lógica, sem import de GSAP. |
| `src/hooks/use-enter-motion.ts` | Hook genérico da base rítmica: anima `[data-enter]` e `[data-enter-fill]` dentro de um escopo, com ScrollTrigger único e tratamento de movimento reduzido. |
| `src/hooks/use-hero-motion.ts` | Hook dedicado à sequência de entrada da Hero (4 tempos, sem ScrollTrigger). |

**Modificados:**

| Arquivo | O que muda |
|---|---|
| `src/index.css` | `--ease-carioca` no `@theme`; durações de motion como custom properties no `:root`. |
| `src/components/sections/sobre.tsx` | `data-enter` no cabeçalho + chamada do hook (já tem `sectionRef`). |
| `src/components/sections/atendimento-cards.tsx` | `data-enter` no cabeçalho e nos cards, `data-enter-fill` na zona de foto, dois escopos de hook. |
| `src/components/sections/operacional.tsx` | `useRef` + `ref` na `<section>`, `data-enter` no cabeçalho, chamada do hook. |
| `src/components/sections/diferenciais.tsx` | Idem + estado do slide ativo e lista clicável (acento 3). |
| `src/components/sections/clientes.tsx` | Idem cabeçalho. |
| `src/components/sections/contato-footer.tsx` | Idem cabeçalho. |
| `src/components/sections/diferenciais-carousel.tsx` | Duas props opcionais para elevar índice ativo e API ao pai. |
| `src/components/sections/hero.tsx` | `data-hero` nos quatro tempos + chamada do `useHeroMotion`. |
| `src/components/ui/button.tsx` | Preenchimento de baixo para cima no hover + press, em CSS puro. |
| `design/design.md` | §19 atualizada — hoje está marcada `[PROVISÓRIO — nada implementado ainda]`, o que é falso desde 2026-07-15. |

---

### Task 1: Tokens de motion

Cria a fonte única de calibragem. Sem consumidor ainda — a spec pede exatamente isso, porque o efeito acumulado só se prova no site e a calibragem final tem que ser mudar três números, não caçar animação por componente.

**Files:**
- Create: `src/lib/motion.ts`
- Modify: `src/index.css` (bloco `@theme`, após `--radius-carioca` na linha 61; e bloco `:root` da linha 75)

**Interfaces:**
- Consumes: nada.
- Produces: `ENTER_DISTANCE: number`, `ENTER_DURATION: number`, `ENTER_STAGGER: number`, `ENTER_SCALE_FROM: number`, `EASE: string`, `HERO_STAGGER: number` — todos exportados nomeadamente de `@/lib/motion`. No CSS: utilitário Tailwind `ease-carioca` e as custom properties `--motion-fill-duration` e `--motion-press-duration`.

- [ ] **Step 1: Criar `src/lib/motion.ts`**

```ts
/**
 * Tokens de motion — fonte única de calibragem.
 * Spec: docs/superpowers/specs/2026-08-04-gsap-sofisticacoes-design.md
 *
 * Personalidade "C / Amplo", escolhida pelo Pedro em demonstração comparativa
 * no navegador e aplicada de forma uniforme em todas as seções. Foi testada
 * contra a alternativa "base calibrada + acentos em C cheio" numa simulação
 * com as 6 seções reais — decisão com evidência, não reabrir sem motivo novo.
 *
 * A calibragem final é mudar os números daqui, não caçar animação por
 * componente: a simulação usou uma moldura de 540px, mais curta que a página
 * real, e o efeito acumulado só se prova no site.
 *
 * O equivalente CSS (para o que não passa por GSAP — hoje só o botão) são as
 * custom properties em src/index.css: --ease-carioca, --motion-fill-duration
 * e --motion-press-duration. Ao mexer aqui, conferir lá.
 */

/** Deslocamento vertical da entrada, em px. */
export const ENTER_DISTANCE = 44

/** Duração da entrada, em segundos. */
export const ENTER_DURATION = 1.0

/** Intervalo entre elementos irmãos, em segundos. */
export const ENTER_STAGGER = 0.14

/** Escala inicial da entrada (chega em 1). */
export const ENTER_SCALE_FROM = 0.965

/** Curva de todas as entradas. Equivale a cubic-bezier(.22, 1, .36, 1) no CSS. */
export const EASE = "power4.out"

/**
 * Exceção declarada: intervalo interno do bloco da Hero.
 *
 * Menor que ENTER_STAGGER de propósito. Na Hero os quatro elementos (eyebrow,
 * h1, subtítulo, CTAs) chegam juntos, logo atrás da linha de rota, como um
 * bloco — não em cascata. Em 140ms a chegada arrastaria para além dos 1,9s e
 * atrasaria o CTA. É a única exceção ao stagger uniforme, e ela existe porque
 * a Hero é o único lugar onde outro gesto (a linha) carrega a cadência.
 */
export const HERO_STAGGER = 0.08
```

- [ ] **Step 2: Adicionar a curva ao `@theme` em `src/index.css`**

No bloco `@theme`, logo após a linha `--radius-carioca: 6px;` (dentro do comentário `/* forma */`), inserir um novo grupo antes de `/* breakpoints */`:

```css
  /* motion — espelho CSS dos tokens de src/lib/motion.ts (EASE = power4.out) */
  --ease-carioca: cubic-bezier(0.22, 1, 0.36, 1);
```

Estar dentro de `@theme` faz o Tailwind v4 gerar o utilitário `ease-carioca` (namespace `--ease-*`).

- [ ] **Step 3: Adicionar as durações ao `:root` em `src/index.css`**

No bloco `:root` existente (linha 75, o das cores derivadas via `color-mix`), acrescentar as duas properties ao final, antes do `}`:

```css
  /* motion CSS — o que não passa por GSAP (hoje só button.tsx) */
  --motion-fill-duration: 320ms;
  --motion-press-duration: 80ms;
```

- [ ] **Step 4: Verificar que compila**

Run: `npm run build`
Expected: build conclui sem erro de TypeScript e sem erro de CSS.

Nota esperada: `src/lib/motion.ts` ainda não tem consumidor. Isso não gera erro — são exports de módulo, não variáveis locais não usadas.

- [ ] **Step 5: Verificar o lint**

Run: `npx oxlint`
Expected: mesmos 3 warnings de fast-refresh pré-existentes, nenhum novo.

- [ ] **Step 6: Commit**

```bash
git add src/lib/motion.ts src/index.css
git commit -m "feat(motion): tokens de motion como fonte unica de calibragem"
```

---

### Task 2: Base rítmica nos cabeçalhos das seis seções

O hook genérico e sua aplicação nas seis seções que usam `Eyebrow`. Vão juntos num commit porque são uma animação só, repetida — a repetição deliberada é o que vira linguagem.

**Alcance:** a base cobre **só o cabeçalho**. O corpo de cada seção fica parado, exceto onde um acento diz o contrário. Uma seção sem acento anima o cabeçalho e nada mais — é isso que mantém a promessa de não fazer scroll-reveal em tudo.

Seções que recebem: `sobre`, `atendimento-cards`, `operacional`, `diferenciais`, `clientes`, `contato-footer`.
Seções que **não** recebem: `media-band` e `diferenciais-carousel` — não têm cabeçalho próprio.

**Files:**
- Create: `src/hooks/use-enter-motion.ts`
- Modify: `src/components/sections/sobre.tsx` (já tem `sectionRef` na linha 43)
- Modify: `src/components/sections/atendimento-cards.tsx` (já tem `sectionRef`; nesta tarefa **só o cabeçalho** — os cards são a Task 4)
- Modify: `src/components/sections/operacional.tsx` (precisa criar `useRef`)
- Modify: `src/components/sections/diferenciais.tsx` (precisa criar `useRef`)
- Modify: `src/components/sections/clientes.tsx` (precisa criar `useRef`)
- Modify: `src/components/sections/contato-footer.tsx` (precisa criar `useRef`)

**Interfaces:**
- Consumes: `ENTER_DISTANCE`, `ENTER_DURATION`, `ENTER_STAGGER`, `ENTER_SCALE_FROM`, `EASE` de `@/lib/motion`.
- Produces: `useEnterMotion({ scopeRef, stagger?, start?, fillOffset? })` exportado de `@/hooks/use-enter-motion`. Assinatura exata:
  ```ts
  interface UseEnterMotionOptions {
    scopeRef: RefObject<HTMLElement | null>
    stagger?: number
    start?: string
    fillOffset?: number
  }
  function useEnterMotion(options: UseEnterMotionOptions): void
  ```
  Contrato de marcação: elementos com o atributo `data-enter` dentro de `scopeRef` sobem e aparecem, na ordem do DOM. Elementos com `data-enter-fill` são revelados de baixo para cima (usado só na Task 4). O suporte a `data-enter-fill` **entra na Task 4** — nesta tarefa o hook trata apenas `data-enter`.

- [ ] **Step 1: Criar `src/hooks/use-enter-motion.ts`**

```ts
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { RefObject } from "react"

import {
  EASE,
  ENTER_DISTANCE,
  ENTER_DURATION,
  ENTER_SCALE_FROM,
  ENTER_STAGGER,
} from "@/lib/motion"

gsap.registerPlugin(useGSAP, ScrollTrigger)

/**
 * Base rítmica de entrada — design/design.md Seção 19 e
 * docs/superpowers/specs/2026-08-04-gsap-sofisticacoes-design.md.
 *
 * Anima todo elemento marcado com `data-enter` dentro do escopo, na ordem do
 * DOM, com o stagger dos tokens. O componente não escreve GSAP: só marca o
 * que entra. Repetir o mesmo gesto em todas as seções é deliberado — é o que
 * o transforma em linguagem em vez de scroll-reveal genérico.
 *
 * Dispara uma vez só (`once: true`): a seção revela na primeira entrada na
 * viewport e fica. Não re-anima ao subir e descer de novo.
 *
 * O `scopeRef` é ao mesmo tempo o escopo da busca e o trigger do scroll.
 * Uma seção pode chamar o hook mais de uma vez com escopos diferentes quando
 * partes dela devem entrar em momentos distintos (é o caso de
 * atendimento-cards.tsx: cabeçalho e grid de cards têm cada um o seu).
 */
interface UseEnterMotionOptions {
  /** Escopo da busca por `[data-enter]` e trigger do ScrollTrigger. */
  scopeRef: RefObject<HTMLElement | null>
  /** Intervalo entre irmãos. Default: ENTER_STAGGER. */
  stagger?: number
  /** Posição de disparo do ScrollTrigger. Default: "top 85%". */
  start?: string
}

function useEnterMotion({
  scopeRef,
  stagger = ENTER_STAGGER,
  start = "top 85%",
}: UseEnterMotionOptions) {
  useGSAP(
    () => {
      const root = scopeRef.current
      if (!root) return

      const targets = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-enter]")
      )
      if (targets.length === 0) return

      const mm = gsap.matchMedia()

      mm.add(
        { reduceMotion: "(prefers-reduced-motion: reduce)" },
        (context) => {
          const { reduceMotion } = context.conditions as {
            reduceMotion: boolean
          }

          // Movimento reduzido: fade sem deslocamento. O desconforto
          // vestibular vem de deslocamento e paralaxe, não de opacidade —
          // reduzimos, não desligamos (mesmo critério do pin/avião e do
          // autoplay do carrossel).
          const tween = gsap.from(targets, {
            opacity: 0,
            ...(reduceMotion
              ? {}
              : { y: ENTER_DISTANCE, scale: ENTER_SCALE_FROM }),
            duration: ENTER_DURATION,
            ease: EASE,
            stagger,
            scrollTrigger: { trigger: root, start, once: true },
          })

          return () => {
            tween.scrollTrigger?.kill()
            tween.kill()
          }
        },
        scopeRef
      )

      return () => {
        mm.revert()
      }
    },
    { scope: scopeRef }
  )
}

export { useEnterMotion }
```

Duas notas técnicas para quem executa:

1. `useGSAP` roda em `useLayoutEffect`, ou seja, **antes do paint**. Por isso o `gsap.from` não pisca: o estado inicial (opacidade 0) é aplicado antes de o navegador desenhar. Não adicionar `opacity-0` no CSS dos alvos — isso deixaria o conteúdo invisível se o JS falhar.
2. Se a página carregar já com a seção passada do ponto de disparo, o ScrollTrigger avalia a posição no refresh e aplica o estado final. Não é preciso tratar isso manualmente.

- [ ] **Step 2: Aplicar em `sobre.tsx`**

A seção já tem `sectionRef` (linha 43) e já importa `useRef`. Adicionar o import do hook junto dos outros imports de `@/hooks`:

```tsx
import { useEnterMotion } from "@/hooks/use-enter-motion"
```

Logo abaixo da linha `useRouteMotion({ containerRef: pinRef, sectionRef, calibration: PIN_CALIBRATION })`, acrescentar:

```tsx
  useEnterMotion({ scopeRef: sectionRef })
```

Marcar os três elementos do cabeçalho (linhas 83, 84 e 88). O `Eyebrow` repassa props para o `<span>`, então `data-enter` funciona nele direto:

```tsx
            <div className="text-left">
              <Eyebrow data-enter>{sobre.eyebrow}</Eyebrow>
              <h2
                data-enter
                className="text-left text-[clamp(1.9rem,3.2vw,2.5rem)] font-extrabold"
              >
                {sobre.title}
              </h2>
            </div>
            <p
              data-enter
              className="mt-[22px] max-w-[680px] text-left text-[1.15rem] leading-[1.78] font-normal text-graphite"
            >
```

- [ ] **Step 3: Aplicar em `atendimento-cards.tsx` — só o cabeçalho**

A seção já tem `sectionRef`. Criar uma ref separada para o cabeçalho, porque o grid de cards vai receber o seu próprio trigger na Task 4 (o cabeçalho e os cards estão a 60px de distância e não devem compartilhar a mesma cascata).

Adicionar ao import de `react` (linha 9) e importar o hook:

```tsx
import { useRef } from "react"

import { useEnterMotion } from "@/hooks/use-enter-motion"
```

Dentro de `function AtendimentoCards()`, junto das refs existentes:

```tsx
  const headerRef = useRef<HTMLDivElement>(null)
  useEnterMotion({ scopeRef: headerRef })
```

No JSX, pôr a ref no `<Wrap>` do cabeçalho (linha 242) e marcar os três elementos:

```tsx
      <Wrap ref={headerRef} className="relative z-[1] text-center max-sm:text-left">
        <div className="mx-auto w-fit text-left max-sm:mx-0">
          <Eyebrow data-enter>{atendimento.eyebrow}</Eyebrow>
          <h2
            data-enter
            className="text-left text-[clamp(1.9rem,3.2vw,2.5rem)] font-extrabold"
          >
            {atendimento.title}
          </h2>
        </div>
        <p
          data-enter
          className="mx-auto mt-5 max-w-[620px] text-[1.08rem] text-graphite max-sm:mx-0"
        >
          {atendimento.intro}
        </p>
```

**Atenção:** `Wrap` é um componente de `@/components/layout/container`. Se ele não encaminhar `ref` (não é um `forwardRef` nem um componente que espalha props num elemento nativo), **não alterar o componente `Wrap`** — em vez disso, envolver o conteúdo numa `<div ref={headerRef}>` dentro do `Wrap`, preservando as classes existentes. Ler `src/components/layout/container.tsx` antes de decidir qual dos dois caminhos usar. Em React 19, componentes de função recebem `ref` como prop normal, então o caminho direto costuma funcionar — mas confirme lendo o arquivo.

- [ ] **Step 4: Aplicar em `operacional.tsx`**

A seção não tem ref. Adicionar imports:

```tsx
import { useRef } from "react"

import { useEnterMotion } from "@/hooks/use-enter-motion"
```

Dentro de `function Operacional()` (linha 24), antes do `return`:

```tsx
  const sectionRef = useRef<HTMLElement>(null)
  useEnterMotion({ scopeRef: sectionRef })
```

No JSX (linha 28):

```tsx
    <section
      ref={sectionRef}
      className="bg-deep-blue py-[104px] text-off-white"
    >
```

Marcar o cabeçalho (linhas 33-36) — esta seção não tem subtítulo, são dois elementos:

```tsx
          <Eyebrow tone="on-dark" data-enter>{operacional.eyebrow}</Eyebrow>
          <h2
            data-enter
            className="text-left text-[clamp(1.9rem,3.2vw,2.5rem)] font-extrabold text-off-white"
          >
            {operacional.title}
          </h2>
```

- [ ] **Step 5: Aplicar em `diferenciais.tsx`**

Mesmos imports do passo anterior. Dentro de `function Diferenciais()` (linha 17), antes do `return`:

```tsx
  const sectionRef = useRef<HTMLElement>(null)
  useEnterMotion({ scopeRef: sectionRef })
```

No JSX (linha 21):

```tsx
    <section ref={sectionRef} className="bg-off-white py-[100px]">
```

Marcar o cabeçalho (linhas 24-27) — sem subtítulo:

```tsx
          <Eyebrow data-enter>{diferenciais.eyebrow}</Eyebrow>
          <h2
            data-enter
            className="text-left text-[clamp(1.9rem,3.2vw,2.5rem)] font-extrabold"
          >
            {diferenciais.title}
          </h2>
```

**Não** marcar os itens da lista com `data-enter` — o corpo da seção fica parado. A lista é assunto do acento 3 (Task 5), e lá o que muda é estado de destaque, não entrada.

- [ ] **Step 6: Aplicar em `clientes.tsx`**

Mesmos imports. Dentro de `function Clientes()` (linha 23), antes do `return`:

```tsx
  const sectionRef = useRef<HTMLElement>(null)
  useEnterMotion({ scopeRef: sectionRef })
```

No JSX (linha 29):

```tsx
    <section
      ref={sectionRef}
      className="bg-off-white py-[100px] text-center max-sm:text-left"
    >
```

Marcar o cabeçalho (linhas 32-35) — sem subtítulo:

```tsx
          <Eyebrow data-enter>{clientes.eyebrow}</Eyebrow>
          <h2
            data-enter
            className="text-left text-[clamp(1.9rem,3.2vw,2.5rem)] font-extrabold"
          >
            {clientes.title}
          </h2>
```

A grade de logos **não** recebe `data-enter`.

- [ ] **Step 7: Aplicar em `contato-footer.tsx`**

Mesmos imports. Dentro de `function ContatoFooter()` (linha 17), antes do `return`:

```tsx
  const sectionRef = useRef<HTMLElement>(null)
  useEnterMotion({ scopeRef: sectionRef })
```

No JSX (linhas 21-25), preservando `id` e `style`:

```tsx
    <section
      ref={sectionRef}
      id="contato"
      className="relative flex min-h-[64vh] items-center text-off-white"
      style={contatoBackground}
    >
```

Marcar o cabeçalho (linhas 30-33) — sem subtítulo:

```tsx
          <Eyebrow tone="on-dark" data-enter>{contato.eyebrow}</Eyebrow>
          <h2
            data-enter
            className="text-left text-[clamp(1.9rem,3.2vw,2.5rem)] font-extrabold text-off-white"
          >
            {contato.title}
          </h2>
```

- [ ] **Step 8: Verificar tipagem e build**

Run: `npm run build`
Expected: sem erro. Se aparecer erro de `ref` em `Wrap` (passo 3) ou em `Eyebrow` (`data-enter` não existir no tipo), resolver assim:
- `Eyebrow` estende `ComponentPropsWithoutRef<"span">`, que aceita `data-*` — não deve dar erro.
- Se `Wrap` reclamar de `ref`, aplicar o plano B descrito no passo 3 (div interna).

- [ ] **Step 9: Verificar o lint**

Run: `npx oxlint`
Expected: 3 warnings pré-existentes, nenhum novo.

- [ ] **Step 10: Conferir na página real**

Run: `npm run dev`

Abrir `http://localhost:5173` numa janela de 1440px e descer a página inteira devagar. Conferir:
- Cada um dos seis cabeçalhos entra uma vez, subindo 44px e aparecendo, com os elementos em cascata de 140ms.
- Nenhum corpo de seção anima (lista de Diferenciais, grade de logos, listas de Operacional, cards de Atendimento — todos parados nesta etapa).
- Subir e descer de novo **não** re-dispara nada.
- Nada pisca no carregamento.

- [ ] **Step 11: Commit**

```bash
git add src/hooks/use-enter-motion.ts src/components/sections/
git commit -m "feat(motion): base ritmica de entrada nos cabecalhos das seis secoes"
```

---

### Task 3: Acento 1 — Hero · "Chegada / wayfinding"

Escolhido pelo Pedro entre três opções animadas. É a única das três que estende o vocabulário do avião/pin já em produção em vez de criar um segundo idioma de movimento.

Sequência, total ~2,0s: faixa utilitária entra lateralmente como painel de aeroporto → logo → a linha de 3px do rodapé corre da esquerda para a direita como uma rota sendo traçada → bloco principal chega logo atrás, em intervalo curto.

**Files:**
- Create: `src/hooks/use-hero-motion.ts`
- Modify: `src/components/sections/hero.tsx`

**Interfaces:**
- Consumes: `EASE`, `ENTER_DISTANCE`, `ENTER_DURATION`, `ENTER_SCALE_FROM`, `HERO_STAGGER` de `@/lib/motion`.
- Produces: `useHeroMotion({ scopeRef }: { scopeRef: RefObject<HTMLElement | null> }): void`, exportado de `@/hooks/use-hero-motion`. Assinatura em objeto para casar com `useEnterMotion` e com o `useRouteMotion` já existente no projeto. Contrato de marcação, dentro do escopo: `data-hero="utility"`, `data-hero="logo"`, `data-hero="rule"`, `data-hero="block"`.

- [ ] **Step 1: Criar `src/hooks/use-hero-motion.ts`**

```ts
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import type { RefObject } from "react"

import {
  EASE,
  ENTER_DISTANCE,
  ENTER_DURATION,
  ENTER_SCALE_FROM,
  HERO_STAGGER,
} from "@/lib/motion"

gsap.registerPlugin(useGSAP)

/**
 * Acento 1 — entrada da Hero, "Chegada / wayfinding".
 * Spec: docs/superpowers/specs/2026-08-04-gsap-sofisticacoes-design.md
 *
 * Estende o vocabulário do avião/pin já em produção em vez de criar um
 * segundo idioma de movimento: a linha de 3px do rodapé corre da esquerda
 * para a direita como uma rota sendo traçada, e o bloco de texto chega logo
 * atrás dela.
 *
 * Sem ScrollTrigger: a Hero está acima da dobra e a sequência roda no
 * carregamento, uma vez. As posições são absolutas na timeline (0, 0.2,
 * 0.45, 0.75) justamente para a calibragem ser mexer em quatro números
 * legíveis, não em offsets relativos encadeados.
 *
 * O bloco principal usa HERO_STAGGER (80ms), não o stagger uniforme das
 * demais seções: aqui os quatro elementos chegam juntos, como um bloco,
 * porque quem carrega a cadência é a linha.
 */
interface UseHeroMotionOptions {
  /** Escopo da Hero: os seletores `[data-hero=...]` são buscados dentro dele. */
  scopeRef: RefObject<HTMLElement | null>
}

function useHeroMotion({ scopeRef }: UseHeroMotionOptions) {
  useGSAP(
    () => {
      const root = scopeRef.current
      if (!root) return

      const mm = gsap.matchMedia()

      mm.add(
        { reduceMotion: "(prefers-reduced-motion: reduce)" },
        (context) => {
          const { reduceMotion } = context.conditions as {
            reduceMotion: boolean
          }

          const tl = gsap.timeline({
            defaults: { duration: ENTER_DURATION, ease: EASE },
          })

          if (reduceMotion) {
            // Fade sem deslocamento, mesma ordem e mesmos tempos: quem pede
            // movimento reduzido continua percebendo a sequência de chegada,
            // sem nada deslizando pela tela.
            tl.from('[data-hero="utility"]', { opacity: 0 }, 0)
              .from('[data-hero="logo"]', { opacity: 0 }, 0.2)
              .from('[data-hero="rule"]', { opacity: 0, duration: 1.4 }, 0.45)
              .from(
                '[data-hero="block"]',
                { opacity: 0, stagger: HERO_STAGGER },
                0.75
              )
          } else {
            tl.from(
              '[data-hero="utility"]',
              { xPercent: -100, opacity: 0, duration: 0.9 },
              0
            )
              .from(
                '[data-hero="logo"]',
                { opacity: 0, y: ENTER_DISTANCE, scale: ENTER_SCALE_FROM },
                0.2
              )
              .from(
                '[data-hero="rule"]',
                { scaleX: 0, transformOrigin: "left center", duration: 1.4 },
                0.45
              )
              .from(
                '[data-hero="block"]',
                {
                  opacity: 0,
                  y: ENTER_DISTANCE,
                  scale: ENTER_SCALE_FROM,
                  stagger: HERO_STAGGER,
                },
                0.75
              )
          }

          return () => {
            tl.kill()
          }
        },
        scopeRef
      )

      return () => {
        mm.revert()
      }
    },
    { scope: scopeRef }
  )
}

export { useHeroMotion }
```

- [ ] **Step 2: Marcar os quatro tempos em `hero.tsx`**

Adicionar imports no topo do arquivo:

```tsx
import { useRef } from "react"

import { useHeroMotion } from "@/hooks/use-hero-motion"
```

Dentro de `function Hero()` (linha 46), antes do `return`:

```tsx
  const sectionRef = useRef<HTMLElement>(null)
  useHeroMotion({ scopeRef: sectionRef })
```

Na `<section>` (linha 50):

```tsx
    <section
      ref={sectionRef}
      className="relative flex min-h-svh flex-col overflow-hidden text-off-white"
      style={heroBackground}
    >
```

**Tempo 3 — a linha de rota** (linhas 87-91). É a `div` que já existe, não criar outra:

```tsx
      <div
        aria-hidden
        data-hero="rule"
        className="absolute inset-x-0 bottom-0 z-[2] h-[3px] opacity-90"
        style={dividerBackground}
      />
```

**Tempo 1 — faixa utilitária** (linha 93):

```tsx
      <div
        data-hero="utility"
        className="relative z-[1] border-b border-hair-light bg-ink/35"
      >
```

**Tempo 2 — logo** (linhas 116-131). Marcar o `<img>` do logo **e** o CTA do header: os dois entram no mesmo tween, sem stagger, para o header chegar como uma peça só. *Decisão minha na redação do plano: a spec lista só "Logo" no tempo 2, mas deixar o botão ao lado estático enquanto o logo entra lê como esquecimento. Confirmar na validação visual.*

```tsx
          <img
            src={logoClaraNova}
            alt="Carioca Viagens"
            data-hero="logo"
            className="w-[200px]"
          />
          <a
            href="#contato"
            data-hero="logo"
            className={cn(buttonVariants({ variant: "outline" }), "max-sm:hidden")}
          >
            {hero.ctaPrimary}
          </a>
```

**Tempo 4 — bloco principal** (linhas 143-183). Quatro elementos, cada um com `data-hero="block"`: o `Eyebrow`, o `h1`, o `p` do subtítulo e a `div` dos CTAs (o wrapper inteiro, não cada botão).

```tsx
          <Eyebrow tone="on-dark" data-hero="block" className="mb-5">
            {hero.eyebrow}
          </Eyebrow>
```

```tsx
          <h1
            data-hero="block"
            className="max-w-[920px] text-[clamp(2.2rem,10.5vw,2.8rem)] leading-[1.03] font-extrabold tracking-[-0.03em] text-off-white sm:text-[clamp(2.8rem,6.2vw,5.2rem)]"
          >
```

```tsx
          <p
            data-hero="block"
            className="mt-6 max-w-[480px] text-[1.15rem] text-off-white/86 max-sm:text-pretty"
          >
```

```tsx
          <div
            data-hero="block"
            className="mt-9 flex flex-wrap gap-3.5 max-sm:grid max-sm:w-fit"
          >
```

O `h1` entra como uma unidade. A opção "B · a virada" (pausa de 0,6s entre as duas linhas) foi apresentada e **não** foi escolhida — não implementar.

- [ ] **Step 3: Verificar build e lint**

Run: `npm run build && npx oxlint`
Expected: build sem erro; 3 warnings pré-existentes no lint, nenhum novo.

- [ ] **Step 4: Conferir na página real**

Run: `npm run dev`

Recarregar a Hero várias vezes em 1440px e conferir:
- A faixa utilitária entra pela esquerda, o logo e o CTA do header chegam, a linha de 3px corre da esquerda para a direita e o bloco de texto chega logo atrás dela.
- O CTA verde está visível e clicável em ~2s. Se estiver demorando mais, o ajuste é nos quatro números de posição da timeline.
- Nenhum flash de conteúdo antes da animação começar.
- O vídeo de fundo e o poster não são afetados.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/use-hero-motion.ts src/components/sections/hero.tsx
git commit -m "feat(motion): acento 1 - entrada da Hero (chegada/wayfinding)"
```

---

### Task 4: Acento 2 — Cards de Atendimento · "C sozinho"

O card sobe (base rítmica) e, logo em seguida, a zona de foto preenche de baixo para cima — um gesto forte por card, leitura limpa. Stagger de 140ms entre os três cards.

**O que não acontece:** as réguas horizontais **não** correm da esquerda para a direita (opção C+B, vista e recusada). O hover atual dos cards **fica como está** — foto em `scale(1.06)` a 500ms e a lâmina que clareia, em CSS puro. Não adicionar lift do card nem deslocamento da seta `ArrowUpRight`.

**Files:**
- Modify: `src/hooks/use-enter-motion.ts` (adicionar suporte a `data-enter-fill`)
- Modify: `src/components/sections/atendimento-cards.tsx`

**Interfaces:**
- Consumes: `useEnterMotion` da Task 2, tokens de `@/lib/motion`.
- Produces: opção `fillOffset?: number` (default `0.15`) em `UseEnterMotionOptions`; contrato de marcação `data-enter-fill`.

- [ ] **Step 1: Adicionar `data-enter-fill` ao hook**

Em `src/hooks/use-enter-motion.ts`, acrescentar a opção à interface:

```ts
interface UseEnterMotionOptions {
  /** Escopo da busca por `[data-enter]` e trigger do ScrollTrigger. */
  scopeRef: RefObject<HTMLElement | null>
  /** Intervalo entre irmãos. Default: ENTER_STAGGER. */
  stagger?: number
  /** Posição de disparo do ScrollTrigger. Default: "top 85%". */
  start?: string
  /**
   * Atraso, em segundos, entre a subida de um elemento e o preenchimento do
   * `[data-enter-fill]` correspondente. Default: 0.15 — "logo em seguida".
   */
  fillOffset?: number
}
```

E na assinatura da função:

```ts
function useEnterMotion({
  scopeRef,
  stagger = ENTER_STAGGER,
  start = "top 85%",
  fillOffset = 0.15,
}: UseEnterMotionOptions) {
```

Trocar o corpo do `mm.add` por uma timeline, para os dois gestos compartilharem um único ScrollTrigger e as posições ficarem explícitas. O bloco inteiro do callback passa a ser:

```ts
        (context) => {
          const { reduceMotion } = context.conditions as {
            reduceMotion: boolean
          }

          const fills = gsap.utils.toArray<HTMLElement>(
            root.querySelectorAll("[data-enter-fill]")
          )

          const tl = gsap.timeline({
            scrollTrigger: { trigger: root, start, once: true },
          })

          // Movimento reduzido: fade sem deslocamento. O desconforto
          // vestibular vem de deslocamento e paralaxe, não de opacidade —
          // reduzimos, não desligamos (mesmo critério do pin/avião e do
          // autoplay do carrossel).
          tl.from(
            targets,
            {
              opacity: 0,
              ...(reduceMotion
                ? {}
                : { y: ENTER_DISTANCE, scale: ENTER_SCALE_FROM }),
              duration: ENTER_DURATION,
              ease: EASE,
              stagger,
            },
            0
          )

          if (fills.length > 0) {
            // A zona preenche de baixo para cima. Sob movimento reduzido o
            // mesmo conteúdo aparece sem a revelação direcional.
            // `clearProps` devolve o clip-path ao CSS no fim, para não deixar
            // custo de paint nem interferir no zoom de hover da foto.
            tl.fromTo(
              fills,
              {
                clipPath: reduceMotion
                  ? "inset(0% 0% 0% 0%)"
                  : "inset(100% 0% 0% 0%)",
                opacity: reduceMotion ? 0 : 1,
              },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                opacity: 1,
                duration: ENTER_DURATION,
                ease: EASE,
                stagger,
                clearProps: "clipPath",
              },
              fillOffset
            )
          }

          return () => {
            tl.scrollTrigger?.kill()
            tl.kill()
          }
        },
```

Atualizar também o comentário de bloco do hook, acrescentando ao final:

```
 * Elementos com `data-enter-fill` são revelados de baixo para cima
 * (clip-path), `fillOffset` segundos depois da subida — é o acento 2 dos
 * cards de Atendimento. O gesto é o mesmo do preenchimento dos CTAs: o
 * sistema fecha em dois lugares.
```

- [ ] **Step 2: Marcar os cards e a zona de foto**

Em `src/components/sections/atendimento-cards.tsx`, no componente `AtendimentoCard`, marcar a `div` raiz (a que tem `group rounded-[30px] shadow-...`):

```tsx
    <div
      data-enter
      className="group rounded-[30px] shadow-[9px_12px_16px_-9px_rgba(12,33,50,0.5)]"
    >
```

E marcar a zona de foto — a `div` com `row-start-5`, que já é o container `relative` da imagem e da lâmina:

```tsx
        <div
          data-enter-fill
          className={cn(
            "relative row-start-5 border-t",
            variant === "green"
              ? "border-[color-mix(in_srgb,var(--color-deep-blue)_14%,transparent)]"
              : "border-off-white/16"
          )}
        >
```

- [ ] **Step 3: Dar ao grid de cards o seu próprio escopo**

Ainda em `atendimento-cards.tsx`, dentro de `function AtendimentoCards()`, ao lado do `headerRef` criado na Task 2:

```tsx
  const cardsRef = useRef<HTMLDivElement>(null)
  useEnterMotion({ scopeRef: cardsRef })
```

E no JSX, na `div` do grid (a que tem `mt-[60px] grid grid-cols-1 ...`):

```tsx
        <div
          ref={cardsRef}
          className="mt-[60px] grid grid-cols-1 items-stretch gap-[26px] desktop:grid-cols-3"
        >
```

Escopo separado do cabeçalho de propósito: os dois estão a 60px de distância e não devem dividir a mesma cascata — senão as fotos, ancoradas em `fillOffset` absoluto, começariam antes dos cards subirem.

- [ ] **Step 4: Verificar build e lint**

Run: `npm run build && npx oxlint`
Expected: build sem erro; 3 warnings pré-existentes, nenhum novo.

- [ ] **Step 5: Conferir na página real**

Run: `npm run dev`

Descer até Atendimento em 1440px e conferir:
- O cabeçalho entra primeiro, no seu próprio tempo.
- Os três cards sobem com 140ms entre eles e, ~150ms depois de cada um, a zona de foto preenche de baixo para cima.
- Depois da animação, passar o mouse em cada card: o zoom de 6% na foto e a lâmina clareando continuam funcionando (o `clearProps` devolveu o clip-path).
- As réguas horizontais **não** animam.
- A seta `ArrowUpRight` **não** se desloca e o card **não** levanta no hover.
- O avião da trajetória continua se movendo com o scroll, sem conflito.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/use-enter-motion.ts src/components/sections/atendimento-cards.tsx
git commit -m "feat(motion): acento 2 - cards de Atendimento com zona de foto preenchendo"
```

---

### Task 5: Acento 3 — Diferenciais · sync carrossel ↔ lista

O item da lista acende quando o slide correspondente fica ativo. No slide da Flavinha (índice 0) **nenhum item fica aceso** — palavras do Pedro: "só ativa quando estiver realmente no slide correto".

Pareamento **1:1 com offset de 1** (`item[i]` ↔ `slide[i+1]`): a lista tem 4 itens, o carrossel tem 5 slides, e as legendas dos slides 2–5 já numeram `01 ·` a `04 ·` com os mesmos rótulos dos itens.

O caminho inverso — clicar no item e ir ao slide — sai junto, com `api.scrollTo(i + 1)`.

**Files:**
- Modify: `src/components/sections/diferenciais-carousel.tsx`
- Modify: `src/components/sections/diferenciais.tsx`

**Interfaces:**
- Consumes: `CarouselApi` de `@/components/ui/carousel` (já exportado como tipo).
- Produces: `DiferenciaisCarousel` passa a aceitar duas props opcionais:
  ```ts
  interface DiferenciaisCarouselProps {
    onActiveChange?: (index: number) => void
    onApiChange?: (api: CarouselApi) => void
  }
  ```
  Ambas opcionais — o componente continua funcionando isolado, sem pai que escute.

- [ ] **Step 1: Elevar índice ativo e API em `diferenciais-carousel.tsx`**

Trocar a assinatura do componente (linha 32) e adicionar os dois efeitos de notificação. O estado `current` e o autoplay **não mudam** — o componente continua dono da própria lógica; só passa a avisar o pai.

```tsx
interface DiferenciaisCarouselProps {
  /** Notifica o pai quando o slide ativo muda (índice do slide, 0-based). */
  onActiveChange?: (index: number) => void
  /** Entrega a API do Embla ao pai, para navegação a partir de fora. */
  onApiChange?: (api: CarouselApi) => void
}

function DiferenciaisCarousel({
  onActiveChange,
  onApiChange,
}: DiferenciaisCarouselProps) {
```

Logo depois do `useEffect` existente que registra o listener `select` (linhas 53-62), acrescentar dois efeitos:

```tsx
  useEffect(() => {
    onActiveChange?.(current)
  }, [current, onActiveChange])

  useEffect(() => {
    if (api) onApiChange?.(api)
  }, [api, onApiChange])
```

Não duplicar o listener de `select`: o `current` já existe e já é atualizado — estes efeitos só espelham para fora.

- [ ] **Step 2: Consumir o estado em `diferenciais.tsx`**

Adicionar imports (`useCallback`, `useState` e o tipo da API):

```tsx
import { useCallback, useRef, useState } from "react"

import type { CarouselApi } from "@/components/ui/carousel"
```

Dentro de `function Diferenciais()`, junto do `sectionRef` da Task 2:

```tsx
  const [activeSlide, setActiveSlide] = useState(0)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

  // useCallback: as duas funções são dependências de efeito dentro do
  // carrossel — sem identidade estável, cada render do pai reexecutaria os
  // efeitos do filho.
  const handleActiveChange = useCallback((index: number) => {
    setActiveSlide(index)
  }, [])
  const handleApiChange = useCallback((api: CarouselApi) => {
    setCarouselApi(api)
  }, [])
```

Passar as props ao carrossel (linha 46):

```tsx
          <DiferenciaisCarousel
            onActiveChange={handleActiveChange}
            onApiChange={handleApiChange}
          />
```

- [ ] **Step 3: Acender o item correspondente e torná-lo clicável**

Substituir o `map` da lista (linhas 29-42) por esta versão. O item vira `<button>` — ele passa a ter ação — com `aria-current` para leitores de tela e `focus-visible` explícito, já que o `<div>` original não era focável.

```tsx
            {diferenciais.items.map((item, i) => {
              const Icon = ICONS[item.icon]
              // Pareamento 1:1 com offset de 1 — o slide 0 é o retrato da
              // Flavinha e não corresponde a nenhum item: nele nada acende.
              const isActive = activeSlide === i + 1
              return (
                <button
                  key={item.label}
                  type="button"
                  aria-current={isActive}
                  onClick={() => carouselApi?.scrollTo(i + 1)}
                  className="grid w-full cursor-pointer grid-cols-[32px_1fr] items-center gap-[22px] border-b border-hair py-[26px] text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-carioca-blue"
                >
                  <Icon
                    className={`size-[22px] transition-colors duration-300 ease-carioca ${
                      isActive ? "text-carioca-green" : "text-carioca-blue"
                    }`}
                  />
                  <span
                    className={`font-display text-[1.2rem] font-semibold transition-colors duration-300 ease-carioca ${
                      isActive ? "text-carioca-blue" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
```

*Decisão minha, tomada na redação do plano: a spec define o comportamento ("o item acende") mas não o tratamento visual do aceso. Escolhi ícone indo para `carioca-green` e rótulo para `carioca-blue`, em 300ms com a curva do sistema — usa só tokens da paleta, não mexe em peso nem em posição (nada de layout shift) e ecoa o verde como cor de estado que a marca já usa. **Confirmar com o Pedro na validação visual**; se ele quiser outro tratamento, é trocar duas classes.*

- [ ] **Step 4: Verificar build e lint**

Run: `npm run build && npx oxlint`
Expected: build sem erro; 3 warnings pré-existentes, nenhum novo.

Se o TypeScript reclamar que `CarouselApi` pode ser `undefined` em `carouselApi?.scrollTo`, o optional chaining já cobre — não adicionar non-null assertion.

- [ ] **Step 5: Conferir na página real**

Run: `npm run dev`

Na seção Diferenciais:
- Com o autoplay rodando, o item correspondente acende a cada troca de slide.
- No slide da Flavinha (o primeiro), **nenhum** item fica aceso.
- Clicar num item leva ao slide correspondente e reinicia o contador do autoplay.
- Passar o mouse sobre o carrossel pausa o autoplay (comportamento pré-existente, não pode regredir).
- Navegar pelos itens com Tab mostra foco visível.
- Com movimento reduzido ligado, o autoplay não inicia e o destaque continua funcionando ao clicar.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/diferenciais.tsx src/components/sections/diferenciais-carousel.tsx
git commit -m "feat(motion): acento 3 - sync entre carrossel e lista de Diferenciais"
```

---

### Task 6: Microinterações de CTA — "C · Preenchimento"

A superfície do botão preenche de baixo para cima no hover — `scaleY 0 → 1`, `transform-origin: bottom`, 320ms, mesma curva. É o mesmo gesto da foto subindo nos cards de Atendimento, então o sistema fecha em dois lugares. Press: compressão `scale(0.985)` em 80ms.

Implementação em **CSS puro** no `buttonVariants`, com pseudo-elemento e `isolation: isolate`. Não é caso de GSAP.

Descartadas com o Pedro: "A · Peso" (subir 2px + sombra) e "B · Rota" (linha de 2px correndo na base). Não implementar nenhuma das duas.

**Files:**
- Modify: `src/components/ui/button.tsx` (linhas 12-26)

**Interfaces:**
- Consumes: `--motion-fill-duration`, `--motion-press-duration` e `ease-carioca` da Task 1.
- Produces: nada de novo na API — `buttonVariants` mantém as mesmas três variantes (`solid`, `outline`, `outline-on-light`) e a mesma assinatura. Só o visual do hover/press muda. Isso vale tanto para o componente `Button` quanto para os `<a>` da Hero, que usam `buttonVariants` direto.

- [ ] **Step 1: Reescrever a base do `buttonVariants`**

Substituir a string base (linha 13) por esta. As mudanças são: `relative isolate overflow-hidden`, o pseudo-elemento do preenchimento, `transform` entrando na lista de transições e o press.

```ts
  "relative isolate inline-flex items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-carioca border px-[26px] py-[14px] font-body text-[0.92rem] font-medium tracking-[0.01em] no-underline transition-[background-color,opacity,transform] duration-150 ease-out outline-none before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:transition-transform before:duration-[var(--motion-fill-duration)] before:ease-carioca before:content-[''] hover:before:scale-y-100 focus-visible:before:scale-y-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue active:scale-[0.985] active:duration-[var(--motion-press-duration)] motion-reduce:before:transition-none motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
```

Notas de mecânica, para quem executa:
- `isolate` cria o stacking context: o `before:-z-10` fica acima do fundo do botão e abaixo do texto, sem escapar para trás de outros elementos da página.
- `overflow-hidden` não corta o `outline` de foco — `outline` não é clipado pelo overflow do próprio elemento.
- `motion-reduce:before:transition-none` deixa o preenchimento **instantâneo** no hover, não desligado: é a "troca de cor direto" que a spec pede. O press some por completo (`motion-reduce:active:scale-100`), porque é `transform`.
- `focus-visible:before:scale-y-100` dá ao teclado o mesmo retorno visual do mouse. *Decisão minha na redação do plano — a spec fala de hover e press; estender ao foco é coerente com o critério de acessibilidade da própria spec e não altera o traço visual.*

- [ ] **Step 2: Trocar os hovers das três variantes**

Substituir o bloco `variants` (linhas 15-21) por este. Os hovers antigos (`hover:opacity-[0.88]`, `hover:bg-black/30`, `hover:bg-black/5`) **saem** — a camada que sobe os substitui.

```ts
    variants: {
      variant: {
        solid:
          "border-carioca-green bg-carioca-green text-deep-blue before:bg-light-green",
        outline:
          "border-hair-light bg-transparent text-off-white before:bg-[color-mix(in_srgb,var(--color-off-white)_14%,transparent)]",
        "outline-on-light":
          "border-carioca-blue bg-transparent text-carioca-blue before:bg-[color-mix(in_srgb,var(--color-carioca-blue)_10%,transparent)]",
      },
    },
```

- [ ] **Step 3: Verificar build e lint**

Run: `npm run build && npx oxlint`
Expected: build sem erro; 3 warnings pré-existentes, nenhum novo.

- [ ] **Step 4: Conferir na página real**

Run: `npm run dev`

Testar as três variantes:
- `solid` — os dois CTAs verdes (Hero e rodapé): o verde claro sobe de baixo para cima em 320ms.
- `outline` — CTA do header da Hero e o secundário "Fale conosco": véu off-white a 14% subindo.
- `outline-on-light` — **não tem nenhum consumidor no código hoje** (verificado: `grep -rn "outline-on-light" src/` só encontra a própria definição em `button.tsx:19`). Ela existe como variante aprovada do design system, para uso sobre fundo claro. Não há como validá-la na página; conferir apenas que o build não quebra e que a classe gerada está coerente com as outras duas. **Não criar um uso artificial só para testar.**
- Press: clicar e segurar em cada uma — a compressão é perceptível e imediata.
- Teclado: navegar com Tab — o contorno de foco aparece e o preenchimento acompanha.
- Contraste do texto durante e depois do preenchimento: o rótulo continua legível nas três variantes.
- Com movimento reduzido ligado: o hover troca de cor sem a superfície subindo, e o press não comprime.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/button.tsx
git commit -m "feat(motion): microinteracao de preenchimento e press nos CTAs"
```

---

### Task 7: Atualizar `design/design.md` §19

A §19 está marcada `[PROVISÓRIO — nada implementado ainda]`, o que é falso desde 2026-07-15, quando o pin/avião entrou em produção — e mais ainda depois deste plano.

**Files:**
- Modify: `design/design.md` (§19)

**Interfaces:**
- Consumes: o que as Tasks 1-6 implementaram.
- Produces: documentação. Nenhum código depende disto.

- [ ] **Step 1: Ler a §19 atual antes de escrever**

Run: `grep -n "^## 19\|^## 20" design/design.md`

Ler a seção inteira no intervalo encontrado. **Não reescrever o que já está correto** — a tarefa é remover a marca de provisório e documentar o que existe, não refazer a seção.

- [ ] **Step 2: Reescrever a §19**

Remover a marca `[PROVISÓRIO — nada implementado ainda]` e documentar o sistema em produção:

1. **Tokens** — a tabela de `src/lib/motion.ts` (`ENTER_DISTANCE` 44px, `ENTER_DURATION` 1.0s, `ENTER_STAGGER` 0.14s, `ENTER_SCALE_FROM` 0.965, `EASE` `power4.out`, `HERO_STAGGER` 0.08s) e o espelho CSS (`--ease-carioca`, `--motion-fill-duration`, `--motion-press-duration`).
2. **Camada scroll-linked** — pin (Sobre) e avião (Atendimento) via `use-route-motion.ts`, em produção desde 2026-07-15.
3. **Base rítmica** — só cabeçalhos, seis seções, `once: true`, via `use-enter-motion.ts`.
4. **Os três acentos** — Hero (chegada/wayfinding), cards de Atendimento (zona de foto preenchendo), Diferenciais (sync carrossel ↔ lista).
5. **CTAs** — preenchimento de baixo para cima e press, em CSS no `button.tsx`.
6. **Movimento reduzido** — fade sem deslocamento; `gsap.matchMedia()` para GSAP, `motion-reduce:` para CSS. O princípio: reduzimos, não desligamos.
7. **Princípio de percepção** — movimento diluído em scroll longo não é percebido; motion perceptível acontece em intervalo curto. Registrar o caso que originou o aprendizado (a 1ª versão da escala da foto presa ao scroll).

Apontar a spec (`docs/superpowers/specs/2026-08-04-gsap-sofisticacoes-design.md`) como origem das decisões.

- [ ] **Step 3: Commit**

```bash
git add design/design.md
git commit -m "docs: atualiza design.md 19 com o motion em producao"
```

---

### Task 8: Verificação final e validação com o Pedro

Não gera commit de código. É o portão que a spec define antes de publicar.

**Files:** nenhum (a menos que a verificação revele defeito — aí a correção entra como commit próprio).

- [ ] **Step 1: Build e lint limpos**

Run: `npm run build && npx oxlint`
Expected: build sem erro; 3 warnings pré-existentes, nenhum novo.

- [ ] **Step 2: Descida completa em 1440px**

Run: `npm run dev`

Descer a página inteira, do topo ao rodapé, em ritmo normal de leitura. É esta passagem que a simulação de moldura curta não conseguiu provar: o que se avalia aqui é o **efeito acumulado** da base rítmica — se a repetição lê como cadência ou como excesso.

Se estiver excessivo, a calibragem é mudar os números em `src/lib/motion.ts`, não desligar animação por seção.

- [ ] **Step 3: Movimento reduzido**

Ligar "Mostrar animações no Windows" em Configurações → Acessibilidade → Efeitos visuais (desligar a opção) e recarregar. Conferir:
- Nada desliza; tudo aparece.
- Pin e avião ficam em posição estática.
- O autoplay do carrossel não inicia.
- O hover dos CTAs troca de cor direto; o press não comprime.

- [ ] **Step 4: Teclado**

Navegar a página inteira só com Tab. Foco visível em todos os CTAs e nos itens da lista de Diferenciais. A `focus-visible` atual não pode regredir.

- [ ] **Step 5: Mobile — 360px e 412px**

A spec decide: **implementar rodando igual ao desktop**, testar no aparelho e só então avaliar. Palavras do Pedro: "a princípio gostaria de ver como é que ele funciona rodando igual. Se não ficar bom, a gente pode discutir sobre reduzir ou ainda não rodar, mas acho que é necessário testar".

Testar em 360px e 412px — a calibragem do Galaxy A53 descoberta na §24 do handoff. Primeiro no DevTools, depois no aparelho do Pedro.

- [ ] **Step 6: Validação com o Pedro**

Apresentar e coletar decisão sobre os três pontos marcados como decisão minha durante a redação deste plano:
1. O CTA do header da Hero entrando junto com o logo (Task 3).
2. O tratamento visual do item aceso em Diferenciais — ícone `carioca-green`, rótulo `carioca-blue` (Task 5).
3. O preenchimento dos CTAs também no `focus-visible` (Task 6).

E a avaliação do mobile, que a spec deixou explicitamente em aberto para depois do teste no aparelho.

---

## Notas de execução

**Ordem:** as tarefas seguem a ordem da spec e têm dependência real entre si. A Task 4 modifica o hook criado na Task 2; a Task 6 usa as custom properties da Task 1. Não paralelizar.

**Padrões GSAP conferidos contra a skill oficial** (`gsap`, referências `gsap-react`, `gsap-core`, `gsap-scrolltrigger`):

- `useGSAP` com `scope` é o padrão recomendado, e é o que permite usar seletores de atributo (`[data-hero="rule"]`) com segurança — sem escopo, seriam proibidos.
- ScrollTrigger fica **na timeline ou num tween top-level, nunca num tween filho de timeline**. A Task 2 o coloca num tween top-level; a Task 4, na timeline. Ambos corretos.
- `gsap.matchMedia()` com objeto de condições nomeadas é o padrão oficial para `prefers-reduced-motion`, e é o que `use-route-motion.ts` já usa. `matchMedia` cria contexto internamente — por isso o cleanup é `mm.revert()`, sem aninhar `gsap.context()` dentro dele.
- **Sem `refreshPriority`:** ele é necessário quando ScrollTriggers são criados fora da ordem da página. Aqui os componentes montam na ordem de `App.tsx`, que é a ordem da página. Verificado também que **não existe pinning** no projeto — o "pin" de `use-route-motion.ts` é o ícone de mapa, não `pin: true` do ScrollTrigger.
- **Se as animações dispararem em posição errada** depois de imagens carregarem, a causa é o layout mudando após o cálculo dos triggers; a correção é `ScrollTrigger.refresh()`. Risco baixo neste projeto porque as imagens têm proporção fixa reservada (`aspect-square` nos cards, `aspect-[3/2]` nos logos), mas é a primeira hipótese a testar se acontecer.

**Desvio consciente de uma house rule da skill `gsap`:** a skill recomenda "um scroll-trigger por seção, no máximo". A seção Atendimento fica com três (avião pré-existente, cabeçalho, grid de cards). É deliberado: a spec aprovada define base rítmica no cabeçalho **e** acento nos cards, e os dois precisam de tempos separados — juntá-los num trigger só faria as fotos preencherem antes dos cards subirem. A regra existe para evitar over-animation; aqui o julgamento de quantidade já foi feito na spec, com o Pedro, comparando opções no navegador. Registrado como decisão, não como omissão.

**Se o `Wrap` não encaminhar `ref`** (Task 2, passo 3): o plano B — `<div ref={headerRef}>` interna — está descrito no próprio passo. Não alterar `container.tsx` para resolver isso; o componente é usado em toda a página e a mudança teria alcance maior que a tarefa.

**Calibragem:** se qualquer animação parecer lenta, rápida ou excessiva na página real, o ajuste é em `src/lib/motion.ts`. Foi para isso que o arquivo existe. A exceção é a Hero, cujas quatro posições de timeline estão em `use-hero-motion.ts` — também deliberadamente legíveis como quatro números.

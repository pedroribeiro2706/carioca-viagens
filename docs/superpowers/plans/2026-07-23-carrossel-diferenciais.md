# Carrossel de Diferenciais — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o placeholder de gradiente do painel de mídia da seção Diferenciais por um carrossel de 5 imagens estilo Instagram (setas, bolinhas, autoavanço 5 s).

**Architecture:** Carrossel Embla via componente Carousel do shadcn/ui, encapsulado em `diferenciais-carousel.tsx`, montado dentro do painel de mídia existente de `diferenciais.tsx` (que não muda de tamanho/posição). Dados dos slides em `content.ts`; imagens WebP otimizadas importadas estaticamente. 4 imagens geradas via Higgsfield + 1 foto real preparada pelo Pedro.

**Tech Stack:** React 19 + TypeScript + Vite + Tailwind v4 · shadcn/ui (Embla) · Higgsfield (geração) · Pillow (otimização WebP) · Playwright (verificação) · oxlint.

**Spec:** `docs/superpowers/specs/2026-07-23-carrossel-diferenciais-design.md` — ler antes de executar.

## Global Constraints

- Copy visível em pt-BR; microlegendas EXATAS do spec: `— FLAVINHA SALLES · GESTORA`, `— 01 · AGILIDADE NO ATENDIMENTO`, `— 02 · EFICIÊNCIA NOS PROCESSOS DE VIAGENS`, `— 03 · MELHORES PREÇOS E CONDIÇÕES DE PAGAMENTO`, `— 04 · SOLUÇÕES OPERACIONAIS`.
- Nenhuma dependência nova além das que `npx shadcn add carousel` instalar (embla-carousel-react).
- O painel de mídia mantém dimensões/posição atuais (`h-[260px]` mobile, esticado no tablet+); chip `— CORPORATIVO · LAZER · RECEPTIVO` e `CornerGuides` permanecem sobrepostos.
- Masters de mídia ficam em `design/assets/diferenciais/` (gitignored); no repo entram só as WebP otimizadas em `src/assets/diferenciais/` (~100–200 KB cada).
- Toda geração Higgsfield: carregar skill `higgsfield-generate` + ler `docs/higgsfield-playbook.md` ANTES; registrar proveniência no `design/assets/MANIFEST.md`.
- `prefers-reduced-motion: reduce` → sem autoplay e troca instantânea.
- Projeto não tem test runner (sem vitest/jest) — verificação é `npm run lint` + `npm run build` + sondas Playwright contra o preview (padrão do projeto).
- Commit por task; push (= deploy de produção) SÓ na Task 10, com autorização do Pedro.
- Não implementar a sincronização slide↔lista (backlog, etapa GSAP).

---

### Task 1: Preparação da geração (playbook + modelo + custo)

**Files:**
- Read: `docs/higgsfield-playbook.md`
- Read: `design/assets/MANIFEST.md` (formato das entradas de proveniência)

**Interfaces:**
- Produces: decisão registrada (modelo, aspect ratio, custo estimado por imagem, CLI vs MCP) que as Tasks 2–5 usam.

- [ ] **Step 1: Carregar a skill `higgsfield-generate`** (tool Skill). Sem ela, nenhum comando de geração.
- [ ] **Step 2: Ler `docs/higgsfield-playbook.md` inteiro.** Extrair: modelo recomendado para fotografia realista de pessoas/cenas, custo por render verificado, limites de aspect ratio, e o processo CLI validado.
- [ ] **Step 3: Ler as 3 primeiras entradas de `design/assets/MANIFEST.md`** para copiar o formato de proveniência exato usado no projeto.
- [ ] **Step 4: PARADA — reportar ao Pedro** modelo escolhido + custo estimado total (4 imagens + margem para 1–2 regerações) e aguardar OK antes de gastar créditos.

---

### Task 2: Gerar imagem 01 — Agilidade no atendimento

**Files:**
- Create: `design/assets/diferenciais/agilidade-master.png` (ou extensão que a CLI devolver)
- Modify: `design/assets/MANIFEST.md` (nova entrada)

**Interfaces:**
- Consumes: modelo/params da Task 1.
- Produces: master aprovado pelo Pedro que a Task 6 otimiza.

- [ ] **Step 1: Gerar em ~4:3 (mínimo 1400 px de largura)** com prompt baseado neste rascunho (ajustar sintaxe ao modelo escolhido na Task 1):

```text
Close-up of a traveler's hand holding a smartphone with a travel confirmation
conversation on screen, phone seen at an oblique angle, blurred airport
terminal in the background, natural daylight, candid documentary photography,
corporate travel context, shallow depth of field, subtle blue and green
grading, photorealistic, no visible faces, no readable UI text close-up
```

- [ ] **Step 2: Salvar o master** em `design/assets/diferenciais/agilidade-master.png`.
- [ ] **Step 3: Registrar no MANIFEST.md** (formato copiado na Task 1: modelo, params, custo, URL de origem).
- [ ] **Step 4: PARADA — mostrar ao Pedro (SendUserFile) e aguardar aprovação.** Se reprovada: ajustar prompt, regerar (máx. 2 tentativas antes de rediscutir o conceito), atualizar MANIFEST.
- [ ] **Step 5: Commit** (`git add design/assets/MANIFEST.md && git commit -m "docs: registra geração da imagem 01 do carrossel (agilidade)"`). O master é gitignored — só o MANIFEST entra.

---

### Task 3: Gerar imagem 02 — Eficiência nos processos

**Files:**
- Create: `design/assets/diferenciais/eficiencia-master.png`
- Modify: `design/assets/MANIFEST.md`

**Interfaces:**
- Consumes: modelo/params da Task 1.
- Produces: master aprovado que a Task 6 otimiza.

- [ ] **Step 1: Gerar em ~4:3 (mín. 1400 px)** com rascunho **(v2, 2026-07-23 — cena do e-gate;
  a cena original do corredor foi reprovada, ver spec)**, modelo `nano_banana_pro`:

```text
Side close-up at an airport e-gate: a traveler's hand rests a smartphone
horizontally on the glass scanner of the boarding gate, phone screen facing
down toward the reader, a green validation light glowing softly around the
scanner surface, automatic gate doors and corridor softly blurred in the
background, natural daylight with subtle blue and green color grading, candid
documentary photography, shallow depth of field, calm professional corporate
travel mood, photorealistic, composition tightly framed on hand, phone and
scanner
```

- [ ] **Step 2: Salvar** em `design/assets/diferenciais/eficiencia-master.png`.
- [ ] **Step 3: Registrar no MANIFEST.md.**
- [ ] **Step 4: PARADA — aprovação do Pedro** (mesma regra da Task 2).
- [ ] **Step 5: Commit** (`git commit -m "docs: registra geração da imagem 02 do carrossel (eficiência)"`).

---

### Task 4: Gerar imagem 03 — Melhores preços e condições

**Files:**
- Create: `design/assets/diferenciais/precos-master.png`
- Modify: `design/assets/MANIFEST.md`

**Interfaces:**
- Consumes: modelo/params da Task 1.
- Produces: master aprovado que a Task 6 otimiza.

- [ ] **Step 1: Gerar em ~4:3 (mín. 1400 px)** com rascunho (atenção anti-clichê — sem moedas, calculadora, aperto de mão):

```text
Elegant close-up over a travel agency desk: an agent's hands presenting fare
options on a tablet to a client across the table, tablet screen at an angle
and out of focus, printed itinerary and corporate card on the desk, tight
crop with no faces, warm natural light, professional negotiation mood,
photorealistic, no readable screen content
```

- [ ] **Step 2: Salvar** em `design/assets/diferenciais/precos-master.png`.
- [ ] **Step 3: Registrar no MANIFEST.md.**
- [ ] **Step 4: PARADA — aprovação do Pedro.**
- [ ] **Step 5: Commit** (`git commit -m "docs: registra geração da imagem 03 do carrossel (preços)"`).

---

### Task 5: Gerar imagem 04 — Soluções operacionais (SEM tela visível)

**Files:**
- Create: `design/assets/diferenciais/operacional-master.png`
- Modify: `design/assets/MANIFEST.md`

**Interfaces:**
- Consumes: modelo/params da Task 1.
- Produces: master aprovado que a Task 6 otimiza.

- [ ] **Step 1: Gerar em ~4:3 (mín. 1400 px)** com rascunho (regra do spec: nenhuma tela visível nesta cena):

```text
Behind-the-scenes of a travel agency operation: laptop seen from behind in
profile with NO visible screen, headset in the sharp foreground, hands
working with documents, agent blurred in the background, shallow depth of
field, warm professional office light, photorealistic
```

- [ ] **Step 2: Salvar** em `design/assets/diferenciais/operacional-master.png`.
- [ ] **Step 3: Registrar no MANIFEST.md.**
- [ ] **Step 4: PARADA — aprovação do Pedro.** Aqui também avaliar com ele o CONJUNTO das 4 (repetição de telas — critério do spec).
- [ ] **Step 5: Commit** (`git commit -m "docs: registra geração da imagem 04 do carrossel (operacional)"`).

---

### Task 6: Otimizar os 5 assets para WebP

**Files:**
- Create: `src/assets/diferenciais/flavinha.webp`, `agilidade.webp`, `eficiencia.webp`, `precos.webp`, `operacional.webp`
- Source: `design/assets/diferenciais/flavinha.png` + 4 masters das Tasks 2–5

**Interfaces:**
- Produces: os 5 arquivos WebP que a Task 8 importa estaticamente.

- [ ] **Step 1: Criar a pasta e converter** (Python/Pillow, já usado no projeto):

```python
# scratchpad/otimiza_diferenciais.py
from pathlib import Path
from PIL import Image

SRC = Path(r"G:\Pedro\Dev\Clientes\carioca-viagens\design\assets\diferenciais")
DST = Path(r"G:\Pedro\Dev\Clientes\carioca-viagens\src\assets\diferenciais")
DST.mkdir(parents=True, exist_ok=True)

FILES = {
    "flavinha.png": "flavinha.webp",
    "agilidade-master.png": "agilidade.webp",
    "eficiencia-master.png": "eficiencia.webp",
    "precos-master.png": "precos.webp",
    "operacional-master.png": "operacional.webp",
}

for src_name, dst_name in FILES.items():
    im = Image.open(SRC / src_name).convert("RGB")
    im.thumbnail((1400, 1400))  # largura máx. 1400px (2x do painel ~700px)
    im.save(DST / dst_name, "WEBP", quality=82)
    print(dst_name, (DST / dst_name).stat().st_size // 1024, "KB")
```

Run: `python otimiza_diferenciais.py`
Expected: 5 linhas, cada uma entre ~60 e ~200 KB. Acima de 250 KB → reduzir `quality` para 75 e repetir.

- [ ] **Step 2: Conferir visualmente** os 5 WebP (Read em cada um) — sem artefatos de compressão grosseiros.
- [ ] **Step 3: Commit** (`git add src/assets/diferenciais && git commit -m "feat: adiciona os assets otimizados do carrossel de diferenciais"`).

---

### Task 7: Instalar o Carousel do shadcn (Embla)

**Files:**
- Create: `src/components/ui/carousel.tsx` (gerado pelo CLI)
- Modify: `package.json`, `package-lock.json` (embla-carousel-react)

**Interfaces:**
- Produces: componentes `Carousel`, `CarouselContent`, `CarouselItem` e o tipo `CarouselApi` (export de `@/components/ui/carousel`) que a Task 9 consome.

- [ ] **Step 1: Instalar**: `npx shadcn@latest add carousel`
Expected: cria `src/components/ui/carousel.tsx` e adiciona `embla-carousel-react` ao package.json.
- [ ] **Step 2: NÃO estilizar nada ainda** — o CLI traz a estética default; quem define aparência é a Task 9 (regra do projeto: shadcn é infra, estética é do Design System).
- [ ] **Step 3: Verificar**: `npm run lint && npm run build` — ambos limpos.
- [ ] **Step 4: Commit** (`git add src/components/ui/carousel.tsx package.json package-lock.json && git commit -m "chore: adiciona o Carousel (Embla) do shadcn como infraestrutura"`).

---

### Task 8: Dados dos slides em content.ts

**Files:**
- Modify: `src/lib/content.ts` (bloco `diferenciais`, ~linhas 44–60)

**Interfaces:**
- Produces: `content.diferenciais.slides: { file: string; legend: string; alt: string }[]` e remove `mediaNote` (o array de 2 strings do placeholder). `mediaChip` PERMANECE. A Task 9 consome `slides`; a Task 9 também remove o uso de `mediaNote` no componente.

- [ ] **Step 1: Adicionar `slides` e remover `mediaNote`** dentro de `diferenciais` em `content.ts`:

```ts
    slides: [
      {
        file: "flavinha",
        legend: "— FLAVINHA SALLES · GESTORA",
        alt: "Flavinha Salles, gestora da Carioca Viagens",
      },
      {
        file: "agilidade",
        legend: "— 01 · AGILIDADE NO ATENDIMENTO",
        alt: "Mão de viajante segurando smartphone com confirmação de viagem em saguão de aeroporto",
      },
      {
        file: "eficiencia",
        legend: "— 02 · EFICIÊNCIA NOS PROCESSOS DE VIAGENS",
        alt: "Mão aproximando o celular do leitor do portão de embarque com a luz verde de validação acesa",
      },
      {
        file: "precos",
        legend: "— 03 · MELHORES PREÇOS E CONDIÇÕES DE PAGAMENTO",
        alt: "Mãos de agente apresentando opções de tarifas num tablet sobre a mesa da agência",
      },
      {
        file: "operacional",
        legend: "— 04 · SOLUÇÕES OPERACIONAIS",
        alt: "Bastidor da operação da agência com headset em primeiro plano e equipe ao fundo",
      },
    ],
```

- [ ] **Step 2: Verificar**: `npm run build`
Expected: FALHA de tipo em `diferenciais.tsx` (uso de `mediaNote` removido) — esperado; a Task 9 corrige. Se preferir manter o build verde entre tasks, adiar a remoção de `mediaNote` para o Step 2 da Task 9 — nesse caso remover lá e commitar lá.
- [ ] **Step 3: Commit junto com a Task 9** (mesmo commit, pois o build só fica verde com as duas juntas).

---

### Task 9: Componente do carrossel + integração no painel

**Files:**
- Create: `src/components/sections/diferenciais-carousel.tsx`
- Modify: `src/components/sections/diferenciais.tsx` (substitui gradiente + mediaNote pelo carrossel; mantém chip e CornerGuides)

**Interfaces:**
- Consumes: `Carousel`/`CarouselContent`/`CarouselItem`/`CarouselApi` (Task 7), `content.diferenciais.slides` (Task 8), WebPs (Task 6).
- Produces: `<DiferenciaisCarousel />` sem props, exportado nomeado, renderizado dentro do painel.

- [ ] **Step 1: Criar `diferenciais-carousel.tsx`:**

```tsx
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import agilidadeImg from "@/assets/diferenciais/agilidade.webp"
import eficienciaImg from "@/assets/diferenciais/eficiencia.webp"
import flavinhaImg from "@/assets/diferenciais/flavinha.webp"
import operacionalImg from "@/assets/diferenciais/operacional.webp"
import precosImg from "@/assets/diferenciais/precos.webp"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { content } from "@/lib/content"

const SLIDE_SRC: Record<string, string> = {
  flavinha: flavinhaImg,
  agilidade: agilidadeImg,
  eficiencia: eficienciaImg,
  precos: precosImg,
  operacional: operacionalImg,
}

const AUTOPLAY_MS = 5000

/**
 * Autoplay de 5s com pausa em hover e reinício do contador em interação
 * manual. Sob prefers-reduced-motion não há autoplay e a troca é instantânea
 * (duration 0 no Embla).
 */
function DiferenciaisCarousel() {
  const { slides } = content.diferenciais
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hoveringRef = useRef(false)
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
  }, [])

  const startTimer = useCallback(() => {
    stopTimer()
    if (reducedMotion || hoveringRef.current || !api) return
    timerRef.current = setInterval(() => api.scrollNext(), AUTOPLAY_MS)
  }, [api, reducedMotion, stopTimer])

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    api.on("select", onSelect)
    startTimer()
    return () => {
      api.off("select", onSelect)
      stopTimer()
    }
  }, [api, startTimer, stopTimer])

  // Interação manual reinicia o contador (não desliga o autoplay)
  const goTo = (index: number) => {
    api?.scrollTo(index)
    startTimer()
  }
  const goPrev = () => {
    api?.scrollPrev()
    startTimer()
  }
  const goNext = () => {
    api?.scrollNext()
    startTimer()
  }

  return (
    <div
      className="absolute inset-0"
      onPointerEnter={() => {
        hoveringRef.current = true
        stopTimer()
      }}
      onPointerLeave={() => {
        hoveringRef.current = false
        startTimer()
      }}
    >
      <Carousel
        setApi={setApi}
        opts={{ loop: true, duration: reducedMotion ? 0 : 25 }}
        aria-roledescription="carrossel"
        className="h-full"
      >
        <CarouselContent className="ml-0 h-full">
          {slides.map((slide, i) => (
            <CarouselItem
              key={slide.file}
              className="h-full pl-0"
              aria-label={`${i + 1} de ${slides.length}`}
            >
              <img
                src={SLIDE_SRC[slide.file]}
                alt={slide.alt}
                className="size-full object-cover object-center"
                draggable={false}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Setas — estilo wayfinding, como o chip */}
      <button
        type="button"
        aria-label="Slide anterior"
        onClick={goPrev}
        className="absolute top-1/2 left-3 -translate-y-1/2 rounded-[3px] border border-off-white/55 bg-ink/32 p-1.5 text-off-white opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Próximo slide"
        onClick={goNext}
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-[3px] border border-off-white/55 bg-ink/32 p-1.5 text-off-white opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100"
      >
        <ChevronRight className="size-4" />
      </button>

      {/* Microlegenda do slide ativo — canto inferior esquerdo */}
      <span className="absolute bottom-5 left-5 font-mono text-[0.66rem] tracking-[0.08em] text-off-white/85 uppercase [text-shadow:0_1px_8px_rgb(12_33_50/0.55)]">
        {slides[current].legend}
      </span>

      {/* Bolinhas — canto inferior direito */}
      <div className="absolute right-5 bottom-5 flex gap-1.5">
        {slides.map((slide, i) => (
          <button
            key={slide.file}
            type="button"
            aria-label={`Ir para o slide ${i + 1} de ${slides.length}`}
            aria-current={i === current}
            onClick={() => goTo(i)}
            className={`size-1.5 rounded-full transition-colors ${
              i === current ? "bg-off-white" : "bg-off-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export { DiferenciaisCarousel }
```

- [ ] **Step 2: Integrar em `diferenciais.tsx`** — remover `mediaBackground`, o `CSSProperties` import, o `style` e o `<span>` da mediaNote; renderizar o carrossel ANTES dos overlays (chip e CornerGuides ficam por cima):

```tsx
import { Clock, CreditCard, type LucideIcon, Plane, Settings } from "lucide-react"

import { WrapWide } from "@/components/layout/container"
import { Chip } from "@/components/ui/chip"
import { CornerGuides } from "@/components/ui/corner-guides"
import { Eyebrow } from "@/components/ui/eyebrow"
import { DiferenciaisCarousel } from "@/components/sections/diferenciais-carousel"
import { content } from "@/lib/content"
```

O painel (div direita) vira:

```tsx
        <div className="relative h-[260px] overflow-hidden rounded-[3px] tablet:h-full tablet:min-h-[340px]">
          <DiferenciaisCarousel />
          <CornerGuides />
          <Chip
            variant="on-dark"
            className="pointer-events-none absolute top-5 right-5 border-off-white/55 bg-ink/32 text-off-white"
          >
            {diferenciais.mediaChip}
          </Chip>
        </div>
```

(`pointer-events-none` no chip para não bloquear o swipe embaixo dele.)

- [ ] **Step 3: Verificar**: `npm run lint && npm run build` — limpos.
- [ ] **Step 4: Conferir no dev server** (`npm run dev`, abrir a seção): 5 slides trocando sozinhos, setas, bolinhas, legenda mudando.
- [ ] **Step 5: Commit** (inclui a Task 8): `git add src/lib/content.ts src/components/sections/diferenciais-carousel.tsx src/components/sections/diferenciais.tsx && git commit -m "feat: implementa o carrossel de diferenciais com autoplay e controles wayfinding"`.

---

### Task 10: Verificação Playwright + publicação

**Files:**
- Create (scratchpad, fora do repo): `verifica_carrossel.py`

**Interfaces:**
- Consumes: build de produção servido via `npm run preview` (porta 4173).

- [ ] **Step 1: Subir o preview**: `npm run build && npm run preview` (background).
- [ ] **Step 2: Rodar a sonda:**

```python
# scratchpad/verifica_carrossel.py
from playwright.sync_api import sync_playwright

URL = "http://localhost:4173"

def painel(page):
    # Âncora estável: o chip fixo está sempre presente, em qualquer slide
    return page.locator(
        "div.relative", has=page.get_by_text("CORPORATIVO · LAZER · RECEPTIVO")
    ).first

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome")

    # 1) Autoplay avança em ~5s
    page = browser.new_page(viewport={"width": 1536, "height": 900})
    page.goto(URL, wait_until="networkidle")
    painel(page).scroll_into_view_if_needed()
    legenda_inicial = painel(page).locator("span.font-mono").inner_text()
    page.wait_for_timeout(6500)
    legenda_apos = painel(page).locator("span.font-mono").inner_text()
    assert legenda_apos != legenda_inicial, "autoplay não avançou"

    # 2) Hover pausa
    painel(page).hover()
    antes = painel(page).locator("span.font-mono").inner_text()
    page.wait_for_timeout(6500)
    depois = painel(page).locator("span.font-mono").inner_text()
    assert antes == depois, "autoplay não pausou em hover"

    # 3) Seta avança
    page.get_by_role("button", name="Próximo slide").click()
    page.wait_for_timeout(700)
    assert painel(page).locator("span.font-mono").inner_text() != depois, "seta não avançou"
    page.close()

    # 4) prefers-reduced-motion: SEM autoplay
    ctx = browser.new_context(reduced_motion="reduce",
                              viewport={"width": 1536, "height": 900})
    page2 = ctx.new_page()
    page2.goto(URL, wait_until="networkidle")
    painel(page2).scroll_into_view_if_needed()
    l1 = painel(page2).locator("span.font-mono").inner_text()
    page2.wait_for_timeout(6500)
    l2 = painel(page2).locator("span.font-mono").inner_text()
    assert l1 == l2, "autoplay ativo sob reduced-motion"

    browser.close()

print("TODAS AS SONDAS PASSARAM")
```

Run: `python verifica_carrossel.py`
Expected: `TODAS AS SONDAS PASSARAM`

- [ ] **Step 3: Screenshot da seção** (mesma receita da sessão anterior) e enviar ao Pedro (SendUserFile).
- [ ] **Step 4: Testes manuais do Pedro no preview**: swipe no mobile/touch, teclado ← →, sensação do timing.
- [ ] **Step 5: PARADA — autorização do Pedro para publicar.**
- [ ] **Step 6: Push** (`git push origin main`) → deploy automático; conferir `npx vercel ls carioca-viagens` até `● Ready`; abrir produção e confirmar o carrossel.
- [ ] **Step 7: Atualizar HANDOFF.md** (§22: carrossel publicado, o que ficou pendente se algo) e commitar.

---

## Notas para o executor

- Tasks 2–5 são interativas (aprovação do Pedro por imagem) — não são paralelizáveis nem delegáveis a subagente sem canal com o Pedro.
- O `carousel.tsx` do shadcn envolve o conteúdo num div `overflow-hidden` sem
  altura própria; se os slides não preencherem o painel na Task 9, adicionar
  `h-full` a esse wrapper (o CLI aceita edição local — é código do projeto).
- Se `npx shadcn@latest add carousel` alterar arquivos além dos listados na Task 7, revisar o diff antes de commitar.
- O overlay do painel usa tokens existentes (`off-white`, `ink`, `border-hair`, `font-mono`) — não introduzir cores novas.
- `flavinha.png` (646×464) é menor que os masters gerados; a conversão da Task 6 não a amplia (thumbnail só reduz) — ela fica no tamanho original, suficiente para o painel em 1x; aceitável para retina por ser foto suave (validar visualmente no Step 2 da Task 6).

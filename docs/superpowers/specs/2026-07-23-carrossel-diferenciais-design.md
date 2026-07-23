# Design — Carrossel da seção Diferenciais

**Data:** 2026-07-23 · **Status:** aprovado no brainstorming, aguardando plano de implementação
**Origem:** brainstorming com Pedro (sessão 2026-07-22/23), ver HANDOFF.md §22.

## Objetivo

Substituir o placeholder de gradiente do painel de mídia da seção Diferenciais
("O que nossos clientes buscam?") por um carrossel de imagens estilo Instagram.
Sem vídeo: a Hero (vídeo) + band (animação) + vetores pin/avião já dão o
movimento da página — outro vídeo seria excessivo (decisão do Pedro).

## Decisões travadas

- **5 slides**: foto real da Flavinha como capa humana + 1 slide por diferencial,
  espelhando a ordem da lista à esquerda.
- A amplitude **Corporativo · Lazer · Receptivo** não gasta slide: o chip fixo
  existente permanece sobreposto ao carrossel inteiro.
- **Microlegenda mono** (IBM Plex Mono, padrão wayfinding) por slide, no canto
  inferior esquerdo do painel. Flavinha sem número (capa); diferenciais 01–04.
- **Fotografia realista** nas 4 imagens geradas, mesma família visual da Hero e
  dos cards de Atendimento: luz natural, grading sutil nos azuis/verdes da marca.
- **Gestão de telas nas cenas** (variedade + anti-AI-slop): telas legíveis geradas
  por IA são o maior risco de "cara de IA". Agilidade (01) tem tela protagonista
  (celular, ângulo oblíquo); Eficiência (02) tem celular de face para o leitor do
  e-gate — **tela oculta**, o gesto é o protagonista (revisão 2026-07-23: a cena
  original do corredor de vidro foi reprovada pelo Pedro — grip mão-bilhete falhou
  em 2 modelos — e o conceito colidia com o slide 01: mesmo objeto, POV e ambiente);
  Preços e condições (03) tem tela coadjuvante
  (tablet, fora de foco); Soluções operacionais (04) fica **sem tela visível**.
  Se após gerar o conjunto parecer repetitivo em telas, regenerar o que precisar
  (avaliação com o Pedro).

## Os 5 slides

| # | Slide | Imagem | Microlegenda |
|---|---|---|---|
| 1 | Flavinha (capa) | `flavinha.png` preparada pelo Pedro no Photoshop (crop horizontal ~4:3 com fundo estendido, já na proporção do painel). Foto real, nada é gerado | `— FLAVINHA SALLES · GESTORA` |
| 2 | Agilidade no atendimento | Close-up: mão de viajante segurando smartphone com conversa de confirmação da viagem, saguão de aeroporto desfocado ao fundo, luz natural. Resposta chegando na hora, em movimento. Sem rosto — quem dá rosto ao atendimento é a Flavinha. Tela em ângulo oblíquo, sem close frontal de UI | `— 01 · AGILIDADE NO ATENDIMENTO` |
| 3 | Eficiência nos processos | **(v2, 2026-07-23)** O momento em que o processo funciona: close lateral na altura do leitor do e-gate, mão pousando o celular na horizontal com a tela voltada para o vidro, luz verde de validação acendendo, portas do e-gate e corredor desfocados ao fundo, tons azuis, sem rosto. A UI não aparece — o protagonista é o gesto e a luz verde | `— 02 · EFICIÊNCIA NOS PROCESSOS DE VIAGENS` |
| 4 | Melhores preços e condições | Close elegante sobre a mesa da agência: mãos de agente apresentando opções de tarifas num tablet ao cliente, corte fechado sem rostos, papel e cartão corporativo na cena. Negociação sem clichê (proibido: moedas, calculadora, aperto de mão). Tela do tablet em ângulo e fora de foco | `— 03 · MELHORES PREÇOS E CONDIÇÕES DE PAGAMENTO` |
| 5 | Soluções operacionais | O bastidor da operação, **sem tela visível**: laptop de perfil/de costas, headset em primeiro plano, mãos e contexto de trabalho, agente desfocado ao fundo. Ecoa os chips reais da seção Operacional (self booking, relatórios, centro de custo) | `— 04 · SOLUÇÕES OPERACIONAIS` |

Alt text por slide (acessibilidade, pt-BR) — descritivo da cena; o da Flavinha:
"Flavinha Salles, gestora da Carioca Viagens". Os demais derivados das descrições
acima na implementação.

## Componente

**Base técnica: Carousel do shadcn/ui (Embla).** Swipe/drag com física, loop e
edge cases resolvidos; o shadcn é a infraestrutura técnica oficial do projeto
(estética sempre do Design System Carioca). Alternativa "feito à mão" descartada:
swipe decente + thresholds + loop é trabalho não trivial propenso a bug.

**Comportamento:**

- Deslizamento horizontal, loop infinito, autoavanço a cada 5 s (timer próprio).
- Hover pausa o autoplay enquanto durar. Interação manual (seta, bolinha, swipe)
  reinicia o contador de 5 s do zero — o autoplay continua depois; nenhuma
  interação o desliga em definitivo.
- `prefers-reduced-motion`: autoplay desligado, troca instantânea sem animação.
- Teclado: ← / → com foco no painel. Acessibilidade de carrossel:
  `aria-roledescription="carrossel"`, slides rotulados "X de 5", bolinhas como
  botões com `aria-label`.

**Controles (posições fixadas; refinamento visual na fase `/frontend-design`):**

- Microlegenda mono: canto inferior esquerdo (onde hoje está a nota de placeholder).
- Bolinhas de posição: canto inferior direito.
- Setas finas nas laterais, estilo wayfinding (chevron com fundo `ink/32`, como o
  chip); sempre visíveis no touch, reveladas em hover no desktop.
- Chip "— CORPORATIVO · LAZER · RECEPTIVO" e corner guides permanecem fixos por
  cima de tudo.

**Integração:** o carrossel vive dentro do painel de mídia existente em
`src/components/sections/diferenciais.tsx` — o painel não muda de tamanho nem de
posição (`h-[260px]` mobile, esticado na coluna no tablet+). Imagens em
`object-cover` centrado.

**Dados:** `content.ts` ganha `diferenciais.slides` (id, microlegenda, alt);
imagens importadas estaticamente no componente (padrão de `clientes.tsx`).

## Pipeline de assets

- Antes de gerar: carregar a skill `higgsfield-generate` + ler
  `docs/higgsfield-playbook.md` (modelo por situação, custos verificados; CLI vs
  MCP conforme o playbook). Prompts finais são redigidos na hora da geração,
  seguindo os conceitos deste doc.
- Gerar as 4 imagens em ~4:3, resolução 2x (~1400 px de largura) para retina.
- Masters em `design/assets/diferenciais/` (fora do git) com proveniência no
  `design/assets/MANIFEST.md` (modelo, parâmetros, custo, URL).
- Otimizadas em WebP versionadas em `src/assets/diferenciais/` (alvo ~100–200 KB
  cada), incluindo conversão da `flavinha.png`.

## Verificação (antes de publicar)

1. `npm run lint` + `npm run build` limpos.
2. Preview local + screenshot Playwright (receita da sessão 2026-07-22).
3. Teste manual no preview: autoplay 5 s, pausa em hover, setas, bolinhas, swipe,
   loop, teclado.
4. `prefers-reduced-motion` emulado via Playwright: autoplay desligado.
5. Commit + push (= deploy de produção) só com autorização do Pedro.

## Ordem de execução

1. Gerar as 4 imagens → **aprovação do Pedro imagem a imagem**.
2. Implementar o componente com as 5 imagens aprovadas.
3. Verificação completa → revisão do Pedro no preview → publicar.

## Fora de escopo / backlog

- **Sincronizar slide ativo ↔ item da lista** (item da lista acende quando o
  slide correspondente está ativo) — candidata à etapa GSAP. Registrada no
  backlog do HANDOFF.md.
- Animações GSAP de títulos e imagens dos cards — etapa seguinte ao carrossel,
  não faz parte dele.

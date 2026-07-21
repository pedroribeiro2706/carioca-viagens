# Diagnóstico e plano — etapa Higgsfield

## Parte A — Diagnóstico por área de mídia

### A.1 — Hero

┌──────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────┐
│         Aspecto          │                                       Diagnóstico                                       │
├──────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│                          │ Abertura institucional full-bleed. É o primeiro sinal de "viagem corporativa com        │
│ Função visual/narrativa  │ atendimento humano". Hoje é gradiente diagonal deep-blue → carioca-blue → carioca-green │
│                          │  (placeholder marcado). Ocupa min-h-screen (100vh).                                     │
├──────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ Tipo de mídia            │ Ambos, em fases: still de fallback primeiro (obrigatório), vídeo loop 6–10s depois      │
│                          │ (§7). O vídeo é o alvo ideal, mas nunca sem poster/fallback estático.                   │
├──────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ Proporção/enquadramento  │ Full-bleed 100vh. Desktop ≈ 1440×900+ (landscape amplo); mobile ≈ 390×844 (vertical).   │
│                          │ Isso é uma inversão de orientação — não é o mesmo enquadramento recortado.              │
├──────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ Ponto focal provável     │ Terço superior-direito / centro-direito. O texto vive embaixo à esquerda (items-end,    │
│                          │ pb-72px), então o sujeito visual deve gravitar para longe dali.                         │
├──────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│                          │ (1) faixa inferior-esquerda: H1 (max-w-920), subtítulo (max-w-480) e 2 CTAs; (2) topo   │
│ Zonas que precisam ficar │ inteiro: utility strip + logo (200px, esquerda) + CTA outline (direita); (3) chip locus │
│  limpas                  │  top-right; (4) nota placeholder bottom-right. Ou seja: topo e base precisam de área    │
│                          │ calma; o miolo-direito é a zona livre.                                                  │
├──────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│                          │ Desktop landscape com texto ancorado embaixo-esquerda. Mobile continua 100vh mas        │
│ Desktop × mobile         │ vertical, utility strip quebra em coluna (flex-wrap), texto ainda embaixo. O foco tem   │
│                          │ de sobreviver a crop central vertical.                                                  │
├──────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│                          │ Contraste: alto — texto off-white sobre a base inferior-esquerda exige                  │
│ Riscos                   │ overlay/gradiente escuro preservado (§7). Crop: alto — landscape↔vertical entre desktop │
│                          │  e mobile. Peso/perf: vídeo 100vh é o maior risco de performance do site (poster        │
│                          │ obrigatório, preload controlado, compressão, autoplay muted loop playsinline).          │
├──────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│                          │ Versões específicas: 1 desktop landscape + 1 mobile vertical (mesmo conceito,           │
│ 1 asset ou versões?      │ enquadramento próprio). Um único asset responsivo não cobre a inversão de orientação    │
│                          │ sem perder o foco.                                                                      │
└──────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────┘

A.2 — Diferenciais (painel de mídia lateral)

┌─────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────┐
│         Aspecto         │                                        Diagnóstico                                        │
├─────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│                         │ Coluna direita de um grid 2-col; contrapeso visual da lista de 4 diferenciais à esquerda. │
│ Função visual/narrativa │  Narrativa: "atendimento em movimento". Hoje gradiente azul/verde + grade + cantos-guia + │
│                         │  chip.                                                                                    │
├─────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│ Tipo de mídia           │ Imagem como base; vídeo curto/loop sutil é opcional e de menor prioridade (o painel é     │
│                         │ secundário à lista).                                                                      │
├─────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│                         │ Desktop: coluna ≈ 648px de largura, altura h-full acompanhando a lista → ≈ 3:2 landscape  │
│ Proporção/enquadramento │ (piso min-h-340px). Mobile: full-width × 260px fixos (faixa landscape larga, até ≈2.5:1). │
│                         │  rounded-[3px], overflow-hidden.                                                          │
├─────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│ Ponto focal provável    │ Central, levemente à esquerda (o painel fica à direita da lista; o olhar entra pela lista │
│                         │  → foco puxa para o centro do painel).                                                    │
├─────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│ Zonas limpas            │ Chip top-right ("Corporativo · Lazer · Receptivo") e nota bottom-left. Se o chip          │
│                         │ permanecer em produção, manter esses dois cantos legíveis.                                │
├─────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│ Desktop × mobile        │ Desktop retrato-a-quadrado alto; mobile faixa baixa e larga. Novamente muda a orientação  │
│                         │ do recorte.                                                                               │
├─────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│ Riscos                  │ Contraste: médio — só o chip/nota exigem legibilidade. Crop: médio-alto (3:2 alto → faixa │
│                         │  260px). Peso: baixo-médio.                                                               │
├─────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│ 1 asset ou versões?     │ Preferível 2 crops (desktop ~3:2 vs. mobile faixa 260px). Um asset com foco central e     │
│                         │ margem tolerante pode servir, mas com risco de decapitar sujeito na faixa mobile.         │
└─────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────┘

A.3 — Cards de Atendimento (3 zonas de mídia)

┌─────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────┐
│         Aspecto         │                                        Diagnóstico                                        │
├─────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│                         │ Faixa inferior de cada card quadrado (row-start-5, 40fr de 100fr → 40% inferior). Reforça │
│ Função visual/narrativa │  o tema do card (Assistência 24h / Reservas online / Canais de distribuição). Hoje: só    │
│                         │ cantos-guia sobre overlay translúcido.                                                    │
├─────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│ Tipo de mídia           │ Imagem (still). Vídeo aqui é desaconselhado: 3 loops simultâneos numa seção com o avião   │
│                         │ animado (GSAP) = custo de performance e ruído visual.                                     │
├─────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│ Proporção/enquadramento │ Faixa larga e baixa: desktop card ≈ 349×349 → zona ≈ 349×140px (~2.5:1); mobile card até  │
│                         │ ≈600px → zona ≈600×240. Pequena, sobretudo no desktop.                                    │
├─────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│ Ponto focal provável    │ Um único sujeito central, recorte apertado (headset/atendente; mãos+device; aperto de     │
│                         │ mão/globo-terminal). Detalhe fino não sobrevive a 140px de altura.                        │
├─────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│                         │ A zona é 100% imagem (o texto vive nos 60% superiores, no painel colorido). Cuidado é com │
│ Zonas limpas            │  a borda superior: a imagem encosta no bloco de cor sólida (azul/verde/near-black) —      │
│                         │ precisa casar tom.                                                                        │
├─────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│ Desktop × mobile        │ Mesma proporção (~2.5:1) em ambos, só muda o tamanho em pixel. Empilha 1-col no mobile,   │
│                         │ 3-col no desktop.                                                                         │
├─────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│                         │ Contraste: a imagem faz fronteira com o fundo sólido do card — duotone/tonalização é      │
│ Riscos                  │ quase obrigatória para não brigar. Crop: alto — faixa minúscula exige sujeito único e     │
│                         │ limpo. Peso: 3 imagens; devem ser leves (thumb-scale, lazy-load). Slop: risco de "3 stock │
│                         │  photos" — precisam parecer um conjunto (mesmo tratamento).                               │
├─────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│                         │ 3 assets distintos (um por card), gerados como conjunto coeso (mesma luz/tratamento). Não │
│ 1 asset ou versões?     │  precisam de crop responsivo próprio (proporção estável), mas exportar em 1 resolução que │
│                         │  sirva ao card mobile maior.                                                              │
└─────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────┘

Nota transversal (verificada no código): a seção Atendimento contém o avião animado (top-50px left-0 h-265px, GSAP) e Sobre contém o pin. As mídias dos cards ficam na base dos cards, sob o percurso do avião — não colidem diretamente, mas a composição da seção já tem movimento gráfico; a mídia não pode competir com ele.

---
## Parte B — Três direções visuais para o conjunto

Todas respeitam: posicionamento corporativo, atendimento próximo, relação com o Rio, base Editorial Journey + camada Wayfinding, paleta oficial e regras anti-slop (§21). Diferenciam-se em atmosfera e tratamento.

B.1 — "Rota Clara" (wayfinding corporativo, luz de dia)

- Conceito: mobilidade corporativa vista com a clareza de um sistema de sinalização — terminais, janelas de avião, corredores, linhas de fuga que ecoam o motivo de rota da logo.
- Atmosfera: precisa, arejada, profissional, calma. "Operação eficiente" tornada visual.
- Linguagem de câmera: planos abertos e limpos, linhas arquitetônicas, muito espaço negativo, leading lines (corredor/pista/gate). Sujeito a média distância, nunca olhando para a câmera.
- Presença humana: média — o executivo em trânsito, atendente em contexto; presente mas não protagonista absoluto.
- Luz e cor: luz natural difusa de dia, azul-frio dominante + off-white, verde só como acento. Naturalmente próximo de duotone azul.
- Movimento (vídeo): lento e estável — dolly/glide suave, vista de janela, ritmo de terminal. Nada de cortes rápidos.
- Vantagens: melhor aderência ao posicionamento corporativo + camada wayfinding + motivo de rota; legibilidade de overlay altíssima (imagens claras, muito respiro); consistência fácil.
- Riscos: se genérico demais, esfria e vira "stock de aeroporto". Precisa de um toque humano real para não perder "atendimento próximo".
- Atende melhor: Hero, Band, Diferenciais. Mais fraca sozinha nos cards (que pedem gesto humano).

B.2 — "Alma Carioca" (proximidade humana, luz quente)

- Conceito: a agência que acompanha a pessoa — foco no atendimento, no gesto, na chegada; o Rio como pano de fundo suave (Baía de Guanabara, Flamengo em desfoque), nunca cartão-postal.
- Atmosfera: calorosa, próxima, confiável. "Atendimento próximo" e "alma carioca" tornados visuais.
- Linguagem de câmera: planos médios e fechados, profundidade de campo rasa, detalhes (mãos, olhar entre pessoas, troca real).
- Presença humana: alta — protagonista. Interações reais de serviço, atenção genuína.
- Luz e cor: luz quente natural (manhã/fim de tarde), neutros quentes + areia, azul/verde como acento. Duotone morno.
- Movimento (vídeo): handheld gentil, ritmo humano, closes de detalhe.
- Vantagens: crava "atendimento próximo", atenção humana e identidade carioca; foge da frieza SaaS.
- Riscos: calor pode escorregar para clichê de lazer/turismo (§21) — exige moldura corporativa firme; DOF raso + luz quente reduzem legibilidade de overlay (overlay mais forte no Hero); consistência mais difícil.
- Atende melhor: Sobre, cards de Atendimento, Contato. Mais arriscada no Hero (legibilidade).

B.3 — "Sinal e Movimento" (editorial duotone gráfico)

- Conceito: viagem como sinal e velocidade — duotone azul/verde forte, fragmentos abstratos (motion blur de avião, geometria de terminal, rastros de luz) integrados às linhas de rota/GSAP.
- Atmosfera: contemporânea, branded, cinética.
- Linguagem de câmera: crops ousados, abstração, motion blur, longa exposição.
- Presença humana: baixa — silhuetas, figuras atmosféricas.
- Luz e cor: direcional, alto contraste, duotone forte da paleta (quase monocromático).
- Movimento (vídeo): motion blur, rastros de luz, cinético.
- Vantagens: mais proprietário/branded, consistência máxima (o duotone unifica tudo), legibilidade de texto excelente (tons controlados), casa com wayfinding + motion GSAP.
- Riscos: é o mais perto da fronteira anti-slop (§21) — abstração demais vira "gradiente decorativo"; baixa presença humana conflita com "atendimento próximo"; efeito em excesso é exatamente o que o design.md proíbe.
- Atende melhor: fundo do Hero, Band, painel de Diferenciais. Fraca nos cards (que precisam de gesto humano).

---
## Parte C — Recomendação e inventário inicial

Direção principal recomendada: B.1 "Rota Clara", como sistema-base, com dois modificadores controlados

Racional: a base estrutural travada é Editorial Journey + Wayfinding, e as duas restrições mais duras são legibilidade de overlay (Hero/§7) e posicionamento corporativo (§21). "Rota Clara" é a única que satisfaz ambas sem esforço. Para não perder o "atendimento próximo", ela absorve, de forma disciplinada:

- Momentos humanos de B.2 — reservados a Sobre e às zonas de mídia dos cards (onde o gesto importa e o overlay não é crítico).
- Tratamento duotone de B.3 como camada de acabamento, não como conceito — uma tonalização azul-institucional leve e consistente aplicada a todos os assets, que (a) unifica o conjunto, (b) garante legibilidade de overlay e (c) casa a fronteira imagem↔cor-sólida dos cards. Sem virar abstração.

Regras de tratamento (para os prompts, quando autorizados):
- Overlay/gradiente escuro preservado no Hero e onde houver texto (§7).
- Duotone azul/verde "com controle" (project-card) — nunca a sombra roxa da apresentação nova.
- Pessoas reais em contexto corporativo, sem cara de banco de imagem; nada de clichê turístico.
- SVGs de pin/avião e layout intocados; vídeo sempre com poster + fallback; assets comprimidos e lazy-load.

Inventário inicial de assets (ordem de prioridade)

┌─────┬────────────────────┬───────────────────────┬─────────────┬─────────────────────────────────┬────────────────┐
│  #  │       Asset        │         Área          │    Tipo     │          Enquadramento          │   Prioridade   │
├─────┼────────────────────┼───────────────────────┼─────────────┼─────────────────────────────────┼────────────────┤
│     │ Hero — still de    │                       │             │ Landscape 100vh, foco           │                │
│ 1   │ fallback (desktop) │ Hero                  │ Imagem      │ sup./centro-direito,            │ Máxima         │
│     │                    │                       │             │ base-esquerda limpa             │                │
├─────┼────────────────────┼───────────────────────┼─────────────┼─────────────────────────────────┼────────────────┤
│ 2   │ Hero — still de    │ Hero                  │ Imagem      │ Vertical, mesmo conceito, foco  │ Máxima         │
│     │ fallback (mobile)  │                       │             │ que sobrevive a crop vertical   │                │
├─────┼────────────────────┼───────────────────────┼─────────────┼─────────────────────────────────┼────────────────┤
│     │ Hero — vídeo loop  │                       │             │ Movimento lento/estável; poster │ Alta (depois   │
│ 3   │ 6–10s (desktop +   │ Hero                  │ Vídeo       │  = asset #1/#2                  │ de #1–2        │
│     │ mobile)            │                       │             │                                 │ aprovados)     │
├─────┼────────────────────┼───────────────────────┼─────────────┼─────────────────────────────────┼────────────────┤
│     │ Painel             │                       │             │ Foco central, cantos chip/nota  │                │
│ 4   │ Diferenciais       │ Diferenciais          │ Imagem      │ livres                          │ Alta           │
│     │ (desktop ~3:2)     │                       │             │                                 │                │
├─────┼────────────────────┼───────────────────────┼─────────────┼─────────────────────────────────┼────────────────┤
│     │ Painel             │                       │             │                                 │                │
│ 5   │ Diferenciais (crop │ Diferenciais          │ Imagem      │ Mesmo conceito, recorte baixo e │ Média          │
│     │  mobile faixa      │                       │             │  largo                          │                │
│     │ 260px)             │                       │             │                                 │                │
├─────┼────────────────────┼───────────────────────┼─────────────┼─────────────────────────────────┼────────────────┤
│     │                    │                       │             │ ~2.5:1, sujeito único: 6        │                │
│ 6–8 │ 3 stills dos cards │ Atendimento           │ Imagem      │ assistência 24h · 7             │ Média          │
│     │  (conjunto coeso)  │                       │             │ reservas/device · 8             │                │
│     │                    │                       │             │ canais/parceria                 │                │
├─────┼────────────────────┼───────────────────────┼─────────────┼─────────────────────────────────┼────────────────┤
│     │ Band — faixa de    │ Band                  │             │ painel de voos em loop —        │                │
│ 9   │ transição          │ (Sobre↔Diferenciais,  │ Vídeo/loop  │ ver correção abaixo             │ ALTA           │
│     │ NÚCLEO NARRATIVO   │ §11)                  │             │                                 │                │
└─────┴────────────────────┴───────────────────────┴─────────────┴─────────────────────────────────┴────────────────┘

Faseamento sugerido: #1 e #2 primeiro (maior impacto, valida a direção antes de escalar) → aprovação visual → #4/#5 → conjunto #6–8 → vídeo #3 → #9. OG-image já existe; não regenerar.

---

## ⚠️ CORREÇÃO — a Band NÃO é opcional (registrado em 2026-07-21)

A linha #9 desta tabela dizia **"opcional / prioridade Baixa / 42vh, atmosférico"**. Isso ficou
**desatualizado no mesmo dia em que foi escrito** e enganou a sessão de 2026-07-21.

**Decisão de 2026-07-16** (posterior a esta tabela): a Band foi **promovida de opcional a
elemento narrativo central**, com conteúdo específico definido — **vídeo em loop de um painel de
voos de aeroporto**, 2–3 colunas, mudanças sutis de informação, enquadramento editorial fechado,
câmera fixa ou quase fixa, tratamento cromático alinhado à "Rota Clara", sem cara de banco de
imagem. Papel: transição cinética e temática entre Sobre e Diferenciais, **sem competir** com a
Hero nem com o painel de Diferenciais.

**Status em 2026-07-21: ENTREGUE e em produção.** `src/assets/band/band-painel-voos.mp4`,
painel split-flap, loop costurado. Proveniência em `design/assets/MANIFEST.md`.

**Correção de geometria descoberta na implementação:** a faixa **não usa mais `42vh`**. Com
`42vh` a proporção variava de 3,8:1 a 6,3:1 conforme a viewport, e `object-cover` só deixa de
cortar quando container e imagem têm a **mesma** proporção — em qualquer outro valor o navegador
decepava linhas ou colunas de um painel cujo conteúdo é texto. A altura passou a derivar da
proporção da imagem (4,494:1). Em 1920px dá 428px, contra os 454px do `42vh` anterior.

---

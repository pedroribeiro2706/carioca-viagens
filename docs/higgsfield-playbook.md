# Higgsfield — Playbook de Modelos (aprendido em produção)

Registro transitório do projeto Carioca Viagens. Objetivo: parar de redescobrir por
tentativa e erro qual modelo serve para qual situação, e quanto custa.

> **Marcação de confiança:** ✅ = verificado nesta sessão (2026-07-18/19) · 📋 = herdado do
> `HANDOFF.md` de sessões anteriores, **não** re-testado aqui.

Plano da conta no momento do registro: **Starter**.

---

## 1. Tabela de decisão rápida

| Situação | Modelo | Custo | Nota |
|---|---|---|---|
| Aumentar resolução **sem alterar nada** | `bytedance_image_upscale` | 2 cr ✅ | Zero deriva. Mas **não cria detalhe**. |
| Relight / mudar hora do dia mantendo a cena | `nano_banana_flash` | 3 cr ✅ | **Melhor da casa** para edição preservativa. |
| Edição cirúrgica (mover/alterar 1 elemento) | `nano_banana_flash` | 3 cr ✅ | Funciona, mas **não confie em contagem de pessoas**. |
| Realçar fidelidade/nitidez de imagem fraca | `nano_banana_flash` | 3 cr ✅ | Sintetiza detalhe que o upscaler não consegue. |
| Composição original (still do zero, com texto) | `gpt_image_2` | 3 cr ✅ | medium/2k. Usado nos masters do Hero e no carrossel de Diferenciais. |
| Cena fotorrealista SEM texto em destaque | `nano_banana_pro` | 2 cr ✅ | **Desbloqueado no Plus** (2026-07-23). Cotação bateu exata (sem ÷1,43). Devolve dimensões próprias (4:3 → 2400×1792) e JPEG. **NÃO corrigiu grip mão-objeto** em edição cirúrgica: mudou a região preservando o resto, mas a anatomia continuou errada (2026-07-23). Anatomia fina = Photoshop humano (§4.2). |
| Vídeo image-to-video (start+end) | `seedance_2_0_mini` | 1 cr/s @480p · 2,5 cr/s @720p 📋 | 4–15s. Único de vídeo liberado no Starter. |
| Correção determinística de detalhe fino | **Photoshop (humano)** | — ✅ | Ver §4. IA não serve para isso. |

**Bloqueados no Starter** (falham só na hora de gerar, sem cobrança) ✅:
`nano_banana_pro`, `seedance_2_0` → erro `"Pro" or "Ultimate" plan required`.

---

## 2. Notas por modelo

### `bytedance_image_upscale` ✅
- **Params:** `image_references` (regra: exatamente 1), `resolution` ∈ {`2k`,`4k`} (default `4k`).
- **Medido** a partir de um frame de vídeo 864×496:
  - `2k` → **3762×2160** · `4k` → **4096×2351** · ambos **2 cr**.
- **Aprendizado crítico:** os tiers `2k` e `4k` deram resultados **quase idênticos** para fonte
  ruim (3762 vs 4096 de largura). O ganho de nitidez foi **marginal**.
- **Preserva o aspecto e a composição exatamente** — zero deriva de conteúdo.
- **Use quando:** precisa só de mais pixels e **não pode** alterar nada.
- **Não use quando:** quer recuperar definição de uma fonte 480p — ele estica, não inventa detalhe.

### `nano_banana_flash` (Nano Banana 2) ✅ — o cavalo de batalha
- **Params:** `prompt` (obrigatório), `image_references`, `aspect_ratio` (default `1:1`),
  `resolution` ∈ {`1k`,`2k`,`4k`} (default **`1k`** — sempre passe explícito).
- **Medido:** `4k` + `16:9` → **5504×3072** · **3 cr**.
- **Onde brilhou (3 tarefas distintas, todas bem-sucedidas):**
  1. **Relight preservativo** — Rio entardecer → Rio noite mantendo composição, avião, finger,
     personagem, figurantes e o skyline reconhecível. *Exatamente a tarefa em que o
     `flux_kontext` havia falhado* 📋.
  2. **Edição cirúrgica** — mover só os figurantes para a frente, preservando o resto.
  3. **Realce de fidelidade** — reproduzir a mesma cena com mais nitidez, casando dimensões.
- **Limitação comprovada ✅:** **não é confiável para contagem/identidade exata de pessoas.**
  Ao mover os figurantes, **inventou um figurante a mais**. Nunca confie nele para "mantenha
  exatamente estas N pessoas".
- **Pegadinha de aspecto ✅:** a saída segue o **enum**, não o aspecto da entrada. Uma fonte
  1,742 com `--aspect_ratio 16:9` volta em **1,792** → precisa conformar/cortar depois.
- **Padrão de prompt que funcionou:** listar explicitamente **tudo que deve ficar idêntico**
  (item a item) e depois **"Change ONLY the following:"** com a mudança única. Fechar com
  "Do NOT change anything else".

### `flux_kontext` 📋 (não re-testado aqui)
- Params ✅: `prompt`, `image_references`, `aspect_ratio` ∈ {1:1, 4:3, 3:4, 16:9, 9:16}.
- Histórico: 1,5 cr, edição por instrução, mas **causou deriva de composição** em edição de
  quadro inteiro (sumiram avião/finger, escala errada). **Preterido pelo `nano_banana_flash`**
  para tarefas preservativas.

### `seedance_2_0_mini` 📋 + aprendizado de estratégia ✅
- 480p 1 cr/s · 720p 2,5 cr/s · 4–15s · aceita start+end image · `--generate_audio false`.
- **Aprendizado-chave ✅ (a lição mais cara da fase):** o modelo **interpola entre o frame
  inicial e o final**. Se o frame final for **outra cidade**, ele **inventa um skyline
  transitório** no meio do caminho — foi a origem do erro "a cidade virou outra".
  **→ Controle a narrativa pelo FRAME FINAL, não pelo prompt.** Mesma cidade nos dois
  frames = ele não tem para onde inventar.
- Movimento de figurantes: o gait (a passada) é **sintetizado pelo modelo**. Você controla a
  **velocidade** via `duração × deslocamento entre os frames` — **não** o número exato de passos.
- **O `end_image` é ALVO, não restrição rígida ✅.** O modelo pode **ultrapassar** a pose final
  (verificado: o figurante mais próximo terminou mais adiantado que no frame final). Não é
  corrigível por prompt — o lever real é **reduzir o deslocamento no próprio frame final**.
- **720p NÃO é upscale do 480p ✅.** É **geração nova** a partir dos mesmos frames-âncora:
  melhorar os stills melhora o 720p, **mas o movimento muda** e precisa de nova aprovação.
  Para **preservar exatamente o movimento aprovado**, o caminho é `bytedance_video_upscale` /
  `video_upscale` — ao custo da limitação de detalhe da fonte 480p (ver §4.6).
- **Defaults perigosos do schema ✅:** `generate_audio` = **true** (passe `false` explicitamente),
  `resolution` = **720p** (peça `480p` para teste barato), `duration` = inteiro **sem mínimo
  declarado** no schema (default 5) — a nota "4–15s" **não** é imposta pelo schema.
- **Regra de ouro de defeito ✅:** meça o defeito **na escala real de entrega** antes de gastar
  para corrigi-lo. Artefato de mão que é gritante num master 5504px pode ser **invisível** nos
  ~110 px que ele ocupa no vídeo final.

### Editores disponíveis no catálogo ✅
`flux_2`, `flux_kontext`, `gpt_image_2`, `nano_banana`, `nano_banana_flash`,
`nano_banana_2_lite`, `nano_banana_pro`*, `seedream_v4_5`, `seedream_v5_pro`, `seedream_v5_lite`
(* bloqueado no Starter).

---

## 3. Mecânica da CLI ✅

- **Descubra o schema antes de gerar** — evita tentativa perdida:
  `higgsfield model get <job_type> --json` (params, enums, defaults, rules).
  `higgsfield model list --json` para achar o `job_type`.
- **Flags de mídia aceitam caminho local direto** (`--image ./arquivo.png`) — a CLI **faz o
  upload sozinha**. Não precisa pré-upload.
- **`--wait`** bloqueia até terminar e **imprime a URL do resultado** — evita o padrão
  `create` → `wait`.
- **Bloqueio de plano só aparece na geração** (não no schema): `"Pro" or "Ultimate" plan
  required`. Falha **sem cobrar**.
- **`higgsfield account status`** → plano + créditos.
- **Tiers de resolução não são comparáveis entre modelos:** "4k" do bytedance = 4096 de
  largura; "4k" da Nano Banana = 5504. Sempre meça a saída real.

---

## 4. Princípios de processo (o mais valioso)

1. **Controle a narrativa por frames-âncora, não por vídeo.** Iterar uma imagem estática custa
   ~3 cr e é totalmente inspecionável; iterar vídeo custa 5–6+ cr e é pouco controlável.
   Acerte os stills primeiro, depois deixe o modelo de vídeo interpolar.
2. **Divisão de trabalho IA × humano:** IA para o que ela faz bem (relight, síntese de detalhe,
   composição). **Photoshop para correção determinística** (contagem de pessoas, remover um
   elemento específico). Pedir precisão cirúrgica de contagem à IA é aposta.
3. **Sempre compare antes de adotar.** Gerou? Monte comparativo lado a lado + recorte 100% na
   região crítica, e **só adote se travar**. Tenha sempre o fallback (a versão anterior aprovada).
4. **Erro de quadro estático é barato; erro de vídeo é caro.** Se um elemento derivar num still,
   dá para consertar com um composite de 1 frame. Em vídeo, viraria roto quadro a quadro.
5. **Composição por camadas em VFX ≠ "só uma máscara".** Substituir fundo atrás de um sujeito
   **em movimento**, através de vários vãos de vidro, é tarefa real de VFX (garbage matte +
   Roto Brush + placas). Foi **descartada** neste projeto por custo/benefício em favor da
   estratégia de frames-âncora.
6. **Fonte ruim limita o upscaler.** Para elevar patamar de uma imagem fraca, o caminho é
   **re-render com síntese** (Nano Banana), não upscale — com comparação para garantir travamento.
7. **Inpainting com máscara é do Photoshop, não do Higgsfield ✅.** O Starter não oferece
   substituição por máscara; o Generative Fill oferece — e o que está **fora da seleção fica
   intacto por construção**, não por prompt bem escrito. Medido: a correção da mão alterou
   **0,099%** da imagem (bloco único exatamente sobre mão/relógio), com **12 px** no céu
   (ruído) e **0 px** na faixa do avião. É a ferramenta certa para defeito localizado —
   mão, contagem de pessoas, remover elemento — sem arriscar o que já foi travado.
9. **Deslocamento grande entre âncoras DUPLICA personagem — e isso escala com a resolução ✅.**
   Resultado medido com os **mesmos dois frames-âncora**:

   | Tiragem | Resolução | Duplicata |
   |---|---|---|
   | 4s | 480p | não |
   | 5s | 480p | não |
   | 5s (1ª) | **720p** | **sim** |
   | 5s (2ª, com trava anti-duplicação no prompt) | **720p** | **sim** |

   **Não é variância — é sistemático no 720p** (2/2), e o prompt **não** segurou (mais uma prova
   de que prompt não controla contagem de pessoas). Hipótese: em resolução maior o modelo resolve
   o personagem grande do frame final de forma mais literal e o **instancia já no quadro 0** em
   vez de mover o original. **Gatilho: deslocamento excessivo de um personagem entre os âncoras.**
   **→ Protocolo obrigatório:** em todo render final, **comparar o quadro 0 contra o start-image**
   antes de aprovar. Barato, determinístico, pega essa classe de erro.
10. **`bytedance_video_upscale` custa ~0,1 cr e salvou a entrega ✅.** Quando o render nativo em
   alta falha por artefato, **upscalar a tiragem baixa que já está limpa** preserva exatamente o
   movimento aprovado. Medido: 480p 864×496 → **1882×1080**, preset `aigc`, **0,1 cr** — contra
   **12,5 cr** de um render 720p nativo (que ainda veio defeituoso). Trade-off: amacia/suaviza
   (não recria detalhe), aceitável para vídeo de fundo atrás de texto.
   **Regra:** antes de insistir num render caro em alta, pergunte se um **upscale da versão
   limpa** não resolve — é ~100× mais barato.
8. **Corrigir o frame-âncora não garante o defeito corrigido em TODOS os quadros ✅.** O modelo
   de vídeo **re-sintetiza os quadros intermediários**: o alvo melhora e a pose final converge
   melhor, mas a mão ainda pode amolecer no meio do movimento. Ganho real, garantia não —
   e, na escala de entrega, o resíduo tende a ser invisível (ver §4.6 e a regra de ouro).

---

## 5. Custos verificados nesta sessão ✅

| Operação | Custo |
|---|---|
| `bytedance_image_upscale` (2k **ou** 4k) | 2 cr |
| `nano_banana_flash` @4k | 3 cr |
| **Total da sessão** | **13 cr** (147,5 → 134,5) |

---

## 6. Próximo passo deste registro

- [ ] Subir cópia para `G:\Pedro\Brain\00_Inbox\` → vira conhecimento reutilizável no vault.
- [ ] Quando estabilizar (após +1/+2 projetos), avaliar virar **skill** via `skill-creator`.
      Hoje seria prematuro congelar — ainda estamos aprendendo os limites de cada modelo.

---

## 7. Sessão 2026-07-20 — Kling 3.0 + upgrade de plano ✅

**Plano agora é `plus`** (era Starter). Nome comercial ≠ nome de API: a conta reporta `plus`,
mas o gate de modelo pede *"Pro or Ultimate"* — e `--mode pro` do kling **passou** no Plus.

### `kling3_0` — passou a ser o modelo de vídeo principal
- **Params:** `prompt` (obrig.), `start_image`, `end_image`, `duration` (**mín. 3**, default 5,
  sem enum), `mode` ∈ {`std`,`pro`,`4k`}, `sound` (default **`on`** → passe `off`), `aspect_ratio`.
- **Resolução por modo (medido):** `std` → **1284×716** · `pro` → **1928×1076 (~1080p nativo)** ·
  `4k` → não testado. Custo (pro, medido): 3s **5,25 cr** · 4s **7 cr** · 5s **8,75 cr**.
- **Bloqueio no Starter:** `pro` e `4k` exigiam upgrade; `std` rodava. **`generate cost` cota o
  preço de modos que o plano não libera — cotação NÃO é disponibilidade** (só a geração revela).
- **Vantagens sobre `seedance_2_0_mini`:** mais barato por render, **não duplicou** nos mesmos
  âncoras que faziam o seedance duplicar 2/2, e céu/gradiente mais bonitos. **Virou o padrão.**

### Diferença de comportamento kling × seedance (a lição central do dia) ✅
- **O kling segue o `end_image` com FOLGA** — não force até a pose final. Isso é bom (não duplica)
  e ruim (o último quadro do vídeo **não** é igual ao frame final estático → para encadear a Parte
  seguinte, **extrair o último quadro do vídeo** e usá-lo como start da próxima, NÃO o frame estático).
- **Âncoras na MESMA posição → pedestres "patinam" (moonwalk) ✅.** Verificado: as pernas se mexem
  mas o corpo não translada, e fica esquisito. **Prompt não translada pedestre.** Regra dura:
  **todo trecho com pedestre visível precisa do frame final com ele REPOSICIONADO.** Só use âncoras
  de mesma posição quando o sujeito realmente deve ficar parado (e aí instrua movimento mínimo).
- **Movimento brusco/impaciente é de PROMPT, não teto do modelo ✅.** Descrever o **estado emocional**
  ("patient and unhurried, not impatient", "only the forearm moves gently") suavizou o gesto.

### Definir estado por frame final é mais confiável que por prompt ✅
Escurecimento "some a montanha" **falhou só por prompt** (kling foi tímido, mantendo o morro), e
**funcionou com frame final** (Pedro escureceu no Photoshop e pintou por cima do morro). Mudança de
estado global (exposição, sumiço de silhueta) = **defina o destino no frame final**, não peça ao prompt.

---

## 8. Sessão 2026-07-21 — prompt, estado e edição local ✅

Plano **plus**, saldo 980,75 → ~820 (≈160 cr na sessão). Produzidas: Cenas 2 e 3 do reel da
Hero, painel de voos da Band, e as imagens dos cards de Atendimento.

### 8.1 A skill `higgsfield-generate` existe e eu não a usei ❌

O `HANDOFF.md` §17 já documentava que o caminho de execução é **skill → CLI**. Rodei a CLI direto
a sessão inteira e só carreguei a skill quando o Pedro perguntou. Ela contém, em
`references/prompt-engineering.md`, **duas regras que teriam evitado ~10 cr de renders queimados**:

- *"Most models don't expose a `negative_prompt`. Phrase positively."*
- *"Keep it under ~200 tokens. Models distort with very long prompts."*
- *"Don't redescribe the static frame — model already has it."* (para image-to-video)

**Regra:** carregar a skill no início de qualquer sessão de mídia. Não é redundante com este
playbook — a skill cobre o genérico da ferramenta, o playbook cobre o específico deste projeto.

### 8.2 Negação nomeada vira instrução ✅ — a lição mais cara do dia

Sintoma: na Cena 2 a expressão da mulher migrava de serena para preocupada no fim do clipe.
Tentativa de correção: encher o prompt de proibições — *"never frowns, never narrows her eyes,
never looks concerned, worried, puzzled, **surprised** or displeased"*.

**Ficou pior.** O Pedro descreveu o resultado como *"parece tomar um susto, ficar surpresa"* —
usando a palavra que eu havia escrito para proibir. O codificador de texto não tem operador de
negação: escrever o conceito o coloca no condicionamento, independentemente do "never".

**Regra dura:** nunca nomeie o indesejado, nem para proibir. Descreva só o estado desejado.

### 8.3 Prompt não controla ESTADO; controla RELAÇÃO ✅ — distinção nova

Teste A/B limpo, isolado numa única variável:

| Versão | Prompt | Âncoras | Expressão | Movimento |
|---|---|---|---|---|
| v2 | negativo, longo | só start | **cai** | bom (33,0) |
| v3 | afirmativo, curto | start **+ end iguais** | **segura** | **morto (1,15)** |
| v4 | afirmativo, curto (idêntico à v3) | só start | **cai** | bom (32,8) |

v3 e v4 têm o **mesmo prompt** e diferem só no `end_image`. Logo: **o que segurou a expressão foi
a âncora, não a redação.** O prompt afirmativo é necessário, não suficiente.

Mas o corolário importa tanto quanto: no mesmo dia o modelo **acertou de primeira** um pedido de
*câmera acompanhando a pessoa que se levanta, mantendo o corpo inteiro em quadro* — coordenação
de câmera com ação, que eu havia previsto como o pedido mais difícil da sessão.

**A distinção que emerge:** o modelo é ruim em **escolher onde algo termina** (expressão final,
posição final de pedestre, texto final das abas) e bom em **executar uma relação contínua**
(câmera seguindo sujeito, órbita, escala). Destino se define por frame final; relação se define
por prompt.

### 8.4 Âncoras iguais matam o movimento ✅ — e às vezes é o que se quer

`start_image == end_image` trava o estado nas duas pontas, mas o preço é movimento quase nulo
(medido: 1,15 contra ~33 das versões com âncora única). Verificado duas vezes:

- **Cena 2:** virou imagem praticamente estática. Reprovado.
- **Band:** foi a **solução**. O painel precisava voltar ao texto original (sem âncora final o
  modelo assentava as abas em palavras inventadas — "JANEER"), e o movimento desejado era local
  e cíclico. Loop costurado: diferença de 0,99 entre primeiro e último quadro.

**Regra:** âncoras iguais para **loop e retorno de estado**; âncora única para **deslocamento**.

### 8.5 `generate cost` superestima ✅

A cotação vem **~1,43× acima do cobrado**. Medido por diferença de saldo: `kling3_0 pro` 3s cota
7,5 cr e cobra **5,25**; 4s cota 10 e cobra **7**. Bate com o §7. **Divida a cotação por 1,43**
antes de decidir. (E cotação ainda não é disponibilidade — §7.)

### 8.6 Testar em resolução baixa NÃO valida um take ✅

Reforço do §2: `std` (1284×716) custa ~1,4 cr menos que `pro` (1928×1076) em 4s. Não compensa,
porque **resolução maior é geração nova** — o take muda e precisa de aprovação de novo.
Vale só para descobrir se o modelo **dá conta da ação**, não para aprovar uma tomada.

### 8.7 A CLI rejeita `.jfif` ✅

`Error: Cannot detect media type from extension ".jfif"`. Falha **antes de gerar, sem cobrar**.
Converter para `.png` resolve. Vale para qualquer extensão fora do conjunto conhecido.

### 8.8 ffmpeg resolve de graça o que a IA cobra ✅ — o aprendizado de melhor retorno

Binário: `imageio_ffmpeg.get_ffmpeg_exe()` (não está no `PATH` do sistema).

Resolvidos **sem gastar um crédito** nesta sessão:

- **Inversão temporal** (ideia do Pedro): a Cena 2 tinha o sorriso no início e fechava a
  expressão no fim. Cortar 0,5s e **rodar de trás para frente** fez a cena *terminar* no sorriso.
  Resolveu de graça o problema em que eu já havia queimado dois renders.
- **Junção, dissolvência e fade** das cenas num reel.
- **Recorte** do vídeo para a proporção da faixa, e **moldura preta** para caber no 16:9.

**Regra:** antes de gerar, pergunte se dá para resolver **mexendo no que já existe**.

### 8.9 Proporção: molde por altura descartável, nunca cortando largura ✅

O `kling3_0` só gera **16:9**. Para animar um painel de texto de 2,36:1, minha primeira tentativa
cortou a **largura** até caber — e decepou as palavras ("SÃO PAULO" virou "O PAULO").

**O caminho certo é o inverso:** emoldurar em preto até 16:9, animar, e recortar de volta a
região aprovada. As faixas pretas são material de sacrifício. Largura é onde vive o conteúdo.

**E confira o recorte visualmente antes de gerar.** Detectei um "vão entre colunas" por análise
de brilho que era, na verdade, espaço **entre letras**. Custou um render inteiro.

### 8.10 Duotone não corrige tonalidade de origem ✅

Ao assentar fotos na cor chapada dos cards, as imagens geradas em **luz de dia** ficavam lavadas
no card verde: o ponto alto do duotone (luminância ~162) superava a própria cor do card (~139), e
a faixa lia como área desbotada em vez de janela. As cenas noturnas não tinham o problema.
Corrigido **na origem** (regerar low-key: luminância média 117 → 60), não na curva.

Fim da história do duotone: **reprovado** para as imagens finais dos cards. Elas vivem de luz e
cor quente — o dourado da janela do avião vira cinza, a madeira da mala vira oliva.

### 8.11 Medir contraste pela média do recorte dá número FALSO ✅

Ao verificar a legibilidade do texto da Hero sobre o vídeo, medi a média de luminância do recorte
e obtive 3,0–3,4:1 — abaixo do AA. **Errado:** a média incluía os pixels do próprio texto claro.

Medindo a **mediana** (o texto é esparso, a mediana pega o fundo): **11,6 a 13,3:1**. Passava com
folga desde o início. Cheguei a reforçar o véu escuro sem necessidade.

**Regra:** para contraste de texto sobre imagem, use a **mediana** do fundo, e converta para
luminância relativa (sRGB linearizado), não o cinza direto.

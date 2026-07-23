# design/assets — mídia gerada (Higgsfield)

Candidatos e masters de mídia **gerada** para a apresentação Carioca Viagens.

Separado por convenção de:
- `references/` — inspiração/referência **externa**;
- `design/mocks/` — mockups HTML, **congelados** (mockup 10 foi o último);
- `src/assets/` — **produção**; recebe apenas o master aprovado e otimizado, e só quando a **integração ao site for autorizada** (passo separado).

Estágios: **candidate** = compose de validação (`medium/2k`) · **master** = versão aprovada (`high/2k`).

Prompt-fonte do Hero: `hero-desktop-prompt.txt` (prompt refinado aprovado do asset #1).

## hero/

| Arquivo | Estágio | Modelo | Params | Custo | Data | Origem (URL Higgsfield) |
|---|---|---|---|---|---|---|
| hero-desktop-candidate-01.png | candidate | gpt_image_2 | 16:9 · medium · 2k | 3 cr | 2026-07-16 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260716_162155_ea041697-cad6-4301-9579-e3e17127e9ca.png |
| hero-desktop-candidate-02.png | candidate (v1 — ambíguo) | gpt_image_2 | 16:9 · medium · 2k | 3 cr | 2026-07-16 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260716_162323_ea4731ca-4daa-4217-829e-7d40d15b7cb8.png |
| hero-desktop-v2-candidate-01.png | candidate (v2 — terminal reforçado) | gpt_image_2 | 16:9 · medium · 2k | 3 cr | 2026-07-16 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260716_203056_d96b78d6-9d93-4cff-b170-d2a7bc4098b6.png |
| hero-desktop-v2-candidate-02.png | candidate (v2 — terminal reforçado) | gpt_image_2 | 16:9 · medium · 2k | 3 cr | 2026-07-16 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260716_203203_829956c7-6f26-450d-8c62-a7d37411edf6.png |
| hero-desktop-master-01-4k.png | **master** (upscale de v2-candidate-01, 2688×1520 → 4096×2323) | bytedance_image_upscale | 4k | 2 cr | 2026-07-16 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260716_231230_f16c7b10-a7f5-427f-bd36-d2cce1075762.png |

| hero-mobile-v1-candidate-01.png | candidate (mobile 9:16, ref = master desktop) | gpt_image_2 | 9:16 · medium · 2k · --image master | 3 cr | 2026-07-16 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260716_235511_6c0c74a2-7436-4cd8-b156-fec319059d11.png |
| hero-mobile-v1-candidate-02.png | candidate (mobile 9:16, ref = master desktop) | gpt_image_2 | 9:16 · medium · 2k · --image master | 3 cr | 2026-07-16 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260716_235637_aa39cad8-39e8-4e7e-b1c7-5c65a771a60c.png |

| hero-mobile-master-02-4k.png | **master** (upscale de mobile-v1-candidate-02, 1520×2688 → 2323×4096) | bytedance_image_upscale | 4k | 2 cr | 2026-07-17 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260717_140102_2b8d3019-a77c-4c14-afd1-ca95459de153.png |

| hero-video-scene1-test-480p.mp4 | teste vídeo (Cena 1 — time-lapse externo Rio→cidade internacional) | seedance_2_0_mini | 16:9 · 480p · 4s · start-image master · sem áudio | 4 cr | 2026-07-17 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260717_151025_5e0b84f0-9c83-453e-8488-dededbf385f4.mp4 |
| hero-video-scene1-endimage-london.png | end-image Cena 1 (Londres amanhecer; edição por instrução preservando interior do master) | flux_kontext | 16:9 · ref=master · edit-only-exterior | 1.5 cr | 2026-07-17 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260717_155856_1fcb12bb-0952-4b95-83a1-652b95c9c876.png |
| hero-video-scene1-endimage-london-conformed.png | end-image conformada (crop puro p/ casar aspecto do master: 1392×752 → 1326×752, -33px cada lado) | — (crop local, sem geração) | — | 0 cr | 2026-07-17 | derivado de endimage-london.png |
| hero-video-scene1-test2-480p.mp4 | teste vídeo v2 (Cena 1 — start Rio + end Londres; entardecer→noite→amanhecer, gesto do relógio, interior aceso à noite) | seedance_2_0_mini | 16:9 · 480p · 5s · start+end · sem áudio | 5 cr | 2026-07-17 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260717_172004_b737a089-69ec-4601-8090-51509301130d.mp4 |
| hero-video-scene1-test3-480p.mp4 | teste vídeo v3 (Cena 1 — **DESCARTADO** como referência: figurantes grandes em primeiro plano, caminhada marcada demais) | seedance_2_0_mini | 16:9 · 480p · 6s · start+end · sem áudio | 6 cr | 2026-07-17 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260717_175027_d0f792a7-012a-4992-a79e-11d6ff530ae4.mp4 |
| hero-video-scene1-test4-480p.mp4 | teste vídeo v4 (baseline test2 + 2 ajustes: dusk inicial mais longo + troca Rio→Londres ainda na noite; figurantes discretos como test2, sem primeiro plano; gesto do relógio como test2) | seedance_2_0_mini | 16:9 · 480p · 6s · start+end · sem áudio | 6 cr | 2026-07-17 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260717_181828_e87cbea9-4b91-4224-8a85-64970ab67b9c.mp4 |
| hero-video-scene1-test5-480p.mp4 | teste vídeo v5 (Cena 1 — transição noturna controlada: Rio escurece antes de Londres se estabelecer na noite; sem prédios crescendo do chão; figurantes discretos; gesto do relógio mais suave) | seedance_2_0_mini | 16:9 · 480p · 6s · start+end · sem áudio | 6 cr | 2026-07-17 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260717_185810_5d19d9b0-40e5-43c0-9294-f36ed9b7ae3b.mp4 |
| hero-video-scene1-test6-480p.mp4 | teste vídeo v6 (Cena 1 — usa os **frames do test2** como start (dusk Rio) e end (Londres); reforços: começa exatamente no dusk do start frame + Londres estabelecida à noite ~1s antes do amanhecer + fix do figurante à esquerda; **melhor transição até agora**) | seedance_2_0_mini | 16:9 · 480p · 6s · start+end (frames test2) · sem áudio | 6 cr | 2026-07-17 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260717_220717_63ade766-16ac-4ab7-ab2d-735057c39985.mp4 |

### Cena 1 — Parte 1 (Rio entardecer → Rio noite) · frames-âncora APROVADOS (2026-07-19)

Estratégia nova: **abandonado** o morph Rio→Londres dentro do mesmo plano (causava skyline inventado) e **abandonada** a composição por camadas no AE (roto de sujeito em movimento = VFX real, custo/benefício ruim). Passamos a **controlar a narrativa pelos frames-âncora** e deixar o seedance interpolar. Ver `docs/higgsfield-playbook.md`.

| Arquivo | Estágio | Modelo | Params | Custo | Data | Origem |
|---|---|---|---|---|---|---|
| hero-video-scene1-frame1-rio-tarde-2k.png | intermediário (→ `old/`) | bytedance_image_upscale | 2k · de 864×496 → 3762×2160 | 2 cr | 2026-07-18 | upscale do 1º frame do test2 |
| hero-video-scene1-frame1-rio-tarde-4k.png | intermediário (→ `old/`) | bytedance_image_upscale | 4k · → 4096×2351 | 2 cr | 2026-07-19 | ganho marginal vs 2k (ver playbook) |
| **hero-video-scene1-frame1-rio-tarde-master.png** | **MASTER — frame inicial** | nano_banana_flash | 16:9 · 4k · realce de fidelidade, identidade estrita · **5504×3072** | 3 cr | 2026-07-19 | realce do frame1 (composição travada, verificada por comparativo) |
| hero-video-scene1-frame2-rio-noite-2k-candidate.png | candidato v1 (→ `old/`) | nano_banana_flash | 16:9 · 4k · relight dusk→noite · 5504×3072 | 3 cr | 2026-07-18 | figurantes ainda parados |
| hero-video-scene1-frame2-rio-noite-2k-candidate-v2.png | candidato v2 (→ `old/`) | nano_banana_flash | 16:9 · 4k · avanço dos figurantes | 3 cr | 2026-07-19 | **inventou 1 figurante extra** (limitação registrada) |
| **hero-video-scene1-frame2-rio-noite-master.png** | **MASTER — frame final** | nano_banana_flash + **Photoshop (Pedro)** | 5504×3072 · remoção manual do figurante extra | 0 cr (edição manual) | 2026-07-19 | diff verificado: 1,18% dos pixels, bloco único, zero alteração em skyline/avião/personagem |

_Parte 1 — subtotal: **13 créditos** (147,5 → 134,5). Ambos os masters em **5504×3072 · 1,792** (dimensões casadas, sem necessidade de conformar). Elenco de figurantes validado: todo figurante do frame final tem correspondente no inicial; o 4º sai de quadro durante a animação (movimento natural, não quebra de continuidade)._

**Correção da mão (Photoshop, Pedro — 2026-07-19):** o gesto do relógio foi *inventado* pela Nano Banana no frame2 (não existia no frame1), e mãos são o ponto fraco universal dos modelos de difusão. Corrigido com **inpainting mascarado no Photoshop** (0 cr): diff comprova **0,099%** dos pixels alterados, bloco único sobre mão/relógio, **12 px** no céu (ruído) e **0 px** na faixa do avião. Arquivo mantido no mesmo nome (`...frame2-rio-noite-master.png`); versão pré-correção não preservada.

#### Vídeos da Parte 1

| Arquivo | Estágio | Modelo | Params | Custo | Data |
|---|---|---|---|---|---|
| hero-video-scene1-parte1-dusk-noite-480p.mp4 | teste ritmo | seedance_2_0_mini | 480p · **4s** · start+end masters · sem áudio · 864×496 | 4 cr | 2026-07-19 |
| hero-video-scene1-parte1-dusk-noite-5s-480p.mp4 | teste ritmo (aprovado) | seedance_2_0_mini | 480p · **5s** · só a duração mudou · 864×496 | 5 cr | 2026-07-19 |
| hero-video-scene1-parte1-dusk-noite-5s-720p.mp4 | **DESCARTADO** — figurante duplicado no quadro 0 | seedance_2_0_mini | 720p · 5s · 1280×720 | 12,5 cr | 2026-07-19 |
| hero-video-scene1-parte1-dusk-noite-5s-720p-v2.mp4 | **DESCARTADO** — duplicata reapareceu, mesmo com trava anti-duplicação no prompt | seedance_2_0_mini | 720p · 5s · 1280×720 | 12,5 cr | 2026-07-20 |
| **hero-video-scene1-parte1-FINAL-1080p.mp4** | **FINAL Parte 1 — APROVAR** | bytedance_video_upscale | upscale do 5s 480p limpo · preset `aigc` · **1882×1080 · 24fps · 6,2 MB** | **0,1 cr** | 2026-07-20 |

_Parte 1 — total: **47,1 créditos** (147,5 → 100,4). **Duplicação de figurante é sistemática no 720p nativo** (2/2 tiragens), ausente no 480p (2/2) — gatilho é o deslocamento excessivo daquele personagem entre os âncoras; prompt não segura. Solução: **upscalar a tiragem 480p limpa por 0,1 cr** em vez de insistir num render nativo de 12,5 cr. Validações do final: quadro 0 confere com o start-image (sem duplicata), skyline do Rio preservado, avião/finger/câmera travados, sem áudio. Protocolo adotado: **sempre comparar o quadro 0 contra o start-image antes de aprovar**. Detalhes em `docs/higgsfield-playbook.md`._

---

_Total gasto no grupo Hero (fase anterior): **58 créditos** (bate com o saldo real: 210→152). Desktop: composição v1 6 + v2 6 + upscale 2 = 14. Mobile: 2 candidatos 6 + upscale 2 = 8. Vídeo Cena 1: v1 4 + end-image Londres flux_kontext 1,5 + v2 5 + v3 6 (descartado) + v4 6 + v5 6 + v6 6 = 34,5; start-image dusk flux_kontext 1,5 (superado — passamos a usar os frames do test2 diretamente como start/end). Conformação da end-image Londres original foi crop local sem custo. Notas: `topaz_image` falhou 3× sem cobrança (instabilidade 2026-07-16); `bytedance` do mobile falhou 1× (transitória) e sucedeu no retry; **`seedance_2_0` exige plano Pro/Ultimate (bloqueado no Starter, sem cobrança) — `seedance_2_0_mini` roda no Starter** (480p 4s = 4 cr; 720p 4s = 10 cr). Prompts: `hero-desktop-prompt.txt`, `hero-desktop-prompt-v2.txt`, `hero-mobile-prompt.txt`, `cena1-prompt.txt`. Masters aprovados: `hero-desktop-master-01-4k.png` · `hero-mobile-master-02-4k.png`. **Baseline oficial da Cena 1 (vídeo): `hero-video-scene1-test2-480p.mp4`** — `test3` foi **descartado** como referência criativa/visual/de movimento (decisão do Pedro em 2026-07-17: figurantes grandes em primeiro plano e caminhada marcada demais)._

---

## cards/ — zonas de mídia dos cards de Atendimento (2026-07-21)

Faixa de **2,5:1** na base de cada card (`row-start-5`, `40fr` de 100 num card `aspect-square`;
~349×140 px em tela a 1180px de wrap). Gerados em **21:9** — a proporção mais próxima disponível,
descarta só ~7% de altura no corte, contra ~29% se fosse 16:9.

Direção travada nesta sessão: **duotone na cor do próprio card** (consistente com o tratamento
duotone já aprovado em 2026-07-16 como camada de acabamento), **recorte fechado com presença
humana**, **ponto de vista do lado da agência** (quem atende), em contraste com a Hero que mostra
o viajante. O aperto de mão do ícone do card 03 foi deliberadamente evitado — clichê corporativo
e proibido por `design.md` §21; substituído por linhas de rota sobre mapa, que rimam com o motivo
gráfico da marca.

| Arquivo | Estágio | Modelo | Params | Custo | Data | Origem (URL Higgsfield) |
|---|---|---|---|---|---|---|
| card-01-assistencia-candidate-a.png | candidate | nano_banana_pro | 21:9 · 2k | 2 cr | 2026-07-21 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_200803_85141a04-4019-426f-b607-deacabd869e8.png |
| card-01-assistencia-candidate-b.png | candidate | nano_banana_pro | 21:9 · 2k | 2 cr | 2026-07-21 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_200803_27a67b1c-970f-4328-9a8c-c5ebd387ae1f.png |
| card-02-reservas-candidate-a.png | candidate (luz de dia — rejeitado) | nano_banana_pro | 21:9 · 2k | 2 cr | 2026-07-21 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_200803_fe5abf1b-d9d0-4a0c-9b42-092cf1b53f0c.png |
| card-02-reservas-candidate-b.png | candidate (luz de dia — rejeitado) | nano_banana_pro | 21:9 · 2k | 2 cr | 2026-07-21 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_200803_e26c0a9f-1c31-49cf-b78c-2952cc6f9e7a.png |
| card-02-reservas-candidate-c.png | candidate (low-key) | nano_banana_pro | 21:9 · 2k | 2 cr | 2026-07-21 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_201442_5e0b2600-60e1-4d35-b58d-3c6d6e0f0812.png |
| card-02-reservas-candidate-d.png | candidate (low-key, escuro demais) | nano_banana_pro | 21:9 · 2k | 2 cr | 2026-07-21 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_201442_8355a91c-0218-4bab-9a0e-0b4952ed3320.png |
| card-03-distribuicao-candidate-a.png | candidate | nano_banana_pro | 21:9 · 2k | 2 cr | 2026-07-21 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_200806_e7241f98-0dd0-4c76-8ef1-9453af653634.png |
| card-03-distribuicao-candidate-b.png | candidate | nano_banana_pro | 21:9 · 2k | 2 cr | 2026-07-21 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_200803_399e78e2-e79d-4d45-bb1f-fd1c658a3db3.png |

_Todos 3168×1344 (2,357:1). Custo do grupo: **16 créditos**._

**Aprendizado registrado:** o duotone não corrige tonalidade de origem. As duas primeiras versões
do card 02 foram geradas em luz de dia e, mapeadas para o verde, o ponto alto do duotone
(luminância ~162) ficou **acima da própria cor do card** (~139) — a faixa lia como área desbotada,
não como janela. Os cards 01 e 03, noturnos, não têm o problema. Corrigido na origem (versões
low-key `c`/`d`), não na curva. Luminância média medida: a=117,5 · b=93,3 · c=59,6 · d=27,0.

_Recomendação ao Pedro: **01a + 02c + 03b**. Pendente de aprovação; nada integrado a `src/`._

### cards/ — v2 (2026-07-21, direção revisada pelo Pedro)

As candidatas da 1ª rodada foram **reprovadas pelo Pedro** ("genéricas, não tão bonitas"). Nova
direção definida por ele, com duas referências visuais que ele salvou em `design/assets/cards/`:
`referencia-assistencia.png` e `referencia-reserva-online.jfif` (+ `.png` convertido — **a CLI do
Higgsfield rejeita `.jfif`**: `Cannot detect media type from extension`, falha sem cobrar).

Card 03 deixou de ser "lado da agência": passou a ser **mulher na poltrona do avião, perfil,
sorrindo, olhando pela janela**, enquadramento próximo como quem está sentado ao lado.

| Arquivo | Estágio | Modelo | Params | Custo | Origem (URL Higgsfield) |
|---|---|---|---|---|---|
| card-01-assistencia-v2a.png | candidate | nano_banana_pro | 21:9 · 2k · ref | 2 cr | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_202924_408232f7-198f-4648-9d52-a2b6e83054b2.png |
| card-01-assistencia-v2b.png | candidate | nano_banana_pro | 21:9 · 2k · ref | 2 cr | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_202924_694cf4d0-1f41-4b81-8f69-9c5ed69413f2.png |
| card-02-reservas-v2a.png | candidate | nano_banana_pro | 21:9 · 2k · ref | 2 cr | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_203200_4ca13722-4c54-4c98-9033-dcd26851c46d.png |
| card-02-reservas-v2b.png | candidate | nano_banana_pro | 21:9 · 2k · ref | 2 cr | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_203200_28250863-e255-4f90-91f7-d8136027bd6d.png |
| card-03-aviao-v2a.png | candidate | nano_banana_pro | 21:9 · 2k | 2 cr | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_202922_de27e64d-0af4-4554-8864-cee038117b16.png |
| card-03-aviao-v2b.png | candidate | nano_banana_pro | 21:9 · 2k | 2 cr | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_202922_284168dd-95e4-4999-818d-d5040dd8c0e3.png |

_Custo v2: **12 cr** (as 2 falhas de `.jfif` não cobraram)._

**Tratamento — decisão REABERTA.** O duotone aprovado em 2026-07-16 e reconfirmado hoje foi testado
contra estas imagens e **destrói o que as torna boas**: o dourado da janela do avião vira cinza, os
tons de madeira da mala viram oliva, o escritório claro lava no azul. Comparativo de 3 tratamentos
(cru / duotone / tint 28%) em `scratchpad/cards_v2_tratamentos.png`. Aguardando decisão do Pedro.

---

## band/ — faixa de transição entre Sobre e Diferenciais (2026-07-21)

Conceito confirmado pelo Pedro: **vídeo em loop de um painel de voos de aeroporto** — 2–3 colunas,
mudanças sutis de informação, enquadramento editorial fechado, câmera fixa ou quase fixa, tratamento
cromático "Rota Clara". Decisão original de 2026-07-16, que promoveu a Band de opcional a elemento
narrativo central. **`design/higgsfield.md` ainda a lista como "#9, opcional, prioridade Baixa" e
precisa ser corrigido.**

**Restrição de proporção medida:** `media-band.tsx` usa `h-[42vh]` full-bleed → a faixa varia de
**~3,8:1 a ~4,3:1** conforme a viewport. O `kling3_0` só gera **16:9**, então o `object-cover`
descarta mais da metade da altura. Por isso os âncoras foram compostos com o painel **na faixa
central** do quadro, não centralizados no 16:9 inteiro.

| Arquivo | Estágio | Modelo | Params | Custo | Origem (URL Higgsfield) |
|---|---|---|---|---|---|
| band-painel-voos-candidate-a.png | candidate (caracteres pequenos demais) | nano_banana_pro | 16:9 · 4k | 4 cr | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_205254_ca3dc4e4-cff2-41de-b934-5bcf5b85703f.png |
| band-painel-voos-candidate-b.png | **candidate recomendado** | nano_banana_pro | 16:9 · 4k | 4 cr | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_205254_f4dac7a7-28e2-4150-b49f-5867f9d2ee5f.png |
| band-painel-voos-candidate-c.png | candidate (ângulo — corte decepa o painel) | nano_banana_pro | 16:9 · 4k | 4 cr | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_205254_79db4a3d-e958-485c-9267-e982677c5809.png |

_Todos 5504×3072. Custo do grupo: **12 cr**. URLs exatas em `scratchpad/band/b{1,2,3}.txt`._

### hero/ — Cena 2 (avião) · âncoras (2026-07-21)

Decupagem do vídeo da Hero em **três cenas de momento** (confirmada pelo Pedro nesta sessão):
Cena 1 saguão do aeroporto · **Cena 2 avião** · Cena 3 carro executivo. Cena 1 em stand-by.

Cena 2: executiva branca na poltrona da janela, trabalhando (celular ou tablet), vista bonita pela
janela, enquadramento de quem está sentado ao lado. Hiper-realista, aspecto publicitário.
**Cena 3 (executiva negra entrando em carro alugado) ainda NÃO foi gerada** — depende da aprovação da Cena 2.

| Arquivo | Estágio | Modelo | Params | Custo | Origem (URL Higgsfield) |
|---|---|---|---|---|---|
| hero-video-scene2-aviao-candidate-a.png | candidate (celular; sem conexão com a vista) | nano_banana_pro | 16:9 · 4k | 4 cr | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_204727_a06c213b-6d72-4cd9-967c-7d8357f8299a.png |
| hero-video-scene2-aviao-candidate-b.png | **candidate recomendado** (tablet; olha para a janela) | nano_banana_pro | 16:9 · 4k | 4 cr | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_204727_49b7241e-498e-4765-aab1-05f8ad41568a.png |
| hero-video-scene2-aviao-candidate-c.png | candidate (luz boa; janela à direita, vista some) | nano_banana_pro | 16:9 · 4k | 4 cr | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_204727_c94d447f-7f3d-42fe-93aa-29a448c07bfe.png |

_Todos 5504×3072. Custo: **12 cr**._

### band/ — 2ª rodada: frontal, linhas maiores (2026-07-21)

Correção pedida pelo Pedro: painel **frontal chapado**, sem reflexo, sem contexto de terminal, com
linhas grandes o bastante para caberem ~5 na faixa. Geradas em **21:9** (2,36:1 medido) em vez de
16:9 — menos desperdício de corte. **Consequência a resolver antes de animar:** o `kling3_0` só
gera 16:9, então o still aprovado precisará ser estendido na vertical via `outpaint_image`.

| Arquivo | Estágio | Modelo | Params | Custo | Origem (URL Higgsfield) |
|---|---|---|---|---|---|
| band-painel-voos-frontal-a.png | candidate | nano_banana_pro | 21:9 · 4k | 4 cr | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_210505_9061e462-30ef-42e0-b510-995e35d98932.png |
| band-painel-voos-frontal-b.png | candidate | nano_banana_pro | 21:9 · 4k | 4 cr | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_210505_ecc8bb0d-40bb-4d57-8e89-a7d95b408c29.png |
| band-painel-voos-frontal-c.png | candidate | nano_banana_pro | 21:9 · 4k | 4 cr | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260721_210505_3a2d3a82-3d6b-4bd2-ae2f-745b216f54b0.png |

_Todos 6336×2688. Custo: **12 cr**._

**Proporção real da Band medida** (`h-[42vh]` + `min-h-[300px]`, full-bleed): 1536×864 / 1920×1080 /
2560×1440 → **4,23:1** · 1440×900 → 3,81:1 · ultrawide 3440×1440 → **5,69:1** · janela baixa
1920×720 → **6,35:1** · celular 390×844 → **1,10:1 (quase quadrado)**. Nenhum asset serve os dois
extremos; painel frontal chapado é auto-similar nos dois eixos e por isso tolera qualquer corte.

---

## ⚠️ REORGANIZAÇÃO DE PASTAS (2026-07-21)

As três cenas do vídeo da Hero saíram de `hero/` para **`reel/`**, a pedido do Pedro. As
referências a `hero/...` nas seções acima que apontam para arquivos `hero-video-scene*`
devem ser lidas como **`reel/...`**. Os nomes dos arquivos não mudaram.

| Pasta | Conteúdo |
|---|---|
| `reel/` | as três cenas do vídeo da Hero — `hero-video-scene1-*` (saguão), `hero-video-scene2-*` (avião), `hero-video-scene3-*` (carro). Vídeos em `reel/mp4/`. |
| `hero/` | apenas os stills da Hero: `stills/hero-desktop-master-01-4k.png`, `mobile/hero-mobile-master-02-4k.png`, mais `old/`, `references/` e `photoshop/`. |
| `cards/` | zonas de mídia dos cards de Atendimento. |
| `band/` | painel de voos da faixa de transição, vídeo em `band/mp4/`. |

**Deliberadamente NÃO movido:** `hero/photoshop/` guarda os PSDs de trabalho do Pedro para a
Cena 1. São da Cena 1, mas arquivo do Photoshop pode ter camadas vinculadas por caminho e mover
quebraria os vínculos. Decisão do Pedro pendente.

### Decupagem do vídeo da Hero — três cenas de momento

Confirmada pelo Pedro em 2026-07-21. **Não existia em documento nenhum antes desta entrada** —
a informação estava só na conversa, e a sessão perdeu tempo redescobrindo.

1. **Cena 1 — saguão do aeroporto.** Em stand-by por decisão do Pedro. Subdividida em 4 partes
   (Rio entardecer→noite ✅ aprovada · escurecimento ✅ v4 tecnicamente ok, sem veredito visual ·
   luzes de Londres · amanhecer). Detalhe em `HANDOFF.md` §18.
2. **Cena 2 — avião.** Executiva branca na poltrona da janela, trabalhando no celular, vista
   bonita pela janela, enquadramento de quem senta ao lado. 3s.
   **Entregue:** `reel/mp4/hero-video-scene2-aviao-v2-reverso.mp4` — a v2 cortada em 2,54s e
   **invertida** (ideia do Pedro), o que resolve a queda de expressão fazendo a cena terminar no
   sorriso em vez de começar nele. Aceita como provisória.
3. **Cena 3 — carro.** Executiva negra recebendo a chave e entrando no carro alugado, para falar
   do serviço de locação e translado. 3s. Em produção.

---

## diferenciais/ — carrossel da seção Diferenciais (2026-07-23)

5 slides: foto real da Flavinha (preparada pelo Pedro, nada gerado) + 4 imagens geradas, uma por
diferencial. Spec: `docs/superpowers/specs/2026-07-23-carrossel-diferenciais-design.md`. Geradas
em **4:3 · medium · 2k** (`gpt_image_2`, mesmo modelo dos masters da Hero — mesma família visual).
Prompts reformulados em fraseado positivo (regra do playbook §8.2 — nunca nomear o indesejado).

| Arquivo | Estágio | Modelo | Params | Custo | Data | Origem (URL Higgsfield) |
|---|---|---|---|---|---|---|
| agilidade-master.png | intermediário (gerado) | gpt_image_2 | 4:3 · medium · 2k · 2336×1744 | 3 cr | 2026-07-23 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260723_153808_764b21ac-43bb-4d71-89a3-f05f5b0f38cb.png |
| **agilidade-master-pt.png** | **MASTER aprovado** | gpt_image_2 + Photoshop (Pedro) | 2336×1744 · nome do passageiro trocado por nome brasileiro | 0 cr (edição manual) | 2026-07-23 | derivado de agilidade-master.png |
| eficiencia-master.png | intermediário (mão atravessava o bilhete — defeito apontado pelo Pedro, crop em `references/diferenciais/detalhe-mao-01.png`) | gpt_image_2 | 4:3 · medium · 2k · 2336×1744 | 3 cr | 2026-07-23 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260723_155429_63f746e5-91c3-4501-b041-a94407abcd25.png |
| eficiencia-master-v2.jpeg | **REPROVADO** — tentativa de correção cirúrgica da mão | nano_banana_pro | 4:3 · 2k · 2400×1792 · ref=eficiencia-master.png · padrão "Change ONLY" | 2 cr | 2026-07-23 | https://d8j0ntlcm91z4.cloudfront.net/user_3CJwBgmLLR9Df0plFps5F9WC5t9/hf_20260723_161617_b2da3c1d-8853-48a2-b9e9-d090ffed2a6b.jpeg |

Pós-morte da v2: o diff mostrou mudança concentrada na região mão/bilhete e cena/rosto
preservados, mas **o grip continuou anatomicamente errado** (dedos atravessando o cartão) —
veredito do Pedro em zoom nativo. Lição (já prevista no playbook §4.2 e reconfirmada): correção
determinística de anatomia fina é trabalho de **Photoshop humano**, não de modelo. Pedro assumiu
a correção manual. Nota técnica: nano_banana_pro devolve dimensões próprias (2400×1792) e JPEG.
**Decisão de modelo (Pedro, 2026-07-23):** estratégia dividida — `gpt_image_2` para imagens com
texto/tela em destaque; `nano_banana_pro` para cenas fotorrealistas sem texto protagonista
(desbloqueado no Plus, 2 cr reais por render — cotação bateu exata, sem inflação de 1,43×).

Decisão do Pedro (2026-07-23): a UI em inglês na tela **fica** — o público-alvo viaja muito e usa
inglês; só o nome do passageiro ("John Smith") destoava e foi trocado no Photoshop. A conversão
WebP da Task 6 usa o `-pt` como fonte.

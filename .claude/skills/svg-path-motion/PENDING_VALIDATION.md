# PENDING_VALIDATION — svg-path-motion

Estado: skill aprovado como **v1**. Duas validações ficaram **pendentes por limitação de ambiente** (não por defeito conhecido do skill). Este arquivo registra o que falta, por que parou, como retomar e o critério objetivo de conclusão de cada uma.

Ambas as pendências são de *ambiente de execução*, não de conteúdo do skill. Nenhuma delas bloqueou o uso do skill em produção (as animações de pin/avião da Carioca Viagens já foram validadas por sonda direta e aprovadas visualmente); elas fecham a cobertura de garantia do skill como artefato reutilizável.

---

## 1. Triggering automatizado — PENDENTE

Mede se a **descrição** do skill (`SKILL.md` frontmatter) dispara o skill nas situações certas e não dispara nas erradas. É o teste do processo do skill-creator para "undertriggering/overtriggering", separado dos evals de qualidade (que já rodaram: happy-path na iteração 1 e o caso ambíguo/degenerado na iteração 2).

### Por que parou — WinError 10038 (Windows)

O runner `run_eval.py` do skill-creator dispara várias instâncias de `claude -p` em paralelo (default `--num-workers 10`). Neste ambiente Windows, isso falhou com **`OSError: [WinError 10038] foi feita uma tentativa de operação em algo que não é um soquete`** — erro de socket na coordenação dos workers paralelos. Consequência: **todas as queries retornaram 0 triggers**, o que é uma medição **inválida**, não um score real de triggering.

Diagnóstico já feito:
- `claude -p` isolado **funciona** neste ambiente (teste de ping retornou `PONG`).
- Rodar com `--num-workers 1` (serial) **também** retornou 0 — então não é só concorrência; é a interação do runner com o modelo de socket do Windows para captura de stream-json.
- Portanto o número de triggering desta sessão **não deve ser reportado como resultado** — é ruído de ambiente.

### Onde estão os casos de triggering

- **`.claude/skills/svg-path-motion/evals/trigger-eval.json`** — 20 queries (cópia durável, dentro do próprio skill). Fonte canônica a partir de agora.
- Havia cópias no workspace efêmero de evals (`svg-path-motion-workspace/trigger-eval.json`, `mini-trigger.json`, `trigger-eval-result.txt`), mas esse workspace vive no scratchpad da sessão e **não é durável** — não depender dele.

### Como retomar e executar

Precisa de um ambiente onde o runner do skill-creator consiga orquestrar `claude -p` (idealmente Linux/WSL/macOS, ou uma versão do runner que contorne o socket do Windows). Comando:

```bash
python <skill-creator>/scripts/run_eval.py \
  --eval-set G:/Pedro/Dev/Clientes/carioca-viagens/.claude/skills/svg-path-motion/evals/trigger-eval.json \
  --skill-path G:/Pedro/Dev/Clientes/carioca-viagens/.claude/skills/svg-path-motion \
  --runs-per-query 3 \
  --num-workers 1
```

Onde `<skill-creator>` é o diretório do plugin (nesta máquina:
`C:/Users/Pedro/.claude/plugins/cache/claude-plugins-official/skill-creator/unknown/skills/skill-creator`).

Notas:
- Comece com `--num-workers 1` para isolar o WinError; suba a concorrência só se o serial passar.
- Se o triggering ficar baixo, o skill-creator tem `scripts/improve_description.py` para otimizar só o campo `description` do frontmatter (não reescreve o corpo do skill).
- Se persistir o `WinError 10038` no Windows, rodar em WSL/Linux ou pular para a otimização manual da descrição — não forçar o runner nativo do Windows em loop.

### Critério objetivo de conclusão

Considerar o triggering **validado** quando, sobre as 20 queries de `trigger-eval.json` com `--runs-per-query 3`:
- as queries **on-topic** (movimento de elemento ao longo de path SVG no scroll, revelação atrás, rotação por tangente) disparam o skill com **trigger-rate ≥ 0,8**; e
- as queries **off-topic** de distração (animações não relacionadas a path, CSS simples, etc.) **não** disparam (trigger-rate ≤ 0,2);
- com a medição feita num ambiente **sem** o `WinError 10038` (ou seja, um número real, não um zero de ambiente).

---

## 2. Sonda geométrica Playwright — PENDENTE (nos evals)

A sonda `scripts/probe_path_motion.py` já foi usada com sucesso **contra a implementação real de produção** (pin/avião da Carioca Viagens: distância ≤ 0,199px, offsets 0). O que ficou pendente é rodá-la **contra os componentes gerados nos evals do skill** — os subagentes de eval **não tinham browser disponível**, então a validação deles foi só geométrica-em-código + transpilação.

### Comando de execução

```bash
python G:/Pedro/Dev/Clientes/carioca-viagens/.claude/skills/svg-path-motion/scripts/probe_path_motion.py \
  <url> [--selector "CSS do container do svg"] [--widths 1440,1200,1024]
```

Requisitos: `pip install playwright && playwright install chrome`. A sonda usa `channel="chrome"`, viewport normal e **rolagem da página** — nunca redimensiona a janela para a altura da página (isso quebraria CSS baseado em `vh`). Servir HTML estático local via `python -m http.server` e apontar a `<url>` para lá (a extensão Chrome não abre `file://`).

### O que a sonda MEDE (automático)

- **Distância nearest-point** do elemento ao ponto mais próximo do path, por largura × posição de scroll — prova que o elemento fica *sobre* a linha. É direção-agnóstica (vale com `t` crescente ou decrescente).
- **Rotação aplicada** e que o `svgOrigin` **não** injetou `xOffset`/`yOffset` de `smoothOrigin` (a regra do Pitfall 1).
- **Erros de console** e **requisições de rede falhas**.
- Um indicador de **avanço monotônico** de `bestT` (com a ressalva abaixo).

### O que a sonda AINDA NÃO mede automaticamente

- A garantia **"nada revelado à frente do elemento"** — a sonda mede distância on-path, não o *endpoint* do reveal. Confirmar visualmente numa cúspide ou adicionar uma asserção de reveal-endpoint.
- **Direção do avanço**: a linha "avanço monotônico" assume `t` crescente; um elemento que viaja rumo a `t=0` faz `bestT` decrescer e a linha dirá "NÃO" mesmo com movimento correto (a distância continua válida).
- **Auto-descoberta do wrapper**: pega o primeiro `<g>` com `transform`; se o artwork tiver seu próprio `<g>` transformado (como no caso ambíguo), passar `--selector` e/ou marcar o wrapper de runtime para mirar sem ambiguidade.
- **Auto-interseção / path que passa perto de si mesmo**: nearest-point pode casar no ramo errado e ler ~0 (falso PASS) — verificar esses pontos visualmente.
- O seletor default de auto-descoberta (`div[aria-hidden] > svg`) é **uma** forma comum, não universal — passar `--selector` para outra marcação.
- Igualdade **reduced-motion** antes/depois de scroll e **cleanup byte-idêntico** do DOM — verificar à parte (ver `references/validation.md`).

### Critério objetivo de conclusão

Considerar a sonda **validada** para um componente quando, montado numa página real e rodada a sonda nas larguras alvo (≥ 1024px):
- **pior nearest-point < 1px** em todas as larguras × posições (o resumo da sonda imprime "PASS <1px");
- **0 erros de console** e **0 requisições falhas**;
- offsets de `smoothOrigin` **= 0** em todas as amostras (quando `autoRotate` ligado);
- e as verificações **não-automáticas** acima (nada à frente, reduced-motion, cleanup) conferidas manualmente conforme `references/validation.md`.

---

## Resumo

| Validação | Estado | Bloqueio | Retomar com |
|---|---|---|---|
| Triggering automatizado | pendente | `WinError 10038` (socket Windows no runner paralelo) | `run_eval.py` em ambiente sem o erro (WSL/Linux) sobre `evals/trigger-eval.json` |
| Sonda Playwright nos evals | pendente | sem browser nos subagentes de eval | `probe_path_motion.py` contra o componente montado (já validada contra produção) |

Nenhuma das duas indica defeito conhecido do skill. São lacunas de *cobertura de verificação*, com critério objetivo de fechamento definido acima.

# PROJECT_ENVIRONMENT.md — Ambiente técnico do projeto

Documento durável do ambiente técnico da apresentação digital **Carioca Viagens**.
Descreve a stack real, as ferramentas de agente (Claude Code, skills, MCP), o ambiente
Higgsfield instalado e as regras de uso. É referência estável — deve ser atualizado
quando a stack ou o ferramental mudarem de fato, não a cada sessão.

Para o estado narrativo do projeto (o que foi feito, aprovado e o que vem a seguir),
ver `HANDOFF.md`. Este documento cobre **ambiente e ferramentas**, não histórico de trabalho.

> Todas as versões abaixo foram lidas de `package.json` e `package-lock.json`
> (`lockfileVersion: 3`) e verificadas nesta máquina. Não há versões inventadas.

---

## 1. Stack da aplicação

A aplicação é um site de marketing em React, empacotado com Vite e estilizado com
Tailwind CSS v4. Não há backend — é um front-end estático publicado na Vercel.

### Runtime local (verificado nesta máquina)

| Ferramenta | Versão |
|---|---|
| Node.js | v24.15.0 |
| npm | 10.9.2 |

### Dependências resolvidas (de `package-lock.json`)

As versões abaixo são as **efetivamente instaladas** (resolvidas no lockfile). O
`package.json` declara faixas com `^`/`~`; o valor real instalado é o desta tabela.

| Pacote | Versão resolvida | Papel |
|---|---|---|
| react | 19.2.7 | Biblioteca de UI |
| react-dom | 19.2.7 | Renderização DOM do React |
| typescript | 6.0.3 | Tipagem estática / build (`tsc -b`) |
| vite | 8.1.4 | Bundler e dev server |
| @vitejs/plugin-react | 6.0.3 | Plugin React para o Vite |
| tailwindcss | 4.3.2 | Framework de CSS utilitário (v4) |
| @tailwindcss/vite | 4.3.2 | Integração Tailwind v4 ↔ Vite |
| shadcn | 4.13.0 | CLI de componentes shadcn/ui |
| @base-ui/react | 1.6.0 | Base de primitivos usada pelos componentes shadcn deste projeto |
| gsap | 3.15.0 | Motion / animação |
| @gsap/react | 2.1.2 | Hook `useGSAP` (cleanup automático) |
| lucide-react | 1.24.0 | Ícones lineares |
| class-variance-authority | 0.7.1 | Variantes de componente (usado pelo `Button`) |
| clsx | 2.1.1 | Composição condicional de classes |
| tailwind-merge | 3.6.0 | Merge de classes Tailwind conflitantes |
| oxlint | 1.73.0 | Linter (`npm run lint`) |
| @types/node | 24.13.3 | Tipos de Node |
| @types/react | 19.2.17 | Tipos de React |
| @types/react-dom | 19.2.3 | Tipos de react-dom |

### Notas de precisão (não assumir defaults do ecossistema)

- **Linter é o `oxlint`, não ESLint.** `npm run lint` executa `oxlint`. Não há
  configuração de ESLint neste projeto.
- **A base do shadcn/ui aqui é `@base-ui/react`, não Radix.** O shadcn foi usado
  apenas como infraestrutura técnica; a estética vem do Design System Carioca, não do
  visual padrão do shadcn. Até o momento só o componente `Button` foi instalado e
  reescrito com os tokens Carioca (ver `HANDOFF.md`, Seção 14).
- **Tailwind v4** (não v3): a integração é via `@tailwindcss/vite`; não há
  `tailwind.config.js` no modelo antigo. Os tokens Carioca vivem em `src/index.css`.

### Scripts npm (de `package.json`)

| Script | Comando | Função |
|---|---|---|
| `dev` | `vite` | Servidor de desenvolvimento |
| `build` | `tsc -b && vite build` | Type-check + build de produção |
| `lint` | `oxlint` | Lint |
| `preview` | `vite preview` | Preview local do build |

### Hospedagem / deploy

- **Vercel** — plataforma de hosting e deploy. O deploy é feito pela **Vercel CLI**
  (ferramenta global, **não** versionada no `package.json` deste projeto).
- Projeto `carioca-viagens` no escopo pessoal do Pedro. Configuração local da Vercel
  (`.vercel/`) está no `.gitignore`. Detalhes do primeiro deploy em `HANDOFF.md`, Seção 14.

---

## 2. Ferramentas e agentes

Este projeto é desenvolvido com apoio de **Claude Code** e de um ecossistema de skills
e MCPs. Os três conceitos são distintos e entram no fluxo em momentos diferentes.

- **Claude Code** — agente de linha de comando (a interface pela qual o trabalho de
  desenvolvimento é conduzido). Lê os arquivos do projeto (`CLAUDE.md`, `HANDOFF.md`,
  `design/design.md`, etc.), edita código, roda comandos e coordena os demais recursos.

- **Skills** — pacotes de instrução/expertise que o agente carrega sob demanda para uma
  tarefa específica (ex.: como aplicar GSAP, como compor um layout de marketing, como
  animar um elemento por um path SVG). Uma skill **não** é um serviço; é conhecimento
  procedimental que orienta o agente. Podem ser **locais ao projeto** (`.claude/skills/`)
  ou **globais** (disponíveis em qualquer projeto).

- **CLI** — executável de terminal de um produto (ex.: `higgsfield`, `vercel`). Faz o
  trabalho real fora do agente (gerar mídia, publicar deploy). É global e reutilizável
  entre projetos.

- **MCP (Model Context Protocol)** — servidor que expõe ferramentas/recursos ao agente
  por um protocolo. O MCP do Higgsfield, por exemplo, permite ao Claude Code invocar
  geração de mídia diretamente, sem sair para o terminal. Um MCP é uma **integração de
  runtime**; uma CLI é um **executável de terminal**. São coisas separadas e podem ter
  autenticações separadas (ver Seções 4 e 6).

**Como entram no fluxo deste projeto:** as skills locais guiam a construção da interface
(marketing-ui, gsap, shadcn, svg-path-motion). A CLI e o MCP do Higgsfield entram apenas
na etapa de **mídia real** (substituir os placeholders de Hero, Diferenciais e cards de
Atendimento), depois de a direção visual estar definida — nunca antes (ver Seção 7).

---

## 3. Skills locais do projeto

Localizadas em `.claude/skills/`. Lista real verificada nesta sessão:

- **`marketing-ui`** — guia a direção visual, landing pages e a apresentação digital.
  Usada em todas as rodadas de layout.
- **`gsap`** — motion/animação. Usada apenas depois de layout e conteúdo aprovados.
- **`shadcn`** — componentes React reutilizáveis, como infraestrutura técnica. A estética
  segue o Design System Carioca, **não** o padrão do shadcn.
- **`svg-path-motion`** — skill local e especializado.

### `svg-path-motion` — registro

- É um **skill local e especializado**, que codifica o padrão de mover um elemento ao
  longo de um path SVG vinculado ao scroll (revelação atrás do elemento, rotação opcional
  por tangente). Nasceu do trabalho de pin/avião deste projeto.
- Está em **v1**.
- Deve ser usado **junto ao skill `gsap`** (não o substitui; especializa-o para o caso de
  movimento por path).
- Possui **validações de infraestrutura pendentes** (triggering automatizado e sonda
  Playwright contra os componentes de eval) — pendências de **ambiente**, não defeitos do
  skill.
- Essas pendências estão documentadas em
  `.claude/skills/svg-path-motion/PENDING_VALIDATION.md`.
- **Não deve ser refinado sem motivo concreto de uso real.** Não reabrir por perfeccionismo.

---

## 4. Higgsfield CLI

CLI global de geração de mídia (imagem/vídeo/áudio/3D). Instalação global no PowerShell:

```powershell
npm.cmd install -g @higgsfield/cli
```

Verificação:

```powershell
higgsfield.cmd --version
```

Autenticação:

```powershell
higgsfield.cmd auth login
```

**Versão validada nesta máquina:** `1.1.13` (confirmada via `higgsfield --version`).

A CLI é **global**: fica disponível para qualquer projeto desta máquina, não só a Carioca
Viagens. Instala-se e autentica-se uma vez; é reaproveitada em vários projetos.

---

## 5. Skills globais do Higgsfield

Instaladas globalmente (fora deste projeto), disponíveis a qualquer projeto do Claude Code.

Instalação:

```powershell
cd $HOME
npx.cmd skills add higgsfield-ai/skills
```

- **Escopo escolhido:** `Global`
- **Método escolhido:** `Symlink`
- **Origem compartilhada:** `~/.agents/skills`

Skills instaladas (verificadas presentes em `~/.agents/skills`):

- `higgsfield-generate`
- `higgsfield-soul-id`
- `higgsfield-websites`

Foram **disponibilizadas ao Claude Code por symlink** a partir de `~/.agents/skills` —
por isso aparecem como skills globais utilizáveis sem cópia por projeto.

### Skills NÃO instaladas nesta etapa

- `higgsfield-marketplace-cards`
- `higgsfield-product-photoshoot`

**Motivo:** receberam avaliação `High Risk` no instalador. Devem ser **revisadas antes**
de qualquer instalação futura — não instalar por conveniência.

---

## 6. MCP do Higgsfield

Integração de runtime que expõe o Higgsfield ao Claude Code. Configuração global:

```powershell
claude mcp add --transport http higgsfield --scope user https://mcp.higgsfield.ai/mcp
```

Autenticação (OAuth):

```powershell
claude mcp login higgsfield
```

Verificação:

```powershell
claude mcp list
claude mcp get higgsfield
```

**Estado validado nesta sessão:** `✔ Connected`
(escopo *User config* — disponível em todos os projetos; tipo `http`;
URL `https://mcp.higgsfield.ai/mcp`).

**A autenticação da CLI e a autenticação do MCP são integrações separadas.** Autenticar a
CLI (`higgsfield auth login`) não autentica o MCP, e vice-versa. Cada uma tem seu próprio
fluxo (a CLI por login próprio; o MCP por OAuth via `claude mcp login`). Se um lado
aparecer desconectado, reautenticar **aquele** lado especificamente.

---

## 7. Regras de uso no projeto

Ao usar Higgsfield (ou qualquer geração de mídia) neste projeto:

- **Definir a direção visual antes de gerar mídia.** Nunca gerar mídia sem direção
  definida.
- Usar Higgsfield para **Hero, Diferenciais e as áreas de mídia dos cards de Atendimento**
  quando essas mídias forem aprovadas (são hoje placeholders com gradiente).
- **Não substituir ou alterar os SVGs originais** (pin, avião, logos, elementos de rota).
  Manipulação de mídia gerada não toca nos assets autorais.
- **Preservar responsividade.**
- **Preservar acessibilidade.**
- **Preservar performance.**
- Quando houver **vídeo**, usar sempre **poster e fallback** (imagem estática) — o vídeo
  nunca pode reduzir a legibilidade do texto.
- **Não fazer commit, push ou deploy sem autorização explícita do Pedro.**
- **Novas animações GSAP** (títulos, subtítulos, cards e demais elementos) só depois da
  integração e revisão das mídias — não antes.

---

## 8. Reinstalação em outra máquina

Sequência curta e verificável para reconstruir o ambiente:

1. **Instalar Node** (Node 24.x, conforme runtime atual). Confirmar: `node --version`.
2. **Instalar Claude Code.** Confirmar: `claude --version`.
3. **Instalar a Higgsfield CLI:** `npm.cmd install -g @higgsfield/cli`.
4. **Autenticar a CLI:** `higgsfield.cmd auth login`. Confirmar: `higgsfield.cmd --version`.
5. **Instalar os skills globais:** `cd $HOME; npx.cmd skills add higgsfield-ai/skills`
   (escopo `Global`, método `Symlink`).
6. **Configurar o MCP:**
   `claude mcp add --transport http higgsfield --scope user https://mcp.higgsfield.ai/mcp`.
7. **Autenticar o MCP:** `claude mcp login higgsfield`. Confirmar: `claude mcp get higgsfield`
   deve mostrar `Connected`.
8. **Clonar o repositório:** `git clone https://github.com/pedroribeiro2706/carioca-viagens`.
9. **Instalar dependências:** `npm install` na raiz do projeto.
10. **Validar lint e build:** `npm run lint` e `npm run build` — ambos devem terminar limpos.

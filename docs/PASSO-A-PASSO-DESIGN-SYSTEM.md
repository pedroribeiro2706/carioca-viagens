# PASSO-A-PASSO-DESIGN-SYSTEM.md

Objetivo: orientar a criação do arquivo `design/design.md` a partir do mockup aprovado da Carioca Viagens e dos documentos do projeto.

Este arquivo é uma instrução de execução, não o Design System final.

O agente deve usar como base:
- `CLAUDE.md`
- `HANDOFF.md`
- `design-brief.md`
- `project-card.md`
- `references/conteudo-apresentacao.md`
- `design/mocks/10-cards-refinamento.html`

O arquivo `design/mocks/10-cards-refinamento.html` é a referência visual e técnica mais atual do projeto.

O resultado esperado é:

- criar `design/design.md`;
- consolidar o Design System final da apresentação digital;
- não implementar React ainda;
- não alterar o mockup HTML;
- não usar GSAP;
- não usar Higgsfield;
- não criar novos mockups.

O `design/design.md` deve ser claro, prático e usável pelo próximo agente como contrato de implementação.

Estruture o documento com as seções abaixo.

---

# 1. Conceito visual final

Documentar a direção aprovada:

- Base principal: Editorial Journey.
- Linguagem complementar: Airport Wayfinding.
- Posicionamento visual: viagem corporativa com atendimento humano.
- A marca deve parecer moderna, visual, profissional, humana e confiável.
- O sistema deve evitar aparência genérica de landing page SaaS, dashboard ou turismo clichê.
- A experiência digital deve ter forte potencial para imagem, vídeo e microanimações futuras.

Explique que:

- Editorial Journey define ritmo, respiro, narrativa, uso de mídia e sofisticação.
- Airport Wayfinding define microtipografia, linhas, chips, labels, metadados, rota e sinalização.
- A logo, a paleta azul/verde e os elementos de rota tornam o sistema proprietário da Carioca.

---

# 2. Paleta oficial e tokens

Use como base os tokens já definidos no mockup HTML mais recente:

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

Documentar o papel de cada token:

- --ink: texto principal escuro e títulos em fundo claro.
- --deep-blue: fundos escuros institucionais, Hero, Operacional e áreas premium.
- --carioca-blue: azul principal da marca.
- --carioca-green: verde principal da marca.
- --light-blue: acento azul claro, micrografismos, linhas e estados em fundo escuro.
- --pale-blue: apoio muito claro para ícones/textos sobre azul.
- --light-green: acento verde claro, detalhes e labels em fundo escuro.
- --dark-green: contraste para textos sobre verde.
- --graphite: texto de corpo em fundo claro.
- --light-graphite: metadados, textos secundários e legendas.
- --off-white: fundo principal claro.
- --sand: fundo quente para seções de atendimento/conteúdo.
- --near-black: card escuro/premium e elementos de alto contraste.
- --hair: linhas finas em fundo claro.
- --hair-light: linhas finas em fundo escuro.

Incluir regra:

- na implementação final, evitar valores HEX hardcoded;
- usar tokens CSS/Tailwind sempre que possível;
- valores de cor hardcoded só devem existir quando forem deliberadamente documentados como novos tokens;
- ao migrar para Tailwind, mapear esses tokens para o tema de forma semântica.

---

# 3. Tipografia

Documentar o sistema tipográfico aprovado:

- Manrope para títulos principais e componentes editoriais.
- Inter para corpo, parágrafos, botões e textos funcionais.
- IBM Plex Mono para microtipografia, labels, metadados, chips, utilidade, wayfinding e detalhes operacionais.
- Fraunces itálico apenas na Hero, em “Sua agência.”.

Incluir regras:

- títulos principais devem ser encorpados, com tracking levemente negativo quando apropriado;
- IBM Plex Mono deve ser usado em caixa alta, com letter-spacing, para criar sensação de sinalização;
- Fraunces não deve ser usada fora da Hero sem aprovação;
- os cards de Atendimento usam títulos em caixa alta, mais leves/elegantes, com peso próximo de 200;
- evitar misturar fontes em excesso;
- a hierarquia deve priorizar clareza e leitura rápida.

---

# 4. Logo

Documentar as regras de uso da logo:

- Em fundo escuro, usar a versão horizontal clara nova:
  references/logo-carioca-viagens-horizontal-lettering-claro-nova.svg
- No rodapé, também usar a versão horizontal clara nova.
- Em fundos claros, usar a versão colorida padrão da logo.
- Nunca usar plaquetas, caixas ou fundos artificiais atrás da logo.
- A logo deve ter presença institucional clara, mas sem dominar a composição.
- Deve haver respiro suficiente ao redor da logo.
- Não distorcer, recolorir ou recriar a logo em código.

Documentar:

- aplicação no header/Hero;
- aplicação no rodapé;
- aplicação eventual em versões PDF.

---

# 5. Layout, grid e ritmo

Documentar:

- layout digital com estrutura de landing/presentation page, não sequência de slides estáticos;
- uso de seções largas, com respiro editorial;
- alternância entre seções escuras e claras:
  Hero escura → Sobre clara → mídia/transição → Diferenciais clara → Atendimento sand → Operacional escura → Clientes clara → Contato escura;
- grid principal desktop com largura máxima aproximada de 1180px para conteúdo;
- áreas wide com largura aproximada de 1440px;
- margens laterais generosas;
- ritmo vertical amplo;
- uso de linhas finas e divisores para estruturar sem pesar.

Documentar também:

- a versão PDF virá depois, derivada deste sistema, em formato editorial 16:9;
- a versão digital é a origem principal do sistema.

---

# 6. Breakpoints e responsividade

Especificar breakpoints recomendados:

- Mobile: até 640px.
- Tablet: 641px a 1024px.
- Desktop: 1025px a 1439px.
- Wide: 1440px+.

Documentar regras responsivas:

- Hero deve manter impacto visual, mas reduzir densidade de metadados no mobile.
- Grid de duas colunas vira uma coluna no mobile.
- Cards de Atendimento viram stack vertical no mobile.
- Seção Operacional deve preservar legibilidade; colunas viram stack.
- Clientes deve usar grid fluido com auto-fit/minmax, não uma grade fixa de 5 colunas.
- Elementos gráficos de apoio podem ser ocultados ou reduzidos no mobile.
- Tipografia deve usar clamp ou escala responsiva.
- CTAs devem continuar fáceis de tocar.
- Ícones e chips devem preservar contraste.

---

# 7. Hero

Documentar o padrão da Hero:

- fundo escuro com overlay azul/verde enquanto a mídia real não entra;
- futura mídia full-bleed: imagem ou vídeo institucional;
- texto sobreposto com alta legibilidade;
- header integrado à Hero;
- utility strip com:
  “Carioca Viagens · Rio de Janeiro, RJ”
  chip “RIO · GIG”
  “Operacional desde 1999 · Corporativo · Lazer · Receptivo”
- logo horizontal clara no header;
- CTA principal “Fale conosco”;
- CTA secundário “Solicite atendimento”;
- chip de localização “Sede — Flamengo, RJ”;
- linha pontilhada reta como divisória estrutural na borda inferior da Hero.

Documentar que:

- o gradiente atual é placeholder temporário;
- a Hero será refinada quando houver imagem/vídeo real;
- sempre prever fallback estático para vídeo;
- manter overlay para contraste;
- evitar hero genérica de SaaS.

---

# 8. Linha pontilhada divisória

Documentar:

- a linha pontilhada reta é um elemento estrutural de transição entre Hero e Sobre;
- ela é diferente dos elementos gráficos de apoio com pin, avião e rotas curvas;
- deve ter presença sutil, mas visível;
- deve funcionar como borda inferior da Hero / borda superior da próxima seção;
- pode ser animada futuramente com GSAP usando stroke-dashoffset ou técnicas equivalentes;
- deve usar Carioca Light Blue ou Carioca Blue conforme o fundo.

---

# 9. Elementos gráficos de apoio: pin, avião e rotas curvas

Documentar:

- são elementos proprietários de apoio visual;
- não são a linha divisória estrutural;
- podem aparecer em seções como Sobre e Atendimento;
- cada elemento deve parecer entrar na composição vindo de fora da tela;
- trajetória tracejada curva começa fora da tela e entra no layout;
- objeto principal fica dentro da tela;
- não devem sobrepor textos, cards, placeholders ou conteúdo principal;
- devem ocupar áreas vazias laterais;
- não precisam aparecer juntos;
- não precisam aparecer em todas as seções;
- usar cores oficiais, preferencialmente Carioca Blue;
- podem ser animados depois com GSAP.

Documentar arquivos de referência:

- references/elements/pin point carioca blue.svg
- references/elements/aviao carioca blue.svg

---

# 10. Seção Sobre

Documentar:

- fundo off-white;
- composição editorial com rail/linha vertical sutil;
- microtítulo em IBM Plex Mono;
- título “Olá, muito prazer”;
- texto oficial de references/conteudo-apresentacao.md;
- chip inline “Carioca Viagens” deve ser mantido como assinatura tipográfica;
- pin/rota pode aparecer como apoio visual lateral;
- manter leitura confortável e sem excesso de decoração.

---

# 11. Blocos de mídia

Documentar:

- blocos de mídia atuais são placeholders;
- gradientes azul/verde são temporários;
- mídia real será adicionada depois, possivelmente com Higgsfield;
- cada bloco de mídia deve ter papel claro:
  Hero, faixa de transição, Diferenciais, cards de Atendimento;
- evitar repetir o mesmo gradiente como solução final em várias seções;
- usar cantos-guia, labels mono e overlays como linguagem de placeholder;
- sempre prever fallback estático.

---

# 12. Seção Diferenciais

Documentar:

- layout em duas colunas no desktop: lista à esquerda, mídia à direita;
- lista com linhas finas;
- ícones semânticos;
- títulos claros;
- painel de mídia com cantos-guia, chip e legenda mono;
- a área de mídia deve receber imagem/vídeo no futuro;
- no mobile, lista e mídia empilham;
- preservar clareza e evitar que o painel pareça caixa vazia.

---

# 13. Cards de Atendimento

Documentar detalhadamente o padrão aprovado no mockup 10:

- componente em duas zonas;
- área superior informativa/editorial;
- área inferior reservada para imagem futura;
- cards quadrados, com aspect-ratio 1/1 no desktop;
- cantos arredondados;
- sombra aplicada no wrapper;
- overflow interno para clipar a mídia;
- variação cromática entre os três:
  azul, verde e near-black;
- microtítulo em IBM Plex Mono;
- título em caixa alta, peso leve/elegante próximo de 200;
- linhas finas horizontais;
- numeração 01/02/03;
- descrição curta;
- seta diagonal;
- ícone semântico;
- cantos-guia na área de mídia.

Conteúdo dos cards:

1. Assistência Emergencial
   - micro: ASSISTÊNCIA · 24H
   - descrição: plantão pronto para resolver imprevistos a qualquer hora.

2. Sistema de Reservas On Line
   - micro: RESERVAS · ONLINE
   - descrição: reserve aéreo e hotel com agilidade e poucos cliques.

3. Melhores Canais de Distribuição
   - micro: REDE · GLOBAL
   - descrição: tarifas das melhores operadoras do mundo.

Importante:

- as descrições são expansões funcionais provisórias derivadas do conteúdo oficial;
- se o texto final precisar ser 100% literal, revisar antes da produção;
- a área inferior dos cards permanece vazia por enquanto porque receberá imagem futura;
- não preencher com decoração apenas para ocupar espaço;
- na implementação React, o componente deve aceitar imagem opcional.

---

# 14. Seção Operacional

Documentar:

- fundo deep-blue;
- microtítulos em IBM Plex Mono;
- labels em verde;
- listas com checkmarks;
- linhas finas;
- chips operacionais:
  Self booking
  Relatórios
  Centro de custo
- organização:
  Corporativo em duas colunas internas, 5 itens + 4 itens;
  Receptivo abaixo, duas colunas internas, 1 item + 1 item;
- seção já considerada madura;
- evitar áreas vazias e colunas desbalanceadas.

---

# 15. Seção Clientes

Documentar:

- fundo off-white;
- título centralizado com eyebrow;
- logos monocromáticas ou tratadas de forma consistente;
- grid deve ser flexível;
- usar auto-fit/minmax na implementação;
- normalizar peso óptico dos logos;
- evitar grade fixa rígida de 5 colunas se o número de clientes mudar;
- placeholders devem ser substituídos por logos reais quando disponíveis.

---

# 16. Rodapé / Contato

Documentar:

- fundo escuro/gradiente institucional;
- título “Vamos conversar”;
- duas colunas:
  coluna esquerda com logo horizontal clara e endereço;
  coluna direita com contato, WhatsApp/telefone e redes sociais;
- usar IBM Plex Mono nos labels;
- usar ícones consistentes;
- manter a logo horizontal clara nova;
- não usar logo vertical;
- preservar boa hierarquia e espaçamento;
- copyright e nota final em linha separadora discreta;
- em produção, remover notas de mockup como “não implementado”.

---

# 17. CTAs, chips e botões

Documentar:

- CTA principal verde sobre fundo escuro;
- CTA secundário outline;
- botões com radius 6px;
- estados de hover e focus-visible;
- chips em IBM Plex Mono;
- chips com borda fina;
- chips on-dark usando light-blue;
- evitar botões genéricos demais;
- CTAs devem permanecer claros e acessíveis.

---

# 18. Ícones

Documentar:

- na implementação React, usar lucide-react como biblioteca principal de ícones;
- no mockup atual ainda há SVGs inline, mas devem ser migrados;
- todos os ícones devem ter stroke consistente;
- cantos arredondados;
- sem preenchimentos desnecessários;
- uso semântico:
  clock/agilidade,
  plane/processos de viagem,
  cards/pagamento,
  gear/operacional,
  headset/suporte,
  handshake/parcerias,
  map-pin/endereço;
- SVGs proprietários ficam restritos a pin, avião e rotas curvas.

---

# 19. Motion principles

Documentar:

- GSAP entra apenas depois de layout, conteúdo e Design System aprovados;
- animações devem apoiar a narrativa de viagem/rota;
- animações recomendadas:
  linha de rota desenhando;
  entrada sutil da Hero;
  hover/press nos cards;
  microinterações em CTAs;
  movimento sutil em mídia;
  animação discreta de pin/avião;
- evitar animar tudo;
- evitar scroll reveal genérico em todas as seções;
- respeitar prefers-reduced-motion;
- usar transform e opacity sempre que possível.

---

# 20. Mídia e Higgsfield

Documentar:

- imagens e vídeos ainda não foram produzidos;
- Higgsfield poderá ser usado em etapa posterior para gerar assets de Hero, faixa de mídia e cards;
- antes de gerar mídia, definir prompts específicos para:
  Hero institucional;
  viagem corporativa;
  aeroporto/mobilidade;
  atendimento humano;
  cidade/chegada;
- evitar imagens turísticas genéricas;
- evitar stock image artificial;
- sempre prever fallback estático;
- mídia deve reforçar profissionalismo, mobilidade e atendimento humano.

---

# 21. Regras anti-AI-slop

Incluir regras claras:

- não usar gradientes como solução final para tudo;
- não usar cards SaaS genéricos;
- não usar blobs aleatórios;
- não usar ícones improvisados;
- não inventar texto comercial fora da fonte oficial sem marcar como provisório;
- não exagerar em sombras, blur, vidro ou efeitos decorativos;
- não transformar a página em dashboard;
- não transformar a marca em turismo genérico;
- manter identidade visual baseada em logo, cores oficiais, rota, wayfinding e atendimento humano;
- revisar contraste, espaçamento e hierarquia antes de implementar.

---

# 22. Pendências para próximas etapas

Listar claramente:

1. Implementar React + TypeScript + Vite + Tailwind.
2. Configurar shadcn, se fizer sentido para componentes base.
3. Migrar ícones para lucide-react.
4. Transformar tokens do design.md em tokens Tailwind/CSS.
5. Substituir placeholders por mídia real.
6. Possivelmente usar Higgsfield para imagens/vídeos.
7. Adicionar GSAP após layout estável.
8. Otimizar responsividade.
9. Revisar acessibilidade.
10. Preparar versão PDF depois da versão digital estável.

---

Ao final, confirme:

- que design/design.md foi criado;
- quais decisões principais foram documentadas;
- se há algum ponto do mockup que deve ser revisado antes de partir para React/Tailwind.

# Brasil em Movimento — Documento de Produto

**Tipo:** Documento de Visão e Especificação de Produto (Product Specification Document)  
**Versão:** 1.0  
**Data:** 14 de junho de 2026  
**Classificação:** Uso interno — Equipe do Projeto

---

## Sumário

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Contexto Acadêmico e Institucional](#2-contexto-acadêmico-e-institucional)
3. [Problema e Oportunidade](#3-problema-e-oportunidade)
4. [Público-Alvo](#4-público-alvo)
5. [Proposta de Valor](#5-proposta-de-valor)
6. [Arquitetura Técnica](#6-arquitetura-técnica)
7. [Design System](#7-design-system)
8. [Funcionalidades Detalhadas](#8-funcionalidades-detalhadas)
9. [Currículo de Ensino](#9-currículo-de-ensino)
10. [Sistema de Gamificação](#10-sistema-de-gamificação)
11. [Sistema de Áudio](#11-sistema-de-áudio)
12. [Configurações e Personalização](#12-configurações-e-personalização)
13. [Identidade Visual e Narrativa](#13-identidade-visual-e-narrativa)
14. [Decisões Técnicas e Justificativas](#14-decisões-técnicas-e-justificativas)
15. [Histórico de Desenvolvimento](#15-histórico-de-desenvolvimento)
16. [Roadmap e Próximos Passos](#16-roadmap-e-próximos-passos)

---

## 1. Visão Geral do Projeto

**Brasil em Movimento** é um aplicativo web mobile-first dedicado ao ensino de danças tradicionais brasileiras — com foco inicial em **Quadrilha Junina** e **Xaxado** — desenvolvido como ferramenta pedagógica que une preservação cultural, promoção da saúde e inovação no design de interfaces.

O aplicativo funciona como uma plataforma educacional gamificada: o usuário escolhe sua função na dança (Cavalheiro, Dama ou Casal), acessa trilhas de aprendizado progressivas em vídeo e avalia seu próprio desempenho ao longo da jornada. O sistema recompensa a evolução com troféus em 3D interativos, criando um ciclo motivacional que estimula a constância na prática.

A plataforma é distribuída como **Progressive Web App (PWA)** — tecnologia que permite instalação direta do navegador no celular, funcionando como um aplicativo nativo sem necessidade de publicação em lojas como App Store ou Google Play, democratizando o acesso e eliminando barreiras de distribuição.

---

## 2. Contexto Acadêmico e Institucional

### 2.1 Vínculo institucional

O Brasil em Movimento é resultado do projeto de extensão universitária intitulado:

> **"Design de Interfaces para Problemas Reais: Extensão Dialógica com Comunidades"**  
> Semestre letivo: 1/2026  
> Instituição: Universidade Federal de Santa Maria (UFSM)

### 2.2 Laboratórios e cursos envolvidos

- **Laboratório de Projeto de Interface** — responsável pelo design de UX/UI, sistema de navegação, design system e desenvolvimento front-end do aplicativo;
- **Laboratório de Audiovisual** — responsável pela produção e edição dos vídeos das aulas de dança, garantindo qualidade cinematográfica e didática ao conteúdo;
- **Curso de Dança da UFSM** — parceiro técnico-pedagógico, fornecendo expertise em dança folclórica brasileira através do professor **Jessé Cruz**, que orienta a estruturação do currículo e valida a autenticidade cultural dos movimentos ensinados.

### 2.3 Equipe do projeto

**Professoras Orientadoras:**
- **Débora Aita Gasparetto** — orientação em Design de Interfaces e UX
- **Danielle Difante Pedrozzo** — orientação em Produção Audiovisual

**Alunos-pesquisadores e desenvolvedores:**
- **Alisson George da Rosa Ferreira** — desenvolvimento front-end, arquitetura do SPA, design system, sistema de gamificação, integração audiovisual, sistema de áudio e animações 3D
- **Rayssa Barcellos Da Silva** — pesquisa e design
- **Eduarda Dal Molin Marodim** — pesquisa e design
- **Vitoria Mello** — pesquisa e design

### 2.4 Parceria comunitária

O aplicativo cumpre papel social concreto através da parceria com a **Escola Municipal de Ensino Fundamental Margarida Lopes**, de Santa Maria/RS, onde é utilizado como ferramenta de ensino de saúde e movimento para estudantes da rede pública, consolidando o caráter de extensão dialógica com a comunidade.

---

## 3. Problema e Oportunidade

### 3.1 O problema

As danças folclóricas brasileiras — especialmente aquelas de origem nordestina como a Quadrilha e o Xaxado — enfrentam desafios crescentes de transmissão cultural:

- **Ruptura intergeracional:** jovens têm acesso cada vez menor a espaços culturais tradicionais onde estas danças eram naturalmente ensinadas;
- **Ausência de suporte digital:** não existe, no mercado, um aplicativo dedicado, pedagogicamente estruturado e culturalmente autêntico para o aprendizado destas danças;
- **Barreira de acesso à atividade física:** atividades culturais-físicas como a dança são frequentemente inacessíveis por razões financeiras, geográficas ou de disponibilidade de horário;
- **Saúde pública:** o sedentarismo é um problema crescente, especialmente entre jovens, e alternativas lúdicas e culturalmente significativas de atividade física são escassas.

### 3.2 A oportunidade

O Brasil em Movimento identifica e atua na interseção de três áreas com grande potencial de impacto:

1. **Preservação cultural digital:** transformar conteúdo tradicional efêmero (transmissão oral e corporal da dança) em patrimônio digital estruturado e acessível;
2. **Educação física inclusiva:** oferecer atividade física através de um canal digital gratuito, acessível por qualquer pessoa com um smartphone;
3. **Inovação pedagógica:** aplicar design centrado no usuário e gamificação para criar uma experiência de aprendizado engajante que compete em qualidade com os melhores apps educacionais do mercado.

---

## 4. Público-Alvo

### 4.1 Perfis primários

**Estudantes (10–25 anos)**
- Principalmente estudantes de escolas públicas em parceria (Escola Margarida Lopes);
- Usuários com acesso a smartphone e internet móvel;
- Motivados por desafios, conquistas e compartilhamento social;
- Familiarizados com interfaces mobile modernas.

**Público adulto interessado em dança e cultura (25–50 anos)**
- Pessoas com interesse em danças folclóricas, frequentemente em contexto de festas juninas;
- Podem ter tido contato prévio com a dança mas sem formação estruturada;
- Valorizam a autenticidade cultural e a progressividade do aprendizado.

### 4.2 Perfis secundários

**Professores e educadores físicos**
- Utilizam o app como ferramenta complementar em aulas;
- Necessitam de conteúdo pedagogicamente confiável e estruturado.

**Grupos de dança amadores**
- Casais ou grupos que pretendem dançar em festas juninas e precisam aprender os passos de forma sistemática.

### 4.3 Persona central

> **Ana Luíza, 16 anos, estudante do ensino médio, Santa Maria/RS**  
> Gosta de dançar mas nunca teve oportunidade de aprender formalmente. Usa o celular para tudo. Descobre o Brasil em Movimento na escola, se interessa pelo design moderno e pela gamificação, começa pela função Casal com uma amiga, e se sente motivada pelos troféus a completar toda a trilha antes do São João.

---

## 5. Proposta de Valor

| Para o usuário | O Brasil em Movimento oferece |
|----------------|-------------------------------|
| Quer aprender a dançar quadrilha | Currículo progressivo em vídeo, por função e nível |
| Quer se motivar a continuar | Sistema de troféus 3D, barra de progresso e card de retomada |
| Quer ouvir música enquanto dança | Trilha sonora de quadrilha integrada + opção Spotify |
| Quer usar em qualquer momento | PWA instalável, sem loja de apps |
| Quer mostrar o progresso | Funcionalidade de compartilhamento nativo |
| É um educador | Conteúdo pedagogicamente validado por especialista em dança |

---

## 6. Arquitetura Técnica

### 6.1 Tipo de aplicação

O Brasil em Movimento é um **Single Page Application (SPA)** construído inteiramente com tecnologias web nativas (Vanilla HTML5, CSS3 e JavaScript ES6+), sem frameworks ou bibliotecas de UI como React, Vue ou Angular. Esta escolha foi intencional: elimina overhead de bundle, maximiza performance em dispositivos de baixo custo e simplifica a manutenção por equipes acadêmicas com variados níveis de experiência em desenvolvimento.

### 6.2 Stack tecnológica

**Front-end:**
- HTML5 semântico
- CSS3 com Custom Properties (variáveis CSS)
- JavaScript ES6+ (módulo único `main.js`)
- Tabler Icons (biblioteca de ícones via CDN)
- Lottie Web (animações JSON via CDN)
- Google Model Viewer (visualização de modelos 3D GLB via CDN)

**Armazenamento:**
- localStorage do navegador (100% client-side, sem back-end)

**Hospedagem:**
- GitHub Pages (subdomínio gratuito, deploy automático via push na branch `main`)

**Formato de distribuição:**
- Progressive Web App (PWA) — instalável via navegador sem app store

### 6.3 Estrutura de arquivos

```
dan-a-main/
├── index.html              # SPA raiz (única página HTML)
├── css/
│   ├── style.css           # Estilos principais
│   └── main.css            # Estilos complementares e overrides
├── js/
│   └── main.js             # Toda a lógica do aplicativo (~2000 linhas)
├── image/
│   ├── Trofeu.glb          # Modelo 3D base dos troféus
│   ├── trofeu.json         # Animação Lottie do desbloqueio de troféu
│   ├── confetti.json       # Animação Lottie de confete (celebração)
│   └── [vídeos .mp4]       # Vídeos das aulas
├── audio/
│   └── quadrilha.mp3       # Música de fundo (fallback local)
├── serve.ps1               # Servidor HTTP local para desenvolvimento
└── [docs .md]              # Documentação do projeto
```

### 6.4 Modelo de dados (localStorage)

Todo o estado persistente do aplicativo é mantido em 5 chaves de *localStorage*:

**`sertao_users`** — Array de objetos de usuário:
```json
[{
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "password": "senha",
  "role": "student",
  "progress": {
    "Casal": [
      { "title": "Marcação Básica", "stars": 4, "difficultyAdequate": true }
    ],
    "Cavalheiro": [],
    "Dama": []
  },
  "achievements": {
    "sharedFirstTime": true
  }
}]
```

**`sertao_user`** — Usuário da sessão ativa (mesmo formato acima).

**`sertao_quality`** — String: `"auto"`, `"1080p"`, `"720p"`, `"480p"`, `"360p"`.

**`brm_audio`** — Objeto de preferências de áudio:
```json
{ "music": true, "sfx": true }
```

**`brm_music_pref`** — String: `"spotify"` | `"default"` | ausente (não escolhido ainda).

### 6.5 Roteamento e navegação

O aplicativo não utiliza a History API nem hash routing. A navegação é gerenciada inteiramente via JavaScript: a função `app.navigate(viewId)` adiciona/remove a classe `.active` das `<section>` correspondentes, simulando a troca de telas. Isso mantém a URL inalterada e simplifica o deploy em ambientes sem suporte a server-side routing.

---

## 7. Design System

### 7.1 Filosofia de design

O Brasil em Movimento adota uma linguagem visual que equilibra **energia festiva junina** com **modernidade e limpeza de interface**. A estética é mobile-first, inspirada em apps de fitness e educação de alto nível de mercado (Duolingo, Nike Training Club), mas com identidade cultural brasileira forte.

### 7.2 Paleta de cores

| Variável CSS | Valor (claro) | Uso principal |
|-------------|--------------|---------------|
| `--primary` | `#fd5e29` | Laranja — cor principal da marca, CTAs, destaques |
| `--secondary` | `#fed02d` | Amarelo — cor de destaque, trofeu dourado, São João |
| `--accent-blue` | `#0470dd` | Azul — trilha Cavalheiro, links e ações secundárias |
| `--accent-maroon` | `#8b1a1a` | Vinho — trilha Casal, elementos de força e tradição |
| `--bg-color` | `#f8f4f0` | Fundo principal (tom creme suave) |
| `--bg-card` | `#ffffff` | Fundo de cards e componentes |
| `--text-main` | `#1a0a00` | Texto principal (quase preto com tom quente) |
| `--text-light` | `#6b5744` | Texto secundário (marrom claro) |
| `--border` | `#e8ddd5` | Bordas e separadores |

**Tema escuro:** todas as variáveis acima possuem contrapartidas em modo escuro (sufixo automático via CSS prefers-color-scheme e classe `.dark` no body), garantindo boa legibilidade em ambientes de pouca luz.

**Sistema de cores temáticas por função (Trilhas):**
- Cavalheiro: azul `#0470dd`
- Dama: amarelo `#fed02d` (texto escuro `#3a1a00`)
- Casal: vinho `#8b1a1a`

### 7.3 Tipografia

- **Fonte principal:** Inter (Google Fonts) — moderna, altamente legível em telas pequenas
- **Escala tipográfica:** implementada via unidades relativas (rem) para respeitar as configurações de acessibilidade do sistema operacional do usuário

### 7.4 Ícones

- **Biblioteca:** Tabler Icons (MIT License) — conjunto de ícones de linha consistentes e modernos
- **Integração:** via CDN, tag `<i class="ti ti-[nome]">`
- **Razão da escolha:** Tabler Icons oferece cobertura de ícones superior para o contexto do app (dança, música, troféus, usuário) com visual mais limpo que alternatives como Font Awesome

### 7.5 Componentes de interface principais

- **Cards de trilha** com gradiente de cor, ícone, barra de progresso e status de desbloqueio
- **Player de vídeo customizado** com controles lado a lado (play/pause, loop, qualidade, dicas, música)
- **Bottom sheet modal** com animação de entrada por baixo (cubic-bezier de entrada natural)
- **Segmented control** (seletor de segmentos) para trilhas e configurações
- **Toast de troféu** com overlay de animação Lottie
- **Galeria de troféus** com viewer 3D interativo
- **Barra de progresso de jornada** com ícones de marcos (cavalo-de-pau, cacto, sol, chama, troféu)
- **Sistema de abas com tema de cor** — o header e controles mudam de cor conforme a função selecionada

### 7.6 Shell mobile

A interface é renderizada dentro de um **phone shell simulado** de 414×896px (iPhone XR/11 ratio), centralizado na janela do browser com sombra e cantos arredondados. Em telas de smartphone reais (≤414px), o shell ocupa toda a tela sem borda. Esta abordagem:

- Garante consistência visual em qualquer resolução de desktop/laptop;
- Facilita testes e demonstrações em computador;
- Evita que o layout "quebre" em telas largas.

---

## 8. Funcionalidades Detalhadas

### 8.1 Landing Page / Onboarding

**View:** `#view-landing`

A primeira tela que o usuário vê ao abrir o app. Apresenta a identidade do Brasil em Movimento com:

- Header com nome do app e tagline emocional;
- Seção "Sobre o projeto" — card laranja que leva à view Sobre;
- Card "Continue onde parou" — apresenta progresso salvo ou, na primeira visita, um convite à ação com texto simplificado ("Marcação Básica", "Comece agora"), levando à tela de Trilhas;
- Cards das danças disponíveis (Quadrilha e Xaxado), com design distinto por dança;
- Seção de troféus — acesso rápido à galeria de conquistas;
- Navegação inferior (bottom nav) com 4 itens: Início, Trilhas, Perfil, (mais).

**Comportamento dinâmico do card de retomada:**
- **Sem login ou sem progresso:** exibe "Marcação Básica" com 0% e botão "Comece agora" → leva à tela Trilhas para escolha de função
- **Com progresso:** exibe a próxima aula não concluída na função mais avançada, com percentual real e número de aulas concluídas → leva direto à tela Trilhas na função correta

### 8.2 Autenticação

**Views:** `#auth-modal` (modal sobreposto)

O sistema de autenticação é voluntário — o usuário pode explorar as trilhas sem login, mas o progresso só é salvo com conta. O modal de autenticação possui duas abas:

**Aba Login:**
- Campos: e-mail e senha
- Botão de submit com validação
- Feedback de erro em caso de credenciais inválidas

**Aba Cadastro:**
- Campos: nome, e-mail e senha
- Validação de e-mail único (sem duplicatas)
- Criação automática de objeto de usuário com progresso vazio

**Contas especiais (ambiente de desenvolvimento):**
- `ana@sertaodanca.com` / `demo123` — conta estudante para demonstração
- `prof@sertaodanca.com` / `admin123` — conta educador

### 8.3 Home (Página Inicial)

**View:** `#view-home`

Tela principal pós-autenticação. Estrutura vertical com scroll:

1. **Header personalizado** com saudação ao usuário logado
2. **Card de retomada** dinâmico (ver Seção 8.1)
3. **Grid de danças** — dois cards principais: Quadrilha (tom laranja/amarelo) e Xaxado (tom marrom/vermelho)
4. **Seção de troféus** — botão de acesso à galeria com contagem de conquistas obtidas
5. **Navegação inferior** com indicador de tab ativa

### 8.4 Trilhas de Aprendizado

**View:** `#view-trilhas`

Tela central do app — onde o usuário escolhe sua função e acessa as aulas. Composta por:

**Seletor de função (abas temáticas):**
- 3 abas: Cavalheiro, Dama, Casal
- Cada aba muda a cor de toda a view via classes CSS (`theme-cavalheiro`, `theme-dama`, `theme-casal`):
  - Cavalheiro → azul `#0470dd`
  - Dama → amarelo `#fed02d` (texto escuro)
  - Casal → vinho `#8b1a1a`
- Transição suave de 0.3s entre temas

**Barra de Jornada (Dino Progress):**
- Linha de progresso horizontal com marcos visuais (ícones Tabler)
- Posições: 0% (cavalo-de-pau), 25% (cacto), 50% (sol), 75% (chama), 100% (troféu)
- Percentual calculado pelo número de aulas avaliadas vs. total de aulas da trilha
- Fill animado (transition 0.5s ease)

**Lista de módulos e aulas:**
- Organizada por passo (1 a 6) e nível (A: Básico, B: Intermediário, C: Avançado)
- Cada card de aula exibe:
  - Código da aula (ex: C-01-A para Cavalheiro, Passo 1, Nível A)
  - Título do passo de dança
  - Status: não iniciado / avaliado (com estrelas) / bloqueado
  - Botão de início / retomada
- Aulas concluídas exibem as estrelas da autoavaliação

### 8.5 Player de Vídeo (Aula)

**View:** `#view-experience`

A tela de aula é o coração da experiência de aprendizado. Implementada como modo de tela cheia sem bottom nav.

**Componentes do player:**

**Área de vídeo:**
- Tag `<video>` nativa com src dinâmico conforme a aula selecionada
- Controle de qualidade (auto, 1080p, 720p, 480p, 360p) via elemento `<source>`
- Pausa automática ao entrar na aula (o vídeo carrega o primeiro frame mas não inicia — usuário posiciona o celular e escolhe música antes de começar)
- Reinício automático em loop quando ativado
- Callback `onended` que atualiza ícone e estado do player

**Painel de controles laterais (sidebar direita):**
- **Play/Pause** (botão principal com ícone ti-player-play/pause-filled)
- **Loop** — ativa repetição infinita do vídeo
- **Qualidade** — abre painel de seleção de qualidade
- **Dicas** — abre painel com dicas do professor
- **Música** — toggle da música de fundo (ti-music / ti-music-off)

**Overlay central:**
- Ícone grande de play/pause visível sobre o vídeo
- Toque em qualquer área do vídeo aciona play/pause

**Header do player:**
- Título da aula
- Botão voltar (⬅) para a tela de Trilhas
- Código da aula (ex: "C-01-A")

**Comportamento de áudio:**
- Ao iniciar o vídeo (play): a música de fundo é silenciada (duck)
- Ao pausar o vídeo: a música de fundo retoma (unduck) — exceto se a preferência for Spotify
- O botão de música no painel lateral reflete o estado real (ligado/desligado)

### 8.6 Avaliação de Autonomia Motora (Feedback pós-aula)

**View:** `#view-fitness`

Exibida automaticamente ao final de cada vídeo de aula. Fluxo em duas etapas:

**Etapa 1 — Autoavaliação (1 a 5):**
Interface visual com 5 opções de botão, cada uma com ícone, label e descrição:
- 1 ⭐ — Apenas assisti (Apenas visualização)
- 2 ⭐ — Tentei seguir (Forte dependência do vídeo)
- 3 ⭐ — Acompanhei (Execução espelhando o vídeo)
- 4 ⭐ — Quase lá (Execução fluida, poucas consultas)
- 5 ⭐ — Dominei! (Execução com autonomia total)

**Etapa 2 — Avaliação de dificuldade:**
Pergunta binária: "A dificuldade foi adequada para você?"
- Sim → progresso salvo normalmente
- Não → progresso salvo, sugestão de revisão ou mudança de nível

**Ao confirmar:**
- Progresso salvo no objeto de usuário (localStorage)
- Animação de confete (Lottie) com efeito sonoro sintetizado (Web Audio API)
- Verificação de troféus desbloqueados (sistema automático)
- Retorno à tela de Trilhas

### 8.7 Detalhes das Danças

**Views:** `#view-quadrilha`, `#view-xaxado`

Telas informativas sobre cada dança, acessíveis pelo card na Home. Conteúdo:

**Quadrilha:**
- Vídeo demonstrativo de apresentação
- História e origem da dança (da corte europeia à tradição nordestina)
- Figuras mencionadas: anavantú, anarriê
- Contexto: Festa de São João, patrimônio cultural
- Botão de acesso às trilhas de Quadrilha

**Xaxado:**
- Vídeo demonstrativo de apresentação
- História: dança masculina criada pelos cangaceiros de Lampião, início do séc. XX
- Características: passos arrastados, sapateados, movimento do chapéu de couro
- Botão de acesso às trilhas de Xaxado (em desenvolvimento)

### 8.8 Perfil do Usuário

**View:** `#view-profile`

Tela de gerenciamento da conta. Estrutura:

- **Header:** nome do usuário, e-mail, avatar gerado por inicial do nome
- **Card de resumo de progresso:** total de aulas concluídas, média de autoavaliação, troféus obtidos
- **Botão "Compartilhar Progresso":** aciona Web Share API com texto pré-definido; desbloqueia troféu "Embaixador Junino" na primeira vez
- **Botão "Histórico":** acesso à tela de histórico de aulas
- **Botão "Meus Troféus":** acesso à galeria de troféus
- **Botão "Configurações":** acesso à tela de configurações
- **Botão "Sair":** encerra a sessão (remove `sertao_user` do localStorage)

### 8.9 Histórico de Aulas

**View:** `#view-history`

Lista cronológica de todas as aulas concluídas pelo usuário, exibindo:
- Título da aula
- Data de conclusão (se disponível)
- Avaliação de autoavaliação (estrelas)
- Função em que foi praticada (Cavalheiro, Dama ou Casal)

### 8.10 Galeria de Troféus

**View:** `#view-trophies`

Vitrine de todas as conquistas disponíveis no app, organizada em grid. Para cada troféu:

- **Visualização 3D interativa** via Google Model Viewer (drag para girar, pinch para zoom)
- **Estado visual:** desbloqueado (modelo iluminado e colorido) vs. bloqueado (modelo escuro com ícone de cadeado)
- **Nome do troféu** e descrição do critério de desbloqueio
- **Barra de progresso** individual mostrando o avanço em direção ao desbloqueio
- **Detalhes da conquista** ao tocar (modal de inspeção 3D expandido)

O mesmo modelo GLB base (`Trofeu.glb`) é usado para todos os troféus, com **colorização dinâmica via JavaScript** dependendo do tipo:
- Bronze (`#cd7f32`) — Calouro do Salão
- Ouro (`#ffd700`) — Rei da Marcação
- Platina (`#e5e4e2`) — Patrimônio Vivo
- Especial (cor da marca) — Embaixador Junino

### 8.11 Seção Sobre

**View:** `#view-sobre` — **NOTA: Esta seção não deve ser modificada sem aprovação dos orientadores.**

Apresentação completa do projeto, incluindo:
- Texto de apresentação do Brasil em Movimento
- Vínculo com o projeto de extensão da UFSM
- Colaboração com o Curso de Dança e a Escola Margarida Lopes
- Equipe de desenvolvimento (professoras e alunos)

### 8.12 Configurações

**View:** `#view-settings`

Painel completo de personalização do app. Organizado em grupos:

**Grupo: Vídeo**
- Toggle "Usar Dados Móveis" (baixar vídeos via 4G/5G)
- Seletor de qualidade padrão de vídeo (Auto / 1080p / 720p / 480p / 360p)

**Grupo: Música**
- Fonte de música: seletor segmentado (Spotify | Música padrão)
- Label mostrando a preferência ativa
- Linha "Abrir playlist agora" (visível apenas quando Spotify está selecionado)
- Botão "Redefinir preferência de música" (limpa a escolha e permite reconfigurar)

**Grupo: Acessibilidade**
- Toggle de tema: Claro / Escuro / Automático (segue preferência do sistema)

**Grupo: Sobre o App**
- Link "Sobre o App" (abre view Sobre)
- Link "Política de Privacidade" (abre view dedicada)
- Link "Termos de Uso" (abre view dedicada)

---

## 9. Currículo de Ensino

### 9.1 Estrutura curricular

O currículo do Brasil em Movimento foi desenvolvido em colaboração com o professor Jessé Cruz (Curso de Dança da UFSM) e organiza o aprendizado em **três dimensões**: Função × Nível × Passo.

### 9.2 Funções (papéis na dança)

| Função | Prefixo | Descrição |
|--------|---------|-----------|
| **Cavalheiro** | C | O papel masculino tradicional na quadrilha |
| **Dama** | D | O papel feminino tradicional na quadrilha |
| **Casal** | CASAL | A visão conjunta do casal dançando |

### 9.3 Níveis de dificuldade

| Nível | ID | Descrição |
|-------|----|-----------|
| **Básico** | A | Introdução à coreografia, ritmo fundamental |
| **Intermediário** | B | Aprimoramento da técnica, variações |
| **Avançado** | C | Domínio completo, sequências encadeadas |

### 9.4 Passos progressivos

| # | Título | Descrição pedagógica |
|---|--------|---------------------|
| 01 | **Marcação Básica** | Introdução ao ritmo, marcação do tempo musical, postura inicial |
| 02 | **Caminhada e Deslocamento** | Movimentos de translação pelo espaço do salão, direcionamento |
| 03 | **Giro Simples** | Noções de eixo corporal, rotação básica |
| 04 | **Abertura e Lateral** | Exploração do espaço lateral, movimentos de abertura |
| 05 | **Giro Complexo** | Variações de giro, dinâmicas de velocidade e direção |
| 06 | **Coreografia** | Encadeamento de todos os passos em sequência coreografada |

### 9.5 Matriz de aulas

Cada combinação Função × Nível × Passo gera uma aula única, identificada por código:
`[Prefixo da Função]-[Número do Passo]-[Letra do Nível]`

Exemplos:
- `C-01-A` = Cavalheiro, Marcação Básica, Nível Básico
- `D-03-B` = Dama, Giro Simples, Nível Intermediário
- `CASAL-06-C` = Casal, Coreografia, Nível Avançado

Total de aulas planejadas: **3 funções × 3 níveis × 6 passos = 54 aulas**

---

## 10. Sistema de Gamificação

### 10.1 Filosofia de gamificação

O sistema de gamificação do Brasil em Movimento foi projetado para:
- Celebrar **marcos progressivos** (não exigir perfeição desde o início)
- Manter o usuário **orientado para o próximo passo** (sempre há uma recompensa acessível)
- Criar **valor emocional** nas conquistas (troféus 3D únicos, animação de desbloqueio)
- Estimular **engajamento social** (compartilhamento de progresso)

### 10.2 Cálculo de pontuação

A pontuação é calculada pela soma das avaliações de autoavaliação (1 a 5 estrelas) de todas as aulas concluídas em cada função:

- **1 aula × 5 estrelas = 5 pontos máximos por aula**
- **Calouro do Salão:** ≥1 ponto (= concluiu pelo menos 1 aula)
- **Rei da Marcação:** ≥45 pontos (= média de 5 estrelas em ~9 aulas)
- **Patrimônio Vivo:** ≥90 pontos (= média de 5 estrelas em ~18 aulas)

### 10.3 Troféus disponíveis

| Troféu | Material | Critério | Escopo |
|--------|----------|----------|--------|
| **Calouro do Salão** | Bronze (`#cd7f32`) | 1ª aula concluída | Por função |
| **Rei da Marcação** | Ouro (`#ffd700`) | 45+ pontos acumulados | Por função |
| **Patrimônio Vivo** | Platina (`#e5e4e2`) | 90+ pontos acumulados | Por função |
| **Embaixador Junino** | Especial | Primeiro compartilhamento | Único |

Potencial máximo de troféus: **3 funções × 3 troféus progressivos + 1 especial = 10 troféus no total**

### 10.4 Fluxo de desbloqueio

1. Usuário conclui uma aula e submete autoavaliação
2. JS verifica instantaneamente se algum troféu foi atingido
3. Se sim: animação Lottie (`trofeu.json`) cobre a tela com efeito dramático
4. Efeito sonoro de fanfarra (Web Audio API sintetizada — 4 notas em progressão G4→C5→E5→G5)
5. Toast com nome do troféu e dois botões: "Ver troféus →" e "Dispensar"
6. Toast fecha automaticamente após 7 segundos

### 10.5 Modelos 3D dos troféus

Os troféus são renderizados como objetos 3D interativos usando Google Model Viewer (WebGL). Os modelos são criados no Blender e exportados no formato `.glb` (binary GLTF). A colorização é aplicada dinamicamente via JavaScript manipulando os materiais do modelo:

- **Troféu 1 — Calouro do Salão:** sandália junina estilizada
- **Troféu 2 — Rei da Marcação:** sanfona (acordeão)
- **Troféu 3 — Patrimônio Vivo:** figura dançante em movimento *(em desenvolvimento)*
- **Troféu 4 — Embaixador Junino:** roseta / emblema festivo *(em desenvolvimento)*

---

## 11. Sistema de Áudio

### 11.1 Arquitetura do AudioSystem

O áudio do Brasil em Movimento é gerenciado por um objeto singleton `AudioSystem` implementado em `main.js`. Este objeto centraliza toda a lógica de música de fundo e efeitos sonoros.

### 11.2 Música de fundo

**Fonte primária:** URL do CDN Pixabay  
`https://cdn.pixabay.com/audio/2025/04/30/20-29-59-304.mp3`  
Faixa: "Passos de Quadrilha - Instrumental de Festa Junina com Sanfona" por RonaldoReyz  
Licença: Pixabay Content License (uso livre, incluindo comercial)

**Fonte de fallback:** arquivo local `audio/quadrilha.mp3` (se o CDN estiver indisponível)

**Comportamento:**
- Volume padrão: 30% (`0.3`)
- Loop infinito
- Preload: `none` (não carrega até primeira interação do usuário)
- Desbloqueio: ativado no primeiro `click` ou `touchend` do usuário (requisito de política de autoplay dos navegadores)

**Integração com o player de vídeo:**
- `duck()`: silencia a música ao iniciar o vídeo
- `unduck()`: retoma a música ao pausar o vídeo (exceto quando preferência é Spotify)

**Controle pelo usuário:**
- Botão de música no painel lateral do player: toggle liga/desliga
- Estado persistido em `brm_audio.music` no localStorage

### 11.3 Efeitos Sonoros (SFX)

Todos os SFX são **sintetizados via Web Audio API** — não requerem arquivos de áudio. Esta escolha elimina dependências externas e garante funcionamento mesmo sem conexão.

**sfxTrophy() — Fanfarra de troféu:**
Sequência de 4 notas em progressão ascendente (G4 → C5 → E5 → G5) seguida de um acorde completo (C5-E5-G5 simultâneos). Tipo de oscilador: sine + triangle com envelope de volume.

**sfxConfetti() — Sparkle de conclusão:**
Sequência de 5 notas ascendentes (C5 → E5 → G5 → C6 → E6) com espaçamento de 120ms. Tipo de oscilador: sine com ataque rápido e decay suave. Evoca sensação de "faísca" ou "brilho".

### 11.4 Integração Spotify (opcional)

O app oferece deep link para playlist curada no Spotify, sem integração de API (sem OAuth, sem SDK, sem Premium obrigatório):

```javascript
const SPOTIFY_PLAYLIST_URL = 'https://open.spotify.com/search/quadrilha%20festa%20junina';
window.open(SPOTIFY_PLAYLIST_URL, '_blank', 'noopener');
```

**Fluxo de onboarding musical:**
1. Usuário inicia sua primeira aula
2. Após 1,2 segundos, um bottom sheet modal pergunta a preferência
3. Opções: "Abrir no Spotify" | "Música padrão do app" | "Decidir depois"
4. A preferência é salva em `brm_music_pref` e respeitada em todas as sessões futuras
5. O usuário pode alterar a preferência a qualquer momento em Configurações → Música
6. O botão "Redefinir preferência de música" em Configurações permite reconfigurá-la do zero

---

## 12. Configurações e Personalização

### 12.1 Tema visual (claro/escuro)

O app suporta três modos:
- **Claro:** paleta com fundos cremes e tons quentes
- **Escuro:** paleta invertida com fundos escuros e textos claros
- **Automático:** segue a preferência de tema do sistema operacional do usuário (`prefers-color-scheme`)

A implementação usa CSS Custom Properties redefinidas por uma classe `.dark` no `<body>`, permitindo transições suaves.

### 12.2 Qualidade de vídeo

O usuário pode definir a qualidade de vídeo padrão. O app suporta múltiplas resoluções via elementos `<source>` alternativos no `<video>`. A preferência é salva em `sertao_quality`.

### 12.3 Preferência de dados móveis

Toggle que registra se o usuário aceita baixar vídeos em conexão 4G/5G. Implementação futura: bloqueio de carregamento de vídeo em conexão não Wi-Fi quando toggle está desativado.

---

## 13. Identidade Visual e Narrativa

### 13.1 Nome e marca

**"Brasil em Movimento"** foi escolhido por capturar simultaneamente:
- **Movimento** como ação física (dança, exercício, corpo em movimento);
- **Movimento** como fenômeno cultural (um Brasil que se move, que celebra suas tradições);
- **Brasil** como âncora de identidade nacional e cultural — o app não é sobre uma dança regional isolada, mas sobre o patrimônio imaterial de todo o país.

### 13.2 Tom de voz

A comunicação do app é:
- **Encorajadora e acolhedora:** nunca punitiva, celebra cada pequeno avanço
- **Cultural e orgulhosa:** referências aos termos da dança (anavantú, figuras juninas) sem tradução — educa enquanto ensina
- **Jovem mas respeitosa:** interface moderna, linguagem acessível, sem ser condescendente com a tradição

### 13.3 Narrativa de gamificação

Os troféus contam uma história de evolução:
1. **Calouro do Salão** — você chegou ao baile pela primeira vez
2. **Rei/Rainha da Marcação** — a marcação no seu sangue, o ritmo te dominou
3. **Patrimônio Vivo** — você não apenas dança, você preserva
4. **Embaixador Junino** — o ritmo transbordou — você levou o Brasil em Movimento para além do celular

---

## 14. Decisões Técnicas e Justificativas

| Decisão | Alternativa considerada | Justificativa |
|---------|------------------------|---------------|
| Vanilla JS sem frameworks | React, Vue, Next.js | Eliminação de overhead de build, simplicidade de manutenção por equipe acadêmica, performance máxima em dispositivos modestos |
| localStorage apenas (sem backend) | Firebase, Supabase | Privacidade total (nenhum dado sai do dispositivo), zero custo de infraestrutura, funcionamento offline |
| GitHub Pages | Vercel, Netlify, servidor próprio | Gratuito, integrado ao repositório do projeto, deploy automático |
| PWA (sem app store) | React Native, Flutter | Distribuição universal sem revisão de loja, atualização imediata, zero custo de publicação |
| Tabler Icons | Material Icons, Font Awesome | Estilo mais limpo e contemporâneo, licença MIT, melhor cobertura de ícones relevantes |
| Web Audio API para SFX | Arquivos .mp3/.ogg | Zero dependências de arquivos externos, funcionamento garantido mesmo offline |
| Spotify deep link | API do Spotify, SDK | Sem OAuth, sem requerimento de Premium, funciona para 100% dos usuários independente do plano |
| model-viewer para troféus 3D | Three.js puro, Babylon.js | API simplificada para GLB/GLTF, zero configuração de câmera/luz, suporte nativo a AR (futuro) |
| Lottie para animações | CSS animations, GIF | Qualidade vetorial (escalável), tamanho de arquivo pequeno, controle programático via JS |
| CSS Custom Properties para temas | SCSS variables, CSS-in-JS | Dinâmico em runtime (sem recompilação), suporte nativo em todos os browsers modernos |

---

## 15. Histórico de Desenvolvimento

Este documento registra as principais decisões e funcionalidades implementadas ao longo do desenvolvimento colaborativo do projeto:

### Fase 1 — Estrutura e Design System
- Definição da arquitetura SPA com roteamento por classes CSS
- Criação do design system (paleta, tipografia, componentes base)
- Implementação da navegação inferior e sistema de views

### Fase 2 — Currículo e Player
- Estruturação do currículo (funções × níveis × passos)
- Implementação do player de vídeo customizado
- Sistema de avaliação de autonomia motora (1–5 estrelas)
- Salvamento de progresso no localStorage

### Fase 3 — Gamificação e Troféus
- Definição dos 4 troféus e critérios de desbloqueio
- Integração do Google Model Viewer para visualização 3D
- Animação Lottie de desbloqueio de troféu
- Toast de conquista com efeito dramático

### Fase 4 — Áudio e Experiência
- Implementação do AudioSystem (música de fundo + SFX Web Audio API)
- Integração da música de quadrilha via CDN Pixabay
- Efeitos sonoros sintetizados (sfxTrophy, sfxConfetti)
- Duck/unduck automático no player de vídeo
- Botão de música no painel do player

### Fase 5 — Integração Spotify e Preferências
- Deep link Spotify sem SDK/OAuth
- Modal de onboarding de preferência musical (bottom sheet)
- Configuração de música nas Settings
- Persistência de preferência em localStorage

### Fase 6 — Refinamentos de UX
- Card de retomada dinâmico com estados (sem progresso / com progresso)
- Sistema de cores temáticas por função (trilhas: azul/amarelo/vinho)
- Posicionamento correto do modal dentro do phone shell (position:absolute)
- Textos e microcopy revisados por feedback do usuário

---

## 16. Roadmap e Próximos Passos

### Prioridade Alta (próximas sprints)

- **Troféu 3 — Patrimônio Vivo:** finalizar modelo 3D no Blender (figura dançante)
- **Troféu 4 — Embaixador Junino:** criar modelo 3D (roseta/emblema) no Blender
- **Vídeos de aulas:** produção e upload de todos os vídeos do currículo (54 aulas)
- **Trilha Xaxado:** habilitar e estruturar o currículo de Xaxado

### Prioridade Média

- **Modo offline (Service Worker):** caching de vídeos para uso sem internet
- **Perfil editável:** permitir alteração de nome, e-mail e avatar
- **Certificado de conclusão:** PDF/imagem compartilhável ao completar uma trilha
- **Notificações push:** lembretes de prática (com consentimento do usuário)

### Prioridade Baixa / Futuro

- **Modo AR:** visualização dos troféus em realidade aumentada (model-viewer suporta AR nativamente)
- **Múltiplas danças:** expansão para outras danças folclóricas brasileiras (Frevo, Forró, Baião)
- **Modo multiplayer/social:** competição ou cooperação entre usuários cadastrados
- **Back-end opcional:** sincronização de progresso entre dispositivos para usuários que desejarem
- **Localização:** suporte a Inglês e Espanhol para disseminação internacional da cultura brasileira
- **Integração com wearables:** contagem de movimentos e feedback de exercício via smartwatch/smartphone

---

*Brasil em Movimento — Documento de Produto v1.0*  
*Laboratório de Projeto de Interface / Laboratório de Audiovisual — Curso de Desenho Industrial, UFSM*  
*Semestre 1/2026 — Projeto de Extensão Universitária*

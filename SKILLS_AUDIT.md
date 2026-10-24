# Auditoria de skills

Ambiente auditado em 23/10/2026. "Usada" significa que as instruções da skill foram lidas e executadas (scripts rodados, regras aplicadas ao código); não basta tê-la aberto.

## Skills instaladas

| Skill | Usada? | Para quê | O que produziu |
| --- | --- | --- | --- |
| **design-taste-frontend** | Sim, núcleo da direção de arte | Direção visual anti-genérica | `draw.mjs` sorteou 3 direções; escolhida *Photographs at uneven sizes* (seed 1403881101, `.taste-skill/direction.json`), com paleta/tipo mantidos da marca. Blueprints seguidos por seção (hero com nome embaixo, título fixo com retratos, lista à direita, faixa de painéis desiguais, fotos reunidas em volta do título, grade escalonada, FAQ com foto alta, contato em faixa). `inspect.mjs` rodou em 1440/768/390: 6 FAIL → corrigidos rodapé cobrindo texto, estouro a 768px, título longo no celular, legenda longa; paleta trocada de creme amarelado para osso. Regras da casa aplicadas: sem eyebrows, sem monospace, sem 01/02/03, sem gradiente decorativo, sem sombra, um formato de botão. Ajustes documentados: título "Quem atende" fixo à esquerda (o blueprint previa retratos passando por baixo do título, o que o próprio inspetor reprova). Pendente: FAIL "few-pictures" até as fotos entrarem. Painel seguiu `references/app-screens.md` (marca de status própria, linha do dia como elemento do studio). |
| **frontend-design** (Anthropic) | Sim | Plano de tokens e revisão contra clichês | Paleta de 6 cores nomeadas a partir das fotos da Amanda, Cormorant Garamond + Manrope, sem palavra destacada em título, sem caixa alta em rótulos. Plano revisado contra o padrão "creme + terracota" (evitado). |
| **impeccable** | Parcial | Modos e piso de qualidade | Landing tratada como *Persuade*, agenda/painel como *Operate*. O lançador `scripts/impeccable` não foi executado (não há PRODUCT.md/DESIGN.md; o próprio fluxo prevê seguir sem ele). |
| **ui-ux-pro-max** | Sim, como checklist | Prioridades de UX | Aplicadas as categorias 1–9 da tabela: contraste e foco, alvos ≥ 44px, WebP/AVIF e espaço reservado, mobile-first, rótulos visíveis e erro junto ao campo, navegação previsível. O buscador Python não foi usado para gerar sistema de design porque a direção já vinha da skill de taste e da marca. |
| **emil-design-eng** | Sim | Decisões de movimento | Curvas próprias (`--ease-out`, `--ease-expo`), `scale(0.97)` no clique, nada nasce de `scale(0)`, entradas escalonadas, transições interrompíveis. |
| **vercel-react-best-practices** | Sim, na auditoria | Performance React | Supabase e Motion fora da landing (import dinâmico); pré-carregamento da agenda no hover/foco (`bundle-preload`); estado derivado em vez de `setState` em efeitos (`rerender-derived-state-no-effect`), listener de scroll passivo, regex içadas (`js-hoist-regexp`), nada impuro na renderização. Lint (oxlint) zerado. |
| **web-design-guidelines** | Sim, na auditoria | Revisão de interface | Regras buscadas do repositório da Vercel. Corrigido: `scroll-margin-top` nas âncoras, `touch-action`, `overscroll-behavior` em menu e galeria, `name`/`spellCheck`/`autocomplete` nos campos, confirmação antes de remover bloqueio/feriado, `translate="no"` na marca, **controle para pausar a troca automática de fotos** (WCAG 2.2.2). Não aplicado: "Title Case" em títulos (regra de inglês; em português usa-se caixa de frase). |
| **find-skills** | Sim, etapa 20 | Descobrir skills que faltam | `npx skills find …` não alcança skills.sh neste ambiente (rede bloqueada; respondeu "nenhuma" para tudo). Seguida a alternativa da própria skill: leaderboard em skills.sh. Encontradas e lidas: **supabase-postgres-best-practices**, **review-animations**, **vercel-composition-patterns** (ver abaixo). |
| built-in-browser | Sim | Pesquisa no Instagram | Bio, destaques e fotos públicas dos dois perfis. |
| file-reading, pdf, docx, xlsx, pptx, docs, morning, google-workspace, import-memory, setup-writing-style, skill-creator, computer-use, chrome-browser, deep-research | Não | — | Não se aplicam a um site React (sem documentos, planilhas ou apresentações; pesquisa feita diretamente). |

## Skills encontradas com find-skills e aplicadas

| Skill | Origem | Aplicação |
| --- | --- | --- |
| supabase-postgres-best-practices | supabase/agent-skills | Índices nas chaves estrangeiras e índice parcial de reservas ativas; `(select auth.uid())` e `(select is_admin())` nas políticas (avaliado uma vez por consulta); `search_path = public, pg_temp` nas funções `security definer`; parâmetro de reagendamento aceito só de admin. Novo teste cobre isso (17 testes de banco). |
| review-animations | emilkowalski/skills | Menu 420→260ms, detalhes 420→240ms, galeria 420→220ms; saída das etapas mais curta que a entrada; hover dos painéis só com mouse fino e sem redução de movimento. |
| vercel-composition-patterns | vercel-labs/agent-skills | Revisado: componentes sem proliferação de props booleanas; nenhum ajuste necessário. |

## Bibliotecas de componentes pedidas no briefing

Ver `docs/BIBLIOTECAS.md`.

## Segunda rodada (conteúdo real e agenda de demonstração)

| Skill | O que foi feito |
| --- | --- |
| design-taste-frontend | Com as 33 fotos reais, `inspect.mjs` foi de 6 FAIL para **0 FAIL** em 1440/768/390. Corrigido nas rodadas: rótulos lidos como "eyebrow" (acordeão de procedimentos refeito), vazios entre seções (espaçamento e entradas presas à rolagem que nunca escondem conteúdo), títulos longos a 768px, rodapé. Crítica visual nas capturas: retrato com texto do story recortado, foto de baixa resolução substituída/recortada, enquadramento do topo no celular. Avisos mantidos com justificativa: sem vídeo (os vídeos do Instagram não podem ser baixados com qualidade), 12 tamanhos de fonte (escala de 5 passos + títulos fluidos), "Quem atende" fixo por 3 telas (é a seção de retratos). |
| vercel-react-best-practices | Página inicial pré-renderizada no build com `hydrateRoot` (`rendering-*`), fontes servidas pelo próprio site com preload, agenda de demonstração carregada sob demanda (`bundle-conditional`). |
| web-design-guidelines | Mapa do Google só carrega quando a pessoa pede (sem cookies de terceiros antes disso); acordeão com `aria-expanded`/`aria-controls`. |
| ui-ux-pro-max | Lighthouse real: celular 93–94 / desktop 100 em performance, 100 em acessibilidade, boas práticas e SEO. |

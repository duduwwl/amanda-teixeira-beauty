# Amanda Teixeira Beauty

Site e agenda online de **Amanda Teixeira**, biomedicina estética em Lavras-MG
([@amandateixeirabeauty_](https://www.instagram.com/amandateixeirabeauty_/) · [@studioamandateixeira](https://www.instagram.com/studioamandateixeira/)).

- **Site:** https://duduwwl.github.io/amanda-teixeira-beauty/
- **Agenda:** `/agendamento` · **Painel:** `/admin` · **Políticas:** `/politica-de-privacidade`, `/termos`

## Arquitetura

| Parte | Tecnologia | Por quê |
| --- | --- | --- |
| Frontend | React 19 + TypeScript + Vite, React Router | SPA estática, ideal para GitHub Pages |
| Estilo | Tailwind CSS v4 + tokens próprios | paleta e tipografia da marca em um lugar |
| Movimento | CSS (transições, scroll-driven animations) + Motion só na agenda | landing leve; transições de etapa com AnimatePresence |
| Banco, login e regras | Supabase (Postgres + Auth + RLS) | GitHub Pages não roda servidor; toda regra de agenda é SQL no banco |
| Hospedagem | GitHub Pages via GitHub Actions | build, testes e publicação a cada push |

Detalhes que importam:

- **Disponibilidade e conflito no servidor.** `available_slots`, `month_availability`, `next_free_slot` e `create_booking` são funções Postgres. Uma restrição de exclusão (`tstzrange … with &&`) impede duas reservas sobrepostas mesmo sob concorrência.
- **Segurança.** RLS em todas as tabelas; o visitante só lê procedimentos ativos e chama as funções públicas. Painel exige login *e* presença na tabela `admins`. Só a chave pública vai para o navegador.
- **Rotas no GitHub Pages.** `public/404.html` guarda o caminho pedido e volta para a raiz; `main.tsx` restaura a rota. `/agendamento` aberto direto funciona.
- **Modo demonstração.** Sem as variáveis do Supabase, a agenda e o painel funcionam com dados fictícios no navegador (`src/services/demoBackend.ts`), com as mesmas regras do banco e um aviso visível. Painel de teste: `demo@amandateixeira.com.br` / `agenda-demo`.
- **Página inicial pré-renderizada.** O build gera o HTML da home (`src/entry-server.tsx` + `scripts/prerender.mjs`); o React só assume a página depois.
- **Peso.** A landing carrega só React + o código da página (~14 kB gzip); Supabase e Motion entram quando a agenda ou o painel abrem.

```
src/
  components/{layout,sections,ui}   cabeçalho, rodapé, seções da landing, Img responsiva
  content/                          textos (site.ts), fotos por seção (media.ts), manifesto de imagens
  features/booking/                 calendário, formulário, sucesso, fluxo em etapas
  features/admin/                   agenda dia/semana/mês, procedimentos, horários, bloqueios, histórico
  services/                         chamadas ao Supabase
  lib/ hooks/ pages/ styles/ types/
supabase/migrations/  supabase/seed.sql
tests/db/            testes da migration em Postgres real (PGlite)
tests/e2e/           Playwright: site, agenda e painel contra um Supabase simulado sobre o mesmo Postgres
scripts/images.mjs   gera AVIF/WebP responsivos de assets-src/
docs/                SUPABASE.md, GUIA-DA-AMANDA.md, BIBLIOTECAS.md
```

## Rodar localmente

```bash
npm install
cp .env.example .env.local   # opcional: URL e chave pública do Supabase
npm run dev
```

## Testes

```bash
npm run test:db    # 17 testes da migration: horários, conflitos, concorrência, RLS, histórico
npm run test:e2e   # 31 testes Playwright em desktop e celular, com Supabase simulado e em modo demonstração
```

## Fotos

As fotos vieram dos perfis públicos da Amanda e do studio. Os originais ficam em `assets-src/<pasta>/<nome>.jpg` (nomes em `src/content/media.ts`); `npm run images` gera AVIF/WebP em 480/960/1600 px.

## Publicação

Push na `main` → GitHub Actions roda lint, tipos, testes de banco e ponta a ponta, faz o build e publica no Pages. Para ligar a agenda real, siga [`docs/SUPABASE.md`](docs/SUPABASE.md).

Fontes de cada informação e o que confirmar com a Amanda: [`PENDENCIAS.md`](PENDENCIAS.md).

## Medições (build final, 23/10/2026)

| | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| Lighthouse celular (4G lento simulado, servidor com gzip como o GitHub Pages) | 95 | 100 | 100 | 100 | 2,7–2,8 s | 0 |
| Lighthouse desktop | 100 | 100 | 100 | 100 | 0,6 s | 0 |

## Identidade visual ("ficha clínica")

Refeita em 24/10/2026 para não repetir a fórmula dos outros sites do portfólio (fundo creme, marrom, serifada elegante, fotos editoriais):

- **Cores:** grafite `#0e1012`, branco frio `#f4f5f5`, aço `#e6e9ea` e um único acento, o vermelho do laser (`#b8251a` no claro, `#ff6b4f` no escuro). Tokens em `src/styles/index.css`.
- **Tipos:** Archivo variável (eixo de largura: títulos expandidos em caixa alta, texto normal) e JetBrains Mono nos rótulos técnicos. Fontes recortadas para latim e servidas pelo próprio site (45 kB + 19 kB).
- **Linguagem:** seções numeradas como uma ficha (01 Método, 02 Quem atende, 03 Índice de procedimentos…), figuras com "Fig.", marcas de corte nas fotos principais, linha de laser que varre o retrato ao abrir, leitura ao vivo do próximo horário livre, procedimentos em tabela-índice, resultados num visor de casos, faixa vermelha com a nota do Google.

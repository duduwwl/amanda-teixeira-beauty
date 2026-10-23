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
- **Sem backend configurado, sem agenda falsa.** Sem as variáveis do Supabase a página de agendamento mostra os procedimentos com WhatsApp.
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
npm run test:db    # 16 testes da migration: horários, conflitos, concorrência, RLS, histórico
npm run test:e2e   # Playwright em desktop e celular (CHROME_PATH=/caminho/do/chrome se preciso)
```

## Fotos

Coloque os originais em `assets-src/<amanda|estudio|procedimentos|resultados|cursos>/<nome>.jpg` com os nomes listados em `src/content/media.ts` e rode `npm run images`. Enquanto uma foto não existe, o site mostra um campo neutro com a legenda.

## Publicação

Push na `main` → GitHub Actions roda lint, tipos, testes de banco e ponta a ponta, faz o build e publica no Pages. Para ligar a agenda real, siga [`docs/SUPABASE.md`](docs/SUPABASE.md).

Pendências que dependem da Amanda: [`PENDENCIAS.md`](PENDENCIAS.md).

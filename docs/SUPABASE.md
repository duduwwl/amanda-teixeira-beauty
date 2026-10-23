# Ligar a agenda ao Supabase

O GitHub Pages só hospeda arquivos estáticos. Banco de dados, login do painel e todas as regras da agenda ficam no **Supabase** (plano gratuito atende). Sem essa ligação o site funciona, mas a página `/agendamento` mostra os procedimentos com botões de WhatsApp e o painel `/admin` avisa que ainda não está conectado — nada de agenda de mentira.

## 1. Criar o projeto

1. Crie uma conta em https://supabase.com e um projeto novo (região **South America (São Paulo)**).
2. Guarde a senha do banco num gerenciador de senhas.

## 2. Criar as tabelas, funções e regras

No painel do projeto, abra **SQL Editor** e rode, nesta ordem, o conteúdo de:

1. `supabase/migrations/20261023000001_init.sql` — tabelas, funções de disponibilidade e reserva, histórico, RLS.
2. `supabase/seed.sql` — procedimentos, horário provisório e feriados nacionais.

(Com a CLI do Supabase: `supabase link --project-ref <ref>` e `supabase db push`, depois rode o seed.)

## 3. Desligar cadastro público e criar a conta da Amanda

1. **Authentication → Sign In / Providers → Email**: desligue *Allow new users to sign up*. Só quem você cadastrar entra.
2. **Authentication → Users → Add user**: crie o usuário com o e-mail da Amanda e uma senha forte (marque *Auto confirm*).
3. Copie o **UID** do usuário criado e rode no SQL Editor:

   ```sql
   insert into public.admins (user_id) values ('UID-COPIADO-AQUI');
   ```

   Só contas presentes em `admins` enxergam reservas e alteram a agenda. Uma conta logada que não esteja ali vê "Sem acesso".
4. **Authentication → URL Configuration**: em *Site URL* coloque `https://duduwwl.github.io/amanda-teixeira-beauty/` e adicione `https://duduwwl.github.io/amanda-teixeira-beauty/admin` em *Redirect URLs* (para o link de "Esqueci a senha").

## 4. Ligar o site

Em **Project Settings → API** copie:

- **Project URL**
- **anon / publishable key** (é pública por design; quem protege os dados é o RLS)

No GitHub: **Settings → Secrets and variables → Actions → aba Variables → New repository variable**:

| Nome | Valor |
| --- | --- |
| `VITE_SUPABASE_URL` | Project URL |
| `VITE_SUPABASE_ANON_KEY` | anon / publishable key |

Depois, em **Actions**, rode de novo o workflow *Testar e publicar no GitHub Pages* (ou faça qualquer commit). O site passa a usar a agenda real.

> **Nunca** coloque a chave `service_role` no GitHub, no `.env` do site ou em qualquer arquivo do frontend. O site não precisa dela.

## 5. Retenção de dados (LGPD)

A função `purge_personal_data(meses)` apaga nome, telefone, e-mail e observações de atendimentos encerrados há mais de N meses (padrão 24), mantendo só o registro anônimo do horário. Para rodar todo mês, ative a extensão **pg_cron** (Database → Extensions) e:

```sql
select cron.schedule('retencao-mensal', '0 4 1 * *', $$ select public.purge_personal_data(24) $$);
```

## O que o banco garante sozinho

- Só são oferecidos horários dentro do expediente, sem feriados, sem bloqueios, com a antecedência mínima e respeitando duração + intervalo de cada procedimento.
- Dois atendimentos simultâneos são impossíveis: a restrição `bookings_no_overlap` (exclusão por intervalo de tempo) recusa a segunda reserva mesmo que duas pessoas cliquem no mesmo instante.
- Dados validados no servidor (nome, WhatsApp, e-mail, aceite da privacidade) e limite de tentativas por telefone.
- Visitante não lê nenhuma reserva nem cliente; só a conta admin lê e altera. Toda mudança fica no histórico (`booking_events`).

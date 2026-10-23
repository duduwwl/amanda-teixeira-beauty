# Pendências externas

O que falta e depende de informação, autorização ou acesso da Amanda. Nada abaixo foi inventado no site: enquanto o dado não existe, a informação simplesmente não aparece.

## Precisa da Amanda

| Item | Onde entra | Situação |
| --- | --- | --- |
| Fotos originais autorizadas (retratos, studio, procedimentos, resultados, cursos) | `assets-src/` → `npm run images` | ver lista em `src/content/media.ts` |
| Autorização por escrito das clientes que aparecem em resultados | galeria | obrigatório antes de publicar fotos de rosto |
| Endereço completo do studio e link do Google Maps | `brand.address`, `brand.mapsUrl` em `src/content/site.ts` | não publicado no Instagram |
| Horário real de atendimento | painel → Horários (e `brand.hoursText`) | seed provisório: seg–sex 9–12 e 13–18, sáb 8–12 |
| Duração e intervalo reais de cada procedimento | painel → Procedimentos | seed provisório |
| Preços (se quiser exibir) | painel → Procedimentos | vazios: "Valor informado na confirmação" |
| Número do WhatsApp com DDD | `brand.whatsappNumber` | hoje usa o link oficial da bio; com o número as mensagens já vão escritas |
| Cursos: nomes, público, conteúdo, datas | `courses` em `src/content/site.ts` | seção mostra só o que é confirmado |
| Depoimentos reais autorizados | `testimonials` | seção oculta enquanto vazia |
| Formas de pagamento e política de cancelamento | FAQ e termos | texto genérico ("informadas na confirmação") |
| Formação/registro profissional a citar (ex.: CRBM) | seção Sobre | só "Biomedicina estética", como na bio |
| Feriados municipais de Lavras | painel → Bloqueios e feriados | nacionais já cadastrados |

## Precisa de acesso

| Item | Situação |
| --- | --- |
| Projeto Supabase | não criado; passo a passo em `docs/SUPABASE.md` |
| Variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no GitHub | depois do Supabase |
| Notificações automáticas (WhatsApp Business API, e-mail) | não implementadas: exigem conta oficial; hoje a confirmação é manual pelo botão do painel |
| Domínio próprio | opcional; build aceita `VITE_BASE=/` |

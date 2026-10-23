# Amanda Teixeira Beauty

Landing page editorial e sistema de agendamento para Amanda Teixeira Beauty.

## Publicação

- `docs/`: versão estática publicada no GitHub Pages.
- `app/`, `components/`, `db/` e `worker/`: aplicação completa com agenda, painel administrativo e persistência D1.
- `.github/workflows/pages.yml`: publicação automática da versão estática.

## Desenvolvimento local

Requer Node.js 22.13 ou superior.

```bash
npm ci
npm run dev
```

A prévia local abre em `http://127.0.0.1:5173`.

## Observação de arquitetura

O GitHub Pages hospeda apenas arquivos estáticos. Por isso, a versão pública usa um formulário que prepara a solicitação e abre o WhatsApp. A agenda com disponibilidade transacional, banco D1 e painel administrativo permanece no código da aplicação completa e requer um ambiente de servidor compatível.

## Conteúdo

Informações como endereço, horários, valores e imagens profissionais devem ser confirmadas pela titular antes de uma campanha pública definitiva.

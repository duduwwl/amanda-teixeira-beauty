# Guia da Amanda: como cuidar da agenda e do site

Endereço do painel: **/admin** no final do link do site (também tem o link "Área da Amanda" no rodapé).
Entre com o e-mail e a senha cadastrados. **Enquanto o site está em modo demonstração**, o acesso de teste aparece na própria tela de entrada (`demo@amandateixeira.com.br` / `agenda-demo`) e o botão "Restaurar demonstração" desfaz as mudanças. Se esquecer a senha, use "Esqueci a senha" na tela de entrada.

## Agenda

- **Dia, Semana, Mês**: muda a visão. No dia aparece a linha das 8h às 20h com cada atendimento e os espaços livres.
- **Anterior / Hoje / Próximo** ou o campo de data levam a outro período.
- **Status**: filtra por Pendente, Confirmado, Concluído, Cancelado ou Não compareceu.

Toda reserva feita pelo site chega como **Pendente** (contorno tracejado). Abra a linha e escolha:

| Botão | Quando usar |
| --- | --- |
| Confirmar | Depois de falar com a cliente. Fica marcada cheia. |
| Concluído | Atendimento realizado. |
| Não compareceu | A cliente não veio. |
| Reagendar | Escolha o novo dia; só aparecem horários livres. |
| Cancelar | Escreva o motivo (só você vê). O horário volta a ficar livre no site. |
| Escrever no WhatsApp | Abre a conversa com a cliente com o resumo da reserva já escrito. Você ainda precisa tocar em enviar. |

## Procedimentos

Edite nome, **duração**, **intervalo depois** (tempo de limpeza/preparo antes do próximo), preço e se exige avaliação.
- Preço em branco: o site mostra "Valor informado na confirmação".
- Desmarcar "Disponível para agendamento online" esconde o procedimento da agenda sem apagar o histórico.

## Horários

- Cada dia pode ter uma ou mais faixas (ex.: 09:00–12:00 e 13:00–18:00 deixa o almoço livre). Dia sem faixa é folga.
- **Antecedência mínima**: quantas horas antes uma cliente ainda pode reservar.
- **Abrir agenda com quantos dias**: até quando o calendário do site mostra datas.
- **Agenda online aberta**: desmarque para pausar novas reservas (férias, por exemplo).

## Bloqueios e feriados

- **Bloqueio**: um dia inteiro ou algumas horas (curso, compromisso). Reservas que já existem não são apagadas; confira a agenda.
- **Feriados**: os nacionais já estão cadastrados. Inclua os de Lavras e recessos.

## Histórico

Mostra cada reserva criada, cada mudança de status e cada reagendamento, com data e hora.

## Fotos e textos do site

Fotos ficam na pasta `assets-src/` do repositório (pastas `amanda`, `estudio`, `procedimentos`, `resultados`, `cursos`). Quem mantém o site troca o arquivo, roda `npm run images` e publica. Textos (bio, cursos, perguntas frequentes, endereço, horário) ficam em `src/content/site.ts`.

# Pendências

Atualizado em 23/10/2026. O site está completo com informações reais tiradas do Instagram da Amanda e do studio e do perfil do studio no Google. A agenda funciona em **modo demonstração**, como pedido.

## O que entrou e de onde veio

| Informação | Fonte |
| --- | --- |
| Endereço (Rua Dr. Álvaro Botelho, Centro, Lavras-MG, 37200-066), horário (ter–sex 9h–19h, sáb 9h–18h), telefone (35) 99886-6819, nota 5,0 e avaliações | Perfil do studio no Google Maps |
| Procedimentos (RegenereHair, RegenereBrows, remoção a laser Spectra, nanopigmentação, design estratégico, brow lamination + lash lifting, henna labial) | Bio, destaques e legendas do Instagram |
| Cursos (Formação Design Estratégico, VIP Design Estratégico, VIP Brow & Lash, Start Makeup) | Legendas do Instagram e avaliação no Google |
| Seis anos de studio, programa de TV Caminhos para o Sucesso, cafezinho, Laser Spectra próprio | Legendas e destaque "Quem somos nós" |
| Fotos (33, já otimizadas em AVIF/WebP) | Posts e destaques públicos dos dois perfis |

Ficou de fora de propósito: equipe antiga do destaque "Quem somos nós" (de 2024, pode ter mudado), maquiagem de noivas (a Amanda encerrou esse ciclo), fotos da família e da filha.

## Para confirmar com a Amanda

| Item | Onde ajustar |
| --- | --- |
| Autorização de uso das fotos (principalmente das clientes nos antes e depois) | trocar em `assets-src/` e rodar `npm run images` |
| Durações e intervalos de cada procedimento (estimados) | `src/services/demoBackend.ts` (demonstração) ou painel /admin (agenda real) |
| Preços, se quiser exibir | painel → Procedimentos |
| Formas de pagamento e política de cancelamento | FAQ em `src/content/site.ts` |
| Datas das próximas turmas dos cursos | `courses` em `src/content/site.ts` |
| Se o (35) 99886-6819 é o WhatsApp que deve receber as mensagens do site | `brand.whatsappNumber` |

## Para ligar a agenda de verdade

A agenda de demonstração guarda tudo no navegador de quem visita e mostra um aviso. Para virar agenda real: criar o projeto Supabase e seguir `docs/SUPABASE.md` (as mesmas regras já estão no banco e testadas). Ao configurar as variáveis no GitHub, o site passa sozinho do modo demonstração para a agenda real.

## Observação sobre a pesquisa

Para ler os destaques foi usada a conta do Instagram logada no navegador (zoryonweb). Ao abrir destaques, o Instagram registra a visualização: o perfil @studioamandateixeira e @amandateixeirabeauty_ podem ver que essa conta viu alguns stories. Nenhuma outra ação foi feita com a conta (sem curtidas, seguidas ou mensagens).

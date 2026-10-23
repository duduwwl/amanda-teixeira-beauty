-- Dados iniciais. NOMES vêm dos perfis públicos @amandateixeirabeauty_ e @studioamandateixeira.
-- DURAÇÕES, INTERVALOS e HORÁRIOS são valores provisórios para a agenda funcionar:
-- a Amanda deve confirmar e ajustar tudo no painel /admin. Preços ficam vazios até ela informar.

insert into public.services (slug, name, category, short_description, description, duration_min, buffer_min, requires_evaluation, notes, sort) values
  ('avaliacao', 'Avaliação individual', 'avaliacao',
   'Conversa e análise antes de qualquer procedimento.',
   'Primeiro encontro para entender o que você procura, avaliar pele, fios ou pigmento existente e indicar o caminho mais seguro.',
   40, 10, false, null, 10),
  ('regenerehair', 'RegenereHair', 'regeneracao',
   'Protocolo de regeneração capilar com exossomos.',
   'Protocolo para couro cabeludo e fios, com avaliação por imagem ampliada antes de começar. O número de sessões é definido na avaliação.',
   60, 15, true, 'Exige avaliação prévia.', 20),
  ('regenerebrows', 'RegenereBrows', 'regeneracao',
   'Regeneração de sobrancelhas com exossomos.',
   'Protocolo em sessões para sobrancelhas com falhas ou afinadas. O acompanhamento é feito sessão a sessão.',
   60, 15, true, 'Exige avaliação prévia.', 30),
  ('remocao-laser', 'Remoção a laser', 'laser',
   'Remoção ou clareamento de micropigmentação e tatuagem.',
   'Sessões para clarear ou remover pigmentos antigos. A quantidade depende da cor, profundidade e tempo do pigmento — isso é avaliado antes.',
   45, 15, true, 'Exige avaliação prévia.', 40),
  ('nanopigmentacao', 'Nanopigmentação de sobrancelhas', 'pigmentacao',
   'Fios desenhados um a um, com acabamento natural.',
   'Técnica de pigmentação fio a fio para preencher e desenhar a sobrancelha respeitando o seu rosto.',
   150, 30, false, 'Retoque combinado no atendimento.', 50),
  ('micropigmentacao-labial', 'Micropigmentação labial', 'pigmentacao',
   'Cor e contorno para lábios mais definidos.',
   'Pigmentação suave para devolver cor e contorno aos lábios. A tonalidade é escolhida com você.',
   150, 30, false, null, 60),
  ('design-sobrancelhas', 'Design de sobrancelhas', 'sobrancelhas',
   'Desenho personalizado para o seu rosto.',
   'Mapeamento e design das sobrancelhas, com ou sem coloração.',
   45, 10, false, null, 70),
  ('lash-brow', 'Lash & brow', 'sobrancelhas',
   'Cuidados para cílios e sobrancelhas.',
   'Tratamentos de cílios e sobrancelhas para valorizar o olhar no dia a dia.',
   60, 10, false, null, 80)
on conflict (slug) do nothing;

-- Horário provisório: seg a sex 09h–12h e 13h–18h; sábado 08h–12h.
insert into public.opening_hours (weekday, start_time, end_time)
select * from (values
  (1, time '09:00', time '12:00'), (1, time '13:00', time '18:00'),
  (2, time '09:00', time '12:00'), (2, time '13:00', time '18:00'),
  (3, time '09:00', time '12:00'), (3, time '13:00', time '18:00'),
  (4, time '09:00', time '12:00'), (4, time '13:00', time '18:00'),
  (5, time '09:00', time '12:00'), (5, time '13:00', time '18:00'),
  (6, time '08:00', time '12:00')
) v(weekday, start_time, end_time)
where not exists (select 1 from public.opening_hours);

-- Feriados nacionais restantes de 2026 e de 2027 (feriados municipais de Lavras: cadastrar no painel).
insert into public.holidays (day, name) values
  ('2026-11-02', 'Finados'), ('2026-11-15', 'Proclamação da República'), ('2026-11-20', 'Consciência Negra'),
  ('2026-12-25', 'Natal'), ('2027-01-01', 'Confraternização Universal'), ('2027-02-08', 'Carnaval'),
  ('2027-02-09', 'Carnaval'), ('2027-03-26', 'Sexta-feira Santa'), ('2027-04-21', 'Tiradentes'),
  ('2027-05-01', 'Dia do Trabalho'), ('2027-05-27', 'Corpus Christi'), ('2027-09-07', 'Independência'),
  ('2027-10-12', 'Nossa Senhora Aparecida'), ('2027-11-02', 'Finados'), ('2027-11-15', 'Proclamação da República'),
  ('2027-11-20', 'Consciência Negra'), ('2027-12-25', 'Natal')
on conflict (day) do nothing;

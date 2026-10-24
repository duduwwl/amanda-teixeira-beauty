-- Dados iniciais. Procedimentos: Instagram @amandateixeirabeauty_ e @studioamandateixeira.
-- Horário: perfil do studio no Google. DURAÇÕES e INTERVALOS são estimativas para a agenda
-- funcionar e podem ser ajustadas no painel /admin. Preços ficam vazios até a Amanda informar.

insert into public.services (slug, name, category, short_description, description, duration_min, buffer_min, requires_evaluation, notes, sort) values
  ('avaliacao', 'Avaliação individual', 'avaliacao', 'Conversa e análise antes do procedimento.', 'Primeiro encontro para entender o que você procura e indicar o caminho mais seguro.', 30, 10, false, null, 10),
  ('design-estrategico', 'Design estratégico', 'sobrancelhas', 'Design de sobrancelhas pelo método da Amanda.', 'Mapeamento que respeita a anatomia e os fios que você já tem.', 45, 10, false, null, 20),
  ('nanopigmentacao', 'Nanopigmentação', 'pigmentacao', 'Fios desenhados um a um.', 'Fios que se misturam aos seus pelos para preencher sem pesar.', 150, 30, false, 'Retoque combinado no atendimento.', 30),
  ('brow-lamination', 'Brow lamination', 'sobrancelhas', 'Fios alinhados e com volume, sem pigmento.', 'Alinhamento das sobrancelhas que preenche e dá volume.', 60, 15, false, null, 40),
  ('lash-lifting', 'Lash lifting', 'cilios', 'Curvatura e cor nos seus próprios cílios.', 'Efeito de rímel com os seus cílios naturais.', 60, 15, false, null, 50),
  ('regenerebrows', 'RegenereBrows', 'regeneracao', 'Regeneração de sobrancelhas com exossomos.', 'Protocolo que estimula folículos viáveis a produzir fios novos.', 60, 15, true, 'Exige avaliação prévia.', 60),
  ('regenerehair', 'RegenereHair', 'regeneracao', 'Regeneração capilar com exossomos.', 'Protocolo individualizado a partir da avaliação do couro cabeludo.', 60, 15, true, 'Exige avaliação prévia.', 70),
  ('remocao-laser', 'Remoção a laser', 'laser', 'Clareamento ou remoção de pigmento com Laser Spectra.', 'Sessões para clarear ou remover micropigmentações antigas.', 45, 15, true, 'Exige avaliação prévia.', 80),
  ('henna-labial', 'Henna labial', 'labios', 'Hidrata os lábios e deixa efeito lip tint.', 'Trata o ressecamento e deixa cor suave por alguns dias.', 40, 10, false, null, 90)
on conflict (slug) do nothing;

-- Horário publicado no Google: terça a sexta 9h–19h, sábado 9h–18h.
insert into public.opening_hours (weekday, start_time, end_time)
select * from (values
  (2, time '09:00', time '19:00'), (3, time '09:00', time '19:00'),
  (4, time '09:00', time '19:00'), (5, time '09:00', time '19:00'),
  (6, time '09:00', time '18:00')
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

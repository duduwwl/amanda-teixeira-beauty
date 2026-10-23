// node --test tests/db
import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { createDb, as } from './harness.mjs'

let db, svc, eval_, monday
const ADMIN = '11111111-1111-1111-1111-111111111111'
const STRANGER = '22222222-2222-2222-2222-222222222222'

const iso = (d) => d.toISOString().slice(0, 10)
function nextWeekday(dow, minDaysAhead = 3) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + minDaysAhead)
  while (d.getUTCDay() !== dow) d.setUTCDate(d.getUTCDate() + 1)
  return iso(d)
}
const slots = async (tx, service, day) =>
  (await tx.query('select starts_at from available_slots($1, $2::date)', [service, day])).rows.map((r) => new Date(r.starts_at).toISOString())

const book = (tx, overrides = {}) => {
  const a = { service: svc, start: null, name: 'Maria Souza', phone: '(35) 99876-5432', email: 'maria@exemplo.com', privacy: true, ...overrides }
  return tx.query('select * from create_booking($1,$2,$3,$4,$5,null,$6,$7,false)', [a.service, a.start, a.name, a.phone, a.email, 'whatsapp', a.privacy])
}

before(async () => {
  db = await createDb()
  await db.query('insert into admins (user_id) values ($1)', [ADMIN])
  svc = (await db.query(`select id from services where slug = 'design-sobrancelhas'`)).rows[0].id // 45 min + 10
  eval_ = (await db.query(`select id from services where slug = 'avaliacao'`)).rows[0].id
  monday = nextWeekday(1)
})

test('horários respeitam expediente, almoço e duração (fuso de São Paulo)', async () => {
  const s = await as(db, 'anon', null, (tx) => slots(tx, svc, monday))
  assert.equal(s[0], `${monday}T12:00:00.000Z`) // 09:00 em São Paulo = 12:00 UTC
  // último início da manhã: 11:00 (11:00 + 45 = 11:45 <= 12:00); 11:30 não cabe
  assert.ok(s.includes(`${monday}T14:00:00.000Z`))
  assert.ok(!s.includes(`${monday}T14:30:00.000Z`))
  assert.ok(s.includes(`${monday}T16:00:00.000Z`)) // 13:00 local
  assert.ok(!s.includes(`${monday}T15:00:00.000Z`)) // 12:00 local = almoço
  assert.equal(s.at(-1), `${monday}T20:00:00.000Z`) // 17:00 local; 17:30 + 45 min passaria das 18:00
})

test('domingo e feriado ficam fechados; passado e além do limite também', async () => {
  await as(db, 'anon', null, async (tx) => {
    assert.equal((await slots(tx, svc, nextWeekday(0))).length, 0)
    assert.equal((await slots(tx, svc, '2026-12-25')).length, 0)
    assert.equal((await slots(tx, svc, '2020-01-06')).length, 0)
    assert.equal((await slots(tx, svc, '2030-01-07')).length, 0)
  })
})

test('reserva válida retorna código e ocupa o horário + intervalo', async () => {
  const start = `${monday}T13:00:00.000Z` // 10:00 local
  const r = await as(db, 'anon', null, (tx) => book(tx, { start }))
  assert.match(r.rows[0].code, /^AT-[A-HJ-NP-Z2-9]{6}$/)
  assert.equal(r.rows[0].status, 'pendente')
  const s = await as(db, 'anon', null, (tx) => slots(tx, svc, monday))
  // 10:00–10:45 + 10 min de intervalo => 09:30 (fim 10:15+10) e 10:30 caem; 11:00 volta
  assert.ok(!s.includes(start))
  assert.ok(!s.includes(`${monday}T12:30:00.000Z`))
  assert.ok(!s.includes(`${monday}T13:30:00.000Z`))
  assert.ok(s.includes(`${monday}T14:00:00.000Z`))
})

test('mesmo horário duas vezes: a segunda é recusada', async () => {
  const start = `${monday}T17:00:00.000Z`
  await as(db, 'anon', null, (tx) => book(tx, { start, phone: '35991110001' }))
  await assert.rejects(as(db, 'anon', null, (tx) => book(tx, { start, phone: '35991110002' })), /horario_indisponivel/)
})

test('a restrição do banco barra sobreposição mesmo inserindo direto', async () => {
  const start = `${monday}T18:00:00.000Z`
  const ins = (code) => db.query(
    `insert into bookings (code, service_id, service_name, duration_min, buffer_min, starts_at, ends_at, blocked_until, customer_name, customer_phone, privacy_accepted_at)
     values ($1, $2, 'x', 45, 10, $3::timestamptz, $3::timestamptz + interval '45 min', $3::timestamptz + interval '55 min', 'A B', '35990000000', now())`, [code, svc, start])
  await ins('AT-TESTE1')
  await assert.rejects(ins('AT-TESTE2'), /bookings_no_overlap/)
})

test('cancelada libera o horário', async () => {
  await db.query(`update bookings set status = 'cancelado' where code = 'AT-TESTE1'`)
  const s = await as(db, 'anon', null, (tx) => slots(tx, svc, monday))
  assert.ok(s.includes(`${monday}T18:00:00.000Z`))
})

test('validação no servidor', async () => {
  const start = `${monday}T19:00:00.000Z`
  for (const [o, err] of [
    [{ name: 'Ana' }, /nome_invalido/],
    [{ phone: '1234' }, /telefone_invalido/],
    [{ email: 'nao-e-email' }, /email_invalido/],
    [{ privacy: false }, /privacidade_obrigatoria/],
    [{ start: `${monday}T19:10:00.000Z` }, /horario_indisponivel/],
  ]) {
    await assert.rejects(as(db, 'anon', null, (tx) => book(tx, { start, phone: '35991112222', ...o })), err)
  }
})

test('limite de tentativas por telefone', async () => {
  const thursday = nextWeekday(4)
  const phone = '35997776666'
  await as(db, 'anon', null, (tx) => book(tx, { phone, start: `${thursday}T12:00:00.000Z` }))
  await as(db, 'anon', null, (tx) => book(tx, { phone, start: `${thursday}T13:00:00.000Z` }))
  await assert.rejects(as(db, 'anon', null, (tx) => book(tx, { phone, start: `${thursday}T14:00:00.000Z` })), /muitas_tentativas/)
})

test('bloqueio manual tira horários', async () => {
  const tuesday = nextWeekday(2)
  await db.query(`insert into blocks (starts_at, ends_at, reason) values ($1, $2, 'curso')`, [`${tuesday}T12:00:00Z`, `${tuesday}T15:00:00Z`])
  const s = await as(db, 'anon', null, (tx) => slots(tx, svc, tuesday))
  assert.equal(s[0], `${tuesday}T16:00:00.000Z`)
})

test('RLS: visitante não lê reservas nem clientes; não grava tabelas', async () => {
  for (const sql of ['select * from bookings', 'select * from customers', 'update services set price_cents = 1', 'select * from booking_events']) {
    await assert.rejects(as(db, 'anon', null, (tx) => tx.query(sql)), /permission denied/)
  }
})

test('RLS: logado sem ser admin não vê nada; admin vê e altera', async () => {
  const n = await as(db, 'authenticated', STRANGER, (tx) => tx.query('select count(*)::int c from bookings'))
  assert.equal(n.rows[0].c, 0)
  await assert.rejects(as(db, 'authenticated', STRANGER, (tx) => tx.query(`select admin_reschedule(gen_random_uuid(), now())`)), /sem_permissao/)
  const all = await as(db, 'authenticated', ADMIN, (tx) => tx.query('select id, code, status from bookings order by starts_at'))
  assert.ok(all.rows.length >= 3)
  const target = all.rows.find((r) => r.status === 'pendente')
  await as(db, 'authenticated', ADMIN, (tx) => tx.query(`update bookings set status = 'confirmado' where id = $1`, [target.id]))
  const ev = await as(db, 'authenticated', ADMIN, (tx) => tx.query('select action, to_status, actor from booking_events where booking_id = $1 order by id', [target.id]))
  assert.deepEqual(ev.rows.map((r) => r.action), ['criado', 'status'])
  assert.equal(ev.rows[1].actor, ADMIN)
})

test('reagendamento pelo admin valida disponibilidade e registra histórico', async () => {
  const b = (await db.query(`select id, starts_at from bookings where status = 'confirmado' limit 1`)).rows[0]
  const wednesday = nextWeekday(3)
  const newStart = `${wednesday}T13:00:00.000Z`
  await as(db, 'authenticated', ADMIN, (tx) => tx.query('select admin_reschedule($1, $2)', [b.id, newStart]))
  await assert.rejects(as(db, 'authenticated', ADMIN, (tx) => tx.query('select admin_reschedule($1, $2)', [b.id, `${wednesday}T13:10:00Z`])), /horario_indisponivel/)
  const ev = (await db.query(`select action from booking_events where booking_id = $1 order by id desc limit 1`, [b.id])).rows[0]
  assert.equal(ev.action, 'reagendado')
})

test('concorrência: dez pedidos simultâneos para o mesmo horário, só um passa', async () => {
  const friday = nextWeekday(5)
  const start = `${friday}T16:00:00.000Z`
  const results = await Promise.allSettled(Array.from({ length: 10 }, (_, i) =>
    as(db, 'anon', null, (tx) => book(tx, { start, phone: `3598800${String(i).padStart(4, '0')}` }))))
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1)
})

test('próximo horário livre e calendário do mês', async () => {
  const n = await as(db, 'anon', null, (tx) => tx.query('select * from next_free_slot()'))
  assert.equal(n.rows.length, 1)
  const m = await as(db, 'anon', null, (tx) => tx.query('select * from month_availability($1, $2::date)', [eval_, monday]))
  assert.ok(m.rows.length >= 28)
  assert.ok(m.rows.find((r) => iso(new Date(r.day)) === monday).free_slots > 0)
})

test('visitante lê procedimentos ativos e não vê os ocultos', async () => {
  await db.query(`update services set active = false where slug = 'lash-brow'`)
  const r = await as(db, 'anon', null, (tx) => tx.query('select slug from services order by sort'))
  assert.ok(r.rows.length >= 6)
  assert.ok(!r.rows.some((x) => x.slug === 'lash-brow'))
  const adm = await as(db, 'authenticated', ADMIN, (tx) => tx.query(`select slug from services where slug = 'lash-brow'`))
  assert.equal(adm.rows.length, 1)
  await db.query(`update services set active = true where slug = 'lash-brow'`)
})

test('grade de horários é trocada de forma atômica só pelo admin', async () => {
  await assert.rejects(as(db, 'authenticated', STRANGER, (tx) => tx.query(`select admin_replace_hours('[]'::jsonb)`)), /sem_permissao/)
  const before = (await db.query('select count(*)::int c from opening_hours')).rows[0].c
  await assert.rejects(as(db, 'authenticated', ADMIN, (tx) => tx.query(`select admin_replace_hours('[{"weekday":1,"start_time":"10:00","end_time":"09:00"}]'::jsonb)`)), /check/)
  assert.equal((await db.query('select count(*)::int c from opening_hours')).rows[0].c, before)
})

test('visitante não consegue "esconder" uma reserva para ver o horário como livre', async () => {
  const b = (await db.query(`select id, service_id, starts_at from bookings where status in ('pendente','confirmado') order by starts_at limit 1`)).rows[0]
  const day = new Date(new Date(b.starts_at).getTime() - 3 * 3600e3).toISOString().slice(0, 10)
  const anon = await as(db, 'anon', null, (tx) => tx.query('select starts_at from available_slots($1, $2::date, $3)', [b.service_id, day, b.id]))
  assert.ok(!anon.rows.some((r) => new Date(r.starts_at).getTime() === new Date(b.starts_at).getTime()))
  const adm = await as(db, 'authenticated', ADMIN, (tx) => tx.query('select starts_at from available_slots($1, $2::date, $3)', [b.service_id, day, b.id]))
  assert.ok(adm.rows.some((r) => new Date(r.starts_at).getTime() === new Date(b.starts_at).getTime()))
})

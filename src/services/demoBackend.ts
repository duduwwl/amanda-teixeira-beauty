// Agenda de DEMONSTRAÇÃO: roda inteira no navegador, sem servidor.
// Reproduz as mesmas regras da agenda real (supabase/migrations): expediente, intervalo entre
// atendimentos, antecedência mínima, feriados, bloqueios e proibição de horários sobrepostos.
// Os dados ficam no localStorage de quem está visitando; reservas feitas aqui não chegam à Amanda.
import type { Block, Booking, BookingEvent, BookingResult, BookingStatus, Holiday, OpeningHour, Service, Settings, Slot } from '../types/booking'

const KEY = 'atb-demo-v2'
const DAY_MS = 86_400_000
export const DEMO_ADMIN = { email: 'demo@amandateixeira.com.br', password: 'agenda-demo' }

type Row = Booking & { buffer_min: number; blocked_until: string }
type DB = {
  services: Service[]
  hours: OpeningHour[]
  settings: Settings
  holidays: Holiday[]
  blocks: Block[]
  bookings: Row[]
  events: BookingEvent[]
  seq: number
}

// ---------- tempo (São Paulo, UTC-3 fixo desde 2019) ----------
const spDate = (ymd: string, hhmm: string) => new Date(`${ymd}T${hhmm}:00-03:00`)
const ymdSP = (d: Date) => new Date(d.getTime() - 3 * 3600_000).toISOString().slice(0, 10)
const addDays = (ymd: string, n: number) => ymdSP(new Date(spDate(ymd, '12:00').getTime() + n * DAY_MS))
const weekday = (ymd: string) => spDate(ymd, '12:00').getUTCDay()
const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5))
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

// ---------- dados iniciais ----------
const SERVICES: Omit<Service, 'id'>[] = [
  { slug: 'avaliacao', name: 'Avaliação individual', category: 'avaliacao', short_description: 'Conversa e análise antes do procedimento.', description: '', duration_min: 30, buffer_min: 10, price_cents: null, price_note: null, requires_evaluation: false, notes: null, active: true, sort: 10 },
  { slug: 'design-estrategico', name: 'Design estratégico', category: 'sobrancelhas', short_description: 'Design de sobrancelhas pelo método da Amanda.', description: '', duration_min: 45, buffer_min: 10, price_cents: null, price_note: null, requires_evaluation: false, notes: null, active: true, sort: 20 },
  { slug: 'nanopigmentacao', name: 'Nanopigmentação', category: 'pigmentacao', short_description: 'Fios desenhados um a um.', description: '', duration_min: 150, buffer_min: 30, price_cents: null, price_note: null, requires_evaluation: false, notes: 'Retoque combinado no atendimento.', active: true, sort: 30 },
  { slug: 'brow-lamination', name: 'Brow lamination', category: 'sobrancelhas', short_description: 'Fios alinhados e com volume, sem pigmento.', description: '', duration_min: 60, buffer_min: 15, price_cents: null, price_note: null, requires_evaluation: false, notes: null, active: true, sort: 40 },
  { slug: 'lash-lifting', name: 'Lash lifting', category: 'cilios', short_description: 'Curvatura e cor nos seus próprios cílios.', description: '', duration_min: 60, buffer_min: 15, price_cents: null, price_note: null, requires_evaluation: false, notes: null, active: true, sort: 50 },
  { slug: 'regenerebrows', name: 'RegenereBrows', category: 'regeneracao', short_description: 'Regeneração de sobrancelhas com exossomos.', description: '', duration_min: 60, buffer_min: 15, price_cents: null, price_note: null, requires_evaluation: true, notes: 'Exige avaliação prévia.', active: true, sort: 60 },
  { slug: 'regenerehair', name: 'RegenereHair', category: 'regeneracao', short_description: 'Regeneração capilar com exossomos.', description: '', duration_min: 60, buffer_min: 15, price_cents: null, price_note: null, requires_evaluation: true, notes: 'Exige avaliação prévia.', active: true, sort: 70 },
  { slug: 'remocao-laser', name: 'Remoção a laser', category: 'laser', short_description: 'Clareamento ou remoção de pigmento com Laser Spectra.', description: '', duration_min: 45, buffer_min: 15, price_cents: null, price_note: null, requires_evaluation: true, notes: 'Exige avaliação prévia.', active: true, sort: 80 },
  { slug: 'henna-labial', name: 'Henna labial', category: 'labios', short_description: 'Hidrata os lábios e deixa efeito lip tint.', description: '', duration_min: 40, buffer_min: 10, price_cents: null, price_note: null, requires_evaluation: false, notes: null, active: true, sort: 90 },
]

// Horário publicado no Google: ter a sex 9h–19h, sáb 9h–18h (domingo e segunda fechado)
const HOURS: [number, string, string][] = [[2, '09:00', '19:00'], [3, '09:00', '19:00'], [4, '09:00', '19:00'], [5, '09:00', '19:00'], [6, '09:00', '18:00']]

const HOLIDAYS: Holiday[] = [
  ['2026-11-02', 'Finados'], ['2026-11-15', 'Proclamação da República'], ['2026-11-20', 'Consciência Negra'], ['2026-12-25', 'Natal'],
  ['2027-01-01', 'Confraternização Universal'], ['2027-02-08', 'Carnaval'], ['2027-02-09', 'Carnaval'], ['2027-03-26', 'Sexta-feira Santa'],
  ['2027-04-21', 'Tiradentes'], ['2027-05-01', 'Dia do Trabalho'],
].map(([day, name]) => ({ day, name }))

// nomes inventados para a agenda de exemplo
const FAKE = ['Ana Clara Rezende', 'Beatriz Fonseca', 'Camila Duarte', 'Daniela Prado', 'Eduarda Lacerda', 'Fernanda Rocha', 'Gabriela Vilela', 'Helena Moraes', 'Isabela Teixeira', 'Júlia Andrade', 'Larissa Campos', 'Mariana Siqueira', 'Natália Barros', 'Paula Guimarães', 'Rafaela Couto', 'Sofia Mendes', 'Thaís Ribeiro', 'Vitória Lemos', 'Carlos Henrique Alves', 'Pedro Rezende']

function rng(seed: number) {
  return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 32 }
}

function seed(): DB {
  const services = SERVICES.map((s, i) => ({ ...s, id: `svc-${i + 1}` }))
  const db: DB = {
    services,
    hours: HOURS.map(([weekday, start_time, end_time], i) => ({ id: i + 1, weekday, start_time, end_time })),
    settings: { slot_step_min: 30, min_notice_hours: 12, max_days_ahead: 60, booking_enabled: true },
    holidays: HOLIDAYS,
    blocks: [],
    bookings: [],
    events: [],
    seq: 1,
  }
  // Reservas fictícias: ocupa parte da agenda dos próximos 30 dias (e alguns dias passados, já concluídos).
  const r = rng(20261023)
  const today = ymdSP(new Date())
  for (let d = -6; d <= 30; d++) {
    const day = addDays(today, d)
    const wd = weekday(day)
    const ranges = db.hours.filter((h) => h.weekday === wd)
    if (!ranges.length || db.holidays.some((h) => h.day === day)) continue
    for (const h of ranges) {
      let t = toMin(h.start_time)
      while (t < toMin(h.end_time)) {
        const s = services[Math.floor(r() * services.length)]
        if (t + s.duration_min > toMin(h.end_time)) break
        if (r() < (d < 0 ? 0.7 : d < 10 ? 0.55 : 0.3)) {
          const start = spDate(day, hhmm(t))
          const name = FAKE[Math.floor(r() * FAKE.length)]
          const status: BookingStatus = d < 0 ? (r() < 0.9 ? 'concluido' : 'nao_compareceu') : d < 4 ? 'confirmado' : r() < 0.6 ? 'confirmado' : 'pendente'
          insert(db, s, start, { name, phone: `359${String(Math.floor(r() * 1e8)).padStart(8, '0')}`, email: null, notes: null, contact: 'whatsapp', marketing: r() < 0.3 }, status, false)
          t += s.duration_min + s.buffer_min
          t = Math.ceil(t / 30) * 30
        } else t += 30
      }
    }
  }
  // um bloqueio de exemplo
  const blockDay = addDays(today, 9)
  db.blocks.push({ id: 'blk-1', starts_at: spDate(blockDay, '13:00').toISOString(), ends_at: spDate(blockDay, '17:00').toISOString(), reason: 'Turma de curso (exemplo)' })
  return db
}

// ---------- persistência ----------
let memory: DB | null = null
function load(): DB {
  if (memory) return memory
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return (memory = JSON.parse(raw) as DB)
  } catch { /* navegação privada */ }
  memory = seed()
  save()
  return memory
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(memory)) } catch { /* sem armazenamento: fica só na memória */ }
}
export function resetDemo() {
  memory = seed()
  save()
}

const wait = (ms = 220) => new Promise((r) => setTimeout(r, ms + Math.random() * 160))
const fail = (key: string): never => { throw new Error(key) }

function code(db: DB) {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  for (;;) {
    let c = 'AT-'
    for (let i = 0; i < 6; i++) c += a[Math.floor(Math.random() * a.length)]
    if (!db.bookings.some((b) => b.code === c)) return c
  }
}

function insert(db: DB, s: Service, start: Date, c: { name: string; phone: string; email: string | null; notes: string | null; contact: string; marketing: boolean }, status: BookingStatus = 'pendente', log = true) {
  const end = new Date(start.getTime() + s.duration_min * 60_000)
  const row: Row = {
    id: `bk-${db.seq++}`, code: code(db), service_id: s.id, service_name: s.name, duration_min: s.duration_min, buffer_min: s.buffer_min,
    starts_at: start.toISOString(), ends_at: end.toISOString(), blocked_until: new Date(end.getTime() + s.buffer_min * 60_000).toISOString(),
    customer_name: c.name, customer_phone: c.phone, customer_email: c.email, notes: c.notes, contact_preference: c.contact,
    marketing_opt_in: c.marketing, status, cancel_reason: null, created_at: new Date().toISOString(),
  }
  db.bookings.push(row)
  if (log) event(db, row.id, 'criado', null, status, { starts_at: row.starts_at })
  return row
}

function event(db: DB, booking_id: string, action: string, from: BookingStatus | null, to: BookingStatus | null, details: Record<string, unknown>) {
  db.events.unshift({ id: db.seq++, booking_id, action, from_status: from, to_status: to, details, created_at: new Date().toISOString() })
  db.events = db.events.slice(0, 300)
}

const overlaps = (a0: number, a1: number, b0: number, b1: number) => a0 < b1 && b0 < a1

function slots(db: DB, serviceId: string, day: string, ignore?: string): Slot[] {
  const cfg = db.settings
  const s = db.services.find((x) => x.id === serviceId && x.active)
  if (!cfg.booking_enabled || !s) return []
  const today = ymdSP(new Date())
  if (day < today || day > addDays(today, cfg.max_days_ahead)) return []
  if (db.holidays.some((h) => h.day === day)) return []
  const minStart = Date.now() + cfg.min_notice_hours * 3600_000
  const active = db.bookings.filter((b) => (b.status === 'pendente' || b.status === 'confirmado') && b.id !== ignore)
  const out: Slot[] = []
  for (const h of db.hours.filter((x) => x.weekday === weekday(day)).sort((a, b) => a.start_time.localeCompare(b.start_time))) {
    for (let t = toMin(h.start_time); t + s.duration_min <= toMin(h.end_time); t += cfg.slot_step_min) {
      const st = spDate(day, hhmm(t)).getTime()
      const en = st + s.duration_min * 60_000
      const bl = en + s.buffer_min * 60_000
      if (st < minStart) continue
      if (active.some((b) => overlaps(st, bl, Date.parse(b.starts_at), Date.parse(b.blocked_until)))) continue
      if (db.blocks.some((k) => overlaps(st, en, Date.parse(k.starts_at), Date.parse(k.ends_at)))) continue
      out.push({ starts_at: new Date(st).toISOString(), ends_at: new Date(en).toISOString() })
    }
  }
  return out
}

// ---------- API pública (mesma forma das funções do Supabase) ----------
export async function listServices() { await wait(); return load().services.filter((s) => s.active).sort((a, b) => a.sort - b.sort) }

export async function monthAvailability(serviceId: string, monthYmd: string) {
  await wait()
  const db = load()
  const [y, m] = monthYmd.split('-').map(Number)
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate()
  const map = new Map<string, number>()
  for (let d = 1; d <= days; d++) {
    const ymd = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    map.set(ymd, slots(db, serviceId, ymd).length)
  }
  return map
}

export async function daySlots(serviceId: string, day: string, ignore?: string) { await wait(); return slots(load(), serviceId, day, ignore) }

export async function nextFreeSlot() {
  const db = load()
  const today = ymdSP(new Date())
  for (let i = 0; i <= 30; i++) {
    for (const s of [...db.services].filter((x) => x.active).sort((a, b) => a.duration_min - b.duration_min)) {
      const r = slots(db, s.id, addDays(today, i))
      if (r.length) return { starts_at: r[0].starts_at, service_name: s.name }
    }
  }
  return null
}

export async function createBooking(p: { serviceId: string; startsAt: string; name: string; phone: string; email?: string; notes?: string; contactPreference: string; privacyAccepted: boolean; marketingOptIn: boolean }): Promise<BookingResult> {
  await wait(500)
  const db = load()
  const name = p.name.trim().replace(/\s+/g, ' ')
  if (name.length < 3 || !name.includes(' ')) fail('nome_invalido')
  let phone = p.phone.replace(/\D/g, '')
  if (/^55\d{10,11}$/.test(phone)) phone = phone.slice(2)
  if (!/^[1-9]{2}9?\d{8}$/.test(phone)) fail('telefone_invalido')
  const email = p.email?.trim().toLowerCase() || null
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) fail('email_invalido')
  if (!p.privacyAccepted) fail('privacidade_obrigatoria')
  const s = db.services.find((x) => x.id === p.serviceId && x.active) ?? fail('procedimento_invalido')
  const mine = db.bookings.filter((b) => b.customer_phone === phone)
  if (mine.filter((b) => (b.status === 'pendente' || b.status === 'confirmado') && Date.parse(b.starts_at) > Date.now()).length >= 3) fail('limite_reservas')
  if (mine.filter((b) => Date.now() - Date.parse(b.created_at) < 10 * 60_000).length >= 2) fail('muitas_tentativas')
  const day = ymdSP(new Date(p.startsAt))
  if (!slots(db, s.id, day).some((x) => x.starts_at === new Date(p.startsAt).toISOString())) fail('horario_indisponivel')
  const row = insert(db, s, new Date(p.startsAt), { name, phone, email, notes: p.notes?.trim() || null, contact: p.contactPreference, marketing: p.marketingOptIn })
  save()
  return { code: row.code, starts_at: row.starts_at, ends_at: row.ends_at, service_name: row.service_name, status: row.status }
}

// ---------- painel (demonstração) ----------
const SESSION = 'atb-demo-admin'
export const demoAuth = {
  session: async () => { try { return sessionStorage.getItem(SESSION) ? { user: { email: DEMO_ADMIN.email } } : null } catch { return null } },
  signIn: async (email: string, password: string) => {
    await wait(400)
    if (email.trim().toLowerCase() !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password) throw new Error('E-mail ou senha incorretos.')
    try { sessionStorage.setItem(SESSION, '1') } catch { /* ok */ }
    listeners.forEach((l) => l())
  },
  signOut: async () => { try { sessionStorage.removeItem(SESSION) } catch { /* ok */ } listeners.forEach((l) => l()) },
  isAdmin: async () => true,
}
const listeners = new Set<() => void>()
export const onDemoAuth = (cb: () => void) => { listeners.add(cb); return { unsubscribe: () => listeners.delete(cb) } }

export async function bookingsBetween(from: string, to: string) {
  await wait()
  const a = Date.parse(from), b = Date.parse(to)
  return load().bookings.filter((x) => Date.parse(x.starts_at) >= a && Date.parse(x.starts_at) < b).sort((x, y) => x.starts_at.localeCompare(y.starts_at)) as Booking[]
}
export async function setStatus(id: string, status: BookingStatus, reason?: string) {
  await wait()
  const db = load()
  const b = db.bookings.find((x) => x.id === id) ?? fail('reserva_inexistente')
  if (status === 'pendente' || status === 'confirmado') {
    const clash = db.bookings.some((o) => o.id !== id && (o.status === 'pendente' || o.status === 'confirmado') && overlaps(Date.parse(b.starts_at), Date.parse(b.blocked_until), Date.parse(o.starts_at), Date.parse(o.blocked_until)))
    if (clash) throw new Error('Já existe atendimento nesse horário.')
  }
  event(db, id, 'status', b.status, status, { motivo: reason ?? null })
  b.status = status
  b.cancel_reason = reason ?? null
  save()
}
export async function reschedule(id: string, startIso: string) {
  await wait()
  const db = load()
  const b = db.bookings.find((x) => x.id === id) ?? fail('reserva_inexistente')
  if (!slots(db, b.service_id, ymdSP(new Date(startIso)), id).some((x) => x.starts_at === startIso)) throw new Error('Esse horário não está livre.')
  event(db, id, 'reagendado', b.status, b.status, { de: b.starts_at, para: startIso })
  const st = Date.parse(startIso)
  b.starts_at = new Date(st).toISOString()
  b.ends_at = new Date(st + b.duration_min * 60_000).toISOString()
  b.blocked_until = new Date(st + (b.duration_min + b.buffer_min) * 60_000).toISOString()
  if (!['pendente', 'confirmado'].includes(b.status)) b.status = 'pendente'
  save()
}
export async function allServices() { await wait(); return [...load().services].sort((a, b) => a.sort - b.sort) }
export async function saveService(s: Partial<Service> & { id?: string }) {
  await wait()
  const db = load()
  if (s.id) Object.assign(db.services.find((x) => x.id === s.id) ?? fail('procedimento_invalido'), s)
  else db.services.push({ ...(s as Service), id: `svc-${db.seq++}` })
  save()
}
export async function hours() { await wait(); return [...load().hours] }
export async function replaceHours(rows: Omit<OpeningHour, 'id'>[]) {
  await wait()
  const db = load()
  db.hours = rows.map((r, i) => ({ ...r, id: i + 1 }))
  save()
}
export async function settings() { await wait(); return { ...load().settings } }
export async function saveSettings(s: Settings) { await wait(); load().settings = { ...s }; save() }
export async function blocks() { await wait(); return load().blocks.filter((b) => Date.parse(b.ends_at) >= Date.now()).sort((a, b) => a.starts_at.localeCompare(b.starts_at)) }
export async function addBlock(b: Omit<Block, 'id'>) { await wait(); const db = load(); db.blocks.push({ ...b, id: `blk-${db.seq++}` }); save() }
export async function removeBlock(id: string) { await wait(); const db = load(); db.blocks = db.blocks.filter((b) => b.id !== id); save() }
export async function holidays() { await wait(); const t = ymdSP(new Date()); return load().holidays.filter((h) => h.day >= t).sort((a, b) => a.day.localeCompare(b.day)) }
export async function addHoliday(h: Holiday) { await wait(); const db = load(); db.holidays = [...db.holidays.filter((x) => x.day !== h.day), h]; save() }
export async function removeHoliday(day: string) { await wait(); const db = load(); db.holidays = db.holidays.filter((h) => h.day !== day); save() }
export async function history(limit = 80) {
  await wait()
  const db = load()
  return db.events.slice(0, limit).map((e) => {
    const b = db.bookings.find((x) => x.id === e.booking_id)
    return { ...e, bookings: b ? { code: b.code, customer_name: b.customer_name, service_name: b.service_name } : null }
  })
}

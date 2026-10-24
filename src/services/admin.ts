import { supabase } from '../lib/supabase'
import type { Block, Booking, BookingEvent, BookingStatus, Holiday, OpeningHour, Service, Settings, Slot } from '../types/booking'

const db = () => supabase!
export const isDemo = !supabase
const demo = () => import('./demoBackend')
const ok = <T,>(r: { data: T | null; error: { message: string } | null }): T => {
  if (r.error) throw new Error(friendly(r.error.message))
  return r.data as T
}
function friendly(m: string) {
  if (m.includes('horario_indisponivel')) return 'Esse horário não está livre.'
  if (m.includes('sem_permissao') || m.includes('permission denied') || m.includes('row-level security')) return 'Sua conta não tem permissão para isso.'
  if (m.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.'
  if (m.includes('bookings_no_overlap')) return 'Já existe atendimento nesse horário.'
  return m
}

export const auth = {
  session: async () => (isDemo ? (await demo()).demoAuth.session() : (await db().auth.getSession()).data.session),
  onChange: (cb: () => void): { unsubscribe: () => void } => {
    if (isDemo) {
      let sub: { unsubscribe: () => void } | null = null
      let cancelled = false
      demo().then((m) => { if (!cancelled) sub = m.onDemoAuth(cb) })
      return { unsubscribe: () => { cancelled = true; sub?.unsubscribe() } }
    }
    return db().auth.onAuthStateChange(() => cb()).data.subscription
  },
  signIn: async (email: string, password: string) => {
    if (isDemo) return (await demo()).demoAuth.signIn(email, password)
    const { error } = await db().auth.signInWithPassword({ email, password })
    if (error) throw new Error(friendly(error.message))
  },
  signOut: async () => { if (isDemo) return (await demo()).demoAuth.signOut(); await db().auth.signOut() },
  resetPassword: async (email: string) => {
    if (isDemo) throw new Error('Na demonstração a senha é a que aparece acima.')
    const { error } = await db().auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + import.meta.env.BASE_URL + 'admin' })
    if (error) throw new Error(friendly(error.message))
  },
  isAdmin: async () => (isDemo ? true : Boolean(ok(await db().rpc('is_admin')))),
}

export async function bookingsBetween(fromIso: string, toIso: string): Promise<Booking[]> {
  if (isDemo) return (await demo()).bookingsBetween(fromIso, toIso)
  return ok(await db().from('bookings').select('*').gte('starts_at', fromIso).lt('starts_at', toIso).order('starts_at'))
}
export async function setStatus(id: string, status: BookingStatus, cancel_reason?: string) {
  if (isDemo) return (await demo()).setStatus(id, status, cancel_reason)
  ok(await db().from('bookings').update({ status, cancel_reason: cancel_reason ?? null }).eq('id', id).select('id'))
}
export async function reschedule(id: string, startIso: string) {
  if (isDemo) return (await demo()).reschedule(id, startIso)
  ok(await db().rpc('admin_reschedule', { p_booking_id: id, p_new_start: startIso }))
}
export async function slotsFor(serviceId: string, day: string, ignore?: string): Promise<Slot[]> {
  if (isDemo) return (await demo()).daySlots(serviceId, day, ignore)
  return ok(await db().rpc('available_slots', { p_service_id: serviceId, p_day: day, p_ignore_booking: ignore ?? null }))
}

export async function allServices(): Promise<Service[]> {
  if (isDemo) return (await demo()).allServices()
  return ok(await db().from('services').select('*').order('sort'))
}
export async function saveService(s: Partial<Service> & { id?: string }) {
  if (isDemo) return (await demo()).saveService(s)
  const { id, ...rest } = s
  if (id) ok(await db().from('services').update(rest).eq('id', id).select('id'))
  else ok(await db().from('services').insert(rest).select('id'))
}

export async function hours(): Promise<OpeningHour[]> {
  if (isDemo) return (await demo()).hours()
  return ok(await db().from('opening_hours').select('*').order('weekday').order('start_time'))
}
export async function replaceHours(rows: Omit<OpeningHour, 'id'>[]) {
  if (isDemo) return (await demo()).replaceHours(rows)
  ok(await db().rpc('admin_replace_hours', { p_rows: rows }))
}
export async function settings(): Promise<Settings> {
  if (isDemo) return (await demo()).settings()
  return ok(await db().from('business_settings').select('*').eq('id', 1).single())
}
export async function saveSettings(s: Settings) {
  if (isDemo) return (await demo()).saveSettings(s)
  ok(await db().from('business_settings').update(s).eq('id', 1).select('id'))
}

export async function blocks(): Promise<Block[]> {
  if (isDemo) return (await demo()).blocks()
  return ok(await db().from('blocks').select('*').gte('ends_at', new Date().toISOString()).order('starts_at'))
}
export async function addBlock(b: Omit<Block, 'id'>) { if (isDemo) return (await demo()).addBlock(b); ok(await db().from('blocks').insert(b).select('id')) }
export async function removeBlock(id: string) { if (isDemo) return (await demo()).removeBlock(id); ok(await db().from('blocks').delete().eq('id', id).select('id')) }
export async function holidays(): Promise<Holiday[]> {
  if (isDemo) return (await demo()).holidays()
  return ok(await db().from('holidays').select('*').gte('day', new Date().toISOString().slice(0, 10)).order('day'))
}
export async function addHoliday(h: Holiday) { if (isDemo) return (await demo()).addHoliday(h); ok(await db().from('holidays').upsert(h).select('day')) }
export async function removeHoliday(day: string) { if (isDemo) return (await demo()).removeHoliday(day); ok(await db().from('holidays').delete().eq('day', day).select('day')) }

export async function history(limit = 80): Promise<(BookingEvent & { bookings: { code: string; customer_name: string; service_name: string } | null })[]> {
  if (isDemo) return (await demo()).history(limit)
  return ok(await db().from('booking_events').select('*, bookings(code, customer_name, service_name)').order('created_at', { ascending: false }).limit(limit))
}

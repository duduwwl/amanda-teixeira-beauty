import { supabase } from '../lib/supabase'
import type { Block, Booking, BookingEvent, BookingStatus, Holiday, OpeningHour, Service, Settings, Slot } from '../types/booking'

const db = () => {
  if (!supabase) throw new Error('Backend não configurado')
  return supabase
}
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
  session: async () => (await db().auth.getSession()).data.session,
  onChange: (cb: () => void) => db().auth.onAuthStateChange(() => cb()).data.subscription,
  signIn: async (email: string, password: string) => {
    const { error } = await db().auth.signInWithPassword({ email, password })
    if (error) throw new Error(friendly(error.message))
  },
  signOut: async () => { await db().auth.signOut() },
  resetPassword: async (email: string) => {
    const { error } = await db().auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + import.meta.env.BASE_URL + 'admin' })
    if (error) throw new Error(friendly(error.message))
  },
  isAdmin: async () => Boolean(ok(await db().rpc('is_admin'))),
}

export async function bookingsBetween(fromIso: string, toIso: string): Promise<Booking[]> {
  return ok(await db().from('bookings').select('*').gte('starts_at', fromIso).lt('starts_at', toIso).order('starts_at'))
}
export async function setStatus(id: string, status: BookingStatus, cancel_reason?: string) {
  ok(await db().from('bookings').update({ status, cancel_reason: cancel_reason ?? null }).eq('id', id).select('id'))
}
export async function reschedule(id: string, startIso: string) {
  ok(await db().rpc('admin_reschedule', { p_booking_id: id, p_new_start: startIso }))
}
export async function slotsFor(serviceId: string, day: string, ignore?: string): Promise<Slot[]> {
  return ok(await db().rpc('available_slots', { p_service_id: serviceId, p_day: day, p_ignore_booking: ignore ?? null }))
}

export async function allServices(): Promise<Service[]> {
  return ok(await db().from('services').select('*').order('sort'))
}
export async function saveService(s: Partial<Service> & { id?: string }) {
  const { id, ...rest } = s
  if (id) ok(await db().from('services').update(rest).eq('id', id).select('id'))
  else ok(await db().from('services').insert(rest).select('id'))
}

export async function hours(): Promise<OpeningHour[]> {
  return ok(await db().from('opening_hours').select('*').order('weekday').order('start_time'))
}
export async function replaceHours(rows: Omit<OpeningHour, 'id'>[]) {
  ok(await db().rpc('admin_replace_hours', { p_rows: rows }))
}
export async function settings(): Promise<Settings> {
  return ok(await db().from('business_settings').select('*').eq('id', 1).single())
}
export async function saveSettings(s: Settings) {
  ok(await db().from('business_settings').update(s).eq('id', 1).select('id'))
}

export async function blocks(): Promise<Block[]> {
  return ok(await db().from('blocks').select('*').gte('ends_at', new Date().toISOString()).order('starts_at'))
}
export async function addBlock(b: Omit<Block, 'id'>) { ok(await db().from('blocks').insert(b).select('id')) }
export async function removeBlock(id: string) { ok(await db().from('blocks').delete().eq('id', id).select('id')) }
export async function holidays(): Promise<Holiday[]> {
  return ok(await db().from('holidays').select('*').gte('day', new Date().toISOString().slice(0, 10)).order('day'))
}
export async function addHoliday(h: Holiday) { ok(await db().from('holidays').upsert(h).select('day')) }
export async function removeHoliday(day: string) { ok(await db().from('holidays').delete().eq('day', day).select('day')) }

export async function history(limit = 80): Promise<(BookingEvent & { bookings: { code: string; customer_name: string; service_name: string } | null })[]> {
  return ok(await db().from('booking_events').select('*, bookings(code, customer_name, service_name)').order('created_at', { ascending: false }).limit(limit))
}

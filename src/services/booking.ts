import { supabase } from '../lib/supabase'
import type { BookingRequest, BookingResult, Service, Slot } from '../types/booking'

// Mensagens que o banco devolve (raise exception '<chave>') traduzidas para a cliente.
const ERRORS: Record<string, string> = {
  horario_indisponivel: 'Esse horário acabou de ser reservado por outra pessoa. Escolha outro, por favor.',
  nome_invalido: 'Informe nome e sobrenome.',
  telefone_invalido: 'Confira o WhatsApp: DDD + número, por exemplo (35) 99876-5432.',
  email_invalido: 'Confira o e-mail informado.',
  privacidade_obrigatoria: 'Para reservar é preciso aceitar a política de privacidade.',
  procedimento_invalido: 'Esse procedimento não está disponível para reserva online.',
  limite_reservas: 'Você já tem três reservas em aberto. Fale pelo WhatsApp para marcar mais.',
  muitas_tentativas: 'Muitas tentativas seguidas com esse número. Aguarde alguns minutos.',
  agenda_fechada: 'A agenda online está fechada no momento. Fale pelo WhatsApp.',
  observacao_longa: 'A observação passou de 600 caracteres.',
}

export class BookingError extends Error {
  key: string
  constructor(key: string) {
    super(ERRORS[key] ?? 'Não foi possível concluir agora. Tente de novo ou fale pelo WhatsApp.')
    this.key = key
  }
}

function fail(error: { message?: string } | null): never {
  const key = Object.keys(ERRORS).find((k) => error?.message?.includes(k)) ?? 'desconhecido'
  throw new BookingError(key)
}

const db = () => {
  if (!supabase) throw new BookingError('agenda_fechada')
  return supabase
}

export async function listServices(): Promise<Service[]> {
  const { data, error } = await db().from('services').select('*').eq('active', true).order('sort')
  if (error) fail(error)
  return data as Service[]
}

export async function monthAvailability(serviceId: string, monthYmd: string): Promise<Map<string, number>> {
  const { data, error } = await db().rpc('month_availability', { p_service_id: serviceId, p_month: monthYmd })
  if (error) fail(error)
  return new Map((data as { day: string; free_slots: number }[]).map((r) => [r.day.slice(0, 10), r.free_slots]))
}

export async function daySlots(serviceId: string, dayYmd: string): Promise<Slot[]> {
  const { data, error } = await db().rpc('available_slots', { p_service_id: serviceId, p_day: dayYmd })
  if (error) fail(error)
  return data as Slot[]
}

export async function nextFreeSlot(): Promise<{ starts_at: string; service_name: string } | null> {
  const { data, error } = await db().rpc('next_free_slot')
  if (error) return null
  return (data as { starts_at: string; service_name: string }[])[0] ?? null
}

export async function createBooking(r: BookingRequest): Promise<BookingResult> {
  const { data, error } = await db().rpc('create_booking', {
    p_service_id: r.serviceId,
    p_starts_at: r.startsAt,
    p_name: r.name,
    p_phone: r.phone,
    p_email: r.email || null,
    p_notes: r.notes || null,
    p_contact_preference: r.contactPreference,
    p_privacy_accepted: r.privacyAccepted,
    p_marketing_opt_in: r.marketingOptIn,
  })
  if (error) fail(error)
  const row = (data as BookingResult[])[0]
  if (!row?.code) throw new BookingError('desconhecido')
  return row
}

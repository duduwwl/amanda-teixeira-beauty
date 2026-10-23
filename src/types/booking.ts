export type BookingStatus = 'pendente' | 'confirmado' | 'concluido' | 'cancelado' | 'nao_compareceu'

export type Service = {
  id: string
  slug: string
  name: string
  category: string
  short_description: string
  description: string
  duration_min: number
  buffer_min: number
  price_cents: number | null
  price_note: string | null
  requires_evaluation: boolean
  notes: string | null
  active: boolean
  sort: number
}

export type Slot = { starts_at: string; ends_at: string }

export type BookingRequest = {
  serviceId: string
  startsAt: string
  name: string
  phone: string
  email?: string
  notes?: string
  contactPreference: 'whatsapp' | 'ligacao' | 'email'
  privacyAccepted: boolean
  marketingOptIn: boolean
}

export type BookingResult = { code: string; starts_at: string; ends_at: string; service_name: string; status: BookingStatus }

export type Booking = {
  id: string
  code: string
  service_id: string
  service_name: string
  duration_min: number
  starts_at: string
  ends_at: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  notes: string | null
  contact_preference: string
  marketing_opt_in: boolean
  status: BookingStatus
  cancel_reason: string | null
  created_at: string
}

export type OpeningHour = { id: number; weekday: number; start_time: string; end_time: string }
export type Holiday = { day: string; name: string }
export type Block = { id: string; starts_at: string; ends_at: string; reason: string | null }
export type Settings = { slot_step_min: number; min_notice_hours: number; max_days_ahead: number; booking_enabled: boolean }
export type BookingEvent = { id: number; booking_id: string; action: string; from_status: BookingStatus | null; to_status: BookingStatus | null; details: Record<string, unknown>; created_at: string }

export const STATUS_LABEL: Record<BookingStatus, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
  nao_compareceu: 'Não compareceu',
}

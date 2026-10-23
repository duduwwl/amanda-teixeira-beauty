export type Details = {
  name: string
  phone: string
  email: string
  notes: string
  contactPreference: 'whatsapp' | 'ligacao' | 'email'
  privacyAccepted: boolean
  marketingOptIn: boolean
}

const NOT_DIGIT = /\D/g
const PHONE = /^[1-9]{2}9?\d{8}$/
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/** Máscara (35) 99876-5432 */
export function maskPhone(v: string) {
  const d = v.replace(NOT_DIGIT, '').replace(/^55(?=\d{10,11}$)/, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/** Mesmas regras que o banco aplica em create_booking. */
export function validate(d: Details, emailRequired = false) {
  const e: Partial<Record<keyof Details, string>> = {}
  const name = d.name.trim().replace(/\s+/g, ' ')
  if (name.length < 3 || !name.includes(' ')) e.name = 'Escreva nome e sobrenome.'
  else if (name.length > 100) e.name = 'Nome muito longo.'
  const digits = d.phone.replace(NOT_DIGIT, '')
  if (!PHONE.test(digits)) e.phone = 'Informe DDD e número, por exemplo (35) 99876-5432.'
  if ((emailRequired || d.contactPreference === 'email') && !d.email.trim()) e.email = 'Informe um e-mail para contato.'
  else if (d.email.trim() && !EMAIL.test(d.email.trim())) e.email = 'Esse e-mail parece incompleto.'
  if (d.notes.length > 600) e.notes = 'Use até 600 caracteres.'
  if (!d.privacyAccepted) e.privacyAccepted = 'Para reservar, aceite a política de privacidade.'
  return e
}


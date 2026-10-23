import { brand } from '../content/site'

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
// RFC 5545: escapar barra invertida, ponto e vírgula e vírgula; quebra de linha vira \n
const esc = (s: string) => s.replace(/[\\;,]/g, (c) => '\\' + c).replace(/\n/g, '\\n')

export function icsFor(b: { code: string; service: string; start: string; end: string }) {
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Amanda Teixeira Beauty//Agenda//PT-BR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${b.code}@amandateixeirabeauty`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(new Date(b.start))}`,
    `DTEND:${stamp(new Date(b.end))}`,
    `SUMMARY:${esc(`${b.service} — ${brand.fullName}`)}`,
    `DESCRIPTION:${esc(`Reserva ${b.code}. Aguarde a confirmação da Amanda pelo WhatsApp.`)}`,
    `LOCATION:${esc(brand.address || brand.city)}`,
    'END:VEVENT', 'END:VCALENDAR',
  ]
  return new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
}

export function googleCalendarUrl(b: { code: string; service: string; start: string; end: string }) {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${b.service} — ${brand.fullName}`,
    dates: `${stamp(new Date(b.start))}/${stamp(new Date(b.end))}`,
    details: `Reserva ${b.code}`,
    location: brand.address || brand.city,
  })
  return `https://calendar.google.com/calendar/render?${p}`
}

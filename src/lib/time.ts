// Tudo que o visitante vê está no fuso de São Paulo, de onde quer que acesse.
export const TZ = 'America/Sao_Paulo'

const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, ...o })
const fTime = fmt({ hour: '2-digit', minute: '2-digit' })
const fLong = fmt({ weekday: 'long', day: 'numeric', month: 'long' })
const fShort = fmt({ weekday: 'short', day: 'numeric', month: 'short' })
const fYmd = fmt({ year: 'numeric', month: '2-digit', day: '2-digit' })

export const timeOf = (d: Date | string) => fTime.format(new Date(d))
export const longDay = (d: Date | string) => fLong.format(new Date(d))
export const shortDay = (d: Date | string) => fShort.format(new Date(d)).replace(/\./g, '')

/** Data local (São Paulo) no formato AAAA-MM-DD. */
export function ymdInTz(d: Date | string): string {
  const parts = fYmd.formatToParts(new Date(d))
  const get = (t: string) => parts.find((p) => p.type === t)!.value
  return `${get('year')}-${get('month')}-${get('day')}`
}

export const todayYmd = () => ymdInTz(new Date())

/** Monta a grade de um mês (semanas começando no domingo). */
export function monthGrid(year: number, month0: number): (string | null)[] {
  const first = new Date(Date.UTC(year, month0, 1))
  const days = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate()
  const cells: (string | null)[] = Array(first.getUTCDay()).fill(null)
  for (let d = 1; d <= days; d++) {
    cells.push(`${year}-${String(month0 + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
  }
  while (cells.length % 7) cells.push(null)
  return cells
}

export const monthLabel = (year: number, month0: number) =>
  new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month0, 15)))

/** Converte "AAAA-MM-DD" + "HH:MM" em São Paulo para instante UTC (Brasil sem horário de verão desde 2019). */
export function spLocalToDate(ymd: string, hhmm: string): Date {
  return new Date(`${ymd}T${hhmm}:00-03:00`)
}

export function durationLabel(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (!h) return `${m} min`
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`
}

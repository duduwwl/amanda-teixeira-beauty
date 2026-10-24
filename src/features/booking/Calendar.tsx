import { useEffect, useMemo, useRef, useState } from 'react'
import { monthAvailability } from '../../services/booking'
import { longDay, monthGrid, monthLabel, todayYmd } from '../../lib/time'

const WEEK = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
const WEEK_FULL = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

type Props = {
  serviceId: string
  value: string | null
  onChange: (ymd: string) => void
  maxMonthsAhead?: number
}

export function Calendar({ serviceId, value, onChange, maxMonthsAhead = 2 }: Props) {
  const today = todayYmd()
  const [y0, m0] = today.split('-').map(Number)
  const [offset, setOffset] = useState(0)
  const year = y0 + Math.floor((m0 - 1 + offset) / 12)
  const month0 = (m0 - 1 + offset) % 12
  const monthYmd = `${year}-${String(month0 + 1).padStart(2, '0')}-01`
  const key = `${serviceId}|${monthYmd}`
  const [result, setResult] = useState<{ key: string; map?: Map<string, number>; error?: boolean } | null>(null)
  const current = result?.key === key ? result : null
  const avail = current?.map ?? null
  const error = Boolean(current?.error)
  const grid = useMemo(() => monthGrid(year, month0), [year, month0])
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let alive = true
    monthAvailability(serviceId, monthYmd)
      .then((map) => alive && setResult({ key, map }))
      .catch(() => alive && setResult({ key, error: true }))
    return () => { alive = false }
  }, [serviceId, monthYmd, key])

  const free = (d: string) => (avail?.get(d) ?? 0) > 0 && d >= today
  const anyFree = avail && grid.some((d) => d && free(d))

  // setas do teclado andam pelos dias
  const onKey = (e: React.KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key]
    if (!step) return
    const btns = Array.from(gridRef.current?.querySelectorAll<HTMLButtonElement>('button[data-day]') ?? [])
    const i = btns.indexOf(document.activeElement as HTMLButtonElement)
    if (i < 0) return
    e.preventDefault()
    const next = btns[Math.max(0, Math.min(btns.length - 1, i + step))]
    next?.focus()
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-[26px] first-letter:uppercase md:text-[34px]" aria-live="polite">{monthLabel(year, month0)}</h3>
        <div className="flex gap-2">
          <button type="button" className="btn btn-quiet !min-h-[44px] !px-4" onClick={() => setOffset((o) => o - 1)} disabled={offset === 0} aria-label="Mês anterior">←</button>
          <button type="button" className="btn btn-quiet !min-h-[44px] !px-4" onClick={() => setOffset((o) => o + 1)} disabled={offset >= maxMonthsAhead} aria-label="Próximo mês">→</button>
        </div>
      </div>

      <div ref={gridRef} role="grid" aria-label={`Dias de ${monthLabel(year, month0)}`} aria-busy={!avail} onKeyDown={onKey}
        className="mt-6 grid grid-cols-7 gap-1 text-center sm:gap-1.5">
        {WEEK.map((w, i) => (
          <div key={w} role="columnheader" aria-label={WEEK_FULL[i]} className="pb-2 text-[13px] text-soft">{w}</div>
        ))}
        {grid.map((d, i) => {
          if (!d) return <div key={`x${i}`} role="gridcell" aria-hidden="true" />
          const ok = free(d)
          const sel = d === value
          const n = avail?.get(d) ?? 0
          const label = `${longDay(`${d}T12:00:00-03:00`)}, ${ok ? `${n} ${n === 1 ? 'horário livre' : 'horários livres'}` : 'sem horários'}`
          return (
            <div key={d} role="gridcell">
              <button
                type="button"
                data-day={d}
                disabled={!ok}
                aria-pressed={sel}
                aria-label={label}
                onClick={() => onChange(d)}
                className={`day relative grid aspect-square w-full min-h-[40px] place-items-center text-[16px] tabular-nums transition-[background-color,color,transform] duration-150 active:scale-95
                  ${sel ? 'bg-cocoa text-paper' : ok ? 'bg-sand hover:bg-taupe' : 'cursor-default text-soft/50 line-through decoration-1'}
                  ${d === today ? 'font-bold' : ''}`}
              >
                {Number(d.slice(8))}
                {ok && !sel && <span aria-hidden="true" className="absolute bottom-[18%] h-1 w-1 rounded-full bg-cocoa" />}
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-4 min-h-[24px] text-[15px] text-soft" aria-live="polite">
        {!avail && !error && 'Consultando a agenda…'}
        {error && <span className="text-danger">Não foi possível carregar a agenda. Verifique a conexão e tente de novo.</span>}
        {avail && !anyFree && 'Nenhum horário livre neste mês. Veja o próximo.'}
        {avail && anyFree && 'Dias com ponto têm horários livres. Riscados não têm.'}
      </div>
    </div>
  )
}

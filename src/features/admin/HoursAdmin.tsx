import { useEffect, useState } from 'react'
import { hours, replaceHours, saveSettings, settings } from '../../services/admin'
import type { OpeningHour, Settings } from '../../types/booking'

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
type Range = { start_time: string; end_time: string }
const input = 'min-h-[44px] bg-paper px-3 ring-1 ring-taupe focus:ring-2 focus:ring-cocoa outline-none tabular-nums'

export function HoursAdmin() {
  const [week, setWeek] = useState<Range[][] | null>(null)
  const [cfg, setCfg] = useState<Settings | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    hours().then((rows: OpeningHour[]) => {
      const w: Range[][] = DAYS.map(() => [])
      rows.forEach((r) => w[r.weekday].push({ start_time: r.start_time.slice(0, 5), end_time: r.end_time.slice(0, 5) }))
      setWeek(w)
    }).catch((e) => setErr(e.message))
    settings().then(setCfg).catch((e) => setErr(e.message))
  }, [])

  if (!week || !cfg) return <p className="text-soft">{err ?? 'Carregando…'}</p>
  const upd = (d: number, i: number, k: keyof Range, v: string) => setWeek(week.map((rs, j) => j !== d ? rs : rs.map((r, n) => n === i ? { ...r, [k]: v } : r)))

  return (
    <form className="grid max-w-3xl gap-10" onSubmit={async (e) => {
      e.preventDefault(); setMsg(null); setErr(null)
      const bad = week.some((rs) => rs.some((r) => r.end_time <= r.start_time))
      if (bad) return setErr('Em cada faixa, o fim precisa ser depois do início.')
      try {
        await replaceHours(week.flatMap((rs, weekday) => rs.map((r) => ({ weekday, ...r }))))
        await saveSettings({ slot_step_min: cfg.slot_step_min, min_notice_hours: cfg.min_notice_hours, max_days_ahead: cfg.max_days_ahead, booking_enabled: cfg.booking_enabled })
        setMsg('Horários salvos. A agenda online já usa os novos valores.')
      } catch (x) { setErr((x as Error).message) }
    }}>
      <div>
        <h2 className="font-sans text-[26px] font-semibold tracking-normal">Horários de atendimento</h2>
        <p className="mt-1 text-[15px] text-soft">Use duas faixas no mesmo dia para deixar o intervalo de almoço. Dia sem faixa = folga.</p>
      </div>
      <div className="grid gap-1">
        {DAYS.map((name, d) => (
          <fieldset key={name} className="grid gap-3 border-0 border-b border-sand p-0 py-4 sm:grid-cols-[120px_1fr]">
            <legend className="sr-only">{name}</legend>
            <p className="font-semibold" aria-hidden="true">{name}</p>
            <div className="grid gap-2">
              {week[d].length === 0 && <p className="text-soft">Folga</p>}
              {week[d].map((r, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-2 text-[14px]">das<input type="time" required className={input} value={r.start_time} onChange={(e) => upd(d, i, 'start_time', e.target.value)} /></label>
                  <label className="flex items-center gap-2 text-[14px]">às<input type="time" required className={input} value={r.end_time} onChange={(e) => upd(d, i, 'end_time', e.target.value)} /></label>
                  <button type="button" className="link min-h-[44px] px-2 text-[14px]" onClick={() => setWeek(week.map((rs, j) => j === d ? rs.filter((_, n) => n !== i) : rs))}>remover</button>
                </div>
              ))}
              <button type="button" className="link w-fit text-[14px]" onClick={() => setWeek(week.map((rs, j) => j === d ? [...rs, { start_time: '09:00', end_time: '12:00' }] : rs))}>Adicionar faixa</button>
            </div>
          </fieldset>
        ))}
      </div>

      <fieldset className="grid gap-4 border-0 p-0 sm:grid-cols-3">
        <legend className="mb-3 font-sans text-[20px] font-semibold">Regras da agenda online</legend>
        <label className="grid gap-1 text-[14px]">Intervalo entre opções de horário (min)<input type="number" min={5} max={120} step={5} className={input} value={cfg.slot_step_min} onChange={(e) => setCfg({ ...cfg, slot_step_min: Number(e.target.value) })} /></label>
        <label className="grid gap-1 text-[14px]">Antecedência mínima (horas)<input type="number" min={0} max={168} className={input} value={cfg.min_notice_hours} onChange={(e) => setCfg({ ...cfg, min_notice_hours: Number(e.target.value) })} /></label>
        <label className="grid gap-1 text-[14px]">Abrir agenda com quantos dias<input type="number" min={1} max={365} className={input} value={cfg.max_days_ahead} onChange={(e) => setCfg({ ...cfg, max_days_ahead: Number(e.target.value) })} /></label>
        <label className="flex min-h-[44px] items-center gap-2 text-[15px] sm:col-span-3"><input type="checkbox" className="h-5 w-5 accent-cocoa" checked={cfg.booking_enabled} onChange={(e) => setCfg({ ...cfg, booking_enabled: e.target.checked })} />Agenda online aberta para novas reservas</label>
      </fieldset>
      {err && <p role="alert" className="text-danger">{err}</p>}
      {msg && <p role="status" className="bg-sand px-4 py-3">{msg}</p>}
      <div><button type="submit" className="btn">Salvar horários</button></div>
    </form>
  )
}

import { useEffect, useState } from 'react'
import { addBlock, addHoliday, blocks, holidays, removeBlock, removeHoliday } from '../../services/admin'
import type { Block, Holiday } from '../../types/booking'
import { longDay, timeOf, todayYmd } from '../../lib/time'

const input = 'min-h-[44px] bg-paper px-3 ring-1 ring-taupe focus:ring-2 focus:ring-cocoa outline-none'

export function BlocksAdmin() {
  const [bl, setBl] = useState<Block[] | null>(null)
  const [hol, setHol] = useState<Holiday[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [f, setF] = useState({ day: todayYmd(), allDay: true, start: '09:00', end: '12:00', reason: '' })
  const [h, setH] = useState({ day: todayYmd(), name: '' })
  const load = () => { blocks().then(setBl).catch((e) => setErr(e.message)); holidays().then(setHol).catch((e) => setErr(e.message)) }
  useEffect(load, [])
  const run = async (fn: () => Promise<void>) => { setErr(null); try { await fn(); load() } catch (e) { setErr((e as Error).message) } }

  return (
    <div className="grid gap-14 lg:grid-cols-2 lg:gap-x-12">
      <section className="grid content-start gap-6">
        <div>
          <h2 className="font-sans text-[26px] font-semibold tracking-normal">Bloqueios</h2>
          <p className="mt-1 text-[15px] text-soft">Dia inteiro ou só algumas horas: curso, compromisso, viagem. Reservas já feitas não são apagadas.</p>
        </div>
        <form className="grid gap-3 bg-sand p-5" onSubmit={(e) => {
          e.preventDefault()
          const s = new Date(`${f.day}T${f.allDay ? '00:00' : f.start}:00-03:00`)
          const en = new Date(`${f.day}T${f.allDay ? '23:59' : f.end}:00-03:00`)
          if (en <= s) return setErr('O fim do bloqueio precisa ser depois do início.')
          run(() => addBlock({ starts_at: s.toISOString(), ends_at: en.toISOString(), reason: f.reason || null }))
        }}>
          <div className="flex flex-wrap items-end gap-3">
            <label className="grid gap-1 text-[14px]">Dia<input type="date" required className={input} value={f.day} onChange={(e) => setF({ ...f, day: e.target.value })} /></label>
            <label className="flex min-h-[44px] items-center gap-2 text-[15px]"><input type="checkbox" className="h-5 w-5 accent-cocoa" checked={f.allDay} onChange={(e) => setF({ ...f, allDay: e.target.checked })} />Dia inteiro</label>
          </div>
          {!f.allDay && (
            <div className="flex flex-wrap gap-3">
              <label className="grid gap-1 text-[14px]">Das<input type="time" className={input} value={f.start} onChange={(e) => setF({ ...f, start: e.target.value })} /></label>
              <label className="grid gap-1 text-[14px]">Às<input type="time" className={input} value={f.end} onChange={(e) => setF({ ...f, end: e.target.value })} /></label>
            </div>
          )}
          <label className="grid gap-1 text-[14px]">Motivo (só você vê)<input className={`${input} w-full`} value={f.reason} maxLength={120} onChange={(e) => setF({ ...f, reason: e.target.value })} /></label>
          <div><button className="btn" type="submit">Bloquear</button></div>
        </form>
        <ul className="m-0 list-none p-0">
          {bl?.length === 0 && <li className="text-soft">Nenhum bloqueio futuro.</li>}
          {bl?.map((b) => (
            <li key={b.id} className="flex items-center justify-between gap-4 border-b border-sand py-3 text-[15px]">
              <span><span className="first-letter:uppercase">{longDay(b.starts_at)}</span>, {timeOf(b.starts_at)}–{timeOf(b.ends_at)}{b.reason && <span className="text-soft"> ({b.reason})</span>}</span>
              <button type="button" className="link min-h-[40px]" onClick={() => { if (confirm('Remover este bloqueio? O horário volta a ficar livre no site.')) run(() => removeBlock(b.id)) }}>Remover</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid content-start gap-6">
        <div>
          <h2 className="font-sans text-[26px] font-semibold tracking-normal">Feriados</h2>
          <p className="mt-1 text-[15px] text-soft">Feriados nacionais já estão cadastrados. Inclua os municipais de Lavras e recessos.</p>
        </div>
        <form className="flex flex-wrap items-end gap-3 bg-sand p-5" onSubmit={(e) => { e.preventDefault(); run(() => addHoliday({ day: h.day, name: h.name || 'Feriado' })) }}>
          <label className="grid gap-1 text-[14px]">Dia<input type="date" required className={input} value={h.day} onChange={(e) => setH({ ...h, day: e.target.value })} /></label>
          <label className="grid flex-1 gap-1 text-[14px]">Nome<input className={`${input} w-full`} value={h.name} onChange={(e) => setH({ ...h, name: e.target.value })} /></label>
          <button className="btn" type="submit">Adicionar</button>
        </form>
        <ul className="m-0 list-none p-0">
          {hol?.map((x) => (
            <li key={x.day} className="flex items-center justify-between gap-4 border-b border-sand py-3 text-[15px]">
              <span><span className="tabular-nums">{x.day.split('-').reverse().join('/')}</span> {x.name}</span>
              <button type="button" className="link min-h-[40px]" onClick={() => { if (confirm(`Remover o feriado ${x.name}?`)) run(() => removeHoliday(x.day)) }}>Remover</button>
            </li>
          ))}
        </ul>
      </section>
      {err && <p role="alert" className="text-danger lg:col-span-2">{err}</p>}
    </div>
  )
}

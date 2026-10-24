import { useCallback, useEffect, useMemo, useState } from 'react'
import { bookingsBetween, reschedule, setStatus, slotsFor } from '../../services/admin'
import { STATUS_LABEL, type Booking, type BookingStatus, type Slot } from '../../types/booking'
import { durationLabel, longDay, monthGrid, monthLabel, shortDay, timeOf, todayYmd, ymdInTz } from '../../lib/time'

type View = 'dia' | 'semana' | 'mes'
const addDays = (ymd: string, n: number) => {
  const d = new Date(`${ymd}T12:00:00-03:00`); d.setUTCDate(d.getUTCDate() + n); return ymdInTz(d)
}
const startOfWeek = (ymd: string) => addDays(ymd, -new Date(`${ymd}T12:00:00-03:00`).getUTCDay())
const iso = (ymd: string) => new Date(`${ymd}T00:00:00-03:00`).toISOString()

// cada estado tem sua marca: pendente tracejado, confirmado cheio, etc.
const MARK: Record<BookingStatus, string> = {
  pendente: 'outline-dashed outline-[1.5px] -outline-offset-[1.5px] outline-cocoa bg-paper',
  confirmado: 'bg-cocoa text-paper',
  concluido: 'bg-sand text-ink',
  cancelado: 'bg-paper text-soft line-through',
  nao_compareceu: 'bg-[repeating-linear-gradient(135deg,#dfe3e5_0_4px,#f0f2f3_4px_8px)] text-ink',
}
const STATUSES = Object.keys(STATUS_LABEL) as BookingStatus[]

export function Agenda() {
  const [view, setView] = useState<View>('dia')
  const [anchor, setAnchor] = useState(todayYmd())
  const [filter, setFilter] = useState<BookingStatus | 'todos'>('todos')
  const [open, setOpen] = useState<string | null>(null)

  const range = useMemo(() => {
    if (view === 'dia') return [anchor, addDays(anchor, 1)]
    if (view === 'semana') { const s = startOfWeek(anchor); return [s, addDays(s, 7)] }
    const m = anchor.slice(0, 8) + '01'
    const [y, mo] = m.split('-').map(Number)
    return [m, `${mo === 12 ? y + 1 : y}-${String(mo === 12 ? 1 : mo + 1).padStart(2, '0')}-01`]
  }, [view, anchor])

  const [nonce, setNonce] = useState(0)
  const load = useCallback(() => setNonce((n) => n + 1), [])
  const reqKey = `${range[0]}|${range[1]}|${nonce}`
  const [res, setRes] = useState<{ key: string; rows?: Booking[]; error?: string } | null>(null)
  useEffect(() => {
    let alive = true
    bookingsBetween(iso(range[0]), iso(range[1]))
      .then((r) => alive && setRes({ key: reqKey, rows: r }))
      .catch((e) => alive && setRes({ key: reqKey, error: e.message }))
    return () => { alive = false }
  }, [range, reqKey])
  const rows = res?.key === reqKey ? res.rows ?? null : null
  const error = res?.key === reqKey ? res.error ?? null : null

  const shown = rows?.filter((r) => filter === 'todos' || r.status === filter) ?? null
  const step = (n: number) => setAnchor((a) => view === 'dia' ? addDays(a, n) : view === 'semana' ? addDays(a, 7 * n) : (() => {
    const [y, m] = a.split('-').map(Number); const t = new Date(Date.UTC(y, m - 1 + n, 1)); return t.toISOString().slice(0, 10)
  })())
  const title = view === 'dia' ? longDay(`${anchor}T12:00:00-03:00`)
    : view === 'semana' ? `Semana de ${shortDay(`${range[0]}T12:00:00-03:00`)}`
    : monthLabel(Number(anchor.slice(0, 4)), Number(anchor.slice(5, 7)) - 1)

  const counts = useMemo(() => {
    const c: Partial<Record<BookingStatus, number>> = {}
    rows?.forEach((r) => { c[r.status] = (c[r.status] ?? 0) + 1 })
    return c
  }, [rows])

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-sans text-[26px] font-semibold tracking-normal first-letter:uppercase" aria-live="polite">{title}</h2>
          <p className="mt-1 text-[15px] text-soft">
            {rows ? `${rows.filter((r) => r.status === 'pendente' || r.status === 'confirmado').length} atendimentos ativos, ${counts.pendente ?? 0} aguardando confirmação` : 'Carregando…'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Visualização" className="flex">
            {(['dia', 'semana', 'mes'] as View[]).map((v) => (
              <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}
                className={`min-h-[44px] px-4 text-[15px] ${view === v ? 'bg-ink text-paper' : 'bg-sand hover:bg-taupe'}`}>
                {{ dia: 'Dia', semana: 'Semana', mes: 'Mês' }[v]}
              </button>
            ))}
          </div>
          <button type="button" className="btn btn-quiet !min-h-[44px] !px-3" onClick={() => step(-1)} aria-label="Período anterior">Anterior</button>
          <button type="button" className="btn btn-quiet !min-h-[44px] !px-3" onClick={() => setAnchor(todayYmd())}>Hoje</button>
          <button type="button" className="btn btn-quiet !min-h-[44px] !px-3" onClick={() => step(1)} aria-label="Próximo período">Próximo</button>
          <label className="flex items-center gap-2 text-[15px]">
            <span className="sr-only">Ir para a data</span>
            <input type="date" value={anchor} onChange={(e) => e.target.value && setAnchor(e.target.value)} className="min-h-[44px] bg-paper px-3 ring-1 ring-taupe" />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
        <label className="flex items-center gap-2">Status
          <select value={filter} onChange={(e) => setFilter(e.target.value as BookingStatus | 'todos')} className="min-h-[40px] bg-paper px-3 text-ink ring-1 ring-taupe">
            <option value="todos">Todos</option>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]} ({counts[s] ?? 0})</option>)}
          </select>
        </label>
        <span className="flex flex-wrap gap-4" aria-label="Legenda">
          {STATUSES.map((s) => <span key={s} className="flex items-center gap-1.5"><span className={`inline-block h-3.5 w-5 ${MARK[s]}`} />{STATUS_LABEL[s]}</span>)}
        </span>
      </div>

      {error && <p role="alert" className="bg-danger/10 px-4 py-3 text-danger">{error} <button className="link" onClick={load}>Tentar de novo</button></p>}

      {view === 'dia' && shown && <DayStrip rows={shown} />}
      {view === 'mes' && rows && <MonthGrid anchor={anchor} rows={shown!} onPick={(d) => { setAnchor(d); setView('dia') }} />}

      {shown && shown.length === 0 && <p className="bg-sand px-5 py-6 text-[16px]">Nenhum atendimento {filter === 'todos' ? '' : `com status “${STATUS_LABEL[filter]}” `}neste período.</p>}

      {shown && shown.length > 0 && view !== 'mes' && (
        <table className="w-full border-collapse text-left text-[15px]">
          <caption className="sr-only">Atendimentos</caption>
          <thead>
            <tr className="border-b border-taupe text-[13px] text-soft">
              <th className="py-2 pr-4 font-normal">Quando</th>
              <th className="py-2 pr-4 font-normal">Cliente</th>
              <th className="hidden py-2 pr-4 font-normal md:table-cell">Procedimento</th>
              <th className="py-2 pr-4 font-normal">Status</th>
              <th className="py-2 font-normal"><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((b) => (
              <Row key={b.id} b={b} open={open === b.id} onToggle={() => setOpen(open === b.id ? null : b.id)} onChanged={() => { setOpen(null); load() }} showDay={view !== 'dia'} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

/** Elemento próprio do studio: a cadeira do dia, das 8h às 20h, com cada atendimento e o tempo livre entre eles. */
function DayStrip({ rows }: { rows: Booking[] }) {
  const H0 = 8, H1 = 20
  const pos = (d: string) => {
    const [h, m] = timeOf(d).split(':').map(Number)
    return ((h + m / 60 - H0) / (H1 - H0)) * 100
  }
  const active = rows.filter((r) => r.status !== 'cancelado')
  return (
    <figure className="m-0" aria-label="Linha do dia">
      <div className="relative h-14 bg-sand">
        {Array.from({ length: H1 - H0 + 1 }, (_, i) => (
          <span key={i} className="absolute top-0 h-full w-px bg-taupe/70" style={{ left: `${(i / (H1 - H0)) * 100}%` }} />
        ))}
        {active.map((b) => (
          <span key={b.id} title={`${timeOf(b.starts_at)} ${b.customer_name}, ${b.service_name}`}
            className={`absolute top-2 flex h-10 items-center overflow-hidden px-1.5 text-[12px] leading-tight ${MARK[b.status]}`}
            style={{ left: `${pos(b.starts_at)}%`, width: `${Math.max(pos(b.ends_at) - pos(b.starts_at), 2)}%` }}>
            <span className="truncate">{b.customer_name.split(' ')[0]}</span>
          </span>
        ))}
      </div>
      <div className="relative mt-1 h-5 text-[12px] text-soft" aria-hidden="true">
        {Array.from({ length: (H1 - H0) / 2 + 1 }, (_, i) => (
          <span key={i} className="absolute -translate-x-1/2" style={{ left: `${((i * 2) / (H1 - H0)) * 100}%` }}>{H0 + i * 2}h</span>
        ))}
      </div>
    </figure>
  )
}

function MonthGrid({ anchor, rows, onPick }: { anchor: string; rows: Booking[]; onPick: (d: string) => void }) {
  const y = Number(anchor.slice(0, 4)), m = Number(anchor.slice(5, 7)) - 1
  const byDay = new Map<string, Booking[]>()
  rows.forEach((r) => { const d = ymdInTz(r.starts_at); byDay.set(d, [...(byDay.get(d) ?? []), r]) })
  const today = todayYmd()
  return (
    <div className="grid grid-cols-7 gap-1 text-[14px]">
      {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'].map((d) => <div key={d} className="pb-1 text-[13px] text-soft">{d}</div>)}
      {monthGrid(y, m).map((d, i) => {
        if (!d) return <div key={i} />
        const list = (byDay.get(d) ?? []).filter((r) => r.status !== 'cancelado')
        const pend = list.filter((r) => r.status === 'pendente').length
        return (
          <button key={d} type="button" onClick={() => onPick(d)}
            className={`min-h-[72px] p-2 text-left align-top hover:bg-taupe/60 ${d === today ? 'ring-2 ring-cocoa' : ''} ${list.length ? 'bg-sand' : 'bg-paper ring-1 ring-sand'}`}
            aria-label={`${longDay(`${d}T12:00:00-03:00`)}: ${list.length} atendimentos`}>
            <span className="block tabular-nums">{Number(d.slice(8))}</span>
            {list.length > 0 && <span className="mt-1 block text-[13px] font-semibold">{list.length} atend.</span>}
            {pend > 0 && <span className="block text-[12px] text-soft">{pend} pendente{pend > 1 ? 's' : ''}</span>}
          </button>
        )
      })}
    </div>
  )
}

function Row({ b, open, onToggle, onChanged, showDay }: { b: Booking; open: boolean; onToggle: () => void; onChanged: () => void; showDay: boolean }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [mode, setMode] = useState<'none' | 'cancel' | 'move'>('none')
  const [reason, setReason] = useState('')
  const [day, setDay] = useState(ymdInTz(b.starts_at))
  const [slotRes, setSlotRes] = useState<{ day: string; slots: Slot[] } | null>(null)
  const slots = slotRes?.day === day ? slotRes.slots : null

  useEffect(() => {
    if (mode !== 'move') return
    let alive = true
    slotsFor(b.service_id, day, b.id).then((s) => alive && setSlotRes({ day, slots: s })).catch((e) => alive && setErr(e.message))
    return () => { alive = false }
  }, [mode, day, b.service_id, b.id])

  const act = async (fn: () => Promise<void>) => {
    setBusy(true); setErr(null)
    try { await fn(); setMode('none'); onChanged() } catch (e) { setErr((e as Error).message) } finally { setBusy(false) }
  }
  const phone = b.customer_phone.replace(/\D/g, '')
  return (
    <>
      <tr className="border-b border-sand align-top">
        <td className="py-3 pr-4 tabular-nums">
          {showDay && <span className="block text-[13px] text-soft first-letter:uppercase">{shortDay(b.starts_at)}</span>}
          {timeOf(b.starts_at)}–{timeOf(b.ends_at)}
        </td>
        <td className="py-3 pr-4">
          <span className="block font-semibold">{b.customer_name}</span>
          <a className="link text-[14px] text-soft" href={`https://wa.me/55${phone}`} target="_blank" rel="noopener noreferrer">{b.customer_phone}</a>
          <span className="block text-[13px] text-soft md:hidden">{b.service_name}</span>
        </td>
        <td className="hidden py-3 pr-4 md:table-cell">{b.service_name}<span className="block text-[13px] text-soft">{durationLabel(b.duration_min)} · {b.code}</span></td>
        <td className="py-3 pr-4"><span className={`inline-block whitespace-nowrap px-2 py-0.5 text-[13px] ${MARK[b.status]}`}>{STATUS_LABEL[b.status]}</span></td>
        <td className="py-3 text-right"><button type="button" className="link min-h-[40px] text-[14px]" aria-expanded={open} onClick={onToggle}>{open ? 'Fechar' : 'Abrir'}</button></td>
      </tr>
      {open && (
        <tr className="border-b border-sand">
          <td colSpan={5} className="bg-sand/50 px-4 py-5">
            <div className="grid gap-4 text-[15px]">
              <p className="text-soft">Código {b.code} · contato por {b.contact_preference}{b.customer_email ? ` · ${b.customer_email}` : ''}{b.marketing_opt_in ? ' · aceita novidades' : ''}</p>
              {b.notes && <p><strong className="font-semibold">Observações:</strong> {b.notes}</p>}
              {b.cancel_reason && <p><strong className="font-semibold">Motivo:</strong> {b.cancel_reason}</p>}
              <div className="flex flex-wrap gap-2">
                {b.status !== 'confirmado' && <button disabled={busy} className="btn !min-h-[42px] !px-4" type="button" onClick={() => act(() => setStatus(b.id, 'confirmado'))}>Confirmar</button>}
                {b.status !== 'concluido' && <button disabled={busy} className="btn btn-quiet !min-h-[42px] !px-4" type="button" onClick={() => act(() => setStatus(b.id, 'concluido'))}>Concluído</button>}
                {b.status !== 'nao_compareceu' && <button disabled={busy} className="btn btn-quiet !min-h-[42px] !px-4" type="button" onClick={() => act(() => setStatus(b.id, 'nao_compareceu'))}>Não compareceu</button>}
                <button disabled={busy} className="btn btn-quiet !min-h-[42px] !px-4" type="button" onClick={() => setMode(mode === 'move' ? 'none' : 'move')}>Reagendar</button>
                {b.status !== 'cancelado' && <button disabled={busy} className="btn btn-quiet !min-h-[42px] !px-4 text-danger" type="button" onClick={() => setMode(mode === 'cancel' ? 'none' : 'cancel')}>Cancelar</button>}
                <a className="btn btn-quiet !min-h-[42px] !px-4" target="_blank" rel="noopener noreferrer"
                  href={`https://wa.me/55${phone}?text=${encodeURIComponent(`Olá, ${b.customer_name.split(' ')[0]}! Aqui é a Amanda. Sobre sua reserva ${b.code} de ${b.service_name} em ${longDay(b.starts_at)} às ${timeOf(b.starts_at)}: `)}`}>
                  Escrever no WhatsApp
                </a>
              </div>
              {mode === 'cancel' && (
                <form className="flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); act(() => setStatus(b.id, 'cancelado', reason.trim() || 'Sem motivo informado')) }}>
                  <label className="grid gap-1 text-[14px]">Motivo do cancelamento
                    <input className="min-h-[44px] w-[min(28rem,80vw)] bg-paper px-3 ring-1 ring-taupe" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={200} />
                  </label>
                  <button className="btn !min-h-[44px]" disabled={busy} type="submit">Cancelar atendimento</button>
                </form>
              )}
              {mode === 'move' && (
                <div className="grid gap-3">
                  <label className="flex flex-wrap items-center gap-3 text-[14px]">Novo dia
                    <input type="date" min={todayYmd()} value={day} onChange={(e) => e.target.value && setDay(e.target.value)} className="min-h-[44px] bg-paper px-3 ring-1 ring-taupe" />
                  </label>
                  {!slots && <p className="text-soft">Buscando horários…</p>}
                  {slots?.length === 0 && <p>Sem horários livres nesse dia.</p>}
                  <div className="flex flex-wrap gap-1.5">
                    {slots?.map((s) => (
                      <button key={s.starts_at} type="button" disabled={busy} className="min-h-[44px] min-w-[72px] bg-paper px-3 tabular-nums ring-1 ring-taupe hover:bg-taupe"
                        onClick={() => act(() => reschedule(b.id, s.starts_at))}>{timeOf(s.starts_at)}</button>
                    ))}
                  </div>
                </div>
              )}
              {err && <p role="alert" className="text-danger">{err}</p>}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

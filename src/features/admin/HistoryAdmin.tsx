import { useEffect, useState } from 'react'
import { history } from '../../services/admin'
import { STATUS_LABEL } from '../../types/booking'
import { shortDay, timeOf } from '../../lib/time'

type Rows = Awaited<ReturnType<typeof history>>

export function HistoryAdmin() {
  const [rows, setRows] = useState<Rows | null>(null)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => { history().then(setRows).catch((e) => setErr(e.message)) }, [])
  const describe = (r: Rows[number]) => {
    if (r.action === 'criado') return 'Reserva feita pelo site'
    if (r.action === 'reagendado') return `Reagendada de ${shortDay(String(r.details.de))} ${timeOf(String(r.details.de))} para ${shortDay(String(r.details.para))} ${timeOf(String(r.details.para))}`
    return `${r.from_status ? STATUS_LABEL[r.from_status] : '—'} → ${r.to_status ? STATUS_LABEL[r.to_status] : '—'}${r.details?.motivo ? ` (${r.details.motivo})` : ''}`
  }
  return (
    <div className="grid gap-6">
      <div>
        <h2 className="font-sans text-[26px] font-semibold tracking-normal">Histórico de alterações</h2>
        <p className="mt-1 text-[15px] text-soft">As 80 mudanças mais recentes, registradas automaticamente pelo banco.</p>
      </div>
      {err && <p role="alert" className="text-danger">{err}</p>}
      <table className="w-full border-collapse text-left text-[15px]">
        <thead><tr className="border-b border-taupe text-[13px] text-soft"><th className="py-2 pr-4 font-normal">Quando</th><th className="py-2 pr-4 font-normal">Reserva</th><th className="py-2 font-normal">O que mudou</th></tr></thead>
        <tbody>
          {!rows && !err && <tr><td colSpan={3} className="py-4 text-soft">Carregando…</td></tr>}
          {rows?.length === 0 && <tr><td colSpan={3} className="py-4 text-soft">Nenhuma alteração ainda.</td></tr>}
          {rows?.map((r) => (
            <tr key={r.id} className="border-b border-sand align-top">
              <td className="whitespace-nowrap py-3 pr-4 tabular-nums">{shortDay(r.created_at)} {timeOf(r.created_at)}</td>
              <td className="py-3 pr-4">{r.bookings?.code}<span className="block text-[13px] text-soft">{r.bookings?.customer_name}</span></td>
              <td className="py-3">{describe(r)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

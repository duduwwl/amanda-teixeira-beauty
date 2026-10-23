import { useEffect, useState } from 'react'
import { allServices, saveService } from '../../services/admin'
import type { Service } from '../../types/booking'

const input = 'min-h-[44px] w-full bg-paper px-3 ring-1 ring-taupe focus:ring-2 focus:ring-cocoa outline-none'
const blank: Partial<Service> = { name: '', slug: '', short_description: '', description: '', duration_min: 60, buffer_min: 15, price_cents: null, price_note: '', requires_evaluation: false, notes: '', active: true, sort: 100, category: 'estetica' }
const slugify = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function ServicesAdmin() {
  const [list, setList] = useState<Service[] | null>(null)
  const [edit, setEdit] = useState<Partial<Service> | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const load = () => allServices().then(setList).catch((e) => setErr(e.message))
  useEffect(() => { load() }, [])

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-sans text-[26px] font-semibold tracking-normal">Procedimentos</h2>
          <p className="mt-1 text-[15px] text-soft">Duração e intervalo definem os horários oferecidos na agenda. Preço vazio aparece como “informado na confirmação”.</p>
        </div>
        <button type="button" className="btn" onClick={() => setEdit({ ...blank })}>Novo procedimento</button>
      </div>
      {err && <p role="alert" className="text-danger">{err}</p>}
      {saved && <p role="status" className="bg-sand px-4 py-3">{saved}</p>}

      {edit && (
        <form className="grid gap-4 bg-sand p-5 md:grid-cols-6" onSubmit={async (e) => {
          e.preventDefault(); setErr(null)
          try {
            await saveService({ ...edit, slug: edit.slug || slugify(edit.name ?? ''), price_note: edit.price_note || null, notes: edit.notes || null })
            setSaved(`“${edit.name}” salvo.`); setEdit(null); load()
          } catch (x) { setErr((x as Error).message) }
        }}>
          <h3 className="font-sans text-[18px] font-semibold tracking-normal md:col-span-6">{edit.id ? `Editar ${edit.name}` : 'Novo procedimento'}</h3>
          <label className="grid gap-1 text-[14px] md:col-span-3">Nome<input required className={input} value={edit.name ?? ''} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
          <label className="grid gap-1 text-[14px] md:col-span-1">Duração (min)<input required type="number" min={10} max={480} step={5} className={input} value={edit.duration_min ?? 60} onChange={(e) => setEdit({ ...edit, duration_min: Number(e.target.value) })} /></label>
          <label className="grid gap-1 text-[14px] md:col-span-1">Intervalo depois (min)<input type="number" min={0} max={120} step={5} className={input} value={edit.buffer_min ?? 15} onChange={(e) => setEdit({ ...edit, buffer_min: Number(e.target.value) })} /></label>
          <label className="grid gap-1 text-[14px] md:col-span-1">Ordem<input type="number" className={input} value={edit.sort ?? 100} onChange={(e) => setEdit({ ...edit, sort: Number(e.target.value) })} /></label>
          <label className="grid gap-1 text-[14px] md:col-span-2">Preço (R$, vazio = não exibir)
            <input inputMode="decimal" className={input} value={edit.price_cents != null ? (edit.price_cents / 100).toFixed(2).replace('.', ',') : ''}
              onChange={(e) => { const v = e.target.value.replace(/\./g, '').replace(',', '.'); setEdit({ ...edit, price_cents: v.trim() === '' || isNaN(Number(v)) ? null : Math.round(Number(v) * 100) }) }} />
          </label>
          <label className="grid gap-1 text-[14px] md:col-span-4">Observação do preço (ex.: “por sessão”)<input className={input} value={edit.price_note ?? ''} onChange={(e) => setEdit({ ...edit, price_note: e.target.value })} /></label>
          <label className="grid gap-1 text-[14px] md:col-span-6">Descrição curta<input className={input} maxLength={140} value={edit.short_description ?? ''} onChange={(e) => setEdit({ ...edit, short_description: e.target.value })} /></label>
          <label className="grid gap-1 text-[14px] md:col-span-6">Informações importantes<textarea rows={2} className={`${input} py-2`} value={edit.notes ?? ''} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} /></label>
          <label className="flex min-h-[44px] items-center gap-2 text-[15px] md:col-span-3"><input type="checkbox" className="h-5 w-5 accent-cocoa" checked={!!edit.requires_evaluation} onChange={(e) => setEdit({ ...edit, requires_evaluation: e.target.checked })} />Exige avaliação prévia</label>
          <label className="flex min-h-[44px] items-center gap-2 text-[15px] md:col-span-3"><input type="checkbox" className="h-5 w-5 accent-cocoa" checked={!!edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} />Disponível para agendamento online</label>
          <div className="flex gap-4 md:col-span-6"><button className="btn" type="submit">Salvar</button><button type="button" className="link" onClick={() => setEdit(null)}>Descartar</button></div>
        </form>
      )}

      <table className="w-full border-collapse text-left text-[15px]">
        <thead><tr className="border-b border-taupe text-[13px] text-soft"><th className="py-2 pr-4 font-normal">Procedimento</th><th className="py-2 pr-4 text-right font-normal">Duração</th><th className="hidden py-2 pr-4 text-right font-normal sm:table-cell">Intervalo</th><th className="py-2 pr-4 text-right font-normal">Preço</th><th className="py-2 font-normal"><span className="sr-only">Editar</span></th></tr></thead>
        <tbody>
          {!list && <tr><td colSpan={5} className="py-4 text-soft">Carregando…</td></tr>}
          {list?.map((s) => (
            <tr key={s.id} className={`border-b border-sand ${s.active ? '' : 'text-soft'}`}>
              <td className="py-3 pr-4"><span className="font-semibold">{s.name}</span>{!s.active && ' (oculto)'}{s.requires_evaluation && <span className="block text-[13px] text-soft">exige avaliação</span>}</td>
              <td className="py-3 pr-4 text-right tabular-nums">{s.duration_min} min</td>
              <td className="hidden py-3 pr-4 text-right tabular-nums sm:table-cell">{s.buffer_min} min</td>
              <td className="py-3 pr-4 text-right tabular-nums">{s.price_cents != null ? (s.price_cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : <span className="text-soft">—</span>}</td>
              <td className="py-3 text-right"><button type="button" className="link min-h-[40px]" onClick={() => setEdit(s)}>Editar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

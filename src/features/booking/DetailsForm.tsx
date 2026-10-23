import { useId, useState } from 'react'
import { Link } from 'react-router-dom'

export type Details = {
  name: string
  phone: string
  email: string
  notes: string
  contactPreference: 'whatsapp' | 'ligacao' | 'email'
  privacyAccepted: boolean
  marketingOptIn: boolean
}

/** Máscara (35) 99876-5432 */
export function maskPhone(v: string) {
  const d = v.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '').slice(0, 11)
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
  const digits = d.phone.replace(/\D/g, '')
  if (!/^[1-9]{2}9?\d{8}$/.test(digits)) e.phone = 'Informe DDD e número, por exemplo (35) 99876-5432.'
  if ((emailRequired || d.contactPreference === 'email') && !d.email.trim()) e.email = 'Informe um e-mail para contato.'
  else if (d.email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email.trim())) e.email = 'Esse e-mail parece incompleto.'
  if (d.notes.length > 600) e.notes = 'Use até 600 caracteres.'
  if (!d.privacyAccepted) e.privacyAccepted = 'Para reservar, aceite a política de privacidade.'
  return e
}

const empty: Details = { name: '', phone: '', email: '', notes: '', contactPreference: 'whatsapp', privacyAccepted: false, marketingOptIn: false }

export function DetailsForm({ initial, onSubmit, onBack }: { initial: Details | null; onSubmit: (d: Details) => void; onBack: () => void }) {
  const [d, setD] = useState<Details>(initial ?? empty)
  const [touched, setTouched] = useState<Partial<Record<keyof Details, boolean>>>({})
  const [tried, setTried] = useState(false)
  const [trap, setTrap] = useState('')
  const id = useId()
  const errors = validate(d)
  const show = (k: keyof Details) => (tried || touched[k]) && errors[k]
  const set = <K extends keyof Details>(k: K, v: Details[K]) => setD((x) => ({ ...x, [k]: v }))
  const blur = (k: keyof Details) => () => setTouched((t) => ({ ...t, [k]: true }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (trap) return // campo invisível preenchido = robô
    const keys = Object.keys(errors) as (keyof Details)[]
    if (keys.length) {
      document.getElementById(`${id}-${keys[0]}`)?.focus()
      return
    }
    onSubmit({ ...d, name: d.name.trim().replace(/\s+/g, ' '), email: d.email.trim(), notes: d.notes.trim() })
  }

  const field = 'mt-2 block w-full min-h-[50px] bg-paper px-4 text-[17px] text-ink outline-none ring-1 ring-taupe transition-shadow focus:ring-2 focus:ring-cocoa aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-danger'
  const err = (k: keyof Details) => show(k) ? <p id={`${id}-${k}-err`} className="mt-1.5 text-[15px] text-danger">{errors[k]}</p> : null

  return (
    <form noValidate onSubmit={submit} className="mt-8 grid max-w-2xl gap-6">
      {tried && Object.keys(errors).length > 0 && (
        <p role="alert" className="bg-danger/10 px-4 py-3 text-[15px] text-danger">Confira {Object.keys(errors).length === 1 ? 'o campo marcado' : 'os campos marcados'} abaixo.</p>
      )}
      <div>
        <label htmlFor={`${id}-name`} className="text-[15px] font-semibold">Nome completo</label>
        <input id={`${id}-name`} className={field} autoComplete="name" value={d.name} onChange={(e) => set('name', e.target.value)} onBlur={blur('name')}
          aria-invalid={Boolean(show('name'))} aria-describedby={show('name') ? `${id}-name-err` : undefined} maxLength={100} required />
        {err('name')}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-phone`} className="text-[15px] font-semibold">WhatsApp com DDD</label>
          <input id={`${id}-phone`} className={field} type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(35) 99876-5432"
            value={d.phone} onChange={(e) => set('phone', maskPhone(e.target.value))} onBlur={blur('phone')}
            aria-invalid={Boolean(show('phone'))} aria-describedby={show('phone') ? `${id}-phone-err` : undefined} required />
          {err('phone')}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="text-[15px] font-semibold">E-mail <span className="font-normal text-soft">(opcional)</span></label>
          <input id={`${id}-email`} className={field} type="email" inputMode="email" autoComplete="email" value={d.email}
            onChange={(e) => set('email', e.target.value)} onBlur={blur('email')} maxLength={254}
            aria-invalid={Boolean(show('email'))} aria-describedby={show('email') ? `${id}-email-err` : undefined} />
          {err('email')}
        </div>
      </div>

      <fieldset className="border-0 p-0">
        <legend className="text-[15px] font-semibold">Como prefere ser contatada?</legend>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
          {([['whatsapp', 'WhatsApp'], ['ligacao', 'Ligação'], ['email', 'E-mail']] as const).map(([v, l]) => (
            <label key={v} className="flex min-h-[44px] cursor-pointer items-center gap-2.5 text-[16px]">
              <input type="radio" name="pref" value={v} checked={d.contactPreference === v} onChange={() => set('contactPreference', v)} className="h-5 w-5 accent-cocoa" />
              {l}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={`${id}-notes`} className="text-[15px] font-semibold">Observações <span className="font-normal text-soft">(opcional)</span></label>
        <textarea id={`${id}-notes`} rows={3} className={`${field} py-3`} value={d.notes} onChange={(e) => set('notes', e.target.value)} onBlur={blur('notes')}
          maxLength={600} aria-describedby={`${id}-notes-hint`} />
        <p id={`${id}-notes-hint`} className="mt-1.5 text-[14px] text-soft">Algo que a Amanda deve saber antes, como um procedimento anterior. Não precisa informar dados de saúde aqui.</p>
        {err('notes')}
      </div>

      {/* armadilha para robôs: invisível para pessoas e leitores de tela */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>Site <input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} /></label>
      </div>

      <div className="grid gap-3">
        <label className="flex cursor-pointer items-start gap-3 text-[16px]">
          <input id={`${id}-privacyAccepted`} type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-cocoa" checked={d.privacyAccepted}
            onChange={(e) => set('privacyAccepted', e.target.checked)} aria-invalid={Boolean(show('privacyAccepted'))}
            aria-describedby={show('privacyAccepted') ? `${id}-privacyAccepted-err` : undefined} />
          <span>Li e aceito a <Link to="/politica-de-privacidade" target="_blank" className="link">política de privacidade</Link>. Meus dados servem só para este agendamento.</span>
        </label>
        {err('privacyAccepted')}
        <label className="flex cursor-pointer items-start gap-3 text-[16px]">
          <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-cocoa" checked={d.marketingOptIn} onChange={(e) => set('marketingOptIn', e.target.checked)} />
          <span>Quero receber novidades e horários especiais pelo WhatsApp. <span className="text-soft">(opcional, dá para sair quando quiser)</span></span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <button type="submit" className="btn max-sm:w-full">Revisar reserva</button>
        <button type="button" className="link text-[15px]" onClick={onBack}>Voltar aos horários</button>
      </div>
    </form>
  )
}

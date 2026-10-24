import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { auth, isDemo } from '../../services/admin'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { Agenda } from './Agenda'
import { ServicesAdmin } from './ServicesAdmin'
import { HoursAdmin } from './HoursAdmin'
import { BlocksAdmin } from './BlocksAdmin'
import { HistoryAdmin } from './HistoryAdmin'

const TABS = ['Agenda', 'Procedimentos', 'Horários', 'Bloqueios e feriados', 'Histórico'] as const
type Tab = (typeof TABS)[number]

export default function AdminPage() {
  useDocumentMeta('Área da Amanda | Amanda Teixeira Beauty', 'Acesso restrito.', 'noindex, nofollow')
  const [state, setState] = useState<'loading' | 'out' | 'denied' | 'in'>('loading')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const check = async () => {
      const s = await auth.session()
      if (!s) return setState('out')
      setEmail(s.user.email ?? '')
      setState((await auth.isAdmin().catch(() => false)) ? 'in' : 'denied')
    }
    check()
    const sub = auth.onChange(check)
    return () => sub.unsubscribe()
  }, [])

  if (state === 'loading') return <Shell><p aria-live="polite">Verificando acesso…</p></Shell>
  if (state === 'out') return <Shell><Login /></Shell>
  if (state === 'denied') {
    return (
      <Shell>
        <h1 className="text-[40px]">Sem acesso</h1>
        <p className="mt-4 max-w-[56ch]">A conta {email} entrou, mas não está autorizada a administrar a agenda.</p>
        <button className="btn mt-6" type="button" onClick={() => auth.signOut()}>Sair</button>
      </Shell>
    )
  }
  return <Dashboard email={email} />
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="frame min-h-[80svh] pb-24 pt-[130px]"><div className="max-w-xl">{children}</div></div>
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const field = 'mt-2 block w-full min-h-[50px] bg-paper px-4 text-[17px] ring-1 ring-taupe outline-none focus:ring-2 focus:ring-cocoa'
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault(); setBusy(true); setError(null)
        try { await auth.signIn(email.trim(), password) } catch (err) { setError((err as Error).message) } finally { setBusy(false) }
      }}
      className="grid gap-5"
    >
      <h1 className="text-[44px]">Área da Amanda</h1>
      <p className="text-soft">Acesso restrito à administração da agenda.</p>
      {isDemo && <DemoCredentials onUse={(e, p) => { setEmail(e); setPassword(p) }} />}
      <label className="text-[15px] font-semibold">E-mail
        <input className={field} name="email" spellCheck={false} type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="text-[15px] font-semibold">Senha
        <input className={field} name="senha" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <p role="alert" className="bg-danger/10 px-4 py-3 text-danger">{error}</p>}
      {msg && <p role="status" className="bg-sand px-4 py-3">{msg}</p>}
      <div className="flex flex-wrap items-center gap-6">
        <button className="btn" disabled={busy} type="submit">{busy ? 'Entrando…' : 'Entrar'}</button>
        <button type="button" className="link text-[15px]" onClick={async () => {
          if (!email) return setError('Escreva o e-mail para receber o link de nova senha.')
          try { await auth.resetPassword(email.trim()); setMsg('Se o e-mail estiver cadastrado, o link de nova senha chega em instantes.') } catch (err) { setError((err as Error).message) }
        }}>Esqueci a senha</button>
      </div>
      <Link to="/" className="link text-[15px]">Voltar ao site</Link>
    </form>
  )
}

function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<Tab>('Agenda')
  return (
    <div className="admin min-h-[100svh] bg-paper pt-[72px]">
      <div className="frame flex flex-wrap items-center justify-between gap-4 py-5">
        <h1 className="font-sans text-[22px] font-semibold tracking-normal">Agenda do studio</h1>
        <p className="flex items-center gap-4 text-[14px] text-soft">
          {isDemo && (
            <button type="button" className="link text-ink" onClick={async () => {
              if (!confirm('Restaurar a agenda de demonstração? As mudanças feitas aqui serão desfeitas.')) return
              ;(await import('../../services/demoBackend')).resetDemo()
              location.reload()
            }}>Restaurar demonstração</button>
          )}
          <span className="hidden sm:inline">{email}</span>
          <button type="button" className="link text-ink" onClick={() => auth.signOut()}>Sair</button>
        </p>
      </div>
      <div className="frame">
        <div role="tablist" aria-label="Seções do painel" className="-mx-1 flex gap-1 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button key={t} role="tab" type="button" aria-selected={tab === t} onClick={() => setTab(t)}
              className={`min-h-[44px] shrink-0 whitespace-nowrap px-4 text-[15px] ${tab === t ? 'bg-ink text-paper' : 'hover:bg-sand'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div role="tabpanel" aria-label={tab} className="frame pb-24 pt-8">
        {tab === 'Agenda' && <Agenda />}
        {tab === 'Procedimentos' && <ServicesAdmin />}
        {tab === 'Horários' && <HoursAdmin />}
        {tab === 'Bloqueios e feriados' && <BlocksAdmin />}
        {tab === 'Histórico' && <HistoryAdmin />}
      </div>
    </div>
  )
}

/** Na demonstração, o acesso de teste fica à vista para quem quiser conhecer o painel. */
function DemoCredentials({ onUse }: { onUse: (email: string, password: string) => void }) {
  const [creds, setCreds] = useState<{ email: string; password: string } | null>(null)
  useEffect(() => { import('../../services/demoBackend').then((m) => setCreds(m.DEMO_ADMIN)) }, [])
  if (!creds) return null
  return (
    <div className="bg-sand px-4 py-3 text-[15px]">
      <p><strong className="font-semibold">Painel de demonstração</strong>, com agenda fictícia.</p>
      <p className="mt-1">E-mail <span className="font-semibold">{creds.email}</span> e senha <span className="font-semibold">{creds.password}</span>.</p>
      <button type="button" className="link mt-1 font-semibold" onClick={() => onUse(creds.email, creds.password)}>Preencher para mim</button>
    </div>
  )
}

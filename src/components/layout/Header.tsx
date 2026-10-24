import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { brand } from '../../content/site'
import { preloadProps } from '../../lib/preload'

const NAV = [
  { href: '/#inicio', label: 'Início' },
  { href: '/#sobre', label: 'Sobre' },
  { href: '/#procedimentos', label: 'Procedimentos' },
  { href: '/#resultados', label: 'Resultados' },
  { href: '/#cursos', label: 'Cursos' },
  { href: '/#contato', label: 'Contato' },
]

/** Sobre a foto do topo o cabeçalho é transparente; depois vira uma barra lisa no papel. */
export function Header({ overHero = false }: { overHero?: boolean }) {
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > window.innerHeight * 0.75)
  const solid = !overHero || scrolled
  const [menu, setMenu] = useState<{ open: boolean; path: string }>({ open: false, path: '' })
  const panel = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()
  // o menu fecha sozinho quando a rota muda (inclusive pelo botão voltar)
  const open = menu.open && menu.path === pathname
  const setOpen = (v: boolean | ((o: boolean) => boolean)) =>
    setMenu((m) => ({ open: typeof v === 'function' ? v(m.open && m.path === pathname) : v, path: pathname }))

  useEffect(() => {
    if (!overHero) return
    const on = () => setScrolled(window.scrollY > window.innerHeight * 0.75)
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [overHero])

  // Menu do celular: Esc fecha, foco fica preso dentro, página não rola por trás.
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    root.style.overflow = 'hidden'
    const first = panel.current?.querySelector<HTMLElement>('a,button')
    first?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenu((m) => ({ ...m, open: false })); toggle.current?.focus() }
      if (e.key === 'Tab' && panel.current) {
        const f = Array.from(panel.current.querySelectorAll<HTMLElement>('a,button'))
        const [a, z] = [f[0], f[f.length - 1]]
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus() }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { root.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [open])

  const light = !solid && !open
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color] duration-300 ${
        light ? 'text-paper' : 'bg-paper text-ink'
      }`}
    >
      <div className="frame flex h-[72px] items-center justify-between gap-6">
        <Link to="/" className="leading-[1.15] no-underline">
          <span translate="no" className="block font-display text-[22px] tracking-[-0.01em]">Amanda Teixeira</span>
          <span className={`block text-[13px] ${light ? 'text-paper/85' : 'text-soft'}`}>{brand.role}</span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-7 lg:flex">
          {NAV.slice(1).map((n) => (
            <Link key={n.href} to={n.href} className="text-[15px] no-underline opacity-90 transition-opacity hover:opacity-100 hover:underline hover:underline-offset-4">
              {n.label}
            </Link>
          ))}
          <NavLink to="/agendamento" {...preloadProps} className={`btn ${light ? 'btn-light' : ''}`}>
            Agendar horário
          </NavLink>
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <NavLink to="/agendamento" {...preloadProps} className={`btn !min-h-[44px] !px-4 text-[13px] ${light ? 'btn-light' : ''} max-[359px]:hidden`}>
            Agendar
          </NavLink>
          <button
            ref={toggle}
            type="button"
            className="min-h-[44px] min-w-[44px] px-2 text-[15px] font-semibold underline underline-offset-4"
            aria-expanded={open}
            aria-controls="menu-celular"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Fechar' : 'Menu'}
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={panel}
        hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto bg-paper lg:hidden"
      >
        <nav aria-label="Menu do celular" className="frame flex min-h-full flex-col pb-10 pt-6">
          <ul className="m-0 list-none p-0">
            {NAV.map((n, i) => (
              <li key={n.href} style={{ animationDelay: `${i * 45}ms` }} className="menu-item">
                <Link
                  to={n.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 font-display text-[36px] leading-[1.05] no-underline"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-10">
            <Link to="/agendamento" className="btn w-full" onClick={() => setOpen(false)}>Agendar horário</Link>
            <p className="mt-5 text-[15px] text-soft">{brand.city}</p>
            <a className="link mt-1 inline-block text-[15px]" href={brand.instagram.url} target="_blank" rel="noopener noreferrer">{brand.instagram.handle}</a>
          </div>
        </nav>
      </div>
    </header>
  )
}

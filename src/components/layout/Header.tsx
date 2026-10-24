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

/** Sobre o topo escuro o cabeçalho é transparente; depois vira uma barra clara com fio embaixo. */
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

  const dark = !solid && !open
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,border-color] duration-300 ${
        dark ? 'on-dark border-b border-paper/15 bg-field/0 text-paper' : 'border-b border-taupe bg-paper text-ink'
      }`}
    >
      <div className="frame flex h-[64px] items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <span aria-hidden="true" className={`grid h-9 w-9 place-items-center text-[13px] font-bold [font-stretch:125%] ${dark ? 'bg-paper text-ink' : 'bg-ink text-paper'}`}>AT</span>
          <span className="leading-[1.1]">
            <span translate="no" className="block whitespace-nowrap text-[14px] sm:text-[15px] font-semibold uppercase tracking-[0.04em] [font-stretch:118%]">Amanda Teixeira</span>
            <span className={`tag block !text-[11px] ${dark ? 'text-paper/70' : 'text-soft'}`}>{brand.role}</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-6 lg:flex">
          {NAV.slice(1).map((n) => (
            <Link key={n.href} to={n.href} className="text-[14px] no-underline hover:underline hover:underline-offset-4">
              {n.label}
            </Link>
          ))}
          <NavLink to="/agendamento" {...preloadProps} className={`btn !min-h-[44px] ${dark ? 'btn-light' : ''}`}>
            Agendar
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <NavLink to="/agendamento" {...preloadProps} className={`btn !min-h-[44px] !px-3.5 ${dark ? 'btn-light' : ''} max-[479px]:hidden`}>
            Agendar
          </NavLink>
          <button
            ref={toggle}
            type="button"
            className="tag min-h-[44px] min-w-[44px] whitespace-nowrap px-2 !text-[13px]"
            aria-expanded={open}
            aria-controls="menu-celular"
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="max-sm:hidden">[ </span>{open ? 'Fechar' : 'Menu'}<span aria-hidden="true" className="max-sm:hidden"> ]</span>
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
        className="fixed inset-x-0 bottom-0 top-[64px] overflow-y-auto bg-paper lg:hidden"
      >
        <nav aria-label="Menu do celular" className="frame flex min-h-full flex-col pb-10 pt-4">
          <ul className="m-0 list-none p-0">
            {NAV.map((n, i) => (
              <li key={n.href} style={{ animationDelay: `${i * 45}ms` }} className="menu-item border-b border-taupe">
                <Link
                  to={n.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-3.5 text-[30px] font-semibold uppercase leading-none tracking-[-0.02em] no-underline [font-stretch:125%]"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-10">
            <Link to="/agendamento" className="btn w-full" onClick={() => setOpen(false)}>Agendar horário</Link>
            <p className="tag mt-5 text-soft">{brand.addressShort} · {brand.cityShort}</p>
            <a className="link mt-1 inline-block text-[15px]" href={brand.instagram.url} target="_blank" rel="noopener noreferrer">{brand.instagram.handle}</a>
          </div>
        </nav>
      </div>
    </header>
  )
}

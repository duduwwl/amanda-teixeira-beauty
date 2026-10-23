import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

/** Rola até a âncora (#procedimentos) inclusive vindo de outra página; senão volta ao topo. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      let tries = 0
      const go = () => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
          if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
          el.focus({ preventScroll: true })
        } else if (tries++ < 20) requestAnimationFrame(go)
      }
      go()
    } else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export function Layout() {
  const { pathname } = useLocation()
  const home = pathname === '/'
  return (
    <>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <ScrollManager />
      <div id="topo" className="page-over-footer">
        <Header overHero={home} />
        <main id="conteudo" tabIndex={-1} className="outline-none">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  )
}

import { Link } from 'react-router-dom'
import { brand } from '../../content/site'

const year = new Date().getFullYear() // calculado uma vez, fora da renderização

/** Rodapé em formato de ficha: colunas com rótulo técnico e, no fim, as iniciais enormes. */
export function Footer() {
  const col = 'tag mb-4 text-paper/55'
  return (
    <footer className="on-dark footer-clip relative bg-field text-paper">
      <div className="frame flex flex-col pt-16 md:pt-24 safe-bottom">
        <div className="grid gap-12 border-t border-paper/20 pt-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className={col}>Agendamento</p>
            <a href={brand.whatsappUrl} target="_blank" rel="noopener noreferrer" className="block whitespace-nowrap text-[clamp(26px,2.6vw,38px)] font-semibold leading-none tracking-[-0.03em] no-underline [font-stretch:125%] hover:text-champagne">
              {brand.phoneDisplay}
            </a>
            <p className="mt-3 text-[15px] text-paper/75">WhatsApp do studio</p>
          </div>
          <div className="lg:col-span-3">
            <p className={col}>Endereço</p>
            <p className="text-[15px]">{brand.address}</p>
            <dl className="m-0 mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[14px] text-paper/80">
              {brand.hours.map((h) => (
                <div key={h.days} className="contents"><dt>{h.days}</dt><dd className="m-0 tabular-nums">{h.time}</dd></div>
              ))}
            </dl>
          </div>
          <nav aria-label="Site" className="lg:col-span-2">
            <p className={col}>Site</p>
            <ul className="m-0 grid list-none gap-2 p-0 text-[15px]">
              <li><Link className="link" to="/#procedimentos">Procedimentos</Link></li>
              <li><Link className="link" to="/#resultados">Resultados</Link></li>
              <li><Link className="link" to="/#cursos">Cursos</Link></li>
              <li><Link className="link" to="/agendamento">Agendar horário</Link></li>
              <li><Link className="link" to="/admin" rel="nofollow">Área da Amanda</Link></li>
            </ul>
          </nav>
          <nav aria-label="Redes e políticas" className="lg:col-span-3">
            <p className={col}>Redes</p>
            <ul className="m-0 grid list-none gap-2 p-0 text-[15px] [overflow-wrap:anywhere]">
              <li><a className="link" href={brand.instagram.url} target="_blank" rel="noopener noreferrer">{brand.instagram.handle}</a></li>
              <li><a className="link" href={brand.studioInstagram.url} target="_blank" rel="noopener noreferrer">{brand.studioInstagram.handle}</a></li>
              <li className="pt-3"><Link className="link" to="/politica-de-privacidade">Política de privacidade</Link></li>
              <li><Link className="link" to="/termos">Termos de uso</Link></li>
            </ul>
          </nav>
        </div>

        <p
          aria-hidden="true"
          className="footer-reveal m-0 mt-16 select-none whitespace-nowrap text-center text-[16vw] font-bold uppercase leading-[0.78] tracking-[-0.06em] text-paper [font-stretch:125%] md:mt-24"
        >
          Amanda<span className="text-champagne">.</span>
        </p>
        <p className="sr-only" translate="no">{brand.fullName}</p>

        <div className="tag flex flex-wrap items-end justify-between gap-4 border-t border-paper/20 pb-6 pt-5 text-paper/65">
          <p>© {year} {brand.fullName} · {brand.cityShort}</p>
          <a className="link" href="#topo">Voltar ao topo ↑</a>
        </div>
      </div>
    </footer>
  )
}

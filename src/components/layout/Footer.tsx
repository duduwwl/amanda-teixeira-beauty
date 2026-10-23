import { Link } from 'react-router-dom'
import { brand } from '../../content/site'

const year = new Date().getFullYear() // calculado uma vez, fora da renderização

export function Footer() {
  return (
    <footer className="on-dark footer-clip relative bg-field text-paper">
      <div className="footer-reveal frame flex flex-col pt-16 md:min-h-[86svh] md:pt-20 safe-bottom">
        <p
          aria-hidden="true"
          className="display m-0 select-none whitespace-nowrap text-[17.5vw] leading-[0.8] tracking-[-0.045em] text-paper md:text-[12.6vw]"
        >
          Amanda Teixeira
        </p>
        <p className="sr-only" translate="no">{brand.fullName}</p>

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12">
          <ul className="m-0 list-none space-y-2 p-0 [overflow-wrap:anywhere] md:col-span-5">
            <li><a className="font-display text-[30px] leading-tight text-champagne no-underline hover:underline md:text-[36px]" href={brand.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            <li><a className="font-display text-[30px] leading-tight text-champagne no-underline hover:underline md:text-[36px]" href={brand.instagram.url} target="_blank" rel="noopener noreferrer">{brand.instagram.handle}</a></li>
            <li><a className="font-display text-[30px] leading-tight text-champagne no-underline hover:underline md:text-[36px]" href={brand.studioInstagram.url} target="_blank" rel="noopener noreferrer">{brand.studioInstagram.handle}</a></li>
            <li className="pt-2 text-[17px] text-paper/80">{brand.address || brand.city}</li>
          </ul>

          <div className="grid grid-cols-2 gap-8 text-[15px] sm:grid-cols-3 md:col-span-6 md:col-start-7">
            <nav aria-label="Site">
              <p className="mb-3 text-paper/65">Site</p>
              <ul className="m-0 list-none space-y-2 p-0">
                <li><Link className="link" to="/#sobre">Sobre</Link></li>
                <li><Link className="link" to="/#procedimentos">Procedimentos</Link></li>
                <li><Link className="link" to="/#resultados">Resultados</Link></li>
                <li><Link className="link" to="/#cursos">Cursos</Link></li>
              </ul>
            </nav>
            <nav aria-label="Agenda">
              <p className="mb-3 text-paper/65">Agenda</p>
              <ul className="m-0 list-none space-y-2 p-0">
                <li><Link className="link" to="/agendamento">Agendar horário</Link></li>
                <li><Link className="link" to="/#contato">Contato</Link></li>
                <li><Link className="link" to="/admin" rel="nofollow">Área da Amanda</Link></li>
              </ul>
            </nav>
            <nav aria-label="Políticas">
              <p className="mb-3 text-paper/65">Políticas</p>
              <ul className="m-0 list-none space-y-2 p-0">
                <li><Link className="link" to="/politica-de-privacidade">Privacidade</Link></li>
                <li><Link className="link" to="/termos">Termos de uso</Link></li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pb-6 pt-16 text-[13px] text-paper/70">
          <p>© {year} {brand.fullName}. {brand.city}.</p>
          <a className="link" href="#topo">Voltar ao topo</a>
        </div>
      </div>
    </footer>
  )
}

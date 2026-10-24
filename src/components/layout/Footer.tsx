import { Link } from 'react-router-dom'
import { brand } from '../../content/site'

const year = new Date().getFullYear() // calculado uma vez, fora da renderização

/** Rodapé claro, em texto preto: nome do studio, contato, horário e links. */
export function Footer() {
  return (
    <footer className="relative bg-sand text-ink">
      <div className="frame grid gap-12 pb-8 pt-16 md:grid-cols-12 md:gap-x-6 md:pt-20 safe-bottom">
        <div className="md:col-span-5">
          <p className="font-display text-[36px] leading-[1.05] md:text-[44px]" translate="no">{brand.studioName}</p>
          <p className="mt-4 max-w-[34ch] text-[17px]">{brand.address}</p>
          <p className="mt-1 text-[17px]">{brand.hoursText}</p>
          <Link to="/agendamento" className="btn mt-8 max-sm:w-full">Agendar horário</Link>
        </div>

        <div className="grid content-start gap-10 md:col-span-6 md:col-start-7">
          <ul className="m-0 list-none space-y-1 p-0 [overflow-wrap:anywhere]">
            <li><a className="font-display text-[30px] leading-tight no-underline hover:underline" href={brand.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp {brand.phoneDisplay}</a></li>
            <li><a className="font-display text-[30px] leading-tight no-underline hover:underline" href={brand.instagram.url} target="_blank" rel="noopener noreferrer">{brand.instagram.handle}</a></li>
            <li><a className="font-display text-[30px] leading-tight no-underline hover:underline" href={brand.studioInstagram.url} target="_blank" rel="noopener noreferrer">{brand.studioInstagram.handle}</a></li>
          </ul>

          <div className="grid grid-cols-2 gap-8 text-[15px] sm:grid-cols-3">
            <nav aria-label="Site">
              <p className="mb-3 font-semibold">Site</p>
              <ul className="m-0 list-none space-y-2 p-0">
                <li><Link className="link" to="/#sobre">Sobre</Link></li>
                <li><Link className="link" to="/#procedimentos">Procedimentos</Link></li>
                <li><Link className="link" to="/#resultados">Resultados</Link></li>
                <li><Link className="link" to="/#cursos">Cursos</Link></li>
              </ul>
            </nav>
            <nav aria-label="Agenda">
              <p className="mb-3 font-semibold">Agenda</p>
              <ul className="m-0 list-none space-y-2 p-0">
                <li><Link className="link" to="/agendamento">Agendar horário</Link></li>
                <li><Link className="link" to="/#contato">Contato</Link></li>
                <li><Link className="link" to="/admin" rel="nofollow">Área da Amanda</Link></li>
              </ul>
            </nav>
            <nav aria-label="Políticas">
              <p className="mb-3 font-semibold">Políticas</p>
              <ul className="m-0 list-none space-y-2 p-0">
                <li><Link className="link" to="/politica-de-privacidade">Privacidade</Link></li>
                <li><Link className="link" to="/termos">Termos de uso</Link></li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 pt-4 text-[13px] md:col-span-12">
          <p>© {year} {brand.fullName}. {brand.city}.</p>
          <a className="link" href="#topo">Voltar ao topo</a>
        </div>
      </div>
    </footer>
  )
}

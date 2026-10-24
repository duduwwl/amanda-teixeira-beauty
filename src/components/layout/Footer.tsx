import { Link } from 'react-router-dom'
import { brand } from '../../content/site'

const year = new Date().getFullYear() // calculado uma vez, fora da renderização

/** Selo redondo: o lema da Amanda em volta do monograma, girando com a rolagem. */
function Seal() {
  return (
    <div aria-hidden="true" className="relative aspect-square w-[min(260px,62vw)] text-champagne md:w-[280px]">
      <img src={`${import.meta.env.BASE_URL}seal.svg`} alt="" width={200} height={200} loading="lazy" className="seal-ring absolute inset-0 h-full w-full" />
      <span className="absolute inset-[24%] grid place-items-center rounded-full bg-champagne font-display text-[86px] leading-none tracking-[-0.04em] text-field">
        AT
      </span>
    </div>
  )
}

/** Rodapé: o selo da Amanda à esquerda, contato e links à direita. */
export function Footer() {
  return (
    <footer className="on-dark relative bg-field text-paper">
      <div className="frame grid gap-14 pb-10 pt-16 md:grid-cols-12 md:gap-x-6 md:pt-24 safe-bottom">
        <div className="flex flex-col items-start gap-8 md:col-span-5">
          <Seal />
          <p className="max-w-[26ch] font-display text-[30px] leading-[1.1]">
            Te esperamos para um café e uma boa conversa.
          </p>
          <Link to="/agendamento" className="btn btn-light">Agendar horário</Link>
        </div>

        <div className="grid content-start gap-12 md:col-span-6 md:col-start-7">
          <ul className="m-0 list-none space-y-2 p-0 [overflow-wrap:anywhere]">
            <li><a className="font-display text-[30px] leading-tight text-champagne no-underline hover:underline md:text-[36px]" href={brand.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp {brand.phoneDisplay}</a></li>
            <li><a className="font-display text-[30px] leading-tight text-champagne no-underline hover:underline md:text-[36px]" href={brand.instagram.url} target="_blank" rel="noopener noreferrer">{brand.instagram.handle}</a></li>
            <li><a className="font-display text-[30px] leading-tight text-champagne no-underline hover:underline md:text-[36px]" href={brand.studioInstagram.url} target="_blank" rel="noopener noreferrer">{brand.studioInstagram.handle}</a></li>
            <li className="pt-2 text-[17px] text-paper/80">{brand.address}</li>
            <li className="text-[17px] text-paper/80">{brand.hoursText}</li>
          </ul>

          <div className="grid grid-cols-2 gap-8 text-[15px] sm:grid-cols-3">
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

        <div className="flex flex-wrap items-end justify-between gap-4 pt-6 text-[13px] text-paper/70 md:col-span-12">
          <p>© {year} {brand.fullName}. {brand.city}.</p>
          <a className="link" href="#topo">Voltar ao topo</a>
        </div>
      </div>
    </footer>
  )
}

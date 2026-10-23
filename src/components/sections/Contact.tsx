import { Link } from 'react-router-dom'
import { Img } from '../ui/Img'
import { contactPhoto } from '../../content/media'
import { brand } from '../../content/site'

export function Contact() {
  return (
    <section id="contato" aria-labelledby="contato-title" className="frame pb-[clamp(96px,10vw,140px)] pt-[clamp(140px,13vw,200px)]">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-6">
        <p data-reveal className="font-display text-[24px] leading-[1.15] md:text-[30px] lg:col-span-6 lg:text-[36px]">
          Dúvida sobre procedimento, curso ou horário? A Amanda responde pessoalmente.
        </p>
        <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-5 lg:col-span-5 lg:col-start-8 lg:grid-cols-[160px_minmax(0,1fr)] lg:gap-8">
          <div data-reveal="mask" className="aspect-square"><Img name={contactPhoto.name} alt={contactPhoto.alt} sizes="160px" /></div>
          <div data-reveal style={{ '--i': 1 } as React.CSSProperties}>
            <h2 id="contato-title" className="font-sans text-[20px] font-semibold tracking-normal">Prefere conversar antes?</h2>
            <ul className="m-0 mt-4 grid list-none gap-2 p-0 text-[17px] [overflow-wrap:anywhere] sm:text-[20px]">
              <li><a className="link" href={brand.whatsappUrl} target="_blank" rel="noopener noreferrer">Chamar no WhatsApp</a></li>
              <li><a className="link" href={brand.instagram.url} target="_blank" rel="noopener noreferrer">{brand.instagram.handle}</a></li>
              <li><Link className="link" to="/agendamento">Ver horários livres</Link></li>
            </ul>
          </div>
        </div>
        <p className="text-[15px] text-soft lg:col-span-5 lg:col-start-8">
          {brand.address ? brand.address : `${brand.city}. Endereço completo enviado na confirmação do horário.`}
          {brand.mapsUrl && <> <a className="link" href={brand.mapsUrl} target="_blank" rel="noopener noreferrer">Abrir no mapa</a></>}
        </p>
      </div>
    </section>
  )
}

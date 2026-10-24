import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Img } from '../ui/Img'
import { contactPhoto } from '../../content/media'
import { brand } from '../../content/site'
import { whatsappLink } from '../../lib/whatsapp'

/** O mapa só carrega quando a pessoa pede: sem cookies do Google antes disso. */
function MapEmbed() {
  const [show, setShow] = useState(false)
  const q = encodeURIComponent(`Studio Amanda Teixeira, ${brand.address}`)
  return (
    <div className="relative aspect-[4/3] w-full bg-sand lg:aspect-[16/11]">
      {show ? (
        <iframe title={`Mapa: ${brand.studioName}`} src={`https://www.google.com/maps?q=${q}&output=embed`} className="absolute inset-0 h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className="absolute inset-0 grid place-content-center gap-3 p-6 text-center">
          <p className="font-display text-[30px] leading-tight">{brand.addressShort}</p>
          <p className="text-[15px] text-soft">Centro de Lavras</p>
          <div className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-3">
            <button type="button" className="btn" onClick={() => setShow(true)}>Mostrar mapa</button>
            <a className="link self-center text-[15px]" href={brand.mapsUrl} target="_blank" rel="noopener noreferrer">Abrir no Google Maps</a>
          </div>
        </div>
      )}
    </div>
  )
}

export function Contact() {
  return (
    <section id="contato" aria-labelledby="contato-title" className="frame pb-[clamp(96px,10vw,140px)] pt-[clamp(140px,13vw,200px)]">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-6">
        <p data-reveal className="font-display text-[24px] leading-[1.15] md:text-[30px] lg:col-span-6 lg:text-[36px]">
          Dúvida sobre procedimento, curso ou horário? A Amanda responde pessoalmente.
        </p>
        <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-5 lg:col-span-5 lg:col-start-8 lg:grid-cols-[160px_minmax(0,1fr)] lg:gap-8">
          <div data-reveal="mask" className="aspect-square"><Img name={contactPhoto.name} alt={contactPhoto.alt} sizes="160px" focus="50% 20%" /></div>
          <div data-reveal style={{ '--i': 1 } as React.CSSProperties}>
            <h2 id="contato-title" className="font-sans text-[20px] font-semibold tracking-normal">Prefere conversar antes?</h2>
            <ul className="m-0 mt-4 grid list-none gap-2 p-0 text-[17px] [overflow-wrap:anywhere] sm:text-[20px]">
              <li><a className="link" href={whatsappLink('Olá, Amanda! Vim pelo site e gostaria de tirar uma dúvida.')} target="_blank" rel="noopener noreferrer">WhatsApp {brand.phoneDisplay}</a></li>
              <li><a className="link" href={brand.instagram.url} target="_blank" rel="noopener noreferrer">{brand.instagram.handle}</a></li>
              <li><Link className="link" to="/agendamento">Ver horários livres</Link></li>
            </ul>
          </div>
        </div>

        <div data-reveal className="grid content-start gap-6 max-lg:order-last lg:col-span-4 lg:row-start-2 lg:pt-16">
          <div>
            <h3 className="font-sans text-[17px] font-semibold tracking-normal">Endereço</h3>
            <p className="mt-1 text-[17px]">{brand.address}</p>
          </div>
          <div>
            <h3 className="font-sans text-[17px] font-semibold tracking-normal">Horário</h3>
            <dl className="m-0 mt-1 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-[17px]">
              {brand.hours.map((h) => (
                <div key={h.days} className="contents"><dt>{h.days}</dt><dd className="m-0 tabular-nums">{h.time}</dd></div>
              ))}
            </dl>
          </div>
          <p className="text-[15px] text-soft">Atendimento com hora marcada. Nota {brand.googleRating.value} no Google.</p>
        </div>
        <div data-reveal style={{ '--i': 1 } as React.CSSProperties} className="lg:col-span-7 lg:col-start-6 lg:row-start-2 lg:pt-16">
          <MapEmbed />
        </div>
      </div>
    </section>
  )
}

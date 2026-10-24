import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Img } from '../ui/Img'
import { SectionHead } from '../ui/SectionHead'
import { contactPhoto } from '../../content/media'
import { brand } from '../../content/site'
import { whatsappLink } from '../../lib/whatsapp'

/** O mapa só carrega quando a pessoa pede: sem cookies do Google antes disso. */
function MapEmbed() {
  const [show, setShow] = useState(false)
  const q = encodeURIComponent(`Studio Amanda Teixeira, ${brand.address}`)
  return (
    <div className="relative min-h-[380px] w-full border border-ink bg-paper sm:aspect-[4/3] sm:min-h-0 lg:aspect-[16/10]">
      {show ? (
        <iframe title={`Mapa: ${brand.studioName}`} src={`https://www.google.com/maps?q=${q}&output=embed`} className="absolute inset-0 h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className="absolute inset-0 grid content-between p-5 md:p-7">
          <p className="tag flex justify-between text-soft"><span>21°14′S · 45°00′W</span><span>Lavras-MG</span></p>
          {/* retícula: alvo no centro, sem carregar nada de fora */}
          <div aria-hidden="true" className="relative mx-auto h-24 w-24">
            <span className="absolute inset-x-0 top-1/2 h-px bg-ink/40" />
            <span className="absolute inset-y-0 left-1/2 w-px bg-ink/40" />
            <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 bg-laser" />
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="max-w-[24ch] text-[20px] font-semibold uppercase leading-[1.05] tracking-[-0.02em] [font-stretch:118%]">{brand.addressShort}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <button type="button" className="btn" onClick={() => setShow(true)}>Mostrar mapa</button>
              <a className="link text-[15px]" href={brand.mapsUrl} target="_blank" rel="noopener noreferrer">Abrir no Google Maps</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function Contact() {
  return (
    <section id="contato" aria-labelledby="contato-title" className="bg-sand py-[var(--section)]">
      <div className="frame">
        <SectionHead n="09" label="Contato" id="contato-title" title={<>Fale com<br />a Amanda</>} />

        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-5">
            <a data-reveal href={whatsappLink('Olá, Amanda! Vim pelo site e gostaria de tirar uma dúvida.')} target="_blank" rel="noopener noreferrer"
              className="block whitespace-nowrap text-[clamp(30px,3.9vw,54px)] font-bold leading-none tracking-[-0.04em] no-underline [font-stretch:125%] hover:text-laser">
              {brand.phoneDisplay}
            </a>
            <p className="tag mt-3 text-soft">WhatsApp · resposta da própria Amanda</p>

            <div className="mt-10 grid grid-cols-[88px_1fr] gap-5 border-t border-ink pt-6">
              <div className="aspect-square"><Img name={contactPhoto.name} alt={contactPhoto.alt} sizes="88px" focus="50% 20%" /></div>
              <ul className="m-0 grid list-none content-start gap-2 p-0 text-[17px] [overflow-wrap:anywhere]">
                <li><a className="link" href={brand.instagram.url} target="_blank" rel="noopener noreferrer">{brand.instagram.handle}</a></li>
                <li><a className="link" href={brand.studioInstagram.url} target="_blank" rel="noopener noreferrer">{brand.studioInstagram.handle}</a></li>
                <li><Link className="link" to="/agendamento">Ver horários livres</Link></li>
              </ul>
            </div>

            <dl className="m-0 mt-10 border-t border-ink">
              <div className="border-b border-taupe py-3"><dt className="tag text-soft">Endereço</dt><dd className="m-0 mt-1 text-[17px]">{brand.address}</dd></div>
              {brand.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4 border-b border-taupe py-3 text-[17px]"><dt>{h.days}</dt><dd className="m-0 tabular-nums">{h.time}</dd></div>
              ))}
            </dl>
          </div>
          <div data-reveal style={{ '--i': 1 } as React.CSSProperties} className="lg:col-span-7">
            <MapEmbed />
          </div>
        </div>
      </div>
    </section>
  )
}

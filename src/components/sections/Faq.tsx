import { Link } from 'react-router-dom'
import { Img } from '../ui/Img'
import { faqPhotos } from '../../content/media'
import { brand, faq } from '../../content/site'

export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="bg-taupe/45">
      <div className="frame grid gap-14 pb-[var(--section)] md:grid-cols-12 md:gap-x-6">
        <div className="relative order-first md:order-last md:col-span-6 md:col-start-7">
          <div className="aspect-[4/5] md:aspect-[3/4]">
            <Img name={faqPhotos[0].name} alt={faqPhotos[0].alt} sizes="(min-width: 768px) 45vw, 100vw" />
          </div>
          <div className="absolute -bottom-10 right-0 w-[38%] md:-left-10 md:right-auto md:w-1/3">
            <div className="aspect-square"><Img name={faqPhotos[1].name} alt={faqPhotos[1].alt} sizes="220px" /></div>
          </div>
        </div>

        <div className="md:col-span-5 md:col-start-1 md:row-start-1 md:pt-[var(--section)]">
          <h2 id="faq-title" data-reveal className="text-[clamp(44px,6vw,96px)]">Dúvidas frequentes</h2>

          <div className="mt-10">
            {faq.map((f) => (
              <details key={f.q} className="group py-3">
                <summary className="flex min-h-[44px] cursor-pointer items-center justify-between gap-6 text-[20px] font-medium md:text-[20px]">
                  {f.q}
                  <span aria-hidden="true" className="chev shrink-0" />
                </summary>
                <p className="max-w-[52ch] pb-3 pt-1 text-[17px] text-soft">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link to="/agendamento" className="btn max-sm:w-full">Agendar horário</Link>
            <a href={brand.whatsappUrl} target="_blank" rel="noopener noreferrer" className="link text-[17px]">Perguntar pelo WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  )
}

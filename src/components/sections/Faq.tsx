import { Link } from 'react-router-dom'
import { SectionHead } from '../ui/SectionHead'
import { brand, faq } from '../../content/site'

/** Perguntas numeradas em duas colunas: resumo prático à esquerda, respostas à direita. */
export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="frame py-[var(--section)]">
      <SectionHead n="08" label="Perguntas" id="faq-title" title={<>Antes<br />de marcar</>} />

      <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-x-6">
        <aside className="md:col-span-4">
          <dl className="m-0 border-t border-ink">
            {[['Onde', brand.address], ['Como', 'Atendimento com hora marcada'], ['Quando', brand.hoursText]].map(([k, v]) => (
              <div key={k} className="border-b border-taupe py-4">
                <dt className="tag text-soft">{k}</dt>
                <dd className="m-0 mt-1 text-[17px]">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 grid gap-4">
            <Link to="/agendamento" className="btn w-full sm:w-fit">Agendar horário</Link>
            <a href={brand.whatsappUrl} target="_blank" rel="noopener noreferrer" className="link w-fit text-[15px]">Perguntar pelo WhatsApp</a>
          </div>
        </aside>

        <div className="border-t border-ink md:col-span-8">
          {faq.map((f, i) => (
            <details key={f.q} className="group border-b border-taupe">
              <summary className="grid min-h-[44px] cursor-pointer grid-cols-[48px_1fr_auto] items-baseline gap-x-3 py-5 text-[19px] font-semibold leading-snug [font-stretch:106%] md:grid-cols-[64px_1fr_auto] md:text-[21px]">
                <span className="tag text-laser">Q.{String(i + 1).padStart(2, '0')}</span>
                {f.q}
                <span aria-hidden="true" className="plus self-center" />
              </summary>
              <p className="max-w-[60ch] pb-6 pl-[60px] text-[17px] text-soft md:pl-[76px]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

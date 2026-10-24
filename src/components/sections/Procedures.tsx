import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Img } from '../ui/Img'
import { procedures } from '../../content/site'

export function Procedures() {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="procedimentos" aria-labelledby="proc-title" className="frame py-[var(--section)]">
      <h2 id="proc-title" data-reveal className="max-w-[16ch] text-[clamp(44px,6vw,96px)] md:indent-[3vw]">
        O que a Amanda faz, um por um
      </h2>

      <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-x-6">
        {/* foto do procedimento em foco (desktop) */}
        <div className="hidden md:col-span-5 md:block">
          <div className="sticky top-[110px] aspect-[4/5]">
            {procedures.map((p, i) => (
              <div key={p.slug} className="proc-photo absolute inset-0" style={{ opacity: i === active ? 1 : 0 }} aria-hidden={i !== active}>
                <Img name={p.image} alt={i === active ? p.imageAlt : ''} sizes="40vw" />
              </div>
            ))}
          </div>
        </div>

        <ul className="m-0 list-none p-0 md:col-span-6 md:col-start-7">
          {procedures.map((p, i) => (
            <li key={p.slug} data-reveal style={{ '--i': i } as React.CSSProperties} className={i === 3 ? 'pt-8' : ''}
              onMouseEnter={() => setActive(i)}>
              <h3 className="m-0 font-sans text-[17px] font-normal tracking-normal">
                <button
                  type="button"
                  id={`proc-${p.slug}`}
                  aria-expanded={open === i}
                  aria-controls={`proc-${p.slug}-painel`}
                  onClick={() => { setOpen(open === i ? null : i); setActive(i) }}
                  onFocus={() => setActive(i)}
                  className="flex w-full cursor-pointer items-baseline gap-5 py-5 text-left"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[30px] leading-[1.05] md:text-[36px]">{p.name}</span>
                    <span className="mt-1.5 block text-[17px] leading-snug text-soft">{p.lead}</span>
                  </span>
                  <span className="shrink-0 text-[15px] font-semibold underline underline-offset-4">{open === i ? 'Fechar' : 'Saiba mais'}</span>
                </button>
              </h3>
              {open === i && (
                <div id={`proc-${p.slug}-painel`} role="region" aria-labelledby={`proc-${p.slug}`} className="proc-panel grid gap-5 pb-12 pt-1">
                  <div className="aspect-[4/3] md:hidden">
                    <Img name={p.image} alt={p.imageAlt} sizes="100vw" />
                  </div>
                  <p className="max-w-[52ch] text-[17px]">{p.body}</p>
                  <p className="max-w-[52ch] text-[17px] text-soft">{p.care}</p>
                  {p.evaluation && (
                    <p className="max-w-[52ch] bg-sand px-4 py-3 text-[15px]">Começa por uma avaliação, que define se o procedimento é indicado para você.</p>
                  )}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link to={`/agendamento?servico=${p.slug}`} className="btn">Agendar {p.name}</Link>
                    {p.evaluation && <Link to="/agendamento?servico=avaliacao" className="link text-[15px]">Agendar só a avaliação</Link>}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

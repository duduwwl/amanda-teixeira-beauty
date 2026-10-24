import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Img } from '../ui/Img'
import { SectionHead } from '../ui/SectionHead'
import { procedures } from '../../content/site'

/** Índice técnico dos procedimentos: uma linha por procedimento, aberta sob demanda. */
export function Procedures() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="procedimentos" aria-labelledby="proc-title" className="frame py-[var(--section)]">
      <SectionHead
        n="03"
        label="Procedimentos"
        id="proc-title"
        title={<>Índice de<br />procedimentos</>}
        aside="Sete procedimentos, todos feitos pela Amanda. Os que mexem com regeneração ou laser começam por uma avaliação."
      />

      <div className="mt-14 md:mt-20">
        <div aria-hidden="true" className="tag hidden grid-cols-[64px_1fr_200px_120px] gap-6 border-b border-ink pb-3 text-soft md:grid">
          <span>Nº</span><span>Procedimento</span><span>Avaliação prévia</span><span className="text-right">Detalhes</span>
        </div>
        <ul className="m-0 list-none border-t border-ink p-0 md:border-t-0">
          {procedures.map((p, i) => {
            const isOpen = open === i
            return (
              <li key={p.slug} data-reveal style={{ '--i': i } as React.CSSProperties} className="border-b border-taupe">
                <h3 className="m-0 font-sans text-[17px] font-normal normal-case tracking-normal [font-stretch:100%]">
                  <button
                    type="button"
                    id={`proc-${p.slug}`}
                    aria-expanded={isOpen}
                    aria-controls={`proc-${p.slug}-painel`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group grid w-full cursor-pointer grid-cols-[40px_1fr_auto] items-baseline gap-x-4 gap-y-1 py-6 text-left transition-colors hover:bg-sand/60 md:grid-cols-[64px_1fr_200px_120px] md:gap-x-6"
                  >
                    <span className="tag text-laser">{String(i + 1).padStart(2, '0')}</span>
                    <span className="min-w-0">
                      <span className="block text-[clamp(17px,5.4vw,26px)] font-semibold uppercase leading-[1] tracking-[-0.03em] [font-stretch:108%] sm:[font-stretch:125%] md:text-[clamp(24px,3vw,40px)]">{p.name}</span>
                      <span className="mt-2 block text-[16px] leading-snug text-soft">{p.lead}</span>
                    </span>
                    <span className="tag col-start-2 row-start-2 text-soft md:col-start-3 md:row-start-1">
                      {p.evaluation ? <span className="text-ink">● Necessária</span> : '○ Não precisa'}
                    </span>
                    <span className="col-start-3 row-start-1 flex items-center justify-end gap-3 md:col-start-4">
                      <span className="tag hidden text-soft md:inline">{isOpen ? 'Fechar' : 'Abrir'}</span>
                      <span aria-hidden="true" className="plus" />
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <div id={`proc-${p.slug}-painel`} role="region" aria-labelledby={`proc-${p.slug}`} className="proc-panel grid gap-6 pb-10 md:grid-cols-[64px_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-6">
                    <div className="aspect-[4/3] bg-sand md:col-start-2">
                      <Img name={p.image} alt={p.imageAlt} sizes="(min-width: 768px) 40vw, 100vw" />
                    </div>
                    <div className="grid content-start gap-4">
                      <p className="max-w-[48ch] text-[17px]">{p.body}</p>
                      <p className="max-w-[48ch] border-l-2 border-laser pl-4 text-[16px] text-soft">{p.care}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
                        <Link to={`/agendamento?servico=${p.slug}`} className="btn max-sm:w-full">Agendar {p.name}</Link>
                        {p.evaluation && <Link to="/agendamento?servico=avaliacao" className="link text-[15px]">Agendar só a avaliação</Link>}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

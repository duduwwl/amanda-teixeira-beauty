import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Img } from '../ui/Img'
import { procedures } from '../../content/site'
import { useNear } from '../../hooks/useNear'

const ProcPreview = lazy(() => import('./ProcPreview'))

/** Mouse de verdade e sem redução de movimento: só então a foto segue o cursor. */
function useFinePointer() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const mq = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    const on = () => setOk(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return ok
}

export function Procedures() {
  const [hover, setHover] = useState<number | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  const [list, setList] = useState<HTMLUListElement | null>(null)
  const near = useNear(list)
  const fine = useFinePointer()
  return (
    <section id="procedimentos" aria-labelledby="proc-title" className="frame py-[var(--section)]">
      <div className="grid gap-8 md:grid-cols-12 md:gap-x-6">
        <h2 id="proc-title" data-reveal className="max-w-[16ch] text-[clamp(44px,6vw,96px)] md:col-span-7">
          O que a Amanda faz, um por um
        </h2>
        <p data-reveal style={{ '--i': 1 } as React.CSSProperties} className="max-w-[38ch] self-end text-[17px] md:col-span-4 md:col-start-9">
          Sete procedimentos, todos feitos por ela. Regeneração e laser começam por uma avaliação.
        </p>
      </div>

      <ul ref={setList} className="m-0 mt-14 list-none p-0 md:mt-20" onPointerLeave={() => setHover(null)}>
        {procedures.map((p, i) => (
          <li key={p.slug} data-reveal style={{ '--i': i } as React.CSSProperties} className="bg-paper even:bg-sand/55"
            onPointerEnter={() => setHover(open === i ? null : i)}>
            <h3 className="m-0 font-sans text-[17px] font-normal tracking-normal">
              <button
                type="button"
                id={`proc-${p.slug}`}
                aria-expanded={open === i}
                aria-controls={`proc-${p.slug}-painel`}
                onClick={() => { setOpen(open === i ? null : i); setHover(null) }}
                className="grid w-full cursor-pointer gap-x-6 gap-y-1.5 px-4 py-6 text-left md:grid-cols-12 md:items-baseline md:px-6"
              >
                <span className="font-display text-[30px] leading-[1.05] md:col-span-5 md:text-[36px]">{p.name}</span>
                <span className="text-[17px] leading-snug text-soft md:col-span-5">{p.lead}</span>
                <span className="text-[15px] font-semibold underline underline-offset-4 md:col-span-2 md:text-right">{open === i ? 'Fechar' : 'Saiba mais'}</span>
              </button>
            </h3>
            {open === i && (
              <div id={`proc-${p.slug}-painel`} role="region" aria-labelledby={`proc-${p.slug}`} className="proc-panel grid gap-6 px-4 pb-10 pt-1 md:grid-cols-12 md:gap-x-6 md:px-6">
                <div className="aspect-[4/3] md:col-span-5">
                  <Img name={p.image} alt={p.imageAlt} sizes="(min-width: 768px) 40vw, 100vw" />
                </div>
                <div className="grid content-start gap-5 md:col-span-6 md:col-start-7">
                  <p className="max-w-[52ch] text-[17px]">{p.body}</p>
                  <p className="max-w-[52ch] text-[17px] text-soft">{p.care}</p>
                  {p.evaluation && (
                    <p className="max-w-[52ch] bg-champagne/35 px-4 py-3 text-[15px]">Começa por uma avaliação, que define se o procedimento é indicado para você.</p>
                  )}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link to={`/agendamento?servico=${p.slug}`} className="btn">Agendar {p.name}</Link>
                    {p.evaluation && <Link to="/agendamento?servico=avaliacao" className="link text-[15px]">Agendar só a avaliação</Link>}
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {near && fine && (
        <Suspense fallback={null}><ProcPreview active={hover} host={list} /></Suspense>
      )}
    </section>
  )
}

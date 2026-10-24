import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Img } from '../ui/Img'
import { heroPhotos } from '../../content/media'
import { brand } from '../../content/site'
import { longDay, timeOf } from '../../lib/time'
import { preloadProps } from '../../lib/preload'
import { backendConfigured } from '../../lib/env'

/** Leitura ao vivo: o próximo horário realmente livre na agenda. */
function NextSlot() {
  const [slot, setSlot] = useState<{ starts_at: string; service_name: string } | null | undefined>(undefined)
  useEffect(() => {
    let alive = true
    // carrega a agenda só depois que a página já apareceu; em modo demonstração
    // nem baixa o cliente do Supabase
    const load = backendConfigured
      ? import('../../services/booking').then((m) => m.nextFreeSlot())
      : import('../../services/demoBackend').then((m) => m.nextFreeSlot())
    load.then((s) => alive && setSlot(s)).catch(() => alive && setSlot(null))
    return () => { alive = false }
  }, [])
  return (
    <div className="border border-paper/25 p-4" aria-live="polite">
      <p className="tag flex items-center text-paper/70"><span className="live mr-2.5" aria-hidden="true" />Agenda online</p>
      <p className="mt-2 text-[17px] leading-snug">
        {slot ? (
          <>Próximo horário livre: <strong className="font-semibold">{longDay(slot.starts_at)}, {timeOf(slot.starts_at)}</strong></>
        ) : (
          'Procedimento, dia e horário em poucos toques.'
        )}
      </p>
    </div>
  )
}

const hero = heroPhotos[0]

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="on-dark relative isolate overflow-hidden bg-field text-paper">
      <div className="frame grid gap-y-10 pb-12 pt-[96px] md:min-h-[100svh] md:grid-cols-12 md:gap-x-6 md:pb-14 md:pt-[112px]">
        <div className="flex flex-col md:col-span-7">
          <p className="tag hero-rise flex flex-wrap gap-x-5 gap-y-1 text-paper/70">
            <span>{brand.role}</span><span>{brand.cityShort}</span><span>Desde {brand.since}</span>
          </p>
          <h1 id="hero-title" className="hero-rise mt-8 text-[clamp(36px,12.6vw,96px)] font-bold uppercase leading-[0.86] md:mt-auto md:text-[min(8.6vw,156px)]" style={{ animationDelay: '80ms' }}>
            Amanda<br />Teixeira<span className="text-champagne">.</span>
          </h1>
        </div>

        <figure className="relative m-0 flex flex-col text-paper/60 md:col-span-5 md:row-span-2 md:self-stretch">
          <div className="ticks text-champagne md:min-h-0 md:flex-1">
            <div className="scan aspect-[4/5] md:aspect-auto md:h-full md:min-h-[520px]" style={{ '--h': '100%' } as React.CSSProperties}>
              <Img name={hero.name} alt={hero.alt} priority focus={hero.focus} sizes="(min-width: 768px) 40vw, calc(100vw - 40px)" />
            </div>
          </div>
          <figcaption className="tag mt-4 flex justify-between gap-4">
            <span className="whitespace-nowrap">Fig. 01</span><span className="text-right">Laser Spectra próprio</span>
          </figcaption>
        </figure>

        <div className="grid gap-8 md:col-span-7 md:grid-cols-7 md:items-end md:gap-x-6">
          <p className="hero-rise max-w-[38ch] text-[19px] leading-snug text-paper/90 md:col-span-4" style={{ animationDelay: '160ms' }}>
            Regeneração com exossomos, remoção a laser e nanopigmentação em Lavras. Sempre com avaliação antes de indicar qualquer procedimento.
          </p>
          <div className="hero-rise grid gap-5 md:col-span-3" style={{ animationDelay: '240ms' }}>
            <NextSlot />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link to="/agendamento" {...preloadProps} className="btn btn-light max-sm:w-full">Agendar atendimento</Link>
              <Link to="/#procedimentos" className="link text-[15px]">Ver procedimentos</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

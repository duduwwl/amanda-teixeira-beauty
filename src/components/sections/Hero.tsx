import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Img } from '../ui/Img'
import { heroPhotos } from '../../content/media'
import { brand } from '../../content/site'
import { longDay, timeOf } from '../../lib/time'
import { preloadProps } from '../../lib/preload'
import { backendConfigured } from '../../lib/env'

/** O próximo horário realmente livre na agenda. */
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
  if (!slot) return <p className="text-[15px]" aria-live="polite">Agenda online: escolha procedimento, dia e horário.</p>
  return (
    <p className="text-[15px]" aria-live="polite">
      Próximo horário livre: <strong className="font-semibold">{longDay(slot.starts_at)}, {timeOf(slot.starts_at)}</strong>
    </p>
  )
}

const photo = heroPhotos[0]

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative isolate h-[100svh] min-h-[560px] overflow-hidden bg-black text-white">
      <div className="hero-photo absolute inset-0 -z-10">
        <Img name={photo.name} alt={photo.alt} priority focus={photo.focus} sizes="100vw" />
        {/* véu preto só embaixo e no topo, onde há texto */}
        <div className="absolute inset-x-0 bottom-0 h-[80%] bg-[linear-gradient(to_top,rgba(0,0,0,0.82),rgba(0,0,0,0.5)_50%,rgba(0,0,0,0))] md:h-[62%] md:bg-[linear-gradient(to_top,rgba(0,0,0,0.74),rgba(0,0,0,0.32)_55%,rgba(0,0,0,0))]" />
        <div className="absolute inset-x-0 top-0 h-[140px] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.42),rgba(0,0,0,0))]" />
      </div>

      <div className="frame absolute inset-x-0 bottom-0 grid gap-7 pb-[max(28px,env(safe-area-inset-bottom))] md:grid-cols-12 md:items-end md:pb-12">
        <div className="md:col-span-7">
          <h1 id="hero-title" className="hero-track text-[clamp(52px,14vw,72px)] leading-[0.92] md:text-[clamp(72px,7.4vw,128px)]">
            Amanda<br />Teixeira
          </h1>
          <p className="hero-rise mt-5 max-w-[34ch] text-[18px] leading-snug sm:text-[20px] md:mt-8" style={{ animationDelay: '120ms' }}>
            {brand.role} em Lavras. Regeneração com exossomos, remoção a laser e micropigmentação, sempre com avaliação antes.
          </p>
        </div>
        <div className="hero-rise flex flex-col gap-4 md:col-span-4 md:col-start-9 md:items-end md:text-right" style={{ animationDelay: '240ms' }}>
          <NextSlot />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:justify-end">
            <Link to="/agendamento" {...preloadProps} className="btn btn-light max-sm:w-full">Agendar atendimento</Link>
            <Link to="/#procedimentos" className="link text-[15px]">Ver os procedimentos</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

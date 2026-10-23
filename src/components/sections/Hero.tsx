import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Img } from '../ui/Img'
import { heroPhotos } from '../../content/media'
import { brand } from '../../content/site'
import { backendConfigured } from '../../lib/env'
import { longDay, timeOf } from '../../lib/time'

/** Assinatura de movimento: a foto principal troca devagar, como luz mudando na sala. */
function useCrossfade(count: number, hold = 5600) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (count < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let t: number | undefined
    const tick = () => { t = window.setTimeout(() => { if (!document.hidden) setI((v) => (v + 1) % count); tick() }, hold) }
    tick()
    return () => window.clearTimeout(t)
  }, [count, hold])
  return i
}

/** Elemento vivo: o próximo horário realmente livre na agenda. */
function NextSlot() {
  const [slot, setSlot] = useState<{ starts_at: string; service_name: string } | null | undefined>(undefined)
  useEffect(() => {
    if (!backendConfigured) return setSlot(null)
    let alive = true
    // carrega o cliente da agenda só depois que a página já apareceu
    import('../../services/booking').then((m) => m.nextFreeSlot()).then((s) => alive && setSlot(s)).catch(() => alive && setSlot(null))
    return () => { alive = false }
  }, [])
  if (!slot) return <p className="text-[15px] text-paper/85" aria-live="polite">Escolha procedimento, dia e horário em poucos toques.</p>
  return (
    <p className="text-[15px] text-paper/90" aria-live="polite">
      Próximo horário livre: <strong className="font-semibold text-paper">{longDay(slot.starts_at)}, {timeOf(slot.starts_at)}</strong>
    </p>
  )
}

export function Hero() {
  const active = useCrossfade(heroPhotos.length)
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative isolate h-[100svh] min-h-[600px] overflow-hidden bg-field text-paper">
      <div className="absolute inset-0 -z-10">
        {heroPhotos.map((p, i) => (
          <div
            key={p.name}
            className="hero-photo absolute inset-0"
            style={{ opacity: i === active ? 1 : 0 }}
            aria-hidden={i !== active}
          >
            <Img name={p.name} alt={i === 0 ? p.alt : ''} priority={i === 0} focus={p.focus} sizes="100vw" />
          </div>
        ))}
        {/* véu neutro só embaixo, onde está o texto */}
        <div className="absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(to_top,rgba(20,12,8,0.78),rgba(20,12,8,0.35)_55%,rgba(20,12,8,0))]" />
        <div className="absolute inset-x-0 top-0 h-[140px] bg-[linear-gradient(to_bottom,rgba(20,12,8,0.45),rgba(20,12,8,0))]" />
      </div>

      <div className="frame absolute inset-x-0 bottom-0 grid gap-8 pb-[max(32px,env(safe-area-inset-bottom))] md:grid-cols-12 md:items-end md:pb-12">
        <div className="md:col-span-7">
          <h1 id="hero-title" className="hero-rise text-[clamp(56px,11.5vw,72px)] leading-[0.92] md:text-[clamp(72px,7.4vw,128px)]">
            Amanda<br />Teixeira
          </h1>
          <p className="hero-rise mt-6 max-w-[34ch] text-[20px] leading-snug text-paper/95 md:mt-8" style={{ animationDelay: '120ms' }}>
            {brand.role} em Lavras. Regeneração com exossomos, remoção a laser e micropigmentação, sempre com avaliação antes.
          </p>
        </div>
        <div className="hero-rise flex flex-col gap-4 md:col-span-4 md:col-start-9 md:items-end md:text-right" style={{ animationDelay: '240ms' }}>
          <NextSlot />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:justify-end">
            <Link to="/agendamento" className="btn btn-light">Agendar atendimento</Link>
            <Link to="/#procedimentos" className="link text-[15px]">Conhecer os procedimentos</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

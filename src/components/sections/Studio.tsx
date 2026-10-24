import { lazy, Suspense, useState } from 'react'
import { Img } from '../ui/Img'
import { DECK, TILT } from './studioDeck'
import { useNear } from '../../hooks/useNear'

const StudioDeckLive = lazy(() => import('./StudioDeckLive'))

const POINTS = [
  { t: 'Avaliação antes de tudo', d: 'Escuta, imagem ampliada dos fios e da pele, e só então a indicação.' },
  { t: 'Laser Spectra próprio', d: 'A remoção a laser deixou de depender de data marcada: é no dia que você escolher.' },
  { t: 'Café na chegada', d: 'A Amanda oferece um café para quem chega ao studio.' },
]

/** A mesma pilha, parada: aparece na página pré-renderizada e enquanto a versão animada carrega. */
function StudioDeckStill() {
  return (
    <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-x-6">
      <div className="relative mx-auto aspect-[4/5] w-[min(78vw,420px)] md:col-span-6 md:col-start-2 md:w-full md:max-w-[460px]">
        {DECK.map((p, depth) => (
          <figure key={p.name} className="absolute inset-0 m-0 bg-sand" aria-hidden={depth > 0}
            style={{ zIndex: DECK.length - depth, transform: `translateY(${depth * 16}px) scale(${1 - depth * 0.03}) rotate(${TILT[depth]}deg)` }}>
            <Img name={p.name} alt={depth === 0 ? p.alt : ''} sizes="(min-width: 768px) 460px, 78vw" />
          </figure>
        ))}
      </div>
      <div className="md:col-span-4 md:col-start-8 md:pb-6">
        <p className="font-display text-[30px] leading-[1.1] md:text-[36px]">{DECK[0].caption}</p>
        <p className="mt-2 text-[15px] text-soft">Foto 1 de {DECK.length}</p>
      </div>
    </div>
  )
}

/** O studio: três fatos curtos e a pilha de fotos que a pessoa folheia. */
export function Studio() {
  const [box, setBox] = useState<HTMLDivElement | null>(null)
  const near = useNear(box)
  return (
    <section aria-labelledby="studio-title" className="py-[var(--section)]">
      <div className="frame grid gap-10 md:grid-cols-12 md:gap-x-6">
        <h2 id="studio-title" data-reveal className="text-[clamp(44px,6vw,96px)] md:col-span-5 md:col-start-1">
          O studio
        </h2>
        <ul className="m-0 grid list-none gap-7 p-0 sm:grid-cols-3 md:col-span-7 md:col-start-6 md:gap-6">
          {POINTS.map((p, i) => (
            <li key={p.t} data-reveal style={{ '--i': i + 1 } as React.CSSProperties}>
              <h3 className="font-sans text-[17px] font-semibold tracking-normal">{p.t}</h3>
              <p className="mt-1.5 text-[17px]">{p.d}</p>
            </li>
          ))}
        </ul>
      </div>

      <div ref={setBox} className="frame mt-14 md:mt-20">
        {near ? (
          <Suspense fallback={<StudioDeckStill />}><StudioDeckLive /></Suspense>
        ) : (
          <StudioDeckStill />
        )}
      </div>
      <p className="frame mt-10 text-[17px] text-soft">Studio Amanda Teixeira, Rua Dr. Álvaro Botelho, Centro de Lavras. Atendimento com hora marcada.</p>
    </section>
  )
}

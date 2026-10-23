import { Img } from '../ui/Img'
import { studioPhotos } from '../../content/media'

const POINTS = [
  { t: 'Uma cliente por vez', d: 'Hora marcada e o tempo do procedimento reservado só para você.' },
  { t: 'Avaliação individual', d: 'Indicação feita a partir do que foi visto em você, não de um pacote pronto.' },
  { t: 'Equipamento à vista', d: 'Imagem ampliada para avaliar fios e pele, LED e laser nos protocolos que pedem.' },
]

/** Faixa de painéis desiguais que se abrem no hover. */
export function Studio() {
  const grow = [5, 2, 3, 2]
  return (
    <section aria-labelledby="studio-title" className="py-[var(--section)]">
      <div className="frame grid gap-10 md:grid-cols-12 md:gap-x-6">
        <h2 id="studio-title" data-reveal className="text-[clamp(44px,6vw,96px)] md:col-span-5 md:col-start-1">
          O studio por dentro
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

      <div data-reveal className="band mt-14 grid h-[84svh] grid-cols-[36fr_28fr_36fr] grid-rows-2 md:mt-20 md:flex md:h-[68svh]">
        {studioPhotos.map((p, i) => (
          <figure
            key={p.name}
            className={`band-panel relative m-0 min-w-0 overflow-hidden ${['max-md:col-span-2', '', '', 'max-md:col-span-2'][i]}`}
            style={{ '--g': grow[i] } as React.CSSProperties}
          >
            <Img name={p.name} alt={p.alt} sizes="(min-width: 768px) 40vw, 60vw" />
            {i === 0 && (
              <figcaption className="absolute left-0 top-0 max-w-[80%] bg-[linear-gradient(135deg,rgba(20,12,8,0.6),rgba(20,12,8,0)_70%)] p-6 pr-16 pb-16 font-display text-[30px] leading-[1.05] text-paper">
                Hora marcada
              </figcaption>
            )}
          </figure>
        ))}
      </div>
      <p className="frame mt-5 text-[17px] text-soft">Atendimento no studio, com o tempo de cada procedimento reservado na agenda.</p>
    </section>
  )
}

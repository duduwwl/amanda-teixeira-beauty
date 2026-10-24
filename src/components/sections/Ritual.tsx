import { Img } from '../ui/Img'
import { ritualPhotos } from '../../content/media'

// Ideia da página: o ritual que a Amanda publica — "te escutando, te avaliando,
// te consultando" — vira a ordem do atendimento e a ordem do agendamento.
const STEPS = [
  { t: 'Conversa', d: 'Você conta o que quer mudar e o que já fez antes.' },
  { t: 'Avaliação', d: 'Pele, fios ou pigmento antigo são examinados de perto, com imagem ampliada quando precisa.' },
  { t: 'Indicação', d: 'A Amanda indica o procedimento, o número de sessões e os cuidados de cada um.' },
]

export function Ritual() {
  return (
    <section aria-labelledby="ritual-title" className="frame py-[var(--section)]">
      <div className="grid gap-y-14 md:grid-cols-12 md:gap-x-6">
        <h2 id="ritual-title" data-reveal className="text-[clamp(44px,6vw,96px)] md:col-span-9">
          Como é o<br />atendimento
        </h2>

        <figure data-reveal="mask" className="m-0 aspect-[3/4] md:col-span-4 md:col-start-2 md:mt-24" style={{ '--i': 1 } as React.CSSProperties}>
          <Img name={ritualPhotos[0].name} alt={ritualPhotos[0].alt} sizes="(min-width: 768px) 33vw, 100vw" />
        </figure>

        <div className="flex flex-col gap-14 md:col-span-6 md:col-start-7">
          <figure data-reveal="mask" className="m-0 aspect-[16/10]" style={{ '--i': 2 } as React.CSSProperties}>
            <Img name={ritualPhotos[1].name} alt={ritualPhotos[1].alt} sizes="(min-width: 768px) 50vw, 100vw" />
          </figure>
          <div className="grid gap-9 sm:grid-cols-[1fr_auto] sm:gap-x-10">
            <ol className="m-0 grid list-none gap-9 p-0">
              {STEPS.map((s, i) => (
                <li key={s.t} data-reveal style={{ '--i': i + 3 } as React.CSSProperties} className="max-w-[40ch]">
                  <h3 className="text-[36px] md:text-[36px]">{s.t}</h3>
                  <p className="mt-2 text-[17px]">{s.d}</p>
                </li>
              ))}
            </ol>
            <div data-reveal="mask" className="hidden aspect-square w-[min(220px,18vw)] self-end sm:block" style={{ '--i': 6 } as React.CSSProperties}>
              <Img name={ritualPhotos[2].name} alt={ritualPhotos[2].alt} sizes="220px" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

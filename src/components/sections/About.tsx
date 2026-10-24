import { Img } from '../ui/Img'
import { aboutPhotos } from '../../content/media'
import { brand } from '../../content/site'

/** Título fixo à esquerda enquanto os retratos passam à direita. */
export function About() {
  return (
    <section id="sobre" aria-labelledby="sobre-title" className="frame bg-sand py-[var(--section)]">
      <div className="grid gap-12 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-[18svh]">
            <h2 id="sobre-title" data-reveal className="text-[clamp(56px,9vw,132px)] leading-[0.86]">
              Quem<br />atende
            </h2>
            <p data-reveal style={{ '--i': 1 } as React.CSSProperties} className="mt-8 max-w-[38ch] text-[20px]">
              {brand.name} trabalha com biomedicina estética em Lavras e faz pessoalmente os atendimentos do studio, da avaliação ao retorno. O lema dela é <span className="font-semibold">“{brand.motto}”</span>
            </p>
          </div>
        </div>

        <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-12 p-0 md:col-span-7 md:col-start-6 md:gap-x-6">
          {aboutPhotos.map((p, i) => (
            <li key={p.name} className={i === 0 ? 'col-span-2' : 'col-span-2 sm:col-span-1'}>
              <figure data-reveal="mask" className={`m-0 ${i === 0 ? 'aspect-[4/3]' : 'aspect-[4/5]'}`}>
                <Img name={p.name} alt={p.alt} sizes={i === 0 ? '(min-width: 768px) 55vw, 100vw' : '(min-width: 640px) 27vw, 100vw'} focus={i === 0 ? '50% 30%' : undefined} />
              </figure>
              <div data-reveal style={{ '--i': 1 } as React.CSSProperties} className="mt-5 max-w-[34ch]">
                <h3 className="font-sans text-[20px] font-semibold tracking-normal">{p.title}</h3>
                <p className="mt-1.5 text-[17px]">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

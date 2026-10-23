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
              {brand.name}. A frase da bio dela resume o jeito de trabalhar: <em className="not-italic font-semibold">“{brand.motto}”</em> Cada atendimento é dela, do primeiro contato ao cuidado depois.
            </p>
          </div>
        </div>

        <ul className="m-0 grid list-none gap-16 p-0 md:col-span-6 md:col-start-7 md:gap-[12svh]">
          {aboutPhotos.map((p, i) => (
            <li key={p.name} className={i % 2 ? 'w-[78%] justify-self-end md:w-[70%]' : 'w-[88%] md:w-[84%]'}>
              <figure data-reveal="mask" className="m-0 aspect-[4/5]">
                <Img name={p.name} alt={p.alt} sizes="(min-width: 768px) 40vw, 80vw" />
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

import { Img } from '../ui/Img'
import { SectionHead } from '../ui/SectionHead'
import { aboutPhotos } from '../../content/media'
import { brand, courses } from '../../content/site'

const SHEET = [
  ['Área', brand.role],
  ['Studio', `Desde ${brand.since}, Centro de Lavras`],
  ['Equipamento', 'Laser Spectra próprio'],
  ['Protocolos', 'RegenereBrows e RegenereHair, com exossomos'],
  ['Ensino', `${courses.length} cursos profissionais`],
  ['Na TV', 'Programa Caminhos para o Sucesso'],
  ['Google', `Nota ${brand.googleRating.value} em ${brand.googleRating.count} avaliações`],
]

/** Ficha da profissional: retrato grande, dados em tabela e duas fotos de apoio. */
export function About() {
  const [main, ...rest] = aboutPhotos
  return (
    <section id="sobre" aria-labelledby="sobre-title" className="on-dark bg-field py-[var(--section)] text-paper">
      <div className="frame">
        <SectionHead n="02" label="A profissional" id="sobre-title" title={<>Quem<br />atende</>} />

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-x-6">
          <figure className="m-0 self-start md:sticky md:top-[96px] md:col-span-5">
            <div className="ticks text-champagne">
              <div data-reveal="mask" className="aspect-[4/5]">
                <Img name={main.name} alt={main.alt} sizes="(min-width: 768px) 40vw, 100vw" />
              </div>
            </div>
            <figcaption className="tag mt-4 text-paper/60">Fig. 05 · {main.title}</figcaption>
          </figure>

          <div className="md:col-span-6 md:col-start-7">
            <p data-reveal className="text-[clamp(22px,2.3vw,32px)] font-medium leading-[1.2] tracking-[-0.015em] [font-stretch:108%]">
              {main.text} A frase da bio resume o jeito de trabalhar: <span className="text-champagne">“{brand.motto}”</span>
            </p>

            <dl data-reveal style={{ '--i': 1 } as React.CSSProperties} className="m-0 mt-12 border-t border-paper/25">
              {SHEET.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(96px,32%)_1fr] gap-4 border-b border-paper/15 py-3.5">
                  <dt className="tag pt-1 text-paper/55">{k}</dt>
                  <dd className="m-0 text-[17px]">{v}</dd>
                </div>
              ))}
            </dl>

            <ul className="m-0 mt-12 grid list-none gap-6 p-0 sm:grid-cols-2">
              {rest.map((p, i) => (
                <li key={p.name} data-reveal style={{ '--i': i + 2 } as React.CSSProperties}>
                  <div className="aspect-square"><Img name={p.name} alt={p.alt} sizes="(min-width: 768px) 22vw, 50vw" focus="50% 25%" /></div>
                  <h3 className="mt-4 text-[20px] uppercase">{p.title}</h3>
                  <p className="mt-1.5 text-[15px] text-paper/75">{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

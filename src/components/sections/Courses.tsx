import { Img } from '../ui/Img'
import { SectionHead } from '../ui/SectionHead'
import { coursePhotos } from '../../content/media'
import { brand, courses } from '../../content/site'
import { whatsappLink } from '../../lib/whatsapp'

/** Grade de cursos como uma lista de turmas: número grande, nome, formato e resumo. */
export function Courses() {
  const ask = whatsappLink('Olá, Amanda! Quero saber das próximas turmas dos cursos.')
  return (
    <section id="cursos" aria-labelledby="cursos-title" className="frame py-[var(--section)]">
      <SectionHead n="06" label="Cursos" id="cursos-title" title={<>Para quem<br />quer aprender</>} aside="As técnicas do studio, ensinadas por quem atende todos os dias. Turmas presenciais em Lavras e aulas individuais." />

      <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-x-6">
        <ol className="m-0 list-none border-t border-ink p-0 md:col-span-8">
          {courses.map((c, i) => (
            <li key={c.name} data-reveal style={{ '--i': i } as React.CSSProperties}
              className="grid grid-cols-[56px_1fr] gap-x-4 border-b border-taupe py-7 sm:grid-cols-[96px_1fr] md:gap-x-6">
              <span aria-hidden="true" className="text-[clamp(34px,4.4vw,64px)] font-bold leading-[0.85] tracking-[-0.05em] text-laser [font-stretch:125%]">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <p className="tag text-soft">{c.audience}</p>
                <h3 className="mt-2 text-[clamp(24px,2.6vw,34px)] uppercase leading-[1]">{c.name}</h3>
                <p className="mt-3 max-w-[54ch] text-[16px] text-soft">
                  {c.summary}{c.topics && <> {c.topics.join('. ')}.</>}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="grid grid-cols-2 gap-4 self-start md:sticky md:top-[96px] md:col-span-4">
          {[coursePhotos[0], coursePhotos[3]].map((p, i) => (
            <figure key={p.name} className="m-0">
              <div data-reveal="mask" className="aspect-[3/4]"><Img name={p.name} alt={p.alt} sizes="(min-width: 768px) 16vw, 50vw" focus="50% 22%" /></div>
              <figcaption className="tag mt-2 text-soft">Fig. {String(i + 9).padStart(2, '0')}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3">
        <a href={ask} target="_blank" rel="noopener noreferrer" className="btn max-sm:w-full">Quero saber das turmas</a>
        <a href={brand.instagram.url} target="_blank" rel="noopener noreferrer" className="link text-[15px]">Turmas anteriores no Instagram</a>
      </div>
    </section>
  )
}

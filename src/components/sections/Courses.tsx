import { Img } from '../ui/Img'
import { coursePhotos } from '../../content/media'
import { brand, courses } from '../../content/site'
import { whatsappLink } from '../../lib/whatsapp'

/** Grade escalonada com células vazias; o título ocupa a célula livre da primeira linha. */
export function Courses() {
  const ask = whatsappLink('Olá, Amanda! Quero saber das próximas turmas dos cursos.')
  return (
    <section id="cursos" aria-labelledby="cursos-title" className="frame bg-sand py-[var(--section)]">
      <div className="grid grid-cols-2 gap-[10px] md:grid-cols-4 md:gap-4">
        <figure data-reveal="mask" className="col-span-2 m-0 aspect-[3/2]">
          <Img name={coursePhotos[0].name} alt={coursePhotos[0].alt} sizes="(min-width: 768px) 50vw, 100vw" />
        </figure>
        <div className="col-span-2 self-end py-6 md:col-span-1 md:py-0">
          <h2 id="cursos-title" data-reveal className="text-[clamp(44px,6vw,96px)]">Cursos<br />profissionais</h2>
        </div>
        <figure data-reveal="mask" className="m-0 aspect-[4/5] max-md:col-start-2" style={{ '--i': 1 } as React.CSSProperties}>
          <Img name={coursePhotos[1].name} alt={coursePhotos[1].alt} sizes="(min-width: 768px) 25vw, 50vw" />
        </figure>

        <div className="col-span-2 flex flex-col justify-end gap-6 py-8 md:col-span-1 md:col-start-1 md:row-start-2 md:py-0 md:pr-6">
          {courses.length === 0 ? (
            <>
              <p data-reveal className="text-[20px]">A Amanda também forma profissionais: as mesmas técnicas do studio, ensinadas por quem atende todos os dias.</p>
              <p data-reveal style={{ '--i': 1 } as React.CSSProperties} className="text-[17px] text-soft">Turmas, datas, conteúdo e investimento são passados pelo WhatsApp.</p>
            </>
          ) : (
            <ul className="m-0 grid list-none gap-6 p-0">
              {courses.map((c) => (
                <li key={c.name}>
                  <h3 className="font-display text-[30px]">{c.name}</h3>
                  <p className="text-[15px] text-soft">{c.audience}</p>
                  <p className="mt-1 text-[17px]">{c.summary}</p>
                  {c.topics && <ul className="mt-2 list-disc pl-5 text-[15px]">{c.topics.map((t) => <li key={t}>{t}</li>)}</ul>}
                </li>
              ))}
            </ul>
          )}
          <div>
            <a href={ask} target="_blank" rel="noopener noreferrer" className="btn">Quero saber das turmas</a>
          </div>
        </div>
        <figure data-reveal="mask" className="m-0 aspect-[4/5] md:col-start-2 md:row-start-2 md:mt-24" style={{ '--i': 2 } as React.CSSProperties}>
          <Img name={coursePhotos[2].name} alt={coursePhotos[2].alt} sizes="(min-width: 768px) 25vw, 50vw" />
        </figure>
        <figure data-reveal="mask" className="m-0 aspect-[4/5] md:col-start-3 md:row-start-2" style={{ '--i': 3 } as React.CSSProperties}>
          <Img name={coursePhotos[3].name} alt={coursePhotos[3].alt} sizes="(min-width: 768px) 25vw, 50vw" />
        </figure>
        <p className="col-span-2 self-end text-[13px] text-soft md:col-span-1 md:col-start-4 md:row-start-2">
          Novidades das turmas também saem no {brand.instagram.handle}.
        </p>
      </div>
    </section>
  )
}

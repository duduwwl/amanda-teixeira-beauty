import { Img } from '../ui/Img'
import { coursePhotos } from '../../content/media'
import { brand, courses } from '../../content/site'
import { whatsappLink } from '../../lib/whatsapp'

/** Lista de cursos à esquerda; fotos em tamanhos desiguais à direita. */
export function Courses() {
  const ask = whatsappLink('Olá, Amanda! Quero saber das próximas turmas dos cursos.')
  return (
    <section id="cursos" aria-labelledby="cursos-title" className="frame bg-sand py-[var(--section)]">
      <div className="grid gap-y-14 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-6 lg:col-span-5">
          <h2 id="cursos-title" data-reveal className="text-[clamp(44px,6vw,96px)]">Cursos<br />profissionais</h2>
          <p data-reveal style={{ '--i': 1 } as React.CSSProperties} className="mt-8 max-w-[42ch] text-[20px]">
            As técnicas do studio, ensinadas por quem atende todos os dias. Turmas presenciais em Lavras e aulas individuais.
          </p>

          <ul className="m-0 mt-12 grid list-none gap-9 p-0">
            {courses.map((c, i) => (
              <li key={c.name} data-reveal style={{ '--i': i + 2 } as React.CSSProperties} className="max-w-[46ch]">
                <h3 className="text-[30px] leading-[1.05]">{c.name}</h3>
                <p className="mt-2 text-[17px]">
                  <span className="font-semibold">{c.audience}.</span> {c.summary}
                  {c.topics && <> {c.topics.join('. ')}.</>}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={ask} target="_blank" rel="noopener noreferrer" className="btn max-sm:w-full">Quero saber das turmas</a>
            <a href={brand.instagram.url} target="_blank" rel="noopener noreferrer" className="link text-[15px]">Turmas anteriores no Instagram</a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[10px] self-start md:col-span-6 md:col-start-7 md:gap-4 lg:col-span-6 lg:col-start-7">
          <figure data-reveal="mask" className="col-span-2 m-0 aspect-[4/5] md:aspect-[3/4]">
            <Img name={coursePhotos[0].name} alt={coursePhotos[0].alt} sizes="(min-width: 768px) 45vw, 100vw" />
          </figure>
          <figure data-reveal="mask" className="m-0 aspect-[4/5]">
            <Img name={coursePhotos[1].name} alt={coursePhotos[1].alt} sizes="(min-width: 768px) 22vw, 50vw" />
          </figure>
          <figure data-reveal="mask" className="m-0 mt-16 aspect-[4/5]">
            <Img name={coursePhotos[3].name} alt={coursePhotos[3].alt} sizes="(min-width: 768px) 22vw, 50vw" focus="50% 20%" />
          </figure>
        </div>
      </div>
    </section>
  )
}

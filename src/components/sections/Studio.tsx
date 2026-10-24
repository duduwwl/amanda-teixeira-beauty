import { Img } from '../ui/Img'
import { SectionHead } from '../ui/SectionHead'
import { studioPhotos } from '../../content/media'

const POINTS = [
  { t: 'Avaliação antes de tudo', d: 'Escuta, imagem ampliada dos fios e da pele, e só então a indicação.' },
  { t: 'Laser Spectra próprio', d: 'A remoção a laser deixou de depender de data marcada: é no dia que você escolher.' },
  { t: 'Um cafezinho', d: 'Quem chega é recebida com calma, e a Amanda faz questão de oferecer um café.' },
]
const SHAPE = ['md:col-span-5 aspect-[4/5]', 'md:col-span-3 aspect-[3/4] md:mt-24', 'md:col-span-4 aspect-[4/5] md:mt-10']

/** O studio em três fotos de alturas diferentes e três fatos curtos. No celular, faixa que rola de lado. */
export function Studio() {
  const photos = studioPhotos.slice(0, 3)
  return (
    <section aria-labelledby="studio-title" className="bg-sand py-[var(--section)]">
      <div className="frame">
        <SectionHead n="04" label="O studio" id="studio-title" title={<>Centro<br />de Lavras</>} aside="Studio Amanda Teixeira, Rua Dr. Álvaro Botelho. Atendimento com hora marcada, uma cliente por vez." />
        <ul className="m-0 mt-14 grid list-none gap-x-6 gap-y-8 border-t border-ink p-0 pt-8 sm:grid-cols-3 md:mt-20">
          {POINTS.map((p, i) => (
            <li key={p.t} data-reveal style={{ '--i': i } as React.CSSProperties}>
              <p className="tag text-laser">S-0{i + 1}</p>
              <h3 className="mt-3 text-[22px] uppercase">{p.t}</h3>
              <p className="mt-2 max-w-[34ch] text-[16px] text-soft">{p.d}</p>
            </li>
          ))}
        </ul>
      </div>

      <div tabIndex={0} role="region" aria-label="Fotos do studio (role para o lado)" className="strip frame mt-14 flex gap-4 overflow-x-auto pb-4 md:mt-20 md:grid md:grid-cols-12 md:gap-6 md:overflow-visible md:pb-0">
        {photos.map((p, i) => (
          <figure key={p.name} className={`m-0 w-[78vw] shrink-0 md:w-auto ${SHAPE[i]}`}>
            <div className="h-full" data-reveal="mask"><Img name={p.name} alt={p.alt} sizes="(min-width: 768px) 40vw, 78vw" /></div>
            <figcaption className="tag mt-3 text-soft">Fig. 0{i + 6}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

import { Img } from '../ui/Img'
import { SectionHead } from '../ui/SectionHead'
import { ritualPhotos } from '../../content/media'

// O ritual que a Amanda publica — "te escutando, te avaliando, te consultando" —
// vira um protocolo em três etapas, na ordem do atendimento.
const STEPS = [
  { code: 'P-01', t: 'Escutar', d: 'O que te incomoda, o que você já fez, o que espera. Sem pressa.' },
  { code: 'P-02', t: 'Avaliar', d: 'Pele, fios ou pigmento antigo examinados de perto, em imagem ampliada quando precisa.' },
  { code: 'P-03', t: 'Indicar', d: 'Só então o procedimento, o número de sessões e os cuidados. Às vezes a resposta é esperar.' },
]
const ORDER = [1, 0, 2] // atendimento, avaliação no tablet, resultado

export function Ritual() {
  return (
    <section aria-labelledby="ritual-title" className="frame py-[var(--section)]">
      <SectionHead
        n="01"
        label="Método"
        id="ritual-title"
        title={<>Avaliar antes<br />de indicar</>}
        aside="Nenhum procedimento começa sem conversa. É o mesmo caminho na agenda online: quem precisa, marca primeiro a avaliação."
      />

      <ol className="m-0 mt-14 grid list-none border-t border-ink p-0 md:mt-20 md:grid-cols-3">
        {STEPS.map((s, i) => {
          const photo = ritualPhotos[ORDER[i]]
          return (
            <li key={s.code} data-reveal style={{ '--i': i } as React.CSSProperties}
              className="grid gap-5 border-b border-taupe py-8 md:border-b-0 md:border-l md:px-6 md:py-10 md:first:border-l-0 md:first:pl-0 md:last:pr-0">
              <p className="tag flex justify-between text-soft"><span className="text-laser">{s.code}</span><span>Fig. 0{i + 2}</span></p>
              <div className="aspect-[4/3] bg-sand">
                <Img name={photo.name} alt={photo.alt} sizes="(min-width: 768px) 30vw, 100vw" />
              </div>
              <div>
                <h3 className="text-[32px] uppercase">{s.t}</h3>
                <p className="mt-2 max-w-[36ch] text-[17px] text-soft">{s.d}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

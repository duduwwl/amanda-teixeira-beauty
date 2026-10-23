import { testimonials } from '../../content/site'

/** Só aparece quando houver depoimentos reais, autorizados por escrito. */
export function Testimonials() {
  if (testimonials.length === 0) return null
  return (
    <section aria-labelledby="dep-title" className="frame py-[var(--section)]">
      <h2 id="dep-title" data-reveal className="text-[clamp(44px,6vw,96px)]">Quem já passou por aqui</h2>
      <ul className="m-0 mt-14 grid list-none gap-14 p-0 md:grid-cols-12">
        {testimonials.map((t, i) => (
          <li key={i} data-reveal className={`md:col-span-5 ${i % 2 ? 'md:col-start-8 md:mt-24' : 'md:col-start-1'}`}>
            <blockquote className="m-0 font-display text-[clamp(24px,2.4vw,34px)] leading-[1.15]">“{t.quote}”</blockquote>
            <p className="mt-4 text-[15px]"><strong className="font-semibold">{t.author}</strong>{t.procedure && <span className="text-soft">, {t.procedure}</span>}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

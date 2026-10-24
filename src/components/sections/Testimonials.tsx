import { brand, testimonials } from '../../content/site'

/** Faixa vermelha com a nota do Google e as avaliações públicas, lado a lado. */
export function Testimonials() {
  if (testimonials.length === 0) return null
  return (
    <section aria-labelledby="dep-title" className="on-laser bg-laser py-[var(--section)] text-white">
      <div className="frame grid gap-12 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-4">
          <p className="tag text-white">07 · Avaliações</p>
          <h2 id="dep-title" className="sr-only">Avaliações no Google</h2>
          <p aria-hidden="true" className="mt-6 text-[clamp(96px,14vw,220px)] font-bold leading-[0.8] tracking-[-0.06em] [font-stretch:125%]">{brand.googleRating.value}</p>
          <p className="mt-5 text-[17px]">Nota {brand.googleRating.value} de 5 no Google, em {brand.googleRating.count} avaliações públicas do studio.</p>
        </div>
        <ul className="m-0 grid list-none gap-0 p-0 md:col-span-8 md:col-start-5">
          {testimonials.map((t, i) => (
            <li key={i} data-reveal style={{ '--i': i } as React.CSSProperties} className="border-t border-white/40 py-7 first:pt-0 first:border-t-0 md:first:border-t md:first:pt-7">
              <blockquote className="m-0 text-[clamp(20px,2vw,28px)] font-medium leading-[1.25] tracking-[-0.01em] [font-stretch:106%]">“{t.quote}”</blockquote>
              <p className="tag mt-4 text-white">{t.author}{t.procedure && ` · ${t.procedure}`}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

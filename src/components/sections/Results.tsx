import { useEffect, useRef, useState } from 'react'
import { Img } from '../ui/Img'
import { results, type ResultCategory } from '../../content/media'
import { brand } from '../../content/site'

const CATS: ('Todos' | ResultCategory)[] = ['Todos', 'Sobrancelhas', 'Regeneração', 'Laser', 'Brow lamination']

function Lightbox({ start, onClose }: { start: number; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [cat, setCat] = useState<(typeof CATS)[number]>('Todos')
  const list = cat === 'Todos' ? results : results.filter((r) => r.category === cat)
  const [i, setI] = useState(start)
  const idx = Math.min(i, list.length - 1)
  const item = list[idx]

  useEffect(() => {
    const d = ref.current!
    d.showModal()
    document.documentElement.style.overflow = 'hidden'
    return () => { document.documentElement.style.overflow = '' }
  }, [])

  const go = (n: number) => setI((idx + n + list.length) % list.length)
  return (
    <dialog
      ref={ref}
      aria-label="Galeria de resultados"
      onClose={onClose}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }}
      className="on-dark lightbox m-0 h-[100dvh] max-h-none w-screen max-w-none bg-field p-0 text-paper backdrop:bg-black/70"
    >
      <div className="frame grid h-full grid-rows-[auto_1fr_auto] gap-4 py-4 md:py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="group" aria-label="Filtrar por categoria" className="flex flex-wrap gap-x-5 gap-y-1">
            {CATS.map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => { setCat(c); setI(0) }}
                className={`min-h-[44px] text-[15px] ${cat === c ? 'font-semibold underline underline-offset-4' : 'text-paper/75 hover:text-paper'}`}>
                {c}
              </button>
            ))}
          </div>
          <button type="button" className="btn btn-light !min-h-[44px]" onClick={() => ref.current?.close()} autoFocus>Fechar</button>
        </div>

        <figure className="m-0 grid min-h-0 grid-rows-[1fr_auto] gap-3">
          {item ? (
            <div key={item.name} className="lb-img relative min-h-0">
              <Img name={item.name} alt={item.alt} sizes="100vw" className="!object-contain" />
            </div>
          ) : <p>Sem fotos nesta categoria ainda.</p>}
          {item && (
            <figcaption className="flex flex-wrap items-baseline justify-between gap-2 text-[15px]">
              <span><strong className="font-semibold">{item.caption}</strong> <span className="text-paper/70">{item.category}</span></span>
              <span className="text-paper/70" aria-live="polite">{idx + 1} de {list.length}</span>
            </figcaption>
          )}
        </figure>

        <div className="flex items-center justify-between gap-4">
          <button type="button" className="btn btn-quiet" onClick={() => go(-1)} disabled={list.length < 2}>Anterior</button>
          <p className="hidden max-w-[48ch] text-center text-[13px] text-paper/65 sm:block">Fotos publicadas com autorização. Cada pessoa responde de um jeito; o resultado de uma não se repete igual em outra.</p>
          <button type="button" className="btn btn-quiet" onClick={() => go(1)} disabled={list.length < 2}>Próxima</button>
        </div>
      </div>
    </dialog>
  )
}

/** Galeria em grade: todas as fotos à vista, com legenda; clique abre a foto ampliada. */
export function Results() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="resultados" aria-labelledby="res-title" className="frame py-[var(--section)]">
      <div className="grid gap-6 md:grid-cols-12 md:items-end md:gap-x-6">
        <h2 id="res-title" data-reveal className="text-[clamp(44px,6vw,96px)] md:col-span-6">Resultados</h2>
        <p data-reveal style={{ '--i': 1 } as React.CSSProperties} className="max-w-[44ch] text-[17px] md:col-span-5 md:col-start-8">
          Sobrancelhas, regeneração, laser e brow lamination. Fotos de clientes do studio, publicadas pela Amanda com autorização.
        </p>
      </div>

      <ul className="m-0 mt-12 grid list-none grid-cols-2 gap-x-3 gap-y-8 p-0 sm:gap-x-4 md:mt-16 md:grid-cols-4 md:gap-x-6 md:gap-y-12">
        {results.map((r, i) => (
          <li key={r.name} data-reveal style={{ '--i': i % 4 } as React.CSSProperties}>
            <button type="button" onClick={() => setOpen(i)} className="group block w-full text-left">
              <span className="block overflow-hidden">
                <span className="block aspect-[4/5] transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.03]">
                  <Img name={r.name} alt={r.alt} sizes="(min-width: 768px) 23vw, 50vw" />
                </span>
              </span>
              <span className="mt-3 block text-[15px] font-semibold leading-snug">{r.caption}</span>
              <span className="block text-[15px]">{r.category}</span>
            </button>
          </li>
        ))}
        <li data-reveal style={{ '--i': 3 } as React.CSSProperties}>
          <a href={brand.instagram.url} target="_blank" rel="noopener noreferrer"
            className="flex aspect-[4/5] flex-col justify-end bg-ink p-4 text-white no-underline transition-colors hover:bg-[#333] sm:p-6">
            <span className="text-[17px] font-semibold leading-snug">Mais resultados no Instagram</span>
            <span className="mt-1 text-[15px] underline underline-offset-4">Abrir o perfil</span>
          </a>
        </li>
      </ul>

      {open !== null && <Lightbox start={open} onClose={() => setOpen(null)} />}
    </section>
  )
}

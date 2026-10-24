import { useState } from 'react'
import { Img } from '../ui/Img'
import { SectionHead } from '../ui/SectionHead'
import { results, type ResultCategory } from '../../content/media'

const CATS: ('Todos' | ResultCategory)[] = ['Todos', 'Sobrancelhas', 'Regeneração', 'Laser', 'Brow lamination']

/** Visor de casos: foto grande à esquerda, índice dos casos à direita. Sem janela por cima da página. */
export function Results() {
  const [cat, setCat] = useState<(typeof CATS)[number]>('Todos')
  const list = results.map((r, n) => ({ ...r, n: n + 1 })).filter((r) => cat === 'Todos' || r.category === cat)
  const [sel, setSel] = useState(0)
  const idx = Math.min(sel, list.length - 1)
  const item = list[idx]
  const go = (d: number) => setSel((idx + d + list.length) % list.length)

  return (
    <section id="resultados" aria-labelledby="res-title" className="on-dark bg-field py-[var(--section)] text-paper">
      <div className="frame">
        <SectionHead n="05" label="Resultados" id="res-title" title={<>Casos<br />do studio</>} aside="Antes e depois publicados pela Amanda, com autorização. Cada pessoa responde de um jeito; o resultado de uma não se repete igual em outra." />

        <div role="group" aria-label="Filtrar por categoria" className="mt-12 flex flex-wrap gap-2 md:mt-16">
          {CATS.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => { setCat(c); setSel(0) }}
              className={`tag min-h-[44px] border px-3.5 transition-colors ${cat === c ? 'border-paper bg-paper text-ink' : 'border-paper/30 text-paper/80 hover:border-paper'}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-12 md:gap-x-6">
          <figure className="m-0 md:col-span-8">
            <div className="ticks text-champagne">
              <div className="relative aspect-[4/3] bg-black/40">
                {item && <div key={item.name} className="case-img absolute inset-0"><Img name={item.name} alt={item.alt} sizes="(min-width: 768px) 62vw, 100vw" className="!object-contain" /></div>}
              </div>
            </div>
            {item && (
              <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <span>
                  <span className="tag block text-champagne">Caso {String(item.n).padStart(2, '0')} · {item.category}</span>
                  <span className="mt-1 block text-[20px] font-semibold uppercase tracking-[-0.02em] [font-stretch:118%]">{item.caption}</span>
                </span>
                <span className="flex items-center gap-2">
                  <button type="button" className="btn btn-quiet !min-h-[44px] !px-4" onClick={() => go(-1)} disabled={list.length < 2} aria-label="Caso anterior">←</button>
                  <span className="tag w-16 text-center text-paper/70" aria-live="polite">{idx + 1}/{list.length}</span>
                  <button type="button" className="btn btn-quiet !min-h-[44px] !px-4" onClick={() => go(1)} disabled={list.length < 2} aria-label="Próximo caso">→</button>
                </span>
              </figcaption>
            )}
          </figure>

          <ol className="m-0 list-none self-start border-t border-paper/25 p-0 md:col-span-4">
            {list.map((r, i) => (
              <li key={r.name} className="border-b border-paper/15">
                <button type="button" aria-current={i === idx ? 'true' : undefined} onClick={() => setSel(i)}
                  className={`grid w-full grid-cols-[56px_1fr_auto] items-center gap-3 py-2.5 text-left transition-colors ${i === idx ? 'text-paper' : 'text-paper/65 hover:text-paper'}`}>
                  <span className="aspect-square w-14 overflow-hidden"><Img name={r.name} alt="" sizes="56px" /></span>
                  <span className="text-[15px] leading-snug">{r.caption}</span>
                  <span className="tag text-[11px]">{i === idx ? '◼' : String(r.n).padStart(2, '0')}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

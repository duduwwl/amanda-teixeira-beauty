import { useEffect, useRef, useState } from 'react'
import { Img } from '../ui/Img'
import { results, type ResultCategory } from '../../content/media'

// Posições da nuvem de fotos (desktop): x/y em % da área, largura em px, deriva.
const SPOTS = [
  { x: 2, y: 6, w: 190, d: 8 },
  { x: 25, y: 0, w: 168, d: -6 },
  { x: 76, y: 4, w: 200, d: 10 },
  { x: 0, y: 56, w: 176, d: -9 },
  { x: 22, y: 70, w: 196, d: 6 },
  { x: 70, y: 62, w: 172, d: -7 },
  { x: 86, y: 36, w: 160, d: 12 },
]
const CATS: ('Todos' | ResultCategory)[] = ['Todos', 'Sobrancelhas', 'Regeneração', 'Laser', 'Lábios']

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

export function Results() {
  const [open, setOpen] = useState<number | null>(null)
  const thumb = (i: number, cls = '', style?: React.CSSProperties) => {
    const r = results[i]
    return (
      <button key={r.name} type="button" onClick={() => setOpen(i)} className={`group block overflow-hidden ${cls}`} style={style}>
        <span className="sr-only">Ampliar foto: </span>
        <div className="aspect-[9/10] transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.04]">
          <Img name={r.name} alt={r.alt} sizes="200px" />
        </div>
      </button>
    )
  }
  return (
    <section id="resultados" aria-labelledby="res-title" className="frame py-[var(--section)]">
      {/* desktop: fotos reunidas em volta do título */}
      <div className="relative hidden h-[min(100svh,860px)] min-h-[700px] md:block">
        <div className="absolute inset-x-[12%] inset-y-0">
          {SPOTS.slice(0, results.length).map((s, i) =>
            thumb(i, 'drift absolute', { left: `${s.x}%`, top: `${s.y}%`, width: s.w, '--d': `${s.d}%` } as React.CSSProperties))}
        </div>
        <div className="absolute left-1/2 top-1/2 w-[min(30rem,40%)] -translate-x-1/2 -translate-y-1/2 text-center">
          <ResultsText onOpen={() => setOpen(0)} />
        </div>
      </div>

      {/* celular: duas acima, três abaixo */}
      <div className="md:hidden">
        <div className="flex justify-between">{thumb(0, 'w-[34%]')}{thumb(1, 'mt-14 w-[30%]')}</div>
        <div className="my-12 text-center"><ResultsText onOpen={() => setOpen(0)} /></div>
        <div className="flex items-start justify-between">{thumb(2, 'mt-8 w-[30%]')}{thumb(3, 'w-[30%]')}{thumb(4, 'mt-16 w-[30%]')}</div>
      </div>

      {open !== null && <Lightbox start={open} onClose={() => setOpen(null)} />}
    </section>
  )
}

function ResultsText({ onOpen }: { onOpen: () => void }) {
  return (
    <>
      <h2 id="res-title" className="text-[44px]">Resultados<br />de perto</h2>
      <p className="mx-auto mt-4 max-w-[32ch] text-[17px]">Sobrancelhas, regeneração, laser e lábios, fotografados no studio.</p>
      <button type="button" onClick={onOpen} className="link mt-4 min-h-[44px] text-[17px] font-semibold">Ver a galeria</button>
    </>
  )
}

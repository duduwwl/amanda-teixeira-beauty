import { useState } from 'react'
import { motion, useReducedMotion, type PanInfo } from 'motion/react'
import { Img } from '../ui/Img'
import { DECK, TILT } from './studioDeck'

/**
 * Pilha de fotos do studio (Motion): arraste a de cima para o lado e ela vai para o fim da
 * pilha. Um peteleco rápido basta (velocidade), não precisa arrastar até o limite.
 */
export default function StudioDeckLive() {
  const [order, setOrder] = useState(() => DECK.map((_, i) => i))
  const reduce = useReducedMotion()
  const next = () => setOrder((o) => [...o.slice(1), o[0]])
  const prev = () => setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)])
  const top = DECK[order[0]]

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 500) next()
  }

  return (
    <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-x-6">
      <div className="relative mx-auto aspect-[4/5] w-[min(78vw,420px)] md:col-span-6 md:col-start-2 md:w-full md:max-w-[460px]">
        {order.map((photoIdx, depth) => {
          const p = DECK[photoIdx]
          const isTop = depth === 0
          return (
            <motion.figure
              key={p.name}
              className={`absolute inset-0 m-0 bg-sand ${isTop ? 'cursor-grab active:cursor-grabbing' : ''}`}
              style={{ zIndex: DECK.length - depth, touchAction: 'pan-y' }}
              initial={false}
              animate={{ rotate: reduce ? 0 : TILT[depth], scale: 1 - depth * 0.03, y: depth * 16 }}
              transition={{ type: 'spring', duration: 0.55, bounce: 0.18 }}
              drag={isTop ? 'x' : false}
              dragSnapToOrigin
              dragElastic={0.6}
              onDragEnd={isTop ? onDragEnd : undefined}
              aria-hidden={!isTop}
            >
              <Img name={p.name} alt={isTop ? p.alt : ''} sizes="(min-width: 768px) 460px, 78vw" className="pointer-events-none select-none" />
            </motion.figure>
          )
        })}
      </div>

      <div className="md:col-span-4 md:col-start-8 md:pb-6">
        <p className="font-display text-[30px] leading-[1.1] md:text-[36px]" aria-live="polite">{top.caption}</p>
        <p className="mt-2 text-[15px] text-soft">Foto {order[0] + 1} de {DECK.length}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button type="button" className="btn" onClick={next}>Próxima foto</button>
          <button type="button" className="link min-h-[44px] text-[15px]" onClick={prev}>Foto anterior</button>
        </div>
        <p className="mt-4 text-[15px] text-soft">Arraste a foto para o lado para ver a próxima.</p>
      </div>
    </div>
  )
}

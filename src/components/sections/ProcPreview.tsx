import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'motion/react'
import { Img } from '../ui/Img'
import { procedures } from '../../content/site'

/**
 * Foto que acompanha o cursor sobre a lista de procedimentos (Motion, com mola).
 * Só existe com mouse de verdade e sem redução de movimento; é decorativa (a foto também
 * aparece dentro de cada procedimento aberto), por isso fica fora da árvore de acessibilidade.
 */
export default function ProcPreview({ active, host }: { active: number | null; host: HTMLElement | null }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 })
  // inclina na direção do movimento, como um papel arrastado
  const vx = useVelocity(sx)
  const rotate = useSpring(useTransform(vx, [-1500, 0, 1500], [-7, 0, 7], { clamp: true }), { stiffness: 200, damping: 30 })

  useEffect(() => {
    if (!host) return
    const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY) }
    host.addEventListener('pointermove', move)
    return () => host.removeEventListener('pointermove', move)
  }, [host, x, y])

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 w-[240px]"
      style={{ x: sx, y: sy, rotate, translateX: '24px', translateY: '-50%' }}
      initial={false}
      animate={{ opacity: active === null ? 0 : 1, scale: active === null ? 0.94 : 1 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        {procedures.map((p, i) => (
          <div key={p.slug} className="absolute inset-0 transition-opacity duration-200" style={{ opacity: i === active ? 1 : 0 }}>
            <Img name={p.image} alt="" sizes="240px" />
          </div>
        ))}
      </div>
    </motion.div>
  )
}

import { useEffect, useState } from 'react'

/** Fica true quando o elemento chega perto da tela; usado para só então baixar a parte animada. */
export function useNear(el: Element | null, margin = '600px') {
  const [near, setNear] = useState(() => typeof window !== 'undefined' && !('IntersectionObserver' in window))
  useEffect(() => {
    if (!el || near) return
    const io = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { setNear(true); io.disconnect() } }, { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [el, margin, near])
  return near
}

import { useEffect } from 'react'

export function useDocumentMeta(title: string, description?: string, robots?: string) {
  useEffect(() => {
    document.title = title
    const set = (sel: string, attr: string, val?: string) => {
      if (!val) return
      const el = document.querySelector<HTMLMetaElement>(sel)
      if (el) el.setAttribute(attr, val)
    }
    set('meta[name="description"]', 'content', description)
    set('meta[property="og:title"]', 'content', title)
    set('meta[property="og:description"]', 'content', description)
    let r = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (robots) {
      if (!r) { r = document.createElement('meta'); r.name = 'robots'; document.head.appendChild(r) }
      r.content = robots
    } else r?.remove()
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonical) canonical.href = window.location.origin + window.location.pathname
  }, [title, description, robots])
}

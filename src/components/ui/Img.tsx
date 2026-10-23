import images from '../../content/images.json'

type Entry = { w: number; h: number; widths: number[]; color: string }
const manifest = images as Record<string, Entry>
const BASE = import.meta.env.BASE_URL

export const hasImage = (name: string) => name.replace(/\.\w+$/, '') in manifest

type Props = {
  /** caminho relativo a public/images sem extensão, ex.: "amanda/retrato" */
  name: string
  alt: string
  sizes?: string
  priority?: boolean
  className?: string
  /** posição do recorte (object-position) */
  focus?: string
}

/** Foto responsiva (AVIF/WebP) com espaço reservado. Sem a foto, mostra um campo neutro com a legenda. */
export function Img({ name, alt, sizes = '100vw', priority, className = '', focus }: Props) {
  const key = name.replace(/\.\w+$/, '')
  const e = manifest[key]
  if (!e) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`img-cover grid place-items-end bg-sand p-4 text-left text-[13px] leading-snug text-soft ${className}`}
      >
        <span aria-hidden="true">{alt}</span>
      </div>
    )
  }
  const set = (fmt: string) => e.widths.map((w) => `${BASE}images/${key}-${w}.${fmt} ${w}w`).join(', ')
  const fallback = `${BASE}images/${key}-${e.widths[Math.min(1, e.widths.length - 1)]}.webp`
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={fallback}
        alt={alt}
        width={e.w}
        height={e.h}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={`img-cover ${className}`}
        style={{ backgroundColor: e.color, objectPosition: focus }}
      />
    </picture>
  )
}

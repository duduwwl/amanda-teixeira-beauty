/** Cabeçalho de seção no formato de ficha: número, rótulo e título grande. */
export function SectionHead({ n, label, id, title, aside, className = '' }: {
  n: string
  label: string
  id: string
  title: React.ReactNode
  aside?: React.ReactNode
  className?: string
}) {
  return (
    <header className={`grid gap-6 md:grid-cols-12 md:gap-x-6 ${className}`}>
      <p className="tag flex gap-3 md:col-span-12">
        <span className="text-laser in-[.on-dark]:text-champagne">{n}</span>
        <span className="opacity-70">{label}</span>
      </p>
      <h2 id={id} data-reveal className="text-[clamp(24px,8.2vw,64px)] uppercase md:col-span-8 md:text-[min(5.4vw,96px)]">{title}</h2>
      {aside && <div data-reveal style={{ '--i': 1 } as React.CSSProperties} className="max-w-[40ch] self-end text-[17px] md:col-span-4">{aside}</div>}
    </header>
  )
}

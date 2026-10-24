import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Calendar } from './Calendar'
import { DetailsForm, type Details } from './DetailsForm'
import { Success } from './Success'
import { BookingError, createBooking, daySlots, isDemo, listServices } from '../../services/booking'
import { durationLabel, longDay, timeOf } from '../../lib/time'
import { brand, bookingConditions } from '../../content/site'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import type { BookingResult, Service, Slot } from '../../types/booking'

const STEPS = ['Procedimento', 'Data', 'Horário', 'Seus dados', 'Confirmação'] as const
type Step = 0 | 1 | 2 | 3 | 4 | 5

const price = (s: Service) =>
  s.price_cents != null
    ? (s.price_cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + (s.price_note ? ` ${s.price_note}` : '')
    : s.price_note || 'Valor informado na confirmação'

export function BookingPage() {
  useDocumentMeta('Agendar horário | Amanda Teixeira Beauty', 'Escolha o procedimento, o dia e um horário livre na agenda da Amanda Teixeira, em Lavras-MG.')
  return <BookingFlow />
}

function BookingFlow() {
  const [params, setParams] = useSearchParams()
  const reduce = useReducedMotion()
  const [services, setServices] = useState<Service[] | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [step, setStep] = useState<Step>(0)
  const [service, setService] = useState<Service | null>(null)
  const [day, setDay] = useState<string | null>(null)
  const [slots, setSlots] = useState<Slot[] | null>(null)
  const [slot, setSlot] = useState<Slot | null>(null)
  const [details, setDetails] = useState<Details | null>(null)
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [result, setResult] = useState<BookingResult | null>(null)
  const [slotsNonce, setSlotsNonce] = useState(0)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    listServices()
      .then((list) => {
        setServices(list)
        const pre = list.find((s) => s.slug === params.get('servico'))
        if (pre) { setService(pre); setStep(1) }
      })
      .catch(() => setLoadError(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ao mudar de etapa, o foco vai para o título da etapa (leitores de tela e teclado)
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }) }, [step])

  useEffect(() => {
    if (!service || !day) return
    let alive = true
    setSlots(null)
    daySlots(service.id, day).then((s) => alive && setSlots(s)).catch(() => alive && setSlots([]))
    return () => { alive = false }
  }, [service, day, slotsNonce])

  const go = (s: Step) => {
    setStep(s)
    setSubmitError(null)
    const top = document.getElementById('agenda-topo')
    if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }

  const chooseService = (s: Service) => {
    setService(s); setDay(null); setSlot(null)
    setParams({ servico: s.slug }, { replace: true })
    go(1)
  }

  async function confirm() {
    if (!service || !slot || !details) return
    setSending(true)
    setSubmitError(null)
    try {
      const r = await createBooking({ serviceId: service.id, startsAt: slot.starts_at, ...details })
      setResult(r)
      go(5)
    } catch (e) {
      const err = e instanceof BookingError ? e : new BookingError('desconhecido')
      if (err.key === 'horario_indisponivel') {
        // outra pessoa reservou antes: volta para os horários atualizados, com o aviso
        setSlot(null)
        setSlotsNonce((n) => n + 1)
        setStep(2)
      }
      setSubmitError(err.message)
    } finally {
      setSending(false)
    }
  }

  const grouped = useMemo(() => {
    if (!slots) return null
    const g = { Manhã: [] as Slot[], Tarde: [] as Slot[], Noite: [] as Slot[] }
    for (const s of slots) {
      const h = Number(timeOf(s.starts_at).slice(0, 2))
      ;(h < 12 ? g.Manhã : h < 18 ? g.Tarde : g.Noite).push(s)
    }
    return Object.entries(g).filter(([, v]) => v.length)
  }, [slots])

  if (step === 5 && result && service) return <Success result={result} service={service} details={details!} />

  const motionProps = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] as const } },
        // saída mais curta que a entrada: a próxima etapa aparece logo
        exit: { opacity: 0, y: -6, transition: { duration: 0.14, ease: [0.55, 0.055, 0.675, 0.19] as const } },
      }

  return (
    <div id="agenda-topo" className="frame scroll-mt-[90px] pb-[var(--section)] pt-[clamp(110px,12vw,160px)]">
      <div className="grid gap-x-6 gap-y-10 lg:grid-cols-12">
        <header className="lg:col-span-12">
          <h1 className="text-[clamp(46px,6.6vw,104px)]">Agendar horário</h1>
          <ol className="m-0 mt-8 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-[15px]" aria-label="Etapas">
            {STEPS.map((s, i) => (
              <li key={s} aria-current={i === step ? 'step' : undefined}
                className={i === step ? 'font-semibold underline decoration-2 underline-offset-[6px]' : i < step ? 'text-ink' : 'text-soft'}>
                {i < step ? (
                  <button type="button" className="underline-offset-4 hover:underline" onClick={() => go(i as Step)}>{s}</button>
                ) : s}
              </li>
            ))}
          </ol>
          {isDemo && (
            <p className="mt-6 max-w-[64ch] bg-sand px-4 py-3 text-[15px]">
              <strong className="font-semibold">Agenda de demonstração.</strong> Os horários e reservas desta página são fictícios e ficam só no seu navegador. Para marcar de verdade, <a className="link" href={brand.whatsappUrl} target="_blank" rel="noopener noreferrer">fale com a Amanda pelo WhatsApp</a>.
            </p>
          )}
        </header>

        {/* resumo das escolhas */}
        <aside aria-label="Resumo" className="order-last lg:order-none lg:col-span-4">
          <div className="bg-sand p-6 lg:sticky lg:top-[100px]">
            <h2 className="font-sans text-[16px] font-semibold tracking-normal">Sua reserva</h2>
            <dl className="mt-4 grid gap-3 text-[16px]">
              <Row k="Procedimento" v={service ? service.name : '—'} />
              <Row k="Duração" v={service ? durationLabel(service.duration_min) : '—'} />
              <Row k="Dia" v={day ? longDay(`${day}T12:00:00-03:00`) : '—'} />
              <Row k="Horário" v={slot ? `${timeOf(slot.starts_at)} às ${timeOf(slot.ends_at)}` : '—'} />
            </dl>
            {service?.requires_evaluation && (
              <p className="mt-5 text-[15px]">{service.name} exige avaliação. Se ainda não fez, <button type="button" className="link" onClick={() => { const a = services?.find((s) => s.slug === 'avaliacao'); if (a) chooseService(a) }}>agende a avaliação</button>.</p>
            )}
            <p className="mt-5 text-[14px] text-soft">Horários em Brasília (Lavras-MG).</p>
          </div>
        </aside>

        <section className="min-w-0 lg:col-span-8 lg:col-start-5 lg:row-start-2" aria-live="off">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={step} {...motionProps}>
              <h2 ref={headingRef} tabIndex={-1} className="text-[clamp(32px,3.4vw,48px)] outline-none">
                {['Qual procedimento?', 'Escolha o dia', 'Escolha o horário', 'Seus dados', 'Confira e confirme'][step]}
              </h2>

              {step === 0 && (
                <div className="mt-8">
                  {loadError && <p className="text-danger">Não foi possível carregar os procedimentos. <button className="link" type="button" onClick={() => location.reload()}>Tentar de novo</button></p>}
                  {!services && !loadError && <p className="text-soft" aria-live="polite">Carregando procedimentos…</p>}
                  <ul className="m-0 grid list-none gap-1.5 p-0">
                    {services?.map((s) => (
                      <li key={s.id}>
                        <button type="button" onClick={() => chooseService(s)} aria-pressed={service?.id === s.id}
                          className={`grid w-full gap-1 px-5 py-4 text-left transition-[background-color,transform] duration-150 active:scale-[0.99] sm:grid-cols-[1fr_auto] sm:gap-6
                            ${service?.id === s.id ? 'bg-cocoa text-paper' : 'bg-sand hover:bg-taupe/70'}`}>
                          <span>
                            <span className="block font-display text-[26px] leading-tight">{s.name}</span>
                            <span className={`mt-0.5 block text-[15px] ${service?.id === s.id ? 'text-paper/85' : 'text-soft'}`}>{s.short_description}</span>
                            {s.requires_evaluation && <span className="mt-1.5 block text-[14px] font-semibold">Exige avaliação prévia</span>}
                          </span>
                          <span className="text-[15px] sm:text-right">
                            <span className="block">{durationLabel(s.duration_min)}</span>
                            <span className={`block ${service?.id === s.id ? 'text-paper/85' : 'text-soft'}`}>{price(s)}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {step === 1 && service && (
                <div className="mt-8">
                  <Calendar serviceId={service.id} value={day} onChange={(d) => { setDay(d); setSlot(null); go(2) }} />
                </div>
              )}

              {step === 2 && service && day && (
                <div className="mt-8">
                  <p className="text-[17px] first-letter:uppercase">{longDay(`${day}T12:00:00-03:00`)}</p>
                  {submitError && <p role="alert" className="mt-4 bg-danger/10 px-4 py-3 text-danger">{submitError}</p>}
                  {!grouped && <p className="mt-6 text-soft" aria-live="polite">Buscando horários…</p>}
                  {grouped && grouped.length === 0 && (
                    <p className="mt-6">Esse dia acabou de lotar. <button type="button" className="link" onClick={() => go(1)}>Escolher outro dia</button></p>
                  )}
                  {grouped?.map(([label, list]) => (
                    <fieldset key={label} className="mt-8 border-0 p-0">
                      <legend className="mb-3 text-[15px] font-semibold">{label}</legend>
                      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5 lg:grid-cols-6">
                        {list.map((s) => (
                          <button key={s.starts_at} type="button" aria-pressed={slot?.starts_at === s.starts_at}
                            onClick={() => { setSlot(s); go(3) }}
                            className={`min-h-[48px] text-[16px] tabular-nums transition-[background-color,transform] duration-150 active:scale-95
                              ${slot?.starts_at === s.starts_at ? 'bg-cocoa text-paper' : 'bg-sand hover:bg-taupe'}`}>
                            {timeOf(s.starts_at)}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                  <button type="button" className="link mt-8 text-[15px]" onClick={() => go(1)}>Voltar ao calendário</button>
                </div>
              )}

              {step === 3 && (
                <DetailsForm initial={details} onBack={() => go(2)} onSubmit={(d) => { setDetails(d); go(4) }} />
              )}

              {step === 4 && service && slot && details && (
                <div className="mt-8 grid gap-8">
                  <dl className="grid gap-x-8 gap-y-4 text-[17px] sm:grid-cols-2">
                    <Row k="Procedimento" v={service.name} />
                    <Row k="Duração" v={durationLabel(service.duration_min)} />
                    <Row k="Data" v={longDay(slot.starts_at)} />
                    <Row k="Horário" v={`${timeOf(slot.starts_at)} às ${timeOf(slot.ends_at)}`} />
                    <Row k="Nome" v={details.name} />
                    <Row k="WhatsApp" v={details.phone} />
                    {details.email && <Row k="E-mail" v={details.email} />}
                    <Row k="Contato preferido" v={{ whatsapp: 'WhatsApp', ligacao: 'Ligação', email: 'E-mail' }[details.contactPreference]} />
                    {details.notes && <div className="sm:col-span-2"><Row k="Observações" v={details.notes} /></div>}
                  </dl>
                  <div>
                    <h3 className="font-sans text-[16px] font-semibold tracking-normal">Condições</h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px]">
                      {bookingConditions.map((c) => <li key={c}>{c}</li>)}
                    </ul>
                  </div>
                  {submitError && (
                    <div role="alert" className="bg-danger/10 px-4 py-3 text-danger">
                      {submitError}{' '}
                      {!slot && <button type="button" className="link" onClick={() => go(2)}>Escolher outro horário</button>}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                    <button type="button" className="btn max-sm:w-full" onClick={confirm} disabled={sending} aria-busy={sending}>
                      {sending ? <><span className="spinner" aria-hidden="true" /> Confirmando…</> : 'Confirmar agendamento'}
                    </button>
                    <button type="button" className="link text-[15px]" onClick={() => go(3)} disabled={sending}>Editar dados</button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <p className="mt-14 text-[15px] text-soft">
            Prefere marcar conversando? <a className="link" href={brand.whatsappUrl} target="_blank" rel="noopener noreferrer">Fale pelo WhatsApp</a> ou volte para o <Link className="link" to="/">início</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[14px] text-soft">{k}</dt>
      <dd className="m-0 first-letter:uppercase">{v}</dd>
    </div>
  )
}

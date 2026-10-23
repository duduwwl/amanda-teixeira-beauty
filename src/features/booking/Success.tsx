import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { googleCalendarUrl, icsFor } from '../../lib/ics'
import { durationLabel, longDay, timeOf } from '../../lib/time'
import { whatsappCanPrefill, whatsappLink } from '../../lib/whatsapp'
import type { BookingResult, Service } from '../../types/booking'
import type { Details } from './DetailsForm'

/** Só é exibida depois que o banco devolveu o código da reserva. */
export function Success({ result, service, details }: { result: BookingResult; service: Service; details: Details }) {
  const h = useRef<HTMLHeadingElement>(null)
  useEffect(() => { h.current?.focus(); window.scrollTo(0, 0) }, [])
  const ev = { code: result.code, service: result.service_name, start: result.starts_at, end: result.ends_at }
  const msg = `Olá, Amanda! Acabei de reservar ${result.service_name} para ${longDay(result.starts_at)} às ${timeOf(result.starts_at)}. Código ${result.code}. Nome: ${details.name}.`
  const download = () => {
    const url = URL.createObjectURL(icsFor(ev))
    const a = Object.assign(document.createElement('a'), { href: url, download: `reserva-${result.code}.ics` })
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <div className="frame pb-[var(--section)] pt-[clamp(110px,12vw,160px)]">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 ref={h} tabIndex={-1} className="text-[clamp(46px,6.4vw,100px)] outline-none">Horário reservado</h1>
          <p className="mt-6 max-w-[46ch] text-[18px]">
            Sua reserva foi registrada na agenda e está <strong className="font-semibold">pendente</strong> até a Amanda confirmar pelo {details.contactPreference === 'email' ? 'e-mail' : details.contactPreference === 'ligacao' ? 'telefone' : 'WhatsApp'}.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a className="btn max-sm:w-full" href={whatsappLink(msg)} target="_blank" rel="noopener noreferrer">Enviar resumo pelo WhatsApp</a>
            <button type="button" className="link text-[15px]" onClick={download}>Adicionar ao calendário (.ics)</button>
            <a className="link text-[15px]" href={googleCalendarUrl(ev)} target="_blank" rel="noopener noreferrer">Google Agenda</a>
          </div>
          <p className="mt-4 max-w-[52ch] text-[14px] text-soft">
            {whatsappCanPrefill()
              ? 'O WhatsApp abre com a mensagem pronta. Ela só chega à Amanda quando você tocar em enviar.'
              : `O WhatsApp abre a conversa com a Amanda. Informe o código ${result.code} na mensagem.`}
          </p>
        </div>
        <dl className="grid content-start gap-4 bg-sand p-6 text-[17px] lg:col-span-4 lg:col-start-9">
          <div><dt className="text-[14px] text-soft">Código da reserva</dt><dd className="m-0 font-display text-[40px] leading-none tracking-[0.02em]" data-testid="codigo">{result.code}</dd></div>
          <div><dt className="text-[14px] text-soft">Procedimento</dt><dd className="m-0">{result.service_name} ({durationLabel(service.duration_min)})</dd></div>
          <div><dt className="text-[14px] text-soft">Data</dt><dd className="m-0 first-letter:uppercase">{longDay(result.starts_at)}</dd></div>
          <div><dt className="text-[14px] text-soft">Horário</dt><dd className="m-0">{timeOf(result.starts_at)} às {timeOf(result.ends_at)}</dd></div>
          <div className="pt-2 text-[15px]">
            <p className="font-semibold">Próximos passos</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>Guarde o código para reagendar ou cancelar.</li>
              <li>As orientações de preparo chegam com a confirmação.</li>
              <li>Chegue com alguns minutos de antecedência.</li>
            </ul>
          </div>
          <Link to="/" className="link mt-2 text-[15px]">Voltar ao início</Link>
        </dl>
      </div>
    </div>
  )
}

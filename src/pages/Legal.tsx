import { Link } from 'react-router-dom'
import { brand } from '../content/site'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function Page({ title, children }: { title: string; children: React.ReactNode }) {
  useDocumentMeta(`${title} | ${brand.fullName}`, `${title} do site ${brand.fullName}.`)
  return (
    <article className="frame pb-[var(--section)] pt-[clamp(120px,13vw,170px)]">
      <h1 className="max-w-[18ch] text-[clamp(44px,6vw,88px)]">{title}</h1>
      <p className="mt-4 text-[15px] text-soft">Atualizada em 23 de outubro de 2026.</p>
      <div className="legal mt-12 grid max-w-[68ch] gap-5 text-[17px]">{children}</div>
    </article>
  )
}

export function Privacy() {
  return (
    <Page title="Política de privacidade">
      <p>Esta política explica como o site de {brand.fullName} trata seus dados pessoais, de acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
      <h2>Quem é responsável</h2>
      <p>{brand.name}, profissional responsável pelo atendimento em {brand.city}. Contato para assuntos de privacidade: <a className="link" href={brand.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a> ou <a className="link" href={brand.instagram.url} target="_blank" rel="noopener noreferrer">{brand.instagram.handle}</a>.</p>
      <h2>Quais dados coletamos</h2>
      <p>No agendamento: nome, WhatsApp, e-mail (opcional), procedimento, data e horário escolhidos, preferência de contato, observações que você decidir escrever e o registro do seu aceite. Não pedimos CPF, endereço nem dados de saúde no site.</p>
      <h2>Para que usamos</h2>
      <p>Para registrar e confirmar sua reserva, falar com você sobre ela (confirmação, reagendamento, cancelamento) e manter o histórico de atendimentos. Mensagens de novidades só são enviadas se você marcar a opção própria, que é separada e opcional.</p>
      <h2>Base legal</h2>
      <p>Execução de procedimentos preliminares a pedido seu (art. 7º, V) para a reserva, e consentimento (art. 7º, I) para comunicações de novidades.</p>
      <h2>Com quem compartilhamos</h2>
      <p>Os dados ficam guardados no Supabase, serviço de banco de dados usado pelo site, com acesso restrito à Amanda. Não vendemos nem cedemos seus dados. O site não usa cookies de publicidade nem ferramentas de rastreamento.</p>
      <h2>Por quanto tempo</h2>
      <p>Enquanto houver relação de atendimento e por até 24 meses depois do último atendimento; depois disso, nome e contato são apagados e fica apenas o registro anônimo do horário.</p>
      <h2>Seus direitos</h2>
      <p>Você pode pedir a qualquer momento para ver, corrigir ou apagar seus dados, ou retirar o consentimento para novidades. Basta pedir pelo WhatsApp informando o código da reserva.</p>
      <p><Link className="link" to="/agendamento">Voltar ao agendamento</Link></p>
    </Page>
  )
}

export function Terms() {
  return (
    <Page title="Termos de uso">
      <p>Ao usar este site e a agenda online, você concorda com estes termos.</p>
      <h2>Reservas</h2>
      <p>A reserva feita pelo site separa o horário na agenda e fica pendente até a Amanda confirmar pelo contato que você escolheu. O código exibido ao final identifica a sua reserva.</p>
      <h2>Avaliação</h2>
      <p>Procedimentos marcados como “exige avaliação” só são realizados depois dela. A avaliação pode indicar outro procedimento, outro número de sessões ou que o procedimento não é indicado no momento.</p>
      <h2>Reagendamento e cancelamento</h2>
      <p>Avise pelo WhatsApp, com o código da reserva e o quanto antes, para que o horário seja liberado.</p>
      <h2>Resultados</h2>
      <p>Fotos do site mostram atendimentos reais publicados com autorização. Cada organismo responde de um jeito: não há garantia de resultado igual ao de outra pessoa.</p>
      <h2>Conteúdo</h2>
      <p>Textos e fotos pertencem a {brand.fullName} e não podem ser reproduzidos sem autorização.</p>
    </Page>
  )
}

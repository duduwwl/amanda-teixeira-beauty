import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function NotFound() {
  useDocumentMeta('Página não encontrada | Amanda Teixeira Beauty', 'Essa página não existe.', 'noindex')
  return (
    <section className="frame grid min-h-[80svh] content-center gap-6 py-[140px]">
      <h1 className="text-[clamp(52px,8vw,128px)]">Página não<br />encontrada</h1>
      <p className="max-w-[44ch] text-[18px]">O endereço pode ter mudado. Daqui você chega ao que procurava:</p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link to="/agendamento" className="btn">Agendar horário</Link>
        <Link to="/" className="link">Ir para o início</Link>
        <Link to="/#procedimentos" className="link">Ver procedimentos</Link>
      </div>
    </section>
  )
}

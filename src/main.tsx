import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App'

document.documentElement.classList.add('js')

// Volta da página 404.html do GitHub Pages: restaura o caminho original (/agendamento etc.).
const redirect = sessionStorage.getItem('spa-redirect')
if (redirect) {
  sessionStorage.removeItem('spa-redirect')
  history.replaceState(null, '', redirect)
}

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
// O index.html traz a página inicial já renderizada. Na página inicial o React a reaproveita;
// em qualquer outra rota (aberta direto pelo GitHub Pages) o conteúdo é montado do zero.
const atHome = location.pathname.replace(/\/$/, '') === import.meta.env.BASE_URL.replace(/\/$/, '')
if (root.hasChildNodes() && atHome) hydrateRoot(root, app)
else {
  root.textContent = ''
  createRoot(root).render(app)
}

// Pré-renderização da página inicial no build (scripts/prerender.mjs).
// O HTML chega pronto ao navegador e o React só assume a página depois (hydrate).
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AppRoutes } from './App'
import { basename } from './lib/base'

export function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url} basename={basename}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>,
  )
}

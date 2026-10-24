// Injeta o HTML da página inicial em dist/index.html (depois do build do cliente e do SSR).
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const base = process.env.VITE_BASE ?? '/amanda-teixeira-beauty/'
const { render } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)
const html = render(base)
const file = 'dist/index.html'
const page = readFileSync(file, 'utf8')
if (!page.includes('<div id="root"></div>')) throw new Error('marcador #root não encontrado')
writeFileSync(file, page.replace('<div id="root"></div>', `<div id="root">${html}</div>`))
rmSync('dist-ssr', { recursive: true, force: true })
console.log(`página inicial pré-renderizada (${(html.length / 1024).toFixed(1)} kB de HTML)`)

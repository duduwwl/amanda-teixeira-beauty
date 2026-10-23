// Servidor estático que se comporta como o GitHub Pages: entrega arquivos existentes
// e, para qualquer caminho desconhecido, devolve 404.html com status 404.
import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json' }
const root = process.argv[2] || 'dist'
const port = Number(process.argv[3] || 4175)
const BASE = '/amanda-teixeira-beauty'

http.createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (!path.startsWith(BASE)) { res.writeHead(404); return res.end('fora do site') }
  let file = normalize(join(root, path.slice(BASE.length) || '/'))
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html')
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404, { 'content-type': TYPES['.html'] })
    res.end(await readFile(join(root, '404.html')))
  }
}).listen(port, '127.0.0.1', () => console.log(`gh-pages simulado em http://127.0.0.1:${port}${BASE}/`))

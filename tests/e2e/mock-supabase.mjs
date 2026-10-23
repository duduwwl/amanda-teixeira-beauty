// Servidor de teste que imita o Supabase (PostgREST + Auth) sobre um Postgres real (PGlite)
// carregado com a migration e o seed do projeto. Assim o navegador dos testes faz reservas
// de verdade, com as mesmas funções, regras de conflito e RLS da produção.
//
// Implementa só o necessário para o site: /rest/v1/<tabela> (select/insert/update/delete
// com filtros eq/gte/lt/lte/gt e order/limit), /rest/v1/rpc/<função> e /auth/v1/token.
import http from 'node:http'
import { createDb } from '../db/harness.mjs'

export const ADMIN_ID = '11111111-1111-1111-1111-111111111111'
export const ADMIN_EMAIL = 'amanda@teste.local'
export const ADMIN_PASSWORD = 'senha-de-teste-123'

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
const fakeJwt = (sub, role) => `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub, role, exp: Math.floor(Date.now() / 1000) + 3600, aud: 'authenticated' })}.teste`

function claims(req) {
  const h = req.headers.authorization || ''
  const t = h.replace(/^Bearer /, '')
  try {
    const p = JSON.parse(Buffer.from(t.split('.')[1], 'base64url').toString())
    if (p.role === 'authenticated' && p.sub) return { role: 'authenticated', sub: p.sub }
  } catch { /* anon */ }
  return { role: 'anon', sub: null }
}

const ident = (s) => { if (!/^[a-z_][a-z0-9_]*$/.test(s)) throw new Error('identificador inválido: ' + s); return `"${s}"` }
const OPS = { eq: '=', neq: '<>', gte: '>=', gt: '>', lte: '<=', lt: '<' }

function where(params, values) {
  const conds = []
  for (const [k, v] of params) {
    if (['select', 'order', 'limit', 'offset', 'on_conflict', 'columns'].includes(k)) continue
    const m = /^(eq|neq|gte|gt|lte|lt|is)\.(.*)$/.exec(v)
    if (!m) continue
    if (m[1] === 'is') { conds.push(`${ident(k)} is ${m[2] === 'null' ? 'null' : 'not null'}`); continue }
    values.push(m[2])
    conds.push(`${ident(k)} ${OPS[m[1]]} $${values.length}`)
  }
  return conds.length ? ' where ' + conds.join(' and ') : ''
}

function orderBy(params) {
  const o = params.getAll('order')
  if (!o.length) return ''
  return ' order by ' + o.flatMap((x) => x.split(',')).map((p) => {
    const [c, dir] = p.split('.')
    return `${ident(c)} ${dir === 'desc' ? 'desc' : 'asc'}`
  }).join(', ')
}

async function handle(db, req, body) {
  const url = new URL(req.url, 'http://x')
  const { role, sub } = claims(req)
  const run = (fn) => db.transaction(async (tx) => {
    await tx.exec(`set local role ${role}`)
    if (sub) await tx.query(`select set_config('request.jwt.claim.sub', $1, true)`, [sub])
    return fn(tx)
  })

  // ---- Auth
  if (url.pathname === '/auth/v1/token') {
    const b = JSON.parse(body || '{}')
    if (b.email !== ADMIN_EMAIL || b.password !== ADMIN_PASSWORD) {
      return [400, { error: 'invalid_grant', error_description: 'Invalid login credentials', msg: 'Invalid login credentials', code: 'invalid_credentials' }]
    }
    const user = { id: ADMIN_ID, aud: 'authenticated', role: 'authenticated', email: ADMIN_EMAIL, app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString() }
    return [200, { access_token: fakeJwt(ADMIN_ID, 'authenticated'), token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: 'r', user }]
  }
  if (url.pathname === '/auth/v1/user') {
    if (role !== 'authenticated') return [401, { msg: 'not logged' }]
    return [200, { id: sub, aud: 'authenticated', role: 'authenticated', email: ADMIN_EMAIL, app_metadata: {}, user_metadata: {} }]
  }
  if (url.pathname === '/auth/v1/logout') return [204, null]

  // ---- RPC
  const rpc = /^\/rest\/v1\/rpc\/([a-z_]+)$/.exec(url.pathname)
  if (rpc) {
    const args = JSON.parse(body || '{}')
    const names = Object.keys(args)
    const sql = `select * from public.${ident(rpc[1])}(${names.map((n, i) => `${ident(n)} => $${i + 1}`).join(', ')})`
    const values = names.map((n) => (args[n] !== null && typeof args[n] === 'object' ? JSON.stringify(args[n]) : args[n]))
    const r = await run((tx) => tx.query(sql, values))
    // funções escalares (is_admin, purge...) devolvem o valor puro, como o PostgREST
    if (r.fields.length === 1 && r.fields[0].name === rpc[1]) return [200, r.rows[0]?.[rpc[1]] ?? null]
    return [200, r.rows]
  }

  // ---- Tabelas
  const tbl = /^\/rest\/v1\/([a-z_]+)$/.exec(url.pathname)
  if (tbl) {
    const t = `public.${ident(tbl[1])}`
    const values = []
    const w = where(url.searchParams, values)
    const single = (req.headers.accept || '').includes('vnd.pgrst.object')
    if (req.method === 'GET') {
      const lim = url.searchParams.get('limit') ? ` limit ${Number(url.searchParams.get('limit'))}` : ''
      // relação embutida usada pelo Histórico: booking_events?select=*,bookings(code,...)
      const emb = /bookings\(([a-z_,]+)\)/.exec(url.searchParams.get('select') || '')
      const cols = emb && tbl[1] === 'booking_events'
        ? `*, (select json_build_object(${emb[1].split(',').map((c) => `'${c}', b.${ident(c)}`).join(', ')}) from public.bookings b where b.id = booking_id) as bookings`
        : '*'
      const r = await run((tx) => tx.query(`select ${cols} from ${t}${w}${orderBy(url.searchParams)}${lim}`, values))
      return [200, single ? r.rows[0] : r.rows]
    }
    if (req.method === 'PATCH') {
      const data = JSON.parse(body)
      const sets = Object.keys(data).map((k) => { values.push(data[k]); return `${ident(k)} = $${values.length}` })
      const r = await run((tx) => tx.query(`update ${t} set ${sets.join(', ')}${w} returning *`, values))
      return [200, r.rows]
    }
    if (req.method === 'POST') {
      const rows = [].concat(JSON.parse(body))
      const out = []
      await run(async (tx) => {
        for (const row of rows) {
          const cols = Object.keys(row)
          const r = await tx.query(`insert into ${t} (${cols.map(ident).join(', ')}) values (${cols.map((_, i) => `$${i + 1}`).join(', ')}) returning *`, cols.map((c) => row[c]))
          out.push(...r.rows)
        }
      })
      return [201, out]
    }
    if (req.method === 'DELETE') {
      const r = await run((tx) => tx.query(`delete from ${t}${w} returning *`, values))
      return [200, r.rows]
    }
  }
  return [404, { message: 'not found' }]
}

export async function startMock(port = 54321) {
  const db = await createDb()
  await db.query('insert into admins (user_id) values ($1)', [ADMIN_ID])
  // fila única: PGlite atende uma transação por vez (como um pool de 1 conexão)
  let chain = Promise.resolve()
  const server = http.createServer((req, res) => {
    let body = ''
    req.on('data', (c) => (body += c))
    req.on('end', () => {
      chain = chain.then(async () => {
        const cors = {
          'access-control-allow-origin': req.headers.origin || '*',
          'access-control-allow-headers': '*',
          'access-control-allow-methods': 'GET,POST,PATCH,DELETE,OPTIONS',
          'access-control-expose-headers': 'content-range',
        }
        if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end() }
        try {
          const [status, payload] = await handle(db, req, body)
          res.writeHead(status, { ...cors, 'content-type': 'application/json' })
          res.end(payload === null ? 'null' : JSON.stringify(payload))
        } catch (e) {
          const msg = String(e.message || e)
          const code = /permission denied|row-level/.test(msg) ? 401 : 400
          res.writeHead(code, { ...cors, 'content-type': 'application/json' })
          res.end(JSON.stringify({ message: msg, code: e.code || 'P0001', details: null, hint: null }))
        }
      })
    })
  })
  await new Promise((r) => server.listen(port, '127.0.0.1', r))
  return { db, server, close: () => new Promise((r) => server.close(r)) }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.MOCK_PORT || 54321)
  await startMock(port)
  console.log(`mock supabase em http://127.0.0.1:${port}`)
}

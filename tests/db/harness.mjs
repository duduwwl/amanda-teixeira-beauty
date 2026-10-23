// Sobe um Postgres real (PGlite/WASM) com a migration e o seed do projeto,
// mais um "auth" mínimo que imita o do Supabase (auth.uid() a partir do JWT).
import { PGlite } from '@electric-sql/pglite'
import { btree_gist } from '@electric-sql/pglite/contrib/btree_gist'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))

export async function createDb() {
  const db = new PGlite({ extensions: { btree_gist } })
  await db.exec(`
    create role anon nologin; create role authenticated nologin;
    create schema auth;
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to anon, authenticated;
    grant execute on function auth.uid() to anon, authenticated;
    grant usage on schema public to anon, authenticated;
    set timezone = 'UTC';
  `)
  await db.exec(readFileSync(root + 'supabase/migrations/20261023000001_init.sql', 'utf8'))
  await db.exec(readFileSync(root + 'supabase/seed.sql', 'utf8'))
  return db
}

/** Executa como um papel do Supabase (anon / authenticated + sub). */
export async function as(db, role, sub, fn) {
  return db.transaction(async (tx) => {
    await tx.exec(`set local role ${role}`)
    if (sub) await tx.query(`select set_config('request.jwt.claim.sub', $1, true)`, [sub])
    return fn(tx)
  })
}

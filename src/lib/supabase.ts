import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Só a URL do projeto e a chave pública (anon/publishable) vão para o navegador.
// Toda permissão real é decidida no banco (RLS + funções security definer).
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

import { backendConfigured } from './env'
export { backendConfigured }

export const supabase: SupabaseClient | null = backendConfigured
  ? createClient(url!, key!, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: 'atb-admin' },
    })
  : null

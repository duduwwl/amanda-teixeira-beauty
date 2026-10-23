// Verificação leve, sem importar o cliente do Supabase (que só carrega na agenda e no painel).
export const backendConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

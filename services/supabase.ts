import { createClient } from '@supabase/supabase-js';

// No Vite, as variáveis devem estar no ficheiro .env na RAIZ do projeto
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase credentials missing! Please ensure .env is in the PROJECT ROOT.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.sessionStorage, // Use sessionStorage for session persistence
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

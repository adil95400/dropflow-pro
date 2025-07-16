import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Check if Supabase is properly configured
const isSupabaseConfigured = 
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  import.meta.env.VITE_SUPABASE_URL !== 'your_supabase_url' &&
  import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your_supabase_anon_key'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: (url, options = {}) => {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured properly. Please check your environment variables.')
        return Promise.reject(new Error('Supabase not configured'))
      }
      return fetch(url, options)
    }
  }
})

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured. Please check your environment variables.')
    }
    return await supabase.auth.signUp({ email, password })
  },
  
  signIn: async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured. Please check your environment variables.')
    }
    return await supabase.auth.signInWithPassword({ email, password })
  },
  
  signInWithOAuth: async (provider: 'google' | 'github') => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured. Please check your environment variables.')
    }
    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
  },
  
  signOut: async () => {
    if (!isSupabaseConfigured) {
      return { error: null }
    }
    return await supabase.auth.signOut()
  },
  
  resetPassword: async (email: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured. Please check your environment variables.')
    }
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
  },
}

export { isSupabaseConfigured }
export default supabase
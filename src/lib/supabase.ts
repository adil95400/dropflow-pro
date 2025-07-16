import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is properly configured
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key', 
  {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
})

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase not configured. Please check your environment variables.')
      }
      return await supabase.auth.signUp({ email, password })
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  },
  
  signIn: async (email: string, password: string) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase not configured. Please check your environment variables.')
      }
      return await supabase.auth.signInWithPassword({ email, password })
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  },
  
  signInWithOAuth: async (provider: 'google' | 'github') => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase not configured. Please check your environment variables.')
      }
      return await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/app/dashboard`,
        },
      })
    } catch (error) {
      console.error('OAuth sign in error:', error)
      throw error
    }
  },
  
  signOut: async () => {
    try {
      if (!isSupabaseConfigured) {
        return { error: null }
      }
      return await supabase.auth.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
      return { error: null }
    }
  },
  
  resetPassword: async (email: string) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase not configured. Please check your environment variables.')
      }
      return await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  },
}

export { isSupabaseConfigured }
export default supabase
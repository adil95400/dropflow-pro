import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

export const getActiveSessions = async () => {
  const { data, error } = await supabase.rpc('get_active_sessions')
  if (error) throw error
  return data
}

export const terminateSession = async (sessionId: string) => {
  const { error } = await supabase.rpc('terminate_session_by_id', { session_id: sessionId })
  if (error) throw error
}

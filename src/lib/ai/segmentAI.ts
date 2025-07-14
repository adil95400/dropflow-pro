
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!)

export const analyzeSegments = async (text: string) => {
  const { data, error } = await supabase.functions.invoke('segment-analyzer', {
    body: { text }
  })
  if (error) throw error
  return data
}

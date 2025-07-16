
import { supabase } from './supabase'

export const analyzeImageContent = async (base64Image: string) => {
  const { data, error } = await supabase.functions.invoke('image-vision', {
    body: { image: base64Image }
  })
  if (error) throw error
  return data
}

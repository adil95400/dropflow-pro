
import { supabase } from './supabase'

export const scheduleBlogPost = async (title: string, content: string, publishDate: string) => {
  const { error } = await supabase.from('blogs').insert([{ title, content, publish_at: publishDate }])
  if (error) throw error
}

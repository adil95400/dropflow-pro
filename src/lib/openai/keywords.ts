
import { openai } from './openai'

export const generateKeywords = async (text: string) => {
  const res = await openai.chat.completions.create({
    messages: [{ role: 'user', content: `Génère 10 mots-clés SEO pour : "${text}"` }],
    model: 'gpt-4'
  })
  return res.choices[0].message.content
}

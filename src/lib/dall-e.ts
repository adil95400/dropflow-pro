
import { openai } from './openai'

export const generateImage = async (prompt: string) => {
  const response = await openai.images.generate({ prompt, n: 1, size: '1024x1024' })
  return response.data[0].url
}

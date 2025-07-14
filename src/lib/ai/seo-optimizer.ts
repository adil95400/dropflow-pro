import { openai } from '@/lib/openai'

export interface SEOOptimization {
  title: string
  description: string
  metaDescription: string
  keywords: string[]
  tags: string[]
  slug: string
  score: number
}

export class SEOOptimizer {
  async optimizeProduct(
    originalTitle: string,
    originalDescription: string,
    category: string,
    targetLanguage = 'fr'
  ): Promise<SEOOptimization> {
    const prompt = `
Tu es un expert SEO e-commerce spécialisé dans le dropshipping.

Optimise ce produit pour le référencement :
- Titre original : "${originalTitle}"
- Description originale : "${originalDescription}"
- Catégorie : "${category}"
- Langue cible : ${targetLanguage}

Génère :
1. Un titre SEO optimisé (60 caractères max)
2. Une description marketing convaincante (150-200 mots)
3. Une meta-description (160 caractères max)
4. 10 mots-clés pertinents
5. 5 tags produit
6. Un slug URL optimisé
7. Un score SEO estimé (0-100)

Réponds en JSON dans ce format exact :
{
  "title": "...",
  "description": "...",
  "metaDescription": "...",
  "keywords": [...],
  "tags": [...],
  "slug": "...",
  "score": 85
}
`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('No response from OpenAI')

      return JSON.parse(content)
    } catch (error) {
      console.error('SEO optimization error:', error)
      throw new Error('Failed to optimize SEO')
    }
  }

  async translateProduct(
    title: string,
    description: string,
    targetLanguage: string
  ): Promise<{ title: string; description: string }> {
    const languageNames = {
      fr: 'français',
      en: 'anglais',
      es: 'espagnol',
      de: 'allemand',
      it: 'italien',
    }

    const langName = languageNames[targetLanguage as keyof typeof languageNames] || targetLanguage

    const prompt = `
Traduis ce produit e-commerce en ${langName} en gardant un style marketing convaincant :

Titre : "${title}"
Description : "${description}"

Adapte le contenu au marché local et aux habitudes d'achat.
Réponds en JSON : {"title": "...", "description": "..."}
`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 800,
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('No response from OpenAI')

      return JSON.parse(content)
    } catch (error) {
      console.error('Translation error:', error)
      throw new Error('Failed to translate product')
    }
  }

  async generateCompetitorAnalysis(
    productTitle: string,
    category: string,
    marketplace = 'shopify'
  ): Promise<{
    averagePrice: number
    competitionLevel: 'low' | 'medium' | 'high'
    suggestedPrice: number
    marketInsights: string[]
  }> {
    const prompt = `
Analyse la concurrence pour ce produit :
- Produit : "${productTitle}"
- Catégorie : "${category}"
- Marketplace : ${marketplace}

Estime :
1. Prix moyen du marché (en euros)
2. Niveau de concurrence (low/medium/high)
3. Prix suggéré pour être compétitif
4. 3-5 insights marché importants

Réponds en JSON :
{
  "averagePrice": 29.99,
  "competitionLevel": "medium",
  "suggestedPrice": 24.99,
  "marketInsights": [...]
}
`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 600,
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('No response from OpenAI')

      return JSON.parse(content)
    } catch (error) {
      console.error('Competitor analysis error:', error)
      throw new Error('Failed to analyze competition')
    }
  }
}
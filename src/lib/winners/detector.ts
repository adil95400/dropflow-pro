import { openai } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

export interface WinningProduct {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  supplier: string
  category: string
  winnerScore: number
  reasons: string[]
  marketTrends: string[]
  competitionLevel: 'low' | 'medium' | 'high'
  profitPotential: number
  socialProof: {
    reviews: number
    rating: number
    orders: number
  }
  adSpend: {
    facebook: number
    google: number
    tiktok: number
  }
  createdAt: string
}

export class WinnerDetector {
  async analyzeProduct(productData: any): Promise<{
    isWinner: boolean
    score: number
    analysis: string
    reasons: string[]
  }> {
    const prompt = `
Tu es un expert en détection de produits gagnants pour le dropshipping.

Analyse ce produit et détermine s'il a le potentiel d'être un "winner" :

Produit :
- Titre : ${productData.title}
- Prix : ${productData.price}€
- Catégorie : ${productData.category}
- Commandes : ${productData.orders || 0}
- Note : ${productData.rating || 0}/5
- Avis : ${productData.reviews || 0}

Critères d'évaluation :
1. Potentiel de marge (>100%)
2. Demande du marché
3. Niveau de concurrence
4. Tendance sociale
5. Facilité de marketing
6. Saisonnalité
7. Problème résolu
8. Facteur "wow"

Réponds en JSON :
{
  "isWinner": true/false,
  "score": 85,
  "analysis": "Analyse détaillée...",
  "reasons": ["Raison 1", "Raison 2", ...]
}
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
      console.error('Winner analysis error:', error)
      throw new Error('Failed to analyze product')
    }
  }

  async detectTrendingProducts(category?: string): Promise<WinningProduct[]> {
    const prompt = `
Identifie 10 produits dropshipping tendance ${category ? `dans la catégorie ${category}` : 'toutes catégories'} pour 2024.

Pour chaque produit, fournis :
- Nom du produit
- Prix de vente suggéré
- Raisons du succès
- Niveau de concurrence
- Potentiel de profit

Réponds en JSON avec un array de produits :
[
  {
    "title": "Nom du produit",
    "price": 49.99,
    "category": "Électronique",
    "winnerScore": 85,
    "reasons": ["Raison 1", "Raison 2"],
    "competitionLevel": "medium",
    "profitPotential": 150
  }
]
`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 2000,
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('No response from OpenAI')

      const products = JSON.parse(content)
      
      // Transform to WinningProduct format
      return products.map((product: any) => ({
        id: `trending-${Date.now()}-${Math.random()}`,
        ...product,
        description: `Produit tendance détecté par IA avec un score de ${product.winnerScore}/100`,
        images: [`https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&w=400`],
        supplier: 'AI Detected',
        marketTrends: product.reasons,
        socialProof: {
          reviews: Math.floor(Math.random() * 1000) + 100,
          rating: 4.2 + Math.random() * 0.8,
          orders: Math.floor(Math.random() * 5000) + 500,
        },
        adSpend: {
          facebook: Math.floor(Math.random() * 10000) + 1000,
          google: Math.floor(Math.random() * 8000) + 800,
          tiktok: Math.floor(Math.random() * 15000) + 2000,
        },
        createdAt: new Date().toISOString(),
      }))
    } catch (error) {
      console.error('Trending products detection error:', error)
      throw new Error('Failed to detect trending products')
    }
  }

  async analyzeMarketTrends(niche: string): Promise<{
    trends: string[]
    opportunities: string[]
    threats: string[]
    seasonality: string
    growthPotential: number
  }> {
    const prompt = `
Analyse les tendances du marché dropshipping pour la niche : "${niche}"

Fournis :
1. 5 tendances actuelles
2. 3 opportunités à saisir
3. 3 menaces/défis
4. Analyse de saisonnalité
5. Potentiel de croissance (0-100)

Réponds en JSON :
{
  "trends": ["Tendance 1", ...],
  "opportunities": ["Opportunité 1", ...],
  "threats": ["Menace 1", ...],
  "seasonality": "Description saisonnalité",
  "growthPotential": 75
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
      console.error('Market trends analysis error:', error)
      throw new Error('Failed to analyze market trends')
    }
  }
}

// Database functions
export const saveWinningProduct = async (product: Omit<WinningProduct, 'id'>, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('winning_products')
      .insert({
        ...product,
        user_id: userId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to save winning product:', error)
    throw error
  }
}

export const getWinningProducts = async (userId: string, category?: string) => {
  try {
    let query = supabase
      .from('winning_products')
      .select('*')
      .eq('user_id', userId)
      .order('winner_score', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to get winning products:', error)
    throw error
  }
}

export const updateWinnerScore = async (productId: string, newScore: number, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('winning_products')
      .update({ winner_score: newScore })
      .eq('id', productId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to update winner score:', error)
    throw error
  }
}
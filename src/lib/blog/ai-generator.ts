import { openai } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

export interface BlogPost {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt?: string
  scheduledFor?: string
  status: 'draft' | 'scheduled' | 'published'
  tags: string[]
  seoTitle?: string
  seoDescription?: string
  featuredImage?: string
  userId: string
}

export class AIBlogGenerator {
  async generateBlogPost(
    topic: string,
    keywords: string[],
    targetAudience: string,
    tone: 'professional' | 'casual' | 'expert' = 'professional'
  ): Promise<Omit<BlogPost, 'id' | 'userId'>> {
    const prompt = `
Tu es un expert en rédaction de contenu pour le dropshipping et l'e-commerce.

Génère un article de blog complet sur le sujet : "${topic}"

Paramètres :
- Mots-clés à inclure : ${keywords.join(', ')}
- Audience cible : ${targetAudience}
- Ton : ${tone}

L'article doit :
1. Faire 1500-2000 mots
2. Être optimisé SEO
3. Inclure des sous-titres H2 et H3
4. Avoir une introduction accrocheuse
5. Contenir des conseils pratiques
6. Se terminer par un call-to-action

Réponds en JSON dans ce format :
{
  "title": "Titre accrocheur (60 caractères max)",
  "slug": "url-slug-optimise",
  "excerpt": "Résumé de 150 caractères",
  "content": "Contenu complet en markdown",
  "seoTitle": "Titre SEO optimisé",
  "seoDescription": "Meta description 160 caractères",
  "tags": ["tag1", "tag2", "tag3"],
  "author": "DropFlow Pro IA",
  "status": "draft"
}
`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 3000,
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('No response from OpenAI')

      const blogPost = JSON.parse(content)
      return {
        ...blogPost,
        publishedAt: null,
        scheduledFor: null,
      }
    } catch (error) {
      console.error('Blog generation error:', error)
      throw new Error('Failed to generate blog post')
    }
  }

  async generateContentIdeas(niche: string, count = 10): Promise<string[]> {
    const prompt = `
Génère ${count} idées d'articles de blog pour une audience dropshipping dans la niche : "${niche}"

Les idées doivent être :
- Pratiques et utiles
- Optimisées pour le SEO
- Engageantes pour les dropshippers
- Variées (guides, listes, analyses, tendances)

Réponds avec une liste JSON simple : ["Idée 1", "Idée 2", ...]
`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 500,
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('No response from OpenAI')

      return JSON.parse(content)
    } catch (error) {
      console.error('Content ideas generation error:', error)
      throw new Error('Failed to generate content ideas')
    }
  }

  async optimizeForSEO(content: string, targetKeywords: string[]): Promise<{
    optimizedContent: string
    seoScore: number
    suggestions: string[]
  }> {
    const prompt = `
Optimise ce contenu blog pour le SEO avec ces mots-clés : ${targetKeywords.join(', ')}

Contenu original :
${content}

Améliore :
1. Densité des mots-clés (2-3%)
2. Structure des titres H2/H3
3. Méta-descriptions
4. Liens internes suggérés
5. Lisibilité

Réponds en JSON :
{
  "optimizedContent": "Contenu optimisé",
  "seoScore": 85,
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}
`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 2000,
      })

      const content_response = response.choices[0]?.message?.content
      if (!content_response) throw new Error('No response from OpenAI')

      return JSON.parse(content_response)
    } catch (error) {
      console.error('SEO optimization error:', error)
      throw new Error('Failed to optimize content for SEO')
    }
  }
}

// Blog management functions
export const saveBlogPost = async (blogPost: Omit<BlogPost, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(blogPost)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to save blog post:', error)
    throw error
  }
}

export const scheduleBlogPost = async (
  postId: string,
  scheduledFor: string,
  userId: string
) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        scheduled_for: scheduledFor,
        status: 'scheduled',
      })
      .eq('id', postId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to schedule blog post:', error)
    throw error
  }
}

export const publishBlogPost = async (postId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to publish blog post:', error)
    throw error
  }
}

export const getBlogPosts = async (userId: string, status?: BlogPost['status']) => {
  try {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to get blog posts:', error)
    throw error
  }
}
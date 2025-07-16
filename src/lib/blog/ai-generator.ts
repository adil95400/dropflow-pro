import { openai } from '../openai';
import { supabase } from '../supabase';

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt?: string;
  scheduledFor?: string;
  status: 'draft' | 'scheduled' | 'published';
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  featuredImage?: string;
  userId: string;
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
`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 3000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      const blogPost = JSON.parse(content);
      return {
        ...blogPost,
        publishedAt: undefined,
        scheduledFor: undefined,
      };
    } catch (error) {
      console.error('Blog generation error:', error);
      
      // Fallback response in case of API error
      return {
        title: `Guide sur ${topic}`,
        slug: topic.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
        excerpt: `Un guide complet sur ${topic} pour les e-commerçants et dropshippers.`,
        content: `# Guide sur ${topic}\n\nCet article sera généré prochainement.\n\n## Introduction\n\nLe ${topic} est un sujet important pour les dropshippers.\n\n## Conclusion\n\nAppliquez ces conseils pour améliorer votre business.`,
        author: 'DropFlow Pro IA',
        status: 'draft',
        tags: keywords,
        seoTitle: `Guide Complet sur ${topic} pour Dropshippers [2024]`,
        seoDescription: `Découvrez notre guide complet sur ${topic} pour optimiser votre business de dropshipping en 2024.`,
      };
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
`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      return JSON.parse(content);
    } catch (error) {
      console.error('Content ideas generation error:', error);
      
      // Fallback response in case of API error
      return [
        `10 Produits Tendance dans la Niche ${niche} pour 2024`,
        `Guide Complet pour Démarrer en Dropshipping ${niche}`,
        `Comment Trouver les Meilleurs Fournisseurs de ${niche}`,
        `Stratégies Marketing pour Vendre des Produits ${niche}`,
        `Analyse de Marché : Le Secteur ${niche} en 2024`,
        `5 Erreurs à Éviter en Dropshipping ${niche}`,
        `Optimisation SEO pour une Boutique de ${niche}`,
        `Les Meilleures Plateformes pour Vendre des Produits ${niche}`,
        `Comment Créer des Fiches Produit Parfaites pour ${niche}`,
        `Étude de Cas : Comment J'ai Généré 10K€ avec des Produits ${niche}`,
      ];
    }
  }

  async optimizeForSEO(content: string, targetKeywords: string[]): Promise<{
    optimizedContent: string;
    seoScore: number;
    suggestions: string[];
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
`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 2000,
      });

      const content_response = response.choices[0]?.message?.content;
      if (!content_response) throw new Error('No response from OpenAI');

      return JSON.parse(content_response);
    } catch (error) {
      console.error('SEO optimization error:', error);
      
      // Fallback response in case of API error
      return {
        optimizedContent: content,
        seoScore: 70,
        suggestions: [
          'Augmenter la densité des mots-clés principaux',
          'Ajouter plus de sous-titres H2 et H3',
          'Inclure des liens internes vers d\'autres articles',
        ],
      };
    }
  }

  async generateFeaturedImagePrompt(title: string, topic: string): Promise<string> {
    const prompt = `
Génère une description détaillée pour créer une image de couverture pour un article de blog sur le sujet suivant :

Titre : "${title}"
Sujet : ${topic}

La description doit être précise et visuelle pour générer une image professionnelle et attrayante qui illustre parfaitement le sujet.
Limite ta réponse à 100 mots maximum.
`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 200,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Image prompt generation error:', error);
      return `Une image professionnelle illustrant ${title} pour un blog e-commerce.`;
    }
  }
}

// Database functions
export const saveBlogPost = async (blogPost: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: blogPost.title,
        slug: blogPost.slug,
        excerpt: blogPost.excerpt,
        content: blogPost.content,
        author: blogPost.author,
        published_at: blogPost.publishedAt,
        scheduled_for: blogPost.scheduledFor,
        status: blogPost.status,
        tags: blogPost.tags,
        seo_title: blogPost.seoTitle,
        seo_description: blogPost.seoDescription,
        featured_image: blogPost.featuredImage,
        user_id: blogPost.userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author,
      publishedAt: data.published_at,
      scheduledFor: data.scheduled_for,
      status: data.status,
      tags: data.tags,
      seoTitle: data.seo_title,
      seoDescription: data.seo_description,
      featuredImage: data.featured_image,
      userId: data.user_id,
    };
  } catch (error) {
    console.error('Failed to save blog post:', error);
    throw error;
  }
};

export const scheduleBlogPost = async (
  postId: string,
  scheduledFor: string,
  userId: string
): Promise<BlogPost> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        scheduled_for: scheduledFor,
        status: 'scheduled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author,
      publishedAt: data.published_at,
      scheduledFor: data.scheduled_for,
      status: data.status,
      tags: data.tags,
      seoTitle: data.seo_title,
      seoDescription: data.seo_description,
      featuredImage: data.featured_image,
      userId: data.user_id,
    };
  } catch (error) {
    console.error('Failed to schedule blog post:', error);
    throw error;
  }
};

export const publishBlogPost = async (postId: string, userId: string): Promise<BlogPost> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        scheduled_for: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author,
      publishedAt: data.published_at,
      scheduledFor: data.scheduled_for,
      status: data.status,
      tags: data.tags,
      seoTitle: data.seo_title,
      seoDescription: data.seo_description,
      featuredImage: data.featured_image,
      userId: data.user_id,
    };
  } catch (error) {
    console.error('Failed to publish blog post:', error);
    throw error;
  }
};

export const getBlogPosts = async (
  userId: string,
  options: {
    status?: 'draft' | 'scheduled' | 'published';
    tag?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<BlogPost[]> => {
  try {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('user_id', userId);

    if (options.status) {
      query = query.eq('status', options.status);
    }

    if (options.tag) {
      query = query.contains('tags', [options.tag]);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    
    return data.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      publishedAt: post.published_at,
      scheduledFor: post.scheduled_for,
      status: post.status,
      tags: post.tags,
      seoTitle: post.seo_title,
      seoDescription: post.seo_description,
      featuredImage: post.featured_image,
      userId: post.user_id,
    }));
  } catch (error) {
    console.error('Failed to get blog posts:', error);
    throw error;
  }
};

export const getBlogPost = async (
  postId: string,
  userId: string
): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Post not found
      }
      throw error;
    }
    
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author,
      publishedAt: data.published_at,
      scheduledFor: data.scheduled_for,
      status: data.status,
      tags: data.tags,
      seoTitle: data.seo_title,
      seoDescription: data.seo_description,
      featuredImage: data.featured_image,
      userId: data.user_id,
    };
  } catch (error) {
    console.error('Failed to get blog post:', error);
    throw error;
  }
};

export const updateBlogPost = async (
  postId: string,
  updates: Partial<BlogPost>,
  userId: string
): Promise<BlogPost> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        title: updates.title,
        slug: updates.slug,
        excerpt: updates.excerpt,
        content: updates.content,
        author: updates.author,
        published_at: updates.publishedAt,
        scheduled_for: updates.scheduledFor,
        status: updates.status,
        tags: updates.tags,
        seo_title: updates.seoTitle,
        seo_description: updates.seoDescription,
        featured_image: updates.featuredImage,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author,
      publishedAt: data.published_at,
      scheduledFor: data.scheduled_for,
      status: data.status,
      tags: data.tags,
      seoTitle: data.seo_title,
      seoDescription: data.seo_description,
      featuredImage: data.featured_image,
      userId: data.user_id,
    };
  } catch (error) {
    console.error('Failed to update blog post:', error);
    throw error;
  }
};

export const deleteBlogPost = async (postId: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    throw error;
  }
};

export const getBlogStats = async (userId: string): Promise<{
  total: number;
  published: number;
  scheduled: number;
  draft: number;
  views: number;
  topPost?: {
    id: string;
    title: string;
    views: number;
  };
}> => {
  try {
    // Get post counts by status
    const { data: counts, error: countsError } = await supabase
      .from('blog_posts')
      .select('status, count')
      .eq('user_id', userId)
      .group('status');

    if (countsError) throw countsError;
    
    // Get total views
    const { data: viewsData, error: viewsError } = await supabase
      .from('blog_views')
      .select('sum')
      .eq('user_id', userId)
      .single();

    if (viewsError && viewsError.code !== 'PGRST116') throw viewsError;
    
    // Get top post
    const { data: topPost, error: topPostError } = await supabase
      .from('blog_views')
      .select('post_id, views')
      .eq('user_id', userId)
      .order('views', { ascending: false })
      .limit(1)
      .single();

    if (topPostError && topPostError.code !== 'PGRST116') throw topPostError;
    
    let topPostDetails;
    if (topPost) {
      const { data: postDetails, error: postError } = await supabase
        .from('blog_posts')
        .select('id, title')
        .eq('id', topPost.post_id)
        .single();
        
      if (!postError) {
        topPostDetails = {
          id: postDetails.id,
          title: postDetails.title,
          views: topPost.views,
        };
      }
    }
    
    // Calculate stats
    const published = counts?.find(c => c.status === 'published')?.count || 0;
    const scheduled = counts?.find(c => c.status === 'scheduled')?.count || 0;
    const draft = counts?.find(c => c.status === 'draft')?.count || 0;
    const total = published + scheduled + draft;
    const views = viewsData?.sum || 0;
    
    return {
      total,
      published,
      scheduled,
      draft,
      views,
      topPost: topPostDetails,
    };
  } catch (error) {
    console.error('Failed to get blog stats:', error);
    throw error;
  }
};
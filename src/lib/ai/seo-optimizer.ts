import { openai } from '../openai';

export interface SEOOptimization {
  title: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  tags: string[];
  slug: string;
  score: number;
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
`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      return JSON.parse(content);
    } catch (error) {
      console.error('SEO optimization error:', error);
      
      // Fallback response in case of API error
      return {
        title: originalTitle,
        description: originalDescription,
        metaDescription: originalDescription.substring(0, 155) + '...',
        keywords: [category, ...originalTitle.split(' ').slice(0, 5)],
        tags: originalTitle.split(' ').slice(0, 5),
        slug: originalTitle.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
        score: 65,
      };
    }
  }

  async translateProduct(
    title: string,
    description: string,
    targetLanguage: string
  ): Promise<{ title: string; description: string }> {
    const languageNames: Record<string, string> = {
      fr: 'français',
      en: 'anglais',
      es: 'espagnol',
      de: 'allemand',
      it: 'italien',
      nl: 'néerlandais',
      pt: 'portugais',
      ru: 'russe',
      zh: 'chinois',
      ja: 'japonais',
    };

    const langName = languageNames[targetLanguage] || targetLanguage;

    const prompt = `
Traduis ce produit e-commerce en ${langName} en gardant un style marketing convaincant :

Titre : "${title}"
Description : "${description}"

Adapte le contenu au marché local et aux habitudes d'achat.
Réponds en JSON : {"title": "...", "description": "..."}
`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 800,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      return JSON.parse(content);
    } catch (error) {
      console.error('Translation error:', error);
      
      // Fallback response in case of API error
      return {
        title,
        description,
      };
    }
  }

  async generateCompetitorAnalysis(
    productTitle: string,
    category: string,
    marketplace = 'shopify'
  ): Promise<{
    averagePrice: number;
    competitionLevel: 'low' | 'medium' | 'high';
    suggestedPrice: number;
    marketInsights: string[];
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
`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 600,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      return JSON.parse(content);
    } catch (error) {
      console.error('Competitor analysis error:', error);
      
      // Fallback response in case of API error
      return {
        averagePrice: 29.99,
        competitionLevel: 'medium',
        suggestedPrice: 24.99,
        marketInsights: [
          'Marché en croissance constante',
          'Forte demande pendant les fêtes',
          'Opportunité de différenciation par la qualité',
        ],
      };
    }
  }

  async optimizeBulkProducts(
    products: Array<{ id: string; title: string; description: string; category: string }>,
    targetLanguage = 'fr'
  ): Promise<Record<string, SEOOptimization>> {
    const results: Record<string, SEOOptimization> = {};
    
    // Process products in batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      // Process batch in parallel
      const promises = batch.map(product => 
        this.optimizeProduct(product.title, product.description, product.category, targetLanguage)
          .then(result => {
            results[product.id] = result;
          })
          .catch(error => {
            console.error(`Error optimizing product ${product.id}:`, error);
            // Add fallback result
            results[product.id] = {
              title: product.title,
              description: product.description,
              metaDescription: product.description.substring(0, 155) + '...',
              keywords: [product.category, ...product.title.split(' ').slice(0, 5)],
              tags: product.title.split(' ').slice(0, 5),
              slug: product.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
              score: 65,
            };
          })
      );
      
      await Promise.all(promises);
      
      // Add a small delay between batches to avoid rate limits
      if (i + batchSize < products.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }

  async generateMetaTagsForWebsite(
    websiteName: string,
    description: string,
    mainKeywords: string[]
  ): Promise<{
    title: string;
    description: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
    twitterTitle: string;
    twitterDescription: string;
  }> {
    const prompt = `
Génère des meta tags SEO optimisés pour ce site e-commerce :
- Nom du site : "${websiteName}"
- Description : "${description}"
- Mots-clés principaux : ${mainKeywords.join(', ')}

Crée :
1. Title tag (60 caractères max)
2. Meta description (160 caractères max)
3. Meta keywords (10-15 mots-clés)
4. Open Graph title
5. Open Graph description
6. Twitter title
7. Twitter description

Réponds en JSON :
{
  "title": "...",
  "description": "...",
  "keywords": [...],
  "ogTitle": "...",
  "ogDescription": "...",
  "twitterTitle": "...",
  "twitterDescription": "..."
}
`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 800,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      return JSON.parse(content);
    } catch (error) {
      console.error('Meta tags generation error:', error);
      
      // Fallback response in case of API error
      return {
        title: `${websiteName} - ${description.substring(0, 30)}...`,
        description: description.substring(0, 155) + '...',
        keywords: mainKeywords,
        ogTitle: websiteName,
        ogDescription: description.substring(0, 155) + '...',
        twitterTitle: websiteName,
        twitterDescription: description.substring(0, 155) + '...',
      };
    }
  }
}

// Database functions
import { supabase } from '../supabase';

export const optimizeProductSEO = async (
  productId: string,
  userId: string,
  targetLanguage = 'fr'
): Promise<SEOOptimization> => {
  try {
    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('user_id', userId)
      .single();

    if (productError) throw productError;
    
    const optimizer = new SEOOptimizer();
    const optimization = await optimizer.optimizeProduct(
      product.title,
      product.description,
      product.category,
      targetLanguage
    );
    
    // Update product with optimized data
    await supabase
      .from('products')
      .update({
        title: optimization.title,
        description: optimization.description,
        meta_description: optimization.metaDescription,
        keywords: optimization.keywords,
        tags: optimization.tags,
        slug: optimization.slug,
        seo_score: optimization.score,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId);
    
    // Log optimization
    await supabase
      .from('seo_optimizations')
      .insert({
        user_id: userId,
        product_id: productId,
        original_title: product.title,
        optimized_title: optimization.title,
        original_description: product.description,
        optimized_description: optimization.description,
        score_before: product.seo_score || 0,
        score_after: optimization.score,
        language: targetLanguage,
        created_at: new Date().toISOString(),
      });
    
    return optimization;
  } catch (error) {
    console.error('Failed to optimize product SEO:', error);
    throw error;
  }
};

export const optimizeBulkProductsSEO = async (
  productIds: string[],
  userId: string,
  targetLanguage = 'fr'
): Promise<Record<string, SEOOptimization>> => {
  try {
    // Get products details
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .in('id', productIds);

    if (productsError) throw productsError;
    
    const optimizer = new SEOOptimizer();
    const optimizations = await optimizer.optimizeBulkProducts(
      products.map(product => ({
        id: product.id,
        title: product.title,
        description: product.description,
        category: product.category,
      })),
      targetLanguage
    );
    
    // Update products with optimized data
    for (const productId of Object.keys(optimizations)) {
      const optimization = optimizations[productId];
      const product = products.find(p => p.id === productId);
      
      await supabase
        .from('products')
        .update({
          title: optimization.title,
          description: optimization.description,
          meta_description: optimization.metaDescription,
          keywords: optimization.keywords,
          tags: optimization.tags,
          slug: optimization.slug,
          seo_score: optimization.score,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId);
      
      // Log optimization
      await supabase
        .from('seo_optimizations')
        .insert({
          user_id: userId,
          product_id: productId,
          original_title: product.title,
          optimized_title: optimization.title,
          original_description: product.description,
          optimized_description: optimization.description,
          score_before: product.seo_score || 0,
          score_after: optimization.score,
          language: targetLanguage,
          created_at: new Date().toISOString(),
        });
    }
    
    return optimizations;
  } catch (error) {
    console.error('Failed to optimize bulk products SEO:', error);
    throw error;
  }
};

export const translateProduct = async (
  productId: string,
  userId: string,
  targetLanguage: string
): Promise<{ title: string; description: string }> => {
  try {
    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('user_id', userId)
      .single();

    if (productError) throw productError;
    
    const optimizer = new SEOOptimizer();
    const translation = await optimizer.translateProduct(
      product.title,
      product.description,
      targetLanguage
    );
    
    // Store translation
    await supabase
      .from('product_translations')
      .upsert({
        product_id: productId,
        language: targetLanguage,
        title: translation.title,
        description: translation.description,
        created_at: new Date().toISOString(),
      });
    
    // Update product translations array
    const translations = product.translations || [];
    if (!translations.includes(targetLanguage.toUpperCase())) {
      await supabase
        .from('products')
        .update({
          translations: [...translations, targetLanguage.toUpperCase()],
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId);
    }
    
    return translation;
  } catch (error) {
    console.error('Failed to translate product:', error);
    throw error;
  }
};
import { supabase } from '@/lib/supabase'

export interface AliExpressProduct {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  variants: ProductVariant[]
  supplier: string
  category: string
  tags: string[]
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  stock: number
  sku: string
}

export class AliExpressAPI {
  private apiKey: string
  private baseUrl = 'https://api.aliexpress.com/v1'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async searchProducts(query: string, page = 1, limit = 20) {
    try {
      const response = await fetch(`${this.baseUrl}/products/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          query,
          page,
          limit,
          sort: 'orders_desc',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to search products')
      }

      return await response.json()
    } catch (error) {
      console.error('AliExpress API Error:', error)
      throw error
    }
  }

  async getProductDetails(productId: string): Promise<AliExpressProduct> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to get product details')
      }

      const data = await response.json()
      return this.transformProduct(data)
    } catch (error) {
      console.error('AliExpress API Error:', error)
      throw error
    }
  }

  async importProductFromUrl(url: string): Promise<AliExpressProduct> {
    const productId = this.extractProductIdFromUrl(url)
    return await this.getProductDetails(productId)
  }

  private extractProductIdFromUrl(url: string): string {
    const match = url.match(/\/item\/(\d+)\.html/)
    if (!match) {
      throw new Error('Invalid AliExpress URL')
    }
    return match[1]
  }

  private transformProduct(data: any): AliExpressProduct {
    return {
      id: data.product_id,
      title: data.subject,
      description: data.detail,
      price: parseFloat(data.app_sale_price),
      images: data.ae_multimedia_info_dto?.image_urls || [],
      variants: data.sku_info_dtos?.map((sku: any) => ({
        id: sku.sku_id,
        name: sku.sku_attr,
        price: parseFloat(sku.sku_price),
        stock: sku.sku_stock,
        sku: sku.sku_code,
      })) || [],
      supplier: 'AliExpress',
      category: data.category_id,
      tags: data.keywords?.split(',') || [],
    }
  }
}

// Product import service
export const importAliExpressProduct = async (url: string, userId: string) => {
  try {
    // Get API key from user settings
    const { data: settings } = await supabase
      .from('user_settings')
      .select('aliexpress_api_key')
      .eq('user_id', userId)
      .single()

    if (!settings?.aliexpress_api_key) {
      throw new Error('AliExpress API key not configured')
    }

    const api = new AliExpressAPI(settings.aliexpress_api_key)
    const product = await api.importProductFromUrl(url)

    // Save to database
    const { data, error } = await supabase
      .from('products')
      .insert({
        user_id: userId,
        external_id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        images: product.images,
        variants: product.variants,
        supplier: product.supplier,
        category: product.category,
        tags: product.tags,
        status: 'draft',
        source_url: url,
      })
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Import error:', error)
    throw error
  }
}
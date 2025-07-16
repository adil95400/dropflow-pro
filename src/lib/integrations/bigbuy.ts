export interface BigBuyProduct {
  id: string
  name: string
  description: string
  price: number
  wholesalePrice: number
  images: string[]
  category: string
  brand: string
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  stock: number
  ean: string
}

export class BigBuyAPI {
  private apiKey: string
  private baseUrl = 'https://api.bigbuy.eu'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async getProducts(page = 1, pageSize = 100): Promise<BigBuyProduct[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/rest/catalog/products.json?page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch BigBuy products')
      }

      const data = await response.json()
      return data.map(this.transformProduct)
    } catch (error) {
      console.error('BigBuy API Error:', error)
      throw error
    }
  }

  async getProductById(productId: string): Promise<BigBuyProduct> {
    try {
      const response = await fetch(
        `${this.baseUrl}/rest/catalog/products/${productId}.json`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch BigBuy product')
      }

      const data = await response.json()
      return this.transformProduct(data)
    } catch (error) {
      console.error('BigBuy API Error:', error)
      throw error
    }
  }

  async searchProducts(query: string): Promise<BigBuyProduct[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/rest/catalog/products.json?search=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to search BigBuy products')
      }

      const data = await response.json()
      return data.map(this.transformProduct)
    } catch (error) {
      console.error('BigBuy API Error:', error)
      throw error
    }
  }

  async getStock(productId: string): Promise<number> {
    try {
      const response = await fetch(
        `${this.baseUrl}/rest/catalog/productsstocks/${productId}.json`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to get BigBuy stock')
      }

      const data = await response.json()
      return data.quantity || 0
    } catch (error) {
      console.error('BigBuy Stock API Error:', error)
      return 0
    }
  }

  private transformProduct(data: any): BigBuyProduct {
    return {
      id: data.id.toString(),
      name: data.name,
      description: data.description,
      price: parseFloat(data.retailPrice),
      wholesalePrice: parseFloat(data.wholesalePrice),
      images: data.images?.map((img: any) => img.url) || [],
      category: data.category?.name || '',
      brand: data.brand?.name || '',
      weight: parseFloat(data.weight) || 0,
      dimensions: {
        length: parseFloat(data.length) || 0,
        width: parseFloat(data.width) || 0,
        height: parseFloat(data.height) || 0,
      },
      stock: data.quantity || 0,
      ean: data.ean || '',
    }
  }
}

export const importBigBuyProducts = async (userId: string, categoryId?: string) => {
  try {
    const { data: settings } = await supabase
      .from('user_settings')
      .select('bigbuy_api_key')
      .eq('user_id', userId)
      .single()

    if (!settings?.bigbuy_api_key) {
      throw new Error('BigBuy API key not configured')
    }

    const api = new BigBuyAPI(settings.bigbuy_api_key)
    const products = await api.getProducts()

    // Import products to database
    const importedProducts = []
    for (const product of products) {
      const { data, error } = await supabase
        .from('products')
        .insert({
          user_id: userId,
          external_id: product.id,
          title: product.name,
          description: product.description,
          price: product.price,
          original_price: product.wholesalePrice,
          images: product.images,
          supplier: 'BigBuy',
          category: product.category,
          tags: [product.brand, product.category].filter(Boolean),
          status: 'draft',
          stock: product.stock,
        })
        .select()
        .single()

      if (!error) {
        importedProducts.push(data)
      }
    }

    return importedProducts
  } catch (error) {
    console.error('BigBuy import error:', error)
    throw error
  }
}
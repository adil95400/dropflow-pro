export interface ShopifyProduct {
  id: string
  title: string
  body_html: string
  vendor: string
  product_type: string
  handle: string
  status: string
  images: ShopifyImage[]
  variants: ShopifyVariant[]
  options: ShopifyOption[]
  tags: string
}

export interface ShopifyImage {
  id: string
  src: string
  alt: string
  position: number
}

export interface ShopifyVariant {
  id: string
  title: string
  price: string
  sku: string
  inventory_quantity: number
  weight: number
  requires_shipping: boolean
}

export interface ShopifyOption {
  id: string
  name: string
  position: number
  values: string[]
}

export class ShopifyAPI {
  private shopDomain: string
  private accessToken: string
  private apiVersion = '2023-10'

  constructor(shopDomain: string, accessToken: string) {
    this.shopDomain = shopDomain
    this.accessToken = accessToken
  }

  private get baseUrl() {
    return `https://${this.shopDomain}.myshopify.com/admin/api/${this.apiVersion}`
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-Shopify-Access-Token': this.accessToken,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Shopify API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getProducts(limit = 50): Promise<ShopifyProduct[]> {
    const data = await this.request(`/products.json?limit=${limit}`)
    return data.products
  }

  async getProduct(productId: string): Promise<ShopifyProduct> {
    const data = await this.request(`/products/${productId}.json`)
    return data.product
  }

  async createProduct(product: Partial<ShopifyProduct>): Promise<ShopifyProduct> {
    const data = await this.request('/products.json', {
      method: 'POST',
      body: JSON.stringify({ product }),
    })
    return data.product
  }

  async updateProduct(productId: string, product: Partial<ShopifyProduct>): Promise<ShopifyProduct> {
    const data = await this.request(`/products/${productId}.json`, {
      method: 'PUT',
      body: JSON.stringify({ product }),
    })
    return data.product
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.request(`/products/${productId}.json`, {
      method: 'DELETE',
    })
  }

  async getOrders(status = 'any', limit = 50) {
    const data = await this.request(`/orders.json?status=${status}&limit=${limit}`)
    return data.orders
  }

  async createWebhook(topic: string, address: string) {
    const webhook = {
      topic,
      address,
      format: 'json',
    }

    const data = await this.request('/webhooks.json', {
      method: 'POST',
      body: JSON.stringify({ webhook }),
    })

    return data.webhook
  }
}

export const syncProductToShopify = async (productId: string, userId: string) => {
  try {
    // Get user's Shopify credentials
    const { data: connection } = await supabase
      .from('store_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', 'shopify')
      .eq('status', 'active')
      .single()

    if (!connection) {
      throw new Error('Shopify store not connected')
    }

    // Get product from database
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('user_id', userId)
      .single()

    if (!product) {
      throw new Error('Product not found')
    }

    const shopify = new ShopifyAPI(connection.store_url, connection.api_key)

    // Transform product for Shopify
    const shopifyProduct = {
      title: product.title,
      body_html: product.description,
      vendor: product.supplier,
      product_type: product.category,
      tags: product.tags?.join(', ') || '',
      images: product.images?.map((src: string, index: number) => ({
        src,
        position: index + 1,
      })) || [],
      variants: [
        {
          title: 'Default Title',
          price: product.price.toString(),
          sku: product.external_id,
          inventory_quantity: product.stock || 0,
          requires_shipping: true,
        },
      ],
    }

    let syncedProduct
    if (product.shopify_product_id) {
      // Update existing product
      syncedProduct = await shopify.updateProduct(product.shopify_product_id, shopifyProduct)
    } else {
      // Create new product
      syncedProduct = await shopify.createProduct(shopifyProduct)
      
      // Update product with Shopify ID
      await supabase
        .from('products')
        .update({ shopify_product_id: syncedProduct.id })
        .eq('id', productId)
    }

    return syncedProduct
  } catch (error) {
    console.error('Shopify sync error:', error)
    throw error
  }
}
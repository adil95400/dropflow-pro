import { supabase } from './supabase';

export interface AliExpressProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount?: number;
  images: string[];
  variants: AliExpressVariant[];
  attributes: AliExpressAttribute[];
  rating: number;
  reviews: number;
  orders: number;
  shipping: AliExpressShipping[];
  storeInfo: AliExpressStore;
  categoryId: string;
  categoryName: string;
}

export interface AliExpressVariant {
  id: string;
  name: string;
  values: {
    id: string;
    name: string;
    image?: string;
  }[];
  skus: {
    skuId: string;
    price: number;
    availableQuantity: number;
    properties: string[];
    propertyValueIds: string[];
  }[];
}

export interface AliExpressAttribute {
  name: string;
  value: string;
}

export interface AliExpressShipping {
  company: string;
  cost: number;
  deliveryTime: string;
  trackingAvailable: boolean;
}

export interface AliExpressStore {
  id: string;
  name: string;
  rating: number;
  positiveRating: number;
  topRated: boolean;
}

export class AliExpressAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl = 'https://api.aliexpress.com/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  // Extract product ID from AliExpress URL
  extractProductId(url: string): string {
    // Handle different URL formats
    const patterns = [
      /\/item\/(\d+)\.html/,
      /\/product\/(\d+)\.html/,
      /aliexpress\.com\/i\/(\d+)\.html/,
      /\/(\d+)\.html/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    throw new Error('Invalid AliExpress URL. Could not extract product ID.');
  }

  // Get product details by ID
  async getProductById(productId: string): Promise<AliExpressProduct> {
    try {
      // In a real implementation, this would make an API call to AliExpress
      // For now, we'll use a mock implementation
      const response = await this.mockApiCall(`/product/${productId}`);
      return this.transformProductData(response);
    } catch (error) {
      console.error('Error fetching product from AliExpress:', error);
      throw error;
    }
  }

  // Search products
  async searchProducts(
    query: string,
    options: {
      page?: number;
      limit?: number;
      sort?: 'price_asc' | 'price_desc' | 'orders' | 'newest';
      minPrice?: number;
      maxPrice?: number;
      freeShipping?: boolean;
      categoryId?: string;
    } = {}
  ): Promise<AliExpressProduct[]> {
    try {
      const { page = 1, limit = 20 } = options;
      
      // In a real implementation, this would make an API call to AliExpress
      // For now, we'll use a mock implementation
      const response = await this.mockApiCall('/search', {
        query,
        page,
        limit,
        ...options,
      });
      
      return response.products.map((product: any) => this.transformProductData(product));
    } catch (error) {
      console.error('Error searching products on AliExpress:', error);
      throw error;
    }
  }

  // Get product shipping options
  async getShippingOptions(
    productId: string,
    countryCode: string,
    quantity = 1
  ): Promise<AliExpressShipping[]> {
    try {
      // In a real implementation, this would make an API call to AliExpress
      // For now, we'll use a mock implementation
      const response = await this.mockApiCall(`/shipping/${productId}`, {
        country: countryCode,
        quantity,
      });
      
      return response.shipping.map((shipping: any) => ({
        company: shipping.company,
        cost: shipping.cost,
        deliveryTime: shipping.delivery_time,
        trackingAvailable: shipping.tracking_available,
      }));
    } catch (error) {
      console.error('Error fetching shipping options from AliExpress:', error);
      throw error;
    }
  }

  // Import product from URL
  async importProductFromUrl(url: string): Promise<AliExpressProduct> {
    const productId = this.extractProductId(url);
    return this.getProductById(productId);
  }

  // Mock API call for development/demo purposes
  private async mockApiCall(endpoint: string, params: any = {}): Promise<any> {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate mock data based on endpoint and params
    if (endpoint.startsWith('/product/')) {
      const productId = endpoint.split('/')[2];
      return this.generateMockProduct(productId);
    }
    
    if (endpoint === '/search') {
      return this.generateMockSearchResults(params);
    }
    
    if (endpoint.startsWith('/shipping/')) {
      return this.generateMockShippingOptions(params);
    }
    
    throw new Error(`Unsupported mock endpoint: ${endpoint}`);
  }

  // Generate mock product data
  private generateMockProduct(productId: string): any {
    const productIdNum = parseInt(productId, 10) % 10; // Use modulo to get consistent mock data
    
    const products = [
      {
        id: productId,
        title: 'Montre Connectée Sport Pro Max',
        description: 'Montre connectée étanche avec GPS, moniteur cardiaque et 50+ modes sport. Autonomie 7 jours. Compatible iOS et Android. Notifications, contrôle musique, et plus encore.',
        price: 45.99,
        original_price: 89.99,
        discount: 49,
        images: [
          'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
        ],
        variants: [
          {
            name: 'Color',
            values: [
              { id: '1', name: 'Black', image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { id: '2', name: 'Silver', image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { id: '3', name: 'Blue', image: 'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400' },
            ],
            skus: [
              { skuId: '101', price: 45.99, availableQuantity: 999, properties: ['1'], propertyValueIds: ['1'] },
              { skuId: '102', price: 47.99, availableQuantity: 888, properties: ['2'], propertyValueIds: ['2'] },
              { skuId: '103', price: 49.99, availableQuantity: 777, properties: ['3'], propertyValueIds: ['3'] },
            ],
          },
        ],
        attributes: [
          { name: 'Brand', value: 'SportTech' },
          { name: 'Model', value: 'Pro Max 2024' },
          { name: 'Waterproof', value: 'IP68' },
          { name: 'Battery Life', value: '7 days' },
          { name: 'Display', value: '1.4 inch AMOLED' },
        ],
        rating: 4.8,
        reviews: 1247,
        orders: 5432,
        shipping: [
          { company: 'AliExpress Standard Shipping', cost: 0, deliveryTime: '15-30 days', trackingAvailable: true },
          { company: 'DHL', cost: 12.99, deliveryTime: '7-14 days', trackingAvailable: true },
        ],
        store: {
          id: '12345',
          name: 'Official SportTech Store',
          rating: 97.8,
          positiveRating: 98,
          topRated: true,
        },
        category_id: '200003242',
        category_name: 'Smart Watches',
      },
      {
        id: productId,
        title: 'Écouteurs Bluetooth Premium ANC',
        description: 'Écouteurs sans fil avec réduction de bruit active, son Hi-Fi et boîtier de charge rapide. Autonomie 30h totale. Résistants à l\'eau IPX5. Contrôle tactile et assistant vocal.',
        price: 32.50,
        original_price: 79.99,
        discount: 59,
        images: [
          'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=400',
        ],
        variants: [
          {
            name: 'Color',
            values: [
              { id: '1', name: 'Black', image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { id: '2', name: 'White', image: 'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=400' },
            ],
            skus: [
              { skuId: '201', price: 32.50, availableQuantity: 999, properties: ['1'], propertyValueIds: ['1'] },
              { skuId: '202', price: 32.50, availableQuantity: 888, properties: ['2'], propertyValueIds: ['2'] },
            ],
          },
        ],
        attributes: [
          { name: 'Brand', value: 'AudioPro' },
          { name: 'Model', value: 'AP-300' },
          { name: 'Waterproof', value: 'IPX5' },
          { name: 'Battery Life', value: '6h + 24h case' },
          { name: 'Noise Cancellation', value: 'Active (ANC)' },
        ],
        rating: 4.7,
        reviews: 892,
        orders: 3245,
        shipping: [
          { company: 'AliExpress Standard Shipping', cost: 0, deliveryTime: '15-30 days', trackingAvailable: true },
          { company: 'DHL', cost: 9.99, deliveryTime: '7-14 days', trackingAvailable: true },
        ],
        store: {
          id: '67890',
          name: 'AudioPro Official Store',
          rating: 96.5,
          positiveRating: 97,
          topRated: true,
        },
        category_id: '200003242',
        category_name: 'Bluetooth Earphones',
      },
    ];
    
    return products[productIdNum % products.length];
  }

  // Generate mock search results
  private generateMockSearchResults(params: any): any {
    const { query, limit = 20 } = params;
    
    const products = [];
    
    for (let i = 0; i < limit; i++) {
      products.push(this.generateMockProduct(`${1000 + i}`));
    }
    
    return {
      total: 1000,
      page: params.page || 1,
      limit,
      products,
    };
  }

  // Generate mock shipping options
  private generateMockShippingOptions(params: any): any {
    const { country } = params;
    
    const shipping = [
      { company: 'AliExpress Standard Shipping', cost: 0, delivery_time: '15-30 days', tracking_available: true },
      { company: 'DHL', cost: country === 'US' ? 12.99 : 15.99, delivery_time: '7-14 days', tracking_available: true },
      { company: 'FedEx', cost: country === 'US' ? 19.99 : 24.99, delivery_time: '5-10 days', tracking_available: true },
    ];
    
    return { shipping };
  }

  // Transform API response to our product model
  private transformProductData(data: any): AliExpressProduct {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      originalPrice: data.original_price,
      discount: data.discount,
      images: data.images,
      variants: data.variants.map((variant: any) => ({
        id: variant.id || variant.name,
        name: variant.name,
        values: variant.values,
        skus: variant.skus,
      })),
      attributes: data.attributes,
      rating: data.rating,
      reviews: data.reviews,
      orders: data.orders,
      shipping: data.shipping.map((shipping: any) => ({
        company: shipping.company,
        cost: shipping.cost,
        deliveryTime: shipping.delivery_time || shipping.deliveryTime,
        trackingAvailable: shipping.tracking_available || shipping.trackingAvailable,
      })),
      storeInfo: {
        id: data.store.id,
        name: data.store.name,
        rating: data.store.rating,
        positiveRating: data.store.positiveRating,
        topRated: data.store.topRated,
      },
      categoryId: data.category_id,
      categoryName: data.category_name,
    };
  }
}

// Database functions
export const importAliExpressProduct = async (
  url: string,
  userId: string
): Promise<any> => {
  try {
    // Get API key from user settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('aliexpress_api_key')
      .eq('user_id', userId)
      .single();

    if (settingsError) throw settingsError;
    if (!settings?.aliexpress_api_key) {
      throw new Error('AliExpress API key not configured');
    }

    const api = new AliExpressAPI(settings.aliexpress_api_key);
    
    // Import product from URL
    const product = await api.importProductFromUrl(url);
    
    // Calculate profit margin
    const suggestedPrice = Math.ceil(product.price * 2.5); // 150% markup
    
    // Save to database
    const { data, error } = await supabase
      .from('products')
      .insert({
        user_id: userId,
        title: product.title,
        description: product.description,
        price: suggestedPrice,
        original_price: product.price,
        images: product.images,
        supplier: 'AliExpress',
        category: product.categoryName,
        tags: product.attributes.map(attr => attr.value),
        status: 'draft',
        external_id: product.id,
        source_url: url,
        variants: product.variants,
        attributes: product.attributes,
        shipping_options: product.shipping,
        store_info: product.storeInfo,
        source: 'aliexpress',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    
    // Update user stats
    await supabase.rpc('increment_user_stat', {
      user_id: userId,
      stat_name: 'products',
      increment_by: 1
    });
    
    return data;
  } catch (error) {
    console.error('Failed to import AliExpress product:', error);
    throw error;
  }
};

export const importAliExpressProductsBulk = async (
  urls: string[],
  userId: string
): Promise<{ success: number; failed: number; products: any[] }> => {
  try {
    // Get API key from user settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('aliexpress_api_key')
      .eq('user_id', userId)
      .single();

    if (settingsError) throw settingsError;
    if (!settings?.aliexpress_api_key) {
      throw new Error('AliExpress API key not configured');
    }

    const api = new AliExpressAPI(settings.aliexpress_api_key);
    
    const results = {
      success: 0,
      failed: 0,
      products: [] as any[],
    };
    
    // Process each URL
    for (const url of urls) {
      try {
        // Import product from URL
        const product = await api.importProductFromUrl(url);
        
        // Calculate profit margin
        const suggestedPrice = Math.ceil(product.price * 2.5); // 150% markup
        
        // Save to database
        const { data, error } = await supabase
          .from('products')
          .insert({
            user_id: userId,
            title: product.title,
            description: product.description,
            price: suggestedPrice,
            original_price: product.price,
            images: product.images,
            supplier: 'AliExpress',
            category: product.categoryName,
            tags: product.attributes.map(attr => attr.value),
            status: 'draft',
            external_id: product.id,
            source_url: url,
            variants: product.variants,
            attributes: product.attributes,
            shipping_options: product.shipping,
            store_info: product.storeInfo,
            source: 'aliexpress',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        
        results.success++;
        results.products.push(data);
      } catch (error) {
        console.error(`Failed to import AliExpress product from URL ${url}:`, error);
        results.failed++;
      }
    }
    
    // Update user stats
    if (results.success > 0) {
      await supabase.rpc('increment_user_stat', {
        user_id: userId,
        stat_name: 'products',
        increment_by: results.success
      });
    }
    
    return results;
  } catch (error) {
    console.error('Failed to import AliExpress products in bulk:', error);
    throw error;
  }
};

export const searchAliExpressProducts = async (
  query: string,
  userId: string,
  options: {
    page?: number;
    limit?: number;
    sort?: 'price_asc' | 'price_desc' | 'orders' | 'newest';
    minPrice?: number;
    maxPrice?: number;
    freeShipping?: boolean;
    categoryId?: string;
  } = {}
): Promise<AliExpressProduct[]> => {
  try {
    // Get API key from user settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('aliexpress_api_key')
      .eq('user_id', userId)
      .single();

    if (settingsError) throw settingsError;
    if (!settings?.aliexpress_api_key) {
      throw new Error('AliExpress API key not configured');
    }

    const api = new AliExpressAPI(settings.aliexpress_api_key);
    
    // Search products
    return await api.searchProducts(query, options);
  } catch (error) {
    console.error('Failed to search AliExpress products:', error);
    throw error;
  }
};

export const getAliExpressShippingOptions = async (
  productId: string,
  countryCode: string,
  userId: string,
  quantity = 1
): Promise<AliExpressShipping[]> => {
  try {
    // Get API key from user settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('aliexpress_api_key')
      .eq('user_id', userId)
      .single();

    if (settingsError) throw settingsError;
    if (!settings?.aliexpress_api_key) {
      throw new Error('AliExpress API key not configured');
    }

    const api = new AliExpressAPI(settings.aliexpress_api_key);
    
    // Get shipping options
    return await api.getShippingOptions(productId, countryCode, quantity);
  } catch (error) {
    console.error('Failed to get AliExpress shipping options:', error);
    throw error;
  }
};
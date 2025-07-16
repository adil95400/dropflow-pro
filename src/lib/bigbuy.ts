import { supabase } from './supabase';

export interface BigBuyProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  wholesalePrice: number;
  images: string[];
  category: string;
  brand: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  stock: number;
  ean: string;
  attributes?: Record<string, string>;
  variants?: BigBuyVariant[];
}

export interface BigBuyVariant {
  id: string;
  name: string;
  price: number;
  wholesalePrice: number;
  stock: number;
  sku: string;
  attributes: Record<string, string>;
}

export interface BigBuyCategory {
  id: string;
  name: string;
  parentId?: string;
  children?: BigBuyCategory[];
}

export interface BigBuyOrder {
  id: string;
  reference: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: BigBuyAddress;
  products: BigBuyOrderProduct[];
  tracking?: {
    carrier: string;
    trackingNumber: string;
    url: string;
  };
}

export interface BigBuyAddress {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  postalCode: string;
  city: string;
  province: string;
  country: string;
  phone: string;
  email: string;
}

export interface BigBuyOrderProduct {
  id: string;
  quantity: number;
  price: number;
}

export class BigBuyAPI {
  private apiKey: string;
  private baseUrl = 'https://api.bigbuy.eu';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`BigBuy API Error: ${response.status} - ${JSON.stringify(error)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('BigBuy API request failed:', error);
      throw error;
    }
  }

  // Products
  async getProducts(page = 1, pageSize = 100): Promise<BigBuyProduct[]> {
    const response = await this.request<any[]>(`/rest/catalog/products?page=${page}&pageSize=${pageSize}`);
    return response.map(this.transformProduct);
  }

  async getProductById(productId: string): Promise<BigBuyProduct> {
    const response = await this.request<any>(`/rest/catalog/productinfo/${productId}`);
    return this.transformProduct(response);
  }

  async getProductStock(productId: string): Promise<number> {
    const response = await this.request<any>(`/rest/catalog/productstock/${productId}`);
    return response.stocks.reduce((total: number, stock: any) => total + stock.quantity, 0);
  }

  async getProductCategories(): Promise<BigBuyCategory[]> {
    const response = await this.request<any[]>('/rest/catalog/categories');
    return response.map(this.transformCategory);
  }

  // Orders
  async createOrder(order: {
    shipping: BigBuyAddress;
    products: { id: string; quantity: number }[];
  }): Promise<string> {
    const response = await this.request<{ order_id: string }>('/rest/order/create', {
      method: 'POST',
      body: JSON.stringify(order),
    });
    return response.order_id;
  }

  async getOrder(orderId: string): Promise<BigBuyOrder> {
    const response = await this.request<any>(`/rest/order/info/${orderId}`);
    return this.transformOrder(response);
  }

  async getOrderTracking(orderId: string): Promise<any> {
    const response = await this.request<any>(`/rest/order/tracking/${orderId}`);
    return response;
  }

  // Search
  async searchProducts(query: string, page = 1, pageSize = 100): Promise<BigBuyProduct[]> {
    const response = await this.request<any[]>(`/rest/catalog/productsearch?search=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`);
    return response.map(this.transformProduct);
  }

  // Helper methods
  private transformProduct(product: any): BigBuyProduct {
    return {
      id: product.id.toString(),
      name: product.name,
      description: product.description || '',
      price: parseFloat(product.price || product.retailPrice || '0'),
      wholesalePrice: parseFloat(product.wholesalePrice || '0'),
      images: product.images?.map((img: any) => img.url) || [],
      category: product.category?.name || '',
      brand: product.manufacturer?.name || '',
      weight: parseFloat(product.weight || '0'),
      dimensions: {
        length: parseFloat(product.length || '0'),
        width: parseFloat(product.width || '0'),
        height: parseFloat(product.height || '0'),
      },
      stock: product.stock || 0,
      ean: product.ean || '',
      attributes: product.attributes?.reduce((acc: Record<string, string>, attr: any) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {}),
      variants: product.variants?.map((variant: any) => ({
        id: variant.id.toString(),
        name: variant.name,
        price: parseFloat(variant.price || '0'),
        wholesalePrice: parseFloat(variant.wholesalePrice || '0'),
        stock: variant.stock || 0,
        sku: variant.sku || '',
        attributes: variant.attributes?.reduce((acc: Record<string, string>, attr: any) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {}),
      })),
    };
  }

  private transformCategory(category: any): BigBuyCategory {
    return {
      id: category.id.toString(),
      name: category.name,
      parentId: category.parent_id ? category.parent_id.toString() : undefined,
    };
  }

  private transformOrder(order: any): BigBuyOrder {
    return {
      id: order.id.toString(),
      reference: order.reference,
      status: order.status,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      shippingAddress: {
        firstName: order.shipping.first_name,
        lastName: order.shipping.last_name,
        address: order.shipping.address,
        address2: order.shipping.address2,
        postalCode: order.shipping.postcode,
        city: order.shipping.city,
        province: order.shipping.province,
        country: order.shipping.country,
        phone: order.shipping.phone,
        email: order.shipping.email,
      },
      products: order.products.map((product: any) => ({
        id: product.id.toString(),
        quantity: product.quantity,
        price: parseFloat(product.price),
      })),
      tracking: order.tracking ? {
        carrier: order.tracking.carrier,
        trackingNumber: order.tracking.number,
        url: order.tracking.url,
      } : undefined,
    };
  }
}

// Database functions
export const importBigBuyProducts = async (
  userId: string,
  categoryId?: string,
  page = 1,
  pageSize = 100
): Promise<number> => {
  try {
    // Get API key from user settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('bigbuy_api_key')
      .eq('user_id', userId)
      .single();

    if (settingsError) throw settingsError;
    if (!settings?.bigbuy_api_key) {
      throw new Error('BigBuy API key not configured');
    }

    const api = new BigBuyAPI(settings.bigbuy_api_key);
    
    // Get products from BigBuy
    let products: BigBuyProduct[];
    
    if (categoryId) {
      products = await api.searchProducts(`category:${categoryId}`, page, pageSize);
    } else {
      products = await api.getProducts(page, pageSize);
    }
    
    // Import products to database
    let successCount = 0;
    
    for (const product of products) {
      try {
        // Check if product already exists
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id')
          .eq('external_id', product.id)
          .eq('user_id', userId)
          .eq('supplier', 'BigBuy')
          .single();
        
        if (existingProduct) {
          // Update existing product
          await supabase
            .from('products')
            .update({
              title: product.name,
              description: product.description,
              price: product.price,
              original_price: product.wholesalePrice,
              images: product.images,
              category: product.category,
              tags: [product.brand, product.category].filter(Boolean),
              stock: product.stock,
              variants: product.variants,
              attributes: product.attributes,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingProduct.id);
        } else {
          // Create new product
          await supabase
            .from('products')
            .insert({
              user_id: userId,
              title: product.name,
              description: product.description,
              price: product.price,
              original_price: product.wholesalePrice,
              images: product.images,
              supplier: 'BigBuy',
              category: product.category,
              tags: [product.brand, product.category].filter(Boolean),
              status: 'draft',
              external_id: product.id,
              stock: product.stock,
              variants: product.variants,
              attributes: product.attributes,
              source: 'bigbuy',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
        }
        
        successCount++;
      } catch (error) {
        console.error(`Failed to import BigBuy product ${product.id}:`, error);
      }
    }
    
    // Update import history
    await supabase
      .from('sync_history')
      .insert({
        user_id: userId,
        type: 'import',
        status: 'success',
        platforms: { bigbuy: true },
        items_processed: products.length,
        items_succeeded: successCount,
        items_failed: products.length - successCount,
        duration: 0, // Calculate actual duration in production
        initiated_by: 'user',
      });
    
    return successCount;
  } catch (error) {
    console.error('Failed to import BigBuy products:', error);
    
    // Log import failure
    await supabase
      .from('sync_history')
      .insert({
        user_id: userId,
        type: 'import',
        status: 'failed',
        platforms: { bigbuy: true },
        items_processed: 0,
        items_succeeded: 0,
        items_failed: 0,
        duration: 0,
        initiated_by: 'user',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    
    throw error;
  }
};

export const createBigBuyOrder = async (
  userId: string,
  orderId: string
): Promise<string> => {
  try {
    // Get API key from user settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('bigbuy_api_key')
      .eq('user_id', userId)
      .single();

    if (settingsError) throw settingsError;
    if (!settings?.bigbuy_api_key) {
      throw new Error('BigBuy API key not configured');
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (orderError) throw orderError;
    
    // Get order items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) throw itemsError;
    
    const api = new BigBuyAPI(settings.bigbuy_api_key);
    
    // Create order in BigBuy
    const bigbuyOrderId = await api.createOrder({
      shipping: {
        firstName: order.shipping_address.first_name,
        lastName: order.shipping_address.last_name,
        address: order.shipping_address.address1,
        address2: order.shipping_address.address2,
        postalCode: order.shipping_address.zip,
        city: order.shipping_address.city,
        province: order.shipping_address.province || '',
        country: order.shipping_address.country,
        phone: order.shipping_address.phone || '',
        email: order.customer_email,
      },
      products: orderItems
        .filter(item => item.supplier === 'BigBuy')
        .map(item => ({
          id: item.external_id,
          quantity: item.quantity,
        })),
    });
    
    // Update order with BigBuy order ID
    await supabase
      .from('orders')
      .update({
        external_order_id: bigbuyOrderId,
        status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);
    
    return bigbuyOrderId;
  } catch (error) {
    console.error('Failed to create BigBuy order:', error);
    throw error;
  }
};

export const updateBigBuyOrderTracking = async (
  userId: string,
  orderId: string
): Promise<any> => {
  try {
    // Get API key from user settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('bigbuy_api_key')
      .eq('user_id', userId)
      .single();

    if (settingsError) throw settingsError;
    if (!settings?.bigbuy_api_key) {
      throw new Error('BigBuy API key not configured');
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (orderError) throw orderError;
    if (!order.external_order_id) {
      throw new Error('Order not yet processed by BigBuy');
    }
    
    const api = new BigBuyAPI(settings.bigbuy_api_key);
    
    // Get tracking information
    const tracking = await api.getOrderTracking(order.external_order_id);
    
    if (tracking && tracking.carrier && tracking.number) {
      // Update order with tracking information
      await supabase
        .from('orders')
        .update({
          tracking_number: tracking.number,
          carrier: tracking.carrier,
          tracking_url: tracking.url,
          status: 'shipped',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);
    }
    
    return tracking;
  } catch (error) {
    console.error('Failed to update BigBuy order tracking:', error);
    throw error;
  }
};
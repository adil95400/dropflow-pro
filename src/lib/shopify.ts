import { supabase } from './supabase';

export interface ShopifyStore {
  id: string;
  name: string;
  domain: string;
  accessToken: string;
  apiVersion: string;
  isActive: boolean;
  lastSynced?: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  vendor: string;
  productType: string;
  handle: string;
  status: string;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  options: ShopifyOption[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyImage {
  id: string;
  src: string;
  alt?: string;
  position: number;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: string;
  sku: string;
  inventoryQuantity: number;
  weight: number;
  requiresShipping: boolean;
}

export interface ShopifyOption {
  id: string;
  name: string;
  position: number;
  values: string[];
}

export interface ShopifyOrder {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  totalPrice: string;
  currency: string;
  financialStatus: string;
  fulfillmentStatus: string;
  lineItems: ShopifyLineItem[];
  shippingAddress?: ShopifyAddress;
}

export interface ShopifyLineItem {
  id: string;
  title: string;
  quantity: number;
  price: string;
  sku: string;
  variantId: string;
  productId: string;
}

export interface ShopifyAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  zip: string;
  country: string;
  phone?: string;
}

export class ShopifyClient {
  private shopDomain: string;
  private accessToken: string;
  private apiVersion: string;

  constructor(shopDomain: string, accessToken: string, apiVersion = '2023-10') {
    this.shopDomain = shopDomain;
    this.accessToken = accessToken;
    this.apiVersion = apiVersion;
  }

  private get baseUrl() {
    return `https://${this.shopDomain}/admin/api/${this.apiVersion}`;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'X-Shopify-Access-Token': this.accessToken,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Shopify API Error: ${response.status} - ${JSON.stringify(error)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Shopify API request failed:', error);
      throw error;
    }
  }

  // Products
  async getProducts(limit = 50, page = 1): Promise<ShopifyProduct[]> {
    const response = await this.request<{ products: any[] }>(`/products.json?limit=${limit}&page=${page}`);
    return response.products.map(this.transformProduct);
  }

  async getProduct(productId: string): Promise<ShopifyProduct> {
    const response = await this.request<{ product: any }>(`/products/${productId}.json`);
    return this.transformProduct(response.product);
  }

  async createProduct(product: Partial<ShopifyProduct>): Promise<ShopifyProduct> {
    const shopifyProduct = this.prepareProductData(product);
    const response = await this.request<{ product: any }>('/products.json', {
      method: 'POST',
      body: JSON.stringify({ product: shopifyProduct }),
    });
    return this.transformProduct(response.product);
  }

  async updateProduct(productId: string, product: Partial<ShopifyProduct>): Promise<ShopifyProduct> {
    const shopifyProduct = this.prepareProductData(product);
    const response = await this.request<{ product: any }>(`/products/${productId}.json`, {
      method: 'PUT',
      body: JSON.stringify({ product: shopifyProduct }),
    });
    return this.transformProduct(response.product);
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.request(`/products/${productId}.json`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders(status = 'any', limit = 50, page = 1): Promise<ShopifyOrder[]> {
    const response = await this.request<{ orders: any[] }>(`/orders.json?status=${status}&limit=${limit}&page=${page}`);
    return response.orders.map(this.transformOrder);
  }

  async getOrder(orderId: string): Promise<ShopifyOrder> {
    const response = await this.request<{ order: any }>(`/orders/${orderId}.json`);
    return this.transformOrder(response.order);
  }

  // Webhooks
  async createWebhook(topic: string, address: string): Promise<any> {
    const webhook = {
      topic,
      address,
      format: 'json',
    };

    const response = await this.request<{ webhook: any }>('/webhooks.json', {
      method: 'POST',
      body: JSON.stringify({ webhook }),
    });

    return response.webhook;
  }

  async getWebhooks(): Promise<any[]> {
    const response = await this.request<{ webhooks: any[] }>('/webhooks.json');
    return response.webhooks;
  }

  // Inventory
  async updateInventory(inventoryItemId: string, locationId: string, quantity: number): Promise<any> {
    const inventoryLevel = {
      inventory_item_id: inventoryItemId,
      location_id: locationId,
      available: quantity,
    };

    return await this.request('/inventory_levels/set.json', {
      method: 'POST',
      body: JSON.stringify(inventoryLevel),
    });
  }

  // Helper methods
  private transformProduct(product: any): ShopifyProduct {
    return {
      id: product.id.toString(),
      title: product.title,
      description: product.body_html,
      vendor: product.vendor,
      productType: product.product_type,
      handle: product.handle,
      status: product.status,
      images: product.images?.map((img: any) => ({
        id: img.id.toString(),
        src: img.src,
        alt: img.alt,
        position: img.position,
      })) || [],
      variants: product.variants?.map((variant: any) => ({
        id: variant.id.toString(),
        title: variant.title,
        price: variant.price,
        sku: variant.sku,
        inventoryQuantity: variant.inventory_quantity,
        weight: variant.weight,
        requiresShipping: variant.requires_shipping,
      })) || [],
      options: product.options?.map((option: any) => ({
        id: option.id.toString(),
        name: option.name,
        position: option.position,
        values: option.values,
      })) || [],
      tags: typeof product.tags === 'string' ? product.tags.split(', ') : product.tags || [],
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };
  }

  private transformOrder(order: any): ShopifyOrder {
    return {
      id: order.id.toString(),
      name: order.name,
      email: order.email,
      createdAt: order.created_at,
      totalPrice: order.total_price,
      currency: order.currency,
      financialStatus: order.financial_status,
      fulfillmentStatus: order.fulfillment_status || 'unfulfilled',
      lineItems: order.line_items?.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        sku: item.sku,
        variantId: item.variant_id.toString(),
        productId: item.product_id.toString(),
      })) || [],
      shippingAddress: order.shipping_address ? {
        firstName: order.shipping_address.first_name,
        lastName: order.shipping_address.last_name,
        address1: order.shipping_address.address1,
        address2: order.shipping_address.address2,
        city: order.shipping_address.city,
        province: order.shipping_address.province,
        zip: order.shipping_address.zip,
        country: order.shipping_address.country,
        phone: order.shipping_address.phone,
      } : undefined,
    };
  }

  private prepareProductData(product: Partial<ShopifyProduct>): any {
    const shopifyProduct: any = { ...product };
    
    if (product.tags && Array.isArray(product.tags)) {
      shopifyProduct.tags = product.tags.join(', ');
    }
    
    if (product.images) {
      shopifyProduct.images = product.images.map(img => ({
        src: img.src,
        alt: img.alt,
        position: img.position,
      }));
    }
    
    if (product.variants) {
      shopifyProduct.variants = product.variants.map(variant => ({
        title: variant.title,
        price: variant.price,
        sku: variant.sku,
        inventory_quantity: variant.inventoryQuantity,
        weight: variant.weight,
        requires_shipping: variant.requiresShipping,
      }));
    }
    
    return shopifyProduct;
  }
}

// Database functions
export const getConnectedShopifyStores = async (userId: string): Promise<ShopifyStore[]> => {
  try {
    const { data, error } = await supabase
      .from('store_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', 'shopify')
      .eq('status', 'active');

    if (error) throw error;
    
    return data.map((store: any) => ({
      id: store.id,
      name: store.name,
      domain: store.store_url,
      accessToken: store.api_key,
      apiVersion: '2023-10',
      isActive: store.status === 'active',
      lastSynced: store.last_sync,
    }));
  } catch (error) {
    console.error('Failed to get Shopify stores:', error);
    throw error;
  }
};

export const connectShopifyStore = async (
  userId: string,
  storeName: string,
  domain: string,
  accessToken: string
): Promise<ShopifyStore> => {
  try {
    // Validate the connection by making a test API call
    const client = new ShopifyClient(domain, accessToken);
    await client.getProducts(1); // Test API call
    
    const { data, error } = await supabase
      .from('store_connections')
      .insert({
        user_id: userId,
        platform: 'shopify',
        name: storeName,
        store_url: domain,
        api_key: accessToken,
        status: 'active',
        connected_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      domain: data.store_url,
      accessToken: data.api_key,
      apiVersion: '2023-10',
      isActive: data.status === 'active',
      lastSynced: data.last_sync,
    };
  } catch (error) {
    console.error('Failed to connect Shopify store:', error);
    throw error;
  }
};

export const syncProductToShopify = async (
  productId: string,
  storeId: string,
  userId: string
): Promise<ShopifyProduct> => {
  try {
    // Get store connection
    const { data: connection, error: connectionError } = await supabase
      .from('store_connections')
      .select('*')
      .eq('id', storeId)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (connectionError) throw connectionError;
    
    // Get product from database
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('user_id', userId)
      .single();

    if (productError) throw productError;
    
    const client = new ShopifyClient(connection.store_url, connection.api_key);
    
    // Check if product already exists in Shopify
    let shopifyProduct: ShopifyProduct;
    
    if (product.shopify_product_id) {
      // Update existing product
      shopifyProduct = await client.updateProduct(product.shopify_product_id, {
        title: product.title,
        description: product.description,
        vendor: product.supplier,
        productType: product.category,
        tags: product.tags,
        images: product.images?.map((src: string, index: number) => ({
          id: '', // Will be ignored for updates
          src,
          position: index + 1,
        })),
        variants: [
          {
            id: '', // Will be ignored for new variants
            title: 'Default',
            price: product.price.toString(),
            sku: product.external_id || '',
            inventoryQuantity: product.stock || 10,
            weight: 0,
            requiresShipping: true,
          },
        ],
      });
    } else {
      // Create new product
      shopifyProduct = await client.createProduct({
        title: product.title,
        description: product.description,
        vendor: product.supplier,
        productType: product.category,
        tags: product.tags,
        images: product.images?.map((src: string, index: number) => ({
          id: '', // Will be ignored for new products
          src,
          position: index + 1,
        })),
        variants: [
          {
            id: '', // Will be ignored for new products
            title: 'Default',
            price: product.price.toString(),
            sku: product.external_id || '',
            inventoryQuantity: product.stock || 10,
            weight: 0,
            requiresShipping: true,
          },
        ],
        status: 'active',
      } as Partial<ShopifyProduct>);
      
      // Update product with Shopify ID
      await supabase
        .from('products')
        .update({
          shopify_product_id: shopifyProduct.id,
          synced_at: new Date().toISOString(),
        })
        .eq('id', productId);
    }
    
    // Update sync history
    await supabase
      .from('sync_history')
      .insert({
        user_id: userId,
        type: 'product',
        status: 'success',
        platforms: { shopify: connection.store_url },
        items_processed: 1,
        items_succeeded: 1,
        items_failed: 0,
        duration: 0, // Calculate actual duration in production
        initiated_by: 'user',
        details: { product_id: productId, shopify_id: shopifyProduct.id },
      });
    
    // Update store last sync time
    await supabase
      .from('store_connections')
      .update({
        last_sync: new Date().toISOString(),
      })
      .eq('id', storeId);
    
    return shopifyProduct;
  } catch (error) {
    console.error('Failed to sync product to Shopify:', error);
    
    // Log sync failure
    await supabase
      .from('sync_history')
      .insert({
        user_id: userId,
        type: 'product',
        status: 'failed',
        platforms: { shopify: 'unknown' },
        items_processed: 1,
        items_succeeded: 0,
        items_failed: 1,
        duration: 0,
        initiated_by: 'user',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: { product_id: productId },
      });
    
    throw error;
  }
};

export const importShopifyProducts = async (
  storeId: string,
  userId: string,
  limit = 50
): Promise<number> => {
  try {
    // Get store connection
    const { data: connection, error: connectionError } = await supabase
      .from('store_connections')
      .select('*')
      .eq('id', storeId)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (connectionError) throw connectionError;
    
    const client = new ShopifyClient(connection.store_url, connection.api_key);
    
    // Get products from Shopify
    const shopifyProducts = await client.getProducts(limit);
    
    // Import products to database
    let successCount = 0;
    
    for (const product of shopifyProducts) {
      try {
        // Check if product already exists
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id')
          .eq('shopify_product_id', product.id)
          .eq('user_id', userId)
          .single();
        
        if (existingProduct) {
          // Update existing product
          await supabase
            .from('products')
            .update({
              title: product.title,
              description: product.description,
              price: parseFloat(product.variants[0]?.price || '0'),
              supplier: product.vendor,
              category: product.productType,
              tags: product.tags,
              images: product.images.map(img => img.src),
              status: product.status === 'active' ? 'published' : 'draft',
              external_id: product.variants[0]?.sku || '',
              stock: product.variants[0]?.inventoryQuantity || 0,
              synced_at: new Date().toISOString(),
            })
            .eq('id', existingProduct.id);
        } else {
          // Create new product
          await supabase
            .from('products')
            .insert({
              user_id: userId,
              title: product.title,
              description: product.description,
              price: parseFloat(product.variants[0]?.price || '0'),
              supplier: product.vendor,
              category: product.productType,
              tags: product.tags,
              images: product.images.map(img => img.src),
              status: product.status === 'active' ? 'published' : 'draft',
              shopify_product_id: product.id,
              external_id: product.variants[0]?.sku || '',
              stock: product.variants[0]?.inventoryQuantity || 0,
              source: 'shopify',
              synced_at: new Date().toISOString(),
            });
        }
        
        successCount++;
      } catch (error) {
        console.error(`Failed to import Shopify product ${product.id}:`, error);
      }
    }
    
    // Update sync history
    await supabase
      .from('sync_history')
      .insert({
        user_id: userId,
        type: 'import',
        status: 'success',
        platforms: { shopify: connection.store_url },
        items_processed: shopifyProducts.length,
        items_succeeded: successCount,
        items_failed: shopifyProducts.length - successCount,
        duration: 0, // Calculate actual duration in production
        initiated_by: 'user',
      });
    
    // Update store last sync time
    await supabase
      .from('store_connections')
      .update({
        last_sync: new Date().toISOString(),
      })
      .eq('id', storeId);
    
    return successCount;
  } catch (error) {
    console.error('Failed to import Shopify products:', error);
    
    // Log sync failure
    await supabase
      .from('sync_history')
      .insert({
        user_id: userId,
        type: 'import',
        status: 'failed',
        platforms: { shopify: 'unknown' },
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

export const syncOrdersFromShopify = async (
  storeId: string,
  userId: string,
  limit = 50
): Promise<number> => {
  try {
    // Get store connection
    const { data: connection, error: connectionError } = await supabase
      .from('store_connections')
      .select('*')
      .eq('id', storeId)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (connectionError) throw connectionError;
    
    const client = new ShopifyClient(connection.store_url, connection.api_key);
    
    // Get orders from Shopify
    const shopifyOrders = await client.getOrders('any', limit);
    
    // Import orders to database
    let successCount = 0;
    
    for (const order of shopifyOrders) {
      try {
        // Check if order already exists
        const { data: existingOrder } = await supabase
          .from('orders')
          .select('id')
          .eq('external_id', order.id)
          .eq('user_id', userId)
          .single();
        
        const orderData = {
          user_id: userId,
          external_id: order.id,
          order_number: order.name,
          customer_name: `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim(),
          customer_email: order.email,
          total_amount: parseFloat(order.totalPrice),
          currency: order.currency,
          status: mapShopifyOrderStatus(order.fulfillmentStatus, order.financialStatus),
          platform: 'shopify',
          store_id: storeId,
          shipping_address: order.shippingAddress,
          line_items: order.lineItems,
          created_at: order.createdAt,
          synced_at: new Date().toISOString(),
        };
        
        if (existingOrder) {
          // Update existing order
          await supabase
            .from('orders')
            .update(orderData)
            .eq('id', existingOrder.id);
        } else {
          // Create new order
          await supabase
            .from('orders')
            .insert(orderData);
        }
        
        successCount++;
      } catch (error) {
        console.error(`Failed to import Shopify order ${order.id}:`, error);
      }
    }
    
    // Update sync history
    await supabase
      .from('sync_history')
      .insert({
        user_id: userId,
        type: 'orders',
        status: 'success',
        platforms: { shopify: connection.store_url },
        items_processed: shopifyOrders.length,
        items_succeeded: successCount,
        items_failed: shopifyOrders.length - successCount,
        duration: 0, // Calculate actual duration in production
        initiated_by: 'user',
      });
    
    // Update store last sync time
    await supabase
      .from('store_connections')
      .update({
        last_sync: new Date().toISOString(),
      })
      .eq('id', storeId);
    
    return successCount;
  } catch (error) {
    console.error('Failed to sync orders from Shopify:', error);
    
    // Log sync failure
    await supabase
      .from('sync_history')
      .insert({
        user_id: userId,
        type: 'orders',
        status: 'failed',
        platforms: { shopify: 'unknown' },
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

// Helper function to map Shopify order status to our internal status
const mapShopifyOrderStatus = (
  fulfillmentStatus: string | null | undefined,
  financialStatus: string | null | undefined
): string => {
  if (fulfillmentStatus === 'fulfilled') return 'delivered';
  if (fulfillmentStatus === 'partial') return 'partially_shipped';
  if (fulfillmentStatus === 'shipment_delivered') return 'delivered';
  if (fulfillmentStatus === 'shipment_ready') return 'ready_to_ship';
  if (fulfillmentStatus === 'in_transit') return 'in_transit';
  if (fulfillmentStatus === 'out_for_delivery') return 'out_for_delivery';
  
  if (financialStatus === 'paid' && !fulfillmentStatus) return 'processing';
  if (financialStatus === 'pending') return 'pending';
  if (financialStatus === 'refunded') return 'refunded';
  if (financialStatus === 'partially_refunded') return 'partially_refunded';
  
  return 'pending';
};
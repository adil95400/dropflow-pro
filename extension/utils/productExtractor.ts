// Product extractor utility for DropFlow Pro extension

export interface ProductInfo {
  source: string;
  url: string;
  productId: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  timestamp: string;
}

// Extract product information from URL
export async function extractProductInfo(url: string): Promise<ProductInfo | null> {
  try {
    // Determine source from URL
    let source = '';
    if (url.includes('aliexpress.com')) {
      source = 'aliexpress';
    } else if (url.includes('bigbuy.eu')) {
      source = 'bigbuy';
    } else if (url.includes('amazon.com') || url.includes('amazon.fr')) {
      source = 'amazon';
    } else if (url.includes('cdiscount.com')) {
      source = 'cdiscount';
    } else {
      return null; // Unsupported source
    }
    
    // Extract product ID from URL
    const productId = extractProductId(url, source);
    if (!productId) {
      return null;
    }
    
    // In a real extension, we would fetch product details from the API
    // For this example, we'll return a mock product
    return {
      source,
      url,
      productId,
      title: `Example Product from ${source}`,
      price: 29.99,
      description: 'This is an example product description.',
      images: ['https://example.com/image.jpg'],
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error extracting product info:', error);
    return null;
  }
}

// Extract product ID from URL based on source
function extractProductId(url: string, source: string): string | null {
  try {
    switch (source) {
      case 'aliexpress':
        return url.match(/\/item\/(\d+)\.html/)?.[1] || null;
        
      case 'bigbuy':
        return url.match(/\/product\/([^\/]+)/)?.[1] || null;
        
      case 'amazon':
        return url.match(/\/dp\/([A-Z0-9]{10})/)?.[1] || null;
        
      case 'cdiscount':
        return url.match(/\/f-(\d+)-/)?.[1] || null;
        
      default:
        return null;
    }
  } catch (error) {
    console.error('Error extracting product ID:', error);
    return null;
  }
}

// Validate product information
export function validateProductInfo(product: ProductInfo): boolean {
  return (
    !!product.source &&
    !!product.url &&
    !!product.productId &&
    !!product.title &&
    typeof product.price === 'number' &&
    product.price > 0 &&
    Array.isArray(product.images) &&
    product.images.length > 0
  );
}

// Format price based on locale
export function formatPrice(price: number, currency: string = 'EUR', locale: string = 'fr-FR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(price);
}

// Get source name for display
export function getSourceDisplayName(source: string): string {
  switch (source) {
    case 'aliexpress':
      return 'AliExpress';
    case 'bigbuy':
      return 'BigBuy';
    case 'amazon':
      return 'Amazon';
    case 'cdiscount':
      return 'Cdiscount';
    default:
      return source.charAt(0).toUpperCase() + source.slice(1);
  }
}

// Get source icon
export function getSourceIcon(source: string): string {
  switch (source) {
    case 'aliexpress':
      return '🛒';
    case 'bigbuy':
      return '📦';
    case 'amazon':
      return '📚';
    case 'cdiscount':
      return '🏷️';
    default:
      return '🔍';
  }
}
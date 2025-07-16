// API utilities for DropFlow Pro extension
import { ProductInfo } from './productExtractor';

// Base API URL
const API_BASE_URL = 'https://api.dropflow.pro';

// Auth status interface
export interface AuthStatus {
  isAuthenticated: boolean;
  user: any | null;
}

// Save product to DropFlow
export async function saveToDropFlow(product: ProductInfo): Promise<{ success: boolean; error?: string; productId?: string }> {
  try {
    // Get auth token
    const { token } = await chrome.storage.local.get('token');
    
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }
    
    // In a real extension, we would make an API call
    // For this example, we'll simulate a successful response
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful response
    return {
      success: true,
      productId: `prod_${Date.now()}`
    };
    
    // Real implementation would be:
    /*
    const response = await fetch(`${API_BASE_URL}/api/import/extension`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.message || 'Failed to import product' };
    }
    
    return {
      success: true,
      productId: data.productId
    };
    */
  } catch (error) {
    console.error('Error saving to DropFlow:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Check authentication status
export async function checkAuthStatus(): Promise<AuthStatus> {
  try {
    // Get stored token and user
    const { token, user } = await chrome.storage.local.get(['token', 'user']);
    
    if (!token) {
      return { isAuthenticated: false, user: null };
    }
    
    // In a real extension, we would validate the token with the API
    // For this example, we'll assume it's valid if it exists
    
    return {
      isAuthenticated: true,
      user: user || null
    };
    
    // Real implementation would be:
    /*
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      // Token is invalid, clear it
      await chrome.storage.local.remove(['token', 'user']);
      return { isAuthenticated: false, user: null };
    }
    
    const userData = await response.json();
    
    // Update stored user data
    await chrome.storage.local.set({ user: userData });
    
    return {
      isAuthenticated: true,
      user: userData
    };
    */
  } catch (error) {
    console.error('Error checking auth status:', error);
    return { isAuthenticated: false, user: null };
  }
}

// Get recent imports
export async function getRecentImports(): Promise<ProductInfo[]> {
  try {
    // Get auth token
    const { token } = await chrome.storage.local.get('token');
    
    if (!token) {
      return [];
    }
    
    // In a real extension, we would make an API call
    // For this example, we'll return mock data
    
    return [
      {
        source: 'aliexpress',
        url: 'https://aliexpress.com/item/1234567890.html',
        productId: '1234567890',
        title: 'Montre Connectée Sport Pro Max',
        price: 45.99,
        description: 'Montre connectée étanche avec GPS, moniteur cardiaque et 50+ modes sport.',
        images: ['https://example.com/image1.jpg'],
        timestamp: new Date().toISOString()
      },
      {
        source: 'amazon',
        url: 'https://amazon.com/dp/B08N5KWB9H',
        productId: 'B08N5KWB9H',
        title: 'Écouteurs Bluetooth Premium ANC',
        price: 79.99,
        description: 'Écouteurs sans fil avec réduction de bruit active et son Hi-Fi.',
        images: ['https://example.com/image2.jpg'],
        timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      }
    ];
    
    // Real implementation would be:
    /*
    const response = await fetch(`${API_BASE_URL}/api/import/recent`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      return [];
    }
    
    return await response.json();
    */
  } catch (error) {
    console.error('Error getting recent imports:', error);
    return [];
  }
}

// Get user statistics
export async function getUserStats(): Promise<any> {
  try {
    // Get auth token
    const { token } = await chrome.storage.local.get('token');
    
    if (!token) {
      return null;
    }
    
    // In a real extension, we would make an API call
    // For this example, we'll return mock data
    
    return {
      products: 1234,
      imports: 567,
      orders: 89
    };
    
    // Real implementation would be:
    /*
    const response = await fetch(`${API_BASE_URL}/api/user/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
    */
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
}
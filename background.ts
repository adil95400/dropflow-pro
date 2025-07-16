// DropFlow Pro Extension - Background Script
import { extractProductInfo, ProductInfo } from './utils/productExtractor';
import { saveToDropFlow, checkAuthStatus, AuthStatus } from './utils/api';

// Initialize extension state
let authStatus: AuthStatus = { isAuthenticated: false, user: null };
let currentTab: chrome.tabs.Tab | null = null;

// Check authentication status on startup
chrome.runtime.onStartup.addListener(async () => {
  authStatus = await checkAuthStatus();
  updateBadge();
});

// Listen for installation
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // Open onboarding page
    chrome.tabs.create({ url: 'https://app.dropflow.pro/extension-welcome' });
  }
  
  authStatus = await checkAuthStatus();
  updateBadge();
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'EXTRACT_PRODUCT') {
    handleProductExtraction(sendResponse);
    return true; // Keep the message channel open for async response
  }
  
  if (message.type === 'IMPORT_PRODUCT') {
    handleProductImport(message.data, sendResponse);
    return true; // Keep the message channel open for async response
  }
  
  if (message.type === 'CHECK_AUTH') {
    checkAuthStatus().then(status => {
      authStatus = status;
      updateBadge();
      sendResponse(status);
    });
    return true; // Keep the message channel open for async response
  }
  
  if (message.type === 'LOGIN') {
    handleLogin(message.data, sendResponse);
    return true; // Keep the message channel open for async response
  }
  
  if (message.type === 'LOGOUT') {
    handleLogout(sendResponse);
    return true; // Keep the message channel open for async response
  }
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && isProductPage(tab.url)) {
    currentTab = tab;
    chrome.tabs.sendMessage(tabId, { type: 'PAGE_LOADED' });
  }
});

// Listen for tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  currentTab = tab;
  
  if (isProductPage(tab.url)) {
    chrome.action.setIcon({ path: 'icons/icon48.png' });
    chrome.action.setBadgeText({ text: '✓' });
    chrome.action.setBadgeBackgroundColor({ color: '#10B981' });
  } else {
    chrome.action.setIcon({ path: 'icons/icon48_gray.png' });
    chrome.action.setBadgeText({ text: '' });
  }
});

// Listen for commands (keyboard shortcuts)
chrome.commands.onCommand.addListener((command) => {
  if (command === 'import-product') {
    handleProductExtraction((product) => {
      if (product) {
        handleProductImport(product, () => {});
      }
    });
  }
  
  if (command === 'open-dashboard') {
    chrome.tabs.create({ url: 'https://app.dropflow.pro/dashboard' });
  }
});

// Helper functions
async function handleProductExtraction(sendResponse: (product: ProductInfo | null) => void) {
  if (!currentTab || !isProductPage(currentTab.url)) {
    sendResponse(null);
    return;
  }
  
  try {
    // Execute content script to extract product info
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: currentTab.id! },
      func: () => {
        // This function runs in the context of the page
        return window.__DROPFLOW_PRODUCT_INFO__ || null;
      }
    });
    
    if (result) {
      sendResponse(result as ProductInfo);
    } else {
      // If product info not available, inject extraction script
      chrome.tabs.sendMessage(currentTab.id!, { type: 'EXTRACT_PRODUCT' }, (response) => {
        sendResponse(response);
      });
    }
  } catch (error) {
    console.error('Error extracting product:', error);
    sendResponse(null);
  }
}

async function handleProductImport(product: ProductInfo, sendResponse: (result: any) => void) {
  if (!authStatus.isAuthenticated) {
    sendResponse({ success: false, error: 'Not authenticated' });
    return;
  }
  
  try {
    const result = await saveToDropFlow(product);
    
    // Show notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: result.success ? 'Produit importé avec succès' : 'Erreur d\'import',
      message: result.success 
        ? `"${product.title}" a été importé dans votre compte DropFlow Pro.` 
        : `Erreur lors de l'import: ${result.error}`
    });
    
    sendResponse(result);
  } catch (error) {
    console.error('Error importing product:', error);
    sendResponse({ success: false, error: String(error) });
  }
}

async function handleLogin(credentials: { email: string, password: string }, sendResponse: (result: any) => void) {
  try {
    const response = await fetch('https://api.dropflow.pro/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Save auth token
      chrome.storage.local.set({ 
        token: data.token,
        user: data.user
      });
      
      authStatus = { 
        isAuthenticated: true, 
        user: data.user 
      };
      
      updateBadge();
      sendResponse({ success: true, user: data.user });
    } else {
      sendResponse({ success: false, error: data.message });
    }
  } catch (error) {
    console.error('Login error:', error);
    sendResponse({ success: false, error: String(error) });
  }
}

async function handleLogout(sendResponse: (result: any) => void) {
  try {
    // Clear stored auth data
    await chrome.storage.local.remove(['token', 'user']);
    
    authStatus = { isAuthenticated: false, user: null };
    updateBadge();
    
    sendResponse({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    sendResponse({ success: false, error: String(error) });
  }
}

function updateBadge() {
  if (authStatus.isAuthenticated) {
    chrome.action.setBadgeText({ text: '✓' });
    chrome.action.setBadgeBackgroundColor({ color: '#10B981' });
  } else {
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#F59E0B' });
  }
}

function isProductPage(url?: string): boolean {
  if (!url) return false;
  
  return (
    url.includes('aliexpress.com/item/') ||
    url.includes('bigbuy.eu/') && url.includes('/product/') ||
    (url.includes('amazon.com/') || url.includes('amazon.fr/')) && url.includes('/dp/') ||
    url.includes('cdiscount.com/') && url.includes('/f-')
  );
}

// Keep service worker alive
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();
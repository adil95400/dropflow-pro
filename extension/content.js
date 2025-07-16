// DropFlow Pro Extension - Content Script
(function() {
  // Store extracted product info
  let productInfo = null;
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'PAGE_LOADED') {
      extractProductInfo();
    }
    
    if (message.type === 'EXTRACT_PRODUCT') {
      extractProductInfo();
      sendResponse(productInfo);
    }
    
    return true;
  });
  
  // Extract product information based on the current website
  function extractProductInfo() {
    const url = window.location.href;
    
    if (url.includes('aliexpress.com/item/')) {
      productInfo = extractAliExpressProduct();
    } else if (url.includes('bigbuy.eu') && url.includes('/product/')) {
      productInfo = extractBigBuyProduct();
    } else if ((url.includes('amazon.com/') || url.includes('amazon.fr/')) && url.includes('/dp/')) {
      productInfo = extractAmazonProduct();
    } else if (url.includes('cdiscount.com/') && url.includes('/f-')) {
      productInfo = extractCdiscountProduct();
    } else {
      productInfo = null;
    }
    
    // Store product info in window object for easy access
    window.__DROPFLOW_PRODUCT_INFO__ = productInfo;
    
    // Add import button if product was extracted
    if (productInfo) {
      addImportButton();
    }
    
    return productInfo;
  }
  
  // Extract product from AliExpress
  function extractAliExpressProduct() {
    try {
      // Get product ID from URL
      const productId = window.location.pathname.match(/\/item\/(\d+)\.html/)?.[1];
      if (!productId) return null;
      
      // Get product title
      const titleElement = document.querySelector('.product-title-text') || 
                          document.querySelector('.title-content');
      const title = titleElement ? titleElement.textContent.trim() : '';
      
      // Get product price
      const priceElement = document.querySelector('.product-price-value') || 
                          document.querySelector('.uniform-banner-box-price');
      let price = priceElement ? priceElement.textContent.trim() : '';
      price = price.replace(/[^\d.,]/g, '').replace(',', '.');
      
      // Get product description
      const descriptionElement = document.querySelector('.product-description') ||
                                document.querySelector('.detail-desc-decorate-richtext');
      const description = descriptionElement ? descriptionElement.textContent.trim() : '';
      
      // Get product images
      const images = [];
      const imageElements = document.querySelectorAll('.images-view-item img');
      imageElements.forEach(img => {
        const src = img.src;
        if (src && !src.includes('data:image')) {
          // Convert thumbnail URL to full size
          const fullSizeUrl = src.replace(/_\d+x\d+.*\.jpg/, '.jpg');
          images.push(fullSizeUrl);
        }
      });
      
      // If no images found, try alternative selectors
      if (images.length === 0) {
        const mainImage = document.querySelector('.magnifier-image');
        if (mainImage && mainImage.src) {
          images.push(mainImage.src);
        }
      }
      
      return {
        source: 'aliexpress',
        url: window.location.href,
        productId,
        title,
        price: parseFloat(price) || 0,
        description,
        images,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error extracting AliExpress product:', error);
      return null;
    }
  }
  
  // Extract product from BigBuy
  function extractBigBuyProduct() {
    try {
      // Get product ID from URL or page
      const productId = document.querySelector('[data-product-id]')?.getAttribute('data-product-id');
      if (!productId) return null;
      
      // Get product title
      const titleElement = document.querySelector('.product-name h1');
      const title = titleElement ? titleElement.textContent.trim() : '';
      
      // Get product price
      const priceElement = document.querySelector('.product-price .price');
      let price = priceElement ? priceElement.textContent.trim() : '';
      price = price.replace(/[^\d.,]/g, '').replace(',', '.');
      
      // Get product description
      const descriptionElement = document.querySelector('.product-description');
      const description = descriptionElement ? descriptionElement.textContent.trim() : '';
      
      // Get product images
      const images = [];
      const imageElements = document.querySelectorAll('.product-image-gallery img');
      imageElements.forEach(img => {
        const src = img.getAttribute('data-zoom-image') || img.src;
        if (src) {
          images.push(src);
        }
      });
      
      return {
        source: 'bigbuy',
        url: window.location.href,
        productId,
        title,
        price: parseFloat(price) || 0,
        description,
        images,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error extracting BigBuy product:', error);
      return null;
    }
  }
  
  // Extract product from Amazon
  function extractAmazonProduct() {
    try {
      // Get product ID from URL
      const productId = window.location.pathname.match(/\/dp\/([A-Z0-9]{10})/)?.[1];
      if (!productId) return null;
      
      // Get product title
      const titleElement = document.querySelector('#productTitle');
      const title = titleElement ? titleElement.textContent.trim() : '';
      
      // Get product price
      const priceElement = document.querySelector('.a-price .a-offscreen') || 
                          document.querySelector('#priceblock_ourprice') ||
                          document.querySelector('#priceblock_dealprice');
      let price = priceElement ? priceElement.textContent.trim() : '';
      price = price.replace(/[^\d.,]/g, '').replace(',', '.');
      
      // Get product description
      const descriptionElement = document.querySelector('#productDescription p') ||
                                document.querySelector('#feature-bullets');
      const description = descriptionElement ? descriptionElement.textContent.trim() : '';
      
      // Get product images
      const images = [];
      // Try to get the main image
      const mainImage = document.querySelector('#landingImage') || 
                       document.querySelector('#imgBlkFront');
      if (mainImage) {
        const src = mainImage.getAttribute('data-old-hires') || 
                   mainImage.getAttribute('src');
        if (src) {
          images.push(src);
        }
      }
      
      // Try to get alternative images
      const altImageElements = document.querySelectorAll('.imageThumbnail img');
      altImageElements.forEach(img => {
        const src = img.src;
        if (src) {
          // Convert thumbnail URL to full size
          const fullSizeUrl = src.replace(/\._.*_\./, '.');
          images.push(fullSizeUrl);
        }
      });
      
      return {
        source: 'amazon',
        url: window.location.href,
        productId,
        title,
        price: parseFloat(price) || 0,
        description,
        images,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error extracting Amazon product:', error);
      return null;
    }
  }
  
  // Extract product from Cdiscount
  function extractCdiscountProduct() {
    try {
      // Get product ID from URL or page
      const productId = document.querySelector('[data-sku]')?.getAttribute('data-sku');
      if (!productId) return null;
      
      // Get product title
      const titleElement = document.querySelector('h1[data-dtpc="title"]');
      const title = titleElement ? titleElement.textContent.trim() : '';
      
      // Get product price
      const priceElement = document.querySelector('.fpPrice');
      let price = priceElement ? priceElement.textContent.trim() : '';
      price = price.replace(/[^\d.,]/g, '').replace(',', '.');
      
      // Get product description
      const descriptionElement = document.querySelector('#fpContent');
      const description = descriptionElement ? descriptionElement.textContent.trim() : '';
      
      // Get product images
      const images = [];
      const mainImage = document.querySelector('.prdtBILMainImg img');
      if (mainImage && mainImage.src) {
        images.push(mainImage.src);
      }
      
      const imageElements = document.querySelectorAll('.jsPrdtBILA img');
      imageElements.forEach(img => {
        const src = img.getAttribute('data-src') || img.src;
        if (src) {
          images.push(src);
        }
      });
      
      return {
        source: 'cdiscount',
        url: window.location.href,
        productId,
        title,
        price: parseFloat(price) || 0,
        description,
        images,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error extracting Cdiscount product:', error);
      return null;
    }
  }
  
  // Add import button to the page
  function addImportButton() {
    // Remove existing button if any
    const existingButton = document.getElementById('dropflow-import-button');
    if (existingButton) {
      existingButton.remove();
    }
    
    // Create button
    const button = document.createElement('button');
    button.id = 'dropflow-import-button';
    button.innerHTML = `
      <img src="${chrome.runtime.getURL('icons/icon16.png')}" alt="DropFlow Pro" />
      <span>Importer dans DropFlow</span>
    `;
    
    // Style the button
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.padding = '10px 16px';
    button.style.backgroundColor = '#F97316';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.fontFamily = 'Arial, sans-serif';
    button.style.fontSize = '14px';
    button.style.fontWeight = 'bold';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    button.style.transition = 'all 0.2s ease';
    
    // Button hover effect
    button.onmouseover = function() {
      this.style.backgroundColor = '#EA580C';
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
    };
    
    button.onmouseout = function() {
      this.style.backgroundColor = '#F97316';
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    };
    
    // Style the icon
    const img = button.querySelector('img');
    img.style.marginRight = '8px';
    img.style.width = '16px';
    img.style.height = '16px';
    
    // Add click event
    button.addEventListener('click', () => {
      chrome.runtime.sendMessage(
        { type: 'IMPORT_PRODUCT', data: productInfo },
        (response) => {
          if (response.success) {
            // Show success message
            showNotification('Produit importé avec succès !', 'success');
          } else {
            // Show error message
            showNotification(response.error || 'Erreur lors de l\'import', 'error');
          }
        }
      );
    });
    
    // Add button to page
    document.body.appendChild(button);
  }
  
  // Show notification
  function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.getElementById('dropflow-notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.id = 'dropflow-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <img src="${chrome.runtime.getURL('icons/icon16.png')}" alt="DropFlow Pro" />
        <span>${message}</span>
      </div>
      <button class="notification-close">×</button>
    `;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '10000';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.justifyContent = 'space-between';
    notification.style.padding = '12px 16px';
    notification.style.backgroundColor = type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6';
    notification.style.color = 'white';
    notification.style.borderRadius = '8px';
    notification.style.fontFamily = 'Arial, sans-serif';
    notification.style.fontSize = '14px';
    notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    notification.style.minWidth = '300px';
    notification.style.maxWidth = '400px';
    notification.style.animation = 'dropflowSlideIn 0.3s ease-out forwards';
    
    // Style the content
    const content = notification.querySelector('.notification-content');
    content.style.display = 'flex';
    content.style.alignItems = 'center';
    content.style.gap = '12px';
    
    // Style the icon
    const img = notification.querySelector('img');
    img.style.width = '20px';
    img.style.height = '20px';
    
    // Style the close button
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginLeft = '8px';
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes dropflowSlideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes dropflowSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    // Add close event
    closeButton.addEventListener('click', () => {
      notification.style.animation = 'dropflowSlideOut 0.3s ease-in forwards';
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.animation = 'dropflowSlideOut 0.3s ease-in forwards';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            notification.remove();
          }
        }, 300);
      }
    }, 5000);
    
    // Add to page
    document.body.appendChild(notification);
  }
  
  // Run extraction on page load
  if (document.readyState === 'complete') {
    extractProductInfo();
  } else {
    window.addEventListener('load', extractProductInfo);
  }
})();
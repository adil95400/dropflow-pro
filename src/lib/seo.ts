export interface SEOData {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  canonical?: string
  jsonLd?: object
}

export const defaultSEO: SEOData = {
  title: 'DropFlow Pro - Automate Your Dropshipping Business',
  description: 'The most powerful dropshipping platform to import, optimize, and scale your e-commerce business with AI-powered tools. Trusted by 10,000+ stores worldwide.',
  keywords: [
    'dropshipping',
    'e-commerce automation',
    'product import',
    'shopify sync',
    'aliexpress import',
    'seo optimization',
    'ai tools',
    'order tracking'
  ],
  ogImage: '/og-banner.png'
}

export const generateJsonLd = (data: Partial<SEOData> = {}) => {
  const seoData = { ...defaultSEO, ...data }
  
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'DropFlow Pro',
    description: seoData.description,
    url: 'https://dropflow.pro',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '29',
      priceCurrency: 'USD',
      priceValidUntil: '2024-12-31'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1247'
    },
    creator: {
      '@type': 'Organization',
      name: 'DropFlow Pro',
      url: 'https://dropflow.pro'
    }
  }
}

export const updateSEO = (data: Partial<SEOData>) => {
  const seoData = { ...defaultSEO, ...data }
  
  // Update title
  document.title = seoData.title
  
  // Update meta tags
  updateMetaTag('description', seoData.description)
  updateMetaTag('keywords', seoData.keywords.join(', '))
  
  // Update Open Graph tags
  updateMetaTag('og:title', seoData.title, 'property')
  updateMetaTag('og:description', seoData.description, 'property')
  updateMetaTag('og:image', seoData.ogImage || '/og-banner.png', 'property')
  updateMetaTag('og:type', 'website', 'property')
  
  // Update Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image')
  updateMetaTag('twitter:title', seoData.title)
  updateMetaTag('twitter:description', seoData.description)
  updateMetaTag('twitter:image', seoData.ogImage || '/og-banner.png')
  
  // Update canonical URL
  if (seoData.canonical) {
    updateLinkTag('canonical', seoData.canonical)
  }
  
  // Update JSON-LD
  if (seoData.jsonLd) {
    updateJsonLd(seoData.jsonLd)
  }
}

const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

const updateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

const updateJsonLd = (data: object) => {
  let script = document.querySelector('script[type="application/ld+json"]')
  if (!script) {
    script = document.createElement('script')
    script.setAttribute('type', 'application/ld+json')
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}
// Mock data for DropFlow Pro application

export const mockProducts = [
  {
    id: '1',
    title: 'Montre Connectée Sport Pro Max',
    originalTitle: 'Smart Watch Sport Pro Max',
    description: 'Montre connectée étanche avec GPS, moniteur cardiaque et 50+ modes sport. Autonomie 7 jours.',
    price: 89.99,
    originalPrice: 45.20,
    supplier: 'AliExpress',
    category: 'Électronique',
    images: [
      'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    status: 'published',
    seoScore: 92,
    translations: ['FR', 'EN', 'ES', 'DE'],
    tags: ['montre', 'sport', 'connectée', 'fitness', 'gps'],
    margin: 98.5,
    orders: 1247,
    revenue: 112023.53,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Écouteurs Bluetooth Premium ANC',
    originalTitle: 'Bluetooth Earbuds Premium ANC',
    description: 'Écouteurs sans fil avec réduction de bruit active, son Hi-Fi et boîtier de charge rapide.',
    price: 79.99,
    originalPrice: 32.50,
    supplier: 'BigBuy',
    category: 'Audio',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    status: 'published',
    seoScore: 88,
    translations: ['FR', 'EN'],
    tags: ['écouteurs', 'bluetooth', 'anc', 'audio', 'sans-fil'],
    margin: 146.1,
    orders: 892,
    revenue: 71351.08,
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    title: 'Coque iPhone 15 Pro Transparente Antichoc',
    originalTitle: 'iPhone 15 Pro Clear Shockproof Case',
    description: 'Protection premium transparente avec coins renforcés et certification drop-test 3m.',
    price: 24.99,
    originalPrice: 8.75,
    supplier: 'Eprolo',
    category: 'Accessoires',
    images: [
      'https://images.pexels.com/photos/4526413/pexels-photo-4526413.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    status: 'draft',
    seoScore: 76,
    translations: ['FR', 'EN', 'ES'],
    tags: ['coque', 'iphone', 'protection', 'transparente', 'antichoc'],
    margin: 185.6,
    orders: 2156,
    revenue: 53874.44,
    createdAt: '2024-01-25'
  },
  {
    id: '4',
    title: 'Chargeur Sans Fil Rapide 15W Qi',
    originalTitle: 'Fast Wireless Charger 15W Qi',
    description: 'Station de charge sans fil compatible tous smartphones Qi avec indicateur LED et protection surchauffe.',
    price: 34.99,
    originalPrice: 12.30,
    supplier: 'Printify',
    category: 'Électronique',
    images: [
      'https://images.pexels.com/photos/4526413/pexels-photo-4526413.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    status: 'published',
    seoScore: 84,
    translations: ['FR', 'EN', 'DE'],
    tags: ['chargeur', 'sans-fil', 'qi', 'rapide', '15w'],
    margin: 184.5,
    orders: 743,
    revenue: 25992.57,
    createdAt: '2024-02-01'
  },
  {
    id: '5',
    title: 'Lampe LED Bureau Pliable USB-C',
    originalTitle: 'Foldable LED Desk Lamp USB-C',
    description: 'Lampe de bureau moderne avec 3 modes d\'éclairage, variateur tactile et port USB-C.',
    price: 49.99,
    originalPrice: 18.90,
    supplier: 'Spocket',
    category: 'Maison',
    images: [
      'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    status: 'published',
    seoScore: 91,
    translations: ['FR', 'EN', 'ES', 'IT'],
    tags: ['lampe', 'led', 'bureau', 'pliable', 'usb-c'],
    margin: 164.5,
    orders: 456,
    revenue: 22795.44,
    createdAt: '2024-02-05'
  }
]

export const mockSuppliers = [
  {
    id: '1',
    name: 'AliExpress Global',
    country: 'Chine',
    logo: '🛒',
    verified: true,
    rating: 4.8,
    productsCount: 125000,
    categories: ['Électronique', 'Mode', 'Maison', 'Sport'],
    processingTime: '1-3 jours',
    shippingTime: '7-15 jours',
    minimumOrder: 1,
    performance: {
      responseRate: 98,
      responseTime: '2h',
      qualityRating: 4.7,
      onTimeDelivery: 94
    },
    description: 'Plus grand marketplace B2B mondial avec millions de produits vérifiés'
  },
  {
    id: '2',
    name: 'BigBuy Europe',
    country: 'Espagne',
    logo: '📦',
    verified: true,
    rating: 4.9,
    productsCount: 45000,
    categories: ['Électronique', 'Beauté', 'Sport', 'Auto'],
    processingTime: '24h',
    shippingTime: '2-5 jours',
    minimumOrder: 1,
    performance: {
      responseRate: 99,
      responseTime: '1h',
      qualityRating: 4.9,
      onTimeDelivery: 98
    },
    description: 'Fournisseur européen premium avec stock local et livraison express'
  },
  {
    id: '3',
    name: 'Eprolo Fulfillment',
    country: 'États-Unis',
    logo: '🚀',
    verified: true,
    rating: 4.6,
    productsCount: 78000,
    categories: ['Mode', 'Beauté', 'Maison', 'Enfants'],
    processingTime: '1-2 jours',
    shippingTime: '5-12 jours',
    minimumOrder: 1,
    performance: {
      responseRate: 96,
      responseTime: '3h',
      qualityRating: 4.6,
      onTimeDelivery: 92
    },
    description: 'Plateforme de fulfillment avec entrepôts USA et branding personnalisé'
  },
  {
    id: '4',
    name: 'Printify Print-on-Demand',
    country: 'Lettonie',
    logo: '🎨',
    verified: true,
    rating: 4.7,
    productsCount: 12000,
    categories: ['Vêtements', 'Accessoires', 'Maison', 'Art'],
    processingTime: '2-5 jours',
    shippingTime: '3-10 jours',
    minimumOrder: 1,
    performance: {
      responseRate: 97,
      responseTime: '4h',
      qualityRating: 4.8,
      onTimeDelivery: 95
    },
    description: 'Impression à la demande avec 300+ produits personnalisables'
  },
  {
    id: '5',
    name: 'Spocket Premium',
    country: 'Canada',
    logo: '⚡',
    verified: true,
    rating: 4.5,
    productsCount: 35000,
    categories: ['Mode', 'Beauté', 'Électronique', 'Fitness'],
    processingTime: '1-3 jours',
    shippingTime: '3-8 jours',
    minimumOrder: 1,
    performance: {
      responseRate: 95,
      responseTime: '2h',
      qualityRating: 4.5,
      onTimeDelivery: 90
    },
    description: 'Fournisseurs USA/EU avec produits tendance et marges élevées'
  }
]

export const mockOrders = [
  {
    id: 'ORD-2024-001',
    customerName: 'Marie Dubois',
    customerEmail: 'marie.dubois@email.com',
    product: 'Montre Connectée Sport Pro Max',
    quantity: 1,
    amount: 89.99,
    status: 'delivered',
    trackingNumber: 'FR123456789',
    carrier: 'Colissimo',
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-22',
    supplier: 'AliExpress'
  },
  {
    id: 'ORD-2024-002',
    customerName: 'Pierre Martin',
    customerEmail: 'pierre.martin@email.com',
    product: 'Écouteurs Bluetooth Premium ANC',
    quantity: 2,
    amount: 159.98,
    status: 'in_transit',
    trackingNumber: 'FR987654321',
    carrier: 'Chronopost',
    orderDate: '2024-01-18',
    deliveryDate: null,
    supplier: 'BigBuy'
  },
  {
    id: 'ORD-2024-003',
    customerName: 'Sophie Laurent',
    customerEmail: 'sophie.laurent@email.com',
    product: 'Coque iPhone 15 Pro Transparente',
    quantity: 1,
    amount: 24.99,
    status: 'processing',
    trackingNumber: null,
    carrier: null,
    orderDate: '2024-01-20',
    deliveryDate: null,
    supplier: 'Eprolo'
  }
]

export const mockAnalytics = {
  overview: {
    totalRevenue: 245678.90,
    totalOrders: 3456,
    totalProducts: 1234,
    conversionRate: 3.2,
    averageOrderValue: 71.05,
    topCountries: ['France', 'Belgique', 'Suisse', 'Canada'],
    growthRate: 23.5
  },
  salesData: [
    { month: 'Jan', revenue: 18500, orders: 245 },
    { month: 'Fév', revenue: 22300, orders: 298 },
    { month: 'Mar', revenue: 19800, orders: 267 },
    { month: 'Avr', revenue: 25600, orders: 342 },
    { month: 'Mai', revenue: 28900, orders: 389 },
    { month: 'Jun', revenue: 32400, orders: 435 }
  ],
  topProducts: [
    { name: 'Montre Connectée Sport Pro Max', sales: 1247, revenue: 112023.53 },
    { name: 'Écouteurs Bluetooth Premium ANC', sales: 892, revenue: 71351.08 },
    { name: 'Coque iPhone 15 Pro Transparente', sales: 2156, revenue: 53874.44 }
  ]
}

export const mockCRMLeads = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    company: 'TechStart SAS',
    status: 'qualified',
    source: 'Website',
    value: 2500,
    lastContact: '2024-01-20',
    notes: 'Intéressé par le plan Professional. Demande démo personnalisée.',
    tags: ['hot-lead', 'demo-requested']
  },
  {
    id: '2',
    name: 'Marie Leroy',
    email: 'marie.leroy@boutique.fr',
    phone: '+33 6 98 76 54 32',
    company: 'Boutique Mode',
    status: 'contacted',
    source: 'Facebook Ads',
    value: 1200,
    lastContact: '2024-01-18',
    notes: 'Dropshipper débutant, cherche solution simple pour import AliExpress.',
    tags: ['beginner', 'aliexpress']
  },
  {
    id: '3',
    name: 'Pierre Martin',
    email: 'p.martin@ecommerce.com',
    phone: '+33 6 45 67 89 12',
    company: 'E-commerce Solutions',
    status: 'proposal',
    source: 'LinkedIn',
    value: 5000,
    lastContact: '2024-01-22',
    notes: 'Agence e-commerce, besoin plan Enterprise pour 10+ clients.',
    tags: ['agency', 'enterprise', 'high-value']
  }
]

export const mockBlogPosts = [
  {
    id: '1',
    title: '10 Produits Gagnants Dropshipping 2024 : Analyse Complète',
    slug: '10-produits-gagnants-dropshipping-2024',
    excerpt: 'Découvrez les produits les plus rentables pour votre boutique dropshipping en 2024, avec analyses de marché et stratégies de vente.',
    content: `# 10 Produits Gagnants Dropshipping 2024

Le dropshipping continue d'évoluer en 2024, avec de nouvelles opportunités et tendances émergentes. Voici notre analyse des 10 produits les plus prometteurs...

## 1. Montres Connectées Sport

Les montres connectées restent un marché en forte croissance, particulièrement dans le segment sport et fitness.

**Pourquoi ça marche :**
- Marché en croissance de 15% par an
- Marge élevée (100-200%)
- Forte demande toute l'année

**Stratégie recommandée :**
- Cibler les sportifs et fitness enthusiasts
- Mettre en avant les fonctionnalités santé
- Prix recommandé : 80-120€

## 2. Accessoires iPhone 15

Avec le lancement de l'iPhone 15, les accessoires représentent une opportunité majeure.

**Produits phares :**
- Coques transparentes antichoc
- Chargeurs MagSafe
- Supports voiture magnétiques

## 3. Produits Écologiques

La tendance écologique continue de croître, offrant de belles opportunités.

**Exemples :**
- Pailles réutilisables
- Sacs en matières recyclées
- Produits zéro déchet

*Article généré par DropFlow Pro IA*`,
    author: 'DropFlow Pro IA',
    publishedAt: '2024-01-15',
    readTime: '8 min',
    tags: ['produits-gagnants', 'tendances', 'analyse-marché'],
    featured: true,
    views: 12547,
    likes: 234
  },
  {
    id: '2',
    title: 'SEO Dropshipping : Guide Complet pour Optimiser vos Fiches Produits',
    slug: 'seo-dropshipping-guide-complet-optimisation',
    excerpt: 'Maîtrisez le SEO pour vos produits dropshipping : techniques avancées, outils IA et stratégies pour dominer Google.',
    content: `# SEO Dropshipping : Guide Complet

L'optimisation SEO est cruciale pour le succès de votre boutique dropshipping. Voici comment optimiser efficacement vos fiches produits...

## Recherche de Mots-Clés

La base du SEO commence par une recherche approfondie de mots-clés.

**Outils recommandés :**
- Google Keyword Planner
- SEMrush
- Ahrefs
- DropFlow Pro IA (inclus)

## Optimisation des Titres

Un bon titre produit doit :
- Contenir le mot-clé principal
- Être accrocheur et descriptif
- Respecter la limite de 60 caractères

**Exemple :**
❌ "Montre"
✅ "Montre Connectée Sport GPS Étanche - Autonomie 7 Jours"

## Descriptions Optimisées

Vos descriptions doivent être :
- Uniques (pas de copier-coller fournisseur)
- Riches en mots-clés naturels
- Orientées bénéfices client

*Optimisé avec DropFlow Pro IA*`,
    author: 'DropFlow Pro IA',
    publishedAt: '2024-01-18',
    readTime: '12 min',
    tags: ['seo', 'optimisation', 'fiches-produits'],
    featured: false,
    views: 8934,
    likes: 156
  }
]

export const mockReviews = [
  {
    id: '1',
    customerName: 'Sarah M.',
    customerEmail: 'sarah.m@email.com',
    productName: 'Montre Connectée Sport Pro Max',
    rating: 5,
    title: 'Excellente montre, très satisfaite !',
    content: 'Reçue rapidement, la montre fonctionne parfaitement. Le suivi GPS est précis et l\'autonomie tient bien les 7 jours annoncés. Je recommande !',
    date: '2024-01-20',
    verified: true,
    helpful: 23,
    images: ['https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=200']
  },
  {
    id: '2',
    customerName: 'Marc D.',
    customerEmail: 'marc.d@email.com',
    productName: 'Écouteurs Bluetooth Premium ANC',
    rating: 4,
    title: 'Bon rapport qualité-prix',
    content: 'Son de qualité et la réduction de bruit fonctionne bien. Seul bémol : le boîtier se raye facilement. Sinon très content de mon achat.',
    date: '2024-01-18',
    verified: true,
    helpful: 15,
    images: []
  },
  {
    id: '3',
    customerName: 'Julie L.',
    customerEmail: 'julie.l@email.com',
    productName: 'Coque iPhone 15 Pro Transparente',
    rating: 5,
    title: 'Protection parfaite !',
    content: 'Coque de très bonne qualité, transparente comme annoncé et protège bien mon téléphone. Déjà fait tomber plusieurs fois, aucun dommage !',
    date: '2024-01-22',
    verified: true,
    helpful: 31,
    images: []
  }
]

export const mockTrackingData = [
  {
    id: '1',
    orderId: 'ORD-2024-001',
    trackingNumber: 'FR123456789',
    carrier: 'Colissimo',
    status: 'delivered',
    estimatedDelivery: '2024-01-22',
    currentLocation: 'Livré - Paris 75001',
    events: [
      {
        date: '2024-01-22',
        time: '14:30',
        location: 'Paris 75001',
        description: 'Colis livré au destinataire',
        status: 'delivered'
      },
      {
        date: '2024-01-22',
        time: '09:15',
        location: 'Paris Centre de Tri',
        description: 'En cours de livraison',
        status: 'out_for_delivery'
      },
      {
        date: '2024-01-21',
        time: '18:45',
        location: 'Paris Centre de Tri',
        description: 'Arrivé au centre de tri',
        status: 'in_transit'
      },
      {
        date: '2024-01-20',
        time: '12:00',
        location: 'Roissy CDG',
        description: 'Colis arrivé en France',
        status: 'in_transit'
      },
      {
        date: '2024-01-18',
        time: '08:30',
        location: 'Guangzhou, Chine',
        description: 'Colis expédié',
        status: 'shipped'
      }
    ]
  },
  {
    id: '2',
    orderId: 'ORD-2024-002',
    trackingNumber: 'FR987654321',
    carrier: 'Chronopost',
    status: 'in_transit',
    estimatedDelivery: '2024-01-25',
    currentLocation: 'Lyon Centre de Tri',
    events: [
      {
        date: '2024-01-23',
        time: '16:20',
        location: 'Lyon Centre de Tri',
        description: 'Colis en transit',
        status: 'in_transit'
      },
      {
        date: '2024-01-22',
        time: '22:15',
        location: 'Marseille',
        description: 'Colis parti du centre de tri',
        status: 'in_transit'
      },
      {
        date: '2024-01-21',
        time: '14:30',
        location: 'Marseille',
        description: 'Colis arrivé au centre de tri',
        status: 'in_transit'
      }
    ]
  }
]
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Zap,
  TrendingUp,
  Star,
  Eye,
  ShoppingCart,
  DollarSign,
  Target,
  Flame,
  Search,
  Filter,
  Sparkles,
  BarChart3,
  Globe,
  Calendar,
  Award
} from 'lucide-react'

const mockWinningProducts = [
  {
    id: '1',
    title: 'Montre Connectée Fitness Pro 2024',
    description: 'Montre intelligente avec suivi santé avancé, GPS intégré et autonomie 14 jours',
    price: 89.99,
    originalPrice: 35.50,
    images: ['https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400'],
    supplier: 'AliExpress',
    category: 'Électronique',
    winnerScore: 94,
    reasons: [
      'Forte demande fitness post-COVID',
      'Marge exceptionnelle (153%)',
      'Tendance santé connectée',
      'Faible concurrence sur ce modèle',
      'Excellent potentiel publicitaire'
    ],
    marketTrends: ['Santé connectée', 'Fitness tracking', 'Wearables'],
    competitionLevel: 'medium' as const,
    profitPotential: 153,
    socialProof: {
      reviews: 2847,
      rating: 4.6,
      orders: 15420
    },
    adSpend: {
      facebook: 8500,
      google: 3200,
      tiktok: 12800
    },
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Écouteurs Gaming RGB Sans Fil',
    description: 'Casque gaming premium avec éclairage RGB, son surround 7.1 et micro antibruit',
    price: 79.99,
    originalPrice: 28.90,
    images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400'],
    supplier: 'BigBuy',
    category: 'Gaming',
    winnerScore: 91,
    reasons: [
      'Marché gaming en explosion',
      'RGB très populaire chez gamers',
      'Prix compétitif vs marques',
      'Forte viralité TikTok/YouTube',
      'Marge confortable (177%)'
    ],
    marketTrends: ['Gaming', 'RGB lighting', 'Streaming'],
    competitionLevel: 'high' as const,
    profitPotential: 177,
    socialProof: {
      reviews: 1923,
      rating: 4.4,
      orders: 8750
    },
    adSpend: {
      facebook: 6200,
      google: 2800,
      tiktok: 18500
    },
    createdAt: '2024-01-18'
  },
  {
    id: '3',
    title: 'Lampe LED Hexagonale Modulaire',
    description: 'Système d\'éclairage modulaire avec contrôle app, 16M couleurs et synchronisation musique',
    price: 129.99,
    originalPrice: 45.20,
    images: ['https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400'],
    supplier: 'Eprolo',
    category: 'Décoration',
    winnerScore: 88,
    reasons: [
      'Tendance déco gaming/tech',
      'Produit très photogénique',
      'Excellent pour contenu social',
      'Marge élevée (188%)',
      'Marché déco connectée croissant'
    ],
    marketTrends: ['Smart home', 'Gaming setup', 'LED décoration'],
    competitionLevel: 'low' as const,
    profitPotential: 188,
    socialProof: {
      reviews: 1456,
      rating: 4.7,
      orders: 5230
    },
    adSpend: {
      facebook: 4800,
      google: 1900,
      tiktok: 9200
    },
    createdAt: '2024-01-20'
  },
  {
    id: '4',
    title: 'Chargeur MagSafe 3-en-1 Station',
    description: 'Station de charge sans fil pour iPhone, AirPods et Apple Watch avec design premium',
    price: 69.99,
    originalPrice: 22.80,
    images: ['https://images.pexels.com/photos/4526413/pexels-photo-4526413.jpeg?auto=compress&cs=tinysrgb&w=400'],
    supplier: 'Spocket',
    category: 'Accessoires',
    winnerScore: 86,
    reasons: [
      'Écosystème Apple très demandé',
      'Solution pratique multi-appareils',
      'Design premium attractif',
      'Marge solide (207%)',
      'Marché accessoires iPhone stable'
    ],
    marketTrends: ['MagSafe', 'Wireless charging', 'Apple ecosystem'],
    competitionLevel: 'medium' as const,
    profitPotential: 207,
    socialProof: {
      reviews: 892,
      rating: 4.5,
      orders: 3420
    },
    adSpend: {
      facebook: 3500,
      google: 2100,
      tiktok: 4800
    },
    createdAt: '2024-01-22'
  }
]

const categories = ['Tous', 'Électronique', 'Gaming', 'Décoration', 'Accessoires', 'Mode', 'Sport', 'Maison']
const competitionLevels = ['Tous', 'low', 'medium', 'high']

const competitionColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
}

const competitionLabels = {
  low: 'Faible',
  medium: 'Moyenne',
  high: 'Élevée'
}

export function WinnersPage() {
  const [products, setProducts] = useState(mockWinningProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [selectedCompetition, setSelectedCompetition] = useState('Tous')
  const [sortBy, setSortBy] = useState('winnerScore')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory
    const matchesCompetition = selectedCompetition === 'Tous' || product.competitionLevel === selectedCompetition

    return matchesSearch && matchesCategory && matchesCompetition
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'winnerScore':
        return b.winnerScore - a.winnerScore
      case 'profitPotential':
        return b.profitPotential - a.profitPotential
      case 'orders':
        return b.socialProof.orders - a.socialProof.orders
      case 'rating':
        return b.socialProof.rating - a.socialProof.rating
      default:
        return 0
    }
  })

  const stats = {
    totalProducts: products.length,
    averageScore: Math.round(products.reduce((sum, p) => sum + p.winnerScore, 0) / products.length),
    highScoreProducts: products.filter(p => p.winnerScore >= 90).length,
    totalOrders: products.reduce((sum, p) => sum + p.socialProof.orders, 0)
  }

  const handleAnalyzeNew = async () => {
    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      // Add new detected winners
      const newWinner = {
        id: Date.now().toString(),
        title: 'Projecteur LED Galaxie Étoilée',
        description: 'Projecteur d\'ambiance avec effets galaxie, contrôle vocal et minuterie',
        price: 49.99,
        originalPrice: 18.50,
        images: ['https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400'],
        supplier: 'AI Detected',
        category: 'Décoration',
        winnerScore: 92,
        reasons: [
          'Tendance déco ambiance forte',
          'Viral sur réseaux sociaux',
          'Cadeau parfait toute occasion',
          'Marge exceptionnelle (170%)',
          'Faible concurrence détectée'
        ],
        marketTrends: ['Ambiance lighting', 'Home décor', 'Relaxation'],
        competitionLevel: 'low' as const,
        profitPotential: 170,
        socialProof: {
          reviews: 1200,
          rating: 4.8,
          orders: 6500
        },
        adSpend: {
          facebook: 5200,
          google: 2400,
          tiktok: 8900
        },
        createdAt: new Date().toISOString()
      }
      setProducts([newWinner, ...products])
    }, 3000)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produits Gagnants</h1>
          <p className="text-gray-600">
            Découvrez les produits à fort potentiel détectés par notre IA
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Rapport Tendances
          </Button>
          <Button 
            onClick={handleAnalyzeNew}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-orange-500 to-orange-600"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Détecter Nouveaux Winners
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Winners Détectés
            </CardTitle>
            <Flame className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalProducts}</div>
            <p className="text-xs text-gray-500">
              +3 cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Score Moyen
            </CardTitle>
            <Award className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.averageScore}/100</div>
            <p className="text-xs text-gray-500">
              Qualité exceptionnelle
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Top Winners (90+)
            </CardTitle>
            <Star className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.highScoreProducts}</div>
            <p className="text-xs text-gray-500">
              Potentiel maximum
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Commandes Totales
            </CardTitle>
            <ShoppingCart className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalOrders.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              Validation marché
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCompetition} onValueChange={setSelectedCompetition}>
              <SelectTrigger>
                <SelectValue placeholder="Concurrence" />
              </SelectTrigger>
              <SelectContent>
                {competitionLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level === 'Tous' ? level : competitionLabels[level as keyof typeof competitionLabels]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="winnerScore">Score Winner</SelectItem>
                <SelectItem value="profitPotential">Potentiel Profit</SelectItem>
                <SelectItem value="orders">Nombre Commandes</SelectItem>
                <SelectItem value="rating">Note Moyenne</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Tendances Globales
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Winners Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{product.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {product.description}
                  </CardDescription>
                </div>
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-20 h-20 rounded-lg object-cover ml-4"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Score and Metrics */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-lg">Score: {product.winnerScore}/100</span>
                </div>
                <Badge className={competitionColors[product.competitionLevel]}>
                  Concurrence {competitionLabels[product.competitionLevel]}
                </Badge>
              </div>

              <Progress value={product.winnerScore} className="h-2" />

              {/* Price and Profit */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Prix Vente</p>
                  <p className="font-semibold text-green-600">€{product.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Coût</p>
                  <p className="font-semibold">€{product.originalPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Marge</p>
                  <p className="font-semibold text-orange-600">{product.profitPotential}%</p>
                </div>
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{product.socialProof.rating}</span>
                  <span className="text-gray-500">({product.socialProof.reviews} avis)</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShoppingCart className="w-4 h-4 text-gray-400" />
                  <span>{product.socialProof.orders.toLocaleString()} commandes</span>
                </div>
              </div>

              {/* Reasons */}
              <div>
                <p className="font-medium text-sm mb-2">Pourquoi c'est un winner :</p>
                <div className="space-y-1">
                  {product.reasons.slice(0, 3).map((reason, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      <span className="text-gray-700">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Trends */}
              <div>
                <p className="font-medium text-sm mb-2">Tendances marché :</p>
                <div className="flex flex-wrap gap-1">
                  {product.marketTrends.map((trend, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {trend}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600">
                  <Target className="w-4 h-4 mr-2" />
                  Importer Produit
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Analyser
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Insights Marché IA
          </CardTitle>
          <CardDescription>
            Tendances et opportunités détectées par notre intelligence artificielle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trends" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trends">Tendances</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
              <TabsTrigger value="predictions">Prédictions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trends" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    Santé & Fitness Connecté
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Croissance de 45% sur les wearables santé. Opportunité majeure post-COVID.
                  </p>
                  <Badge className="bg-green-100 text-green-800">+45% croissance</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Gaming & RGB
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Marché gaming explose, RGB très demandé par Gen Z. TikTok booste les ventes.
                  </p>
                  <Badge className="bg-purple-100 text-purple-800">Viral TikTok</Badge>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="opportunities" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Déco Smart Home</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Éclairage connecté et déco tech en forte demande. Marges élevées possibles.
                  </p>
                  <Badge variant="outline">Marge 150%+</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Accessoires MagSafe</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Écosystème Apple stable, demande constante pour accessoires premium.
                  </p>
                  <Badge variant="outline">Marché stable</Badge>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="predictions" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    Prédictions Q2 2024
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Explosion des produits de jardinage connecté (+60%)</li>
                    <li>• Accessoires sport outdoor en forte hausse</li>
                    <li>• Déco minimaliste et épurée très demandée</li>
                    <li>• Tech éco-responsable devient mainstream</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
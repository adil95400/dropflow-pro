import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Zap, TrendingUp, Star, Target, DollarSign, Eye, Heart, Share2, Filter, Search, Download, RefreshCw, MoreHorizontal, ChevronDown, ChevronUp, Sparkles, BarChart3, Globe, Calendar, Clock, Users, ShoppingCart, Package, AlertTriangle, CheckCircle, Info, Lightbulb, Brain, Rocket, Crown, Siren as Fire, Award, Bookmark, ExternalLink, Copy, Plus, Minus, ArrowUpRight, ArrowDownRight, TrendingDown } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface WinnerProduct {
  id: string
  title: string
  description: string
  price: number
  originalPrice: number
  images: string[]
  supplier: string
  category: string
  winnerScore: number
  reasons: string[]
  marketTrends: string[]
  competitionLevel: 'low' | 'medium' | 'high'
  profitPotential: number
  socialProof: {
    reviews: number
    rating: number
    orders: number
  }
  adSpend: {
    facebook: number
    google: number
    tiktok: number
    total: number
  }
  metrics: {
    ctr: number
    conversionRate: number
    roas: number
    cpc: number
  }
  trending: {
    isHot: boolean
    velocity: number
    timeframe: string
  }
  saturation: {
    level: number
    competitors: number
    marketSize: string
  }
  seasonality: {
    peak: string[]
    low: string[]
    yearRound: boolean
  }
  createdAt: string
  lastUpdated: string
  status: 'active' | 'monitoring' | 'archived'
  tags: string[]
  notes: string
}

interface MarketTrend {
  id: string
  name: string
  category: string
  growthRate: number
  searchVolume: number
  competitionLevel: 'low' | 'medium' | 'high'
  opportunityScore: number
  relatedProducts: number
  timeframe: string
  regions: string[]
  keywords: string[]
}

interface FilterOptions {
  category: string
  competitionLevel: string
  minScore: number
  maxScore: number
  priceRange: [number, number]
  supplier: string
  status: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

const mockWinnerProducts: WinnerProduct[] = [
  {
    id: '1',
    title: 'Montre Connectée Fitness Pro 2024',
    description: 'Montre intelligente avec suivi santé avancé, GPS intégré et autonomie 14 jours. Écran AMOLED, résistance à l\'eau IP68.',
    price: 89.99,
    originalPrice: 35.50,
    images: [
      'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
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
    marketTrends: ['Santé connectée', 'Fitness tracking', 'Wearable tech'],
    competitionLevel: 'medium',
    profitPotential: 153,
    socialProof: {
      reviews: 2847,
      rating: 4.7,
      orders: 15420
    },
    adSpend: {
      facebook: 8500,
      google: 3200,
      tiktok: 12000,
      total: 23700
    },
    metrics: {
      ctr: 3.8,
      conversionRate: 2.4,
      roas: 4.2,
      cpc: 0.85
    },
    trending: {
      isHot: true,
      velocity: 85,
      timeframe: '7 jours'
    },
    saturation: {
      level: 35,
      competitors: 127,
      marketSize: '2.8M'
    },
    seasonality: {
      peak: ['Janvier', 'Septembre'],
      low: ['Juillet', 'Août'],
      yearRound: true
    },
    createdAt: '2024-01-15',
    lastUpdated: '2024-01-20',
    status: 'active',
    tags: ['trending', 'high-margin', 'viral'],
    notes: 'Produit très performant sur TikTok, excellent pour le Q1'
  },
  {
    id: '2',
    title: 'Écouteurs Gaming RGB Sans Fil',
    description: 'Casque gaming premium avec éclairage RGB, son surround 7.1 et micro antibruit. Compatible PC, PS5, Xbox.',
    price: 79.99,
    originalPrice: 28.90,
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
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
    marketTrends: ['Gaming accessories', 'RGB lighting', 'Wireless audio'],
    competitionLevel: 'high',
    profitPotential: 177,
    socialProof: {
      reviews: 1923,
      rating: 4.5,
      orders: 8750
    },
    adSpend: {
      facebook: 6800,
      google: 4200,
      tiktok: 15600,
      total: 26600
    },
    metrics: {
      ctr: 4.2,
      conversionRate: 3.1,
      roas: 3.8,
      cpc: 1.20
    },
    trending: {
      isHot: true,
      velocity: 92,
      timeframe: '3 jours'
    },
    saturation: {
      level: 68,
      competitors: 245,
      marketSize: '1.2M'
    },
    seasonality: {
      peak: ['Novembre', 'Décembre', 'Janvier'],
      low: ['Juin', 'Juillet'],
      yearRound: false
    },
    createdAt: '2024-01-18',
    lastUpdated: '2024-01-22',
    status: 'active',
    tags: ['gaming', 'viral', 'rgb'],
    notes: 'Très forte demande pendant les fêtes et rentrée scolaire'
  },
  {
    id: '3',
    title: 'Lampe LED Hexagonale Modulaire',
    description: 'Système d\'éclairage modulaire avec contrôle app, 16M couleurs et synchronisation musique. Design futuriste.',
    price: 129.99,
    originalPrice: 45.20,
    images: [
      'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
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
    marketTrends: ['Smart home', 'Gaming setup', 'LED lighting'],
    competitionLevel: 'low',
    profitPotential: 188,
    socialProof: {
      reviews: 1456,
      rating: 4.6,
      orders: 6890
    },
    adSpend: {
      facebook: 5400,
      google: 2800,
      tiktok: 9200,
      total: 17400
    },
    metrics: {
      ctr: 5.1,
      conversionRate: 2.8,
      roas: 4.8,
      cpc: 0.95
    },
    trending: {
      isHot: false,
      velocity: 45,
      timeframe: '14 jours'
    },
    saturation: {
      level: 25,
      competitors: 89,
      marketSize: '850K'
    },
    seasonality: {
      peak: ['Octobre', 'Novembre', 'Décembre'],
      low: ['Février', 'Mars'],
      yearRound: true
    },
    createdAt: '2024-01-10',
    lastUpdated: '2024-01-19',
    status: 'monitoring',
    tags: ['photogenic', 'social-media', 'smart-home'],
    notes: 'Excellent pour contenu Instagram et TikTok'
  }
]

const mockMarketTrends: MarketTrend[] = [
  {
    id: '1',
    name: 'Santé Connectée',
    category: 'Électronique',
    growthRate: 45,
    searchVolume: 125000,
    competitionLevel: 'medium',
    opportunityScore: 92,
    relatedProducts: 156,
    timeframe: '6 mois',
    regions: ['France', 'Europe', 'Amérique du Nord'],
    keywords: ['montre connectée', 'fitness tracker', 'santé digitale']
  },
  {
    id: '2',
    name: 'Gaming RGB',
    category: 'Gaming',
    growthRate: 38,
    searchVolume: 89000,
    competitionLevel: 'high',
    opportunityScore: 78,
    relatedProducts: 234,
    timeframe: '3 mois',
    regions: ['Mondial'],
    keywords: ['gaming rgb', 'setup gamer', 'éclairage gaming']
  },
  {
    id: '3',
    name: 'Maison Intelligente',
    category: 'Maison',
    growthRate: 52,
    searchVolume: 156000,
    competitionLevel: 'low',
    opportunityScore: 95,
    relatedProducts: 189,
    timeframe: '12 mois',
    regions: ['Europe', 'Amérique du Nord'],
    keywords: ['smart home', 'domotique', 'maison connectée']
  }
]

export function WinnersPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<WinnerProduct[]>(mockWinnerProducts)
  const [trends, setTrends] = useState<MarketTrend[]>(mockMarketTrends)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('products')
  const [showFilters, setShowFilters] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    competitionLevel: 'all',
    minScore: 0,
    maxScore: 100,
    priceRange: [0, 1000],
    supplier: 'all',
    status: 'all',
    sortBy: 'winnerScore',
    sortOrder: 'desc'
  })

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = filters.category === 'all' || product.category === filters.category
    const matchesCompetition = filters.competitionLevel === 'all' || product.competitionLevel === filters.competitionLevel
    const matchesScore = product.winnerScore >= filters.minScore && product.winnerScore <= filters.maxScore
    const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    const matchesSupplier = filters.supplier === 'all' || product.supplier === filters.supplier
    const matchesStatus = filters.status === 'all' || product.status === filters.status

    return matchesSearch && matchesCategory && matchesCompetition && matchesScore && matchesPrice && matchesSupplier && matchesStatus
  }).sort((a, b) => {
    const aValue = a[filters.sortBy as keyof WinnerProduct] as any
    const bValue = b[filters.sortBy as keyof WinnerProduct] as any
    
    if (filters.sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const handleAnalyzeProducts = async () => {
    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      // Add notification or update products
    }, 3000)
  }

  const handleExportWinners = () => {
    const dataStr = JSON.stringify(filteredProducts, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `winners-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 80) return 'text-blue-600 bg-blue-50'
    if (score >= 70) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Crown className="w-8 h-8 text-yellow-500" />
            Produits Gagnants
          </h1>
          <p className="text-gray-600">
            Découvrez les produits à fort potentiel détectés par notre IA
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline" onClick={handleExportWinners}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button 
            onClick={handleAnalyzeProducts}
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
                <Brain className="w-4 h-4 mr-2" />
                Analyser avec IA
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Winners Détectés</CardTitle>
            <Award className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              +12 cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
            <Target className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(products.reduce((acc, p) => acc + p.winnerScore, 0) / products.length)}
            </div>
            <p className="text-xs text-muted-foreground">
              +5 points vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Potentiel</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(products.reduce((acc, p) => acc + p.profitPotential, 0) / products.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Marge moyenne
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendances Actives</CardTitle>
            <Fire className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trends.length}</div>
            <p className="text-xs text-muted-foreground">
              Opportunités de marché
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtres Avancés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Catégorie</label>
                <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="Électronique">Électronique</SelectItem>
                    <SelectItem value="Gaming">Gaming</SelectItem>
                    <SelectItem value="Décoration">Décoration</SelectItem>
                    <SelectItem value="Mode">Mode</SelectItem>
                    <SelectItem value="Maison">Maison</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Concurrence</label>
                <Select value={filters.competitionLevel} onValueChange={(value) => setFilters({...filters, competitionLevel: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous niveaux</SelectItem>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Score minimum</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.minScore}
                  onChange={(e) => setFilters({...filters, minScore: parseInt(e.target.value) || 0})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Trier par</label>
                <Select value={filters.sortBy} onValueChange={(value) => setFilters({...filters, sortBy: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="winnerScore">Score Winner</SelectItem>
                    <SelectItem value="profitPotential">Profit Potentiel</SelectItem>
                    <SelectItem value="price">Prix</SelectItem>
                    <SelectItem value="createdAt">Date de création</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and View Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher des produits gagnants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Badge variant="outline" className="text-sm">
            {filteredProducts.length} produits
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Package className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Produits Gagnants</TabsTrigger>
          <TabsTrigger value="trends">Tendances Marché</TabsTrigger>
          <TabsTrigger value="analytics">Analytics IA</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-all duration-300 group">
                  <div className="relative">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                      <Badge className={`${getScoreColor(product.winnerScore)} border-0`}>
                        {product.winnerScore}/100
                      </Badge>
                      {product.trending.isHot && (
                        <Badge className="bg-red-500 text-white">
                          <Fire className="w-3 h-3 mr-1" />
                          HOT
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="bg-white/80 backdrop-blur-sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Heart className="w-4 h-4 mr-2" />
                            Ajouter aux favoris
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            Partager
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Package className="w-4 h-4 mr-2" />
                            Importer produit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {product.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">
                            {formatCurrency(product.price)}
                          </span>
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        </div>
                        <Badge className={`${getCompetitionColor(product.competitionLevel)} border-0`}>
                          {product.competitionLevel === 'low' ? 'Faible' : 
                           product.competitionLevel === 'medium' ? 'Moyenne' : 'Élevée'} concurrence
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Profit potentiel</span>
                          <span className="font-semibold text-green-600">+{product.profitPotential}%</span>
                        </div>
                        <Progress value={product.profitPotential} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div>
                          <div className="font-semibold text-gray-900">{formatNumber(product.socialProof.orders)}</div>
                          <div className="text-gray-500">Commandes</div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center justify-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            {product.socialProof.rating}
                          </div>
                          <div className="text-gray-500">Note</div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{product.metrics.roas}x</div>
                          <div className="text-gray-500">ROAS</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {product.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{product.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <Rocket className="w-4 h-4 mr-1" />
                          Importer
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Concurrence</TableHead>
                    <TableHead>Commandes</TableHead>
                    <TableHead>ROAS</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium line-clamp-1">{product.title}</div>
                            <div className="text-sm text-gray-500">{product.supplier}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getScoreColor(product.winnerScore)} border-0`}>
                          {product.winnerScore}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold">{formatCurrency(product.price)}</div>
                          <div className="text-sm text-gray-500 line-through">
                            {formatCurrency(product.originalPrice)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">+{product.profitPotential}%</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getCompetitionColor(product.competitionLevel)} border-0`}>
                          {product.competitionLevel === 'low' ? 'Faible' : 
                           product.competitionLevel === 'medium' ? 'Moyenne' : 'Élevée'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatNumber(product.socialProof.orders)}</TableCell>
                      <TableCell>
                        <span className="font-semibold">{product.metrics.roas}x</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm">
                            <Rocket className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trends.map((trend) => (
              <Card key={trend.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{trend.name}</CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      +{trend.growthRate}%
                    </Badge>
                  </div>
                  <CardDescription>{trend.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Score d'opportunité</span>
                      <span className="font-semibold">{trend.opportunityScore}/100</span>
                    </div>
                    <Progress value={trend.opportunityScore} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Volume recherche</div>
                      <div className="font-semibold">{formatNumber(trend.searchVolume)}/mois</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Produits liés</div>
                      <div className="font-semibold">{trend.relatedProducts}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-2">Mots-clés principaux</div>
                    <div className="flex flex-wrap gap-1">
                      {trend.keywords.slice(0, 3).map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Explorer cette tendance
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Insights IA
                </CardTitle>
                <CardDescription>
                  Analyses automatiques de vos produits gagnants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Opportunité détectée :</strong> Les produits de santé connectée montrent une croissance de 45% ce mois-ci. Considérez d'augmenter votre stock.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Tendance saisonnière :</strong> Les produits gaming RGB performent 3x mieux en période de rentrée scolaire (septembre-octobre).
                  </AlertDescription>
                </Alert>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Alerte saturation :</strong> Le marché des écouteurs gaming atteint 68% de saturation. Diversifiez vers d'autres catégories.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Métriques Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">4.2x</div>
                      <div className="text-sm text-gray-600">ROAS Moyen</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">2.8%</div>
                      <div className="text-sm text-gray-600">Taux Conversion</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Électronique</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Gaming</span>
                        <span>30%</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Décoration</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Analyse Détaillée par Produit</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead>Conv. Rate</TableHead>
                    <TableHead>CPC</TableHead>
                    <TableHead>ROAS</TableHead>
                    <TableHead>Vélocité</TableHead>
                    <TableHead>Saturation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <span className="font-medium">{product.title.substring(0, 30)}...</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {product.metrics.ctr > 3 ? (
                            <ArrowUpRight className="w-4 h-4 text-green-500" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                          )}
                          {product.metrics.ctr}%
                        </div>
                      </TableCell>
                      <TableCell>{product.metrics.conversionRate}%</TableCell>
                      <TableCell>{formatCurrency(product.metrics.cpc)}</TableCell>
                      <TableCell>
                        <span className={product.metrics.roas > 3 ? 'text-green-600 font-semibold' : 'text-red-600'}>
                          {product.metrics.roas}x
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {product.trending.velocity > 70 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          {product.trending.velocity}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <Progress value={product.saturation.level} className="w-16 h-2" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-orange-600" />
            Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Détecter Nouveaux Winners
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Actualiser Scores
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Analyser Tendances Globales
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Planifier Campagnes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
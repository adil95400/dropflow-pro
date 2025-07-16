import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
  Zap,
  Search,
  Globe,
  Target,
  TrendingUp,
  Eye,
  Edit,
  Copy,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  BarChart3,
  Languages,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FileText,
  Tag,
  ArrowUpRight,
  Bookmark,
  MessageSquare
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { SEOOptimizer, SEOOptimization } from '@/lib/ai/seo-optimizer'
import { generateSEOKeywords } from '@/lib/keywords'

interface Product {
  id: string
  title: string
  description: string
  price: number
  category: string
  images: string[]
  seoScore: number
  tags: string[]
}

interface SEOSuggestion {
  type: 'title' | 'description' | 'tags'
  current: string
  suggested: string
  improvement: string
  reason: string
}

interface KeywordSuggestion {
  keyword: string
  volume: number
  difficulty: 'Facile' | 'Moyen' | 'Difficile'
  cpc: string
}

interface CompetitorAnalysis {
  competitor: string
  title: string
  price: string
  rating: number
  reviews: number
  strengths: string[]
  weaknesses: string[]
}

export function SEOPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [optimizedTitle, setOptimizedTitle] = useState('')
  const [optimizedDescription, setOptimizedDescription] = useState('')
  const [optimizedTags, setOptimizedTags] = useState<string[]>([])
  const [targetLanguage, setTargetLanguage] = useState('fr')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [seoSuggestions, setSeoSuggestions] = useState<SEOSuggestion[]>([])
  const [keywordSuggestions, setKeywordSuggestions] = useState<KeywordSuggestion[]>([])
  const [competitorAnalysis, setCompetitorAnalysis] = useState<CompetitorAnalysis[]>([])
  const [optimizationHistory, setOptimizationHistory] = useState<{
    date: string
    product: string
    improvement: number
  }[]>([])

  const seoOptimizer = new SEOOptimizer()

  useEffect(() => {
    loadProducts()
    loadOptimizationHistory()
  }, [user])

  const loadProducts = async () => {
    if (!user) return

    try {
      setLoading(true)

      // In production, load from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // If no products in database, use mock data
      const mockProducts: Product[] = [
        {
          id: '1',
          title: 'Montre Connectée Sport Pro Max',
          description: 'Montre connectée étanche avec GPS, moniteur cardiaque et 50+ modes sport. Autonomie 7 jours.',
          price: 89.99,
          category: 'Électronique',
          images: ['https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400'],
          seoScore: 75,
          tags: ['montre', 'sport', 'connectée', 'fitness', 'gps']
        },
        {
          id: '2',
          title: 'Écouteurs Bluetooth Premium ANC',
          description: 'Écouteurs sans fil avec réduction de bruit active, son Hi-Fi et boîtier de charge rapide.',
          price: 79.99,
          category: 'Audio',
          images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400'],
          seoScore: 68,
          tags: ['écouteurs', 'bluetooth', 'anc', 'audio']
        },
        {
          id: '3',
          title: 'Coque iPhone 15 Pro Transparente',
          description: 'Protection premium transparente avec coins renforcés et certification drop-test 3m.',
          price: 24.99,
          category: 'Accessoires',
          images: ['https://images.pexels.com/photos/4526413/pexels-photo-4526413.jpeg?auto=compress&cs=tinysrgb&w=400'],
          seoScore: 62,
          tags: ['coque', 'iphone', 'protection']
        }
      ]

      setProducts(data?.length ? data : mockProducts)
      if (data?.length || mockProducts.length) {
        setSelectedProduct(data?.[0] || mockProducts[0])
      }

      // Load mock SEO suggestions
      const mockSeoSuggestions: SEOSuggestion[] = [
        {
          type: 'title',
          current: 'Montre Connectée Sport Pro Max',
          suggested: 'Montre Connectée Sport GPS Étanche - Autonomie 7 Jours - Moniteur Cardiaque',
          improvement: '+15% CTR estimé',
          reason: 'Ajout de mots-clés spécifiques et bénéfices clés'
        },
        {
          type: 'description',
          current: 'Montre connectée étanche avec GPS...',
          suggested: 'Découvrez la montre connectée sport ultime avec GPS intégré, moniteur cardiaque précis et 50+ modes sportifs. Étanche IP68, autonomie exceptionnelle de 7 jours. Parfaite pour fitness, running, natation. Livraison gratuite.',
          improvement: '+22% conversion estimée',
          reason: 'Description plus engageante avec bénéfices et call-to-action'
        },
        {
          type: 'tags',
          current: 'montre, sport, connectée, fitness, gps',
          suggested: 'montre connectée sport, smartwatch étanche, montre gps running, tracker fitness, cardio sport, montre multisport, autonomie 7 jours',
          improvement: '+35% visibilité SEO',
          reason: 'Mots-clés plus précis et expressions de recherche complètes'
        }
      ]
      setSeoSuggestions(mockSeoSuggestions)

      // Load mock keyword suggestions
      const mockKeywordSuggestions: KeywordSuggestion[] = [
        { keyword: 'montre connectée sport', volume: 12000, difficulty: 'Moyen', cpc: '€1.20' },
        { keyword: 'smartwatch étanche', volume: 8500, difficulty: 'Facile', cpc: '€0.95' },
        { keyword: 'montre GPS running', volume: 6200, difficulty: 'Difficile', cpc: '€1.80' },
        { keyword: 'bracelet connecté fitness', volume: 15000, difficulty: 'Moyen', cpc: '€1.10' },
        { keyword: 'montre cardiofréquencemètre', volume: 3400, difficulty: 'Facile', cpc: '€0.85' }
      ]
      setKeywordSuggestions(mockKeywordSuggestions)

      // Load mock competitor analysis
      const mockCompetitorAnalysis: CompetitorAnalysis[] = [
        {
          competitor: 'Amazon',
          title: 'Montre Connectée Smartwatch Homme Femme',
          price: '€79.99',
          rating: 4.2,
          reviews: 1247,
          strengths: ['Prix compétitif', 'Nombreux avis'],
          weaknesses: ['Titre générique', 'Description basique']
        },
        {
          competitor: 'Cdiscount',
          title: 'Smartwatch Sport GPS Étanche IP68',
          price: '€89.99',
          rating: 4.0,
          reviews: 456,
          strengths: ['Mots-clés techniques', 'Certification IP68'],
          weaknesses: ['Moins d\'avis', 'Prix élevé']
        }
      ]
      setCompetitorAnalysis(mockCompetitorAnalysis)

    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadOptimizationHistory = async () => {
    // In production, load from Supabase
    const mockHistory = [
      { date: '2024-01-25', product: 'Montre Connectée Sport Pro Max', improvement: 18 },
      { date: '2024-01-22', product: 'Écouteurs Bluetooth Premium ANC', improvement: 24 },
      { date: '2024-01-20', product: 'Coque iPhone 15 Pro Transparente', improvement: 15 },
      { date: '2024-01-18', product: 'Chargeur Sans Fil Rapide 15W', improvement: 12 },
      { date: '2024-01-15', product: 'Lampe LED Bureau Pliable', improvement: 20 }
    ]
    setOptimizationHistory(mockHistory)
  }

  const handleOptimize = async () => {
    if (!selectedProduct) return

    setIsOptimizing(true)
    setOptimizedTitle('')
    setOptimizedDescription('')
    setOptimizedTags([])

    try {
      // In production, use the real SEO optimizer
      const optimization = await seoOptimizer.optimizeProduct(
        selectedProduct.title,
        selectedProduct.description,
        selectedProduct.category,
        targetLanguage
      )

      // Update the product in the database
      if (user) {
        await supabase
          .from('products')
          .update({
            title: optimization.title,
            description: optimization.description,
            tags: optimization.tags,
            seo_score: optimization.score
          })
          .eq('id', selectedProduct.id)
      }

      // Update state
      setOptimizedTitle(optimization.title)
      setOptimizedDescription(optimization.description)
      setOptimizedTags(optimization.tags)

      // Update products list
      setProducts(products.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, title: optimization.title, description: optimization.description, tags: optimization.tags, seoScore: optimization.score }
          : p
      ))

      // Update selected product
      setSelectedProduct({
        ...selectedProduct,
        title: optimization.title,
        description: optimization.description,
        tags: optimization.tags,
        seoScore: optimization.score
      })

      // Add to optimization history
      setOptimizationHistory([
        { 
          date: new Date().toISOString().split('T')[0], 
          product: selectedProduct.title,
          improvement: optimization.score - selectedProduct.seoScore
        },
        ...optimizationHistory
      ])

    } catch (error) {
      console.error('Optimization error:', error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleBulkOptimize = async () => {
    // In production, implement bulk optimization
    alert('Fonctionnalité de bulk optimization en cours de développement')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEO IA</h1>
          <p className="text-gray-600">
            Optimisez vos produits avec l'intelligence artificielle
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Rapport SEO
          </Button>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-orange-600"
            onClick={handleBulkOptimize}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Optimiser Tout
          </Button>
        </div>
      </div>

      {/* SEO Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score SEO Global</CardTitle>
            <Zap className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(selectedProduct?.seoScore || 0)}`}>
              {selectedProduct?.seoScore || 0}/100
            </div>
            <Progress value={selectedProduct?.seoScore || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mots-clés Ciblés</CardTitle>
            <Search className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {selectedProduct?.tags.length || 0}
            </div>
            <p className="text-xs text-gray-500">
              +3 suggérés par IA
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Langues Optimisées</CardTitle>
            <Globe className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              1
            </div>
            <p className="text-xs text-gray-500">
              sur 10 disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CTR Estimé</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              3.2%
            </div>
            <p className="text-xs text-gray-500">
              +0.8% avec optimisation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Product Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Sélectionner un Produit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={selectedProduct?.id} 
            onValueChange={(value) => {
              const product = products.find(p => p.id === value)
              if (product) setSelectedProduct(product)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un produit" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  <div className="flex items-center gap-3">
                    {product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-8 h-8 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-gray-500">Score SEO: {product.seoScore}%</p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Main SEO Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Optimizer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-600" />
              Optimiseur IA
            </CardTitle>
            <CardDescription>
              Générez du contenu SEO optimisé automatiquement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Langue cible</label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">🇫🇷 Français</SelectItem>
                  <SelectItem value="en">🇺🇸 Anglais</SelectItem>
                  <SelectItem value="es">🇪🇸 Espagnol</SelectItem>
                  <SelectItem value="de">🇩🇪 Allemand</SelectItem>
                  <SelectItem value="it">🇮🇹 Italien</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Titre actuel</label>
              <Input value={selectedProduct?.title} readOnly className="bg-gray-50" />
            </div>

            {optimizedTitle && (
              <div>
                <label className="text-sm font-medium mb-2 block text-green-600">
                  Titre optimisé IA
                </label>
                <div className="relative">
                  <Input value={optimizedTitle} readOnly className="pr-10" />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => copyToClipboard(optimizedTitle)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Description actuelle</label>
              <Textarea 
                value={selectedProduct?.description} 
                readOnly 
                className="bg-gray-50 h-20" 
              />
            </div>

            {optimizedDescription && (
              <div>
                <label className="text-sm font-medium mb-2 block text-green-600">
                  Description optimisée IA
                </label>
                <div className="relative">
                  <Textarea value={optimizedDescription} readOnly className="h-24 pr-10" />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-2"
                    onClick={() => copyToClipboard(optimizedDescription)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {optimizedTags.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block text-green-600">
                  Tags optimisés IA
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {optimizedTags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(optimizedTags.join(', '))}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copier tous les tags
                </Button>
              </div>
            )}

            <Button 
              onClick={handleOptimize} 
              disabled={isOptimizing || !selectedProduct}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600"
            >
              {isOptimizing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Optimisation en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Optimiser avec IA
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* SEO Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Analyse SEO Détaillée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="suggestions" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                <TabsTrigger value="keywords">Mots-clés</TabsTrigger>
                <TabsTrigger value="competitors">Concurrents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="suggestions" className="space-y-4">
                {seoSuggestions.map((suggestion, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">
                        {suggestion.type === 'title' ? 'Titre' : 
                         suggestion.type === 'description' ? 'Description' : 'Tags'}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        {suggestion.improvement}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Actuel:</p>
                        <p className="text-sm text-gray-800">{suggestion.current}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-600">Suggéré:</p>
                        <p className="text-sm text-gray-800">{suggestion.suggested}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Lightbulb className="w-3 h-3" />
                        {suggestion.reason}
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="keywords" className="space-y-4">
                {keywordSuggestions.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{keyword.keyword}</p>
                      <p className="text-sm text-gray-500">
                        {keyword.volume.toLocaleString()} recherches/mois
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        keyword.difficulty === 'Facile' ? 'default' :
                        keyword.difficulty === 'Moyen' ? 'secondary' : 'destructive'
                      }>
                        {keyword.difficulty}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">{keyword.cpc}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="competitors" className="space-y-4">
                {competitorAnalysis.map((competitor, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{competitor.competitor}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{competitor.price}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{competitor.rating}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-800 mb-3">{competitor.title}</p>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="font-medium text-green-600 mb-1">Forces:</p>
                        <ul className="space-y-1">
                          {competitor.strengths.map((strength, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-red-600 mb-1">Faiblesses:</p>
                        <ul className="space-y-1">
                          {competitor.weaknesses.map((weakness, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-red-500" />
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Optimization History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Historique d'Optimisations
          </CardTitle>
          <CardDescription>
            Vos dernières optimisations SEO
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizationHistory.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.product}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  +{item.improvement} points
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk SEO Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-purple-600" />
            Actions SEO en Masse
          </CardTitle>
          <CardDescription>
            Optimisez plusieurs produits simultanément
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Optimiser Tous les Titres
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Traduire en 5 Langues
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Générer Meta Tags
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SEO Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Ressources SEO
          </CardTitle>
          <CardDescription>
            Guides et astuces pour améliorer votre référencement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Guide</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">SEO E-commerce : Les Fondamentaux</h3>
              <p className="text-sm text-gray-600 mb-2">Maîtrisez les bases du référencement pour votre boutique en ligne.</p>
              <Button variant="outline" size="sm" className="w-full">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Lire le Guide
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-green-600" />
                <span className="font-medium">Checklist</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">25 Points à Vérifier pour vos Fiches Produit</h3>
              <p className="text-sm text-gray-600 mb-2">Checklist complète pour des fiches produit parfaitement optimisées.</p>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Télécharger PDF
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Webinaire</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Comment Battre vos Concurrents sur Google</h3>
              <p className="text-sm text-gray-600 mb-2">Stratégies avancées pour surpasser la concurrence en SEO.</p>
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                Voir le Replay
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
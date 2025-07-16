import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
  Sparkles
} from 'lucide-react'
import { mockProducts } from '@/lib/mock-data'

const seoSuggestions = [
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
  }
]

const keywordSuggestions = [
  { keyword: 'montre connectée sport', volume: 12000, difficulty: 'Moyen', cpc: '€1.20' },
  { keyword: 'smartwatch étanche', volume: 8500, difficulty: 'Facile', cpc: '€0.95' },
  { keyword: 'montre GPS running', volume: 6200, difficulty: 'Difficile', cpc: '€1.80' },
  { keyword: 'bracelet connecté fitness', volume: 15000, difficulty: 'Moyen', cpc: '€1.10' },
  { keyword: 'montre cardiofréquencemètre', volume: 3400, difficulty: 'Facile', cpc: '€0.85' }
]

const competitorAnalysis = [
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

export function SEOPage() {
  const [selectedProduct, setSelectedProduct] = useState(mockProducts[0])
  const [optimizedTitle, setOptimizedTitle] = useState('')
  const [optimizedDescription, setOptimizedDescription] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('fr')
  const [isOptimizing, setIsOptimizing] = useState(false)

  const handleOptimize = async () => {
    setIsOptimizing(true)
    // Simulate AI optimization
    setTimeout(() => {
      setOptimizedTitle('Montre Connectée Sport GPS Étanche - Autonomie 7 Jours - Moniteur Cardiaque Pro')
      setOptimizedDescription('Découvrez la montre connectée sport ultime avec GPS intégré, moniteur cardiaque précis et 50+ modes sportifs. Étanche IP68, autonomie exceptionnelle de 7 jours. Parfaite pour fitness, running, natation. Livraison gratuite sous 48h.')
      setIsOptimizing(false)
    }, 2000)
  }

  const seoScore = selectedProduct.seoScore
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
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
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
            <Sparkles className="w-4 h-4 mr-2" />
            Optimiser Tout
          </Button>
        </div>
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
          <Select value={selectedProduct.id} onValueChange={(value) => {
            const product = mockProducts.find(p => p.id === value)
            if (product) setSelectedProduct(product)
          }}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockProducts.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-8 h-8 rounded object-cover"
                    />
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

      {/* SEO Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score SEO Global</CardTitle>
            <Zap className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(seoScore)}`}>
              {seoScore}/100
            </div>
            <Progress value={seoScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mots-clés Ciblés</CardTitle>
            <Search className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {selectedProduct.tags.length}
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
              {selectedProduct.translations.length}
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
              <Input value={selectedProduct.title} readOnly className="bg-gray-50" />
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
                    onClick={() => navigator.clipboard.writeText(optimizedTitle)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Description actuelle</label>
              <Textarea 
                value={selectedProduct.description} 
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
                  <Textarea value={optimizedDescription} readOnly className="h-24" />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-2"
                    onClick={() => navigator.clipboard.writeText(optimizedDescription)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <Button 
              onClick={handleOptimize} 
              disabled={isOptimizing}
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
                        {suggestion.type === 'title' ? 'Titre' : 'Description'}
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
    </div>
  )
}
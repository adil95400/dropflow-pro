import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
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
  Upload,
  Link,
  FileText,
  Zap,
  Eye,
  Edit,
  Trash2,
  Download,
  Globe,
  Star,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  Camera,
  Sparkles,
  Bot,
  RefreshCw
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { importAliExpressProduct } from '@/lib/integrations/aliexpress'
import { importBigBuyProducts } from '@/lib/integrations/bigbuy'
import { SEOOptimizer } from '@/lib/ai/seo-optimizer'

interface ImportedProduct {
  id: string
  title: string
  originalTitle: string
  description: string
  price: number
  originalPrice: number
  supplier: string
  category: string
  images: string[]
  status: 'draft' | 'published' | 'error'
  seoScore: number
  translations: string[]
  sourceUrl?: string
  importedAt: string
}

interface ImportProgress {
  current: number
  total: number
  status: 'idle' | 'importing' | 'optimizing' | 'completed' | 'error'
  message: string
}

const suppliers = [
  { id: 'aliexpress', name: 'AliExpress', logo: '🛒', status: 'connected', color: 'bg-orange-100 text-orange-800' },
  { id: 'bigbuy', name: 'BigBuy', logo: '📦', status: 'connected', color: 'bg-blue-100 text-blue-800' },
  { id: 'eprolo', name: 'Eprolo', logo: '🚀', status: 'disconnected', color: 'bg-gray-100 text-gray-800' },
  { id: 'printify', name: 'Printify', logo: '🎨', status: 'connected', color: 'bg-purple-100 text-purple-800' },
  { id: 'spocket', name: 'Spocket', logo: '⚡', status: 'disconnected', color: 'bg-gray-100 text-gray-800' },
]

export function ImportPage() {
  const { user } = useAuth()
  const [importMethod, setImportMethod] = useState('url')
  const [importProgress, setImportProgress] = useState<ImportProgress>({
    current: 0,
    total: 0,
    status: 'idle',
    message: ''
  })
  const [importedProducts, setImportedProducts] = useState<ImportedProduct[]>([])
  const [productUrl, setProductUrl] = useState('')
  const [bulkUrls, setBulkUrls] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [targetLanguage, setTargetLanguage] = useState('fr')
  const [autoOptimize, setAutoOptimize] = useState(true)
  const [selectedSupplier, setSelectedSupplier] = useState('aliexpress')

  const seoOptimizer = new SEOOptimizer()

  const handleSingleImport = async () => {
    if (!productUrl.trim() || !user) return

    setImportProgress({
      current: 0,
      total: 1,
      status: 'importing',
      message: 'Import du produit en cours...'
    })

    try {
      let product
      
      if (productUrl.includes('aliexpress.com')) {
        product = await importAliExpressProduct(productUrl, user.id)
      } else {
        throw new Error('URL non supportée. Utilisez AliExpress, BigBuy ou Eprolo.')
      }

      setImportProgress({
        current: 0,
        total: 1,
        status: 'optimizing',
        message: 'Optimisation SEO avec IA...'
      })

      if (autoOptimize) {
        const optimization = await seoOptimizer.optimizeProduct(
          product.title,
          product.description,
          product.category,
          targetLanguage
        )

        await supabase
          .from('products')
          .update({
            title: optimization.title,
            description: optimization.description,
            tags: optimization.keywords,
            seo_score: optimization.score
          })
          .eq('id', product.id)

        product = { ...product, ...optimization }
      }

      const importedProduct: ImportedProduct = {
        id: product.id,
        title: product.title,
        originalTitle: product.original_title || product.title,
        description: product.description,
        price: product.price,
        originalPrice: product.original_price || product.price * 0.6,
        supplier: product.supplier,
        category: product.category,
        images: product.images || [],
        status: 'draft',
        seoScore: product.seo_score || 75,
        translations: [targetLanguage.toUpperCase()],
        sourceUrl: productUrl,
        importedAt: new Date().toISOString()
      }

      setImportedProducts(prev => [importedProduct, ...prev])
      setProductUrl('')

      setImportProgress({
        current: 1,
        total: 1,
        status: 'completed',
        message: 'Produit importé avec succès !'
      })

    } catch (error) {
      console.error('Import error:', error)
      setImportProgress({
        current: 0,
        total: 1,
        status: 'error',
        message: error instanceof Error ? error.message : 'Erreur lors de l\'import'
      })
    }
  }

  const handleBulkImport = async () => {
    const urls = bulkUrls.split('\n').filter(url => url.trim())
    if (urls.length === 0 || !user) return

    setImportProgress({
      current: 0,
      total: urls.length,
      status: 'importing',
      message: 'Import en masse en cours...'
    })

    const results: ImportedProduct[] = []

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i].trim()
      
      setImportProgress(prev => ({
        ...prev,
        current: i,
        message: `Import ${i + 1}/${urls.length}: ${url.substring(0, 50)}...`
      }))

      try {
        let product
        
        if (url.includes('aliexpress.com')) {
          product = await importAliExpressProduct(url, user.id)
        } else {
          continue // Skip unsupported URLs
        }

        if (autoOptimize) {
          const optimization = await seoOptimizer.optimizeProduct(
            product.title,
            product.description,
            product.category,
            targetLanguage
          )

          await supabase
            .from('products')
            .update({
              title: optimization.title,
              description: optimization.description,
              tags: optimization.keywords,
              seo_score: optimization.score
            })
            .eq('id', product.id)

          product = { ...product, ...optimization }
        }

        const importedProduct: ImportedProduct = {
          id: product.id,
          title: product.title,
          originalTitle: product.original_title || product.title,
          description: product.description,
          price: product.price,
          originalPrice: product.original_price || product.price * 0.6,
          supplier: product.supplier,
          category: product.category,
          images: product.images || [],
          status: 'draft',
          seoScore: product.seo_score || 75,
          translations: [targetLanguage.toUpperCase()],
          sourceUrl: url,
          importedAt: new Date().toISOString()
        }

        results.push(importedProduct)

      } catch (error) {
        console.error(`Error importing ${url}:`, error)
      }
    }

    setImportedProducts(prev => [...results, ...prev])
    setBulkUrls('')

    setImportProgress({
      current: urls.length,
      total: urls.length,
      status: 'completed',
      message: `${results.length}/${urls.length} produits importés avec succès !`
    })
  }

  const handleFileImport = async () => {
    if (!selectedFile || !user) return

    setImportProgress({
      current: 0,
      total: 100,
      status: 'importing',
      message: 'Lecture du fichier...'
    })

    try {
      const text = await selectedFile.text()
      let products: any[] = []

      if (selectedFile.name.endsWith('.csv')) {
        const lines = text.split('\n')
        const headers = lines[0].split(',')
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',')
          if (values.length >= headers.length) {
            const product: any = {}
            headers.forEach((header, index) => {
              product[header.trim()] = values[index]?.trim()
            })
            products.push(product)
          }
        }
      } else if (selectedFile.name.endsWith('.json')) {
        products = JSON.parse(text)
      }

      const results: ImportedProduct[] = []

      for (let i = 0; i < products.length; i++) {
        const productData = products[i]
        
        setImportProgress(prev => ({
          ...prev,
          current: (i / products.length) * 100,
          message: `Traitement ${i + 1}/${products.length}...`
        }))

        try {
          const { data: product, error } = await supabase
            .from('products')
            .insert({
              user_id: user.id,
              title: productData.title || productData.name,
              description: productData.description,
              price: parseFloat(productData.price) || 0,
              original_price: parseFloat(productData.original_price) || 0,
              supplier: productData.supplier || 'CSV Import',
              category: productData.category,
              images: productData.images ? productData.images.split(';') : [],
              status: 'draft'
            })
            .select()
            .single()

          if (error) throw error

          if (autoOptimize && product) {
            const optimization = await seoOptimizer.optimizeProduct(
              product.title,
              product.description,
              product.category,
              targetLanguage
            )

            await supabase
              .from('products')
              .update({
                title: optimization.title,
                description: optimization.description,
                tags: optimization.keywords,
                seo_score: optimization.score
              })
              .eq('id', product.id)
          }

          const importedProduct: ImportedProduct = {
            id: product.id,
            title: product.title,
            originalTitle: productData.title || productData.name,
            description: product.description,
            price: product.price,
            originalPrice: product.original_price,
            supplier: product.supplier,
            category: product.category,
            images: product.images || [],
            status: 'draft',
            seoScore: product.seo_score || 75,
            translations: [targetLanguage.toUpperCase()],
            importedAt: new Date().toISOString()
          }

          results.push(importedProduct)

        } catch (error) {
          console.error(`Error importing product ${i}:`, error)
        }
      }

      setImportedProducts(prev => [...results, ...prev])
      setSelectedFile(null)

      setImportProgress({
        current: 100,
        total: 100,
        status: 'completed',
        message: `${results.length}/${products.length} produits importés depuis le fichier !`
      })

    } catch (error) {
      console.error('File import error:', error)
      setImportProgress({
        current: 0,
        total: 100,
        status: 'error',
        message: 'Erreur lors de la lecture du fichier'
      })
    }
  }

  const handleImageImport = async () => {
    // Placeholder for image-based import using AI vision
    setImportProgress({
      current: 0,
      total: 1,
      status: 'importing',
      message: 'Analyse de l\'image avec IA...'
    })

    // Simulate AI image analysis
    setTimeout(() => {
      setImportProgress({
        current: 1,
        total: 1,
        status: 'completed',
        message: 'Fonctionnalité bientôt disponible !'
      })
    }, 2000)
  }

  const deleteProduct = async (productId: string) => {
    try {
      await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      setImportedProducts(prev => prev.filter(p => p.id !== productId))
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const publishProduct = async (productId: string) => {
    try {
      await supabase
        .from('products')
        .update({ status: 'published' })
        .eq('id', productId)

      setImportedProducts(prev => 
        prev.map(p => p.id === productId ? { ...p, status: 'published' } : p)
      )
    } catch (error) {
      console.error('Error publishing product:', error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Import Produits</h1>
          <p className="text-gray-600">
            Importez et optimisez vos produits avec l'IA
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Template CSV
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Exporter Catalogue
          </Button>
        </div>
      </div>

      {/* Suppliers Status */}
      <Card>
        <CardHeader>
          <CardTitle>Fournisseurs Connectés</CardTitle>
          <CardDescription>Gérez vos connexions aux différents fournisseurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {suppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="text-2xl mb-2">{supplier.logo}</div>
                <h3 className="font-medium text-sm">{supplier.name}</h3>
                <Badge
                  className={`mt-2 ${supplier.color}`}
                >
                  {supplier.status === 'connected' ? 'Connecté' : 'Déconnecté'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Import Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Importer des Produits</CardTitle>
            <CardDescription>Choisissez votre méthode d'importation</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={importMethod} onValueChange={setImportMethod}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="file">Fichier</TabsTrigger>
                <TabsTrigger value="bulk">Bulk</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product-url">URL du Produit</Label>
                  <Input
                    id="product-url"
                    placeholder="https://aliexpress.com/item/..."
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier-select">Fournisseur</Label>
                  <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un fournisseur" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.filter(s => s.status === 'connected').map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          <div className="flex items-center gap-2">
                            <span>{supplier.logo}</span>
                            {supplier.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleSingleImport} 
                  disabled={importProgress.status === 'importing' || !productUrl.trim()}
                  className="w-full"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Importer avec IA
                </Button>
              </TabsContent>

              <TabsContent value="file" className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Glissez-déposez votre fichier CSV/JSON ou cliquez pour sélectionner
                  </p>
                  <input
                    type="file"
                    accept=".csv,.json"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" size="sm" asChild>
                      <span>Choisir un fichier</span>
                    </Button>
                  </label>
                  {selectedFile && (
                    <p className="text-sm text-gray-600 mt-2">
                      Fichier sélectionné: {selectedFile.name}
                    </p>
                  )}
                </div>
                <Button 
                  onClick={handleFileImport} 
                  disabled={!selectedFile || importProgress.status === 'importing'}
                  className="w-full"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Importer Fichier
                </Button>
              </TabsContent>

              <TabsContent value="bulk" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bulk-urls">URLs (une par ligne)</Label>
                  <Textarea
                    id="bulk-urls"
                    placeholder="https://aliexpress.com/item/1&#10;https://aliexpress.com/item/2&#10;..."
                    rows={6}
                    value={bulkUrls}
                    onChange={(e) => setBulkUrls(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleBulkImport} 
                  disabled={importProgress.status === 'importing' || !bulkUrls.trim()}
                  className="w-full"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Import en Masse
                </Button>
              </TabsContent>

              <TabsContent value="image" className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Uploadez une image de produit pour l'analyser avec IA
                  </p>
                  <Button variant="outline" size="sm">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Choisir une image
                  </Button>
                </div>
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    Notre IA analysera l'image pour détecter le produit et générer automatiquement titre, description et tags SEO.
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={handleImageImport} 
                  disabled={importProgress.status === 'importing'}
                  className="w-full"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Analyser avec IA
                </Button>
              </TabsContent>
            </Tabs>

            {/* Progress Bar */}
            {importProgress.status !== 'idle' && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span>{importProgress.message}</span>
                  <span>
                    {importProgress.status === 'completed' ? '100%' : 
                     importProgress.total > 0 ? `${Math.round((importProgress.current / importProgress.total) * 100)}%` : '0%'}
                  </span>
                </div>
                <Progress 
                  value={importProgress.total > 0 ? (importProgress.current / importProgress.total) * 100 : 0} 
                  className={`h-2 ${
                    importProgress.status === 'error' ? 'bg-red-100' :
                    importProgress.status === 'completed' ? 'bg-green-100' : ''
                  }`}
                />
                {importProgress.status === 'error' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{importProgress.message}</AlertDescription>
                  </Alert>
                )}
                {importProgress.status === 'completed' && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{importProgress.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Optimization Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-600" />
              Optimisations IA
            </CardTitle>
            <CardDescription>Configuration des optimisations automatiques</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="target-language">Langue Cible</Label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une langue" />
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Titre SEO</h4>
                  <p className="text-sm text-muted-foreground">
                    Génération automatique de titres optimisés
                  </p>
                </div>
                <Badge variant="default">Activé</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Description Marketing</h4>
                  <p className="text-sm text-muted-foreground">
                    Réécriture des descriptions produit
                  </p>
                </div>
                <Badge variant="default">Activé</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Tags & Mots-clés</h4>
                  <p className="text-sm text-muted-foreground">
                    Génération de tags SEO pertinents
                  </p>
                </div>
                <Badge variant="default">Activé</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Traduction Multi-langue</h4>
                  <p className="text-sm text-muted-foreground">
                    Traduction automatique en 5 langues
                  </p>
                </div>
                <Badge variant="secondary">Pro</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Analyse Concurrentielle</h4>
                  <p className="text-sm text-muted-foreground">
                    Prix et positionnement optimal
                  </p>
                </div>
                <Badge variant="secondary">Pro</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Imported Products Table */}
      {importedProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Produits Importés ({importedProducts.length})</CardTitle>
            <CardDescription>Gérez vos produits importés et leurs optimisations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Fournisseur</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>SEO Score</TableHead>
                    <TableHead>Traductions</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.images[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate">
                              {product.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {product.originalTitle}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.supplier}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">€{product.price}</p>
                          <p className="text-sm text-gray-500">
                            Coût: €{product.originalPrice}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={product.seoScore} className="w-16 h-2" />
                          <span className="text-sm font-medium">
                            {product.seoScore}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {product.translations.map((lang) => (
                            <Badge key={lang} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={product.status === 'published' ? 'default' : 'secondary'}
                        >
                          {product.status === 'published' ? 'Publié' : 'Brouillon'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {product.status === 'draft' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => publishProduct(product.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
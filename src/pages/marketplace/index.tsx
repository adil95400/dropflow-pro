import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Store,
  Search,
  Filter,
  Globe,
  Star,
  ShoppingBag,
  Clock,
  Truck,
  Package,
  DollarSign,
  MoreHorizontal,
  Eye,
  ShoppingCart,
  ExternalLink,
  MessageSquare,
  CheckCircle,
  Zap,
  BarChart3,
  Building,
  Map,
  Tag,
  Percent,
  FileText,
  AlertTriangle
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { mockSuppliers } from '@/lib/mock-data'

interface Supplier {
  id: string
  name: string
  country: string
  logo: string
  verified: boolean
  rating: number
  productsCount: number
  categories: string[]
  processingTime: string
  shippingTime: string
  minimumOrder: number
  performance: {
    responseRate: number
    responseTime: string
    qualityRating: number
    onTimeDelivery: number
  }
  description: string
}

interface SupplierProduct {
  id: string
  name: string
  description: string
  price: number
  minQuantity: number
  discountTiers?: {
    quantity: number
    discount: number
  }[]
  stock: number
  images: string[]
  category: string
  specifications?: Record<string, string>
}

interface Category {
  id: string
  name: string
  count: number
}

interface Country {
  code: string
  name: string
  count: number
}

export function MarketplacePage() {
  const { user } = useAuth()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<SupplierProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [selectedVerification, setSelectedVerification] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [loading, setLoading] = useState(true)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<SupplierProduct | null>(null)
  const [activeTab, setActiveTab] = useState('suppliers')
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false)
  const [quoteForm, setQuoteForm] = useState({
    quantity: '100',
    message: '',
    contactName: '',
    contactEmail: '',
  })

  useEffect(() => {
    loadMarketplaceData()
  }, [user])

  const loadMarketplaceData = async () => {
    try {
      setLoading(true)

      // In production, load from Supabase
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('b2b_suppliers')
        .select('*')
        .order('rating', { ascending: false })

      if (suppliersError) throw suppliersError

      // If no suppliers in database, use mock data
      const suppliersToUse = suppliersData?.length ? suppliersData : mockSuppliers

      setSuppliers(suppliersToUse)

      // Load products
      const { data: productsData, error: productsError } = await supabase
        .from('b2b_products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (productsError) throw productsError

      // If no products in database, generate mock products
      const productsToUse = productsData?.length ? productsData : generateMockProducts(suppliersToUse)

      setProducts(productsToUse)

      // Generate categories from suppliers
      const allCategories = suppliersToUse.flatMap(s => s.categories || [])
      const categoryCounts: Record<string, number> = {}
      
      allCategories.forEach(category => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1
      })
      
      const categoriesList = Object.entries(categoryCounts).map(([name, count]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        count
      }))
      
      setCategories(categoriesList)

      // Generate countries from suppliers
      const countryCounts: Record<string, number> = {}
      
      suppliersToUse.forEach(supplier => {
        countryCounts[supplier.country] = (countryCounts[supplier.country] || 0) + 1
      })
      
      const countriesList = Object.entries(countryCounts).map(([name, count]) => ({
        code: name.substring(0, 2).toLowerCase(),
        name,
        count
      }))
      
      setCountries(countriesList)
    } catch (error) {
      console.error('Error loading marketplace data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMockProducts = (suppliers: Supplier[]): SupplierProduct[] => {
    const mockProducts: SupplierProduct[] = []
    
    const productTemplates = [
      {
        name: 'Montre Connectée Pro',
        description: 'Montre intelligente avec suivi fitness, notifications et autonomie 7 jours',
        price: 25.50,
        minQuantity: 10,
        category: 'Électronique',
        images: ['https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400']
      },
      {
        name: 'Écouteurs Bluetooth ANC',
        description: 'Écouteurs sans fil avec réduction de bruit active et autonomie 30h',
        price: 18.75,
        minQuantity: 20,
        category: 'Audio',
        images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400']
      },
      {
        name: 'Coque iPhone 15 Pro Antichoc',
        description: 'Protection premium avec coins renforcés et certification drop-test 3m',
        price: 4.99,
        minQuantity: 50,
        category: 'Accessoires',
        images: ['https://images.pexels.com/photos/4526413/pexels-photo-4526413.jpeg?auto=compress&cs=tinysrgb&w=400']
      },
      {
        name: 'Chargeur Sans Fil 15W',
        description: 'Station de charge rapide compatible tous smartphones Qi',
        price: 8.50,
        minQuantity: 30,
        category: 'Électronique',
        images: ['https://images.pexels.com/photos/4526413/pexels-photo-4526413.jpeg?auto=compress&cs=tinysrgb&w=400']
      },
      {
        name: 'Lampe LED Bureau Pliable',
        description: 'Lampe de bureau moderne avec 3 modes d\'éclairage et port USB',
        price: 12.99,
        minQuantity: 20,
        category: 'Maison',
        images: ['https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400']
      }
    ]
    
    // Generate 50 products
    for (let i = 0; i < 50; i++) {
      const template = productTemplates[i % productTemplates.length]
      const supplier = suppliers[i % suppliers.length]
      
      mockProducts.push({
        id: `prod-${i + 1}`,
        name: `${template.name} ${String.fromCharCode(65 + (i % 26))}`,
        description: template.description,
        price: template.price + (Math.random() * 10).toFixed(2),
        minQuantity: template.minQuantity,
        discountTiers: [
          { quantity: template.minQuantity * 2, discount: 5 },
          { quantity: template.minQuantity * 5, discount: 10 },
          { quantity: template.minQuantity * 10, discount: 15 }
        ],
        stock: 1000 + (i * 100),
        images: template.images,
        category: template.category,
        specifications: {
          'Material': 'Premium',
          'Origin': supplier.country,
          'Certification': 'CE, RoHS',
          'Customization': 'Available'
        }
      })
    }
    
    return mockProducts
  }

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
                           (supplier.categories && supplier.categories.some(c => 
                             c.toLowerCase() === selectedCategory.toLowerCase() ||
                             c.toLowerCase().includes(selectedCategory.toLowerCase())
                           ))
    const matchesCountry = selectedCountry === 'all' || supplier.country.toLowerCase() === selectedCountry.toLowerCase()
    const matchesVerification = selectedVerification === 'all' || 
                               (selectedVerification === 'verified' && supplier.verified) ||
                               (selectedVerification === 'unverified' && !supplier.verified)

    return matchesSearch && matchesCategory && matchesCountry && matchesVerification
  })

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'products':
        return b.productsCount - a.productsCount
      case 'delivery':
        return a.performance.onTimeDelivery - b.performance.onTimeDelivery
      default:
        return 0
    }
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price
      case 'price_desc':
        return b.price - a.price
      case 'moq_asc':
        return a.minQuantity - b.minQuantity
      case 'moq_desc':
        return b.minQuantity - a.minQuantity
      default:
        return 0
    }
  })

  const handleQuoteSubmit = async () => {
    if (!selectedSupplier || !user) return

    try {
      // In production, save to database
      const { data, error } = await supabase
        .from('b2b_quote_requests')
        .insert({
          user_id: user.id,
          supplier_id: selectedSupplier.id,
          quantity: parseInt(quoteForm.quantity),
          message: quoteForm.message,
          contact_name: quoteForm.contactName,
          contact_email: quoteForm.contactEmail,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Reset form and close dialog
      setQuoteForm({
        quantity: '100',
        message: '',
        contactName: '',
        contactEmail: ''
      })
      setIsQuoteDialogOpen(false)

      // Show success message
      alert('Demande de devis envoyée avec succès!')
    } catch (error) {
      console.error('Error submitting quote request:', error)
      alert('Erreur lors de l\'envoi de la demande de devis. Veuillez réessayer.')
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Marketplace B2B</h1>
          <p className="text-gray-600">
            Trouvez des fournisseurs fiables et des produits à forte marge
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Guide Fournisseurs
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
            <Store className="w-4 h-4 mr-2" />
            Devenir Fournisseur
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="suppliers">
            <Building className="w-4 h-4 mr-2" />
            Fournisseurs
          </TabsTrigger>
          <TabsTrigger value="products">
            <Package className="w-4 h-4 mr-2" />
            Produits
          </TabsTrigger>
        </TabsList>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="space-y-6">
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
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher un fournisseur..."
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
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les pays</SelectItem>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name} ({country.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedVerification} onValueChange={setSelectedVerification}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vérification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="verified">Vérifiés</SelectItem>
                    <SelectItem value="unverified">Non vérifiés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Suppliers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSuppliers.map((supplier) => (
              <Card 
                key={supplier.id} 
                className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => setSelectedSupplier(supplier)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{supplier.logo}</div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {supplier.name}
                          {supplier.verified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Globe className="w-3 h-3" />
                          {supplier.country}
                        </div>
                      </div>
                    </div>
                    <Badge variant={supplier.verified ? 'default' : 'secondary'}>
                      {supplier.verified ? 'Vérifié' : 'Standard'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {supplier.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Catégories</div>
                      <div className="font-medium">
                        {supplier.categories?.slice(0, 2).join(', ')}
                        {supplier.categories && supplier.categories.length > 2 && '...'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Produits</div>
                      <div className="font-medium">{supplier.productsCount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Délai traitement</div>
                      <div className="font-medium">{supplier.processingTime}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Commande min.</div>
                      <div className="font-medium">{supplier.minimumOrder} pcs</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">{supplier.rating}</span>
                      </div>
                      <span className="text-gray-500">Livraison à temps: {supplier.performance.onTimeDelivery}%</span>
                    </div>
                    <Progress value={supplier.performance.onTimeDelivery} className="h-1" />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedSupplier(supplier)
                        setIsQuoteDialogOpen(true)
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Demander un devis
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Filter products by this supplier
                        setActiveTab('products')
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Voir produits
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Supplier Details Dialog */}
          {selectedSupplier && (
            <Dialog open={!!selectedSupplier} onOpenChange={(open) => !open && setSelectedSupplier(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <span className="text-3xl">{selectedSupplier.logo}</span>
                    <div>
                      <span className="flex items-center gap-2">
                        {selectedSupplier.name}
                        {selectedSupplier.verified && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </span>
                      <span className="text-sm font-normal text-gray-500">
                        {selectedSupplier.country}
                      </span>
                    </div>
                  </DialogTitle>
                  <DialogDescription>
                    {selectedSupplier.description}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 mt-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Note Fournisseur
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="text-2xl font-bold">{selectedSupplier.rating}</span>
                          <span className="text-sm text-gray-500">/5</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Livraison à Temps
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">
                          {selectedSupplier.performance.onTimeDelivery}%
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Taux de Réponse
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">
                          {selectedSupplier.performance.responseRate}%
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Temps de Réponse
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">
                          {selectedSupplier.performance.responseTime}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Supplier Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Informations Fournisseur</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Pays</div>
                            <div className="font-medium">{selectedSupplier.country}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Catégories</div>
                            <div className="font-medium">
                              {selectedSupplier.categories?.join(', ')}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Délai de traitement</div>
                            <div className="font-medium">{selectedSupplier.processingTime}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Délai d'expédition</div>
                            <div className="font-medium">{selectedSupplier.shippingTime}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Commande minimum</div>
                            <div className="font-medium">{selectedSupplier.minimumOrder} pcs</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Produits</div>
                            <div className="font-medium">{selectedSupplier.productsCount.toLocaleString()}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Performance</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">Qualité des produits</span>
                              <span className="text-sm font-medium">{selectedSupplier.performance.qualityRating}/5</span>
                            </div>
                            <Progress value={selectedSupplier.performance.qualityRating * 20} className="h-2" />
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">Livraison à temps</span>
                              <span className="text-sm font-medium">{selectedSupplier.performance.onTimeDelivery}%</span>
                            </div>
                            <Progress value={selectedSupplier.performance.onTimeDelivery} className="h-2" />
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">Taux de réponse</span>
                              <span className="text-sm font-medium">{selectedSupplier.performance.responseRate}%</span>
                            </div>
                            <Progress value={selectedSupplier.performance.responseRate} className="h-2" />
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <Button 
                            className="w-full"
                            onClick={() => setIsQuoteDialogOpen(true)}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Demander un devis
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Supplier Products */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Produits Populaires</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {products
                          .filter(p => p.category === selectedSupplier.categories?.[0])
                          .slice(0, 3)
                          .map((product) => (
                            <div 
                              key={product.id} 
                              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <div className="h-40 overflow-hidden">
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-4">
                                <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h3>
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-orange-600">€{product.price.toFixed(2)}</span>
                                  <span className="text-xs text-gray-500">MOQ: {product.minQuantity}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                      
                      <div className="mt-4 text-center">
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setActiveTab('products')
                            setSearchQuery(selectedSupplier.name)
                          }}
                        >
                          Voir tous les produits
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Quote Request Dialog */}
          <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Demande de Devis</DialogTitle>
                <DialogDescription>
                  {selectedSupplier && `Envoyez une demande de devis à ${selectedSupplier.name}`}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Quantité</label>
                  <Input
                    type="number"
                    value={quoteForm.quantity}
                    onChange={(e) => setQuoteForm({...quoteForm, quantity: e.target.value})}
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Votre message</label>
                  <textarea
                    className="w-full border rounded-md p-2 min-h-[100px]"
                    value={quoteForm.message}
                    onChange={(e) => setQuoteForm({...quoteForm, message: e.target.value})}
                    placeholder="Décrivez votre demande, spécifications particulières, etc."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nom de contact</label>
                    <Input
                      value={quoteForm.contactName}
                      onChange={(e) => setQuoteForm({...quoteForm, contactName: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email de contact</label>
                    <Input
                      type="email"
                      value={quoteForm.contactEmail}
                      onChange={(e) => setQuoteForm({...quoteForm, contactEmail: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsQuoteDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleQuoteSubmit}>
                    Envoyer la demande
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
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
                <div className="relative md:col-span-2">
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
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price_asc">Prix croissant</SelectItem>
                    <SelectItem value="price_desc">Prix décroissant</SelectItem>
                    <SelectItem value="moq_asc">MOQ croissant</SelectItem>
                    <SelectItem value="moq_desc">MOQ décroissant</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analyse Marché
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <Card 
                key={product.id} 
                className="hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-bold text-orange-600">€{product.price.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">MOQ: {product.minQuantity}</div>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  
                  {product.discountTiers && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Remises par quantité:</div>
                      <div className="flex gap-2">
                        {product.discountTiers.map((tier, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tier.quantity}+ : -{tier.discount}%
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Détails
                    </Button>
                    <Button size="sm" className="flex-1">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Commander
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Product Details Dialog */}
          {selectedProduct && (
            <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedProduct.name}</DialogTitle>
                  <DialogDescription>
                    {selectedProduct.description}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 mt-4">
                  {/* Product Images and Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="border rounded-lg overflow-hidden h-64">
                        <img 
                          src={selectedProduct.images[0]} 
                          alt={selectedProduct.name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {selectedProduct.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {selectedProduct.images.slice(0, 4).map((image, index) => (
                            <div key={index} className="border rounded-lg overflow-hidden h-16">
                              <img 
                                src={image} 
                                alt={`${selectedProduct.name} ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-orange-600">€{selectedProduct.price.toFixed(2)}</div>
                          <Badge variant="outline">
                            Stock: {selectedProduct.stock}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          Commande minimum: {selectedProduct.minQuantity} pièces
                        </div>
                      </div>
                      
                      {selectedProduct.discountTiers && (
                        <div>
                          <h4 className="font-medium mb-2">Remises par quantité</h4>
                          <div className="space-y-2">
                            {selectedProduct.discountTiers.map((tier, index) => (
                              <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                                <div className="flex items-center gap-2">
                                  <Tag className="w-4 h-4 text-orange-500" />
                                  <span>{tier.quantity}+ pièces</span>
                                </div>
                                <Badge className="bg-orange-100 text-orange-800">
                                  -{tier.discount}%
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium mb-2">Spécifications</h4>
                        <div className="space-y-1">
                          {selectedProduct.specifications && Object.entries(selectedProduct.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-gray-500">{key}:</span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4 space-y-2">
                        <Button className="w-full">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Commander
                        </Button>
                        <Button variant="outline" className="w-full">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contacter le fournisseur
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Details Tabs */}
                  <Tabs defaultValue="details">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details">Détails</TabsTrigger>
                      <TabsTrigger value="shipping">Expédition</TabsTrigger>
                      <TabsTrigger value="customization">Personnalisation</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="space-y-4 pt-4">
                      <div>
                        <h4 className="font-medium mb-2">Description du produit</h4>
                        <p className="text-gray-600">
                          {selectedProduct.description}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Caractéristiques</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                          <li>Matériau premium et durable</li>
                          <li>Design ergonomique et moderne</li>
                          <li>Certifications internationales</li>
                          <li>Garantie fabricant</li>
                          <li>Support technique disponible</li>
                        </ul>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="shipping" className="space-y-4 pt-4">
                      <div>
                        <h4 className="font-medium mb-2">Options d'expédition</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4 text-blue-500" />
                              <span>Standard Shipping</span>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">€10.00</div>
                              <div className="text-xs text-gray-500">15-30 jours</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-2 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4 text-green-500" />
                              <span>Express Shipping</span>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">€25.00</div>
                              <div className="text-xs text-gray-500">7-14 jours</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Informations d'emballage</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Poids par unité:</span>
                            <span className="font-medium">0.5 kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Dimensions par unité:</span>
                            <span className="font-medium">20 × 15 × 5 cm</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Unités par carton:</span>
                            <span className="font-medium">50</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Dimensions carton:</span>
                            <span className="font-medium">60 × 40 × 30 cm</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="customization" className="space-y-4 pt-4">
                      <div>
                        <h4 className="font-medium mb-2">Options de personnalisation</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-purple-500" />
                              <span>Logo personnalisé</span>
                            </div>
                            <Badge variant="outline">Disponible</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between p-2 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-purple-500" />
                              <span>Emballage personnalisé</span>
                            </div>
                            <Badge variant="outline">Disponible</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between p-2 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-purple-500" />
                              <span>Couleurs personnalisées</span>
                            </div>
                            <Badge variant="outline">Disponible</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Exigences de personnalisation</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                          <li>MOQ pour personnalisation: 500 pièces</li>
                          <li>Délai supplémentaire: 5-7 jours</li>
                          <li>Formats acceptés: AI, PDF, EPS (300 DPI)</li>
                          <li>Échantillon requis avant production complète</li>
                        </ul>
                      </div>
                      
                      <div className="pt-2">
                        <Button variant="outline" className="w-full">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Demander un devis personnalisé
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>
      </Tabs>

      {/* Marketplace Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Insights Marketplace
          </CardTitle>
          <CardDescription>
            Tendances et opportunités du marché B2B
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Tendances Produits</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>Produits Écologiques</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">+45%</Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>Tech Portable</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">+32%</Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>Maison Intelligente</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">+28%</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Pays Émergents</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Map className="w-4 h-4 text-blue-500" />
                    <span>Vietnam</span>
                  </div>
                  <Badge variant="outline">Coûts -15%</Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Map className="w-4 h-4 text-blue-500" />
                    <span>Mexique</span>
                  </div>
                  <Badge variant="outline">Délais -30%</Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Map className="w-4 h-4 text-blue-500" />
                    <span>Inde</span>
                  </div>
                  <Badge variant="outline">Qualité +20%</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Alertes Marché</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Délais transport Asie</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">+10 jours</Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Hausse coûts matières</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">+8%</Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Nouvelles régulations EU</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">Juillet 2024</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marketplace Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Fournisseurs
            </CardTitle>
            <Building className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{suppliers.length}</div>
            <p className="text-xs text-gray-500">
              <span className="text-green-600">+12</span> ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Produits
            </CardTitle>
            <Package className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{products.length}</div>
            <p className="text-xs text-gray-500">
              <span className="text-green-600">+89</span> cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pays
            </CardTitle>
            <Globe className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{countries.length}</div>
            <p className="text-xs text-gray-500">
              Couverture mondiale
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Catégories
            </CardTitle>
            <Tag className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
            <p className="text-xs text-gray-500">
              Tous secteurs
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
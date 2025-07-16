import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  Package,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Download,
  Upload,
  Zap,
  TrendingUp,
  Star,
  Globe,
  DollarSign,
  ShoppingCart,
  AlertTriangle
} from 'lucide-react'
import { mockProducts } from '@/lib/mock-data'

const categories = ['Tous', 'Électronique', 'Audio', 'Accessoires', 'Maison', 'Mode', 'Sport']
const suppliers = ['Tous', 'AliExpress', 'BigBuy', 'Eprolo', 'Printify', 'Spocket']
const statuses = ['Tous', 'published', 'draft', 'out_of_stock']

const statusLabels = {
  published: 'Publié',
  draft: 'Brouillon',
  out_of_stock: 'Rupture'
}

const statusColors = {
  published: 'bg-green-100 text-green-800',
  draft: 'bg-yellow-100 text-yellow-800',
  out_of_stock: 'bg-red-100 text-red-800'
}

export function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [selectedSupplier, setSelectedSupplier] = useState('Tous')
  const [selectedStatus, setSelectedStatus] = useState('Tous')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')

  // Filter products based on search and filters
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.originalTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory
    const matchesSupplier = selectedSupplier === 'Tous' || product.supplier === selectedSupplier
    const matchesStatus = selectedStatus === 'Tous' || product.status === selectedStatus

    return matchesSearch && matchesCategory && matchesSupplier && matchesStatus
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy) {
      case 'title':
        aValue = a.title
        bValue = b.title
        break
      case 'price':
        aValue = a.price
        bValue = b.price
        break
      case 'orders':
        aValue = a.orders
        bValue = b.orders
        break
      case 'revenue':
        aValue = a.revenue
        bValue = b.revenue
        break
      case 'margin':
        aValue = a.margin
        bValue = b.margin
        break
      case 'seoScore':
        aValue = a.seoScore
        bValue = b.seoScore
        break
      default:
        aValue = a.createdAt
        bValue = b.createdAt
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const totalRevenue = filteredProducts.reduce((sum, product) => sum + product.revenue, 0)
  const totalOrders = filteredProducts.reduce((sum, product) => sum + product.orders, 0)
  const averageMargin = filteredProducts.reduce((sum, product) => sum + product.margin, 0) / filteredProducts.length
  const averageSEO = filteredProducts.reduce((sum, product) => sum + product.seoScore, 0) / filteredProducts.length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Produits</h1>
          <p className="text-gray-600">
            Gérez votre catalogue de {mockProducts.length} produits importés
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
            <Upload className="w-4 h-4 mr-2" />
            Importer Produits
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Revenus Total
            </CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              €{totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              {filteredProducts.length} produits actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Commandes Total
            </CardTitle>
            <ShoppingCart className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {totalOrders.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              Toutes plateformes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Marge Moyenne
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {averageMargin.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500">
              Profit par produit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Score SEO Moyen
            </CardTitle>
            <Zap className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {averageSEO.toFixed(0)}/100
            </div>
            <p className="text-xs text-gray-500">
              Optimisation IA
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
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

            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger>
                <SelectValue placeholder="Fournisseur" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier} value={supplier}>
                    {supplier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === 'Tous' ? status : statusLabels[status as keyof typeof statusLabels]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-')
              setSortBy(field)
              setSortOrder(order)
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at-desc">Plus récent</SelectItem>
                <SelectItem value="created_at-asc">Plus ancien</SelectItem>
                <SelectItem value="title-asc">Nom A-Z</SelectItem>
                <SelectItem value="title-desc">Nom Z-A</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="orders-desc">Plus de ventes</SelectItem>
                <SelectItem value="revenue-desc">Plus de revenus</SelectItem>
                <SelectItem value="margin-desc">Marge élevée</SelectItem>
                <SelectItem value="seoScore-desc">Meilleur SEO</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Catalogue Produits ({sortedProducts.length})
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Actions en lot
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-orange-500 to-orange-600">
                <Zap className="w-4 h-4 mr-2" />
                Optimiser SEO
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input type="checkbox" className="rounded" />
                  </TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Fournisseur</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Marge</TableHead>
                  <TableHead>Ventes</TableHead>
                  <TableHead>SEO</TableHead>
                  <TableHead>Langues</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell>
                      <input type="checkbox" className="rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">
                            {product.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {product.originalTitle}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {product.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{
                          product.supplier === 'AliExpress' ? '🛒' :
                          product.supplier === 'BigBuy' ? '📦' :
                          product.supplier === 'Eprolo' ? '🚀' :
                          product.supplier === 'Printify' ? '🎨' : '⚡'
                        }</span>
                        <span className="font-medium">{product.supplier}</span>
                      </div>
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
                        <div className={`w-2 h-2 rounded-full ${
                          product.margin > 150 ? 'bg-green-500' :
                          product.margin > 100 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className="font-medium">
                          {product.margin.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.orders.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          €{product.revenue.toLocaleString()}
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
                      <Badge className={statusColors[product.status as keyof typeof statusColors]}>
                        {statusLabels[product.status as keyof typeof statusLabels]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Zap className="mr-2 h-4 w-4" />
                            Optimiser SEO
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Globe className="mr-2 h-4 w-4" />
                            Traduire
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {sortedProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-600" />
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Optimiser SEO Tout
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Traduire Sélection
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Publier Brouillons
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exporter CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
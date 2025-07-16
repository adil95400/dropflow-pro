import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import {
  Package,
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
  Eye,
  Star,
  Zap,
  ArrowUp,
  ArrowDown,
  Clock,
  Globe,
  Target,
  Truck,
  AlertTriangle,
  Activity,
  Briefcase,
  Calendar,
  FileText
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  conversionRate: number
  revenueGrowth: number
  ordersGrowth: number
  productsGrowth: number
  conversionGrowth: number
}

interface SalesData {
  month: string
  revenue: number
  orders: number
  profit: number
}

interface TopProduct {
  name: string
  sales: number
  revenue: number
  margin: number
}

interface RecentActivity {
  id: string
  action: string
  product: string
  time: string
  type: 'import' | 'order' | 'seo' | 'review' | 'alert'
  icon: any
}

interface SupplierPerformance {
  name: string
  orders: number
  rating: number
  onTime: number
}

const COLORS = ['#F97316', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B']

export function DashboardPage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState('7d')
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    conversionRate: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    productsGrowth: 0,
    conversionGrowth: 0
  })
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [supplierPerformance, setSupplierPerformance] = useState<SupplierPerformance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [user, timeRange])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Load user stats
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single()

      // Load products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)

      // Load orders (simulated)
      const mockStats: DashboardStats = {
        totalRevenue: userStats?.revenue || 245678.90,
        totalOrders: userStats?.orders || 3456,
        totalProducts: products?.length || 1234,
        conversionRate: 3.2,
        revenueGrowth: 23.5,
        ordersGrowth: 12.3,
        productsGrowth: 8.7,
        conversionGrowth: -0.5
      }

      const mockSalesData: SalesData[] = [
        { month: 'Jan', revenue: 18500, orders: 245, profit: 8500 },
        { month: 'Fév', revenue: 22300, orders: 298, profit: 11200 },
        { month: 'Mar', revenue: 19800, orders: 267, profit: 9400 },
        { month: 'Avr', revenue: 25600, orders: 342, profit: 13800 },
        { month: 'Mai', revenue: 28900, orders: 389, profit: 16200 },
        { month: 'Jun', revenue: 32400, orders: 435, profit: 19800 }
      ]

      const mockTopProducts: TopProduct[] = [
        { name: 'Montre Connectée Sport Pro Max', sales: 1247, revenue: 112023.53, margin: 98.5 },
        { name: 'Écouteurs Bluetooth Premium ANC', sales: 892, revenue: 71351.08, margin: 146.1 },
        { name: 'Coque iPhone 15 Pro Transparente', sales: 2156, revenue: 53874.44, margin: 185.6 },
        { name: 'Chargeur Sans Fil Rapide 15W', sales: 743, revenue: 25992.57, margin: 184.5 },
        { name: 'Lampe LED Bureau Pliable', sales: 456, revenue: 22795.44, margin: 164.5 }
      ]

      const mockRecentActivity: RecentActivity[] = [
        { 
          id: '1',
          action: 'Nouveau produit importé', 
          product: 'Montre Sport Elite', 
          time: '2 min',
          type: 'import',
          icon: Package
        },
        { 
          id: '2',
          action: 'Commande trackée', 
          product: 'Écouteurs Pro Max', 
          time: '5 min',
          type: 'order',
          icon: Truck
        },
        { 
          id: '3',
          action: 'SEO optimisé', 
          product: 'Coque Premium iPhone', 
          time: '10 min',
          type: 'seo',
          icon: Zap
        },
        { 
          id: '4',
          action: 'Review générée', 
          product: 'Chargeur Rapide', 
          time: '15 min',
          type: 'review',
          icon: Star
        },
        { 
          id: '5',
          action: 'Stock faible détecté', 
          product: 'Lampe LED Bureau', 
          time: '1h',
          type: 'alert',
          icon: AlertTriangle
        }
      ]

      const mockSupplierPerformance: SupplierPerformance[] = [
        { name: 'AliExpress', orders: 1247, rating: 4.8, onTime: 94 },
        { name: 'BigBuy', orders: 892, rating: 4.9, onTime: 98 },
        { name: 'Eprolo', orders: 743, rating: 4.6, onTime: 92 },
        { name: 'Printify', orders: 456, rating: 4.7, onTime: 95 },
        { name: 'Spocket', orders: 234, rating: 4.5, onTime: 90 }
      ]

      setStats(mockStats)
      setSalesData(mockSalesData)
      setTopProducts(mockTopProducts)
      setRecentActivity(mockRecentActivity)
      setSupplierPerformance(mockSupplierPerformance)

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Bienvenue {user?.user_metadata?.full_name || user?.email}, voici votre activité dropshipping
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Rapport Complet
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
            <Zap className="w-4 h-4 mr-2" />
            Importer Produits
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {['24h', '7d', '30d', '90d'].map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Revenus Total
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="flex items-center text-sm">
              <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+{stats.revenueGrowth}%</span>
              <span className="text-gray-500 ml-1">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Commandes
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(stats.totalOrders)}
            </div>
            <div className="flex items-center text-sm">
              <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+{stats.ordersGrowth}%</span>
              <span className="text-gray-500 ml-1">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Produits Actifs
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(stats.totalProducts)}
            </div>
            <div className="flex items-center text-sm">
              <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+{stats.productsGrowth}%</span>
              <span className="text-gray-500 ml-1">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taux Conversion
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.conversionRate}%
            </div>
            <div className="flex items-center text-sm">
              <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-red-600">{stats.conversionGrowth}%</span>
              <span className="text-gray-500 ml-1">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Évolution des Revenus
            </CardTitle>
            <CardDescription>
              Revenus et commandes des 6 derniers mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value as number) : value,
                    name === 'revenue' ? 'Revenus' : 'Commandes'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#F97316" 
                  fill="#F97316" 
                  fillOpacity={0.1}
                />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              Top Produits
            </CardTitle>
            <CardDescription>
              Vos produits les plus performants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                      #{index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatNumber(product.sales)} ventes • Marge {product.margin.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {formatCurrency(product.revenue)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Activité Récente
            </CardTitle>
            <CardDescription>
              Dernières actions sur votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity.type === 'import' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'order' ? 'bg-green-100 text-green-600' :
                    activity.type === 'seo' ? 'bg-orange-100 text-orange-600' :
                    activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {activity.product}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Supplier Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-purple-600" />
              Performance Fournisseurs
            </CardTitle>
            <CardDescription>
              Évaluation de vos fournisseurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {supplierPerformance.map((supplier, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {supplier.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">
                        {supplier.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{formatNumber(supplier.orders)} commandes</span>
                    <span>{supplier.onTime}% à temps</span>
                  </div>
                  <Progress value={supplier.onTime} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-600" />
              Actions Rapides
            </CardTitle>
            <CardDescription>
              Raccourcis vers vos fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-blue-50">
                <Package className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium">Importer</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-green-50">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium">Tracker</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-yellow-50">
                <Star className="w-6 h-6 text-yellow-600" />
                <span className="text-sm font-medium">Winners</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-orange-50">
                <Zap className="w-6 h-6 text-orange-600" />
                <span className="text-sm font-medium">SEO IA</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            Vue d'Ensemble Performance
          </CardTitle>
          <CardDescription>
            Métriques détaillées de votre activité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="products">Produits</TabsTrigger>
              <TabsTrigger value="orders">Commandes</TabsTrigger>
              <TabsTrigger value="customers">Clients</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.totalRevenue / stats.totalOrders)}
                  </div>
                  <div className="text-sm text-gray-600">Panier Moyen</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.revenueGrowth}%</div>
                  <div className="text-sm text-gray-600">Croissance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">4.2</div>
                  <div className="text-sm text-gray-600">Note Moyenne</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">94%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="products">
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Statistiques produits détaillées disponibles dans la section Produits</p>
              </div>
            </TabsContent>
            
            <TabsContent value="orders">
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Analyse des commandes disponible dans la section Tracking</p>
              </div>
            </TabsContent>
            
            <TabsContent value="customers">
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Données clients disponibles dans la section CRM</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
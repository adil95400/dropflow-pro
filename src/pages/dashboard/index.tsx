import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
} from 'lucide-react'

const stats = [
  {
    title: 'Produits Importés',
    value: '2,847',
    change: '+12%',
    icon: Package,
    color: 'text-blue-600',
  },
  {
    title: 'Commandes Trackées',
    value: '1,234',
    change: '+8%',
    icon: TrendingUp,
    color: 'text-green-600',
  },
  {
    title: 'Revenus Générés',
    value: '€45,231',
    change: '+23%',
    icon: DollarSign,
    color: 'text-yellow-600',
  },
  {
    title: 'Clients Actifs',
    value: '892',
    change: '+5%',
    icon: Users,
    color: 'text-purple-600',
  },
]

const salesData = [
  { name: 'Jan', sales: 4000, orders: 240 },
  { name: 'Fév', sales: 3000, orders: 139 },
  { name: 'Mar', sales: 2000, orders: 980 },
  { name: 'Avr', sales: 2780, orders: 390 },
  { name: 'Mai', sales: 1890, orders: 480 },
  { name: 'Jun', sales: 2390, orders: 380 },
]

const topProducts = [
  { name: 'Montre Connectée', sales: 1234, revenue: '€12,340' },
  { name: 'Écouteurs Bluetooth', sales: 987, revenue: '€9,870' },
  { name: 'Coque iPhone', sales: 756, revenue: '€7,560' },
  { name: 'Chargeur Sans Fil', sales: 543, revenue: '€5,430' },
]

const recentActivity = [
  { action: 'Nouveau produit importé', product: 'Montre Sport', time: '2 min' },
  { action: 'Commande trackée', product: 'Écouteurs Pro', time: '5 min' },
  { action: 'Review générée', product: 'Coque Premium', time: '10 min' },
  { action: 'SEO optimisé', product: 'Chargeur Rapide', time: '15 min' },
]

export function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de votre activité dropshipping
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Voir Rapport
          </Button>
          <Button>
            <Zap className="w-4 h-4 mr-2" />
            Importer Produits
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> vs mois dernier
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des Ventes</CardTitle>
            <CardDescription>Revenus et commandes des 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" />
                <Bar dataKey="orders" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produits Top Ventes</CardTitle>
            <CardDescription>Vos produits les plus performants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.sales} ventes
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{product.revenue}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>Dernières actions sur votre compte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.product} • il y a {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>Raccourcis vers vos fonctionnalités principales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Package className="w-6 h-6" />
                <span className="text-sm">Importer</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <TrendingUp className="w-6 h-6" />
                <span className="text-sm">Tracker</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Star className="w-6 h-6" />
                <span className="text-sm">Winners</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Zap className="w-6 h-6" />
                <span className="text-sm">SEO IA</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
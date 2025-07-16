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
  Truck,
  Search,
  Filter,
  MapPin,
  Clock,
  Package,
  CheckCircle,
  AlertTriangle,
  Plane,
  Ship,
  Mail,
  Bell,
  Download,
  RefreshCw
} from 'lucide-react'
import { mockOrders, mockTrackingData } from '@/lib/mock-data'

const carriers = [
  { id: 'colissimo', name: 'Colissimo', logo: '📦', color: 'bg-blue-100 text-blue-800' },
  { id: 'chronopost', name: 'Chronopost', logo: '⚡', color: 'bg-orange-100 text-orange-800' },
  { id: 'dhl', name: 'DHL', logo: '🚚', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'ups', name: 'UPS', logo: '📮', color: 'bg-brown-100 text-brown-800' },
  { id: 'fedex', name: 'FedEx', logo: '✈️', color: 'bg-purple-100 text-purple-800' }
]

const statusConfig = {
  processing: { label: 'En préparation', color: 'bg-yellow-100 text-yellow-800', icon: Package },
  shipped: { label: 'Expédié', color: 'bg-blue-100 text-blue-800', icon: Truck },
  in_transit: { label: 'En transit', color: 'bg-orange-100 text-orange-800', icon: Plane },
  out_for_delivery: { label: 'En livraison', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Livré', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  exception: { label: 'Problème', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
}

const trackingStats = [
  {
    title: 'Commandes Trackées',
    value: '1,247',
    change: '+12%',
    icon: Package,
    color: 'text-blue-600'
  },
  {
    title: 'En Transit',
    value: '89',
    change: '+5%',
    icon: Truck,
    color: 'text-orange-600'
  },
  {
    title: 'Livrées Aujourd\'hui',
    value: '23',
    change: '+18%',
    icon: CheckCircle,
    color: 'text-green-600'
  },
  {
    title: 'Problèmes',
    value: '3',
    change: '-25%',
    icon: AlertTriangle,
    color: 'text-red-600'
  }
]

export function TrackingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCarrier, setSelectedCarrier] = useState('all')
  const [selectedTracking, setSelectedTracking] = useState<string | null>(null)

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    const matchesCarrier = selectedCarrier === 'all' || order.carrier === selectedCarrier

    return matchesSearch && matchesStatus && matchesCarrier
  })

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.processing
  }

  const trackingDetails = mockTrackingData.find(t => t.trackingNumber === selectedTracking)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tracking Commandes</h1>
          <p className="text-gray-600">
            Suivez vos {mockOrders.length} commandes en temps réel
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser Tout
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {trackingStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500">
                <span className="text-green-600">{stat.change}</span> vs mois dernier
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres de Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="N° commande, client, tracking..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="processing">En préparation</SelectItem>
                <SelectItem value="shipped">Expédié</SelectItem>
                <SelectItem value="in_transit">En transit</SelectItem>
                <SelectItem value="out_for_delivery">En livraison</SelectItem>
                <SelectItem value="delivered">Livré</SelectItem>
                <SelectItem value="exception">Problème</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
              <SelectTrigger>
                <SelectValue placeholder="Transporteur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous transporteurs</SelectItem>
                {carriers.map((carrier) => (
                  <SelectItem key={carrier.id} value={carrier.name}>
                    <div className="flex items-center gap-2">
                      <span>{carrier.logo}</span>
                      {carrier.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Commandes ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusConfig(order.status)
                const StatusIcon = statusInfo.icon
                
                return (
                  <div
                    key={order.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTracking === order.trackingNumber ? 'bg-orange-50 border-orange-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTracking(order.trackingNumber)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="w-4 h-4" />
                        <span className="font-medium text-gray-900">{order.id}</span>
                      </div>
                      <Badge className={statusInfo.color}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Client:</strong> {order.customerName}</p>
                      <p><strong>Produit:</strong> {order.product}</p>
                      <p><strong>Montant:</strong> €{order.amount}</p>
                      {order.trackingNumber && (
                        <p><strong>Tracking:</strong> {order.trackingNumber}</p>
                      )}
                      {order.carrier && (
                        <div className="flex items-center gap-2">
                          <strong>Transporteur:</strong>
                          <span className="flex items-center gap-1">
                            {carriers.find(c => c.name === order.carrier)?.logo}
                            {order.carrier}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tracking Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Détails du Suivi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trackingDetails ? (
              <div className="space-y-6">
                {/* Tracking Header */}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {trackingDetails.trackingNumber}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">
                      {carriers.find(c => c.name === trackingDetails.carrier)?.logo}
                    </span>
                    <span className="font-medium">{trackingDetails.carrier}</span>
                  </div>
                  <Badge className={getStatusConfig(trackingDetails.status).color}>
                    {getStatusConfig(trackingDetails.status).label}
                  </Badge>
                </div>

                {/* Current Status */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Position actuelle</p>
                  <p className="font-medium text-gray-900">{trackingDetails.currentLocation}</p>
                  {trackingDetails.estimatedDelivery && (
                    <p className="text-sm text-gray-500 mt-2">
                      Livraison estimée: {new Date(trackingDetails.estimatedDelivery).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Expédié</span>
                    <span>En transit</span>
                    <span>Livré</span>
                  </div>
                  <Progress 
                    value={
                      trackingDetails.status === 'delivered' ? 100 :
                      trackingDetails.status === 'out_for_delivery' ? 80 :
                      trackingDetails.status === 'in_transit' ? 50 :
                      trackingDetails.status === 'shipped' ? 20 : 10
                    } 
                  />
                </div>

                {/* Tracking Events */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Historique</h4>
                  <div className="space-y-3">
                    {trackingDetails.events.map((event, index) => {
                      const EventIcon = getStatusConfig(event.status).icon
                      return (
                        <div key={index} className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              index === 0 ? 'bg-orange-100' : 'bg-gray-100'
                            }`}>
                              <EventIcon className={`w-4 h-4 ${
                                index === 0 ? 'text-orange-600' : 'text-gray-600'
                              }`} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {event.description}
                            </p>
                            <p className="text-sm text-gray-500">
                              {event.location}
                            </p>
                            <p className="text-xs text-gray-400">
                              {event.date} à {event.time}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="w-4 h-4 mr-2" />
                    Notifier Client
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualiser
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Sélectionnez une commande pour voir les détails du suivi</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Carriers Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ship className="w-5 h-5" />
            Performance Transporteurs
          </CardTitle>
          <CardDescription>
            Analyse des performances de livraison par transporteur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {carriers.map((carrier) => {
              const carrierOrders = mockOrders.filter(o => o.carrier === carrier.name)
              const deliveredOrders = carrierOrders.filter(o => o.status === 'delivered')
              const onTimeRate = carrierOrders.length > 0 ? (deliveredOrders.length / carrierOrders.length) * 100 : 0
              
              return (
                <div key={carrier.id} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">{carrier.logo}</div>
                  <h3 className="font-medium text-gray-900 mb-2">{carrier.name}</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Commandes</p>
                      <p className="font-semibold">{carrierOrders.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Taux livraison</p>
                      <p className="font-semibold text-green-600">{onTimeRate.toFixed(0)}%</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
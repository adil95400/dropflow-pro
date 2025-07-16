import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  RefreshCw,
  Eye,
  Copy,
  ExternalLink
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { TrackingService } from '@/lib/tracking/17track'

interface TrackingOrder {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  product: string
  quantity: number
  amount: number
  status: 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception'
  trackingNumber: string | null
  carrier: string | null
  orderDate: string
  deliveryDate: string | null
  supplier: string
  estimatedDelivery?: string
  currentLocation?: string
}

interface TrackingEvent {
  date: string
  time: string
  location: string
  description: string
  status: string
}

interface TrackingDetails {
  trackingNumber: string
  carrier: string
  status: string
  currentLocation: string
  estimatedDelivery?: string
  events: TrackingEvent[]
}

const carriers = [
  { id: 'colissimo', name: 'Colissimo', logo: '📦', color: 'bg-blue-100 text-blue-800' },
  { id: 'chronopost', name: 'Chronopost', logo: '⚡', color: 'bg-orange-100 text-orange-800' },
  { id: 'dhl', name: 'DHL', logo: '🚚', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'ups', name: 'UPS', logo: '📮', color: 'bg-brown-100 text-brown-800' },
  { id: 'fedex', name: 'FedEx', logo: '✈️', color: 'bg-purple-100 text-purple-800' },
  { id: 'laposte', name: 'La Poste', logo: '📬', color: 'bg-blue-100 text-blue-800' },
  { id: 'mondial-relay', name: 'Mondial Relay', logo: '🏪', color: 'bg-green-100 text-green-800' }
]

const statusConfig = {
  processing: { label: 'En préparation', color: 'bg-yellow-100 text-yellow-800', icon: Package },
  shipped: { label: 'Expédié', color: 'bg-blue-100 text-blue-800', icon: Truck },
  in_transit: { label: 'En transit', color: 'bg-orange-100 text-orange-800', icon: Plane },
  out_for_delivery: { label: 'En livraison', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Livré', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  exception: { label: 'Problème', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
}

export function TrackingPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<TrackingOrder[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCarrier, setSelectedCarrier] = useState('all')
  const [selectedTracking, setSelectedTracking] = useState<string | null>(null)
  const [trackingDetails, setTrackingDetails] = useState<TrackingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [trackingLoading, setTrackingLoading] = useState(false)

  const trackingService = new TrackingService(import.meta.env.VITE_17TRACK_API_KEY || '')

  useEffect(() => {
    loadOrders()
  }, [user])

  useEffect(() => {
    if (selectedTracking) {
      loadTrackingDetails(selectedTracking)
    }
  }, [selectedTracking])

  const loadOrders = async () => {
    if (!user) return

    try {
      setLoading(true)

      // In a real app, this would come from your orders table
      const mockOrders: TrackingOrder[] = [
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          customerName: 'Marie Dubois',
          customerEmail: 'marie.dubois@email.com',
          product: 'Montre Connectée Sport Pro Max',
          quantity: 1,
          amount: 89.99,
          status: 'delivered',
          trackingNumber: 'FR123456789',
          carrier: 'Colissimo',
          orderDate: '2024-01-15',
          deliveryDate: '2024-01-22',
          supplier: 'AliExpress',
          currentLocation: 'Livré - Paris 75001'
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          customerName: 'Pierre Martin',
          customerEmail: 'pierre.martin@email.com',
          product: 'Écouteurs Bluetooth Premium ANC',
          quantity: 2,
          amount: 159.98,
          status: 'in_transit',
          trackingNumber: 'FR987654321',
          carrier: 'Chronopost',
          orderDate: '2024-01-18',
          deliveryDate: null,
          supplier: 'BigBuy',
          estimatedDelivery: '2024-01-25',
          currentLocation: 'Lyon Centre de Tri'
        },
        {
          id: '3',
          orderNumber: 'ORD-2024-003',
          customerName: 'Sophie Laurent',
          customerEmail: 'sophie.laurent@email.com',
          product: 'Coque iPhone 15 Pro Transparente',
          quantity: 1,
          amount: 24.99,
          status: 'processing',
          trackingNumber: null,
          carrier: null,
          orderDate: '2024-01-20',
          deliveryDate: null,
          supplier: 'Eprolo'
        },
        {
          id: '4',
          orderNumber: 'ORD-2024-004',
          customerName: 'Thomas Durand',
          customerEmail: 'thomas.durand@email.com',
          product: 'Chargeur Sans Fil Rapide 15W',
          quantity: 1,
          amount: 34.99,
          status: 'out_for_delivery',
          trackingNumber: 'DHL456789123',
          carrier: 'DHL',
          orderDate: '2024-01-19',
          deliveryDate: null,
          supplier: 'Printify',
          estimatedDelivery: '2024-01-24',
          currentLocation: 'En cours de livraison - Marseille'
        },
        {
          id: '5',
          orderNumber: 'ORD-2024-005',
          customerName: 'Julie Moreau',
          customerEmail: 'julie.moreau@email.com',
          product: 'Lampe LED Bureau Pliable',
          quantity: 1,
          amount: 49.99,
          status: 'exception',
          trackingNumber: 'UPS789123456',
          carrier: 'UPS',
          orderDate: '2024-01-17',
          deliveryDate: null,
          supplier: 'Spocket',
          currentLocation: 'Problème de livraison - Destinataire absent'
        }
      ]

      setOrders(mockOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTrackingDetails = async (trackingNumber: string) => {
    setTrackingLoading(true)

    try {
      // Mock tracking details - in production, use 17track API
      const mockTrackingDetails: TrackingDetails = {
        trackingNumber,
        carrier: 'Colissimo',
        status: 'delivered',
        currentLocation: 'Livré - Paris 75001',
        estimatedDelivery: '2024-01-22',
        events: [
          {
            date: '2024-01-22',
            time: '14:30',
            location: 'Paris 75001',
            description: 'Colis livré au destinataire',
            status: 'delivered'
          },
          {
            date: '2024-01-22',
            time: '09:15',
            location: 'Paris Centre de Tri',
            description: 'En cours de livraison',
            status: 'out_for_delivery'
          },
          {
            date: '2024-01-21',
            time: '18:45',
            location: 'Paris Centre de Tri',
            description: 'Arrivé au centre de tri',
            status: 'in_transit'
          },
          {
            date: '2024-01-20',
            time: '12:00',
            location: 'Roissy CDG',
            description: 'Colis arrivé en France',
            status: 'in_transit'
          },
          {
            date: '2024-01-18',
            time: '08:30',
            location: 'Guangzhou, Chine',
            description: 'Colis expédié',
            status: 'shipped'
          }
        ]
      }

      setTrackingDetails(mockTrackingDetails)
    } catch (error) {
      console.error('Error loading tracking details:', error)
    } finally {
      setTrackingLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    const matchesCarrier = selectedCarrier === 'all' || order.carrier === selectedCarrier

    return matchesSearch && matchesStatus && matchesCarrier
  })

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.processing
  }

  const getCarrierInfo = (carrierName: string | null) => {
    return carriers.find(c => c.name === carrierName) || { logo: '📦', color: 'bg-gray-100 text-gray-800' }
  }

  const copyTrackingNumber = (trackingNumber: string) => {
    navigator.clipboard.writeText(trackingNumber)
  }

  const refreshTracking = async (trackingNumber: string) => {
    if (selectedTracking === trackingNumber) {
      await loadTrackingDetails(trackingNumber)
    }
  }

  const notifyCustomer = async (orderId: string) => {
    // In production, this would send an email/SMS to the customer
    console.log('Notifying customer for order:', orderId)
  }

  const trackingStats = {
    totalOrders: orders.length,
    inTransit: orders.filter(o => o.status === 'in_transit').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    problems: orders.filter(o => o.status === 'exception').length
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
          <h1 className="text-3xl font-bold text-gray-900">Tracking Commandes</h1>
          <p className="text-gray-600">
            Suivez vos {orders.length} commandes en temps réel
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Commandes Trackées
            </CardTitle>
            <Package className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{trackingStats.totalOrders}</div>
            <p className="text-xs text-gray-500">
              Total des commandes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En Transit
            </CardTitle>
            <Truck className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{trackingStats.inTransit}</div>
            <p className="text-xs text-gray-500">
              En cours de livraison
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Livrées Aujourd'hui
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{trackingStats.delivered}</div>
            <p className="text-xs text-gray-500">
              Livraisons réussies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Problèmes
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{trackingStats.problems}</div>
            <p className="text-xs text-gray-500">
              Nécessitent attention
            </p>
          </CardContent>
        </Card>
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

      {/* Orders and Tracking Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Commandes ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusConfig(order.status)
                const carrierInfo = getCarrierInfo(order.carrier)
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
                        <span className="font-medium text-gray-900">{order.orderNumber}</span>
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
                        <div className="flex items-center gap-2">
                          <strong>Tracking:</strong>
                          <span className="font-mono">{order.trackingNumber}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              copyTrackingNumber(order.trackingNumber!)
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                      {order.carrier && (
                        <div className="flex items-center gap-2">
                          <strong>Transporteur:</strong>
                          <span className="flex items-center gap-1">
                            <span>{carrierInfo.logo}</span>
                            {order.carrier}
                          </span>
                        </div>
                      )}
                      {order.currentLocation && (
                        <p><strong>Position:</strong> {order.currentLocation}</p>
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
            {trackingDetails && selectedTracking ? (
              <div className="space-y-6">
                {/* Tracking Header */}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {trackingDetails.trackingNumber}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">
                      {getCarrierInfo(trackingDetails.carrier).logo}
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
                  <div className="space-y-3 max-h-64 overflow-y-auto">
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => notifyCustomer(selectedTracking)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Notifier Client
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => refreshTracking(selectedTracking)}
                    disabled={trackingLoading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${trackingLoading ? 'animate-spin' : ''}`} />
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

      {/* Carriers Performance */}
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
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {carriers.map((carrier) => {
              const carrierOrders = orders.filter(o => o.carrier === carrier.name)
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
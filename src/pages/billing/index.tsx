import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  CreditCard,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Zap,
  Package,
  BarChart3,
  Users,
  Globe,
  Lock,
  CreditCardIcon,
  FileText,
  ExternalLink,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Info,
  Shield
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { subscriptionPlans } from '@/lib/stripe/subscription'

interface Subscription {
  id: string
  plan: string
  status: string
  currentPeriodEnd: number
  priceId: string
  cancelAtPeriodEnd: boolean
  paymentMethod?: {
    brand: string
    last4: string
  }
  createdAt: string
}

interface Invoice {
  id: string
  number: string
  amount: number
  status: string
  date: string
  pdfUrl: string
}

interface UsageMetrics {
  products: {
    used: number
    limit: number
    percentage: number
  }
  stores: {
    used: number
    limit: number
    percentage: number
  }
  apiCalls: {
    used: number
    limit: number
    percentage: number
  }
}

export function BillingPage() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [processingAction, setProcessingAction] = useState(false)

  useEffect(() => {
    if (user) {
      loadBillingData()
    }
  }, [user])

  const loadBillingData = async () => {
    try {
      setLoading(true)

      // Load subscription data
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        console.error('Error loading subscription:', subscriptionError)
      }

      // If no subscription in database, create mock data
      const mockSubscription: Subscription = {
        id: 'sub_1234567890',
        plan: 'professional',
        status: 'active',
        currentPeriodEnd: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
        priceId: 'price_professional_monthly',
        cancelAtPeriodEnd: false,
        paymentMethod: {
          brand: 'visa',
          last4: '4242'
        },
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days ago
      }

      setSubscription(subscriptionData || mockSubscription)

      // Load invoices
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })

      if (invoiceError) {
        console.error('Error loading invoices:', invoiceError)
      }

      // If no invoices in database, create mock data
      const mockInvoices: Invoice[] = [
        {
          id: 'in_1234567890',
          number: 'INV-001',
          amount: 79.00,
          status: 'paid',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          pdfUrl: '#'
        },
        {
          id: 'in_0987654321',
          number: 'INV-002',
          amount: 79.00,
          status: 'paid',
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
          pdfUrl: '#'
        },
        {
          id: 'in_1357924680',
          number: 'INV-003',
          amount: 79.00,
          status: 'paid',
          date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
          pdfUrl: '#'
        }
      ]

      setInvoices(invoiceData || mockInvoices)

      // Load usage metrics
      const { data: usageData, error: usageError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (usageError && usageError.code !== 'PGRST116') {
        console.error('Error loading usage metrics:', usageError)
      }

      // If no usage metrics in database, create mock data
      const mockUsageMetrics: UsageMetrics = {
        products: {
          used: 1234,
          limit: 10000,
          percentage: 12.34
        },
        stores: {
          used: 3,
          limit: 10,
          percentage: 30
        },
        apiCalls: {
          used: 8750,
          limit: 50000,
          percentage: 17.5
        }
      }

      setUsageMetrics(usageData ? {
        products: {
          used: usageData.products || 0,
          limit: 10000,
          percentage: ((usageData.products || 0) / 10000) * 100
        },
        stores: {
          used: usageData.shops || 0,
          limit: 10,
          percentage: ((usageData.shops || 0) / 10) * 100
        },
        apiCalls: {
          used: 8750, // Mock data as this might not be tracked in user_stats
          limit: 50000,
          percentage: 17.5
        }
      } : mockUsageMetrics)

    } catch (error) {
      console.error('Error loading billing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    try {
      setProcessingAction(true)
      
      // In production, this would call a Supabase Edge Function to cancel the subscription
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      // Update subscription status
      setSubscription(prev => prev ? {
        ...prev,
        cancelAtPeriodEnd: true
      } : null)
      
      setShowCancelConfirm(false)
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      alert('Une erreur est survenue lors de l\'annulation de votre abonnement. Veuillez réessayer.')
    } finally {
      setProcessingAction(false)
    }
  }

  const handleResumeSubscription = async () => {
    try {
      setProcessingAction(true)
      
      // In production, this would call a Supabase Edge Function to resume the subscription
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      // Update subscription status
      setSubscription(prev => prev ? {
        ...prev,
        cancelAtPeriodEnd: false
      } : null)
    } catch (error) {
      console.error('Error resuming subscription:', error)
      alert('Une erreur est survenue lors de la reprise de votre abonnement. Veuillez réessayer.')
    } finally {
      setProcessingAction(false)
    }
  }

  const handleUpdatePaymentMethod = async () => {
    try {
      setProcessingAction(true)
      
      // In production, this would redirect to Stripe Customer Portal
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      alert('Dans une version de production, vous seriez redirigé vers le portail client Stripe pour mettre à jour votre moyen de paiement.')
    } catch (error) {
      console.error('Error updating payment method:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setProcessingAction(false)
    }
  }

  const handleUpgradeDowngrade = async (planId: string) => {
    try {
      setProcessingAction(true)
      
      // In production, this would call a Supabase Edge Function to change the subscription
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      // Update subscription status
      setSubscription(prev => prev ? {
        ...prev,
        plan: planId,
        priceId: `price_${planId}_monthly`
      } : null)
      
      alert(`Votre abonnement a été mis à jour vers le plan ${planId.charAt(0).toUpperCase() + planId.slice(1)}.`)
    } catch (error) {
      console.error('Error changing subscription:', error)
      alert('Une erreur est survenue lors du changement de votre abonnement. Veuillez réessayer.')
    } finally {
      setProcessingAction(false)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getCurrentPlan = () => {
    return subscriptionPlans.find(plan => plan.id === subscription?.plan) || subscriptionPlans[0]
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-gray-900">Facturation</h1>
          <p className="text-gray-600">
            Gérez votre abonnement et vos factures
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Historique Complet
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
            <CreditCard className="w-4 h-4 mr-2" />
            Gérer le Paiement
          </Button>
        </div>
      </div>

      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-600" />
            Abonnement Actuel
          </CardTitle>
          <CardDescription>
            Détails de votre abonnement DropFlow Pro
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {subscription ? (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Plan {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                  </h3>
                  <p className="text-gray-600">
                    {subscription.status === 'active' ? (
                      subscription.cancelAtPeriodEnd ? 
                        `Votre abonnement sera annulé le ${formatDate(subscription.currentPeriodEnd)}` :
                        `Renouvellement automatique le ${formatDate(subscription.currentPeriodEnd)}`
                    ) : (
                      'Abonnement inactif'
                    )}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCancelConfirm(true)}
                      disabled={processingAction}
                    >
                      Annuler
                    </Button>
                  )}
                  
                  {subscription.status === 'active' && subscription.cancelAtPeriodEnd && (
                    <Button 
                      onClick={handleResumeSubscription}
                      disabled={processingAction}
                    >
                      {processingAction ? 'Traitement...' : 'Reprendre l\'abonnement'}
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline"
                    onClick={handleUpdatePaymentMethod}
                    disabled={processingAction}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Mettre à jour le paiement
                  </Button>
                </div>
              </div>
              
              {showCancelConfirm && (
                <Alert className="bg-red-50 border-red-200 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="flex flex-col gap-4">
                    <p>
                      Êtes-vous sûr de vouloir annuler votre abonnement ? Vous aurez toujours accès à votre plan jusqu'au {formatDate(subscription.currentPeriodEnd)}.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleCancelSubscription}
                        disabled={processingAction}
                      >
                        {processingAction ? 'Traitement...' : 'Confirmer l\'annulation'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowCancelConfirm(false)}
                        disabled={processingAction}
                      >
                        Annuler
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Payment Method */}
              <div>
                <h3 className="text-lg font-medium mb-4">Moyen de paiement</h3>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-12 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
                    {subscription.paymentMethod?.brand === 'visa' ? 'VISA' : 
                     subscription.paymentMethod?.brand === 'mastercard' ? 'MC' : 
                     subscription.paymentMethod?.brand === 'amex' ? 'AMEX' : 'CARD'}
                  </div>
                  <div>
                    <p className="font-medium">
                      {subscription.paymentMethod?.brand.charAt(0).toUpperCase() + subscription.paymentMethod?.brand.slice(1)} se terminant par {subscription.paymentMethod?.last4}
                    </p>
                    <p className="text-sm text-gray-500">Expiration: 12/2025</p>
                  </div>
                </div>
              </div>
              
              {/* Usage Metrics */}
              {usageMetrics && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Utilisation du plan</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Produits importés</span>
                        <span className="text-sm font-medium">{usageMetrics.products.used.toLocaleString()} / {usageMetrics.products.limit.toLocaleString()}</span>
                      </div>
                      <Progress value={usageMetrics.products.percentage} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Boutiques connectées</span>
                        <span className="text-sm font-medium">{usageMetrics.stores.used} / {usageMetrics.stores.limit}</span>
                      </div>
                      <Progress value={usageMetrics.stores.percentage} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Appels API</span>
                        <span className="text-sm font-medium">{usageMetrics.apiCalls.used.toLocaleString()} / {usageMetrics.apiCalls.limit.toLocaleString()}</span>
                      </div>
                      <Progress value={usageMetrics.apiCalls.percentage} className="h-2" />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Aucun abonnement actif</h3>
              <p className="text-gray-500 mb-4">Choisissez un plan pour accéder à toutes les fonctionnalités de DropFlow Pro</p>
              <Button>
                Voir les plans
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plans Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Nos Plans
          </CardTitle>
          <CardDescription>
            Comparez les différents plans et choisissez celui qui vous convient
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => {
              const isCurrentPlan = subscription?.plan === plan.id
              
              return (
                <Card key={plan.id} className={`border-2 ${isCurrentPlan ? 'border-orange-500' : 'border-gray-200'}`}>
                  <CardHeader>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>
                      {plan.id === 'starter' ? 'Parfait pour débuter' : 
                       plan.id === 'professional' ? 'Pour les dropshippers sérieux' : 
                       'Pour les équipes et agences'}
                    </CardDescription>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">€{plan.price}</span>
                      <span className="text-gray-500">/mois</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="pt-4">
                      {isCurrentPlan ? (
                        <Button variant="outline" className="w-full" disabled>
                          Plan actuel
                        </Button>
                      ) : (
                        <Button 
                          className={`w-full ${plan.id === 'professional' ? 'bg-gradient-to-r from-orange-500 to-orange-600' : ''}`}
                          onClick={() => handleUpgradeDowngrade(plan.id)}
                          disabled={processingAction}
                        >
                          {processingAction ? 'Traitement...' : (
                            subscription?.plan ? (
                              plan.price > getCurrentPlan().price ? 'Upgrader' : 'Downgrader'
                            ) : 'Choisir ce plan'
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Historique de Facturation
          </CardTitle>
          <CardDescription>
            Vos factures et paiements récents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>€{invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'open' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {invoice.status === 'paid' ? 'Payée' :
                         invoice.status === 'open' ? 'En attente' :
                         'Échec'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          PDF
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune facture disponible</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-purple-600" />
            Questions Fréquentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
              <h3 className="font-medium">Comment changer mon plan ?</h3>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
              <h3 className="font-medium">Quand suis-je facturé ?</h3>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
              <h3 className="font-medium">Comment obtenir une facture pour ma comptabilité ?</h3>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
              <h3 className="font-medium">Puis-je changer de moyen de paiement ?</h3>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
              <h3 className="font-medium">Comment annuler mon abonnement ?</h3>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div className="pt-4 text-center">
            <p className="text-sm text-gray-500 mb-2">Besoin d'aide supplémentaire ?</p>
            <Button variant="outline">
              Contacter le support
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security & Privacy */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
        <Lock className="w-4 h-4" />
        <span>Paiements sécurisés via Stripe</span>
        <span>•</span>
        <Shield className="w-4 h-4" />
        <span>Conforme RGPD</span>
      </div>
    </div>
  )
}
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Users,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  Building,
  Calendar,
  Target,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  BarChart3,
  Edit,
  Trash2,
  ExternalLink,
  MessageSquare,
  UserPlus
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { ZapierIntegration } from '@/lib/crm/zapier'

interface CRMLead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
  source: string
  value: number
  lastContact?: string
  nextFollowUp?: string
  notes?: string
  tags: string[]
  createdAt: string
}

const statusConfig = {
  new: { label: 'Nouveau', color: 'bg-blue-100 text-blue-800', icon: Plus },
  contacted: { label: 'Contacté', color: 'bg-yellow-100 text-yellow-800', icon: Mail },
  qualified: { label: 'Qualifié', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  proposal: { label: 'Proposition', color: 'bg-purple-100 text-purple-800', icon: Target },
  won: { label: 'Gagné', color: 'bg-emerald-100 text-emerald-800', icon: TrendingUp },
  lost: { label: 'Perdu', color: 'bg-red-100 text-red-800', icon: AlertCircle }
}

const leadSources = [
  'Website',
  'Facebook Ads',
  'Google Ads',
  'LinkedIn',
  'Referral',
  'Cold Email',
  'Trade Show',
  'Content Marketing',
  'SEO',
  'YouTube'
]

const availableTags = [
  'hot-lead',
  'demo-requested',
  'beginner',
  'enterprise',
  'high-value',
  'agency',
  'aliexpress',
  'shopify',
  'urgent',
  'follow-up'
]

export function CRMPage() {
  const { user } = useAuth()
  const [leads, setLeads] = useState<CRMLead[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedSource, setSelectedSource] = useState('all')
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<CRMLead | null>(null)
  const [loading, setLoading] = useState(true)
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: '',
    value: '',
    notes: '',
    tags: [] as string[]
  })

  const zapier = new ZapierIntegration(import.meta.env.VITE_ZAPIER_WEBHOOK_URL || '')

  useEffect(() => {
    loadLeads()
  }, [user])

  const loadLeads = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Mock data - in production, load from Supabase
      const mockLeads: CRMLead[] = [
        {
          id: '1',
          name: 'Jean Dupont',
          email: 'jean.dupont@email.com',
          phone: '+33 6 12 34 56 78',
          company: 'TechStart SAS',
          status: 'qualified',
          source: 'Website',
          value: 2500,
          lastContact: '2024-01-20',
          nextFollowUp: '2024-01-25',
          notes: 'Intéressé par le plan Professional. Demande démo personnalisée.',
          tags: ['hot-lead', 'demo-requested'],
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Marie Leroy',
          email: 'marie.leroy@boutique.fr',
          phone: '+33 6 98 76 54 32',
          company: 'Boutique Mode',
          status: 'contacted',
          source: 'Facebook Ads',
          value: 1200,
          lastContact: '2024-01-18',
          nextFollowUp: '2024-01-22',
          notes: 'Dropshipper débutant, cherche solution simple pour import AliExpress.',
          tags: ['beginner', 'aliexpress'],
          createdAt: '2024-01-10'
        },
        {
          id: '3',
          name: 'Pierre Martin',
          email: 'p.martin@ecommerce.com',
          phone: '+33 6 45 67 89 12',
          company: 'E-commerce Solutions',
          status: 'proposal',
          source: 'LinkedIn',
          value: 5000,
          lastContact: '2024-01-22',
          nextFollowUp: '2024-01-26',
          notes: 'Agence e-commerce, besoin plan Enterprise pour 10+ clients.',
          tags: ['agency', 'enterprise', 'high-value'],
          createdAt: '2024-01-12'
        },
        {
          id: '4',
          name: 'Sophie Dubois',
          email: 'sophie.dubois@startup.io',
          phone: '+33 6 11 22 33 44',
          company: 'Startup Innovation',
          status: 'new',
          source: 'Google Ads',
          value: 800,
          lastContact: undefined,
          nextFollowUp: '2024-01-24',
          notes: 'Nouvelle startup, budget limité mais potentiel de croissance.',
          tags: ['beginner', 'follow-up'],
          createdAt: '2024-01-23'
        },
        {
          id: '5',
          name: 'Thomas Bernard',
          email: 'thomas@fashionstore.com',
          phone: '+33 6 55 66 77 88',
          company: 'Fashion Store',
          status: 'won',
          source: 'Referral',
          value: 3200,
          lastContact: '2024-01-21',
          nextFollowUp: undefined,
          notes: 'Client converti ! Abonnement Professional activé.',
          tags: ['shopify', 'high-value'],
          createdAt: '2024-01-08'
        }
      ]

      setLeads(mockLeads)
    } catch (error) {
      console.error('Error loading leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.company?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus
    const matchesSource = selectedSource === 'all' || lead.source === selectedSource

    return matchesSearch && matchesStatus && matchesSource
  })

  const stats = {
    totalLeads: leads.length,
    qualifiedLeads: leads.filter(l => l.status === 'qualified').length,
    wonLeads: leads.filter(l => l.status === 'won').length,
    totalValue: leads.reduce((sum, lead) => sum + lead.value, 0),
    conversionRate: leads.length > 0 ? (leads.filter(l => l.status === 'won').length / leads.length * 100).toFixed(1) : '0'
  }

  const handleAddLead = async () => {
    if (!user) return

    try {
      const lead: CRMLead = {
        id: Date.now().toString(),
        ...newLead,
        value: parseFloat(newLead.value) || 0,
        status: 'new',
        lastContact: undefined,
        nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      setLeads([lead, ...leads])
      
      // Trigger Zapier webhook
      try {
        await zapier.onNewLead(lead, user.id)
      } catch (error) {
        console.error('Zapier webhook error:', error)
      }

      setNewLead({
        name: '',
        email: '',
        phone: '',
        company: '',
        source: '',
        value: '',
        notes: '',
        tags: []
      })
      setIsAddLeadOpen(false)
    } catch (error) {
      console.error('Error adding lead:', error)
    }
  }

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: newStatus as any, lastContact: new Date().toISOString().split('T')[0] }
        : lead
    ))
  }

  const deleteLead = async (leadId: string) => {
    setLeads(leads.filter(lead => lead.id !== leadId))
  }

  const addTag = (tag: string) => {
    if (!newLead.tags.includes(tag)) {
      setNewLead({
        ...newLead,
        tags: [...newLead.tags, tag]
      })
    }
  }

  const removeTag = (tag: string) => {
    setNewLead({
      ...newLead,
      tags: newLead.tags.filter(t => t !== tag)
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
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
          <h1 className="text-3xl font-bold text-gray-900">CRM</h1>
          <p className="text-gray-600">
            Gérez vos prospects et clients efficacement
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Rapport
          </Button>
          <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau lead</DialogTitle>
                <DialogDescription>
                  Créez un nouveau prospect dans votre pipeline CRM
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nom complet</label>
                    <Input
                      value={newLead.name}
                      onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={newLead.email}
                      onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                      placeholder="jean@exemple.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Téléphone</label>
                    <Input
                      value={newLead.phone}
                      onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Entreprise</label>
                    <Input
                      value={newLead.company}
                      onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                      placeholder="Nom de l'entreprise"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Source</label>
                    <Select value={newLead.source} onValueChange={(value) => setNewLead({...newLead, source: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une source" />
                      </SelectTrigger>
                      <SelectContent>
                        {leadSources.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Valeur estimée (€)</label>
                    <Input
                      type="number"
                      value={newLead.value}
                      onChange={(e) => setNewLead({...newLead, value: e.target.value})}
                      placeholder="2500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newLead.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.filter(tag => !newLead.tags.includes(tag)).map((tag) => (
                      <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => addTag(tag)}>
                        + {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Notes</label>
                  <Textarea
                    value={newLead.notes}
                    onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                    placeholder="Notes sur le prospect..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsAddLeadOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddLead}>
                    Créer le lea
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Leads
            </CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalLeads}</div>
            <p className="text-xs text-gray-500">
              +12% ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Leads Qualifiés
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.qualifiedLeads}</div>
            <p className="text-xs text-gray-500">
              {((stats.qualifiedLeads / stats.totalLeads) * 100).toFixed(1)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Valeur Pipeline
            </CardTitle>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.totalValue)}
            </div>
            <p className="text-xs text-gray-500">
              Potentiel total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taux Conversion
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</div>
            <p className="text-xs text-gray-500">
              Leads → Clients
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un lead..."
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
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <config.icon className="w-4 h-4" />
                      {config.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger>
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sources</SelectItem>
                {leadSources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Automation Zapier
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Pipeline CRM ({filteredLeads.length})
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter CSV
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-orange-500 to-orange-600">
                <Mail className="w-4 h-4 mr-2" />
                Email Campagne
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Valeur</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernier Contact</TableHead>
                  <TableHead>Suivi</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => {
                  const statusInfo = statusConfig[lead.status]
                  const StatusIcon = statusInfo.icon
                  
                  return (
                    <TableRow key={lead.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Phone className="w-3 h-3" />
                              {lead.phone}
                            </div>
                          )}
                          {lead.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {lead.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {lead.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{lead.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{lead.company}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{lead.source}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">
                          {formatCurrency(lead.value)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lead.status}
                          onValueChange={(value) => updateLeadStatus(lead.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <div className="flex items-center gap-2">
                              <StatusIcon className="w-3 h-3" />
                              <span className="text-xs">{statusInfo.label}</span>
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusConfig).map(([key, config]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  <config.icon className="w-3 h-3" />
                                  {config.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-3 h-3" />
                          {lead.lastContact ? new Date(lead.lastContact).toLocaleDateString('fr-FR') : 'Jamais'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString('fr-FR') : 'Non planifié'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteLead(lead.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline par Statut</CardTitle>
            <CardDescription>
              Répartition de vos leads par étape
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(statusConfig).map(([status, config]) => {
                const count = leads.filter(l => l.status === status).length
                const percentage = leads.length > 0 ? (count / leads.length * 100).toFixed(1) : '0'
                const value = leads.filter(l => l.status === status).reduce((sum, l) => sum + l.value, 0)
                
                return (
                  <div key={status} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <config.icon className="w-4 h-4" />
                        <span className="font-medium">{config.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{count} leads</span>
                        <Badge variant="outline">{percentage}%</Badge>
                      </div>
                    </div>
                    <Progress value={parseFloat(percentage)} className="h-2" />
                    <div className="text-right text-sm text-gray-600">
                      Valeur: {formatCurrency(value)}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>
              Automatisations et intégrations CRM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Mail className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium">Email Séquence</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Zap className="w-6 h-6 text-orange-600" />
                <span className="text-sm font-medium">Zapier Trigger</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Calendar className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium">Planifier RDV</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-medium">Rapport Détaillé</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activités Récentes</CardTitle>
            <CardDescription>
              Dernières interactions avec vos leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Email envoyé à Pierre Martin</p>
                  <p className="text-sm text-gray-500">Proposition commerciale pour plan Enterprise</p>
                  <p className="text-xs text-gray-400">Aujourd'hui, 10:23</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Appel avec Marie Leroy</p>
                  <p className="text-sm text-gray-500">Démo produit réalisée, très intéressée</p>
                  <p className="text-xs text-gray-400">Hier, 15:45</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Nouveau lead créé</p>
                  <p className="text-sm text-gray-500">Sophie Dubois de Startup Innovation</p>
                  <p className="text-xs text-gray-400">23 Jan, 09:12</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Message reçu de Jean Dupont</p>
                  <p className="text-sm text-gray-500">Questions sur l'intégration Shopify</p>
                  <p className="text-xs text-gray-400">22 Jan, 16:30</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intégrations CRM</CardTitle>
            <CardDescription>
              Connectez vos outils préférés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#FF4A00] rounded-lg flex items-center justify-center text-white font-bold">
                    Z
                  </div>
                  <div>
                    <p className="font-medium">Zapier</p>
                    <p className="text-xs text-gray-500">Automatisations</p>
                  </div>
                </div>
                <Badge variant="default">Connecté</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#36C5F0] rounded-lg flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div>
                    <p className="font-medium">Slack</p>
                    <p className="text-xs text-gray-500">Notifications</p>
                  </div>
                </div>
                <Badge variant="default">Connecté</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#FF5A00] rounded-lg flex items-center justify-center text-white font-bold">
                    H
                  </div>
                  <div>
                    <p className="font-medium">HubSpot</p>
                    <p className="text-xs text-gray-500">CRM</p>
                  </div>
                </div>
                <Badge variant="secondary">Connecter</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#0066FF] rounded-lg flex items-center justify-center text-white font-bold">
                    C
                  </div>
                  <div>
                    <p className="font-medium">Calendly</p>
                    <p className="text-xs text-gray-500">Rendez-vous</p>
                  </div>
                </div>
                <Badge variant="secondary">Connecter</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
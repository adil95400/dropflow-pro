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
  BarChart3
} from 'lucide-react'

const mockLeads = [
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
  }
]

const statusConfig = {
  new: { label: 'Nouveau', color: 'bg-blue-100 text-blue-800', icon: Plus },
  contacted: { label: 'Contacté', color: 'bg-yellow-100 text-yellow-800', icon: Mail },
  qualified: { label: 'Qualifié', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  proposal: { label: 'Proposition', color: 'bg-purple-100 text-purple-800', icon: Target },
  won: { label: 'Gagné', color: 'bg-emerald-100 text-emerald-800', icon: TrendingUp },
  lost: { label: 'Perdu', color: 'bg-red-100 text-red-800', icon: AlertCircle }
}

const leadSources = ['Website', 'Facebook Ads', 'Google Ads', 'LinkedIn', 'Referral', 'Cold Email']

export function CRMPage() {
  const [leads, setLeads] = useState(mockLeads)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedSource, setSelectedSource] = useState('all')
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false)
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: '',
    value: '',
    notes: ''
  })

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus
    const matchesSource = selectedSource === 'all' || lead.source === selectedSource

    return matchesSearch && matchesStatus && matchesSource
  })

  const stats = {
    totalLeads: leads.length,
    qualifiedLeads: leads.filter(l => l.status === 'qualified').length,
    totalValue: leads.reduce((sum, lead) => sum + lead.value, 0),
    conversionRate: (leads.filter(l => l.status === 'won').length / leads.length * 100).toFixed(1)
  }

  const handleAddLead = () => {
    const lead = {
      id: Date.now().toString(),
      ...newLead,
      value: parseFloat(newLead.value) || 0,
      status: 'new' as const,
      lastContact: new Date().toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags: [],
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    setLeads([lead, ...leads])
    setNewLead({
      name: '',
      email: '',
      phone: '',
      company: '',
      source: '',
      value: '',
      notes: ''
    })
    setIsAddLeadOpen(false)
  }

  const updateLeadStatus = (leadId: string, newStatus: string) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: newStatus as any, lastContact: new Date().toISOString().split('T')[0] }
        : lead
    ))
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
            <DialogContent>
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
                    Créer le lead
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
              €{stats.totalValue.toLocaleString()}
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
                    {config.label}
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
                  const statusInfo = statusConfig[lead.status as keyof typeof statusConfig]
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
                          €{lead.value.toLocaleString()}
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
                          {new Date(lead.lastContact).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {new Date(lead.nextFollowUp).toLocaleDateString('fr-FR')}
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
                const percentage = (count / leads.length * 100).toFixed(1)
                
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <config.icon className="w-4 h-4" />
                      <span className="font-medium">{config.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{count} leads</span>
                      <Badge variant="outline">{percentage}%</Badge>
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
    </div>
  )
}
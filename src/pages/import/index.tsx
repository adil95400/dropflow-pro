import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
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
} from 'lucide-react'

const suppliers = [
  { id: 'aliexpress', name: 'AliExpress', logo: '🛒', status: 'connected' },
  { id: 'bigbuy', name: 'BigBuy', logo: '📦', status: 'connected' },
  { id: 'eprolo', name: 'Eprolo', logo: '🚀', status: 'disconnected' },
  { id: 'printify', name: 'Printify', logo: '🎨', status: 'connected' },
  { id: 'spocket', name: 'Spocket', logo: '⚡', status: 'disconnected' },
]

const importedProducts = [
  {
    id: 1,
    title: 'Montre Connectée Sport Pro',
    originalTitle: 'Smart Watch Sport Pro',
    supplier: 'AliExpress',
    price: '€29.99',
    originalPrice: '$24.99',
    status: 'draft',
    seoScore: 85,
    translations: ['FR', 'EN', 'ES'],
  },
  {
    id: 2,
    title: 'Écouteurs Bluetooth Premium',
    originalTitle: 'Bluetooth Earbuds Premium',
    supplier: 'BigBuy',
    price: '€49.99',
    originalPrice: '€39.99',
    status: 'published',
    seoScore: 92,
    translations: ['FR', 'EN'],
  },
]

export function ImportPage() {
  const [importMethod, setImportMethod] = useState('url')
  const [importProgress, setImportProgress] = useState(0)
  const [isImporting, setIsImporting] = useState(false)

  const handleImport = async () => {
    setIsImporting(true)
    // Simulate import progress
    for (let i = 0; i <= 100; i += 10) {
      setImportProgress(i)
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    setIsImporting(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Import Produits</h1>
          <p className="text-muted-foreground">
            Importez et optimisez vos produits avec l'IA
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Exporter Catalogue
        </Button>
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
                className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="text-2xl mb-2">{supplier.logo}</div>
                <h3 className="font-medium text-sm">{supplier.name}</h3>
                <Badge
                  variant={supplier.status === 'connected' ? 'default' : 'secondary'}
                  className="mt-2"
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="file">Fichier</TabsTrigger>
                <TabsTrigger value="bulk">Bulk</TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product-url">URL du Produit</Label>
                  <Input
                    id="product-url"
                    placeholder="https://aliexpress.com/item/..."
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-language">Langue Cible</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">Anglais</SelectItem>
                      <SelectItem value="es">Espagnol</SelectItem>
                      <SelectItem value="de">Allemand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="file" className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Glissez-déposez votre fichier CSV/XML ou cliquez pour sélectionner
                  </p>
                  <Button variant="outline" size="sm">
                    Choisir un fichier
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="bulk" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bulk-urls">URLs (une par ligne)</Label>
                  <Textarea
                    id="bulk-urls"
                    placeholder="https://aliexpress.com/item/1&#10;https://aliexpress.com/item/2&#10;..."
                    rows={6}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {isImporting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Import en cours...</span>
                  <span>{importProgress}%</span>
                </div>
                <Progress value={importProgress} />
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleImport} disabled={isImporting} className="flex-1">
                <Zap className="w-4 h-4 mr-2" />
                {isImporting ? 'Import en cours...' : 'Importer avec IA'}
              </Button>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Prévisualiser
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optimisations IA</CardTitle>
            <CardDescription>Configuration des optimisations automatiques</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
      </div>

      {/* Imported Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Produits Importés</CardTitle>
          <CardDescription>Gérez vos produits importés et leurs optimisations</CardDescription>
        </CardHeader>
        <CardContent>
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
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.originalTitle}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{product.supplier}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.price}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.originalPrice}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={product.seoScore} className="w-16" />
                      <span className="text-sm">{product.seoScore}%</span>
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
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
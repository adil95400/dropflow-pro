import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ProductsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes Produits</h1>
        <p className="text-muted-foreground">
          Gérez votre catalogue de produits importés
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catalogue Produits</CardTitle>
          <CardDescription>
            Votre catalogue de produits sera affiché ici
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Cette page sera développée avec la gestion complète des produits.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
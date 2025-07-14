import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function MarketplacePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Marketplace B2B</h1>
        <p className="text-muted-foreground">
          Plateforme privée pour fournisseurs
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marketplace Privée</CardTitle>
          <CardDescription>
            La marketplace B2B sera affichée ici
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Cette page sera développée avec une marketplace privée pour les fournisseurs.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
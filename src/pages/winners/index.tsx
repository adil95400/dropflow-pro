import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function WinnersPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Produits Gagnants</h1>
        <p className="text-muted-foreground">
          Découvrez les produits tendances avec l'IA
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détection de Winners</CardTitle>
          <CardDescription>
            L'analyse des produits gagnants sera affichée ici
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Cette page sera développée avec l'intelligence artificielle pour détecter les produits gagnants.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
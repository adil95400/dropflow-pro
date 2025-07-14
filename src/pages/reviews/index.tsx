import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ReviewsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="text-muted-foreground">
          Gérez les avis clients automatiquement
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des Avis</CardTitle>
          <CardDescription>
            Le système de gestion des avis sera affiché ici
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Cette page sera développée avec l'intégration Loox, Judge.me et autres plateformes d'avis.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
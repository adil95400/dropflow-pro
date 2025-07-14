import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function SEOPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SEO IA</h1>
        <p className="text-muted-foreground">
          Optimisez vos produits avec l'intelligence artificielle
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Optimisation SEO</CardTitle>
          <CardDescription>
            Les outils d'optimisation SEO seront affichés ici
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Cette page sera développée avec les outils d'optimisation SEO alimentés par l'IA.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
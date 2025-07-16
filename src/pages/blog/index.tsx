import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function BlogPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Blog IA</h1>
        <p className="text-muted-foreground">
          Générez du contenu automatiquement avec l'IA
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Génération de Contenu</CardTitle>
          <CardDescription>
            Le générateur de blog IA sera affiché ici
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Cette page sera développée avec la génération automatique de contenu blog.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function CRMPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">CRM</h1>
        <p className="text-muted-foreground">
          Gérez vos clients et prospects
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion Client</CardTitle>
          <CardDescription>
            Le système CRM sera affiché ici
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Cette page sera développée avec un CRM complet pour la gestion des clients.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
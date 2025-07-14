import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function BillingPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Facturation</h1>
        <p className="text-muted-foreground">
          Gérez votre abonnement et vos factures
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Abonnement</CardTitle>
          <CardDescription>
            La gestion de facturation sera affichée ici
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Cette page sera développée avec l'intégration Stripe pour la facturation.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
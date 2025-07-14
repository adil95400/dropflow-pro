import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function TrackingPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tracking Commandes</h1>
        <p className="text-muted-foreground">
          Suivez vos commandes en temps réel
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suivi des Commandes</CardTitle>
          <CardDescription>
            Le système de tracking sera affiché ici
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Cette page sera développée avec le tracking complet via 17track.net.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
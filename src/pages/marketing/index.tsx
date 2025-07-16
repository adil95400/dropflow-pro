import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function MarketingPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Marketing</h1>
        <p className="text-muted-foreground">
          Automatisez vos campagnes marketing
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automation Marketing</CardTitle>
          <CardDescription>
            Les outils marketing seront affichés ici
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Cette page sera développée avec l'intégration Klaviyo, Mailchimp, Omnisend.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
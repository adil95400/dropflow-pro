import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Star, Globe, Clock, Package, Truck, ExternalLink } from 'lucide-react'

interface SupplierCardProps {
  supplier: {
    id: string
    name: string
    country?: string
    logo?: string
    verified?: boolean
    rating?: number
    productsCount?: number
    categories?: string[]
    processingTime?: string
    shippingTime?: string
    minimumOrder?: number
    performance?: {
      responseRate?: number
      responseTime?: string
      qualityRating?: number
      onTimeDelivery?: number
    }
    description?: string
  }
  onConnect?: (id: string) => void
  onView?: (id: string) => void
  isConnected?: boolean
  isSelected?: boolean
  variant?: 'default' | 'compact' | 'grid'
  className?: string
}

export function SupplierCard({
  supplier,
  onConnect,
  onView,
  isConnected = false,
  isSelected = false,
  variant = 'default',
  className,
}: SupplierCardProps) {
  const getLogoDisplay = () => {
    if (supplier.logo) {
      if (supplier.logo.startsWith('http')) {
        return <img src={supplier.logo} alt={supplier.name} className="w-12 h-12 object-contain" />
      } else {
        return <span className="text-2xl">{supplier.logo}</span>
      }
    }
    return <Package className="w-6 h-6" />
  }

  if (variant === 'compact') {
    return (
      <Card 
        className={`${className} ${isSelected ? 'border-primary ring-1 ring-primary' : ''} cursor-pointer transition-all hover:shadow-md`}
        onClick={() => onView?.(supplier.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              {getLogoDisplay()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-sm truncate">{supplier.name}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {supplier.country && <span>{supplier.country}</span>}
                {supplier.rating && (
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-500 mr-0.5" />
                    <span>{supplier.rating}</span>
                  </div>
                )}
              </div>
            </div>
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'Connecté' : 'Déconnecté'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'grid') {
    return (
      <Card 
        className={`${className} ${isSelected ? 'border-primary ring-1 ring-primary' : ''} cursor-pointer transition-all hover:shadow-md`}
        onClick={() => onView?.(supplier.id)}
      >
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
            {getLogoDisplay()}
          </div>
          <h3 className="font-medium mb-1">{supplier.name}</h3>
          {supplier.country && (
            <div className="text-sm text-muted-foreground mb-2">{supplier.country}</div>
          )}
          {supplier.rating && (
            <div className="flex items-center justify-center gap-1 mb-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">{supplier.rating}</span>
            </div>
          )}
          <Badge variant={isConnected ? 'default' : 'secondary'} className="mt-2">
            {isConnected ? 'Connecté' : 'Déconnecté'}
          </Badge>
        </CardContent>
        {onConnect && (
          <CardFooter className="p-4 pt-0 flex justify-center">
            <Button 
              variant={isConnected ? 'outline' : 'default'} 
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onConnect(supplier.id)
              }}
            >
              {isConnected ? 'Configurer' : 'Connecter'}
            </Button>
          </CardFooter>
        )}
      </Card>
    )
  }

  // Default variant
  return (
    <Card className={`${className} ${isSelected ? 'border-primary ring-1 ring-primary' : ''} hover:shadow-md transition-all`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            {getLogoDisplay()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-lg mb-1">{supplier.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  {supplier.country && (
                    <div className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" />
                      <span>{supplier.country}</span>
                    </div>
                  )}
                  {supplier.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500" />
                      <span>{supplier.rating}</span>
                    </div>
                  )}
                </div>
              </div>
              <Badge variant={isConnected ? 'default' : 'secondary'}>
                {isConnected ? 'Connecté' : 'Déconnecté'}
              </Badge>
            </div>
            
            {supplier.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{supplier.description}</p>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {supplier.processingTime && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Traitement</div>
                    <div>{supplier.processingTime}</div>
                  </div>
                </div>
              )}
              {supplier.shippingTime && (
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Livraison</div>
                    <div>{supplier.shippingTime}</div>
                  </div>
                </div>
              )}
              {supplier.productsCount !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Produits</div>
                    <div>{supplier.productsCount.toLocaleString()}</div>
                  </div>
                </div>
              )}
              {supplier.minimumOrder !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Commande min.</div>
                    <div>{supplier.minimumOrder}</div>
                  </div>
                </div>
              )}
            </div>
            
            {supplier.performance?.onTimeDelivery && (
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Livraison à temps</span>
                  <span className="font-medium">{supplier.performance.onTimeDelivery}%</span>
                </div>
                <Progress value={supplier.performance.onTimeDelivery} className="h-1.5" />
              </div>
            )}
            
            {supplier.categories && supplier.categories.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {supplier.categories.slice(0, 3).map((category) => (
                  <Badge key={category} variant="outline" className="text-xs">
                    {category}
                  </Badge>
                ))}
                {supplier.categories.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{supplier.categories.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-muted/10 border-t flex justify-end gap-2">
        {onView && (
          <Button variant="outline" size="sm" onClick={() => onView(supplier.id)}>
            <ExternalLink className="w-4 h-4 mr-1" /> Voir catalogue
          </Button>
        )}
        {onConnect && (
          <Button 
            variant={isConnected ? 'outline' : 'default'} 
            size="sm"
            onClick={() => onConnect(supplier.id)}
          >
            {isConnected ? 'Configurer' : 'Connecter'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
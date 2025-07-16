import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Star, Edit, Eye, Zap, ShoppingCart, ExternalLink } from 'lucide-react'

interface ProductCardProps {
  product: {
    id: string
    title: string
    description?: string
    price: number
    originalPrice?: number
    images: string[]
    supplier?: string
    category?: string
    status?: string
    seoScore?: number
    tags?: string[]
    margin?: number
    orders?: number
  }
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onOptimize?: (id: string) => void
  variant?: 'default' | 'compact' | 'grid'
  className?: string
}

export function ProductCard({
  product,
  onView,
  onEdit,
  onOptimize,
  variant = 'default',
  className,
}: ProductCardProps) {
  const margin = product.originalPrice
    ? ((product.price - product.originalPrice) / product.originalPrice) * 100
    : product.margin || 0

  const statusColors: Record<string, string> = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800',
    out_of_stock: 'bg-red-100 text-red-800',
  }

  const statusColor = product.status ? statusColors[product.status] : 'bg-gray-100 text-gray-800'

  if (variant === 'compact') {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {product.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-12 h-12 rounded-md object-cover flex-shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-sm truncate">{product.title}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatCurrency(product.price)}</span>
                {product.supplier && <span>• {product.supplier}</span>}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onView?.(product.id)}>
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'grid') {
    return (
      <Card className={className}>
        <div className="relative">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full aspect-square object-cover rounded-t-xl"
            />
          ) : (
            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded-t-xl">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
          )}
          {product.status && (
            <Badge className={`absolute top-2 right-2 ${statusColor}`}>
              {product.status}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium mb-1 line-clamp-2">{product.title}</h3>
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-lg">{formatCurrency(product.price)}</div>
            {product.originalPrice && (
              <div className="text-sm text-green-600 font-medium">
                +{margin.toFixed(0)}%
              </div>
            )}
          </div>
          {product.supplier && (
            <div className="text-xs text-muted-foreground mb-2">{product.supplier}</div>
          )}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {product.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onView?.(product.id)}>
            <Eye className="w-4 h-4 mr-1" /> Voir
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit?.(product.id)}>
            <Edit className="w-4 h-4 mr-1" /> Modifier
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className={className}>
      <div className="flex p-4">
        <div className="mr-4">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-24 h-24 rounded-lg object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-lg">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium mb-1">{product.title}</h3>
              {product.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
              )}
            </div>
            {product.status && (
              <Badge className={statusColor}>
                {product.status}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            <div>
              <div className="text-xs text-muted-foreground">Prix</div>
              <div className="font-semibold">{formatCurrency(product.price)}</div>
            </div>
            {product.originalPrice && (
              <div>
                <div className="text-xs text-muted-foreground">Coût</div>
                <div className="font-semibold">{formatCurrency(product.originalPrice)}</div>
              </div>
            )}
            {(margin > 0 || product.margin) && (
              <div>
                <div className="text-xs text-muted-foreground">Marge</div>
                <div className="font-semibold text-green-600">+{margin.toFixed(0)}%</div>
              </div>
            )}
            {product.orders && (
              <div>
                <div className="text-xs text-muted-foreground">Ventes</div>
                <div className="font-semibold">{product.orders}</div>
              </div>
            )}
            {product.seoScore && (
              <div>
                <div className="text-xs text-muted-foreground">SEO</div>
                <div className="font-semibold">{product.seoScore}/100</div>
              </div>
            )}
          </div>
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.tags.slice(0, 5).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 5}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
      <CardFooter className="px-4 py-3 bg-muted/10 border-t flex justify-end gap-2">
        {onView && (
          <Button variant="ghost" size="sm" onClick={() => onView(product.id)}>
            <Eye className="w-4 h-4 mr-1" /> Voir
          </Button>
        )}
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={() => onEdit(product.id)}>
            <Edit className="w-4 h-4 mr-1" /> Modifier
          </Button>
        )}
        {onOptimize && (
          <Button variant="ghost" size="sm" onClick={() => onOptimize(product.id)}>
            <Zap className="w-4 h-4 mr-1" /> Optimiser
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
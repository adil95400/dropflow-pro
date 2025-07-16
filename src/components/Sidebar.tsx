import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  Package,
  Import,
  TrendingUp,
  Search,
  FileText,
  Users,
  Store,
  Star,
  Mail,
  BarChart3,
  Settings,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/app/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Import Produits',
    href: '/app/import',
    icon: Import,
  },
  {
    name: 'Mes Produits',
    href: '/app/products',
    icon: Package,
  },
  {
    name: 'Tracking',
    href: '/app/tracking',
    icon: TrendingUp,
  },
  {
    name: 'Produits Gagnants',
    href: '/app/winners',
    icon: Zap,
  },
  {
    name: 'SEO IA',
    href: '/app/seo',
    icon: Search,
  },
  {
    name: 'Blog IA',
    href: '/app/blog',
    icon: FileText,
  },
  {
    name: 'CRM',
    href: '/app/crm',
    icon: Users,
  },
  {
    name: 'Marketplace B2B',
    href: '/app/marketplace',
    icon: Store,
  },
  {
    name: 'Reviews',
    href: '/app/reviews',
    icon: Star,
  },
  {
    name: 'Marketing',
    href: '/app/marketing',
    icon: Mail,
  },
  {
    name: 'Analytics',
    href: '/app/analytics',
    icon: BarChart3,
  },
]

const bottomNavigation = [
  {
    name: 'Paramètres',
    href: '/app/settings',
    icon: Settings,
  },
  {
    name: 'Facturation',
    href: '/app/billing',
    icon: CreditCard,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        'flex flex-col border-r bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">DropFlow Pro</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground',
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* Bottom Navigation */}
      <div className="p-3 space-y-1">
        {bottomNavigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground',
                isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
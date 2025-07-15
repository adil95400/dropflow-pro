import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
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
  ShoppingCart,
  Target,
  Headphones,
  Bell,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

const navigation = [
  {
    name: 'Dashboard',
    href: '/app/dashboard',
    icon: LayoutDashboard,
    badge: null,
    color: 'text-blue-600',
  },
  {
    name: 'Import Produits',
    href: '/app/import',
    icon: Import,
    badge: 'New',
    color: 'text-green-600',
  },
  {
    name: 'Mes Produits',
    href: '/app/products',
    icon: Package,
    badge: '2.8K',
    color: 'text-purple-600',
  },
  {
    name: 'Tracking',
    href: '/app/tracking',
    icon: TrendingUp,
    badge: '45',
    color: 'text-orange-600',
  },
  {
    name: 'Produits Gagnants',
    href: '/app/winners',
    icon: Zap,
    badge: 'AI',
    color: 'text-yellow-600',
  },
  {
    name: 'SEO IA',
    href: '/app/seo',
    icon: Search,
    badge: null,
    color: 'text-indigo-600',
  },
  {
    name: 'Blog IA',
    href: '/app/blog',
    icon: FileText,
    badge: null,
    color: 'text-pink-600',
  },
  {
    name: 'CRM',
    href: '/app/crm',
    icon: Users,
    badge: '12',
    color: 'text-cyan-600',
  },
  {
    name: 'Marketplace B2B',
    href: '/app/marketplace',
    icon: Store,
    badge: 'Pro',
    color: 'text-emerald-600',
  },
  {
    name: 'Reviews',
    href: '/app/reviews',
    icon: Star,
    badge: null,
    color: 'text-amber-600',
  },
  {
    name: 'Marketing',
    href: '/app/marketing',
    icon: Mail,
    badge: null,
    color: 'text-red-600',
  },
  {
    name: 'Analytics',
    href: '/app/analytics',
    icon: BarChart3,
    badge: null,
    color: 'text-violet-600',
  },
]

const bottomNavigation = [
  {
    name: 'Support',
    href: '/app/support',
    icon: Headphones,
    color: 'text-blue-600',
  },
  {
    name: 'Paramètres',
    href: '/app/settings',
    icon: Settings,
    color: 'text-gray-600',
  },
  {
    name: 'Facturation',
    href: '/app/billing',
    icon: CreditCard,
    color: 'text-green-600',
  },
]

interface ModernSidebarProps {
  className?: string
}

export function ModernSidebar({ className }: ModernSidebarProps) {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 64 },
  }

  const itemVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -10 },
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={collapsed ? 'collapsed' : 'expanded'}
        className={cn(
          'sidebar flex flex-col h-screen fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto transform lg:transform-none transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-poppins font-bold text-lg text-gray-900 dark:text-white">
                    DropFlow
                  </h1>
                  <p className="text-xs text-orange-600 font-medium">PRO</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  variants={itemVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="flex-1 min-w-0"
                >
                  <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {user?.user_metadata?.full_name || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2 py-4">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'sidebar-item',
                    isActive && 'active',
                    collapsed && 'justify-center px-2'
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className={cn('sidebar-icon', item.color)} />
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.div
                        variants={itemVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="flex items-center justify-between flex-1"
                      >
                        <span className="font-medium">{item.name}</span>
                        {item.badge && (
                          <Badge
                            variant={item.badge === 'New' ? 'default' : 'secondary'}
                            className="text-xs px-2 py-0.5"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        <Separator />

        {/* Bottom Navigation */}
        <div className="p-2 space-y-1">
          {bottomNavigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'sidebar-item',
                  isActive && 'active',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className={cn('sidebar-icon', item.color)} />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      variants={itemVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
          
          <button
            onClick={signOut}
            className={cn(
              'sidebar-item w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? 'Se déconnecter' : undefined}
          >
            <LogOut className="sidebar-icon" />
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  variants={itemVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="font-medium"
                >
                  Se déconnecter
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Upgrade Banner */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="m-4 p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5" />
                <span className="font-semibold text-sm">Upgrade Pro</span>
              </div>
              <p className="text-xs opacity-90 mb-3">
                Débloquez toutes les fonctionnalités IA et intégrations premium
              </p>
              <Button
                size="sm"
                className="w-full bg-white text-orange-600 hover:bg-gray-100 font-medium"
              >
                Upgrader
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
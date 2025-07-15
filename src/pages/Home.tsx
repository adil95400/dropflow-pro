import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Check, Star, Play, ChevronDown, Menu, X, Zap, Shield,
  Clock, Users, TrendingUp, Package, BarChart3, Globe, Mail, Phone,
  MapPin, MessageCircle, ChevronRight, ChevronLeft, Plus,
  Truck, Layers, Database, Target, Award, HeadphonesIcon, BookOpen, 
  FileText, Eye, EyeOff, Building2, Sparkles, Rocket, Crown, Gift,
  CheckCircle, AlertCircle, Info, Lightbulb, Megaphone, Calendar,
  CreditCard, Lock, Wifi, Smartphone, Monitor, Tablet, Headphones,
  ShoppingCart, DollarSign, PieChart, LineChart, Activity, Briefcase,
  Settings, UserCheck, Verified, BadgeCheck, Flame, Gauge, Infinity
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { ThemeToggle } from '@/components/theme-toggle'

export function HomePage() {
  const { toast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [liveStats, setLiveStats] = useState({
    users: 15247,
    revenue: 52340000,
    products: 2847392,
    orders: 98234
  })

  // Live stats animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        users: prev.users + Math.floor(Math.random() * 3),
        revenue: prev.revenue + Math.floor(Math.random() * 1000),
        products: prev.products + Math.floor(Math.random() * 50),
        orders: prev.orders + Math.floor(Math.random() * 5)
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "🎉 Bienvenue dans DropFlow Pro !",
      description: "Vous recevrez nos dernières stratégies dropshipping et mises à jour produit.",
    })
    setEmail('')
  }

  const stats = [
    { 
      value: `${(liveStats.users / 1000).toFixed(1)}K+`, 
      label: 'Dropshippers actifs', 
      icon: Users,
      change: '+12%',
      color: 'text-blue-600'
    },
    { 
      value: `€${(liveStats.revenue / 1000000).toFixed(0)}M+`, 
      label: 'Revenus générés', 
      icon: DollarSign,
      change: '+28%',
      color: 'text-green-600'
    },
    { 
      value: `${(liveStats.products / 1000000).toFixed(1)}M+`, 
      label: 'Produits disponibles', 
      icon: Package,
      change: '+15%',
      color: 'text-purple-600'
    },
    { 
      value: `${(liveStats.orders / 1000).toFixed(0)}K+`, 
      label: 'Commandes traitées', 
      icon: ShoppingCart,
      change: '+34%',
      color: 'text-orange-600'
    }
  ]

  const features = [
    {
      icon: Bot,
      title: 'IA Store Builder',
      description: 'Créez votre boutique Shopify optimisée en 2 minutes avec des produits gagnants sélectionnés par IA.',
      badge: 'IA',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      benefits: ['Setup automatique', 'Produits pré-sélectionnés', 'Pages optimisées'],
      demo: 'Voir démo →'
    },
    {
      icon: Search,
      title: 'Recherche Produits Avancée',
      description: 'Analysez 2M+ produits tendances avec filtres IA, scores de rentabilité et prédictions de ventes.',
      badge: 'Nouveau',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      benefits: ['Filtres intelligents', 'Score rentabilité', 'Tendances temps réel'],
      demo: 'Explorer →'
    },
    {
      icon: Import,
      title: 'Import Multi-Fournisseurs',
      description: 'Importez 500+ produits depuis 20+ fournisseurs globaux avec optimisation SEO automatique.',
      badge: 'Pro',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      benefits: ['20+ fournisseurs', 'SEO automatique', 'Import en masse'],
      demo: 'Tester →'
    },
    {
      icon: Truck,
      title: 'Fulfillment Automatisé',
      description: 'Automatisez commandes, tracking, mises à jour stock et gestion retours sans intervention.',
      badge: null,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      benefits: ['Commandes auto', 'Tracking temps réel', 'Gestion retours'],
      demo: 'Découvrir →'
    },
    {
      icon: Layers,
      title: 'Print on Demand',
      description: 'Créez et vendez produits personnalisés avec impression à la demande et livraison mondiale.',
      badge: null,
      color: 'bg-gradient-to-r from-pink-500 to-pink-600',
      benefits: ['Design intégré', 'Impression auto', 'Livraison mondiale'],
      demo: 'Créer →'
    },
    {
      icon: Database,
      title: 'Sourcing Produits',
      description: 'Notre équipe source n\'importe quel produit pour vous avec négociation prix et qualité garantie.',
      badge: 'Premium',
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      benefits: ['Sourcing manuel', 'Négociation prix', 'Qualité garantie'],
      demo: 'Demander →'
    }
  ]

  const pricingPlans = [
    {
      name: 'Starter',
      price: '29',
      period: '/mois',
      description: 'Parfait pour débuter le dropshipping',
      features: [
        '500 produits importés/mois',
        '2 boutiques connectées',
        'Support email',
        'Formations de base',
        'Tracking basique'
      ],
      cta: 'Commencer',
      popular: false,
      color: 'border-gray-200'
    },
    {
      name: 'Professional',
      price: '79',
      period: '/mois',
      description: 'Pour les entrepreneurs sérieux',
      features: [
        '5000 produits importés/mois',
        '10 boutiques connectées',
        'Support prioritaire 24/7',
        'IA Store Builder',
        'Analytics avancés',
        'Sourcing produits',
        'Print on Demand'
      ],
      cta: 'Essayer gratuitement',
      popular: true,
      color: 'border-orange-500 ring-2 ring-orange-500'
    },
    {
      name: 'Enterprise',
      price: '199',
      period: '/mois',
      description: 'Pour les équipes et agences',
      features: [
        'Produits illimités',
        'Boutiques illimitées',
        'Manager dédié',
        'API complète',
        'White-label',
        'Formation équipe',
        'SLA 99.9%'
      ],
      cta: 'Contacter',
      popular: false,
      color: 'border-purple-500'
    }
  ]

  const testimonials = [
    {
      name: 'Jordan Welche',
      role: 'E-commerce Entrepreneur',
      company: '6 Figure E-com Owner',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'DropFlow Pro n\'est pas juste un outil - c\'est le partenaire qui a fait passer mon dropshipping de 5K à 50K€/mois en 6 mois.',
      subscribers: '339K subscribers',
      results: '+900% revenus',
      rating: 5
    },
    {
      name: 'Marie Dubois',
      role: 'Millionaire Entrepreneur',
      company: 'E-commerce Expert',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'L\'IA de DropFlow Pro a identifié mes 3 produits les plus rentables. J\'ai économisé 6 mois de recherche manuelle.',
      subscribers: '1.3M subscribers',
      results: '€2M+ générés',
      rating: 5
    },
    {
      name: 'Thomas Martin',
      role: 'Dropshipping Expert',
      company: '7 Figure Entrepreneur',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'Grâce au sourcing DropFlow Pro, mes marges ont doublé. L\'équipe négocie des prix que je n\'aurais jamais obtenus seul.',
      subscribers: '187K subscribers',
      results: 'Marges x2',
      rating: 5
    },
    {
      name: 'Sophie Laurent',
      role: 'Digital Entrepreneur',
      company: 'E-com Agency Owner',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'Je gère 15 boutiques clients avec DropFlow Pro. L\'automatisation me fait gagner 40h/semaine, mes clients adorent les résultats.',
      subscribers: '425K subscribers',
      results: '15 boutiques gérées',
      rating: 5
    }
  ]

  const suppliers = [
    { name: 'AliExpress', logo: '🛒', status: 'Connecté', orders: '2.3M' },
    { name: 'Amazon', logo: '📦', status: 'Connecté', orders: '1.8M' },
    { name: 'Shopify', logo: '🛍️', status: 'Intégré', orders: '3.1M' },
    { name: 'BigBuy', logo: '📋', status: 'Premium', orders: '890K' },
    { name: 'Printful', logo: '🖨️', status: 'Connecté', orders: '567K' },
    { name: 'Spocket', logo: '⚡', status: 'Connecté', orders: '1.2M' },
    { name: 'Oberlo', logo: '🔄', status: 'Intégré', orders: '2.1M' },
    { name: 'Modalyst', logo: '👗', status: 'Premium', orders: '445K' },
    { name: 'Printify', logo: '🎯', status: 'Connecté', orders: '678K' },
    { name: 'Etsy', logo: '🎨', status: 'Nouveau', orders: '234K' },
    { name: 'eBay', logo: '🏪', status: 'Connecté', orders: '1.5M' },
    { name: 'WooCommerce', logo: '🌐', status: 'Intégré', orders: '987K' }
  ]

  const supportResources = [
    {
      icon: BookOpen,
      title: 'Formations Privées Gratuites',
      description: 'Masterclass exclusives pour passer de 0 à 10K€/mois en dropshipping avec nos experts.',
      action: 'Accéder aux formations →',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      stats: '50+ heures de contenu'
    },
    {
      icon: FileText,
      title: 'Guide du Dropshipper Pro',
      description: 'Stratégies secrètes, produits gagnants et playbooks des top 1% des dropshippers européens.',
      action: 'Télécharger le guide →',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      stats: '200+ pages d\'expertise'
    },
    {
      icon: HeadphonesIcon,
      title: 'Support Expert 24/7',
      description: 'Équipe dédiée de dropshippers expérimentés pour résoudre tous vos défis business.',
      action: 'Contacter un expert →',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      stats: 'Réponse en 3 minutes'
    }
  ]

  const integrations = [
    { name: 'Shopify', logo: '🛍️', category: 'E-commerce', status: 'Natif' },
    { name: 'WooCommerce', logo: '🌐', category: 'E-commerce', status: 'Natif' },
    { name: 'Stripe', logo: '💳', category: 'Paiement', status: 'Intégré' },
    { name: 'PayPal', logo: '💰', category: 'Paiement', status: 'Intégré' },
    { name: 'Google Ads', logo: '🎯', category: 'Marketing', status: 'API' },
    { name: 'Facebook Ads', logo: '📘', category: 'Marketing', status: 'API' },
    { name: 'Klaviyo', logo: '📧', category: 'Email', status: 'Connecté' },
    { name: 'Mailchimp', logo: '🐵', category: 'Email', status: 'Connecté' },
    { name: 'Zapier', logo: '⚡', category: 'Automation', status: 'Premium' },
    { name: 'Slack', logo: '💬', category: 'Communication', status: 'Webhook' }
  ]

  const faqItems = [
    {
      question: 'Qu\'est-ce qui rend DropFlow Pro différent des autres outils ?',
      answer: 'DropFlow Pro combine IA avancée, sourcing manuel par experts, et automatisation complète. Contrairement aux concurrents, nous négocions vos prix, sourceons vos produits, et optimisons vos conversions avec une approche 100% personnalisée.'
    },
    {
      question: 'Puis-je vraiment créer une boutique rentable en 2 minutes ?',
      answer: 'Oui ! Notre IA Store Builder analyse votre niche, sélectionne les produits gagnants, crée les pages optimisées, configure les paiements et lance votre boutique. Vous n\'avez qu\'à personnaliser votre branding.'
    },
    {
      question: 'Comment fonctionne le sourcing de produits par votre équipe ?',
      answer: 'Envoyez-nous n\'importe quel lien ou image produit. Notre équipe de sourceurs experts négocie les meilleurs prix, vérifie la qualité, organise les échantillons et configure la logistique. Vous recevez le produit prêt à vendre.'
    },
    {
      question: 'Quels sont vos taux de réussite comparés à la concurrence ?',
      answer: 'Nos utilisateurs génèrent en moyenne 3.2x plus de revenus que la moyenne du marché. 78% atteignent la rentabilité dans les 30 premiers jours, contre 23% pour les outils traditionnels.'
    },
    {
      question: 'Offrez-vous une garantie de résultats ?',
      answer: 'Oui ! Garantie "Rentable en 60 jours ou remboursé". Si vous ne générez pas de profit dans les 60 jours en suivant notre méthode, nous remboursons intégralement votre abonnement.'
    },
    {
      question: 'Comment puis-je migrer depuis AutoDS, Spocket ou Zendrop ?',
      answer: 'Migration gratuite et assistée ! Notre équipe technique migre tous vos produits, commandes et configurations en moins de 24h. Support dédié pendant 30 jours pour assurer une transition parfaite.'
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Notification Bar */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 text-center text-sm">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span className="font-medium">🎉 OFFRE LIMITÉE : 60 jours gratuits + Setup boutique offert - Plus que 48h !</span>
          <Button size="sm" variant="secondary" className="ml-2 bg-white text-orange-600 hover:bg-gray-100 text-xs px-3 py-1">
            Profiter →
          </Button>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
        <div className="container">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold font-poppins text-foreground">
                  DropFlow <span className="text-orange-500">Pro</span>
                </span>
                <div className="flex items-center gap-1">
                  <Badge className="bg-orange-100 text-orange-700 text-xs px-1 py-0">
                    #1 Europe
                  </Badge>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-orange-600 cursor-pointer transition-colors">
                Pourquoi DropFlow Pro? <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-orange-600 cursor-pointer transition-colors">
                Fonctionnalités <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-orange-600 cursor-pointer transition-colors">
                Intégrations <ChevronDown className="w-4 h-4" />
              </div>
              <Link to="#pricing" className="text-sm font-medium text-muted-foreground hover:text-orange-600 transition-colors">
                Tarifs
              </Link>
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-orange-600 cursor-pointer transition-colors">
                Ressources <ChevronDown className="w-4 h-4" />
              </div>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Se connecter
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                  <Rocket className="w-4 h-4 mr-2" />
                  DÉMARRER GRATUITEMENT
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-50 via-background to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-800 py-20 lg:py-32 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

          <div className="container relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 px-4 py-2 text-sm font-medium mb-4">
                      <Crown className="w-4 h-4 mr-2" />
                      #1 Plateforme Dropshipping Europe
                    </Badge>
                  </motion.div>
                  
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl lg:text-6xl font-bold leading-tight font-poppins"
                  >
                    Créez votre boutique{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                      dropshipping
                    </span>{' '}
                    en 2 minutes avec{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                      l'IA
                    </span>
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg text-muted-foreground max-w-xl leading-relaxed"
                  >
                    Obtenez une boutique IA prête à vendre. Trouvez les produits les plus rentables. 
                    Sourcez aux meilleurs prix. Profitez d'une livraison ultra-rapide. 
                    L'expérience dropshipping "tout-en-un" la plus avancée d'Europe.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link to="/register">
                    <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all">
                      <Rocket className="w-5 h-5 mr-2" />
                      CRÉER MA BOUTIQUE MAINTENANT
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 px-8 py-4 text-lg font-semibold"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    VOIR LA DÉMO (2 MIN)
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-medium">60 jours gratuits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Setup boutique offert</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Garantie rentabilité</span>
                  </div>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex items-center gap-6 pt-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm font-medium">4.9/5</span>
                    <span className="text-sm text-muted-foreground">({liveStats.users.toLocaleString()} avis)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Sécurisé & RGPD</span>
                  </div>
                </motion.div>
              </div>

              {/* Dashboard Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative"
              >
                <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
                  {/* Browser Bar */}
                  <div className="bg-muted px-4 py-3 flex items-center gap-2 border-b">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-background rounded-md px-3 py-1 text-xs text-muted-foreground ml-4">
                      https://app.dropflow.pro/dashboard
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">Live</span>
                    </div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Dashboard DropFlow Pro</h3>
                        <p className="text-sm text-muted-foreground">Aujourd'hui, 23 Novembre 2024</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        En ligne
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl text-white"
                      >
                        <div className="text-2xl font-bold">€{(liveStats.revenue / 1000).toFixed(0)}K</div>
                        <div className="text-sm opacity-90">Revenus ce mois</div>
                        <div className="text-xs opacity-75 mt-1">+28% vs mois dernier</div>
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white"
                      >
                        <div className="text-2xl font-bold">{(liveStats.orders / 1000).toFixed(0)}K</div>
                        <div className="text-sm opacity-90">Commandes</div>
                        <div className="text-xs opacity-75 mt-1">+34% cette semaine</div>
                      </motion.div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <div className="font-medium">Produits gagnants détectés</div>
                            <div className="text-sm text-muted-foreground">Par IA - Mis à jour il y a 2 min</div>
                          </div>
                        </div>
                        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                          +15 nouveaux
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">Synchronisation active</div>
                            <div className="text-sm text-muted-foreground">3 boutiques • Temps réel</div>
                          </div>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-card p-3 rounded-xl shadow-lg border border-border"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">+€247 aujourd'hui</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-4 -left-4 bg-card p-3 rounded-xl shadow-lg border border-border"
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">12 produits importés</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                  className="absolute top-1/2 -left-6 bg-card p-2 rounded-lg shadow-lg border border-border"
                >
                  <div className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-blue-500" />
                    <span className="text-xs font-medium">Livré</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Live Stats Section */}
        <section className="py-16 bg-background border-y border-border">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 font-poppins">
                Rejoignez <span className="text-orange-500">{(liveStats.users / 1000).toFixed(0)}K+</span> dropshippers qui automatisent leur succès
              </h2>
              <p className="text-muted-foreground">Statistiques en temps réel • Mise à jour toutes les 3 secondes</p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${stat.color === 'text-blue-600' ? 'from-blue-500 to-blue-600' : stat.color === 'text-green-600' ? 'from-green-500 to-green-600' : stat.color === 'text-purple-600' ? 'from-purple-500 to-purple-600' : 'from-orange-500 to-orange-600'} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <motion.div
                    key={stat.value}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-bold mb-2"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-muted-foreground mb-2">{stat.label}</div>
                  <Badge className={`${stat.color === 'text-green-600' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'} text-xs`}>
                    {stat.change} ce mois
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="bg-orange-100 text-orange-700 mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Fonctionnalités Avancées
              </Badge>
              <h2 className="text-4xl font-bold mb-4 font-poppins">
                Tout ce dont vous avez besoin pour{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                  dominer
                </span>{' '}
                le dropshipping
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Des outils IA révolutionnaires conçus pour automatiser votre workflow et multiplier vos profits
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-card group-hover:scale-105">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <feature.icon className="w-7 h-7 text-white" />
                        </div>
                        {feature.badge && (
                          <Badge className="bg-orange-100 text-orange-700 text-xs font-medium">
                            {feature.badge}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl font-semibold mb-2">
                        {feature.title}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 mb-4">
                        {feature.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                      <Button variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-0 h-auto font-medium group-hover:translate-x-1 transition-transform">
                        {feature.demo}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="bg-green-100 text-green-700 mb-4">
                <CreditCard className="w-4 h-4 mr-2" />
                Tarifs Transparents
              </Badge>
              <h2 className="text-4xl font-bold mb-4 font-poppins">
                Choisissez le plan parfait pour{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                  votre croissance
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Commencez gratuitement, évoluez selon vos besoins. Tous les plans incluent notre garantie de rentabilité.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1">
                        <Crown className="w-3 h-3 mr-1" />
                        Plus Populaire
                      </Badge>
                    </div>
                  )}
                  
                  <Card className={`h-full ${plan.color} ${plan.popular ? 'scale-105 shadow-2xl' : 'hover:shadow-lg'} transition-all duration-300`}>
                    <CardHeader className="text-center pb-8">
                      <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                      <div className="mb-4">
                        <span className="text-4xl font-bold">€{plan.price}</span>
                        <span className="text-muted-foreground">{plan.period}</span>
                      </div>
                      <p className="text-muted-foreground">{plan.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white' : 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50'}`}
                        variant={plan.popular ? 'default' : 'outline'}
                        size="lg"
                      >
                        {plan.cta}
                        {plan.popular && <ArrowRight className="w-4 h-4 ml-2" />}
                      </Button>
                      
                      {plan.popular && (
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">
                            <Gift className="w-3 h-3 inline mr-1" />
                            60 jours gratuits + Setup boutique offert
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                Tous les plans incluent : Support 24/7 • Formations gratuites • Garantie rentabilité • Migration assistée
              </p>
              <div className="flex justify-center items-center gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Paiement sécurisé</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Données protégées</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Annulation facile</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-20 bg-gradient-to-br from-orange-50 via-background to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-800">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="bg-blue-100 text-blue-700 mb-4">
                <HeadphonesIcon className="w-4 h-4 mr-2" />
                Support Expert
              </Badge>
              <h2 className="text-4xl font-bold mb-4 font-poppins">
                Vous accompagner dans votre croissance{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                  à chaque étape
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comptez sur un support client exceptionnel 24/7. Notre équipe d'experts dropshipping 
                vous accompagne de la création à la scale de votre business.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Chat Live 24/7</h3>
                <p className="text-muted-foreground mb-4">Support instantané par des experts dropshipping certifiés</p>
                <Badge className="bg-green-100 text-green-700">Disponible maintenant</Badge>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">3s en moyenne</h3>
                <p className="text-muted-foreground mb-4">Temps de réponse le plus rapide du marché</p>
                <Badge className="bg-orange-100 text-orange-700">Record industrie</Badge>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Équipe d'experts</h3>
                <p className="text-muted-foreground mb-4">Dropshippers 7-figures dédiés à votre succès</p>
                <Badge className="bg-purple-100 text-purple-700">Certifiés</Badge>
              </motion.div>
            </div>

            <div className="text-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all">
                  <Rocket className="w-5 h-5 mr-2" />
                  COMMENCER MAINTENANT
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-4">
                60 jours gratuits • Setup boutique offert • Garantie rentabilité • Annulation facile
              </p>
            </div>
          </div>
        </section>

        {/* Suppliers Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="bg-purple-100 text-purple-700 mb-4">
                <Globe className="w-4 h-4 mr-2" />
                Réseau Mondial
              </Badge>
              <h2 className="text-4xl font-bold mb-4 font-poppins">
                Nos fournisseurs partenaires dans le monde entier
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Travaillez avec des fournisseurs fiables et vérifiés. Prix négociés, qualité garantie, 
                livraison rapide dans 180+ pays.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {suppliers.map((supplier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group cursor-pointer"
                >
                  <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105 border-0 bg-card">
                    <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-100 dark:group-hover:bg-orange-900 transition-colors">
                      <span className="text-3xl">{supplier.logo}</span>
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-orange-600 transition-colors">
                      {supplier.name}
                    </h3>
                    <Badge className={`text-xs mb-2 ${
                      supplier.status === 'Premium' ? 'bg-purple-100 text-purple-700' :
                      supplier.status === 'Intégré' ? 'bg-blue-100 text-blue-700' :
                      supplier.status === 'Nouveau' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {supplier.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{supplier.orders} commandes</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950">
                <Plus className="w-4 h-4 mr-2" />
                Voir tous les fournisseurs (50+)
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="bg-yellow-100 text-yellow-700 mb-4">
                <Star className="w-4 h-4 mr-2" />
                Témoignages
              </Badge>
              <h2 className="text-4xl font-bold mb-4 font-poppins">
                Ce que disent les entrepreneurs{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                  à propos de DropFlow Pro
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Rejoignez des milliers d'entrepreneurs qui ont transformé leur business avec DropFlow Pro
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-8 text-center border-0 shadow-xl bg-card">
                    <div className="flex justify-center mb-6">
                      <img
                        src={testimonials[currentTestimonial].image}
                        alt={testimonials[currentTestimonial].name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-orange-200"
                      />
                    </div>
                    
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    <blockquote className="text-xl italic text-muted-foreground mb-6 leading-relaxed">
                      "{testimonials[currentTestimonial].quote}"
                    </blockquote>
                    
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold">{testimonials[currentTestimonial].name}</h4>
                      <p className="text-muted-foreground">{testimonials[currentTestimonial].role}</p>
                      <div className="flex justify-center items-center gap-4 text-sm">
                        <Badge className="bg-blue-100 text-blue-700">
                          {testimonials[currentTestimonial].subscribers}
                        </Badge>
                        <Badge className="bg-green-100 text-green-700">
                          {testimonials[currentTestimonial].results}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}
                  className="w-10 h-10 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentTestimonial ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentTestimonial(prev => (prev + 1) % testimonials.length)}
                  className="w-10 h-10 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Support Resources */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="bg-indigo-100 text-indigo-700 mb-4">
                <BookOpen className="w-4 h-4 mr-2" />
                Ressources Exclusives
              </Badge>
              <h2 className="text-4xl font-bold mb-4 font-poppins">
                Le support dont vous avez besoin, quand vous en avez besoin
              </h2>
              <p className="text-xl text-muted-foreground">
                Accédez à nos ressources premium pour maximiser votre succès en dropshipping
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {supportResources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="h-full border-0 bg-card hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <CardContent className="p-8 text-center">
                      <div className={`w-20 h-20 ${resource.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                        <resource.icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-4">
                        {resource.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {resource.description}
                      </p>
                      <Badge className="bg-orange-100 text-orange-700 mb-6">
                        {resource.stats}
                      </Badge>
                      <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 group-hover:translate-y-[-2px] transition-transform">
                        {resource.action}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="bg-cyan-100 text-cyan-700 mb-4">
                <Zap className="w-4 h-4 mr-2" />
                Intégrations
              </Badge>
              <h2 className="text-4xl font-bold mb-4 font-poppins">
                Connectez tous vos outils favoris
              </h2>
              <p className="text-xl text-muted-foreground">
                Plus de 100 intégrations natives pour automatiser votre workflow
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
              {integrations.map((integration, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group cursor-pointer"
                >
                  <Card className="p-4 text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105 border-0 bg-card">
                    <div className="text-2xl mb-2">{integration.logo}</div>
                    <h3 className="font-medium text-sm mb-1">{integration.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{integration.category}</p>
                    <Badge className={`text-xs ${
                      integration.status === 'Natif' ? 'bg-green-100 text-green-700' :
                      integration.status === 'Premium' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {integration.status}
                    </Badge>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950">
                <Zap className="w-4 h-4 mr-2" />
                Voir toutes les intégrations (100+)
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="bg-gray-100 text-gray-700 mb-4">
                <Info className="w-4 h-4 mr-2" />
                Questions Fréquentes
              </Badge>
              <h2 className="text-4xl font-bold mb-4 font-poppins">
                Tout ce que vous devez savoir
              </h2>
              <p className="text-xl text-muted-foreground">
                Réponses aux questions les plus posées par nos utilisateurs
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-0 bg-card hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-3">
                        <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-orange-600 text-sm font-bold">{index + 1}</span>
                        </div>
                        {item.question}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed pl-9">
                        {item.answer}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                Vous avez d'autres questions ? Notre équipe est là pour vous aider.
              </p>
              <Button variant="outline" className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contacter le support
              </Button>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <Badge className="bg-white/20 text-white border-white/30 mb-6">
                <Rocket className="w-4 h-4 mr-2" />
                Prêt à commencer ?
              </Badge>
              
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-poppins">
                Rejoignez la révolution du dropshipping IA
              </h2>
              
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Plus de 15 000 entrepreneurs font déjà confiance à DropFlow Pro. 
                Créez votre boutique rentable en 2 minutes et rejoignez-les dès aujourd'hui.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all">
                    <Crown className="w-5 h-5 mr-2" />
                    CRÉER MA BOUTIQUE MAINTENANT
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
                >
                  <Play className="w-5 h-5 mr-2" />
                  VOIR LA DÉMO
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm opacity-90">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>60 jours gratuits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Setup boutique offert</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Garantie rentabilité</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Support expert 24/7</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-background border-t border-border">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">
                Restez informé des dernières stratégies dropshipping
              </h3>
              <p className="text-muted-foreground mb-6">
                Recevez nos conseils exclusifs, produits gagnants et mises à jour directement dans votre boîte mail
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Mail className="w-4 h-4 mr-2" />
                  S'abonner
                </Button>
              </form>
              
              <p className="text-xs text-muted-foreground mt-4">
                <Lock className="w-3 h-3 inline mr-1" />
                Vos données sont protégées. Désabonnement en un clic.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold font-poppins">
                    DropFlow <span className="text-orange-500">Pro</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <Badge className="bg-orange-100 text-orange-700 text-xs px-1 py-0">
                      #1 Europe
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                La plateforme dropshipping IA la plus avancée d'Europe. 
                Automatisez votre business et multipliez vos profits avec nos outils révolutionnaires.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-medium">4.9/5</span>
                <span className="text-sm text-muted-foreground">({liveStats.users.toLocaleString()} avis)</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Intégrations</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Sécurité</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Ressources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Blog IA</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Formations</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Webinaires</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Communauté</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Chat live</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Migration</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Statut</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">Politique de confidentialité</a>
                <a href="#" className="hover:text-foreground transition-colors">Conditions d'utilisation</a>
                <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
                <a href="#" className="hover:text-foreground transition-colors">RGPD</a>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Sécurisé SSL</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">RGPD Conforme</span>
                </div>
              </div>
            </div>
            
            <div className="text-center text-muted-foreground text-sm mt-8">
              © 2024 DropFlow Pro. Tous droits réservés. Fait avec ❤️ en France.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
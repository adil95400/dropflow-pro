import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useAnimation, useInView } from 'framer-motion'
import { useInView as useInViewObserver } from 'react-intersection-observer'
import { 
  ArrowRight, 
  Check, 
  Star, 
  Globe, 
  Zap, 
  Shield, 
  TrendingUp, 
  Package, 
  Search, 
  Sync, 
  BarChart3, 
  Users, 
  Mail, 
  Github, 
  Twitter, 
  Linkedin, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Target, 
  Rocket, 
  Award, 
  Clock, 
  DollarSign, 
  ShoppingCart, 
  Smartphone, 
  Monitor, 
  Tablet,
  Menu,
  X,
  ChevronDown,
  Building2,
  Briefcase,
  HeadphonesIcon,
  BookOpen,
  FileText,
  Settings
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/theme-toggle'
import { formatNumber } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
}

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInViewObserver({
    threshold: 0.3,
  })

  useEffect(() => {
    if (inView) {
      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [inView, end, duration])

  return (
    <span ref={ref}>
      {formatNumber(count)}{suffix}
    </span>
  )
}

export function HomePage() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Newsletter Subscription
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Succès !",
        description: "Vous êtes maintenant abonné à notre newsletter.",
      })
      setEmail('')
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const features = [
    {
      icon: Package,
      title: 'Import Automatique',
      description: 'Importez des milliers de produits depuis AliExpress, Amazon, eBay et plus de 25 fournisseurs',
      stats: '2M+ produits'
    },
    {
      icon: Zap,
      title: 'Optimisation IA',
      description: 'Titres, descriptions et prix optimisés automatiquement par intelligence artificielle',
      stats: '95% précision'
    },
    {
      icon: TrendingUp,
      title: 'Monitoring Prix',
      description: 'Surveillance automatique des prix et stock avec alertes en temps réel',
      stats: '24/7 monitoring'
    },
    {
      icon: Sync,
      title: 'Multi-Store Sync',
      description: 'Synchronisation avec Shopify, WooCommerce, eBay, Amazon simultanément',
      stats: '99.9% uptime'
    },
    {
      icon: BarChart3,
      title: 'Analytics Avancés',
      description: 'Rapports détaillés sur performances, profits et tendances du marché',
      stats: '50+ métriques'
    },
    {
      icon: Users,
      title: 'Support Expert',
      description: 'Équipe dédiée de spécialistes dropshipping disponible 24/7',
      stats: '<2min réponse'
    }
  ]

  const metrics = [
    { value: 50000, suffix: '+', label: 'Dropshippers Actifs' },
    { value: 15000000, suffix: '+', label: 'Produits Traités' },
    { value: 250000000, suffix: '€', label: 'Revenus Générés' },
    { value: 180, suffix: '+', label: 'Pays Couverts' }
  ]

  const testimonials = [
    {
      name: 'Marie Dubois',
      role: 'E-commerce Manager',
      company: 'TechStore France',
      content: 'DropFlow Pro a révolutionné notre business. Nous avons multiplié notre chiffre d\'affaires par 5 en 6 mois grâce à l\'automatisation.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      results: '+400% CA'
    },
    {
      name: 'Thomas Martin',
      role: 'Entrepreneur',
      company: 'Fashion Trends',
      content: 'L\'IA d\'optimisation des prix nous fait économiser 15h par semaine. Le ROI est exceptionnel, je recommande vivement !',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      results: '15h/semaine économisées'
    },
    {
      name: 'Sophie Laurent',
      role: 'Dropshipper Pro',
      company: 'Home & Garden',
      content: 'Interface intuitive, support réactif, résultats impressionnants. DropFlow Pro est devenu indispensable à notre croissance.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      results: '300% croissance'
    }
  ]

  const pricingPlans = [
    {
      name: 'Starter',
      price: '29',
      period: '/mois',
      description: 'Idéal pour débuter',
      features: [
        '1,000 produits importés/mois',
        '1 boutique connectée',
        'Monitoring prix basique',
        'Support email',
        'Analytics essentiels'
      ],
      popular: false,
      cta: 'Commencer gratuitement'
    },
    {
      name: 'Professional',
      price: '79',
      period: '/mois',
      description: 'Pour entrepreneurs sérieux',
      features: [
        '10,000 produits importés/mois',
        '5 boutiques connectées',
        'IA optimisation avancée',
        'Monitoring temps réel',
        'Analytics complets',
        'Support prioritaire',
        'Intégrations premium'
      ],
      popular: true,
      cta: 'Essai gratuit 14 jours'
    },
    {
      name: 'Enterprise',
      price: '199',
      period: '/mois',
      description: 'Solution sur mesure',
      features: [
        'Produits illimités',
        'Boutiques illimitées',
        'IA personnalisée',
        'API complète',
        'Manager dédié',
        'Formation personnalisée',
        'SLA garanti'
      ],
      popular: false,
      cta: 'Contacter les ventes'
    }
  ]

  const integrations = [
    { name: 'Shopify', logo: '🛍️', status: 'active' },
    { name: 'WooCommerce', logo: '🛒', status: 'active' },
    { name: 'Amazon', logo: '📦', status: 'active' },
    { name: 'eBay', logo: '🏪', status: 'active' },
    { name: 'AliExpress', logo: '🛍️', status: 'active' },
    { name: 'Etsy', logo: '🎨', status: 'active' },
    { name: 'Facebook', logo: '📘', status: 'active' },
    { name: 'Instagram', logo: '📸', status: 'active' }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header - Style AutoDS */}
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                DropFlow<span className="text-blue-600">Pro</span>
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
                  Solutions
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <a href="#features" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
                Fonctionnalités
              </a>
              <a href="#pricing" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
                Tarifs
              </a>
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
                  Ressources
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <a href="#contact" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
                Contact
              </a>
            </nav>
            
            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  Connexion
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Essai Gratuit
                </Button>
              </Link>
              
              {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <a href="#features" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fonctionnalités
              </a>
              <a href="#pricing" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tarifs
              </a>
              <a href="#contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact
              </a>
              <Separator />
              <Link to="/login" className="block">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Connexion
                </Button>
              </Link>
              <Link to="/register" className="block">
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                  Essai Gratuit
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - Style AutoDS */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp}>
                <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 text-sm font-medium">
                  <Star className="w-4 h-4 mr-2" />
                  #1 Plateforme Dropshipping en Europe
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Automatisez Votre{' '}
                  <span className="text-blue-600">Dropshipping</span>{' '}
                  Comme un Pro
                </h1>
              </motion.div>
              
              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                Importez, optimisez et vendez des millions de produits avec notre IA avancée. 
                Rejoignez 50,000+ dropshippers qui font confiance à DropFlow Pro.
              </motion.p>
              
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/register">
                  <Button size="lg" className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                    <Rocket className="w-5 h-5 mr-2" />
                    Commencer Gratuitement
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2">
                  <Play className="w-5 h-5 mr-2" />
                  Voir la Démo
                </Button>
              </motion.div>
              
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Essai gratuit 14 jours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Aucune carte requise</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Support 24/7</span>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Right Content - Dashboard Preview */}
            <motion.div
              variants={scaleIn}
              initial="initial"
              animate="animate"
              className="relative"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Browser Bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white dark:bg-gray-600 rounded-lg px-3 py-1 text-sm text-gray-500 text-center">
                      app.dropflow.pro/dashboard
                    </div>
                  </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="p-6 space-y-4">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">€12,450</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Revenus ce mois</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">1,247</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Produits actifs</div>
                    </div>
                  </div>
                  
                  {/* Chart Placeholder */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-32 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  
                  {/* Recent Activity */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Produit importé: Montre connectée</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Prix optimisé: Écouteurs Bluetooth</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                +€2,340 aujourd'hui
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                127 nouveaux produits
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2">
                  <AnimatedCounter end={metric.value} suffix={metric.suffix} />
                </div>
                <div className="text-gray-300 font-medium">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Style AutoDS */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-700">
              Fonctionnalités
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Tout ce dont vous avez besoin pour{' '}
              <span className="text-blue-600">réussir</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Des outils professionnels conçus pour automatiser votre business et maximiser vos profits
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800">
                  <CardContent className="p-0 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        <feature.icon className="w-6 h-6 text-blue-600 group-hover:text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.stats}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Intégrations Natives
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Connectez-vous à toutes vos plateformes préférées
            </p>
          </motion.div>
          
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-6">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex flex-col items-center p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="text-2xl mb-2">{integration.logo}</div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                  {integration.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Style AutoDS */}
      <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-700">
              Tarifs Transparents
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Choisissez votre plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Commencez gratuitement, évoluez selon vos besoins
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative ${
                  plan.popular ? 'lg:scale-105' : ''
                }`}
              >
                <Card className={`h-full p-8 ${
                  plan.popular
                    ? 'border-2 border-blue-500 shadow-xl bg-blue-50 dark:bg-blue-900/20'
                    : 'border border-gray-200 dark:border-gray-700'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white px-4 py-1">
                        Plus Populaire
                      </Badge>
                    </div>
                  )}
                  
                  <CardContent className="p-0 space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {plan.description}
                      </p>
                      <div className="flex items-baseline justify-center mb-6">
                        <span className="text-5xl font-bold text-gray-900 dark:text-white">
                          {plan.price}€
                        </span>
                        <span className="text-gray-500 ml-2">{plan.period}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      className={`w-full py-3 ${
                        plan.popular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-700">
              Témoignages
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Rejoignez des milliers d'entrepreneurs qui nous font confiance
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full p-6 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0 space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.role} • {testimonial.company}
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        {testimonial.results}
                      </Badge>
                    </div>
                    
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    <blockquote className="text-gray-700 dark:text-gray-300 italic">
                      "{testimonial.content}"
                    </blockquote>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-bold">
              Prêt à transformer votre business ?
            </h2>
            <p className="text-xl text-blue-100">
              Rejoignez 50,000+ dropshippers qui automatisent leur succès avec DropFlow Pro
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100">
                  <Rocket className="w-5 h-5 mr-2" />
                  Commencer Gratuitement
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600">
                <HeadphonesIcon className="w-5 h-5 mr-2" />
                Parler à un Expert
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Essai gratuit 14 jours</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Support 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Aucun engagement</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Style AutoDS */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">
                  DropFlow<span className="text-blue-400">Pro</span>
                </span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                La plateforme dropshipping la plus avancée d'Europe. Automatisez votre business 
                et rejoignez des milliers d'entrepreneurs qui nous font confiance.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 text-gray-400 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 text-gray-400 hover:text-white">
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 text-gray-400 hover:text-white">
                  <Github className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Intégrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sécurité</a></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4">Ressources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Webinaires</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Communauté</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Chat en direct</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Statut</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Feedback</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-800" />
          
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 DropFlow Pro. Tous droits réservés.
            </p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Conditions
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
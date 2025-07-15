import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Check, Star, Play, ChevronDown, Menu, X, Zap, Shield,
  Clock, Users, TrendingUp, Package, BarChart3, Globe, Mail, Phone,
  MapPin, MessageCircle, ChevronRight, ChevronLeft, Eye, Target,
  Sparkles, Bot, Rocket, Award, HeadphonesIcon, BookOpen, FileText,
  Settings, CreditCard, Building2, ShoppingCart, Search, Import,
  Truck, UserCheck, Briefcase, Database, Layers, Cpu, Workflow
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export function HomePage() {
  const { toast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Merci !",
      description: "Vous êtes maintenant inscrit à la newsletter DropFlow Pro.",
    })
    setEmail('')
  }

  const stats = [
    { value: '15,000+', label: 'Utilisateurs actifs', icon: Users },
    { value: '€50M+', label: 'Revenus générés', icon: TrendingUp },
    { value: '2.5M+', label: 'Produits importés', icon: Package },
    { value: '180+', label: 'Pays couverts', icon: Globe }
  ]

  const features = [
    {
      icon: Bot,
      title: 'IA Store Builder',
      description: 'Créez votre boutique Shopify optimisée avec des produits gagnants et des pages prêtes à convertir.',
      badge: 'IA',
      color: 'bg-blue-500'
    },
    {
      icon: Search,
      title: 'Recherche Produits',
      description: 'Comparez instantanément 2M+ produits tendances de fournisseurs mondiaux et ajoutez-les en un clic.',
      badge: 'Nouveau',
      color: 'bg-green-500'
    },
    {
      icon: Import,
      title: 'Import Intelligent',
      description: 'Importez 500+ produits depuis des fournisseurs globaux en un clic avec optimisation SEO automatique.',
      badge: 'Pro',
      color: 'bg-purple-500'
    },
    {
      icon: Truck,
      title: 'Fulfillment AutoDS',
      description: 'Automatisez commandes, tracking, mises à jour et retours sans compte acheteur nécessaire.',
      badge: null,
      color: 'bg-orange-500'
    },
    {
      icon: Layers,
      title: 'Print on Demand',
      description: 'Créez et vendez une large gamme de produits personnalisés directement via DropFlow Pro.',
      badge: null,
      color: 'bg-pink-500'
    },
    {
      icon: Database,
      title: 'Sourcing Produits',
      description: 'Envoyez n\'importe quel lien ou image produit à notre équipe, nous le sourceons pour vous.',
      badge: 'Premium',
      color: 'bg-indigo-500'
    }
  ]

  const testimonials = [
    {
      name: 'Jordan Welche',
      role: 'E-commerce Entrepreneur, Founder',
      company: '6 Figure E-com Owner',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'DropFlow Pro n\'est pas juste un autre outil - c\'est le partenaire qui a fait passer mon dropshipping au niveau supérieur. L\'automatisation est plus rapide que tout ce que j\'ai pu tester.',
      subscribers: '339K subscribers'
    },
    {
      name: 'Baddie In Business',
      role: 'Millionaire Entrepreneur, YouTuber',
      company: 'E-commerce Expert',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'DropFlow Pro est ma solution de référence pour gérer mon business dropshipping. C\'est une plateforme tout-en-un qui offre une automatisation dropshipping et rend ma vie plus facile.',
      subscribers: '1.3M subscribers'
    },
    {
      name: 'Yomi Denzel',
      role: 'E-commerce Entrepreneur, Mentor',
      company: 'Dropshipping Expert',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'J\'ai constamment une marge de 30-40% sur mes boutiques dropshipping et je pensais ne pas pouvoir faire mieux. Mais j\'ai découvert que DropFlow Pro pouvait faire passer mes marges à un niveau complètement nouveau.',
      subscribers: '187K subscribers'
    },
    {
      name: 'Sebastian Ghiorghiu',
      role: 'Digital Entrepreneur, E-com Owner',
      company: '7 Figure E-com Expert',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'DropFlow Pro a pris mon dropshipping au niveau supérieur. Si j\'avais eu accès à cet outil plus tôt, j\'aurais pu scaler beaucoup plus rapidement avec une équipe complète en un seul endroit.',
      subscribers: '425K subscribers'
    }
  ]

  const suppliers = [
    { name: 'AliExpress', logo: '🛒' },
    { name: 'Amazon', logo: '📦' },
    { name: 'Etsy', logo: '🎨' },
    { name: 'eBay', logo: '🏪' },
    { name: 'Shopify', logo: '🛍️' },
    { name: 'WooCommerce', logo: '🌐' },
    { name: 'BigBuy', logo: '📋' },
    { name: 'Printful', logo: '🖨️' },
    { name: 'Spocket', logo: '⚡' },
    { name: 'Oberlo', logo: '🔄' },
    { name: 'Modalyst', logo: '👗' },
    { name: 'Printify', logo: '🎯' }
  ]

  const faqItems = [
    {
      question: 'Qu\'est-ce que DropFlow Pro ?',
      answer: 'DropFlow Pro est une plateforme tout-en-un d\'automatisation dropshipping qui vous aide à importer, optimiser et gérer vos produits avec l\'IA.'
    },
    {
      question: 'DropFlow Pro automatise-t-il les commandes pour moi ?',
      answer: 'Oui, DropFlow Pro automatise entièrement le processus de commande, du placement à la livraison, avec tracking en temps réel.'
    },
    {
      question: 'DropFlow Pro propose-t-il un essai gratuit ?',
      answer: 'Oui, nous offrons un essai gratuit de 14 jours sans carte de crédit requise pour tester toutes nos fonctionnalités.'
    },
    {
      question: 'DropFlow Pro surveille-t-il les prix et stocks pour moi ?',
      answer: 'Absolument ! Notre système surveille automatiquement les prix et stocks de vos fournisseurs et met à jour vos boutiques en temps réel.'
    },
    {
      question: 'Puis-je utiliser DropFlow Pro en tant que débutant ?',
      answer: 'Bien sûr ! DropFlow Pro est conçu pour les débutants avec des guides étape par étape, formations gratuites et support 24/7.'
    },
    {
      question: 'Combien coûte DropFlow Pro après l\'essai ?',
      answer: 'Nos plans commencent à 19€/mois pour les débutants, avec des options avancées pour les entreprises en croissance.'
    }
  ]

  const supportResources = [
    {
      icon: BookOpen,
      title: 'Formations Privées Gratuites',
      description: 'Conçues et prouvées pour emmener n\'importe qui du débutant à la construction d\'une boutique dropshipping de 10K€/mois - (valeur 5000€)',
      action: 'Apprendre →'
    },
    {
      icon: FileText,
      title: 'Guide du Débutant',
      description: 'Obtenez les dernières stratégies, meilleurs vendeurs, et guides étape par étape des top 1% des dropshippers.',
      action: 'Lire →'
    },
    {
      icon: HeadphonesIcon,
      title: 'Centre d\'Aide',
      description: 'Obtenez des réponses instantanées à toutes vos questions et défis avec notre équipe de support dédiée 24/7.',
      action: 'Obtenir de l\'aide →'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                DROP<span className="text-orange-500">FLOW</span>
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 cursor-pointer">
                Pourquoi DropFlow Pro? <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 cursor-pointer">
                Intégrations <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 cursor-pointer">
                Fournisseurs <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 cursor-pointer">
                Ressources <ChevronDown className="w-4 h-4" />
              </div>
              <Link to="#pricing" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500">
                Tarifs
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500">
                Se connecter
              </Link>
              <Link to="/register">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-lg">
                  COMMENCER →
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
            >
              <div className="px-4 py-4 space-y-4">
                <a href="#features" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fonctionnalités</a>
                <a href="#pricing" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tarifs</a>
                <a href="#testimonials" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Témoignages</a>
                <Link to="/register" className="block">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Commencer Gratuitement
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-20 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200 px-3 py-1 text-sm font-medium">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Maintenant avec IA
                  </Badge>
                  
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                    Construisez votre boutique{' '}
                    <span className="text-orange-500">dropshipping</span>{' '}
                    en 2 minutes avec{' '}
                    <span className="text-orange-500">DropFlow Pro</span>
                  </h1>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
                    Obtenez une boutique IA prête à vendre. Trouvez les produits les plus vendus. 
                    Sourcez au prix le plus bas. Profitez d'une livraison ultra-rapide. 
                    Bénéficiez d'une expérience dropshipping "tout-en-un" IA.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register">
                    <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-lg">
                      COMMENCER LE DROPSHIPPING
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-4 text-lg font-semibold rounded-lg"
                  >
                    LANCER VOTRE BOUTIQUE EN 2 MINUTES
                  </Button>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Essai gratuit 14 jours
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Annulez à tout moment
                  </div>
                </div>
              </div>

              {/* Dashboard Preview */}
              <div className="relative">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Browser Bar */}
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-white dark:bg-gray-600 rounded-md px-3 py-1 text-xs text-gray-500 dark:text-gray-300">
                      https://app.dropflow.pro/dashboard
                    </div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h3>
                      <Badge className="bg-green-100 text-green-700">En ligne</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                        <div className="text-2xl font-bold">€1,060</div>
                        <div className="text-sm opacity-90">Profit Quotidien</div>
                      </div>
                      <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
                        <div className="text-2xl font-bold">98</div>
                        <div className="text-sm opacity-90">Commandes</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Produits gagnants</div>
                            <div className="text-sm text-gray-500">Détectés par IA</div>
                          </div>
                        </div>
                        <Badge className="bg-orange-100 text-orange-700">+15%</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Synchronisation active</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">+€247 aujourd'hui</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Tout ce dont vous avez besoin pour{' '}
                <span className="text-orange-500">dominer</span> le dropshipping
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Des outils puissants conçus pour automatiser votre workflow et maximiser vos profits
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-white dark:bg-gray-900">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center`}>
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        {feature.badge && (
                          <Badge className="bg-orange-100 text-orange-700 text-xs">
                            {feature.badge}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {feature.description}
                      </p>
                      <Button variant="ghost" className="text-orange-500 hover:text-orange-600 p-0 h-auto font-medium">
                        Commencer →
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-20 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Vous accompagner dans votre croissance{' '}
                <span className="text-orange-500">à chaque étape</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Comptez sur un support client exceptionnel 24/7. Notre équipe de support professionnel 
                vous accompagne à chaque étape du processus.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Chat Live 24/7</h3>
                <p className="text-gray-600 dark:text-gray-300">Support</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">3s en moyenne</h3>
                <p className="text-gray-600 dark:text-gray-300">Temps de réponse</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Équipe professionnelle</h3>
                <p className="text-gray-600 dark:text-gray-300">Équipe de support</p>
              </div>
            </div>

            <div className="text-center">
              <Link to="/register">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-lg">
                  COMMENCER →
                </Button>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Essai gratuit 14 jours • Annulez à tout moment
              </p>
            </div>
          </div>
        </section>

        {/* Suppliers Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Nos fournisseurs supportés dans le monde entier
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Travaillez avec des fournisseurs fiables et de confiance du monde entier 
                qui sont supportés par DropFlow Pro.
              </p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
              {suppliers.map((supplier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="text-center group cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 transition-colors">
                    <span className="text-2xl">{supplier.logo}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-orange-500 transition-colors">
                    {supplier.name}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="ghost" className="text-orange-500 hover:text-orange-600 font-medium">
                Voir plus de fournisseurs →
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">
                L'outil tout-en-un dont vous avez besoin pour{' '}
                <span className="text-orange-400">rationaliser et développer</span> votre business
              </h2>
              
              <div className="mb-8">
                <Link to="/register">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-lg">
                    COMMENCER →
                  </Button>
                </Link>
                <p className="text-sm text-gray-400 mt-4">
                  Essai gratuit 14 jours • Annulez à tout moment
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Que disent les autres entrepreneurs{' '}
                <span className="text-orange-500">à propos de DropFlow Pro ?</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                          <p className="text-xs text-orange-500">{testimonial.subscribers}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Rating */}
            <div className="text-center mt-12">
              <div className="flex justify-center items-center gap-8 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">app store</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Capterra</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">GetApp</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Resources */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Le support dont vous avez besoin, quand vous en avez besoin.
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Trouvez les meilleures ressources adaptées à vos besoins...
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {supportResources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <resource.icon className="w-8 h-8 text-orange-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        {resource.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {resource.description}
                      </p>
                      <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                        {resource.action}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Un Pro du Dropshipping à vos côtés
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                DropFlow Pro aide tous les dropshippers avec des outils d'automatisation tout-en-un 
                et des ressources d'apprentissage pour les guider du débutant à l'expert.
              </p>
            </div>

            <div className="flex justify-center gap-4 mb-12">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg">
                Commencer à vendre
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold rounded-lg"
              >
                Développer votre business
              </Button>
            </div>

            {/* Final Dashboard Preview */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-8 rounded-2xl">
                <div className="bg-white rounded-xl p-6 text-gray-900">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Commencer à vendre</h3>
                    <Badge className="bg-green-100 text-green-700">Aujourd'hui</Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">€1,060</div>
                      <div className="text-gray-600 mb-4">Profit quotidien</div>
                      
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Trouvez des produits dropshipping gagnants
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Accès complet aux formations dropshipping gratuites & eBooks
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Configuration conviviale pour débutants
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Centre d'Aide Dropshipping & support chat 1-to-1
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <img
                        src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300"
                        alt="Entrepreneur heureux"
                        className="w-32 h-32 rounded-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link to="/register">
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 font-semibold rounded-lg">
                        COMMENCER LE DROPSHIPPING
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Questions fréquemment posées
              </h2>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {item.question}
                        </h3>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">
                        {item.answer}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">
                  DROP<span className="text-orange-500">FLOW</span>
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                La plateforme dropshipping la plus puissante pour les entreprises e-commerce modernes.
              </p>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-sm">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">FONCTIONNALITÉS</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Recherche Produits</a></li>
                <li><a href="#" className="hover:text-white">Outils Espion IA</a></li>
                <li><a href="#" className="hover:text-white">Print on demand</a></li>
                <li><a href="#" className="hover:text-white">Importateur de produits</a></li>
                <li><a href="#" className="hover:text-white">Commandes automatiques</a></li>
                <li><a href="#" className="hover:text-white">Automatisation prix et stock</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">RESSOURCES</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Formations</a></li>
                <li><a href="#" className="hover:text-white">Affilié</a></li>
                <li><a href="#" className="hover:text-white">Webinaires</a></li>
                <li><a href="#" className="hover:text-white">Alternatives</a></li>
                <li><a href="#" className="hover:text-white">Témoignages</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">VENDRE SUR</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Outil dropshipping eBay</a></li>
                <li><a href="#" className="hover:text-white">App dropshipping Shopify</a></li>
                <li><a href="#" className="hover:text-white">Logiciel marketplace Facebook</a></li>
                <li><a href="#" className="hover:text-white">App dropshipping Wix</a></li>
                <li><a href="#" className="hover:text-white">Outil dropshipping WooCommerce</a></li>
                <li><a href="#" className="hover:text-white">Outil dropshipping Amazon</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <span className="text-gray-400">Politique de confidentialité</span>
              <span className="text-gray-400">Conditions d'utilisation</span>
              <span className="text-gray-400">DropFlow Pro Dropshipping Policy</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-400 text-sm">4.9/5 • 15,000 avis</span>
            </div>
          </div>

          <div className="text-center text-gray-400 text-sm mt-8">
            © 2024 DropFlow Pro. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}
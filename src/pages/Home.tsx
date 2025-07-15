import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useAnimation, useInView } from 'framer-motion'
import { useIntersection } from 'react-use'
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
  Tablet
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
  const [ref, inView] = useIntersection({
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

// Feature Showcase Component
const FeatureShowcase = ({ features }: { features: any[] }) => {
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [features.length])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
              activeFeature === index
                ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-800'
            }`}
            onClick={() => setActiveFeature(index)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                activeFeature === index
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="relative">
        <motion.div
          key={activeFeature}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <features[activeFeature].icon className="w-6 h-6 text-orange-500" />
              <span className="font-semibold">{features[activeFeature].title}</span>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-green-400 text-sm font-mono">
                $ dropflow {features[activeFeature].command}
              </div>
              <div className="text-gray-400 text-sm mt-2">
                {features[activeFeature].output}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Testimonial Carousel Component
const TestimonialCarousel = ({ testimonials }: { testimonials: any[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <Card className="mx-auto max-w-4xl bg-white dark:bg-gray-800 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex justify-center md:justify-start mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <blockquote className="text-lg mb-4 italic text-gray-700 dark:text-gray-300">
                        "{testimonial.content}"
                      </blockquote>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </motion.div>
      </div>
      
      <div className="flex justify-center mt-8 gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={prevTestimonial}
          className="rounded-full w-12 h-12 p-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={nextTestimonial}
          className="rounded-full w-12 h-12 p-0"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="flex justify-center mt-4 gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export function HomePage() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      title: 'Import Multi-Fournisseurs',
      description: 'Importez des produits depuis AliExpress, BigBuy, Eprolo et plus de 20 fournisseurs en un clic',
      command: 'import --source aliexpress --optimize',
      output: '✅ 150 produits importés et optimisés avec IA'
    },
    {
      icon: Zap,
      title: 'Optimisation SEO IA',
      description: 'Générez automatiquement des titres, descriptions et mots-clés SEO optimisés en 10+ langues',
      command: 'seo --optimize --lang fr,en,es',
      output: '🚀 SEO optimisé pour 3 langues, score moyen: 92%'
    },
    {
      icon: Sync,
      title: 'Sync Shopify Temps Réel',
      description: 'Synchronisation bidirectionnelle temps réel avec Shopify, WooCommerce et PrestaShop',
      command: 'sync --platform shopify --realtime',
      output: '🔄 Synchronisation active, 1,247 produits synchro'
    },
    {
      icon: TrendingUp,
      title: 'Tracking Avancé',
      description: 'Suivez les commandes de plus de 1000 transporteurs avec notifications client automatiques',
      command: 'track --orders --notify-customers',
      output: '📦 45 commandes trackées, 12 livrées aujourd\'hui'
    },
    {
      icon: Users,
      title: 'CRM Intégré',
      description: 'Gérez clients, prospects et tickets support dans un tableau de bord unifié',
      command: 'crm --dashboard --analytics',
      output: '👥 892 clients actifs, 23 nouveaux leads'
    },
    {
      icon: BarChart3,
      title: 'Analytics Intelligents',
      description: 'Insights temps réel sur ventes, profits et produits gagnants avec prédictions IA',
      command: 'analytics --predict --winners',
      output: '📊 15 produits gagnants détectés, ROI +34%'
    }
  ]

  const metrics = [
    { value: 25000, suffix: '+', label: 'Produits Importés', icon: Package },
    { value: 2500, suffix: '+', label: 'Boutiques Connectées', icon: ShoppingCart },
    { value: 5200000, suffix: '€', label: 'Revenus Générés', icon: DollarSign },
    { value: 67, suffix: '+', label: 'Pays Desservis', icon: Globe }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'E-commerce Entrepreneur',
      company: 'TechGadgets Store',
      content: 'DropFlow Pro a transformé mon business. L\'IA d\'optimisation a augmenté mon taux de conversion de 40% et m\'a fait gagner 20 heures par semaine. Le ROI est incroyable !',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Marcus Chen',
      role: 'Dropshipping Expert',
      company: 'Fashion Forward',
      content: 'La fonction d\'import multi-fournisseurs est révolutionnaire. Je peux maintenant sourcer depuis 15 fournisseurs différents et tout gérer au même endroit. Un gain de temps énorme !',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Store Owner',
      company: 'Home Essentials',
      content: 'Le support client est exceptionnel, et le système de tracking rend mes clients heureux. Mon taux de retour a chuté de 60% grâce aux notifications automatiques.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ]

  const pricingPlans = [
    {
      name: 'Starter',
      price: '29',
      period: '/mois',
      description: 'Parfait pour débuter',
      features: [
        '500 produits importés/mois',
        '1 boutique connectée',
        'SEO IA basique',
        'Support email',
        'Tracking standard'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '79',
      period: '/mois',
      description: 'Pour les entrepreneurs sérieux',
      features: [
        '5,000 produits importés/mois',
        '5 boutiques connectées',
        'SEO IA avancé + traductions',
        'CRM intégré',
        'Analytics avancés',
        'Support prioritaire',
        'Automation Zapier'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '199',
      period: '/mois',
      description: 'Pour les grandes entreprises',
      features: [
        'Produits illimités',
        'Boutiques illimitées',
        'IA personnalisée',
        'Marketplace B2B privée',
        'API complète',
        'Support dédié 24/7',
        'Formation personnalisée'
      ],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-poppins font-bold text-xl text-gray-900 dark:text-white">DropFlow</span>
              <span className="text-orange-600 font-bold text-xl"> Pro</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Fonctionnalités
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Tarifs
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Témoignages
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Contact
            </a>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex"
            >
              <Globe className="w-4 h-4 mr-2" />
              FR
            </Button>
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Connexion
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Commencer
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />
        <div className="absolute inset-0 bg-pattern opacity-30" />
        
        <div className="container relative">
          <motion.div
            className="mx-auto max-w-5xl text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <Badge className="mb-6 bg-orange-100 text-orange-700 hover:bg-orange-200 px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                Approuvé par 10,000+ dropshippers dans le monde
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl font-poppins">
                Automatisez Votre{' '}
                <span className="text-gradient">Dropshipping</span>{' '}
                avec l'IA
              </h1>
            </motion.div>
            
            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300 mb-10"
            >
              La plateforme dropshipping la plus puissante pour importer, optimiser et développer 
              votre e-commerce avec des outils IA de pointe. Rivalisez avec les leaders du marché.
            </motion.p>
            
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link to="/register">
                <Button size="lg" className="text-lg px-8 py-4 bg-orange-500 hover:bg-orange-600 shadow-orange">
                  <Rocket className="w-5 h-5 mr-2" />
                  Essai Gratuit 14 Jours
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2">
                <Play className="w-5 h-5 mr-2" />
                Voir la Démo
              </Button>
            </motion.div>
            
            {/* Hero Dashboard Preview */}
            <motion.div
              variants={scaleIn}
              className="relative mx-auto max-w-6xl"
            >
              <div className="relative rounded-2xl border bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-blue-500/10" />
                <div className="relative">
                  {/* Browser Bar */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-white dark:bg-gray-600 rounded-lg px-3 py-1 text-sm text-gray-500">
                        https://app.dropflow.pro/dashboard
                      </div>
                    </div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="p-6">
                    <img
                      src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
                      alt="DropFlow Pro Dashboard"
                      className="w-full h-auto rounded-xl"
                    />
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -left-4 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                +150 produits importés
              </motion.div>
              
              <motion.div
                className="absolute -top-4 -right-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                SEO optimisé à 94%
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                +€12,450 revenus ce mois
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-800">
        <div className="container">
          <motion.div
            className="mx-auto max-w-3xl text-center mb-20"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-orange-100 text-orange-700">
              Fonctionnalités
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl font-poppins mb-6">
              Tout ce dont vous avez besoin pour{' '}
              <span className="text-gradient">dominer</span> le dropshipping
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Des outils puissants conçus pour automatiser votre workflow et maximiser vos profits
            </p>
          </motion.div>
          
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <FeatureShowcase features={features} />
          </motion.div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="container">
          <motion.div
            className="mx-auto max-w-3xl text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl font-poppins mb-6">
              Approuvé par des milliers de dropshippers à succès
            </h2>
            <p className="text-xl text-orange-100">
              Rejoignez une communauté de entrepreneurs qui font confiance à DropFlow Pro
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <metric.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold font-poppins mb-2">
                  <AnimatedCounter end={metric.value} suffix={metric.suffix} />
                </div>
                <div className="text-orange-100 font-medium">{metric.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32">
        <div className="container">
          <motion.div
            className="mx-auto max-w-3xl text-center mb-20"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-orange-100 text-orange-700">
              Tarifs
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl font-poppins mb-6">
              Choisissez le plan qui vous convient
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Commencez gratuitement, évoluez selon vos besoins
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`relative rounded-2xl border p-8 ${
                  plan.popular
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-orange-lg'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-orange-500 text-white px-4 py-1">
                      Plus Populaire
                    </Badge>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold font-poppins mb-2">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold font-poppins">{plan.price}€</span>
                    <span className="text-gray-500 ml-2">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Commencer maintenant
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-800">
        <div className="container">
          <motion.div
            className="mx-auto max-w-3xl text-center mb-20"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-orange-100 text-orange-700">
              Témoignages
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl font-poppins mb-6">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Rejoignez des milliers de dropshippers qui font confiance à DropFlow Pro
            </p>
          </motion.div>
          
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <TestimonialCarousel testimonials={testimonials} />
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl font-poppins mb-6">
              Restez informé des dernières nouveautés
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Recevez les derniers conseils, tendances et mises à jour directement dans votre boîte mail
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8">
              <Input
                type="email"
                placeholder="Entrez votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white text-gray-900 border-0 flex-1"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-orange-600 whitespace-nowrap px-8"
              >
                {isSubmitting ? 'Inscription...' : 'S\'abonner'}
              </Button>
            </form>
            
            <p className="text-sm text-gray-400">
              Nous respectons votre vie privée. Désabonnez-vous à tout moment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-900">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-poppins font-bold text-xl text-gray-900 dark:text-white">DropFlow</span>
                  <span className="text-orange-600 font-bold text-xl"> Pro</span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                La plateforme dropshipping la plus puissante pour les entreprises e-commerce modernes. 
                Automatisez, optimisez et développez votre business avec l'IA.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                  <Github className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                  <Linkedin className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">Tarifs</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">API</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">Intégrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">À propos</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">Carrières</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">Communauté</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">Statut</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2024 DropFlow Pro. Tous droits réservés.
            </p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 text-sm transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 text-sm transition-colors">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
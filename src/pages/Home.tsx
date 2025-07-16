import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { updateSEO } from '@/lib/seo'
import {
  Zap, TrendingUp, Globe, Users, ShoppingCart, Star, 
  CheckCircle, AlertCircle, Info, Lightbulb, Megaphone, Calendar,
  CreditCard, Lock, Wifi, Smartphone, Monitor, Tablet, Headphones,
  Download, Upload, Search, Bot,
  Settings, UserCheck, Verified, BadgeCheck, Flame, Gauge, Infinity,
  ArrowRight, Eye, Target, Rocket, Shield, Award, Clock,
  Package, Import, BarChart3, Mail, FileText, Store
} from 'lucide-react'

const stats = [
  { icon: Users, value: '50,000+', label: 'Utilisateurs actifs', color: 'text-blue-600' },
  { icon: Globe, value: '180+', label: 'Pays couverts', color: 'text-green-600' },
  { icon: TrendingUp, value: '€250M+', label: 'Revenus générés', color: 'text-orange-600' },
  { icon: Package, value: '15M+', label: 'Produits importés', color: 'text-purple-600' }
]

const features = [
  {
    icon: Import,
    title: 'Import Multi-Fournisseurs',
    description: 'Importez des produits depuis AliExpress, BigBuy, Eprolo et 20+ fournisseurs en un clic',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Bot,
    title: 'IA SEO Avancée',
    description: 'Optimisation automatique des titres, descriptions et mots-clés en 10+ langues',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: TrendingUp,
    title: 'Tracking Intelligent',
    description: 'Suivez vos commandes depuis 1000+ transporteurs avec notifications automatiques',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    icon: BarChart3,
    title: 'Analytics Temps Réel',
    description: 'Insights sur vos ventes, profits et produits gagnants avec prédictions IA',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    icon: Store,
    title: 'Sync Multi-Plateformes',
    description: 'Synchronisation bidirectionnelle avec Shopify, WooCommerce, PrestaShop',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    icon: Mail,
    title: 'CRM & Marketing',
    description: 'Gestion clients complète avec automation Klaviyo, Mailchimp, Omnisend',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50'
  }
]

const testimonials = [
  {
    name: 'Sarah Dubois',
    role: 'E-commerce Manager',
    company: 'TechGadgets Store',
    content: 'DropFlow Pro a transformé notre business. Nous avons multiplié notre CA par 5 en 6 mois grâce à l\'automatisation intelligente.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    revenue: '+400% CA'
  },
  {
    name: 'Marcus Chen',
    role: 'Dropshipper Expert',
    company: 'Fashion Forward',
    content: 'L\'import multi-fournisseurs est incroyable. Je peux maintenant sourcer depuis 15 fournisseurs différents et tout gérer au même endroit.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    revenue: '+250% Produits'
  },
  {
    name: 'Emma Rodriguez',
    role: 'Store Owner',
    company: 'Home Essentials',
    content: 'Le support client est exceptionnel, et le système de tracking rend mes clients heureux. Mon taux de retour a chuté de 60%.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    revenue: '-60% Retours'
  }
]

const pricingPlans = [
  {
    name: 'Starter',
    price: '29',
    period: '/mois',
    description: 'Parfait pour débuter',
    features: [
      '1,000 produits importés/mois',
      '5 boutiques connectées',
      'SEO IA basique',
      'Tracking standard',
      'Support email'
    ],
    popular: false,
    color: 'border-gray-200'
  },
  {
    name: 'Professional',
    price: '79',
    period: '/mois',
    description: 'Pour les dropshippers sérieux',
    features: [
      '10,000 produits importés/mois',
      'Boutiques illimitées',
      'SEO IA avancée + traduction',
      'Tracking premium + analytics',
      'CRM intégré',
      'Support prioritaire'
    ],
    popular: true,
    color: 'border-orange-500'
  },
  {
    name: 'Enterprise',
    price: '199',
    period: '/mois',
    description: 'Pour les équipes et agences',
    features: [
      'Produits illimités',
      'Multi-utilisateurs',
      'IA personnalisée',
      'API complète',
      'Marketplace B2B privée',
      'Support dédié 24/7'
    ],
    popular: false,
    color: 'border-gray-200'
  }
]

export function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const heroRef = React.useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })

  useEffect(() => {
    updateSEO({
      title: 'DropFlow Pro - Plateforme Dropshipping IA #1 en Europe',
      description: 'Automatisez votre dropshipping avec l\'IA. Import produits, SEO automatique, tracking commandes. Rejoignez 50,000+ dropshippers qui font confiance à DropFlow Pro.',
      keywords: [
        'dropshipping',
        'plateforme dropshipping',
        'import produits',
        'seo automatique',
        'tracking commandes',
        'aliexpress import',
        'shopify sync',
        'ia dropshipping'
      ]
    })
  }, [])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900">DropFlow</span>
              <span className="text-orange-600 font-bold text-xl"> Pro</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="#features" className="text-gray-600 hover:text-gray-900 font-medium">
              Fonctionnalités
            </Link>
            <Link to="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">
              Tarifs
            </Link>
            <Link to="#testimonials" className="text-gray-600 hover:text-gray-900 font-medium">
              Témoignages
            </Link>
            <Link to="/blog" className="text-gray-600 hover:text-gray-900 font-medium">
              Blog
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Se connecter</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                Essai Gratuit
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-blue-50"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-orange-100 text-orange-800 border-orange-200">
              <Star className="w-4 h-4 mr-2" />
              #1 Plateforme Dropshipping Europe
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Automatisez votre{' '}
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                dropshipping
              </span>{' '}
              avec l'IA
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Importez, optimisez et vendez des millions de produits avec notre intelligence artificielle avancée. 
              Rejoignez 50,000+ dropshippers qui automatisent leur succès.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-lg px-8"
                onClick={() => navigate('/register')}
              >
                Commencer Gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Eye className="w-5 h-5 mr-2" />
                Voir la Démo
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              ✅ Essai gratuit 14 jours • ✅ Sans engagement • ✅ Support 24/7
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              Fonctionnalités
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin pour réussir
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">
              Témoignages
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Rejoignez des milliers de dropshippers qui font confiance à DropFlow Pro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                        <p className="text-xs text-gray-500">{testimonial.company}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {testimonial.revenue}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-200">
              Tarifs
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choisissez votre plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des tarifs transparents qui évoluent avec votre business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`h-full relative ${plan.popular ? 'ring-2 ring-orange-500' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white">
                      Plus Populaire
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">€{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      Commencer
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Restez informé des dernières nouveautés
          </h2>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
            Recevez nos conseils dropshipping, études de cas et mises à jour produit directement dans votre boîte mail
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
              required
            />
            <Button type="submit" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
              S'abonner
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-xl">DropFlow</span>
                  <span className="text-orange-500 font-bold text-xl"> Pro</span>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                La plateforme dropshipping la plus puissante pour automatiser votre e-commerce avec l'IA.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="#" className="hover:text-white">Fonctionnalités</Link></li>
                <li><Link to="#" className="hover:text-white">Tarifs</Link></li>
                <li><Link to="#" className="hover:text-white">API</Link></li>
                <li><Link to="#" className="hover:text-white">Intégrations</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="#" className="hover:text-white">À propos</Link></li>
                <li><Link to="#" className="hover:text-white">Blog</Link></li>
                <li><Link to="#" className="hover:text-white">Carrières</Link></li>
                <li><Link to="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="#" className="hover:text-white">Documentation</Link></li>
                <li><Link to="#" className="hover:text-white">Centre d'aide</Link></li>
                <li><Link to="#" className="hover:text-white">Communauté</Link></li>
                <li><Link to="#" className="hover:text-white">Statut</Link></li>
              </ul>
            </div>
          </div>

          <Separator className="bg-gray-800 mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400">
            <p>© 2024 DropFlow Pro. Tous droits réservés.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="#" className="hover:text-white">Politique de confidentialité</Link>
              <Link to="#" className="hover:text-white">Conditions d'utilisation</Link>
              <Link to="#" className="hover:text-white">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
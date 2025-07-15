import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Check, Star, Play, ChevronDown, Menu, X, Zap, Shield,
  Clock, Users, TrendingUp, Package, BarChart3, Globe, Mail, Phone,
  MapPin, MessageCircle, ChevronRight, Bot, Search, Import, Truck,
  Layers, Database, Target, Award, HeadphonesIcon, BookOpen, FileText
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ThemeToggle } from '@/components/theme-toggle'

export function HomePage() {
  const { toast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [email, setEmail] = useState('')

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
      role: 'E-commerce Entrepreneur',
      company: '6 Figure E-com Owner',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'DropFlow Pro n\'est pas juste un autre outil - c\'est le partenaire qui a fait passer mon dropshipping au niveau supérieur.',
      subscribers: '339K subscribers'
    },
    {
      name: 'Marie Dubois',
      role: 'Millionaire Entrepreneur',
      company: 'E-commerce Expert',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'DropFlow Pro est ma solution de référence pour gérer mon business dropshipping. Une plateforme tout-en-un exceptionnelle.',
      subscribers: '1.3M subscribers'
    },
    {
      name: 'Thomas Martin',
      role: 'E-commerce Entrepreneur',
      company: 'Dropshipping Expert',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'J\'ai multiplié mes marges par 2 grâce à DropFlow Pro. L\'automatisation IA est révolutionnaire.',
      subscribers: '187K subscribers'
    },
    {
      name: 'Sophie Laurent',
      role: 'Digital Entrepreneur',
      company: '7 Figure E-com Expert',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'DropFlow Pro a transformé mon approche du dropshipping. Si j\'avais eu cet outil plus tôt, j\'aurais scalé beaucoup plus vite.',
      subscribers: '425K subscribers'
    }
  ]

  const suppliers = [
    { name: 'AliExpress', logo: '🛒' },
    { name: 'Amazon', logo: '📦' },
    { name: 'Shopify', logo: '🛍️' },
    { name: 'BigBuy', logo: '📋' },
    { name: 'Printful', logo: '🖨️' },
    { name: 'Spocket', logo: '⚡' },
    { name: 'Oberlo', logo: '🔄' },
    { name: 'Modalyst', logo: '👗' },
    { name: 'Printify', logo: '🎯' },
    { name: 'Etsy', logo: '🎨' },
    { name: 'eBay', logo: '🏪' },
    { name: 'WooCommerce', logo: '🌐' }
  ]

  const supportResources = [
    {
      icon: BookOpen,
      title: 'Formations Privées Gratuites',
      description: 'Conçues pour emmener n\'importe qui du débutant à la construction d\'une boutique dropshipping de 10K€/mois.',
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
      description: 'Obtenez des réponses instantanées à toutes vos questions avec notre équipe de support dédiée 24/7.',
      action: 'Obtenir de l\'aide →'
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-poppins">
                DropFlow <span className="text-primary">Pro</span>
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                Pourquoi DropFlow Pro? <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                Intégrations <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                Fournisseurs <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                Ressources <ChevronDown className="w-4 h-4" />
              </div>
              <Link to="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Tarifs
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Se connecter
              </Link>
              <Link to="/register">
                <Button className="bg-primary hover:bg-primary/90 text-white font-medium">
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
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 lg:py-32 overflow-hidden">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm font-medium">
                    <Zap className="w-4 h-4 mr-2" />
                    Maintenant avec IA
                  </Badge>
                  
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight font-poppins">
                    Construisez votre boutique{' '}
                    <span className="text-primary">dropshipping</span>{' '}
                    en 2 minutes avec{' '}
                    <span className="text-primary">DropFlow Pro</span>
                  </h1>
                  
                  <p className="text-lg text-muted-foreground max-w-xl">
                    Obtenez une boutique IA prête à vendre. Trouvez les produits les plus vendus. 
                    Sourcez au prix le plus bas. Profitez d'une livraison ultra-rapide. 
                    Bénéficiez d'une expérience dropshipping "tout-en-un" IA.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold">
                      COMMENCER LE DROPSHIPPING
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-primary text-primary hover:bg-primary/5 px-8 py-4 text-lg font-semibold"
                  >
                    LANCER VOTRE BOUTIQUE EN 2 MINUTES
                  </Button>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
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
                <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
                  {/* Browser Bar */}
                  <div className="bg-muted px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-background rounded-md px-3 py-1 text-xs text-muted-foreground">
                      https://app.dropflow.pro/dashboard
                    </div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Dashboard</h3>
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
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Produits gagnants</div>
                            <div className="text-sm text-muted-foreground">Détectés par IA</div>
                          </div>
                        </div>
                        <Badge className="bg-primary/10 text-primary">+15%</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-card p-3 rounded-lg shadow-lg border border-border"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Synchronisation active</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-4 -left-4 bg-card p-3 rounded-lg shadow-lg border border-border"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">+€247 aujourd'hui</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-background">
          <div className="container">
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
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 font-poppins">
                Tout ce dont vous avez besoin pour{' '}
                <span className="text-primary">dominer</span> le dropshipping
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-card">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center`}>
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        {feature.badge && (
                          <Badge className="bg-primary/10 text-primary text-xs">
                            {feature.badge}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl font-semibold">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {feature.description}
                      </p>
                      <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 h-auto font-medium">
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
        <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 font-poppins">
                Vous accompagner dans votre croissance{' '}
                <span className="text-primary">à chaque étape</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comptez sur un support client exceptionnel 24/7. Notre équipe de support professionnel 
                vous accompagne à chaque étape du processus.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Chat Live 24/7</h3>
                <p className="text-muted-foreground">Support</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3s en moyenne</h3>
                <p className="text-muted-foreground">Temps de réponse</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Équipe professionnelle</h3>
                <p className="text-muted-foreground">Équipe de support</p>
              </div>
            </div>

            <div className="text-center">
              <Link to="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold">
                  COMMENCER →
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-4">
                Essai gratuit 14 jours • Annulez à tout moment
              </p>
            </div>
          </div>
        </section>

        {/* Suppliers Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 font-poppins">
                Nos fournisseurs supportés dans le monde entier
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
                  <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                    <span className="text-2xl">{supplier.logo}</span>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    {supplier.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 font-poppins">
                Que disent les autres entrepreneurs{' '}
                <span className="text-primary">à propos de DropFlow Pro ?</span>
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
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          <p className="text-xs text-primary">{testimonial.subscribers}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Resources */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 font-poppins">
                Le support dont vous avez besoin, quand vous en avez besoin.
              </h2>
              <p className="text-xl text-muted-foreground">
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
                  <Card className="h-full border-0 bg-card hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <resource.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-4">
                        {resource.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {resource.description}
                      </p>
                      <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                        {resource.action}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
          <div className="container text-center">
            <h2 className="text-4xl font-bold mb-4 font-poppins">
              Restez informé avec DropFlow Pro
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Recevez les derniers conseils, tendances et mises à jour directement dans votre boîte mail
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
              <Input
                type="email"
                placeholder="Entrez votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70"
                required
              />
              <Button type="submit" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                S'abonner
              </Button>
            </form>
            
            <p className="text-sm mt-4 opacity-70">
              Nous respectons votre vie privée. Désabonnez-vous à tout moment.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold font-poppins">
                  DropFlow <span className="text-primary">Pro</span>
                </span>
              </div>
              <p className="text-muted-foreground mb-6">
                La plateforme dropshipping la plus puissante pour les entreprises e-commerce modernes.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Intégrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Ressources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Communauté</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Statut</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <span className="text-muted-foreground text-sm">Politique de confidentialité</span>
              <span className="text-muted-foreground text-sm">Conditions d'utilisation</span>
              <span className="text-muted-foreground text-sm">Cookies</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-muted-foreground text-sm">4.9/5 • 15,000 avis</span>
            </div>
          </div>

          <div className="text-center text-muted-foreground text-sm mt-8">
            © 2024 DropFlow Pro. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Check, 
  Star, 
  Play, 
  ChevronDown, 
  Menu, 
  X,
  Zap,
  Shield,
  Clock,
  Users,
  TrendingUp,
  Package,
  BarChart3,
  Globe,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { useToast } from '@/hooks/use-toast'

export function HomePage() {
  const { toast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Merci !",
      description: "Vous êtes maintenant abonné à notre newsletter.",
    })
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Exact AutoDS Style */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">DropFlow</span>
                <span className="text-xl font-bold text-blue-600">Pro</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  Solutions
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
              </div>
              <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium">Pricing</a>
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  Resources
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
              </div>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
            </nav>
            
            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="hidden sm:flex text-gray-700 hover:text-blue-600">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                  Start Free Trial
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
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-gray-700 font-medium">Features</a>
              <a href="#pricing" className="block text-gray-700 font-medium">Pricing</a>
              <a href="#contact" className="block text-gray-700 font-medium">Contact</a>
              <div className="pt-4 border-t border-gray-200">
                <Link to="/login" className="block mb-2">
                  <Button variant="ghost" className="w-full justify-start">Log in</Button>
                </Link>
                <Link to="/register" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Free Trial</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - AutoDS Style */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Badge className="bg-blue-100 text-blue-700 px-4 py-2 text-sm font-medium">
                <Star className="w-4 h-4 mr-2" />
                Trusted by 50,000+ dropshippers worldwide
              </Badge>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Automate Your Product Import{' '}
              <span className="text-blue-600">Workflow</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              The most powerful dropshipping platform to import, optimize, and scale your 
              e-commerce business with AI-powered tools.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link to="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500"
            >
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Cancel anytime
              </div>
            </motion.div>
          </div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                {/* Browser Bar */}
                <div className="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white rounded px-3 py-1 text-sm text-gray-500 text-center max-w-md mx-auto">
                      app.dropflow.pro/dashboard
                    </div>
                  </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">€45,231</div>
                      <div className="text-gray-600">Revenue This Month</div>
                      <div className="text-green-600 text-sm mt-1">+23% vs last month</div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-2">2,847</div>
                      <div className="text-gray-600">Products Imported</div>
                      <div className="text-green-600 text-sm mt-1">+12% vs last month</div>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 mb-2">1,234</div>
                      <div className="text-gray-600">Orders Tracked</div>
                      <div className="text-green-600 text-sm mt-1">+8% vs last month</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 h-48 flex items-center justify-center">
                    <BarChart3 className="w-12 h-12 text-gray-400" />
                    <span className="ml-4 text-gray-500">Analytics Dashboard</span>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="text-sm font-medium">Live Update</div>
                <div className="text-xs">+€2,340 today</div>
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <div className="text-sm font-medium">Auto Import</div>
                <div className="text-xs">127 new products</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">50K+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">15M+</div>
              <div className="text-gray-300">Products Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">€250M+</div>
              <div className="text-gray-300">Revenue Generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">180+</div>
              <div className="text-gray-300">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - AutoDS Style */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Scale Your Dropshipping Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to automate your workflow and maximize profits
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Package,
                title: "Multi-Supplier Import",
                description: "Import products from AliExpress, BigBuy, Eprolo, and 20+ suppliers with one click",
                stats: "2M+ products"
              },
              {
                icon: Zap,
                title: "AI SEO Optimization",
                description: "Automatically generate SEO-optimized titles, descriptions, and keywords in 10+ languages",
                stats: "95% accuracy"
              },
              {
                icon: TrendingUp,
                title: "Shopify Sync",
                description: "Real-time bidirectional sync with Shopify, WooCommerce, and PrestaShop",
                stats: "99.9% uptime"
              },
              {
                icon: BarChart3,
                title: "Advanced Tracking",
                description: "Track orders from 1000+ carriers with automated customer notifications",
                stats: "24/7 monitoring"
              },
              {
                icon: Users,
                title: "Built-in CRM",
                description: "Manage customers, leads, and support tickets in one unified dashboard",
                stats: "50+ integrations"
              },
              {
                icon: Globe,
                title: "Smart Analytics",
                description: "Real-time insights on sales, profits, and winning products with AI predictions",
                stats: "<2min response"
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.stats}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - AutoDS Style */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, scale as you grow
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "29",
                description: "Perfect for beginners",
                features: [
                  "1,000 products/month",
                  "1 store connection",
                  "Basic price monitoring",
                  "Email support",
                  "Essential analytics"
                ],
                popular: false
              },
              {
                name: "Professional",
                price: "79",
                description: "For serious entrepreneurs",
                features: [
                  "10,000 products/month",
                  "5 store connections",
                  "Advanced AI optimization",
                  "Real-time monitoring",
                  "Complete analytics",
                  "Priority support",
                  "Premium integrations"
                ],
                popular: true
              },
              {
                name: "Enterprise",
                price: "199",
                description: "Custom solution",
                features: [
                  "Unlimited products",
                  "Unlimited stores",
                  "Custom AI models",
                  "Full API access",
                  "Dedicated manager",
                  "Custom training",
                  "SLA guarantee"
                ],
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`p-8 relative ${
                plan.popular 
                  ? 'border-2 border-blue-500 shadow-xl bg-blue-50' 
                  : 'border border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-0">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-gray-900">€{plan.price}</span>
                      <span className="text-gray-500 ml-2">/month</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button className={`w-full py-3 ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}>
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 50,000+ dropshippers who trust DropFlow Pro to automate their success
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
              Talk to Sales
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-blue-100">
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              14-day free trial
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              24/7 support
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              No commitment
            </div>
          </div>
        </div>
      </section>

      {/* Footer - AutoDS Style */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">DropFlow</span>
                <span className="text-xl font-bold text-blue-400 ml-1">Pro</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The most powerful dropshipping platform for modern e-commerce businesses.
                Trusted by thousands of successful entrepreneurs worldwide.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 text-gray-400 hover:text-white">
                  <Mail className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 text-gray-400 hover:text-white">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 text-gray-400 hover:text-white">
                  <MapPin className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 DropFlow Pro. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
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
  MapPin,
  MessageCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export function HomePage() {
  const { toast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Thank you!",
      description: "You're now subscribed to our newsletter.",
    })
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Exact AutoDS Style */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-gray-900">AUTO</div>
                <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded"></div>
                </div>
                <div className="text-2xl font-bold text-gray-900">DS</div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-gray-900 font-medium">
                  Why AutoDS?
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
              </div>
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-gray-900 font-medium">
                  Integrations
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
              </div>
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-gray-900 font-medium">
                  Suppliers
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
              </div>
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-gray-900 font-medium">
                  Resources
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
              </div>
              <a href="#pricing" className="text-gray-700 hover:text-gray-900 font-medium">Pricing</a>
            </nav>
            
            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="hidden sm:flex text-gray-700 hover:text-gray-900 font-medium">
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white px-6 font-medium rounded-full">
                  GET STARTED →
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
      </header>

      {/* Hero Section - Exact AutoDS Style */}
      <section className="relative bg-gradient-to-br from-pink-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Build your dropshipping store in 2 minutes with AutoDS
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 mb-6"
              >
                <Zap className="w-5 h-5 text-orange-500" />
                <span className="text-orange-600 font-medium">Now with AI</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 mb-8 leading-relaxed"
              >
                Get a free ready-to-sell AI store. Find best-selling products. Source at the lowest price. Enjoy light-speed delivery. Get an 'all-in-one' AI dropshipping experience.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-6"
              >
                <Link to="/register">
                  <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 text-lg font-medium rounded-full">
                    START DROPSHIPPING
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2 border-pink-500 text-pink-500 hover:bg-pink-50 rounded-full font-medium">
                  LAUNCH YOUR STORE IN 2 MINUTES
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-6 text-sm text-gray-500"
              >
                <span>14 day trial for $1</span>
                <span>•</span>
                <span>Cancel any time</span>
              </motion.div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Dashboard */}
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  <div className="p-8">
                    {/* Dashboard Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <img
                          src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60"
                          alt="User"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">Sarah Johnson</div>
                          <div className="text-sm text-gray-500">Store Owner</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">$1,060</div>
                        <div className="text-sm text-gray-500">Daily Profit</div>
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">98</div>
                        <div className="text-sm text-gray-600">Orders</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">156</div>
                        <div className="text-sm text-gray-600">Products</div>
                      </div>
                    </div>

                    {/* Product List */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=60"
                          alt="Product"
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">Wireless Headphones</div>
                          <div className="text-xs text-gray-500">Electronics</div>
                        </div>
                        <div className="text-sm font-medium text-green-600">$89.99</div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src="https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=60"
                          alt="Product"
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">Smart Watch</div>
                          <div className="text-xs text-gray-500">Wearables</div>
                        </div>
                        <div className="text-sm font-medium text-green-600">$199.99</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-sm font-medium">✓ Winning products updated</div>
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <div className="text-sm font-medium">📦 Tracking updated</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">1.8M+</div>
              <div className="text-gray-600">Dropshippers use AutoDS</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">$1B+</div>
              <div className="text-gray-600">Earned by our dropshippers</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">800M+</div>
              <div className="text-gray-600">Winning products available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* AI Store Builder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="bg-blue-100 rounded-2xl p-8">
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="AI Store Builder"
                className="w-full rounded-lg"
              />
            </div>
            <div>
              <div className="text-sm text-blue-600 font-medium mb-2">01. AI STORE BUILDER</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                AI-built Shopify store
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Get an AI-built Shopify store with winning products & ready to sell pages to kickstart your dropshipping business.
              </p>
              <Button variant="outline" className="text-gray-600 border-gray-300">
                Get Started →
              </Button>
            </div>
          </div>

          {/* Product Research */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1">
              <div className="text-sm text-blue-600 font-medium mb-2">02. FIND PRODUCTS</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Product research system
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Instantly compare 8M+ trending products from global suppliers and add to your store in one click.
              </p>
              <Button variant="outline" className="text-gray-600 border-gray-300">
                Get Started →
              </Button>
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <img
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Product Research"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Product Imports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="bg-pink-50 rounded-2xl p-8">
              <img
                src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Product Imports"
                className="w-full rounded-lg"
              />
            </div>
            <div>
              <div className="text-sm text-blue-600 font-medium mb-2">03. IMPORT</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Product imports
                <span className="text-orange-500 ml-2">Now with AI</span>
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Import 500M+ products from global suppliers in one click.
              </p>
              <Button variant="outline" className="text-gray-600 border-gray-300">
                Get Started →
              </Button>
            </div>
          </div>

          {/* Order Fulfillment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1">
              <div className="text-sm text-blue-600 font-medium mb-2">04. AUTOMATE ORDERS</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Fulfilled by AutoDS
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Automate orders, tracking updates, and returns without needing a buyer account.
              </p>
              <Button variant="outline" className="text-gray-600 border-gray-300">
                Get Started →
              </Button>
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Order Fulfillment"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Print on Demand */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="bg-gray-100 rounded-2xl p-8">
              <img
                src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Print on Demand"
                className="w-full rounded-lg"
              />
            </div>
            <div>
              <div className="text-sm text-blue-600 font-medium mb-2">05. POD</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Print on demand
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Create and sell a wide range of custom-designed products directly through AutoDS.
              </p>
              <Button variant="outline" className="text-gray-600 border-gray-300">
                Get Started →
              </Button>
            </div>
          </div>

          {/* Product Sourcing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="text-sm text-blue-600 font-medium mb-2">06. AUTODS SOURCING</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Product Sourcing
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Send any product link or images to our team, and we will source it for you, stock it in our warehouses at lower prices, and ship it directly to your customers with custom packaging and branding.
              </p>
              <Button variant="outline" className="text-gray-600 border-gray-300">
                Get Started →
              </Button>
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-blue-50 rounded-2xl p-8">
                <img
                  src="https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Product Sourcing"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Supporting your growth every step of the way
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Rely on exceptional customer support 24/7. Our professional support team has your back every step of the way.
              </p>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="font-semibold text-gray-900">24/7 Live Chat</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="font-semibold text-gray-900">3s average</div>
                  <div className="text-sm text-gray-600">response time</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="font-semibold text-gray-900">Professional</div>
                  <div className="text-sm text-gray-600">support team</div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full">
                  GET STARTED →
                </Button>
                <div className="text-sm text-gray-500 flex items-center">
                  14 day trial for $1 • Cancel any time
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">AutoDS Support</div>
                    <div className="text-sm text-green-500">● Online</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="text-sm">Hi there! I'm here to help you get started with AutoDS. What can I help you with today?</div>
                  </div>
                  <div className="bg-blue-500 text-white p-3 rounded-lg ml-8">
                    <div className="text-sm">I need help setting up my first store</div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="text-sm">Great! I'll walk you through the process step by step. Let's start with...</div>
                  </div>
                </div>
                
                <img
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Support Agent"
                  className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suppliers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our supported worldwide suppliers
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Work with reliable and trustworthy suppliers from all over the world that are supported by AutoDS.
          </p>
          
          {/* Supplier Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center mb-12">
            {[
              'AliExpress', 'Amazon', 'Etsy', 'eBay', 'WooCommerce', 'Shopify',
              'Home Depot', 'Banggood', 'Walmart', 'Target', 'Costco', 'Facebook',
              'Overstock', 'CostWay', 'DHgate', 'Wix', 'TikTok', 'Amazon'
            ].map((supplier, index) => (
              <div key={index} className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-600 font-medium text-sm">{supplier}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button variant="outline" className="text-gray-600 border-gray-300">
              Show more suppliers
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            The all-in-one tool you need to streamline and grow your business
          </h2>
          
          <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 text-lg font-medium rounded-full mb-6">
            GET STARTED →
          </Button>
          
          <div className="text-gray-400">
            14 day trial for $1 • Cancel any time
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            What do other entrepreneurs say about AutoDS?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {[
              {
                name: "Jordan Welche",
                role: "6 Figure E-com Owner, SaaS Founder",
                image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200",
                quote: "AutoDS isn't just another tool - it's the partner that took my dropshipping game to the next level. It's automation at its finest and faster than I ever thought possible."
              },
              {
                name: "Baddie In Business",
                role: "Millionaire Entrepreneur, YouTuber",
                image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=200",
                quote: "AutoDS is my go-to solution for running my dropshipping business. It's an all-in-one platform that's ahead of the game, offering automatic dropshipping and making my life easier!"
              },
              {
                name: "Yomi Denzel",
                role: "8 Figure Entrepreneur, Influencer",
                image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=200",
                quote: "I consistently had a 30-40% margin from my dropshipping stores and thought I couldn't do any better. But little did I know, that AutoDS would take my margins to a whole new level."
              },
              {
                name: "Sebastian Ghiorghiu",
                role: "Digital Entrepreneur, E-com Owner",
                image: "https://images.pexels.com/photos/2379006/pexels-photo-2379006.jpeg?auto=compress&cs=tinysrgb&w=200",
                quote: "AutoDS took the dropshipping. If I had to have scaled way faster and my whole team in one platform."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-bold text-gray-900 mb-1">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{testimonial.role}</p>
                  <p className="text-sm text-gray-700 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" size="sm" className="w-10 h-10 p-0 rounded-full">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="w-10 h-10 p-0 rounded-full">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Review Badges */}
          <div className="flex justify-center items-center gap-8 mt-12">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-sm font-medium">app.store</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
                ))}
              </div>
              <div className="text-sm font-medium">Capterra</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-blue-400 text-blue-400" />
                ))}
              </div>
              <div className="text-sm font-medium">GetApp</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-red-400 text-red-400" />
                ))}
              </div>
              <div className="text-sm font-medium">G2</div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Resources */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Support you need, when you need it.
            </h2>
            <p className="text-xl text-gray-600">
              Find top resources tailored to your needs...
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center bg-orange-50">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Free Private Courses</h3>
                <p className="text-gray-600 mb-6">
                  Designed & proven to take anyone from beginner to building a $10k/month dropshipping store - (valued $499)
                </p>
                <Button variant="outline" className="text-gray-600 border-gray-300">
                  Learn →
                </Button>
              </CardContent>
            </Card>
            
            <Card className="p-8 text-center bg-blue-50">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Beginner's Playbook</h3>
                <p className="text-gray-600 mb-6">
                  Get the latest strategies, best sellers, and step-by-step playbooks from the top 1% of dropshippers.
                </p>
                <Button variant="outline" className="text-gray-600 border-gray-300">
                  Read →
                </Button>
              </CardContent>
            </Card>
            
            <Card className="p-8 text-center bg-pink-50">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Help Center</h3>
                <p className="text-gray-600 mb-6">
                  Get instant answers to all your questions and challenges with our 24/7 dedicated support team.
                </p>
                <Button variant="outline" className="text-gray-600 border-gray-300">
                  Get help →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dropshipping Pro Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            A Dropshipping Pro by your side
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            AutoDS helps all dropshippers with all-in-one automation tools and learning resources to guide them from beginners to experts.
          </p>
          
          <div className="flex justify-center gap-4 mb-12">
            <Button variant="outline" className="px-8 py-3 rounded-full border-2">
              Start selling
            </Button>
            <Button className="bg-gray-900 text-white px-8 py-3 rounded-full">
              Grow your business
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-900 text-white p-12 rounded-2xl text-left">
              <h3 className="text-3xl font-bold mb-8">Start selling</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Find winning dropshipping products</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Full access to free dropshipping courses & eBooks</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Beginner-friendly setup</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Dropshipping Help Center & 1-to-1 chat support</span>
                </li>
              </ul>
              <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full">
                START DROPSHIPPING
              </Button>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-pink-100 to-orange-100 p-8 rounded-2xl">
                <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Today</span>
                    <span className="text-2xl font-bold">$1,060</span>
                  </div>
                  <div className="text-sm text-gray-600">Daily sales</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <img
                      src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100"
                      alt="Product"
                      className="w-full h-20 object-cover rounded mb-2"
                    />
                    <div className="text-sm font-medium">Wireless Headphones</div>
                    <div className="text-xs text-gray-500">$89.99</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <img
                      src="https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=100"
                      alt="Product"
                      className="w-full h-20 object-cover rounded mb-2"
                    />
                    <div className="text-sm font-medium">Smart Watch</div>
                    <div className="text-xs text-gray-500">$199.99</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4">
                  <img
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Happy entrepreneur"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Frequently asked questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "What is AutoDS?",
              "Can I cancel anytime?",
              "Does AutoDS automate orders for me?",
              "Can I manage more than one store on AutoDS?",
              "Does AutoDS come with a trial?",
              "How does finding products work on AutoDS?",
              "Does AutoDS monitor price and stock for me?",
              "Can I use AutoDS as a beginner?",
              "How much do I pay after a trial?",
              "Do you offer a full-scale order management service?",
              "Can AutoDS help me with tracking?",
              "Is AutoDS chat support 24/7?"
            ].map((question, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{question}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-6">
                <div className="text-2xl font-bold text-gray-900">AUTO</div>
                <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center mx-1">
                  <div className="w-3 h-3 bg-white rounded"></div>
                </div>
                <div className="text-2xl font-bold text-gray-900">DS</div>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">About Us</a></li>
                <li><a href="#" className="hover:text-gray-900">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-900">Status</a></li>
                <li><a href="#" className="hover:text-gray-900">Feedback</a></li>
                <li><a href="#" className="hover:text-gray-900">Careers - we're hiring</a></li>
                <li><a href="#" className="hover:text-gray-900">Legal</a></li>
              </ul>
            </div>
            
            {/* Features */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">FEATURES</h3>
              <ul className="space-y-3 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Product finding</a></li>
                <li><a href="#" className="hover:text-gray-900">Ads Spy tools</a></li>
                <li><a href="#" className="hover:text-gray-900">Print on demand</a></li>
                <li><a href="#" className="hover:text-gray-900">Products importer</a></li>
                <li><a href="#" className="hover:text-gray-900">Automatic orders</a></li>
                <li><a href="#" className="hover:text-gray-900">Automatic price optimization</a></li>
                <li><a href="#" className="hover:text-gray-900">Price & stock monitoring</a></li>
                <li><a href="#" className="hover:text-gray-900">Fulfilled by AutoDS</a></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">RESOURCES</h3>
              <ul className="space-y-3 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900">Courses</a></li>
                <li><a href="#" className="hover:text-gray-900">Affiliate</a></li>
                <li><a href="#" className="hover:text-gray-900">Webinars</a></li>
                <li><a href="#" className="hover:text-gray-900">Alternatives</a></li>
                <li><a href="#" className="hover:text-gray-900">Testimonials</a></li>
                <li><a href="#" className="hover:text-gray-900">View more</a></li>
              </ul>
            </div>
            
            {/* Sell On */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">SELL ON</h3>
              <ul className="space-y-3 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">eBay dropshipping tool</a></li>
                <li><a href="#" className="hover:text-gray-900">Shopify dropshipping app</a></li>
                <li><a href="#" className="hover:text-gray-900">Facebook marketplace software</a></li>
                <li><a href="#" className="hover:text-gray-900">Wix dropshipping app</a></li>
                <li><a href="#" className="hover:text-gray-900">WooCommerce dropshipping tool</a></li>
                <li><a href="#" className="hover:text-gray-900">Amazon dropshipping tool</a></li>
                <li><a href="#" className="hover:text-gray-900">Etsy dropshipping tool</a></li>
                <li><a href="#" className="hover:text-gray-900">TikTok shop dropshipping app</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-gray-800 rounded"></div>
                <div className="w-6 h-6 bg-gray-800 rounded"></div>
                <div className="w-6 h-6 bg-gray-800 rounded"></div>
                <div className="w-6 h-6 bg-gray-800 rounded"></div>
                <div className="w-6 h-6 bg-gray-800 rounded"></div>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-green-400 text-green-400" />
                  ))}
                </div>
                <div className="text-xs text-gray-600">Trustpilot</div>
                <div className="text-xs text-gray-500">1,000+ reviews</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-green-400 text-green-400" />
                  ))}
                </div>
                <div className="text-xs text-gray-600">Trustpilot</div>
                <div className="text-xs text-gray-500">30,000+ reviews</div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>Privacy Policy • Terms of Service • AutoDS Dropshipping Policy • All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
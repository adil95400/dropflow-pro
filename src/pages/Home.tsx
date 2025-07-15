import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Check, Star, Play, ChevronDown, Menu, X, Zap, Shield,
  Clock, Users, TrendingUp, Package, BarChart3, Globe, Mail, Phone,
  MapPin, MessageCircle, ChevronRight, ChevronLeft
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
      title: "Merci !",
      description: "Vous êtes maintenant inscrit à la newsletter DropFlow.",
    })
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-orange-500">DropFlow</Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#features" className="hover:text-orange-600">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-orange-600">Tarifs</a>
            <a href="#testimonials" className="hover:text-orange-600">Témoignages</a>
            <a href="#demo" className="hover:text-orange-600">Démo</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">Connexion</Link>
            <Link to="/register">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-2">
                Essai Gratuit
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-br from-orange-50 to-pink-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Automatisez Votre Dropshipping avec l'IA
            </motion.h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
              La plateforme la plus avancée pour importer, optimiser et scaler votre business e-commerce. IA intégrée, synchronisation temps réel, tracking intelligent.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-3">
                  Démarrer gratuitement
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="rounded-full px-6 py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-50">
                Voir la démo
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
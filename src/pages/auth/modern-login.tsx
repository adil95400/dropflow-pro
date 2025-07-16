import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Github, Mail, Zap, ArrowRight, Shield, Star, Building2, Users, TrendingUp } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { auth } from '@/lib/supabase'

export function ModernLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await auth.signIn(email, password)
      if (error) throw error
      
      toast({
        title: "Connexion réussie !",
        description: "Vous êtes maintenant connecté à DropFlow Pro.",
      })
      navigate('/app/dashboard')
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Impossible de se connecter. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    try {
      const { error } = await auth.signInWithOAuth(provider)
      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || `Impossible de se connecter avec ${provider}.`,
        variant: "destructive",
      })
    }
  }

  const stats = [
    { icon: Users, value: '50,000+', label: 'Utilisateurs actifs' },
    { icon: Building2, value: '180+', label: 'Pays couverts' },
    { icon: TrendingUp, value: '€250M+', label: 'Revenus générés' }
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-2xl text-gray-900 dark:text-white">DropFlow</span>
              <span className="text-blue-600 font-bold text-2xl"> Pro</span>
            </div>
          </div>

          <Card className="border-0 shadow-none p-0">
            <CardHeader className="px-0 pb-6">
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                Bon retour !
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                Connectez-vous à votre compte DropFlow Pro
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-0 space-y-6">
              {/* OAuth Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleOAuthSignIn('google')}
                  className="h-12 border-2 hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleOAuthSignIn('github')}
                  className="h-12 border-2 hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Github className="w-5 h-5 mr-2" />
                  GitHub
                </Button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-900 px-4 text-gray-500">
                    Ou continuer avec
                  </span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Adresse email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nom@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 border-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Entrez votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 border-2 focus:border-blue-500 focus:ring-blue-500 pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg shadow-lg" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Connexion...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Se connecter
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Pas encore de compte ?{' '}
                </span>
                <Link 
                  to="/register" 
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Créer un compte
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right Side - Marketing Content */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-blue-700 text-white p-12 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-lg space-y-8"
        >
          <div>
            <Badge className="bg-white/20 text-white border-white/30 mb-6">
              <Star className="w-4 h-4 mr-2" />
              #1 Plateforme Dropshipping Europe
            </Badge>
            <h1 className="text-4xl font-bold mb-6">
              Rejoignez 50,000+ dropshippers qui automatisent leur succès
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Importez, optimisez et vendez des millions de produits avec notre IA avancée. 
              Commencez votre essai gratuit dès aujourd'hui.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="Marie Dubois"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">Marie Dubois</p>
                <p className="text-blue-200 text-sm">E-commerce Manager</p>
              </div>
            </div>
            <p className="text-blue-100 italic mb-4">
              "DropFlow Pro a transformé notre business. Nous avons multiplié notre CA par 5 
              en 6 mois grâce à l'automatisation intelligente."
            </p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-blue-200">
            <Shield className="w-5 h-5" />
            <span className="text-sm">Sécurisé • Conforme RGPD • Support 24/7</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
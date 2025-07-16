import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  FileText,
  Calendar,
  Clock,
  Edit,
  Trash2,
  Eye,
  Plus,
  Search,
  Filter,
  Sparkles,
  Zap,
  BarChart3,
  Globe,
  Tag,
  MessageSquare,
  ThumbsUp,
  Share2,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Bookmark,
  ArrowUpRight
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { AIBlogGenerator, BlogPost } from '@/lib/blog/ai-generator'

interface BlogPostWithStats extends BlogPost {
  views?: number
  likes?: number
  comments?: number
  shares?: number
}

const blogCategories = [
  'Dropshipping',
  'E-commerce',
  'Marketing',
  'SEO',
  'Produits Tendance',
  'Fournisseurs',
  'Logistique',
  'Shopify',
  'Réseaux Sociaux',
  'Études de Cas'
]

export function BlogPage() {
  const { user } = useAuth()
  const [blogPosts, setBlogPosts] = useState<BlogPostWithStats[]>([])
  const [selectedPost, setSelectedPost] = useState<BlogPostWithStats | null>(null)
  const [isGeneratingPost, setIsGeneratingPost] = useState(false)
  const [isAddingPost, setIsAddingPost] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [generationParams, setGenerationParams] = useState({
    topic: '',
    keywords: '',
    audience: 'dropshippers débutants',
    tone: 'professional' as 'professional' | 'casual' | 'expert'
  })
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    tags: [],
    status: 'draft'
  })

  const blogGenerator = new AIBlogGenerator()

  useEffect(() => {
    loadBlogPosts()
  }, [user])

  const loadBlogPosts = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Mock data - in production, load from Supabase
      const mockPosts: BlogPostWithStats[] = [
        {
          id: '1',
          title: '10 Produits Gagnants Dropshipping 2024 : Analyse Complète',
          slug: '10-produits-gagnants-dropshipping-2024',
          excerpt: 'Découvrez les produits les plus rentables pour votre boutique dropshipping en 2024, avec analyses de marché et stratégies de vente.',
          content: `# 10 Produits Gagnants Dropshipping 2024

Le dropshipping continue d'évoluer en 2024, avec de nouvelles opportunités et tendances émergentes. Voici notre analyse des 10 produits les plus prometteurs...

## 1. Montres Connectées Sport

Les montres connectées restent un marché en forte croissance, particulièrement dans le segment sport et fitness.

**Pourquoi ça marche :**
- Marché en croissance de 15% par an
- Marge élevée (100-200%)
- Forte demande toute l'année

**Stratégie recommandée :**
- Cibler les sportifs et fitness enthusiasts
- Mettre en avant les fonctionnalités santé
- Prix recommandé : 80-120€

## 2. Accessoires iPhone 15

Avec le lancement de l'iPhone 15, les accessoires représentent une opportunité majeure.

**Produits phares :**
- Coques transparentes antichoc
- Chargeurs MagSafe
- Supports voiture magnétiques

## 3. Produits Écologiques

La tendance écologique continue de croître, offrant de belles opportunités.

**Exemples :**
- Pailles réutilisables
- Sacs en matières recyclées
- Produits zéro déchet

*Article généré par DropFlow Pro IA*`,
          author: 'DropFlow Pro IA',
          publishedAt: '2024-01-15',
          scheduledFor: undefined,
          status: 'published',
          tags: ['produits-gagnants', 'tendances', 'analyse-marché'],
          seoTitle: '10 Produits Gagnants Dropshipping 2024 : Guide Complet [Étude de Marché]',
          seoDescription: 'Découvrez les 10 produits dropshipping les plus rentables de 2024. Analyse complète, marges, fournisseurs et stratégies marketing pour maximiser vos profits.',
          featuredImage: 'https://images.pexels.com/photos/6169659/pexels-photo-6169659.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          userId: user.id,
          views: 12547,
          likes: 234,
          comments: 45,
          shares: 89
        },
        {
          id: '2',
          title: 'SEO Dropshipping : Guide Complet pour Optimiser vos Fiches Produits',
          slug: 'seo-dropshipping-guide-complet-optimisation',
          excerpt: 'Maîtrisez le SEO pour vos produits dropshipping : techniques avancées, outils IA et stratégies pour dominer Google.',
          content: `# SEO Dropshipping : Guide Complet

L'optimisation SEO est cruciale pour le succès de votre boutique dropshipping. Voici comment optimiser efficacement vos fiches produits...

## Recherche de Mots-Clés

La base du SEO commence par une recherche approfondie de mots-clés.

**Outils recommandés :**
- Google Keyword Planner
- SEMrush
- Ahrefs
- DropFlow Pro IA (inclus)

## Optimisation des Titres

Un bon titre produit doit :
- Contenir le mot-clé principal
- Être accrocheur et descriptif
- Respecter la limite de 60 caractères

**Exemple :**
❌ "Montre"
✅ "Montre Connectée Sport GPS Étanche - Autonomie 7 Jours"

## Descriptions Optimisées

Vos descriptions doivent être :
- Uniques (pas de copier-coller fournisseur)
- Riches en mots-clés naturels
- Orientées bénéfices client

*Optimisé avec DropFlow Pro IA*`,
          author: 'DropFlow Pro IA',
          publishedAt: '2024-01-18',
          scheduledFor: undefined,
          status: 'published',
          tags: ['seo', 'optimisation', 'fiches-produits'],
          seoTitle: 'SEO Dropshipping : Guide Ultime d\'Optimisation [2024]',
          seoDescription: 'Optimisez vos fiches produits dropshipping pour Google. Techniques SEO avancées, mots-clés rentables et stratégies d\'optimisation pour augmenter votre trafic organique.',
          featuredImage: 'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          userId: user.id,
          views: 8934,
          likes: 156,
          comments: 23,
          shares: 67
        },
        {
          id: '3',
          title: 'Comment Automatiser votre Dropshipping avec l\'IA en 2024',
          slug: 'automatiser-dropshipping-ia-2024',
          excerpt: 'Découvrez comment l\'intelligence artificielle révolutionne le dropshipping et comment l\'utiliser pour automatiser votre business.',
          content: `# Comment Automatiser votre Dropshipping avec l'IA en 2024

L'intelligence artificielle transforme radicalement le dropshipping en 2024. Voici comment en tirer parti...

## Génération de Contenu

L'IA peut désormais créer automatiquement :
- Descriptions produits optimisées SEO
- Emails marketing personnalisés
- Articles de blog thématiques
- Réponses service client

## Analyse de Marché

Les algorithmes d'IA peuvent :
- Identifier les produits tendance avant la concurrence
- Analyser les commentaires clients pour améliorer l'offre
- Prédire les variations saisonnières
- Optimiser les prix en temps réel

## Automatisation des Tâches

Gagnez du temps avec :
- Import produits intelligent
- Traduction multi-langue instantanée
- Optimisation SEO automatique
- Suivi commandes et notifications clients

*Article généré et optimisé par DropFlow Pro IA*`,
          author: 'DropFlow Pro IA',
          publishedAt: undefined,
          scheduledFor: '2024-02-05',
          status: 'scheduled',
          tags: ['ia', 'automatisation', 'productivité'],
          seoTitle: 'IA et Dropshipping : Guide d\'Automatisation Complet [2024]',
          seoDescription: 'Comment utiliser l\'intelligence artificielle pour automatiser votre business dropshipping en 2024. Outils, stratégies et cas pratiques pour multiplier vos revenus.',
          featuredImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          userId: user.id,
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0
        },
        {
          id: '4',
          title: '5 Stratégies de Marketing TikTok pour Dropshippers',
          slug: '5-strategies-marketing-tiktok-dropshippers',
          excerpt: 'Exploitez la puissance de TikTok pour promouvoir vos produits dropshipping avec ces 5 stratégies éprouvées.',
          content: `# 5 Stratégies de Marketing TikTok pour Dropshippers

TikTok est devenu un canal incontournable pour les dropshippers. Voici comment l'exploiter efficacement...

## 1. Créer des Unboxing Produits

Les vidéos de déballage génèrent un engagement exceptionnel :
- Montrez l'expérience complète
- Mettez en avant la qualité et les détails
- Créez un effet "wow" avec la présentation

## 2. Collaborer avec des Micro-Influenceurs

Les micro-influenceurs offrent :
- Meilleur rapport coût/engagement
- Audience plus ciblée et fidèle
- Authenticité perçue plus forte

## 3. Utiliser les TikTok Ads

Optimisez vos campagnes avec :
- Format In-Feed Ads
- Spark Ads (amplification de contenu organique)
- Collection Ads pour showcases produits

## 4. Créer des Challenges Viraux

Lancez des challenges liés à vos produits :
- Utilisez des hashtags uniques
- Offrez des récompenses aux participants
- Encouragez le contenu généré par les utilisateurs

## 5. Exploiter les Tendances

Restez pertinent en :
- Adaptant les sons et effets tendance
- Participant aux challenges populaires
- Réagissant rapidement aux mèmes du moment

*Article en cours de rédaction par DropFlow Pro IA*`,
          author: 'DropFlow Pro IA',
          publishedAt: undefined,
          scheduledFor: undefined,
          status: 'draft',
          tags: ['tiktok', 'marketing', 'réseaux-sociaux'],
          seoTitle: 'Marketing TikTok pour Dropshipping : 5 Stratégies Qui Cartonnent [2024]',
          seoDescription: 'Découvrez 5 stratégies TikTok éprouvées pour promouvoir vos produits dropshipping. Guide complet pour créer des campagnes virales et booster vos ventes.',
          featuredImage: 'https://images.pexels.com/photos/5081918/pexels-photo-5081918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          userId: user.id,
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0
        }
      ]

      setBlogPosts(mockPosts)
    } catch (error) {
      console.error('Error loading blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus
    const matchesCategory = selectedCategory === 'all' || post.tags.includes(selectedCategory)

    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleGeneratePost = async () => {
    if (!user) return
    
    try {
      setIsGeneratingPost(true)
      
      // Parse keywords
      const keywords = generationParams.keywords.split(',').map(k => k.trim()).filter(Boolean)
      
      // Generate blog post with AI
      const generatedPost = await blogGenerator.generateBlogPost(
        generationParams.topic,
        keywords,
        generationParams.audience,
        generationParams.tone
      )
      
      // Add to state
      const newBlogPost: BlogPostWithStats = {
        ...generatedPost,
        id: Date.now().toString(),
        userId: user.id,
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0
      }
      
      setBlogPosts([newBlogPost, ...blogPosts])
      setSelectedPost(newBlogPost)
      
      // Reset form
      setGenerationParams({
        topic: '',
        keywords: '',
        audience: 'dropshippers débutants',
        tone: 'professional'
      })
      
    } catch (error) {
      console.error('Error generating blog post:', error)
    } finally {
      setIsGeneratingPost(false)
    }
  }

  const handleAddPost = async () => {
    if (!user || !newPost.title || !newPost.content) return
    
    try {
      const blogPost: BlogPostWithStats = {
        id: Date.now().toString(),
        title: newPost.title || '',
        slug: newPost.title?.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') || '',
        excerpt: newPost.excerpt || '',
        content: newPost.content || '',
        author: user.user_metadata?.full_name || user.email || 'DropFlow User',
        publishedAt: undefined,
        scheduledFor: undefined,
        status: newPost.status as 'draft' | 'scheduled' | 'published' || 'draft',
        tags: newPost.tags || [],
        seoTitle: newPost.seoTitle,
        seoDescription: newPost.seoDescription,
        featuredImage: newPost.featuredImage,
        userId: user.id,
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0
      }
      
      setBlogPosts([blogPost, ...blogPosts])
      setIsAddingPost(false)
      setNewPost({
        title: '',
        excerpt: '',
        content: '',
        tags: [],
        status: 'draft'
      })
      
    } catch (error) {
      console.error('Error adding blog post:', error)
    }
  }

  const publishPost = async (postId: string) => {
    setBlogPosts(blogPosts.map(post => 
      post.id === postId 
        ? { ...post, status: 'published', publishedAt: new Date().toISOString() }
        : post
    ))
  }

  const schedulePost = async (postId: string, date: string) => {
    setBlogPosts(blogPosts.map(post => 
      post.id === postId 
        ? { ...post, status: 'scheduled', scheduledFor: date }
        : post
    ))
  }

  const deletePost = async (postId: string) => {
    setBlogPosts(blogPosts.filter(post => post.id !== postId))
    if (selectedPost?.id === postId) {
      setSelectedPost(null)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non défini'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog IA</h1>
          <p className="text-gray-600">
            Générez et gérez du contenu automatiquement avec l'IA
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddingPost} onOpenChange={setIsAddingPost}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Créer Manuellement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer un nouvel article</DialogTitle>
                <DialogDescription>
                  Rédigez un article de blog pour votre site
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Titre</label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    placeholder="Titre de l'article"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Extrait</label>
                  <Textarea
                    value={newPost.excerpt}
                    onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                    placeholder="Résumé court de l'article"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Contenu (Markdown)</label>
                  <Textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder="Contenu de l'article en Markdown"
                    rows={10}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Statut</label>
                    <Select 
                      value={newPost.status} 
                      onValueChange={(value) => setNewPost({...newPost, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Brouillon</SelectItem>
                        <SelectItem value="published">Publié</SelectItem>
                        <SelectItem value="scheduled">Planifié</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags (séparés par des virgules)</label>
                    <Input
                      value={newPost.tags?.join(', ')}
                      onChange={(e) => setNewPost({
                        ...newPost, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                      })}
                      placeholder="seo, dropshipping, marketing..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Titre SEO</label>
                    <Input
                      value={newPost.seoTitle}
                      onChange={(e) => setNewPost({...newPost, seoTitle: e.target.value})}
                      placeholder="Titre optimisé pour les moteurs de recherche"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description SEO</label>
                    <Input
                      value={newPost.seoDescription}
                      onChange={(e) => setNewPost({...newPost, seoDescription: e.target.value})}
                      placeholder="Meta description pour les moteurs de recherche"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Image à la une (URL)</label>
                  <Input
                    value={newPost.featuredImage}
                    onChange={(e) => setNewPost({...newPost, featuredImage: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsAddingPost(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddPost}>
                    Créer l'article
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
                <Sparkles className="w-4 h-4 mr-2" />
                Générer avec IA
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Générer un article avec l'IA</DialogTitle>
                <DialogDescription>
                  Notre IA va créer un article de blog complet basé sur vos paramètres
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Sujet de l'article</label>
                  <Input
                    value={generationParams.topic}
                    onChange={(e) => setGenerationParams({...generationParams, topic: e.target.value})}
                    placeholder="Ex: Stratégies de dropshipping pour débutants"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Mots-clés (séparés par des virgules)</label>
                  <Input
                    value={generationParams.keywords}
                    onChange={(e) => setGenerationParams({...generationParams, keywords: e.target.value})}
                    placeholder="Ex: dropshipping, débutant, e-commerce, shopify"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Audience cible</label>
                    <Select 
                      value={generationParams.audience} 
                      onValueChange={(value) => setGenerationParams({...generationParams, audience: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dropshippers débutants">Dropshippers débutants</SelectItem>
                        <SelectItem value="e-commerçants expérimentés">E-commerçants expérimentés</SelectItem>
                        <SelectItem value="agences marketing">Agences marketing</SelectItem>
                        <SelectItem value="entrepreneurs">Entrepreneurs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Ton de l'article</label>
                    <Select 
                      value={generationParams.tone} 
                      onValueChange={(value: 'professional' | 'casual' | 'expert') => 
                        setGenerationParams({...generationParams, tone: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un ton" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professionnel</SelectItem>
                        <SelectItem value="casual">Décontracté</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button 
                    onClick={handleGeneratePost} 
                    disabled={isGeneratingPost || !generationParams.topic}
                    className="bg-gradient-to-r from-orange-500 to-orange-600"
                  >
                    {isGeneratingPost ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Générer l'article
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="draft">Brouillons</SelectItem>
                <SelectItem value="scheduled">Planifiés</SelectItem>
                <SelectItem value="published">Publiés</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {blogCategories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posts List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Articles ({filteredPosts.length})
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Statistiques
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Calendrier
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPosts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Article</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Stats</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPosts.map((post) => (
                        <TableRow key={post.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedPost(post)}>
                          <TableCell>
                            <div className="flex items-start gap-3">
                              {post.featuredImage && (
                                <img
                                  src={post.featuredImage}
                                  alt={post.title}
                                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                />
                              )}
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                  {post.title}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                  {post.excerpt.substring(0, 60)}...
                                </p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {post.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {post.tags.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{post.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                post.status === 'published' ? 'bg-green-100 text-green-800' :
                                post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {post.status === 'published' ? 'Publié' : 
                               post.status === 'scheduled' ? 'Planifié' : 'Brouillon'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-3 h-3" />
                              {post.status === 'published' ? formatDate(post.publishedAt) :
                               post.status === 'scheduled' ? formatDate(post.scheduledFor) :
                               formatDate(post.id ? new Date(parseInt(post.id)).toISOString() : undefined)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {post.views || 0}
                              </div>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3" />
                                {post.likes || 0}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={(e) => {
                                e.stopPropagation()
                                setSelectedPost(post)
                              }}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={(e) => {
                                e.stopPropagation()
                                // Edit post
                              }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deletePost(post.id)
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun article trouvé. Créez votre premier article !</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Post Details or Calendar */}
        <div>
          {selectedPost ? (
            <Card>
              <CardHeader>
                <CardTitle>Détails de l'Article</CardTitle>
                <CardDescription>
                  Informations et actions pour cet article
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{selectedPost.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedPost.excerpt}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Statut</span>
                    <Badge
                      className={
                        selectedPost.status === 'published' ? 'bg-green-100 text-green-800' :
                        selectedPost.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {selectedPost.status === 'published' ? 'Publié' : 
                       selectedPost.status === 'scheduled' ? 'Planifié' : 'Brouillon'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Auteur</span>
                    <span className="text-sm">{selectedPost.author}</span>
                  </div>

                  {selectedPost.status === 'published' && selectedPost.publishedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Publié le</span>
                      <span className="text-sm">{formatDate(selectedPost.publishedAt)}</span>
                    </div>
                  )}

                  {selectedPost.status === 'scheduled' && selectedPost.scheduledFor && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Planifié pour</span>
                      <span className="text-sm">{formatDate(selectedPost.scheduledFor)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tags</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {selectedPost.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedPost.status === 'published' && (
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 border rounded-lg">
                      <div className="flex items-center justify-center gap-1 text-gray-600">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">{selectedPost.views}</span>
                      </div>
                      <p className="text-xs text-gray-500">Vues</p>
                    </div>
                    <div className="p-2 border rounded-lg">
                      <div className="flex items-center justify-center gap-1 text-gray-600">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="font-medium">{selectedPost.likes}</span>
                      </div>
                      <p className="text-xs text-gray-500">Likes</p>
                    </div>
                    <div className="p-2 border rounded-lg">
                      <div className="flex items-center justify-center gap-1 text-gray-600">
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-medium">{selectedPost.comments}</span>
                      </div>
                      <p className="text-xs text-gray-500">Commentaires</p>
                    </div>
                    <div className="p-2 border rounded-lg">
                      <div className="flex items-center justify-center gap-1 text-gray-600">
                        <Share2 className="w-4 h-4" />
                        <span className="font-medium">{selectedPost.shares}</span>
                      </div>
                      <p className="text-xs text-gray-500">Partages</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {selectedPost.status === 'draft' && (
                    <Button 
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600"
                      onClick={() => publishPost(selectedPost.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Publier Maintenant
                    </Button>
                  )}
                  
                  {selectedPost.status === 'draft' && (
                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Planifier Publication
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier l'Article
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Globe className="w-4 h-4 mr-2" />
                    Voir sur le Site
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deletePost(selectedPost.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Calendrier Éditorial
                </CardTitle>
                <CardDescription>
                  Planification de vos publications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Aujourd'hui</div>
                    <Badge className="bg-green-100 text-green-800">Publié</Badge>
                  </div>
                  <p className="text-sm font-medium truncate">SEO Dropshipping : Guide Complet</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">5 Février 2024</div>
                    <Badge className="bg-blue-100 text-blue-800">Planifié</Badge>
                  </div>
                  <p className="text-sm font-medium truncate">Comment Automatiser votre Dropshipping avec l'IA</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">12 Février 2024</div>
                    <Badge className="bg-blue-100 text-blue-800">Planifié</Badge>
                  </div>
                  <p className="text-sm font-medium truncate">Guide BigBuy pour Dropshippers Français</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">19 Février 2024</div>
                    <Badge className="bg-blue-100 text-blue-800">Planifié</Badge>
                  </div>
                  <p className="text-sm font-medium truncate">Optimiser ses Fiches Produit pour Shopify</p>
                </div>
                
                <Button className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Voir Calendrier Complet
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Content Ideas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Idées de Contenu IA
          </CardTitle>
          <CardDescription>
            Suggestions d'articles générées par notre IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span className="font-medium">Tendance</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">7 Produits Écologiques à Forte Marge pour 2024</h3>
              <p className="text-sm text-gray-600 mb-2">Explorez les produits éco-responsables en plein boom avec des marges supérieures à 200%.</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">éco-responsable</Badge>
                <Button variant="ghost" size="sm">
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="w-4 h-4 text-green-600" />
                <span className="font-medium">SEO</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Comment Battre vos Concurrents sur Google en 30 Jours</h3>
              <p className="text-sm text-gray-600 mb-2">Stratégies SEO avancées spécifiques au dropshipping pour dominer les SERP.</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">référencement</Badge>
                <Button variant="ghost" size="sm">
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Automatisation</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">5 Workflows Zapier qui Vont Révolutionner votre Dropshipping</h3>
              <p className="text-sm text-gray-600 mb-2">Automatisez votre business et gagnez 20h par semaine avec ces intégrations.</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">productivité</Badge>
                <Button variant="ghost" size="sm">
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
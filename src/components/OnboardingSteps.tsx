import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Check, ChevronRight, Store, Import, Package, Search, Zap, FileText } from 'lucide-react'

interface Step {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  content: React.ReactNode
  cta: string
  link: string
  isCompleted?: boolean
}

interface OnboardingStepsProps {
  onComplete?: () => void
  className?: string
}

export function OnboardingSteps({ onComplete, className }: OnboardingStepsProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const steps: Step[] = [
    {
      id: 'connect-store',
      title: 'Connecter votre boutique',
      description: 'Synchronisez vos produits et commandes avec votre boutique en ligne',
      icon: <Store className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            Connectez votre boutique Shopify, WooCommerce ou autre plateforme pour synchroniser automatiquement vos produits et commandes.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <img src="/logos/shopify.svg" alt="Shopify" className="w-8 h-8" />
              <div>
                <h4 className="font-medium text-sm">Shopify</h4>
                <p className="text-xs text-muted-foreground">Boutique Shopify</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <img src="/logos/woocommerce.svg" alt="WooCommerce" className="w-8 h-8" />
              <div>
                <h4 className="font-medium text-sm">WooCommerce</h4>
                <p className="text-xs text-muted-foreground">Site WordPress</p>
              </div>
            </Card>
          </div>
        </div>
      ),
      cta: 'Connecter une boutique',
      link: '/app/settings/stores',
      isCompleted: false,
    },
    {
      id: 'import-products',
      title: 'Importer des produits',
      description: 'Importez vos premiers produits depuis AliExpress, BigBuy ou d\'autres fournisseurs',
      icon: <Import className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            Importez des produits depuis vos fournisseurs préférés en quelques clics. Vous pouvez importer par URL, CSV ou en masse.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                🛒
              </div>
              <div className="text-center">
                <h4 className="font-medium text-sm">AliExpress</h4>
              </div>
            </Card>
            <Card className="p-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                📦
              </div>
              <div className="text-center">
                <h4 className="font-medium text-sm">BigBuy</h4>
              </div>
            </Card>
            <Card className="p-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                🚀
              </div>
              <div className="text-center">
                <h4 className="font-medium text-sm">Eprolo</h4>
              </div>
            </Card>
          </div>
        </div>
      ),
      cta: 'Importer des produits',
      link: '/app/import',
      isCompleted: false,
    },
    {
      id: 'optimize-products',
      title: 'Optimiser vos produits',
      description: 'Améliorez vos fiches produit avec l\'IA pour augmenter vos ventes',
      icon: <Search className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            Utilisez notre IA pour optimiser automatiquement vos titres, descriptions et mots-clés pour un meilleur référencement.
          </p>
          <Card className="p-4 border border-dashed border-primary/50 bg-primary/5">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Optimisation IA</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Notre IA analyse vos produits et génère des titres, descriptions et mots-clés optimisés pour augmenter vos conversions.
                </p>
              </div>
            </div>
          </Card>
        </div>
      ),
      cta: 'Optimiser avec IA',
      link: '/app/seo',
      isCompleted: false,
    },
    {
      id: 'track-orders',
      title: 'Suivre vos commandes',
      description: 'Configurez le suivi automatique de vos commandes',
      icon: <Package className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            Suivez vos commandes en temps réel et informez automatiquement vos clients de l'état de leur livraison.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Suivi automatique</h4>
                <p className="text-xs text-muted-foreground">Mise à jour automatique du statut des commandes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Notifications clients</h4>
                <p className="text-xs text-muted-foreground">Envoi automatique d'emails de suivi</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium text-sm">1000+ transporteurs</h4>
                <p className="text-xs text-muted-foreground">Compatible avec tous les transporteurs majeurs</p>
              </div>
            </div>
          </div>
        </div>
      ),
      cta: 'Configurer le tracking',
      link: '/app/tracking',
      isCompleted: false,
    },
    {
      id: 'create-content',
      title: 'Créer du contenu',
      description: 'Générez du contenu marketing avec l\'IA pour attirer plus de clients',
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            Utilisez notre IA pour générer des articles de blog, descriptions produits et contenu marketing en quelques clics.
          </p>
          <Card className="p-4 border border-dashed border-primary/50 bg-primary/5">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Blog IA</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Générez des articles de blog optimisés SEO pour attirer du trafic qualifié vers votre boutique.
                </p>
              </div>
            </div>
          </Card>
        </div>
      ),
      cta: 'Créer du contenu',
      link: '/app/blog',
      isCompleted: false,
    },
  ]

  const currentStep = steps[currentStepIndex]
  const progress = ((completedSteps.length) / steps.length) * 100

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      // Mark current step as completed if not already
      if (!completedSteps.includes(currentStep.id)) {
        setCompletedSteps([...completedSteps, currentStep.id])
      }
      setCurrentStepIndex(currentStepIndex + 1)
    } else {
      // All steps completed
      if (!completedSteps.includes(currentStep.id)) {
        setCompletedSteps([...completedSteps, currentStep.id])
      }
      onComplete?.()
    }
  }

  const handleStepClick = (index: number) => {
    setCurrentStepIndex(index)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Bienvenue sur DropFlow Pro</CardTitle>
        <CardDescription>Suivez ces étapes pour configurer votre compte</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{completedSteps.length} sur {steps.length} étapes complétées</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-[240px_1fr] gap-6">
          {/* Steps sidebar */}
          <div className="space-y-1">
            {steps.map((step, index) => (
              <button
                key={step.id}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  index === currentStepIndex
                    ? 'bg-primary text-white'
                    : completedSteps.includes(step.id)
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted'
                }`}
                onClick={() => handleStepClick(index)}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  index === currentStepIndex
                    ? 'bg-white text-primary'
                    : completedSteps.includes(step.id)
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {completedSteps.includes(step.id) ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-sm">{step.title}</div>
                  <div className={`text-xs ${
                    index === currentStepIndex
                      ? 'text-white/80'
                      : 'text-muted-foreground'
                  }`}>
                    {step.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Step content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {currentStep.icon}
              </div>
              <div>
                <h3 className="font-medium text-lg">{currentStep.title}</h3>
                <p className="text-sm text-muted-foreground">{currentStep.description}</p>
              </div>
            </div>
            
            <div className="mb-6">
              {currentStep.content}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={() => currentStepIndex > 0 && setCurrentStepIndex(currentStepIndex - 1)}
          disabled={currentStepIndex === 0}
        >
          Précédent
        </Button>
        <Button onClick={handleNextStep}>
          {currentStepIndex < steps.length - 1 ? (
            <>
              Suivant <ChevronRight className="w-4 h-4 ml-1" />
            </>
          ) : (
            'Terminer'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
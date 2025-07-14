import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      // Hero Section
      hero: {
        title: "Automate Your Product Import Workflow",
        subtitle: "The most powerful dropshipping platform to import, optimize, and scale your e-commerce business with AI-powered tools.",
        cta: {
          demo: "Start Free Trial",
          signup: "Book a Demo"
        },
        trusted: "Trusted by 10,000+ dropshippers worldwide"
      },
      // Features Section
      features: {
        title: "Everything You Need to Scale Your Dropshipping Business",
        subtitle: "Powerful features designed to automate your workflow and maximize profits",
        items: {
          import: {
            title: "Multi-Supplier Import",
            description: "Import products from AliExpress, BigBuy, Eprolo, and 20+ suppliers with one click"
          },
          ai: {
            title: "AI SEO Optimization",
            description: "Automatically generate SEO-optimized titles, descriptions, and keywords in 10+ languages"
          },
          sync: {
            title: "Shopify Sync",
            description: "Real-time bidirectional sync with Shopify, WooCommerce, and PrestaShop"
          },
          tracking: {
            title: "Advanced Tracking",
            description: "Track orders from 1000+ carriers with automated customer notifications"
          },
          crm: {
            title: "Built-in CRM",
            description: "Manage customers, leads, and support tickets in one unified dashboard"
          },
          analytics: {
            title: "Smart Analytics",
            description: "Real-time insights on sales, profits, and winning products with AI predictions"
          }
        }
      },
      // Metrics Section
      metrics: {
        title: "Trusted by Thousands of Successful Dropshippers",
        items: {
          products: "Products Imported",
          stores: "Stores Connected",
          revenue: "Revenue Generated",
          countries: "Countries Served"
        }
      },
      // Testimonials
      testimonials: {
        title: "What Our Customers Say",
        subtitle: "Join thousands of successful dropshippers who trust DropFlow Pro",
        items: [
          {
            name: "Sarah Johnson",
            role: "E-commerce Entrepreneur",
            company: "TechGadgets Store",
            content: "DropFlow Pro transformed my business. The AI optimization increased my conversion rate by 40% and saved me 20 hours per week.",
            rating: 5
          },
          {
            name: "Marcus Chen",
            role: "Dropshipping Expert",
            company: "Fashion Forward",
            content: "The multi-supplier import feature is incredible. I can now source from 15 different suppliers and manage everything in one place.",
            rating: 5
          },
          {
            name: "Emma Rodriguez",
            role: "Store Owner",
            company: "Home Essentials",
            content: "Customer support is outstanding, and the tracking system keeps my customers happy. My return rate dropped by 60%.",
            rating: 5
          }
        ]
      },
      // Newsletter
      newsletter: {
        title: "Stay Updated with DropFlow Pro",
        subtitle: "Get the latest tips, trends, and updates delivered to your inbox",
        placeholder: "Enter your email address",
        button: "Subscribe Now",
        privacy: "We respect your privacy. Unsubscribe at any time."
      },
      // Footer
      footer: {
        description: "The most powerful dropshipping platform for modern e-commerce businesses.",
        sections: {
          product: {
            title: "Product",
            links: ["Features", "Pricing", "API", "Integrations"]
          },
          company: {
            title: "Company",
            links: ["About", "Blog", "Careers", "Contact"]
          },
          resources: {
            title: "Resources",
            links: ["Documentation", "Help Center", "Community", "Status"]
          },
          legal: {
            title: "Legal",
            links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"]
          }
        },
        copyright: "© 2024 DropFlow Pro. All rights reserved."
      }
    }
  },
  fr: {
    translation: {
      // Hero Section
      hero: {
        title: "Automatisez Votre Workflow d'Import Produits",
        subtitle: "La plateforme dropshipping la plus puissante pour importer, optimiser et développer votre e-commerce avec des outils IA.",
        cta: {
          demo: "Essai Gratuit",
          signup: "Réserver une Démo"
        },
        trusted: "Approuvé par plus de 10 000 dropshippers dans le monde"
      },
      // Features Section
      features: {
        title: "Tout ce dont Vous Avez Besoin pour Développer Votre Dropshipping",
        subtitle: "Des fonctionnalités puissantes conçues pour automatiser votre workflow et maximiser les profits",
        items: {
          import: {
            title: "Import Multi-Fournisseurs",
            description: "Importez des produits depuis AliExpress, BigBuy, Eprolo et plus de 20 fournisseurs en un clic"
          },
          ai: {
            title: "Optimisation SEO IA",
            description: "Générez automatiquement des titres, descriptions et mots-clés SEO optimisés en 10+ langues"
          },
          sync: {
            title: "Sync Shopify",
            description: "Synchronisation bidirectionnelle temps réel avec Shopify, WooCommerce et PrestaShop"
          },
          tracking: {
            title: "Tracking Avancé",
            description: "Suivez les commandes de plus de 1000 transporteurs avec notifications client automatiques"
          },
          crm: {
            title: "CRM Intégré",
            description: "Gérez clients, prospects et tickets support dans un tableau de bord unifié"
          },
          analytics: {
            title: "Analytics Intelligents",
            description: "Insights temps réel sur ventes, profits et produits gagnants avec prédictions IA"
          }
        }
      },
      // Metrics Section
      metrics: {
        title: "Approuvé par des Milliers de Dropshippers à Succès",
        items: {
          products: "Produits Importés",
          stores: "Boutiques Connectées",
          revenue: "Chiffre d'Affaires Généré",
          countries: "Pays Desservis"
        }
      },
      // Testimonials
      testimonials: {
        title: "Ce que Disent Nos Clients",
        subtitle: "Rejoignez des milliers de dropshippers qui font confiance à DropFlow Pro",
        items: [
          {
            name: "Sarah Johnson",
            role: "Entrepreneure E-commerce",
            company: "TechGadgets Store",
            content: "DropFlow Pro a transformé mon business. L'optimisation IA a augmenté mon taux de conversion de 40% et m'a fait gagner 20h par semaine.",
            rating: 5
          },
          {
            name: "Marcus Chen",
            role: "Expert Dropshipping",
            company: "Fashion Forward",
            content: "La fonction d'import multi-fournisseurs est incroyable. Je peux maintenant sourcer depuis 15 fournisseurs différents et tout gérer au même endroit.",
            rating: 5
          },
          {
            name: "Emma Rodriguez",
            role: "Propriétaire de Boutique",
            company: "Home Essentials",
            content: "Le support client est exceptionnel, et le système de tracking rend mes clients heureux. Mon taux de retour a chuté de 60%.",
            rating: 5
          }
        ]
      },
      // Newsletter
      newsletter: {
        title: "Restez Informé avec DropFlow Pro",
        subtitle: "Recevez les derniers conseils, tendances et mises à jour directement dans votre boîte mail",
        placeholder: "Entrez votre adresse email",
        button: "S'abonner Maintenant",
        privacy: "Nous respectons votre vie privée. Désabonnez-vous à tout moment."
      },
      // Footer
      footer: {
        description: "La plateforme dropshipping la plus puissante pour les entreprises e-commerce modernes.",
        sections: {
          product: {
            title: "Produit",
            links: ["Fonctionnalités", "Tarifs", "API", "Intégrations"]
          },
          company: {
            title: "Entreprise",
            links: ["À propos", "Blog", "Carrières", "Contact"]
          },
          resources: {
            title: "Ressources",
            links: ["Documentation", "Centre d'aide", "Communauté", "Statut"]
          },
          legal: {
            title: "Légal",
            links: ["Politique de confidentialité", "Conditions d'utilisation", "Politique des cookies", "RGPD"]
          }
        },
        copyright: "© 2024 DropFlow Pro. Tous droits réservés."
      }
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  })

export default i18n

# 🚀 DropFlow Pro - Plateforme SaaS Dropshipping


[![Vercel Preview](https://img.shields.io/badge/preview-ready-brightgreen)](https://dropflow.vercel.app)
[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/adil95400/dropflow-pro)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/adil95400/dropflow-pro/actions)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/dropflow-pro/dropflow-pro/actions)
[![Vercel Status](https://vercel.com/api/ping/adil95400/dropflow-pro)](https://vercel.com/adil95400/dropflow-pro)


**DropFlow Pro** est une plateforme SaaS complète pour le dropshipping, rivalisant avec Spocket, AutoDS et Zendrop. Elle centralise l'importation produit, l'optimisation IA, le tracking colis, le CRM, le SEO et les intégrations e-commerce.

---

## ✨ Fonctionnalités Clés

### 🛒 Importation & Catalogue
- Intégration fournisseurs : AliExpress, BigBuy, Printify, Eprolo, Cdiscount Pro
- Support formats : API, CSV, XML, URL
- Nettoyage IA automatique des fiches produit
- Traduction multilingue automatique
- Gestion des variantes & bundles
- Import Chrome Extension

### 🧠 Intelligence Artificielle
- Génération SEO (title, description, keywords)
- Générateur de blog IA automatisé
- Traduction & adaptation culturelles par IA
- Analyse concurrentielle (pricing optimal)
- Coach IA personnalisé pour chaque boutique

### 📦 Suivi & Logistique
- Intégration 17track.net pour tracking en temps réel
- Statut commandes et alertes clients
- Dashboard avancé logistique & analytics

### 🛍️ E-commerce & Marketplaces
- Shopify, WooCommerce, PrestaShop
- Synchronisation bidirectionnelle produits & commandes
- Module Marketplace B2B intégré
- Publication automatique sur réseaux & marketplaces

### 💬 CRM & Marketing
- Emailing intelligent : Mailchimp, Klaviyo, Omnisend
- Système d’avis intégré (Loox, Judge.me, AI)
- Intégration Zapier + Webhooks personnalisés
- Tunnel de vente IA & module affiliation

---

## 🧱 Stack Technique

### Frontend
- React 18 + TypeScript + Vite
- shadcn/ui + Tailwind + Framer Motion
- Zustand + React Query + Dark Mode

### Backend
- Supabase (PostgreSQL + Auth + RLS)
- Edge Functions API (`/api/`)
- Intégrations externes (Shopify, AliExpress, Zapier, BigBuy…)

### DevOps & Tests
- GitHub Actions (CI/CD)
- Husky pre-commit, ESLint, Prettier
- Vercel Deployment
- Sentry, LogRocket, Mixpanel

---

## 🚀 Installation

### Prérequis
- Node.js 18+
- Supabase project (avec clés)
- Vercel CLI (optionnel)

```bash
# Cloner
git clone https://github.com/adil95400/dropflow-pro.git
cd dropflow-pro

# Installer dépendances
npm install

# Lancer
npm run dev
```

---

## 📂 Structure des Dossiers

```
src/
├── pages/                # Toutes les routes
├── components/           # UI & layout
├── lib/                  # Intégrations (shopify, openai, etc.)
├── api/                  # API FastAPI/Supabase
├── extension/            # Extension Chrome DropFlow
├── mobile_flutter/       # App mobile Flutter
```

---

## 🧪 Test & Preview

```bash
# Déploiement Vercel Preview
vercel --prod

# PR automatique avec preview
gh pr create --title "test" --base main --head feature/my-feature
```

---

## 📱 Autres interfaces

### Extension Chrome
```bash
cd extension/
npm install
npm run build
```

### App Flutter
```bash
cd mobile_flutter/
flutter pub get
flutter run
```

---

## 🤝 Contribuer

1. Fork 💡
2. Crée une branche `feature/xxx`
3. Code + Commit + PR
4. LCI = Linter, Commit, Integration

---

## 📞 Support


- 📧 support@dropflow.pro
- 📚 [Documentation API](https://docs.dropflow.pro)
- 💬 [Discord communauté](https://discord.gg/dropflow)
- 🧪 [Tester DropFlow](https://dropflow.vercel.app)

---

## 📄 Licence

MIT – Libre d'utilisation et d'amélioration. Respecte la propriété intellectuelle 💼

---

**Développé avec ❤️ par DropFlow Pro Team**
[🌐 Site Web](https://dropflow.pro) • [📚 Documentation](https://docs.dropflow.pro) • [💬 Discord](https://discord.gg/dropflow)



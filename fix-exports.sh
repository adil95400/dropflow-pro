#!/bin/bash

echo "🔁 Correction des exports default → nommés..."

# Liste des composants à corriger (fichier + nom de fonction à injecter)
declare -A files=(
  ["src/pages/Home.tsx"]="HomePage"
  ["src/pages/auth/modern-login.tsx"]="ModernLoginPage"
  ["src/pages/auth/register.tsx"]="RegisterPage"
  ["src/pages/Import.tsx"]="ImportPage"
  ["src/pages/products/index.tsx"]="ProductsPage"
  ["src/pages/Tracking.tsx"]="TrackingPage"
  ["src/pages/winners/index.tsx"]="WinnersPage"
  ["src/pages/SEO.tsx"]="SEOPage"
  ["src/pages/Blog.tsx"]="BlogPage"
  ["src/pages/CRM.tsx"]="CRMPage"
  ["src/pages/Marketplace.tsx"]="MarketplacePage"
  ["src/pages/Reviews.tsx"]="ReviewsPage"
  ["src/pages/Marketing.tsx"]="MarketingPage"
  ["src/pages/Analytics.tsx"]="AnalyticsPage"
  ["src/pages/Settings.tsx"]="SettingsPage"
  ["src/pages/Billing.tsx"]="BillingPage"
  ["src/components/layout/modern-header.tsx"]="ModernHeader"
)

for path in "${!files[@]}"; do
  name="${files[$path]}"
  if [ -f "$path" ]; then
    echo "🔧 Correction de $path → $name"
    sed -i '' "s/export default function .*/export function $name() {/" 
"$path"
  else
    echo "❌ Fichier introuvable : $path"
  fi
done

echo "✅ Exports corrigés. Tu peux maintenant relancer :"
echo "npm run dev"


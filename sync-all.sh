#!/bin/bash

echo "📦 Initialisation de la synchronisation DropFlow Pro..."

# 🔄 Revenir sur main si besoin
git checkout main 2>/dev/null || git checkout -b main

# 📅 Création de branche codex auto
MODULE=${1:-chrome-extension}
DATE=$(date +%F)
BRANCH="codex-${MODULE}-${DATE}"

echo "🪄 Branche: $BRANCH"
git checkout -B "$BRANCH"

echo "📥 Ajout des fichiers modifiés"
git add .

# 🚫 Aucun changement ?
if git diff --cached --quiet; then
  echo "❌ Aucun changement à synchroniser."
  exit 0
fi

echo "✅ Commit en cours..."
git commit -m "🚀 feat(${MODULE}): sync automatique"

echo "🚀 Push vers GitHub..."
git push -u origin "$BRANCH"

echo "🧠 Lancement du script Codex/Bolt (si connecté)..."
node scripts/codexsync.cjs $MODULE

echo "✅ Synchronisation complète avec GitHub + Codex terminée."


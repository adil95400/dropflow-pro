#!/bin/bash
echo "🔁 [Codex] Synchronisation IA en cours..."

if ! command -v codex &> /dev/null
then
    echo "❌ Codex CLI non trouvé. Installez-le avec : npm install -g codex"
    exit 1
fi

codex sync --config .bolt/prompts/fix-exports.bolt.json
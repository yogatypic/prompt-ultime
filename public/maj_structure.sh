#!/bin/bash

echo "🧩 Vérification JSON local de structure.json..."

# 1. Teste que le fichier est bien formé
if ! jq empty public/structure.json >/dev/null 2>&1; then
  echo "❌ Le fichier public/structure.json est invalide JSON."
  exit 1
else
  echo "✅ JSON valide syntaxiquement."
fi

# 2. Ajout du fichier
git add public/structure.json

# 3. Commit
echo "📦 Commit Git en cours..."
git commit -m "✅ structure.json corrigé pour validation AJV"

# 4. Push vers GitHub
echo "🚀 Envoi sur GitHub..."
git push

echo "🎉 Script terminé. Le déploiement Render suivra automatiquement si configuré."


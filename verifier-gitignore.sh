#!/bin/bash

echo "🔍 Vérification des règles .gitignore pour 'public/IA/' et 'structure.json'..."
echo "----------------------------------------------"

if [ ! -f .gitignore ]; then
  echo "⚠️ Aucun fichier .gitignore trouvé dans ce répertoire."
  exit 0
fi

grep -E '(^|/)(public/IA/|structure\.json)$' .gitignore

if [ $? -eq 0 ]; then
  echo "❌ Une règle dans .gitignore pourrait empêcher le suivi Git."
else
  echo "✅ Aucun blocage détecté dans .gitignore."
fi


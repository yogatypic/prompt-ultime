#!/bin/bash

DOSSIER="./public/IA"
ERREURS=0

echo "🔍 Vérification de validité JSON dans $DOSSIER..."

for fichier in "$DOSSIER"/*.json; do
  if jq empty "$fichier" > /dev/null 2>&1; then
    echo "✅ $fichier est valide"
  else
    echo "❌ $fichier est invalide ❗"
    ((ERREURS++))
  fi
done

if [ "$ERREURS" -eq 0 ]; then
  echo "🎉 Tous les fichiers JSON sont valides."
else
  echo "⚠️ $ERREURS fichier(s) invalide(s) détecté(s)."
fi


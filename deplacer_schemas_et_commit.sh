#!/bin/bash

# 1. Créer le dossier s'il n'existe pas
mkdir -p public/schemas

# 2. Déplacer les fichiers .schema.json
moved=false
for fichier in *.schema.json; do
  if [ -f "$fichier" ]; then
    echo "➡️  Déplacement de $fichier vers public/schemas/"
    mv "$fichier" public/schemas/
    moved=true
  fi
done

# 3. Si fichiers déplacés, ajout et commit Git
if [ "$moved" = true ]; then
  echo "📁 Fichiers déplacés — mise à jour Git"
  git add public/schemas/*.schema.json
  git commit -m "📦 Déplacement des fichiers .schema.json dans public/schemas/"
  git push origin main
  echo "✅ Commit Git effectué."
else
  echo "ℹ️ Aucun fichier .schema.json trouvé."
fi


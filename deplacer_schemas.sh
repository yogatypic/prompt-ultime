#!/bin/bash

# Crée le dossier public/schemas s'il n'existe pas
mkdir -p public/schemas

# Déplace tous les fichiers *.schema.json présents à la racine vers public/schemas/
for fichier in *.schema.json; do
  if [ -f "$fichier" ]; then
    echo "➡️  Déplacement de $fichier vers public/schemas/"
    mv "$fichier" public/schemas/
  fi
done

echo "✅ Tous les fichiers de schéma ont été déplacés."


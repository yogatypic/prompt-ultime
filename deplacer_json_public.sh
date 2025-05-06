#!/bin/bash

echo "📦 Création du dossier public si nécessaire..."
mkdir -p public

echo "📂 Déplacement des fichiers JSON dans public/ ..."
for f in *.json; do
    echo "  → $f"
    mv "$f" public/
done

echo "✅ Tous les fichiers JSON ont été déplacés dans /public"
echo "📢 N'oublie pas de faire :"
echo "   git add public/*.json"
echo "   git commit -m \"🚀 Déplacement des JSON dans /public pour Render\""
echo "   git push origin main"


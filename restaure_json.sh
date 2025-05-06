#!/bin/bash

# Script : restaure_json.sh
# Objet : Télécharger tous les fichiers JSON nécessaires au fonctionnement du Prompt Ultime

echo "📦 Création du dossier temporaire..."
mkdir -p tmp_json && cd tmp_json

echo "⬇️ Téléchargement des fichiers depuis https://www.yogatypic.fr/IA/"
fichiers=(
  "etape_0_seuil_entree.json"
  "etape_1_observation.json"
  "etape_2_lunettes.json"
  "etape_3_lecture_croisee.json"
  "etape_4_metadiscernement.json"
  "etape_5_resonance_finale.json"
  "meta.json"
  "introduction_et_mission.json"
  "compagnons_symboliques.json"
  "axes_autistiques.json"
  "lunettes_subjectives.json"
  "masques_symboliques.json"
)

for fichier in "${fichiers[@]}"; do
  echo "  → $fichier"
  curl -s -O "https://www.yogatypic.fr/IA/$fichier"
done

echo "📁 Déplacement des fichiers à la racine du dépôt"
mv *.json ..

cd .. && rm -r tmp_json

echo "✅ Fichiers restaurés. Préparation du commit..."

git add *.json
git commit -m "♻️ Restauration automatique des fichiers d'étape et ressources"
git push origin main

echo "🎉 Terminé ! Les fichiers JSON sont en ligne pour GitHub Pages."


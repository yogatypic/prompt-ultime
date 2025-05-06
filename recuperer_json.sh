#!/bin/bash

# Dossier cible
mkdir -p json
cd json || exit 1

# Base URL
BASE_URL="https://www.yogatypic.fr/IA"

# Liste des fichiers JSON attendus
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

echo "🔎 Téléchargement des fichiers JSON depuis $BASE_URL"
echo "📁 Dossier de destination : $(pwd)"

# Boucle de téléchargement
for fichier in "${fichiers[@]}"; do
  echo "⬇️  $fichier"
  curl -s -O "$BASE_URL/$fichier"
done

echo "✅ Tous les fichiers sont téléchargés dans ./json/"


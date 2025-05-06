#!/bin/bash

echo "🔎 Lecture de structure.json pour détecter les fichiers attendus..."

# Récupération des noms de fichiers d'étapes depuis structure.json
fichiers_attendus=$(jq -r '.etapes[]' structure.json)

echo "📁 Fichiers attendus :"
echo "$fichiers_attendus"
echo

# Pour chaque fichier attendu
for fichier in $fichiers_attendus; do
  echo "🔍 Recherche de $fichier..."

  # Recherche dans tous les sous-dossiers
  chemin=$(find . -type f -name "$fichier" | grep -v "./$fichier" | head -n 1)

  if [[ -z "$chemin" ]]; then
    echo "❌ Non trouvé ailleurs que dans la racine."
  else
    echo "✅ Trouvé : $chemin"
    
    # Proposer de déplacer
    read -p "↪️  Déplacer $chemin vers ./ ? [o/N] " confirmation
    if [[ "$confirmation" == "o" || "$confirmation" == "O" ]]; then
      mv "$chemin" . && echo "✅ Déplacé à la racine."
    else
      echo "⏭️  Ignoré."
    fi
  fi
  echo
done

echo "✅ Scan terminé."


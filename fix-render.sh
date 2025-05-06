#!/bin/bash

echo "🔧 Fix Render & Node.js config..."

# 1. Fixer la version de Node.js
echo "18.19.1" > .node-version
echo "✔️ .node-version défini à 18.19.1"

# 2. Forcer l'environnement Node sur Render
cat <<EOF > render.yaml
build:
  environment: node
EOF
echo "✔️ render.yaml créé pour éviter Bun"

# 3. Fusionner les dépendances si plusieurs blocs
if grep -q '"commander":' package.json && ! grep -q '"commander":' <<< $(jq '.dependencies' package.json); then
  echo "⚠️ Dépendance commander déplacée dans dependencies"
  jq '(.dependencies // {}) + { "commander": "^13.1.0" } | del(.["dependencies"]["commander"])' package.json > package.tmp && mv package.tmp package.json
fi

# 4. Réinitialiser les modules et réinstaller proprement
rm -rf node_modules package-lock.json
echo "🔄 node_modules et lock supprimés"

npm install

# 5. Installer les modules manquants
npm install morgan commander

echo "✅ Tous les correctifs ont été appliqués."
echo "👉 Tu peux maintenant git add/commit/push pour déclencher le déploiement sur Render."


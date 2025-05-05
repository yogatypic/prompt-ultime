#!/bin/bash
set -e

FILE="public/index.html"

echo "🔧 Création d’un backup de $FILE → ${FILE}.bak"
cp "$FILE" "${FILE}.bak"

echo "🔍 Correction des fetch dans $FILE…"
# 1) fetch("structure.json") → fetch("IA/structure.json")
sed -i 's|fetch("structure\.json")|fetch("IA/structure.json")|g' "$FILE"
# 2) fetch('structure.json') → fetch('IA/structure.json')
sed -i "s|fetch('structure\.json')|fetch('IA/structure.json')|g" "$FILE"
# 3) fetch(etapeFile) → fetch("IA/" + etapeFile)
sed -i 's|fetch(etapeFile)|fetch("IA/" + etapeFile)|g' "$FILE"

echo "✅ Chemins corrigés dans $FILE"

echo "📋 Git commit & push…"
git add "$FILE"
git commit -m "🔧 Fix fetch paths in index.html to use IA/structure.json"
git push origin main

echo "🚀 Fini — relancez un déploiement sur Render et faites un hard-refresh (Ctrl+Shift+R)."


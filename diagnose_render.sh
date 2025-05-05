#!/bin/bash
set -e

# Configuration
BASE_URL="https://prompt-ultime.onrender.com"
STRUCT_URL="$BASE_URL/IA/structure.json"
INDEX_URL="$BASE_URL/index.html"
TMP_DIR=$(mktemp -d)

echo "🔍 Diagnostic rapide pour $BASE_URL"
echo "----------------------------------------"

# 1) Vérifier que structure.json est servi
echo -n "• Test structure.json : "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$STRUCT_URL")
if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ HTTP 200"
else
  echo "❌ HTTP $HTTP_CODE"
fi

# 2) Vérifier le contenu d’index.html en production
echo -n "• Test fetch() dans index.html : "
curl -s "$INDEX_URL" > "$TMP_DIR/index.html"
if grep -q 'fetch("IA/structure.json")' "$TMP_DIR/index.html"; then
  echo "✅ trouve fetch(\"IA/structure.json\")"
else
  echo "❌ ne trouve pas fetch(\"IA/structure.json\")"
fi

# 3) Vérifier qu’il n’y a pas de path erroné
echo -n "• Test d’éventuelles fetch erronées : "
if grep -E 'fetch\(\s*["'\'']/IA/structure\.json' "$TMP_DIR/index.html"; then
  echo "✅ présence de /IA/structure.json"
else
  echo "❌ absence de /IA/structure.json ou utilisation de chemin relatif incorrect"
fi

# 4) Conseils si mauvais état
if [ "$HTTP_CODE" != "200" ] || ! grep -q 'fetch("IA/structure.json")' "$TMP_DIR/index.html"; then
  cat <<EOF

⚠️ Problème détecté :

  - soit structure.json n'est pas déployé (HTTP $HTTP_CODE)
  - soit ton index.html en prod n'a pas été mis à jour
    (pas de fetch("IA/structure.json") dans $INDEX_URL)

📌 Actions recommandées :

  1) Vérifie localement et git-add/g
     it-commit puis git push public/IA/structure.json
  2) Relance un déploiement sur Render :
     – Manual Deploy → Clear Build Cache → Deploy latest commit
  3) Force rafraîchissement cache navigateur :
     Ctrl+Shift+R ou Cmd+Shift+R

EOF
else
  echo
  echo "🎉 Tout semble correct : structure.json est servi et index.html appelle le bon chemin."
fi

# nettoyage
rm -rf "$TMP_DIR"


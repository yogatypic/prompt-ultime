#!/bin/bash

echo "🔍 Vérification de la présence de structure.json..."

STRUCTURE_PATH="./public/IA/structure.json"

if [ ! -f "$STRUCTURE_PATH" ]; then
  echo "❌ Fichier manquant : $STRUCTURE_PATH"
  exit 1
else
  echo "✅ Fichier trouvé localement : $STRUCTURE_PATH"
fi

echo "----------------------------------------"
echo "🔎 Test d’accessibilité en local (localhost:10000)..."

curl -s -o /tmp/structure_local.json -w "%{http_code}" http://localhost:10000/IA/structure.json | {
  read code
  if [ "$code" = "200" ]; then
    echo "✅ Localhost : structure.json accessible (HTTP 200)"
  else
    echo "❌ Localhost : inaccessible (HTTP $code). As-tu lancé le serveur ?"
  fi
}
rm -f /tmp/structure_local.json

echo "----------------------------------------"
echo "🌐 Test d’accessibilité en ligne (Render)..."

RENDER_URL="https://prompt-ultime.onrender.com/IA/structure.json"
curl -s -o /tmp/structure_remote.json -w "%{http_code}" "$RENDER_URL" | {
  read code
  if [ "$code" = "200" ]; then
    echo "✅ Render : structure.json accessible (HTTP 200)"
  else
    echo "❌ Render : structure.json introuvable (HTTP $code)"
    echo "📦 Forçage Git et relancement du déploiement conseillé."
    NEED_DEPLOY=true
  fi
}
rm -f /tmp/structure_remote.json

echo "----------------------------------------"
echo "📂 Vérifie présence du middleware Express dans server.js..."

grep "express.static" server.js > /dev/null
if [ $? -eq 0 ]; then
  echo "✅ Middleware express.static détecté"
else
  echo "❌ Middleware express.static manquant dans server.js"
fi

echo "----------------------------------------"
echo "📝 Vérification .render.yaml..."

if [ -f ".render.yaml" ]; then
  echo "✅ Fichier .render.yaml présent"
else
  echo "❌ Fichier .render.yaml manquant. Création recommandée."
  echo "----------------------------------------"
  echo "💡 Contenu suggéré pour .render.yaml :"
  cat <<EOF
services:
  - type: web
    name: prompt-ultime
    env: node
    buildCommand: npm install
    startCommand: node server.js
    staticPublishPath: public
    envVars:
      - key: NODE_ENV
        value: production
EOF
fi

echo "----------------------------------------"
if [ "$NEED_DEPLOY" = true ]; then
  echo "📢 Étapes recommandées :"
  echo "1. git add -A"
  echo "2. git commit -m \"🔁 Forçage Render avec structure.json\""
  echo "3. git push origin main"
  echo "4. Aller sur https://dashboard.render.com -> Manual Deploy -> Clear Cache + Deploy"
fi


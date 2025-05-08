#!/usr/bin/env bash
set -euo pipefail

# 1️⃣ Libération du port 3000
echo "🔄 Libération du port 3000…"
if lsof -i :3000 >/dev/null 2>&1; then
  sudo fuser -k 3000/tcp
  echo "✅ Port 3000 libéré"
else
  echo "ℹ️ Port 3000 n’était pas occupé"
fi

# 2️⃣ Commit & push Git
MSG=\${1:-"update"}
echo "📦 Git add/commit/push (message: '\$MSG')…"
git add .
git commit -m "\$MSG"
git push origin main
echo "✅ Poussée terminée"

# 3️⃣ Lancement du dev server
echo "🚀 Démarrage du serveur (npm run dev)…"
npm run dev

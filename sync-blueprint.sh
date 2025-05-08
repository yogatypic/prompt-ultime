#!/usr/bin/env bash
set -euo pipefail

BLUEPRINT_FILE="render.yaml"
GIT_BRANCH="main"

# 1) Ajouter rootDir: . sous "- type: static_site" s’il n’existe pas déjà
if ! grep -Pzo "(?s)- type: static_site.*?rootDir:" "$BLUEPRINT_FILE" >/dev/null; then
  echo "➕ Insertion de rootDir: . dans $BLUEPRINT_FILE"
  # On insert après la ligne "- type: static_site"
  sed -i '/- type: static_site/ a\    rootDir: .' "$BLUEPRINT_FILE"
else
  echo "ℹ️ rootDir déjà présent pour static_site"
fi

# 2) Commit & push
git add "$BLUEPRINT_FILE"
git commit -m "fix: add rootDir for static_site" || echo "ℹ️ Rien à committer"
git push origin "$GIT_BRANCH"

# 3) Relancer la sync du Blueprint
if [[ -x "./sync-blueprint.sh" ]]; then
  echo "🚀 Relance sync-blueprint.sh"
  ./sync-blueprint.sh
else
  echo "⚠️ sync-blueprint.sh introuvable ou non exécutable. Lancez-le manuellement."
fi


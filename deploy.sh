#!/usr/bin/env bash
set -euo pipefail

### CONFIGURATION ###
GIT_BRANCH="main"
REPO_URL="https://github.com/yogatypic/literate-disco.git"
BLUEPRINT_FILE="render.yaml"
################################

# 1) S’assurer que le CLI est dans le PATH
export PATH="$HOME/.local/bin:$PATH"

# 2) Vérifier que render CLI est installé
if ! command -v render &>/dev/null; then
  echo "❌ render CLI introuvable. Assurez-vous qu'il est installé et dans votre PATH."
  exit 1
fi

# 3) Git add/commit/push du blueprint
echo "🔧 Commit & push de $BLUEPRINT_FILE sur la branche $GIT_BRANCH"
git add "$BLUEPRINT_FILE"
git commit -m "ci: add/update render.yaml blueprint" || echo "ℹ️ Rien à commit."
git push origin "$GIT_BRANCH"

# 4) Appliquer le blueprint via le CLI
echo "🚀 Application du blueprint sur le repo $REPO_URL (branche $GIT_BRANCH)"
render blueprint apply \
  --repo "$REPO_URL" \
  --branch "$GIT_BRANCH" \
  --file "$BLUEPRINT_FILE"

echo "🎉 Deploy lancé : allez sur le Dashboard Render pour suivre les logs."


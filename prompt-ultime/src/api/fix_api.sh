#!/usr/bin/env bash
set -e

FILE="src/api/api.ts"
if [ ! -f "$FILE" ]; then
  echo "❌ Fichier introuvable : $FILE"
  exit 1
fi

echo "🔧 Patch en cours sur $FILE…"

# Remplace fetch(`/sessions/${sessionId}/current-step`)
# par    fetch('/sessions/' + sessionId + '/current-step')
sed -E -i \
  "s|fetch\(\`/sessions/\$\{sessionId\}/current-step\`\)|fetch('/sessions/' + sessionId + '/current-step')|g" \
  "$FILE"

# Remplace fetch(`/sessions/${sessionId}/answer`, {
# par    fetch('/sessions/' + sessionId + '/answer', {
sed -E -i \
  "s|fetch\(\`/sessions/\$\{sessionId\}/answer\`,|fetch('/sessions/' + sessionId + '/answer',|g" \
  "$FILE"

echo "✅ $FILE mis à jour."


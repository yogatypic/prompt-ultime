#!/usr/bin/env bash
set -e

APP_FILE="src/App.tsx"

if [ ! -f "$APP_FILE" ]; then
  echo "Erreur : $APP_FILE introuvable. Placez ce script à la racine de votre projet front." >&2
  exit 1
fi

echo "🔄 Correction des imports et du JSX dans $APP_FILE…"

# 1) Remplacer l’import
sed -i "s|import { *Switch *, *Route *, *Redirect *} from 'react-router-dom'|import { Routes, Route, Navigate } from 'react-router-dom'|g" $APP_FILE

# 2) Remplacer <Switch> et </Switch> par <Routes> et </Routes>
sed -i "s|<Switch>|<Routes>|g; s|</Switch>|</Routes>|g" $APP_FILE

# 3) Remplacer <Redirect to="…"/> par la route wildcard Navigate
# On supprime la ligne contenant Redirect et on ajoute à la place :
# <Route path="*" element={<Navigate to="/" replace />} />
# Pour être sûrs, on fait un insert après la dernière route existante.
# Supprimer la ligne Redirect
sed -i "/Redirect to=/d" $APP_FILE
# Insérer la wildcard en bas du bloc Routes
sed -i "/<\/Routes>/i\      <Route path=\"*\" element={<Navigate to=\"/\" replace />} />" $APP_FILE

echo "✅ Imports et JSX corrigés dans $APP_FILE"


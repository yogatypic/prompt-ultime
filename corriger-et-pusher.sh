#!/bin/bash

echo "🔧 Correction de server.js..."

# 1. Corriger la ligne fautive dans server.js
sed -i '/console\.log("Champs reçus dans jsonContent"/d' server.js

# 2. Ajouter la ligne correctement placée dans le bloc AJV
awk '/app\.post\(.*\/api\/validate-ajv.*/ { print; print "    console.log(\"Champs reçus dans jsonContent :\", Object.keys(req.body.jsonContent));"; next } 1' server.js > server_temp.js && mv server_temp.js server.js

echo "✅ Ligne déplacée dans /api/validate-ajv"

# 3. Ajouter tous les fichiers modifiés et les suppressions
git add -A

# 4. Commit avec message
git commit -m "🐛 Fix crash Render : jsonContent mal placé dans server.js"

# 5. Push sur GitHub
git push

echo "🚀 Corrections poussées sur GitHub. Prêt à redéployer sur Render."


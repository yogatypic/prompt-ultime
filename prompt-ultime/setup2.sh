#!/usr/bin/env bash
set -e

# Ce script applique automatiquement les étapes 1, 2 et 3 :
# 1) Configurer le proxy du front
# 2) Déployer les fichiers structure.json et step1.json
# 3) Adapter le back-end pour servir dynamiquement les étapes

#####################################
# 1. Configurer le proxy du front    #
#####################################
FRONT_DIR="prompt-ultime"
if [ ! -d "$FRONT_DIR" ]; then
  echo "Le dossier '$FRONT_DIR' n'existe pas. Assurez-vous d'être à la racine du projet." >&2
  exit 1
fi

echo "🔧 Configuration du proxy dans $FRONT_DIR/package.json..."
# Insère "proxy": "http://localhost:4000", après la ligne "license"
sed -i "/\"license\":/a \  \"proxy\": \"http://localhost:4000\"," "$FRONT_DIR/package.json"

#####################################
# 2. Déployer le contenu des étapes  #
#####################################

echo "📂 Création de public/structure.json et de la première étape..."
# Crée structure.json
cat > "$FRONT_DIR/public/structure.json" << 'EOF'
{
  "etapes": [
    "/etapes/step1.json"
  ]
}
EOF
# Crée le dossier et la première étape
mkdir -p "$FRONT_DIR/public/etapes"
cat > "$FRONT_DIR/public/etapes/step1.json" << 'EOF'
{
  "nom": "Immersion inversée",
  "intro": "Prends une inspiration douce.",
  "objectif": "Observer un geste banal comme un rituel.",
  "accroche": "Vous surprenez un cercle silencieux.",
  "consignes": ["Regarder la vapeur", "Écouter le silence", "Noter les regards"],
  "reponse_attendue": true
}
EOF

#####################################
# 3. Adapter le back-end Express     #
#####################################
BACKEND_SRC="prompt-ultime-backend/src"
if [ ! -d "$BACKEND_SRC" ]; then
  echo "Le dossier '$BACKEND_SRC' n'existe pas. Assurez-vous d'avoir exécuté le setup initial." >&2
  exit 1
fi

echo "🛠️ Mise à jour de $BACKEND_SRC/index.js pour servir dynamiquement les étapes..."
cat > "$BACKEND_SRC/index.js" << 'EOF'
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const prompts = require('./routes/prompts');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Route existante pour /prompts
app.use('/prompts', prompts);

// Charger structure.json du front
const structurePath = path.join(__dirname, '../..', 'prompt-ultime', 'public', 'structure.json');
const structure = JSON.parse(fs.readFileSync(structurePath, 'utf8'));
const etapes = structure.etapes;
const sessionIndexMap = {};

// Création de session
app.post('/sessions', (req, res) => {
  const sessionId = Math.random().toString(36).substr(2, 9);
  sessionIndexMap[sessionId] = 0;
  res.json({ sessionId });
});

// Récupérer l'étape courante
app.get('/sessions/:sid/current-step', (req, res) => {
  const sid = req.params.sid;
  if (!(sid in sessionIndexMap)) return res.status(404).json({ error: 'Session not found' });
  const idx = sessionIndexMap[sid];
  const filePath = path.join(__dirname, '../..', 'prompt-ultime', 'public', etapes[idx]);
  const etapeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let html = `<h2>Étape ${idx+1} – ${etapeData.nom || ''}</h2>`;
  if (etapeData.intro) html += `<p><em>${etapeData.intro}</em></p>`;
  if (etapeData.objectif) html += `<p><strong>Objectif :</strong> ${etapeData.objectif}</p>`;
  if (etapeData.accroche) html += `<p>${etapeData.accroche}</p>`;
  if (Array.isArray(etapeData.consignes)) {
    html += '<ul>';
    etapeData.consignes.forEach(c => html += `<li>${c}</li>`);
    html += '</ul>';
  }
  const choices = etapeData.reponse_attendue !== false ? [{ id: 'ok', label: 'Valider' }] : [];
  res.json({ prompt: html, choices });
});

// Enregistrer une réponse et passer à l'étape suivante
app.post('/sessions/:sid/answer', (req, res) => {
  const sid = req.params.sid;
  if (!(sid in sessionIndexMap)) return res.status(404).json({ error: 'Session not found' });
  sessionIndexMap[sid]++;
  const idx = sessionIndexMap[sid];
  if (idx >= etapes.length) {
    return res.json({ prompt: '<p>✅ Expérience terminée.</p>', choices: [] });
  }
  // Comme au-dessus, on construit le HTML pour la prochaine étape
  const filePath = path.join(__dirname, '../..', 'prompt-ultime', 'public', etapes[idx]);
  const etapeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let html = `<h2>Étape ${idx+1} – ${etapeData.nom || ''}</h2>`;
  if (etapeData.intro) html += `<p><em>${etapeData.intro}</em></p>`;
  if (etapeData.objectif) html += `<p><strong>Objectif :</strong> ${etapeData.objectif}</p>`;
  if (etapeData.accroche) html += `<p>${etapeData.accroche}</p>`;
  if (Array.isArray(etapeData.consignes)) {
    html += '<ul>';
    etapeData.consignes.forEach(c => html += `<li>${c}</li>`);
    html += '</ul>';
  }
  const choices2 = etapeData.reponse_attendue !== false ? [{ id: 'ok', label: 'Valider' }] : [];
  res.json({ prompt: html, choices: choices2 });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
EOF

echo "✅ Étapes 1, 2 et 3 appliquées avec succès."


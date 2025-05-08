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

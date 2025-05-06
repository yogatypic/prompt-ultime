// ✅ server.js – version propre, unique, ESM, modulaire

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import fs from 'fs';
import { spawn } from 'child_process';
import Ajv from 'ajv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

const jsonDir = path.join(__dirname, 'public');
const ajv = new Ajv();

// 🔧 Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// === ROUTES FRONTEND ===
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
app.get('/structure.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'structure.json'));
});

// === ROUTES API JSON ===
app.get('/api/scan', (req, res) => {
  try {
    const files = fs.readdirSync(jsonDir).filter(f => f.endsWith('.json'));
    const resultats = {};
    for (const file of files) {
      const content = fs.readFileSync(path.join(jsonDir, file), 'utf8');
      resultats[file] = JSON.parse(content);
    }
    res.json({ status: 'ok', fichiers: resultats });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lecture fichiers : ' + err.message });
  }
});

app.post('/api/validate-ajv', (req, res) => {
  try {
    const { jsonContent, schemaContent } = req.body;
    const validate = ajv.compile(schemaContent);
    const valid = validate(jsonContent);
    if (!valid) return res.status(400).json({ valid: false, errors: validate.errors });
    res.json({ valid: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur validation AJV : ' + err.message });
  }
});

app.post('/api/save-json', (req, res) => {
  try {
    const { nomFichier, contenu } = req.body;
    const chemin = path.join(jsonDir, nomFichier);
    fs.writeFileSync(chemin, JSON.stringify(contenu, null, 2), 'utf8');
    res.json({ status: 'ok', message: `${nomFichier} enregistré.` });
  } catch (err) {
    res.status(500).json({ error: 'Erreur enregistrement : ' + err.message });
  }
});

app.post('/api/versioning', (req, res) => {
  try {
    const { nomFichier, contenu } = req.body;
    const horodatage = new Date().toISOString().replace(/[:.]/g, '-');
    const sauvegardePath = path.join(jsonDir, 'versions', `${nomFichier}.${horodatage}.json`);
    fs.mkdirSync(path.join(jsonDir, 'versions'), { recursive: true });
    fs.writeFileSync(sauvegardePath, JSON.stringify(contenu, null, 2), 'utf8');
    res.json({ status: 'ok', chemin: sauvegardePath });
  } catch (err) {
    res.status(500).json({ error: 'Erreur versioning : ' + err.message });
  }
});

app.post('/api/prompt-ia', (req, res) => {
  try {
    const { prompt } = req.body;
    const simulatedResponse = `🤖 IA : réponse simulée à "${prompt}"`;
    res.json({ reponse: simulatedResponse });
  } catch (err) {
    res.status(500).json({ error: 'Erreur IA : ' + err.message });
  }
});

// === ROUTE API EXÉCUTER PYTHON ===
app.get('/api/import-json', (req, res) => {
  const process = spawn('python3', ['import_json.py']);
  let output = '';
  process.stdout.on('data', data => output += data.toString());
  process.stderr.on('data', data => output += data.toString());
  process.on('close', code => {
    if (code === 0) res.send({ status: 'success', log: output });
    else res.status(500).send({ status: 'error', log: output });
  });
});

// === DÉMARRAGE DU SERVEUR ===
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});


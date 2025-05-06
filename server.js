// ✅ server.js – version complète avec API OpenAI, AJV, versioning, listing

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import fs from 'fs';
import { spawn } from 'child_process';
import Ajv from 'ajv';
import OpenAI from 'openai';
import 'dotenv/config'; // Pour accéder aux variables d’environnement

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

const jsonDir = path.join(__dirname, 'public');
const versionDir = path.join(jsonDir, 'versions');
const ajv = new Ajv();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(jsonDir));

// === ROUTES FRONTEND ===
app.get('/', (req, res) => res.sendFile(path.join(jsonDir, 'index.html')));
app.get('/admin', (req, res) => res.redirect('/admin.html'));

// === API : Scan de fichiers JSON ===
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

// === API : Validation AJV ===
app.post('/api/validate-ajv', (req, res) => {
    console.log("Champs reçus dans jsonContent :", Object.keys(req.body.jsonContent));
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

// === API : Enregistrement JSON ===
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

// === API : Versioning JSON ===
app.post('/api/versioning', (req, res) => {
  try {
    const { nomFichier, contenu } = req.body;
    const horodatage = new Date().toISOString().replace(/[:.]/g, '-');
    const fichier = `${nomFichier}.${horodatage}.json`;
    const chemin = path.join(versionDir, fichier);
    fs.mkdirSync(versionDir, { recursive: true });
    fs.writeFileSync(chemin, JSON.stringify(contenu, null, 2), 'utf8');
    res.json({ status: 'ok', chemin });
  } catch (err) {
    res.status(500).json({ error: 'Erreur versioning : ' + err.message });
  }
});

// ✅ API IA : Appel à OpenAI
app.post('/api/prompt-ia', async (req, res) => {
  try {
    const { prompt } = req.body;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    });
    const reponse = completion.choices[0].message.content;
    res.json({ reponse });
  } catch (err) {
    res.status(500).json({ error: 'Erreur appel OpenAI : ' + err.message });
  }
});

// === API : Exécution d’un script Python ===
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

// ✅ API : Lister les fichiers de version IA (journal_ia.*.json)
app.get('/api/list-versions', (req, res) => {
  try {
    if (!fs.existsSync(versionDir)) return res.json({ fichiers: [] });
    const fichiers = fs.readdirSync(versionDir)
      .filter(f => f.startsWith('journal_ia.') && f.endsWith('.json'));
    res.json({ fichiers });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lecture des versions : ' + err.message });
  }
});

// === Lancement du serveur ===
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
console.log("Champs reçus dans jsonContent :", Object.keys(req.body.jsonContent));

console.log("Schéma attendu :", Object.keys(schemaContent.properties));

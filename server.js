import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import fs from 'fs';
import { spawn } from 'child_process';
import Ajv from 'ajv';
import OpenAI from 'openai';
import 'dotenv/config';

// === INIT PATHS ET EXPRESS ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

const jsonDir = path.join(__dirname, 'public');
const versionDir = path.join(jsonDir, 'versions');
const schemasDir = path.join(jsonDir, 'schemas');

const ajv = new Ajv();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// === MIDDLEWARES ===
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(jsonDir)); // Sert /admin.html et /schemas/*

// === ROUTES FRONTEND ===
app.get('/', (req, res) => res.sendFile(path.join(jsonDir, 'index.html')));
app.get('/admin', (req, res) => res.redirect('/admin.html'));

// === ROUTE API 1 : SCAN fichiers JSON ===
app.get('/api/scan', (req, res) => {
  try {
    const files = fs.readdirSync(jsonDir).filter(f => f.endsWith('.json'));
    const resultats = files.map(file => ({
      nom: file,
      contenu: fs.readFileSync(path.join(jsonDir, file), 'utf8')
    }));
    res.json(resultats);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lecture fichiers : ' + err.message });
  }
});

// Alias pour compatibilité admin.js
app.get('/api/list-fichiers', (req, res) => {
  res.redirect('/api/scan');
});

// === ROUTE API 2 : VALIDATION AJV ===
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

// === ROUTE API 3 : SAVE JSON ===
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

// === ROUTE API 4 : VERSIONING ===
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

// === ROUTE API 5 : SYNC API EXTERNE (ex. OpenAI / GitHub) ===
app.post('/api/sync-api', (req, res) => {
  try {
    const payload = req.body;
    console.log("📡 SYNC PAYLOAD :", payload);

    // Ici tu pourrais appeler une vraie API (OpenAI, GitHub...)
    const simulation = {
      status: 'ok',
      message: 'Synchronisation simulée avec succès.',
      data: payload
    };

    res.json(simulation);
  } catch (err) {
    res.status(500).json({ error: 'Erreur de synchronisation : ' + err.message });
  }
});

// === ROUTE API 6 : IMPORT JSON via script Python ===
app.get('/api/import-json', (req, res) => {
  const process = spawn('python3', ['import_json.py']);
  let output = '';
  process.stdout.on('data', data => output += data.toString());
  process.stderr.on('data', data => output += data.toString());
  process.on('close', code => {
    if (code === 0) res.send(output);
    else res.status(500).send(output);
  });
});

// === ROUTE API 7 : APPEL IA (OpenAI) ===
app.post('/api/prompt-ia', async (req, res) => {
  try {
    const { prompt } = req.body;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    });
    res.json({ reponse: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: 'Erreur appel OpenAI : ' + err.message });
  }
});

// === ROUTE API 8 : Analyse libre d’un JSON ===
app.post('/api/analyse-libre', (req, res) => {
  try {
    const { contenu } = req.body;
    const resume = {
      type: typeof contenu,
      clefs: Object.keys(contenu || {}),
      taille: JSON.stringify(contenu).length
    };
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: 'Erreur analyse libre : ' + err.message });
  }
});

// === ROUTE API 9 : Historique IA ===
app.get('/api/historique-ia', (req, res) => {
  try {
    if (!fs.existsSync(versionDir)) return res.json([]);
    const fichiers = fs.readdirSync(versionDir)
      .filter(f => f.startsWith('journal_ia.') && f.endsWith('.json'));

    const historique = fichiers.map(fichier => {
      const contenu = fs.readFileSync(path.join(versionDir, fichier), 'utf8');
      return JSON.parse(contenu);
    });

    res.json(historique);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lecture historique IA : ' + err.message });
  }
});

// === LANCEMENT DU SERVEUR ===
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend opérationnel : http://localhost:${PORT}`);
});


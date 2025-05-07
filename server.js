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
app.use(express.static(jsonDir));

// === ROUTES FRONTEND ===
app.get('/', (req, res) => res.sendFile(path.join(jsonDir, 'index.html')));
app.get('/admin', (req, res) => res.redirect('/admin.html'));

// === API ROUTES ===
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

app.get('/api/list-fichiers', (req, res) => {
  res.redirect('/api/scan');
});

app.get('/api/list-versions', (req, res) => {
  try {
    if (!fs.existsSync(versionDir)) return res.json([]);
    const fichiers = fs.readdirSync(versionDir)
      .filter(f => f.endsWith('.json'))
      .map(fichier => ({
        nom: fichier,
        chemin: path.join('versions', fichier),
        taille: fs.statSync(path.join(versionDir, fichier)).size,
        modif: fs.statSync(path.join(versionDir, fichier)).mtime
      }));
    res.json(fichiers);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lecture versions : ' + err.message });
  }
});

app.post('/api/restaurer-version', (req, res) => {
  try {
    const { nomVersion, cible } = req.body;
    const source = path.join(versionDir, nomVersion);
    const destination = path.join(jsonDir, cible);
    fs.copyFileSync(source, destination);
    res.json({ status: 'ok', message: `${cible} restauré depuis ${nomVersion}` });
  } catch (err) {
    res.status(500).json({ error: 'Erreur restauration : ' + err.message });
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
    const fichier = `${nomFichier}.${horodatage}.json`;
    const chemin = path.join(versionDir, fichier);
    fs.mkdirSync(versionDir, { recursive: true });
    fs.writeFileSync(chemin, JSON.stringify(contenu, null, 2), 'utf8');
    res.json({ status: 'ok', chemin });
  } catch (err) {
    res.status(500).json({ error: 'Erreur versioning : ' + err.message });
  }
});

// === DÉMARRAGE SERVEUR ===
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend opérationnel : http://localhost:${PORT}`);
});


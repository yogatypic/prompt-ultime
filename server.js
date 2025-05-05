// ✅ VERSION CORRIGÉE DU SERVER.JS (ESM)

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// 🔧 Middleware de log
app.use(morgan('dev'));

// 🔧 Middleware body-parser JSON
app.use(express.json());

// 📁 Sert les fichiers statiques depuis ./public
app.use(express.static(path.join(__dirname, 'public')));

// 🏠 Route GET racine
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🔄 Route pour structure.json (sécurité si besoin)
app.get('/structure.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'structure.json'));
});

// 🤖 API POST simulée
app.post('/api/chat', async (req, res) => {
  try {
    const { userMessage, contexte } = req.body;
    console.log("📩 Message reçu :", userMessage, "| Contexte :", contexte);

    const reply = `Voici une réponse simulée pour : "${userMessage}"`;
    res.json({ reply });
  } catch (err) {
    console.error("❌ Erreur API :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// 🚀 Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});


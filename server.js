import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// 🔧 Middleware pour body parsing
app.use(express.json());

// 📁 Sert les fichiers statiques du dossier 'public'
app.use(express.static(path.join(__dirname, 'public')));
const iaPath = path.join(__dirname, 'public', 'IA');
console.log("📁 Dossier IA statique servi depuis :", iaPath);

// 🏠 Sert index.html quand on accède à la racine
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🤖 API POST /api/chat (simulée pour test)
app.post('/api/chat', async (req, res) => {
  try {
    const { userMessage, contexte } = req.body;
    console.log("📩 Message reçu :", userMessage, "| Contexte :", contexte);

    // Simulation de réponse IA
    const reply = `Voici une réponse simulée pour : "${userMessage}"`;
    res.json({ reply });
  } catch (err) {
    console.error("❌ Erreur API :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// 🚀 Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});


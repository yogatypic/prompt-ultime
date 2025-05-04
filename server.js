// 🟦 Importation des modules nécessaires (ESM grâce à "type": "module" dans package.json)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

// 🔧 Chargement du fichier .env pour les variables d'environnement (clé API, port, etc.)
dotenv.config();

// 🚀 Initialisation d'Express
const app = express();

// 📦 Middleware : CORS (autorise les appels frontend vers l'API backend)
app.use(cors());

// 📦 Middleware : JSON parser (pour traiter les données JSON des requêtes POST)
app.use(express.json());

// 🗂️ Middleware : sert les fichiers statiques du dossier 'public' (HTML, JSON, CSS...)
app.use(express.static('public'));

// 🔑 Initialisation de l’API OpenAI avec la clé depuis .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 📬 Route POST /api/chat – Envoie un message à OpenAI et retourne la réponse
app.post('/api/chat', async (req, res) => {
  const { userMessage, contexte } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: contexte },
        { role: "user", content: userMessage }
      ]
    });

    const reply = chatCompletion.choices?.[0]?.message?.content || "Pas de réponse générée.";
    res.json({ reply });
  } catch (err) {
    console.error("❌ Erreur API OpenAI :", err);
    res.status(500).json({ error: "Erreur lors de la génération : " + err.message });
  }
});

// 🔍 Route GET /test-openai – Pour vérifier que la clé fonctionne
app.get('/test-openai', async (req, res) => {
  try {
    const test = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Dis-moi bonjour comme un robot joyeux." }]
    });
    res.json({ success: true, reply: test.choices[0].message.content });
  } catch (err) {
    console.error("❌ Erreur OpenAI (test) :", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🌐 Lancement du serveur sur le port défini (ou 3000 par défaut)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${port}`);
});


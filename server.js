const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// 🔧 Middleware pour body parsing
app.use(express.json());

// 📁 Sert les fichiers statiques du dossier 'public'
app.use(express.static(path.join(__dirname, 'public')));

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


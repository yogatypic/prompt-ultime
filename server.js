import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Initialisation OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 📩 Route POST /api/chat
app.post("/api/chat", async (req, res) => {
  const { userMessage, contexte } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: "Message utilisateur manquant" });
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4", // ou "gpt-3.5-turbo"
      messages: [
        { role: "system", content: "Tu es un assistant pédagogique symbolique." },
        { role: "user", content: `${contexte}\n\n${userMessage}` }
      ],
      temperature: 0.7,
    });

    const reply = chatCompletion.choices?.[0]?.message?.content || "Pas de réponse générée.";
    res.json({ reply });
  } catch (err) {
    console.error("❌ Erreur API OpenAI :", err);
    res.status(500).json({ error: "Erreur lors de la génération : " + err.message });
  }
});

// 🔍 Route GET /test-openai – pour tester rapidement si l’API fonctionne
app.get("/test-openai", async (req, res) => {
  try {
    const test = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: "Dis simplement bonjour." }],
      temperature: 0.5,
    });

    res.json({ test: test.choices?.[0]?.message?.content });
  } catch (err) {
    console.error("🔧 Erreur test OpenAI :", err.message);
    res.status(500).json({ error: "Test échoué : " + err.message });
  }
});

// ▶️ Lancement du serveur
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});


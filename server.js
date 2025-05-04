import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // nécessaire si index.html est dans /public

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/chat', async (req, res) => {
  const { userMessage, contexte } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: contexte },
        { role: "user", content: userMessage }
      ],
      model: "gpt-3.5-turbo"
    });

    const reply = chatCompletion.choices?.[0]?.message?.content || "Pas de réponse générée.";
    res.json({ reply });
  } catch (err) {
    console.error("Erreur API OpenAI :", err);
    res.status(500).json({ error: "Erreur lors de la génération : " + err.message });
  }
});

// ✅ LIGNE ESSENTIELLE POUR RENDER :
const port = process.env.PORT;
if (!port) throw new Error("⛔ PORT non défini dans Render");
app.listen(port, () => {
  console.log(`✅ Serveur en ligne sur le port ${port}`);
});


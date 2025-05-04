import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  const { userMessage, contexte } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: `Tu es une IA pédagogique dans une expérience interactive. Contexte : ${contexte}` },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content;
    res.json({ reply });
  } catch (err) {
    console.error("Erreur OpenAI:", err);
    res.status(500).json({ error: "Erreur lors de la génération." });
  }
});

app.listen(port, () => {
  console.log(`✅ Serveur en ligne sur http://localhost:${port}`);
});


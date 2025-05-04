// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // sert index.html et les .json

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/chat', async (req, res) => {
  const { userMessage, contexte } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: `Tu es un compagnon pédagogique qui commente la réponse utilisateur avec humour, clarté et inspiration.` },
        { role: 'user', content: `Contexte de l'étape : ${contexte}` },
        { role: 'user', content: `Réponse utilisateur : ${userMessage}` }
      ],
      temperature: 0.8,
    });

    const aiReply = completion.choices[0].message.content;
    res.json({ reply: aiReply });
  } catch (err) {
    console.error('Erreur OpenAI :', err.message);
    res.status(500).json({ error: 'Erreur serveur ou OpenAI' });
  }
});

app.listen(port, () => {
  console.log(`✅ Serveur en ligne sur http://localhost:${port}`);
});


import dotenv from 'dotenv';
dotenv.config();
// 1. Clé API OpenAI (à personnaliser)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ✅ Script Node.js – Connexion à l'API OpenAI + sauvegarde automatique
import fs from 'fs';
import fetch from 'node-fetch';



// 2. Fonction principale
async function genererCodeViaOpenAI(promptTexte, cheminSortie = './suggestions/auto_001.js') {
  const body = {
    model: "gpt-4",
    messages: [{ role: "user", content: promptTexte }],
    temperature: 0.3
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    console.error("❌ Erreur API :", res.status, await res.text());
    return;
  }

  const data = await res.json();
  const texte = data.choices[0]?.message?.content || '';

  // 3. Enregistrement dans le dossier 'suggestions'
  fs.mkdirSync('./suggestions', { recursive: true });
  fs.writeFileSync(cheminSortie, texte, 'utf8');
  console.log(`✅ Code généré enregistré dans ${cheminSortie}`);
}

// 4. Exemple d’appel
const promptInitial = "Crée un script Node.js qui lit un fichier JSON, le valide avec AJV et affiche les erreurs.";
genererCodeViaOpenAI(promptInitial);


// admin.js — version dynamique API_BASE_URL

const API_BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://prompt-ultime.onrender.com";

// 1. SCAN FICHIERS
async function scanFichiers() {
  const resultatsScan = document.getElementById('resultatsScan');
  resultatsScan.innerHTML = "🔄 Chargement des fichiers...";
  try {
    const res = await fetch(`${API_BASE_URL}/api/list-fichiers`);
    const fichiers = await res.json();

    resultatsScan.innerHTML = "";
    fichiers.forEach(fichier => {
      const ligne = document.createElement('li');
      ligne.dataset.nom = fichier.nom;
      const zone = document.createElement('textarea');
      zone.value = fichier.contenu || '';
      zone.rows = 10;
      zone.cols = 80;
      ligne.appendChild(zone);
      resultatsScan.appendChild(ligne);
    });
  } catch (err) {
    resultatsScan.innerHTML = "❌ Erreur lors du scan : " + err.message;
  }
}

// 2. VALIDATION AJV
async function validerTousFichiers() {
  const liste = document.getElementById('resultatsScan');
  const lignes = liste.querySelectorAll('li');
  const rapport = [];

  const schemaContent = await fetch(`${API_BASE_URL}/schemas/etape.schema.json`).then(res => res.json());

  for (const ligne of lignes) {
    const nomFichier = ligne.dataset.nom;
    const contenuTexte = ligne.querySelector('textarea').value;
    const fichierJson = JSON.parse(contenuTexte);

    const resultat = { nomFichier };
    ligne.querySelectorAll('.ajv-erreurs').forEach(e => e.remove());

    try {
      const reponse = await fetch(`${API_BASE_URL}/api/validate-ajv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonContent: fichierJson, schemaContent })
      });

      const data = await reponse.json();
      if (reponse.ok) {
        ligne.style.border = '2px solid green';
        resultat.valide = true;
      } else {
        ligne.style.border = '2px solid red';
        resultat.valide = false;
        resultat.erreurs = data.errors;

        const err = document.createElement('pre');
        err.className = 'ajv-erreurs';
        err.style.color = 'red';
        err.textContent = JSON.stringify(data.errors, null, 2);
        ligne.appendChild(err);
      }
    } catch (err) {
      ligne.style.border = '2px solid orange';
      resultat.valide = false;
      resultat.erreurs = [{ message: err.message }];

      const errBox = document.createElement('pre');
      errBox.className = 'ajv-erreurs';
      errBox.style.color = 'orange';
      errBox.textContent = err.message;
      ligne.appendChild(errBox);
    }

    rapport.push(resultat);
  }

  console.log('📊 Rapport AJV :', rapport);

  await fetch(`${API_BASE_URL}/api/versioning`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nomFichier: 'rapport_validation.json',
      contenu: rapport
    })
  });
}

// 3. ÉDITION JSON
async function enregistrerJson() {
  const contenu = document.getElementById('jsonEditor').value;
  try {
    const jsonData = JSON.parse(contenu);
    await fetch(`${API_BASE_URL}/api/save-json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomFichier: 'edition.json',
        contenu: jsonData
      })
    });
    alert("💾 Fichier sauvegardé avec succès.");
  } catch (err) {
    alert("❌ Erreur JSON : " + err.message);
  }
}

// 4. SYNCHRONISATION API
async function envoyerAPI() {
  const contenu = document.getElementById('jsonEditor').value;
  try {
    await fetch(`${API_BASE_URL}/api/sync-api`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: contenu
    });
    alert("✅ Fichier envoyé à l’API.");
  } catch (err) {
    alert("❌ Échec de la synchronisation : " + err.message);
  }
}

// 5. VERSIONS
async function sauvegarderEtat() {
  await fetch(`${API_BASE_URL}/api/versioning`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nomFichier: 'sauvegarde_automatique.json',
      contenu: { date: new Date().toISOString(), message: "Sauvegarde d'état." }
    })
  });
  alert("📚 Point de restauration créé.");
}

// 6. ANALYSE LIBRE
async function analyserFichierLibre(event) {
  const file = event.target.files[0];
  const text = await file.text();
  const parsed = JSON.parse(text);

  const res = await fetch(`${API_BASE_URL}/api/analyse-libre`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contenu: parsed })
  });

  const data = await res.json();
  document.getElementById('resultatAnalyseLibre').textContent = JSON.stringify(data, null, 2);
}

// 7. IA DE PILOTAGE
async function executerCommandeIA() {
  const prompt = document.getElementById('promptIA').value.trim();
  const resultatZone = document.getElementById('resultatIA');
  const journalBloc = document.getElementById('journalTechnique');

  if (!prompt) {
    resultatZone.textContent = "⛔ Entrez un prompt.";
    return;
  }

  try {
    const reponse = await fetch(`${API_BASE_URL}/api/prompt-ia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await reponse.json();
    const horodatage = new Date().toISOString();
    const resultat = data.reponse || `❌ Erreur : ${data.error || 'Inconnue'}`;

    resultatZone.textContent = resultat;
    journalBloc.textContent += `\n[${horodatage}] 📡 Prompt IA :\n${prompt}\n✅ Réponse :\n${resultat}\n`;

    await fetch(`${API_BASE_URL}/api/versioning`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomFichier: `journal_ia.${horodatage}.json`,
        contenu: { prompt, reponse: data.reponse || null, erreur: data.error || null, timestamp: horodatage }
      })
    });

  } catch (err) {
    resultatZone.textContent = "❌ Exception IA : " + err.message;
    journalBloc.textContent += `\n[${new Date().toISOString()}] ❌ Exception IA : ${err.message}`;
  }
}

// 10. HISTORIQUE IA
async function chargerHistoriqueIA() {
  const res = await fetch(`${API_BASE_URL}/api/historique-ia`);
  const historique = await res.json();
  document.getElementById('historiqueIA').textContent = JSON.stringify(historique, null, 2);
}

// 9. IMPORT PYTHON
async function lancerImportJson() {
  const res = await fetch(`${API_BASE_URL}/api/import-json`);
  const log = await res.text();
  document.getElementById('logImportJson').textContent = log;
}


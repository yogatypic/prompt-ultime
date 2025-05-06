// admin.js – Script principal de l’interface admin du Prompt Ultime

// === 1. Scan des fichiers ===
function scanFichiers() {
  const resultats = document.getElementById("resultatsScan");
  resultats.innerText = "📡 Scan en cours...";

  fetch("structure.json")
    .then(res => res.json())
    .then(data => {
      resultats.innerText = "✅ Fichier structure.json chargé.";
      resultats.innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      logJournal("✅ Scan local : structure.json chargé avec succès.");
    })
    .catch(err => {
      resultats.innerText = "❌ Erreur lors du chargement.";
      logJournal("❌ Scan échoué : " + err.message);
    });
}

// === 2. Validation AJV réelle via API ===
async function validerTousFichiers() {
  const erreursDiv = document.getElementById("erreursValidation");
  erreursDiv.innerText = "🧪 Validation en cours...";

  const fichiers = [
    "structure",
    "meta",
    "introduction_et_mission",
    "axes_autistiques",
    "compagnons_symboliques",
    "lunettes_subjectives",
    "masques_symboliques",
    "etape_0_seuil_entree",
    "etape_1_observation",
    "etape_2_lunettes",
    "etape_3_lecture_croisee",
    "etape_4_metadiscernement",
    "etape_5_resonance_finale"
  ];

  let erreursTotales = [];

  for (const nom of fichiers) {
    try {
      const [jsonRes, schemaRes] = await Promise.all([
        fetch(`public/${nom}.json`).then(r => r.json()),
        fetch(`schemas/${nom}.schema.json`).then(r => r.json())
      ]);

      const res = await fetch("/api/validate-ajv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonContent: jsonRes,
          schemaContent: schemaRes
        })
      });

      const result = await res.json();
      if (!result.valid) {
        erreursTotales.push(`❌ ${nom}.json invalide :\n` + JSON.stringify(result.errors, null, 2));
      } else {
        logJournal(`✅ ${nom}.json valide`);
      }

    } catch (err) {
      erreursTotales.push(`❌ Erreur validation ${nom}.json : ${err.message}`);
    }
  }

  erreursDiv.innerText = erreursTotales.length === 0
    ? "✅ Tous les fichiers sont valides !"
    : erreursTotales.join("\n\n");
}


// === 3. Enregistrement JSON modifié ===
function enregistrerJson() {
  const contenu = document.getElementById("jsonEditor").value;

  try {
    const obj = JSON.parse(contenu);
    alert("✅ JSON valide — enregistrement simulé.");
    // TODO : Enregistrer vers un fichier, API, ou localStorage
  } catch (e) {
    alert("❌ Erreur : JSON invalide\n\n" + e.message);
  }
}

// === 4. Synchronisation API ===
function envoyerAPI() {
  document.getElementById("logAPI").innerText = "🔄 Appel API simulé...";
  
  // TODO : Intégrer appel réel (ex : OpenAI, GitHub)
  setTimeout(() => {
    document.getElementById("logAPI").innerText = "✅ API contactée (test).";
  }, 1000);
}

// === 6. Analyse d’un fichier libre ===
function analyserFichierLibre(event) {
  const fichier = event.target.files[0];
  const lecteur = new FileReader();

  lecteur.onload = function(e) {
    try {
      const contenu = JSON.parse(e.target.result);
      document.getElementById("resultatAnalyseLibre").innerText = "✅ Fichier analysé.";
      document.getElementById("jsonEditor").value = JSON.stringify(contenu, null, 2);
    } catch (err) {
      document.getElementById("resultatAnalyseLibre").innerText = "❌ Fichier invalide ou corrompu.";
    }
  };

  lecteur.readAsText(fichier);
}

// === 7. Pilotage IA ===
function executerCommandeIA() {
  const prompt = document.getElementById("promptIA").value;

  if (!prompt.trim()) {
    alert("⚠️ Merci d'écrire une commande IA.");
    return;
  }

  // TODO : Envoyer vers une API OpenAI ou locale
  document.getElementById("resultatIA").innerText = "🧠 Réponse simulée de l'IA : [à venir]";
}
// === 8. Journal technique ===
function logJournal(message) {
  const journal = document.getElementById('journalTechnique');
  const timestamp = new Date().toLocaleTimeString();
  journal.textContent += `[${timestamp}] ${message}\n`;
}
// === 9. Lancer le script Python via l’API ===
function lancerImportJson() {
  const log = document.getElementById("logImportJson");
  log.textContent = "⏳ Import en cours...";

  fetch("/api/import-json")
    .then(res => res.json())
    .then(data => {
      log.textContent = `✅ Import terminé :\n\n${data.log}`;
      logJournal("✅ Script import_json.py exécuté avec succès.");
    })
    .catch(err => {
      log.textContent = `❌ Erreur import : ${err.message}`;
      logJournal("❌ Échec import JSON : " + err.message);
    });
}


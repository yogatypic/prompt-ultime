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

// === 2. Validation AJV réelle ===
async function validerTousFichiers() {
  const fichiers = [
    "structure",
    "meta",
    "lunettes_subjectives",
    "introduction_et_mission",
    "etape_0_seuil_entree",
    "etape_1_observation",
    "etape_2_lunettes",
    "etape_3_lecture_croisee",
    "etape_4_metadiscernement",
    "etape_5_resonance_finale",
    "compagnons_symboliques",
    "axes_autistiques"
  ];

  const container = document.getElementById("erreursValidation");
  container.innerHTML = "🧪 Validation en cours...<br>";

  for (const nom of fichiers) {
    try {
      const jsonData = await fetch(`/${nom}.json`).then(res => res.json());
      const schemaData = await fetch(`/schemas/${nom}.schema.json`).then(res => res.json());

      const res = await fetch("/api/validate-ajv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonContent: jsonData, schemaContent: schemaData })
      });

      if (res.ok) {
        container.innerHTML += `✅ <b>${nom}.json</b> : Valide<br>`;
        logJournal(`✅ ${nom}.json validé`);
      } else {
        const err = await res.json();
        container.innerHTML += `❌ <b>${nom}.json</b> : Erreurs AJV<br><pre>${JSON.stringify(err.errors, null, 2)}</pre>`;
        logJournal(`❌ ${nom}.json invalide`);
      }
    } catch (err) {
      console.error(err); // Ajouté pour le diagnostic
      container.innerHTML += `❌ <b>${nom}.json</b> : Erreur de chargement ou validation<br>`;
      logJournal(`❌ Erreur AJV ${nom}.json : ${err.message}`);
    }
  }
}

// === 3. Enregistrement JSON modifié ===
function enregistrerJson() {
  const contenu = document.getElementById("jsonEditor").value;

  try {
    const obj = JSON.parse(contenu);
    alert("✅ JSON valide — enregistrement simulé.");
    // TODO : Enregistrement réel si nécessaire
  } catch (e) {
    alert("❌ Erreur : JSON invalide\n\n" + e.message);
  }
}

// === 4. Synchronisation API ===
function envoyerAPI() {
  document.getElementById("logAPI").innerText = "🔄 Appel API simulé...";
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

// === 7. Pilotage IA – Appel réel + enregistrement versionné ===
function executerCommandeIA() {
  const prompt = document.getElementById("promptIA").value.trim();
  const resultat = document.getElementById("resultatIA");

  if (!prompt) {
    alert("⚠️ Merci d'écrire une commande IA.");
    return;
  }

  resultat.innerText = "⏳ Appel à l'IA en cours...";
  logJournal("📡 Envoi du prompt à l’IA : " + prompt);

  fetch("/api/prompt-ia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  })
    .then(res => {
      if (!res.ok) throw new Error("Réponse non valide du serveur IA.");
      return res.json();
    })
    .then(data => {
      const reponse = data.reponse || "❌ Réponse vide.";
      resultat.innerText = "🤖 " + reponse;
      logJournal("✅ Réponse IA : " + reponse);

      const contenu = {
        prompt,
        reponse,
        timestamp: new Date().toISOString()
      };

      return fetch("/api/versioning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomFichier: "journal_ia.json",
          contenu
        })
      });
    })
    .then(res => {
      if (res && res.ok) {
        logJournal("🗂️ Échange IA enregistré dans journal_ia.json");
      } else if (res) {
        logJournal("⚠️ Échec enregistrement journal IA.");
      }
    })
    .catch(err => {
      resultat.innerText = "❌ Erreur IA : " + err.message;
      logJournal("❌ Échec appel IA : " + err.message);
    });
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

// === 10. Historique IA – Lecture des versions de journal_ia.json ===
function chargerHistoriqueIA() {
  const historique = document.getElementById("historiqueIA");
  historique.textContent = "📡 Chargement en cours...";

  fetch("/api/list-versions")
    .then(res => res.json())
    .then(data => {
      const fichiers = data.fichiers || [];
      if (fichiers.length === 0) {
        historique.textContent = "📭 Aucun journal IA trouvé.";
        return;
      }

      const promesses = fichiers.map(f =>
        fetch(`/versions/${f}`).then(res => res.json().catch(() => ({ erreur: "Fichier corrompu" })))
      );

      Promise.all(promesses).then(donnees => {
        let rendu = "";
        donnees.forEach((obj, idx) => {
          if (obj.erreur) {
            rendu += `❌ Erreur dans ${fichiers[idx]}\n`;
          } else {
            rendu += `🗂️ ${fichiers[idx]}\nPrompt : ${obj.prompt}\nRéponse : ${obj.reponse}\n---\n`;
          }
        });
        historique.textContent = rendu;
      });
    })
    .catch(err => {
      historique.textContent = "❌ Erreur : " + err.message;
    });
}


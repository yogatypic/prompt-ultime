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

      const boutonReparer = document.createElement('button');
      boutonReparer.textContent = "🛠️ Réparer ce fichier";
      boutonReparer.onclick = () => reparerFichier(fichier.nom, zone);
      ligne.appendChild(boutonReparer);

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
    let fichierJson;

    try {
      fichierJson = JSON.parse(contenuTexte);
    } catch (err) {
      ligne.style.border = '2px solid orange';
      const errBox = document.createElement('pre');
      errBox.className = 'ajv-erreurs';
      errBox.style.color = 'orange';
      errBox.textContent = 'Erreur JSON : ' + err.message;
      ligne.appendChild(errBox);
      rapport.push({ nomFichier, valide: false, erreurs: [{ message: err.message }] });
      continue;
    }

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

// 3. CHARGEMENT DES VERSIONS DISPONIBLES
async function chargerListeVersions() {
  const liste = document.getElementById('listeVersions');
  liste.innerHTML = "⌛ Chargement des versions...";

  try {
    const res = await fetch(`${API_BASE_URL}/api/list-versions`);
    const fichiers = await res.json();
    liste.innerHTML = '';

    const select = document.createElement('select');
    select.id = 'selectVersion';
    fichiers.forEach(({ nom }) => {
      const opt = document.createElement('option');
      opt.value = nom;
      opt.textContent = nom;
      select.appendChild(opt);
    });
    liste.appendChild(select);

    const boutonRestaurer = document.createElement('button');
    boutonRestaurer.textContent = '♻️ Restaurer cette version';
    boutonRestaurer.onclick = restaurerVersion;
    liste.appendChild(boutonRestaurer);

  } catch (err) {
    liste.innerHTML = "❌ Erreur chargement versions : " + err.message;
  }
}

// 4. RESTAURER UNE VERSION
async function restaurerVersion() {
  const select = document.getElementById('selectVersion');
  const nomVersion = select.value;
  if (!nomVersion) return alert("Aucune version sélectionnée.");

  const cible = nomVersion.split('.').slice(0, -3).join('.') + '.json';

  try {
    const res = await fetch(`${API_BASE_URL}/api/restaurer-version`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nomVersion, cible })
    });

    if (res.ok) {
      alert("✅ Version restaurée avec succès.");
    } else {
      const err = await res.text();
      alert("❌ Échec restauration : " + err);
    }
  } catch (err) {
    alert("❌ Exception restauration : " + err.message);
  }
}

// 5. RÉPARATION IA D'UN FICHIER
async function reparerFichier(nomFichier, textarea) {
  const zone = textarea;
  zone.style.border = '2px dashed blue';

  try {
    const res = await fetch(`${API_BASE_URL}/api/autogestion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'réparer', cible: nomFichier })
    });
    const data = await res.json();

    if (res.ok && data.reparation) {
      zone.value = data.reparation;
      zone.style.border = '2px solid blue';
    } else {
      alert("❌ Échec de la réparation IA.");
    }
  } catch (err) {
    alert("❌ Erreur IA : " + err.message);
  }
}
<script>
function genererMetaPrompt() {
  fetch("/api/generer-meta-prompt", {
    method: "POST"
  })
  .then(response => response.json())
  .then(data => {
    const journal = document.getElementById("journalMetaPrompt");
    if (data.status === "ok") {
      journal.innerHTML = `<p style="color:green;">✅ ${data.message}</p><pre>${data.stdout || ''}</pre>`;
    } else {
      journal.innerHTML = `<p style="color:red;">❌ ${data.message}</p><pre>${data.stderr || ''}</pre>`;
    }
  })
  .catch(err => {
    document.getElementById("journalMetaPrompt").innerHTML =
      `<p style="color:red;">❌ Erreur réseau ou serveur : ${err}</p>`;
  });
}
</script>


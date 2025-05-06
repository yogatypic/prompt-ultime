// admin.js

document.getElementById('btnValiderAJV').addEventListener('click', async () => {
  const liste = document.getElementById('resultatScan');
  const lignes = liste.querySelectorAll('li');
  const rapport = [];

  // 🧠 Charger le schéma AJV unifié une seule fois
  const schemaContent = await fetch('/schemas/etape.schema.json').then(res => res.json());

  for (const ligne of lignes) {
    const nomFichier = ligne.dataset.nom;
    const contenuTexte = ligne.querySelector('textarea').value;
    const fichierJson = JSON.parse(contenuTexte);

    const resultat = { nomFichier };

    try {
      const reponse = await fetch('/api/validate-ajv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonContent: fichierJson, schemaContent }) // ✅ schéma générique
      });

      const data = await reponse.json();
      if (reponse.ok) {
        ligne.style.border = '2px solid green';
        resultat.valide = true;
      } else {
        ligne.style.border = '2px solid red';
        resultat.valide = false;
        resultat.erreurs = data.errors;
      }
    } catch (err) {
      ligne.style.border = '2px solid orange';
      resultat.valide = false;
      resultat.erreurs = [{ message: err.message }];
    }

    rapport.push(resultat);
  }

  console.log('📊 Rapport AJV :', rapport);
});


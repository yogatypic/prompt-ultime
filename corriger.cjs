// corriger.js
const fs = require('fs');
const path = require('path');

const dossier = './public/IA';
const fichierStructure = path.join(dossier, 'structure.json');

// 🔧 Corriger les champs manquants dans les étapes
const corrigerChampsEtape = (nomFichier, corrections) => {
  const chemin = path.join(dossier, nomFichier);
  if (!fs.existsSync(chemin)) return;

  let data = JSON.parse(fs.readFileSync(chemin, 'utf-8'));

  if (Array.isArray(data.champs)) {
    data.champs = data.champs.map((champ, i) => ({
      nom: champ.nom || corrections[i]?.nom || `champ_${i + 1}`,
      type: champ.type || corrections[i]?.type || 'texte',
      ...champ
    }));
  }

  if (Array.isArray(data.structure_lunette)) {
    data.structure_lunette = data.structure_lunette.map((item, i) => ({
      champ: item.champ || corrections[i]?.champ || `champ_${i + 1}`,
      libelle: item.libelle || corrections[i]?.libelle || `Libellé ${i + 1}`,
      ...item
    }));
  }

  fs.writeFileSync(chemin, JSON.stringify(data, null, 2));
  console.log(`✅ Corrigé : ${nomFichier}`);
};

// 🔧 Corriger les types incorrects
const forcerTableau = (fichier, propriete) => {
  const chemin = path.join(dossier, fichier);
  if (!fs.existsSync(chemin)) return;

  let data = JSON.parse(fs.readFileSync(chemin, 'utf-8'));
  if (!Array.isArray(data[propriete])) {
    data[propriete] = [];
    fs.writeFileSync(chemin, JSON.stringify(data, null, 2));
    console.log(`✅ ${propriete} corrigé comme tableau dans ${fichier}`);
  }
};

// 🔧 Corriger les chemins de fichiers dans structure.json
const corrigerStructure = () => {
  if (!fs.existsSync(fichierStructure)) return;
  let data = JSON.parse(fs.readFileSync(fichierStructure, 'utf-8'));

  data.etapes = data.etapes.map(e => {
    if (typeof e.fichier === 'string') {
      e.fichier = e.fichier.replace('.json.json', '.json');
    }
    return e;
  });

  fs.writeFileSync(fichierStructure, JSON.stringify(data, null, 2));
  console.log('✅ structure.json corrigé.');
};

// ▶️ Exécution
console.log('🔧 Début de la correction...');

corrigerChampsEtape('etape_5_resonance_finale.json', []);
corrigerChampsEtape('lunettes_subjectives.json', []);
forcerTableau('compagnons_symboliques.json', 'masques');
forcerTableau('lunettes_subjectives.json', 'familles');
corrigerStructure();

console.log('✅ Toutes les corrections ont été appliquées.');


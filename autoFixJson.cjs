const fs = require('fs');
const path = require('path');

const files = {
  'meta.json': {
    etapes: [
      "etape_0_seuil_entree",
      "etape_1_observation",
      "etape_2_lunettes",
      "etape_3_lecture_croisee",
      "etape_4_metadiscernement",
      "etape_5_resonance_finale"
    ]
  },
  'lunettes_subjectives.json': {
    structure_lunette: [
      {
        champ: "Type de regard",
        libelle: "exemple"
      }
    ]
  },
  'etape_0_seuil_entree.json': "REMOVE_ID",
  'etape_2_lunettes.json': {
    familles: [
      {
        id: "famille_exemple",
        nom: "Famille Exemple",
        lunettes: []
      }
    ]
  },
  'etape_3_lecture_croisee.json': {
    structure_par_lunette: {
      lunette_exemple: [
        { champ: "exemple" }
      ]
    }
  },
  'etape_4_metadiscernement.json': {
    questions_reflexives: [
      { question: "Comment ressentez-vous cette étape ?" }
    ]
  },
  'etape_5_resonance_finale.json': {
    champs: [
      {
        champ: "Résonance cognitive",
        type: "texte"
      }
    ]
  },
  'compagnons_symboliques.json': {
    masques: [
      {
        nom: "Socrate",
        style: "ironie maïeutique",
        citation: "Connais-toi toi-même",
        description: "Le questionneur par excellence."
      }
    ]
  },
  'axes_autistiques.json': {
    axes: [
      {
        nom: "Sincérité radicale",
        description: "Explorer sans filtre les ressentis internes.",
        question: "Qu’est-ce qui sonne faux dans ce que tu viens de dire ?"
      }
    ]
  }
};

const baseDir = path.join(__dirname, 'public');

Object.entries(files).forEach(([fileName, correction]) => {
  const filePath = path.join(baseDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`❌ Fichier non trouvé : ${filePath}`);
    return;
  }

  try {
    const original = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // sauvegarde backup
    const backupPath = filePath.replace(/\.json$/, `.bak.json`);
    fs.writeFileSync(backupPath, JSON.stringify(original, null, 2), 'utf8');

    let updated = { ...original };

    if (correction === "REMOVE_ID") {
      delete updated.id;
    } else {
      for (const [key, value] of Object.entries(correction)) {
        updated[key] = value;
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf8');
    console.log(`✅ Corrigé : ${fileName}`);
  } catch (e) {
    console.error(`❌ Erreur dans ${fileName} : ${e.message}`);
  }
});


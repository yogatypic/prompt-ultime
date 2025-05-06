const fs = require('fs');
const path = require('path');

const corrections = {
  'etape_0_seuil_entree.json': (data) => {
    delete data.consigne_logique;
    return data;
  },

  'etape_3_lecture_croisee.json': (data) => {
    if (data.structure_par_lunette?.lunette_exemple?.[0]) {
      data.structure_par_lunette.lunette_exemple[0].consigne ??= "Complète cette interprétation symbolique.";
    }
    return data;
  },

  'etape_4_metadiscernement.json': (data) => {
    if (data.questions_reflexives?.[0]) {
      data.questions_reflexives[0].id ??= "q1";
    }
    return data;
  },

  'etape_5_resonance_finale.json': (data) => {
    if (data.champs?.[0]) {
      data.champs[0].nom ??= data.champs[0].champ || "Résonance";
    }
    return data;
  },

  'compagnons_symboliques.json': (data) => {
    if (data.masques?.[0]) {
      data.masques[0].id ??= "socrate";
    }
    return data;
  },

  'axes_autistiques.json': (data) => {
    if (data.axes?.[0]) {
      data.axes[0].id ??= "axe1";
    }
    return data;
  }
};

const baseDir = path.join(__dirname, 'public');

Object.entries(corrections).forEach(([fileName, fixFn]) => {
  const filePath = path.join(baseDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`❌ Fichier non trouvé : ${filePath}`);
    return;
  }

  try {
    const original = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const backupPath = filePath.replace(/\.json$/, `.bak.json`);
    fs.writeFileSync(backupPath, JSON.stringify(original, null, 2), 'utf8');

    const fixed = fixFn({ ...original });
    fs.writeFileSync(filePath, JSON.stringify(fixed, null, 2), 'utf8');
    console.log(`✅ Corrigé : ${fileName}`);
  } catch (err) {
    console.error(`❌ Erreur dans ${fileName} : ${err.message}`);
  }
});


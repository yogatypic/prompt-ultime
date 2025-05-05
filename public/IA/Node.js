const fs = require('fs');
const path = require('path');

// Charger le fichier IA1.json
const dataFile = path.join(__dirname, '/mnt/data/IA1.json');
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// Fonction pour extraire des informations spécifiques
const extractInfo = () => {
  return {
    meta: data.meta,
    introduction: data.introduction_et_mission,
    etape_1_observation: data.etape_1_observation,
    etape_2_lunettes: data.etape_2_lunettes,
    etape_3_lecture_croisee: data.etape_3_lecture_croisee,
    etape_4_metadiscernement: data.etape_4_metadiscernement,
  };
};

// Fonction pour remplir chaque fichier JSON
const updateJSONFiles = (extractedData) => {
  const outputDirectory = path.join(__dirname, 'public/IA');
  
  // Créez un fichier JSON pour chaque étape
  Object.keys(extractedData).forEach((key) => {
    const filePath = path.join(outputDirectory, `${key}.json`);
    fs.writeFileSync(filePath, JSON.stringify(extractedData[key], null, 2));
    console.log(`Fichier ${key} mis à jour à : ${filePath}`);
  });
};

// Extraire les informations et mettre à jour les fichiers JSON
const extractedData = extractInfo();
updateJSONFiles(extractedData);


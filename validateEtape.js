import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ajv = new Ajv({ allErrors: true });

// 📥 Charger le schéma AJV
const schemaPath = path.join(__dirname, 'schemas', 'etape.schema.json');
const schemaEtape = JSON.parse(await fs.readFile(schemaPath, 'utf-8'));

// 📥 Charger structure.json
const structurePath = path.join(__dirname, 'structure.json');
const structure = JSON.parse(await fs.readFile(structurePath, 'utf-8'));

// 📁 Dossier contenant les fichiers d'étapes
const baseDir = path.join(__dirname, 'public');

// 📋 Lister les fichiers à valider
const fichiersEtapes = structure.etapes || [];

if (fichiersEtapes.length === 0) {
  console.warn('⚠️ Aucun fichier dans structure.etapes[]');
  process.exit(1);
}

console.log(`🔍 Validation de ${fichiersEtapes.length} étapes :\n`);

for (const file of fichiersEtapes) {
  const filePath = path.join(baseDir, file);

  try {
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    const valid = ajv.validate(schemaEtape, data);

    if (valid) {
      console.log(`✅ ${file} est valide`);
    } else {
      console.log(`❌ ${file} invalide :`);
      console.log(ajv.errors);
    }
  } catch (err) {
    console.error(`💥 Erreur de lecture ou JSON dans ${file} : ${err.message}`);
  }
}


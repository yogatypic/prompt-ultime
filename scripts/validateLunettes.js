// scripts/validateLunettes.js
import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const structurePath = './structure.json';
const schemaPath = './schemas/lunettes.schema.json';

// 1. Vérifier que les fichiers existent
if (!fs.existsSync(structurePath)) {
  console.error(`❌ Fichier structure.json introuvable`);
  process.exit(1);
}
if (!fs.existsSync(schemaPath)) {
  console.error(`❌ Schéma AJV introuvable : ${schemaPath}`);
  process.exit(1);
}

const structure = JSON.parse(fs.readFileSync(structurePath, 'utf-8'));
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
const validate = ajv.compile(schema);

// 2. Valider tous les fichiers de lunettes
console.log("🔎 Validation des fichiers de lunettes...");

let allValid = true;

for (const lunette of structure.lunettes || []) {
  const filePath = path.resolve('./public/', lunette.fichier);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Fichier manquant : ${filePath}`);
    allValid = false;
    continue;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const valid = validate(data);

  if (valid) {
    console.log(`✅ ${lunette.fichier} est valide`);
  } else {
    console.error(`❌ ${lunette.fichier} invalide :`);
    console.table(validate.errors.map(err => ({
      chemin: err.instancePath || '/',
      erreur: err.message,
      contexte: err.params
    })));
    allValid = false;
  }
}

if (allValid) {
  console.log("\n🎉 Tous les fichiers de lunettes sont valides !");
} else {
  console.warn("\n⚠️ Des erreurs ont été détectées.");
  process.exit(1);
}


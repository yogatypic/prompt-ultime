// scripts/validateStructure.js
import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Fichiers nécessaires
const structurePath = './structure.json';
const structureSchemaPath = './schemas/structure.schema.json';
const indexLunettesSchemaPath = './schemas/index_lunettes.schema.json';

// Vérifier présence des fichiers
if (!fs.existsSync(structurePath)) {
  console.error("❌ structure.json introuvable.");
  process.exit(1);
}
if (!fs.existsSync(indexLunettesSchemaPath)) {
  console.error("❌ Schéma index_lunettes introuvable.");
  process.exit(1);
}

const structure = JSON.parse(fs.readFileSync(structurePath, 'utf-8'));
const schemaLunettes = JSON.parse(fs.readFileSync(indexLunettesSchemaPath, 'utf-8'));
const validateLunettes = ajv.compile(schemaLunettes);

console.log("🔍 Validation du tableau 'lunettes' dans structure.json...");
const valid = validateLunettes(structure.lunettes);

if (valid) {
  console.log("✅ Bloc 'lunettes' est valide.");
} else {
  console.error("❌ Erreurs dans le bloc 'lunettes' :");
  console.table(validateLunettes.errors.map(err => ({
    chemin: err.instancePath,
    erreur: err.message,
    contexte: err.params
  })));
}

// (Facultatif) valider la structure globale complète si le schéma est présent
if (fs.existsSync(structureSchemaPath)) {
  const schemaGlobal = JSON.parse(fs.readFileSync(structureSchemaPath, 'utf-8'));
  const validateGlobal = ajv.compile(schemaGlobal);
  const globalValid = validateGlobal(structure);

  console.log("\n🔍 Validation globale de structure.json...");

  if (globalValid) {
    console.log("✅ structure.json complet est globalement valide.");
  } else {
    console.error("❌ Erreurs dans structure.json :");
    console.table(validateGlobal.errors.map(err => ({
      chemin: err.instancePath,
      erreur: err.message,
      contexte: err.params
    })));
  }
}


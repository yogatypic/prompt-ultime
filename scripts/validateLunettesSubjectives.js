import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Résolution absolue des chemins
const schemaPath = path.resolve('./schemas/lunettes_subjectives.schema.json');
const jsonPath = path.resolve('./public/lunettes_subjectives.json');

// Vérification existence des fichiers
if (!fs.existsSync(schemaPath)) {
  console.error(`❌ Schéma introuvable : ${schemaPath}`);
  process.exit(1);
}

if (!fs.existsSync(jsonPath)) {
  console.error(`❌ Fichier JSON introuvable : ${jsonPath}`);
  process.exit(1);
}

// Chargement des fichiers avec gestion d'erreur
let schema, data;
try {
  schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
} catch (e) {
  console.error(`❌ Erreur lors de la lecture du schéma : ${e.message}`);
  process.exit(1);
}

try {
  data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
} catch (e) {
  console.error(`❌ Erreur lors de la lecture du fichier JSON : ${e.message}`);
  process.exit(1);
}

// Compilation et validation
const validate = ajv.compile(schema);
const valid = validate(data);

if (valid) {
  console.log("✅ lunettes_subjectives.json est VALIDE ✅");
} else {
  console.error("❌ Erreurs de validation détectées :");
  console.table(validate.errors.map(err => ({
    chemin: err.instancePath || '/',
    erreur: err.message,
    contexte: err.params
  })));
  process.exit(1);
}


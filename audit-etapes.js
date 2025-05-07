// audit-etapes.js
import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';

// Initialisation de AJV avec options souples
const ajv = new Ajv({ allErrors: true, strict: false });

// Chargement du schéma
const schemaPath = './public/schemas/etape.schema.json';
if (!fs.existsSync(schemaPath)) {
  console.error(`❌ Schéma introuvable à : ${schemaPath}`);
  process.exit(1);
}
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
const validate = ajv.compile(schema);

// Chargement du fichier structure.json
const structurePath = './public/structure.json';
if (!fs.existsSync(structurePath)) {
  console.error(`❌ Fichier structure.json introuvable.`);
  process.exit(1);
}
const structure = JSON.parse(fs.readFileSync(structurePath, 'utf-8'));
const etapes = structure.etapes || [];

console.log(`🔍 Audit AJV des ${etapes.length} étapes déclarées dans structure.json:\n`);

for (const fichier of etapes) {
  const chemin = path.join('./public/', fichier);
  if (!fs.existsSync(chemin)) {
    console.log(`⚠️ ${fichier} : fichier introuvable dans ./public/`);
    continue;
  }

  try {
    const data = JSON.parse(fs.readFileSync(chemin, 'utf-8'));
    const valide = validate(data);
    if (valide) {
      console.log(`✅ ${fichier} : OK`);
    } else {
      console.log(`❌ ${fichier} : erreurs de validation :\n  → ${ajv.errorsText(validate.errors, { separator: '\n  → ' })}`);
    }
  } catch (err) {
    console.log(`💥 ${fichier} : erreur de lecture JSON → ${err.message}`);
  }
}


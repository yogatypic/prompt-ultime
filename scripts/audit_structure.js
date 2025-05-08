// audit_structure.js
import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const structurePath = './structure.json';
const baseDir = path.dirname(structurePath);

// Charger structure.json
if (!fs.existsSync(structurePath)) {
  console.error(`❌ structure.json introuvable à : ${structurePath}`);
  process.exit(1);
}

const structureData = JSON.parse(fs.readFileSync(structurePath, 'utf-8'));
const schemaPath = structureData.schemas?.structure || './schemas/structure.schema.json';

if (!fs.existsSync(schemaPath)) {
  console.error(`❌ Schéma AJV introuvable : ${schemaPath}`);
  process.exit(1);
}

const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));

// Initialiser AJV
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validate = ajv.compile(schemaData);

const valid = validate(structureData);

if (valid) {
  console.log('✅ structure.json est valide ✅');
} else {
  console.error('❌ Erreurs de validation :');
  validate.errors.forEach(err => {
    console.error(`🔸 ${err.instancePath} ${err.message}`);
  });
  process.exit(1);
}


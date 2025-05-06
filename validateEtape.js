const fs = require('fs');
const Ajv = require('ajv');

// Charger AJV
const ajv = new Ajv({ allErrors: true });

// Charger le schéma
const schemaEtape = JSON.parse(fs.readFileSync('./schemas/etape.schema.json', 'utf-8'));

// Charger un fichier d'étape
const data = JSON.parse(fs.readFileSync('./public/etape_1_observation.json', 'utf-8'));

// Valider
const valid = ajv.validate(schemaEtape, data);

if (valid) {
  console.log('✅ Le fichier est valide !');
} else {
  console.error('❌ Le fichier est invalide :');
  console.error(ajv.errors);
}


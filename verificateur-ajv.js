import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import draft2020 from 'ajv/dist/refs/json-schema-2020-12/schema.json'; // ✅ schéma local

// Récupérer __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialiser AJV
const ajv = new Ajv({ allErrors: true, strict: false });
ajv.addMetaSchema(draft2020); // ✅ ajout du schéma standard
addFormats(ajv);

// Répertoires
const dossierIA = path.join(__dirname, 'public', 'IA');
const dossierSchemas = path.join(__dirname, 'schemas');

// Association : fichiers JSON ↔ fichiers de schéma
const fichiers = {
  'meta.json': 'meta.schema.json',
  'structure.json': 'structure.schema.json',
  'introduction_et_mission.json': 'introduction_et_mission.schema.json',
  'etape_0_seuil_entree.json': 'etape_0_seuil_entree.schema.json',
  'etape_1_observation.json': 'etape_1_observation.schema.json',
  'etape_2_lunettes.json': 'etape_2_lunettes.schema.json',
  'etape_3_lecture_croisee.json': 'etape_3_lecture_croisee.schema.json',
  'etape_4_metadiscernement.json': 'etape_4_metadiscernement.schema.json',
  'etape_5_resonance_finale.json': 'etape_5_resonance_finale.schema.json',
  'compagnons_symboliques.json': 'compagnons_symboliques.schema.json',
  'axes_autistiques.json': 'axes_autistiques.schema.json',
  'lunettes_subjectives.json': 'lunettes_subjectives.schema.json'
};

let erreursTrouvées = false;
let fichiersValides = {};

console.log('🔍 Démarrage de la vérification AJV...\n');

for (const [fichier, schemaNom] of Object.entries(fichiers)) {
  const cheminFichier = path.join(dossierIA, fichier);
  const cheminSchema = path.join(dossierSchemas, schemaNom);

  if (!fs.existsSync(cheminFichier)) {
    console.error(`❌ Fichier manquant : ${fichier}`);
    erreursTrouvées = true;
    continue;
  }
  if (!fs.existsSync(cheminSchema)) {
    console.error(`❌ Schéma manquant : ${schemaNom}`);
    erreursTrouvées = true;
    continue;
  }

  try {
    const data = JSON.parse(fs.readFileSync(cheminFichier, 'utf-8'));
    const schema = JSON.parse(fs.readFileSync(cheminSchema, 'utf-8'));

    const validate = ajv.compile(schema);
    const valide = validate(data);

    if (valide) {
      console.log(`✅ Valide : ${fichier}`);
      fichiersValides[fichier] = data;
    } else {
      console.error(`❌ Erreurs dans ${fichier} :`);
      console.error(validate.errors);
      erreursTrouvées = true;
    }
  } catch (e) {
    console.error(`❌ Erreur dans ${fichier} : ${e.message}`);
    erreursTrouvées = true;
  }
}

// Vérifie la cohérence croisée avec structure.json
function verifierStructure() {
  const structure = fichiersValides['structure.json'];
  if (!structure || !Array.isArray(structure.etapes)) {
    console.error('❌ structure.json est mal formé ou absent.');
    erreursTrouvées = true;
    return;
  }

  console.log('\n🔗 Vérification des étapes dans structure.json...\n');

  structure.etapes.forEach(nom => {
    const fichierEtape = `${nom}.json`;
    const chemin = path.join(dossierIA, fichierEtape);
    if (!fs.existsSync(chemin)) {
      console.error(`❌ Étape référencée manquante : ${fichierEtape}`);
      erreursTrouvées = true;
    } else {
      console.log(`🔗 Étape présente : ${fichierEtape}`);
    }
  });
}

verifierStructure();

console.log('\n📦 Résultat final :');
if (!erreursTrouvées) {
  console.log('✅ Tous les fichiers sont valides et cohérents.');
} else {
  console.warn('⚠️ Des erreurs ont été détectées. Corrigez les fichiers JSON ou les schémas.');
}


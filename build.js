const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

console.log("🔁 Build complet en cours...\n");

// 1. Génération des lunettes
console.log("🔨 Étape 1 : Génération des lunettes...");
execSync("node scripts/generateLunettes.js", { stdio: "inherit" });


// 2. Validation AJV des lunettes
console.log("\n🔍 Étape 2 : Validation des lunettes JSON avec AJV...");

const dossierData = "public/lunettes";
const schemaDir = "schemas";
const schemaPath = path.join(schemaDir, "lunette.schema.json");

if (!fs.existsSync(schemaPath)) {
  console.error(`❌ Schéma AJV manquant : ${schemaPath}`);
  process.exit(1);
}

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
const validate = ajv.compile(schema);

let erreurs = [];

fs.readdirSync(dossierData).forEach(fichier => {
  if (!fichier.endsWith(".json")) return;
  const chemin = path.join(dossierData, fichier);
  const contenu = JSON.parse(fs.readFileSync(chemin, "utf-8"));

  contenu.forEach((obj, index) => {
    const valide = validate(obj);
    if (!valide) {
      erreurs.push({
        fichier,
        index,
        erreurs: validate.errors
      });
    }
  });
});

if (erreurs.length > 0) {
  console.error(`❌ ${erreurs.length} erreurs dans les fichiers JSON :`);
  erreurs.forEach(err => {
    console.error(`\n📁 ${err.fichier} [entrée #${err.index}]`);
    console.error(ajv.errorsText(err.erreurs));
  });
  process.exit(1);
} else {
  console.log("✅ Tous les fichiers JSON sont valides.");
}
// 2.5 Validation de lunettes.json (l’index global)
console.log("\n📘 Étape 2.5 : Validation de lunettes.json...");

const indexPath = "lunettes.json";
const indexSchemaPath = path.join(schemaDir, "lunettes.schema.json");

if (!fs.existsSync(indexSchemaPath)) {
  console.error(`❌ Schéma manquant pour lunettes.json : ${indexSchemaPath}`);
  process.exit(1);
}

const indexSchema = JSON.parse(fs.readFileSync(indexSchemaPath, "utf-8"));
const validateIndex = ajv.compile(indexSchema);
const indexData = JSON.parse(fs.readFileSync(indexPath, "utf-8"));

const validIndex = validateIndex(indexData);

if (!validIndex) {
  console.error("❌ lunettes.json invalide :");
  console.error(ajv.errorsText(validateIndex.errors, { separator: "\n" }));
  process.exit(1);
} else {
  console.log("✅ lunettes.json est valide.");
}

// 3. Mise à jour de structure.json
console.log("\n📦 Étape 3 : Mise à jour de structure.json...");

const structurePath = "structure.json";
let structure = {};

if (fs.existsSync(structurePath)) {
  structure = JSON.parse(fs.readFileSync(structurePath, "utf-8"));
}

const indexLunettes = JSON.parse(fs.readFileSync("lunettes.json", "utf-8"));
structure.lunettes = indexLunettes;

fs.writeFileSync(structurePath, JSON.stringify(structure, null, 2), "utf-8");
console.log("✅ structure.json mis à jour.");

// 4. Validation AJV de structure.json
console.log("\n🧪 Étape 4 : Validation de structure.json...");

const structureSchemaPath = path.join(schemaDir, "structure.schema.json");

if (!fs.existsSync(structureSchemaPath)) {
  console.error(`❌ Schéma structure manquant : ${structureSchemaPath}`);
  process.exit(1);
}

const structureSchema = JSON.parse(fs.readFileSync(structureSchemaPath, "utf-8"));
const validateStructure = ajv.compile(structureSchema);
const structureData = JSON.parse(fs.readFileSync(structurePath, "utf-8"));

if (!validateStructure(structureData)) {
  console.error(`❌ structure.json invalide :`);
  console.error(ajv.errorsText(validateStructure.errors, { separator: "\n" }));
  process.exit(1);
} else {
  console.log("✅ structure.json est valide.");
}
// 4.5 Validation des schémas eux-mêmes avec meta-schema
console.log("\n🧬 Étape 4.5 : Validation des schémas avec le meta-schema...");

const metaSchemaPath = path.join(schemaDir, "meta.schema.json");

if (!fs.existsSync(metaSchemaPath)) {
  console.error("❌ meta.schema.json manquant !");
  process.exit(1);
}

const metaSchema = JSON.parse(fs.readFileSync(metaSchemaPath, "utf-8"));
const validateMeta = ajv.compile(metaSchema);

const fichiersSchemas = fs.readdirSync(schemaDir).filter(f => f.endsWith(".schema.json"));
let erreursMeta = [];

fichiersSchemas.forEach((fichier) => {
  const chemin = path.join(schemaDir, fichier);
  const contenu = JSON.parse(fs.readFileSync(chemin, "utf-8"));
  const ok = validateMeta(contenu);

  if (!ok) {
    erreursMeta.push({
      fichier,
      erreurs: validateMeta.errors
    });
  }
});

if (erreursMeta.length > 0) {
  console.error(`❌ ${erreursMeta.length} schéma(s) invalides :`);
  erreursMeta.forEach(err => {
    console.error(`\n📄 ${err.fichier}`);
    console.error(ajv.errorsText(err.erreurs, { separator: "\n" }));
  });
  process.exit(1);
} else {
  console.log("✅ Tous les schémas sont conformes au meta-schema.");
}

// 5. Validation AJV dynamique de toutes les étapes
console.log("\n📚 Étape 5 : Validation AJV des étapes...");

const etapesDir = "public";
const fichiers = fs.readdirSync(etapesDir).filter(f => f.endsWith(".json"));

let erreursEtapes = [];

fichiers.forEach(fichier => {
  const nomSansExt = fichier.replace(".json", "");
  const schemaFichier = path.join(schemaDir, `${nomSansExt}.schema.json`);
  const cheminFichier = path.join(etapesDir, fichier);

  if (!fs.existsSync(schemaFichier)) {
    console.warn(`⚠️ Aucun schéma pour ${fichier} — validation ignorée.`);
    return;
  }

  const donnees = JSON.parse(fs.readFileSync(cheminFichier, "utf-8"));
  const schemaLocal = JSON.parse(fs.readFileSync(schemaFichier, "utf-8"));
  const validateLocal = ajv.compile(schemaLocal);

  const validerBloc = Array.isArray(donnees) ? donnees : [donnees];

  validerBloc.forEach((bloc, index) => {
    const ok = validateLocal(bloc);
    if (!ok) {
      erreursEtapes.push({
        fichier,
        index,
        erreurs: validateLocal.errors
      });
    }
  });
});

if (erreursEtapes.length > 0) {
  console.error(`❌ ${erreursEtapes.length} erreurs dans les étapes :`);
  erreursEtapes.forEach(err => {
    console.error(`\n📁 ${err.fichier} [entrée #${err.index}]`);
    console.error(ajv.errorsText(err.erreurs, { separator: "\n" }));
  });
  process.exit(1);
} else {
  console.log("✅ Toutes les étapes sont valides.");
}
console.log(`\n📄 Fichiers d'étapes validés : ${fichiers.length - erreursEtapes.length}`);

// Fin
console.log("\n🎉 Build terminé avec succès !");


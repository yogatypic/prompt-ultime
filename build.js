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
execSync("node generateLunettes.js", { stdio: "inherit" });

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

// Fin
console.log("\n🎉 Build terminé avec succès !");


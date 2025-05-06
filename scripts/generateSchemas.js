const fs = require("fs");
const path = require("path");

const dossierData = "public";
const dossierSchemas = "schemas";

if (!fs.existsSync(dossierSchemas)) fs.mkdirSync(dossierSchemas);

function detecteType(val) {
  if (Array.isArray(val)) return "array";
  if (val === null) return "null";
  return typeof val;
}

// Heuristique simple pour descriptions automatiques
function getDescription(cle) {
  const descs = {
    id: "Identifiant numérique unique",
    nom: "Nom ou intitulé de l’élément",
    famille: "Catégorie ou groupe d’appartenance",
    fichier: "Chemin vers le fichier JSON lié",
    nb: "Nombre d’éléments dans ce groupe",
    citation: "Citation associée à ce concept",
    concept: "Explication ou définition du biais ou de la croyance",
    invite: "Référence symbolique ou penseur associé"
  };
  return descs[cle] || `Champ ${cle}`;
}

function estHomogene(array) {
  if (array.length === 0) return true;
  const refKeys = Object.keys(array[0]);
  return array.every(obj => JSON.stringify(Object.keys(obj).sort()) === JSON.stringify(refKeys.sort()));
}

function genereSchema(objet) {
  const props = {};
  const required = [];

  for (const cle in objet) {
    const val = objet[cle];
    const type = detecteType(val);
    const prop = { type, description: getDescription(cle) };

    if (type === "array" && val.length > 0) {
      if (estHomogene(val)) {
        prop.items = genereSchema(val[0]);
      } else {
        prop.items = { type: "object", description: "Objet hétérogène" };
      }
    }

    props[cle] = prop;
    required.push(cle);
  }

  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "object",
    properties: props,
    required,
    additionalProperties: false
  };
}

// Parcours des fichiers
fs.readdirSync(dossierData).forEach(fichier => {
  if (!fichier.endsWith(".json")) return;

  const chemin = path.join(dossierData, fichier);
  const brut = fs.readFileSync(chemin, "utf-8").replace(/^\uFEFF/, "");
  const contenu = JSON.parse(brut);

  const donnees = Array.isArray(contenu) ? contenu[0] : contenu;
  const schema = genereSchema(donnees);

  const nomFichierSchema = fichier.replace(".json", ".schema.json");
  const cheminSchema = path.join(dossierSchemas, nomFichierSchema);

  fs.writeFileSync(cheminSchema, JSON.stringify(schema, null, 2), "utf-8");
  console.log(`✅ Schéma enrichi généré : ${cheminSchema}`);
});


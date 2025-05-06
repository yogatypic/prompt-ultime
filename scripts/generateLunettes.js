#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const sourceFile = "lunettes_brutes.txt";
const outputDir = "lunettes";
const indexFile = "lunettes.json";

// Création du dossier de sortie s’il n’existe pas
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Chargement du fichier brut
if (!fs.existsSync(sourceFile)) {
  console.error(`❌ Fichier introuvable : ${sourceFile}`);
  process.exit(1);
}

const raw = fs.readFileSync(sourceFile, "utf-8");

// Extraction des objets JSON indépendants (gourmand mais efficace)
const jsonRegex = /\{[^{}]*?\}/gs;
const matches = raw.match(jsonRegex);

if (!matches || matches.length === 0) {
  console.error("❌ Aucun bloc JSON détecté.");
  process.exit(1);
}

// Organisation par familles
const familles = {};
let erreurs = 0;

matches.forEach((block, i) => {
  try {
    const obj = JSON.parse(block);
    const clef = obj.famille || "Autres";
    if (!familles[clef]) familles[clef] = [];
    familles[clef].push(obj);
  } catch (err) {
    console.warn(`⚠️ Bloc ${i + 1} ignoré (erreur JSON) :`, err.message);
    erreurs++;
  }
});

// Écriture des fichiers par famille
const refs = [];

Object.entries(familles).forEach(([famille, objets], index) => {
  const slug = famille
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // accents
    .toLowerCase().replace(/[^\w]+/g, "_")            // ponctuation
    .replace(/^_+|_+$/g, "");                         // trim

  const filename = `lunettes_${slug}_${index + 1}.json`;
  const filepath = path.join(outputDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(objets, null, 2), "utf-8");

  refs.push({
    famille,
    fichier: `${outputDir}/${filename}`,
    nb: objets.length
  });
});

// Écriture du fichier d’index
fs.writeFileSync(indexFile, JSON.stringify(refs, null, 2), "utf-8");

console.log("✅ Génération terminée !");
console.log(`📦 Fichiers créés : ${refs.length}`);
if (erreurs > 0) console.warn(`⚠️ ${erreurs} bloc(s) JSON mal formé(s) ont été ignorés.`);


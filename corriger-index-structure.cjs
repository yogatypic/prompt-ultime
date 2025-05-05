const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "public", "IA");
const fichierHTML = path.join(__dirname, "public", "index.html");
const structurePath = path.join(baseDir, "structure.json");

// 🔍 Vérifie que index.html existe
if (!fs.existsSync(fichierHTML)) {
  console.error("❌ Fichier index.html introuvable :", fichierHTML);
  process.exit(1);
}

// 🛟 Sauvegarde index.html
const contenu = fs.readFileSync(fichierHTML, "utf-8");
const backupPath = fichierHTML + ".bak";
fs.copyFileSync(fichierHTML, backupPath);
console.log("📦 Sauvegarde : index.html.bak");

// ✍️ Remplacements
let modifie = contenu;
modifie = modifie.replaceAll('fetch("structure.json")', 'fetch("IA/structure.json")');
modifie = modifie.replaceAll("fetch('structure.json')", 'fetch("IA/structure.json")');
modifie = modifie.replaceAll("fetch(etapeFile)", 'fetch("IA/" + etapeFile)');

// ✏️ Réécriture si modifié
if (modifie !== contenu) {
  fs.writeFileSync(fichierHTML, modifie, "utf-8");
  console.log("✅ Corrections appliquées à index.html");
} else {
  console.log("ℹ️ Aucune modification dans index.html");
}

// 🧪 Vérification structure.json et fichiers référencés
if (!fs.existsSync(structurePath)) {
  console.error("❌ structure.json introuvable :", structurePath);
  process.exit(1);
}

let structure;
try {
  const raw = fs.readFileSync(structurePath, "utf-8");
  structure = JSON.parse(raw);
} catch (e) {
  console.error("❌ Erreur de lecture/parsing de structure.json :", e.message);
  process.exit(1);
}

const fichiersÀVérifier = [
  ...(structure.etapes || []),
  ...Object.values(structure.ressources || {})
];

const manquants = fichiersÀVérifier.filter(f => !fs.existsSync(path.join(baseDir, f)));

if (manquants.length > 0) {
  console.warn("⚠️ Fichiers manquants dans public/IA :");
  manquants.forEach(f => console.warn(" - " + f));
} else {
  console.log("✅ Tous les fichiers référencés dans structure.json sont présents.");
}


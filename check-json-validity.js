const fs = require("fs");
const path = require("path");

const dossier = "public";

console.log("🔍 Vérification de tous les fichiers JSON dans /public...\n");

let erreurs = [];

fs.readdirSync(dossier).forEach((fichier) => {
  if (!fichier.endsWith(".json")) return;

  const chemin = path.join(dossier, fichier);
  const contenu = fs.readFileSync(chemin, "utf-8").replace(/^\uFEFF/, "");

  try {
    JSON.parse(contenu);
    console.log(`✅ ${fichier} est valide.`);
  } catch (e) {
    erreurs.push({ fichier, erreur: e.message });
  }
});

if (erreurs.length > 0) {
  console.log("\n❌ Fichiers invalides détectés :\n");
  erreurs.forEach((e) => {
    console.log(`📁 ${e.fichier} → ${e.erreur}`);
  });
  process.exit(1);
} else {
  console.log("\n🎉 Tous les fichiers JSON sont valides !");
}


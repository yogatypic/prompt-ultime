import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📁 Chemin vers le fichier structure.json dans /public
const structurePath = path.join(__dirname, 'public', 'structure.json');

if (!fs.existsSync(structurePath)) {
  console.error('❌ ERREUR : public/structure.json introuvable.');
  process.exit(1);
}

// 🔍 Fonction pour vérifier un fichier
function checkFile(relativePath) {
  const fullPath = path.join(__dirname, 'public', relativePath);
  return fs.existsSync(fullPath);
}

// 📦 Charger le contenu
const raw = fs.readFileSync(structurePath, 'utf-8');
const structure = JSON.parse(raw);

let errors = [];
let allPaths = [];

// 🧪 Étapes principales
if (Array.isArray(structure.etapes)) {
  allPaths.push(...structure.etapes);
}

// 🧪 Ressources (objet clé/valeur)
if (structure.ressources) {
  allPaths.push(...Object.values(structure.ressources));
}

// 🧪 Fichiers uniques
['meta', 'introduction_et_mission'].forEach(key => {
  if (structure[key]) allPaths.push(structure[key]);
});

// ✅ Audit
for (const file of allPaths) {
  if (!checkFile(file)) {
    errors.push(file);
    console.error(`❌ Fichier manquant : public/${file}`);
  } else {
    console.log(`✅ OK : public/${file}`);
  }
}

// 📄 Génération d’un rapport
const report = {
  timestamp: new Date().toISOString(),
  total: allPaths.length,
  ok: allPaths.length - errors.length,
  missing: errors.length,
  errors
};

fs.writeFileSync('audit_report.json', JSON.stringify(report, null, 2));
console.log(`📄 Rapport généré : audit_report.json`);

if (errors.length > 0) {
  process.exit(1); // ❌ CI échoue si des fichiers sont manquants
}


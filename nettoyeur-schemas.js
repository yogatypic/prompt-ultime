import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Gestion du chemin en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dossier des schémas
const dossierSchemas = path.join(__dirname, 'schemas');

const fichiers = fs.readdirSync(dossierSchemas).filter(f => f.endsWith('.schema.json'));

fichiers.forEach(nomFichier => {
  const chemin = path.join(dossierSchemas, nomFichier);
  const contenu = fs.readFileSync(chemin, 'utf-8');
  const json = JSON.parse(contenu);

  if ('$schema' in json) {
    delete json['$schema'];
    fs.writeFileSync(chemin, JSON.stringify(json, null, 2), 'utf-8');
    console.log(`✅ $schema supprimé de ${nomFichier}`);
  } else {
    console.log(`⏩ Aucun $schema dans ${nomFichier}`);
  }
});

console.log('\n🧹 Nettoyage terminé.');


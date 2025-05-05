const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:10000/IA/"; // ou https://prompt-ultime.onrender.com/IA/

(async () => {
  const { default: fetch } = await import('node-fetch'); // ✅ import propre
  const erreurs = [];

  async function testFichier(nom) {
    try {
      const res = await fetch(BASE_URL + nom);
      if (!res.ok) throw new Error("404");
      await res.json();
      console.log(`✅ ${nom}`);
    } catch (e) {
      console.log(`❌ ${nom} : ${e.message}`);
      erreurs.push(nom);
    }
  }

  try {
    const structureRes = await fetch(BASE_URL + "structure.json");
    const structure = await structureRes.json();

    console.log("🔍 Vérification des étapes...");
    for (const etape of structure.etapes || []) {
      await testFichier(etape);
    }

    console.log("\n🔍 Vérification des ressources...");
    for (const nom in structure.ressources || {}) {
      await testFichier(structure.ressources[nom]);
    }

    console.log("\n📦 Résumé :");
    if (erreurs.length === 0) {
      console.log("✅ Tous les fichiers sont accessibles.");
    } else {
      console.warn(`⚠️ Erreurs sur :\n- ` + erreurs.join("\n- "));
    }
  } catch (err) {
    console.error("❌ Impossible de charger structure.json :", err.message);
  }
})();


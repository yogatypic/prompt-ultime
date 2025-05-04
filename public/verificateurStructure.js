async function verifierStructure(baseUrl = "./") {
  const structureUrl = baseUrl + "structure.json";
  
  try {
    const structure = await fetch(structureUrl).then(r => r.json());
    console.log("✅ structure.json chargé avec succès");

    const fichiers = [
      structure.meta,
      structure.introduction_et_mission,
      ...structure.etapes,
      ...Object.values(structure.ressources)
    ];

    for (const fichier of fichiers) {
      const url = baseUrl + fichier;
      try {
        const contenu = await fetch(url).then(r => r.json());
        console.log(`✅ ${fichier} chargé (${Object.keys(contenu).length} clés)`);
      } catch (e) {
        console.error(`❌ ERREUR: fichier manquant ou invalide : ${fichier}`);
      }
    }

    console.log("🎯 Vérification terminée.");
  } catch (e) {
    console.error("❌ structure.json introuvable ou corrompu.");
  }
}

// Appel automatique (modulable selon le contexte web)
verifierStructure("https://www.yogatypic.fr/IA/");


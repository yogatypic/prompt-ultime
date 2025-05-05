
#!/bin/bash

# Correction des noms de fichiers mal référencés dans structure.json
sed -i 's/\.json\.json/\.json/g' public/IA/structure.json

# Correction du schéma pour etape_5_resonance_finale.json (ajout du champ "champs" requis)
cat > public/IA/etape_5_resonance_finale.json <<EOF
{
  "titre_section": "Étape 5 — Résonance finale",
  "sous_titre": "Ce que tu emportes avec toi",
  "description": "Cette dernière étape t’invite à résumer ce que tu retiens, ressens ou décides après cette exploration. C’est un moment d’atterrissage et de mise en mots personnels.",
  "consigne_principale": "Exprime librement ce que tu retiens de l’expérience. Ce que tu veux garder. Ce qui a changé. Ce qui te dérange ou t’éclaire.",
  "champs": [
    {
      "champ": "💬 Mot-clé final",
      "aide": "Un mot ou une image qui résume ton ressenti (ex : vertige, lucidité, masque tombé, puzzle, etc.)"
    },
    {
      "champ": "🧭 Ce que je retiens",
      "aide": "Un apprentissage, une prise de conscience, une surprise marquante."
    },
    {
      "champ": "🧳 Ce que j’emporte",
      "aide": "Une idée, une émotion ou une envie que tu veux garder avec toi."
    }
  ],
  "note_pedagogique": "Cette étape sert à intégrer subjectivement l’expérience. Elle ne vise pas une conclusion, mais une trace personnelle."
}
EOF

# Ajout d’un champ fictif "masques" dans compagnons_symboliques.json si manquant
jq '.masques = .masques // []' public/IA/compagnons_symboliques.json > tmp.$$.json && mv tmp.$$.json public/IA/compagnons_symboliques.json

# Ajout d’un champ "nom" manquant dans axes_autistiques.json si absent
jq '.axes = (.axes // []) | map(.nom = (.nom // "Nom à compléter"))' public/IA/axes_autistiques.json > tmp.$$.json && mv tmp.$$.json public/IA/axes_autistiques.json

# Correction du type attendu pour lunettes_subjectives.json
jq '.familles = (.familles // []) | .structure_lunette = (.structure_lunette // [])' public/IA/lunettes_subjectives.json > tmp.$$.json && mv tmp.$$.json public/IA/lunettes_subjectives.json

echo "✅ Script terminé. Relancez 'npm run verifier' pour valider les corrections."

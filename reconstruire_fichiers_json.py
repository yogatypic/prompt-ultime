import json
import os

# Utilise utf-8-sig pour éviter l'erreur BOM
with open('IA1.json', 'r', encoding='utf-8-sig') as f:
    try:
        data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ Erreur JSON : {e}")
        exit(1)

# Répertoire de sortie (optionnel : 'json')
output_dir = "json"
os.makedirs(output_dir, exist_ok=True)

# Liste des fichiers simples à extraire
fichiers_cibles = [
    "meta", "introduction_et_mission", "choix_initial",
    "etape_1_observation", "etape_2_lunettes", "etape_3_lecture_croisee",
    "etape_4_metadiscernement", "etape_5_resonance_finale",
    "compagnons_symboliques", "axes_autistiques", "lunettes_subjectives"
]

for cle in fichiers_cibles:
    if cle in data:
        chemin = os.path.join(output_dir, f"{cle}.json")
        with open(chemin, "w", encoding="utf-8") as f_out:
            json.dump({cle: data[cle]}, f_out, ensure_ascii=False, indent=2)
        print(f"✅ {cle}.json créé.")
    else:
        print(f"⚠️ Clé manquante : {cle}")

print("\n🎉 Tous les fichiers ont été extraits avec succès.")


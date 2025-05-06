import json
import os

# Charger le fichier IA1.json avec gestion du BOM UTF-8
with open("IA1.json", "r", encoding="utf-8-sig") as f:
    data = json.load(f)

# Créer un dossier de sortie
os.makedirs("sortie_json", exist_ok=True)

# Extraction des étapes
etapes = data.get("etapes", {})
for index, (cle, contenu) in enumerate(etapes.items()):
    nom_fichier = f"etape_{index}_{cle}.json"
    with open(f"sortie_json/{nom_fichier}", "w", encoding="utf-8") as f:
        json.dump(contenu, f, indent=2, ensure_ascii=False)
    print(f"✅ Écrit : {nom_fichier}")

# Extraction des ressources
ressources = {
    "meta.json": data.get("meta"),
    "introduction_et_mission.json": data.get("introduction_et_mission"),
    "compagnons_symboliques.json": data.get("compagnons_symboliques"),
    "axes_autistiques.json": data.get("axes_autistiques"),
    "lunettes_subjectives.json": data.get("lunettes_subjectives"),
    "masques_symboliques.json": data.get("masques_symboliques"),
}

for nom_fichier, contenu in ressources.items():
    if contenu:
        with open(f"sortie_json/{nom_fichier}", "w", encoding="utf-8") as f:
            json.dump(contenu, f, indent=2, ensure_ascii=False)
        print(f"✅ Écrit : {nom_fichier}")
    else:
        print(f"⚠️ Données absentes : {nom_fichier}")

# Génération de structure.json
structure = {
    "meta": "meta.json",
    "introduction_et_mission": "introduction_et_mission.json",
    "etapes": [f"etape_{i}_{cle}.json" for i, cle in enumerate(etapes.keys())],
    "ressources": {
        "compagnons_symboliques": "compagnons_symboliques.json",
        "axes_autistiques": "axes_autistiques.json",
        "lunettes_subjectives": "lunettes_subjectives.json",
        "masques_symboliques": "masques_symboliques.json"
    }
}

with open("sortie_json/structure.json", "w", encoding="utf-8") as f:
    json.dump(structure, f, indent=2, ensure_ascii=False)
print("✅ Écrit : structure.json")

print("\n🎉 Tous les fichiers ont été extraits dans ./sortie_json/")


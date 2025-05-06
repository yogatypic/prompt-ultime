import json
import re
import os

def nettoyer_json_robuste(texte):
    # Supprimer commentaires
    texte = re.sub(r"//.*?$|/\*.*?\*/", "", texte, flags=re.MULTILINE | re.DOTALL)

    # Supprimer virgules terminales
    texte = re.sub(r",\s*([}\]])", r"\1", texte)

    # Supprimer tous les caractères de contrôle illégaux sauf \n \t
    texte = ''.join(c for c in texte if c == '\n' or c == '\t' or ord(c) >= 32)

    return texte

# Lecture et nettoyage
with open("IA1.json", "r", encoding="utf-8-sig") as f:
    brut = f.read()

nettoye = nettoyer_json_robuste(brut)

# Tentative de parsing
try:
    data = json.loads(nettoye)
    print("✅ JSON réparé avec succès.")
except json.JSONDecodeError as e:
    print("❌ JSON toujours invalide :", e)
    exit(1)

# Extraction si valide
os.makedirs("sortie_json", exist_ok=True)
etapes = data.get("etapes", {})
fichiers_etapes = []

for i, (nom, contenu) in enumerate(etapes.items()):
    nom_fichier = f"etape_{i}_{nom}.json"
    with open(f"sortie_json/{nom_fichier}", "w", encoding="utf-8") as f:
        json.dump(contenu, f, indent=2, ensure_ascii=False)
    fichiers_etapes.append(nom_fichier)
    print(f"✅ {nom_fichier}")

# Ressources
ressources = {
    "meta.json": data.get("meta"),
    "introduction_et_mission.json": data.get("introduction_et_mission"),
    "compagnons_symboliques.json": data.get("compagnons_symboliques"),
    "axes_autistiques.json": data.get("axes_autistiques"),
    "lunettes_subjectives.json": data.get("lunettes_subjectives"),
    "masques_symboliques.json": data.get("masques_symboliques")
}

for nom_fichier, contenu in ressources.items():
    if contenu:
        with open(f"sortie_json/{nom_fichier}", "w", encoding="utf-8") as f:
            json.dump(contenu, f, indent=2, ensure_ascii=False)
        print(f"✅ {nom_fichier}")
    else:
        print(f"⚠️ Absent : {nom_fichier}")

# Générer structure.json
structure = {
    "meta": "meta.json",
    "introduction_et_mission": "introduction_et_mission.json",
    "etapes": fichiers_etapes,
    "ressources": {
        "compagnons_symboliques": "compagnons_symboliques.json",
        "axes_autistiques": "axes_autistiques.json",
        "lunettes_subjectives": "lunettes_subjectives.json",
        "masques_symboliques": "masques_symboliques.json"
    }
}

with open("sortie_json/structure.json", "w", encoding="utf-8") as f:
    json.dump(structure, f, indent=2, ensure_ascii=False)

print("\n🎉 Tout est extrait dans ./sortie_json/")


import os
import re
import json

# Étape 1 : Lecture brute + réparation JSON
print("🔧 Lecture et nettoyage de IA1.json...")

with open("IA1.json", "r", encoding="utf-8-sig") as f:
    raw = f.read()

# Supprimer les commentaires (// et /* */)
raw = re.sub(r"//.*?$|/\*.*?\*/", "", raw, flags=re.MULTILINE | re.DOTALL)

# Supprimer les virgules terminales avant } ou ]
raw = re.sub(r",\s*([}\]])", r"\1", raw)

# Nettoyer les caractères de contrôle dans les chaînes JSON
def nettoyer_chaine(match):
    texte = match.group(0)
    return re.sub(r"[\x00-\x1F]", "", texte)

raw = re.sub(r'"(.*?)"', nettoyer_chaine, raw)

# Parse JSON
try:
    data = json.loads(raw)
    print("✅ JSON corrigé chargé avec succès.")
except json.JSONDecodeError as e:
    print("❌ Erreur de décodage persistante :")
    print(e)
    exit(1)

# Étape 2 : Extraction des fichiers
os.makedirs("sortie_json", exist_ok=True)

print("📦 Extraction des étapes...")
etapes = data.get("etapes", {})
etape_fichiers = []

for index, (cle, contenu) in enumerate(etapes.items()):
    nom_fichier = f"etape_{index}_{cle}.json"
    path = os.path.join("sortie_json", nom_fichier)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(contenu, f, indent=2, ensure_ascii=False)
    print(f"✅ {nom_fichier}")
    etape_fichiers.append(nom_fichier)

print("📚 Extraction des ressources...")
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
        print(f"✅ {nom_fichier}")
    else:
        print(f"⚠️ Données absentes : {nom_fichier}")

# Étape 3 : Génération du fichier structure.json
structure = {
    "meta": "meta.json",
    "introduction_et_mission": "introduction_et_mission.json",
    "etapes": etape_fichiers,
    "ressources": {
        "compagnons_symboliques": "compagnons_symboliques.json",
        "axes_autistiques": "axes_autistiques.json",
        "lunettes_subjectives": "lunettes_subjectives.json",
        "masques_symboliques": "masques_symboliques.json"
    }
}

with open("sortie_json/structure.json", "w", encoding="utf-8") as f:
    json.dump(structure, f, indent=2, ensure_ascii=False)
print("✅ structure.json généré")

print("\n🎉 Tous les fichiers extraits avec succès dans ./sortie_json/")


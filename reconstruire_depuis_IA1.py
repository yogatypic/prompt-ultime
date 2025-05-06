import json
import os

FICHIER_SOURCE = "IA1.json"
DOSSIER_SORTIE = "."

def nettoyer_bom(path):
    with open(path, "rb") as f:
        raw = f.read()
    if raw.startswith(b'\xef\xbb\xbf'):
        print("🧹 BOM détecté, nettoyage...")
        raw = raw[3:]
    return raw.decode("utf-8")

def sauvegarder_json(nom_fichier, contenu):
    chemin = os.path.join(DOSSIER_SORTIE, nom_fichier)
    with open(chemin, "w", encoding="utf-8") as f:
        json.dump(contenu, f, ensure_ascii=False, indent=2)
    print(f"✅ Fichier créé : {nom_fichier}")

def main():
    print("📥 Lecture de IA1.json...")
    brut = nettoyer_bom(FICHIER_SOURCE)
    try:
        data = json.loads(brut)
    except json.JSONDecodeError as e:
        print("❌ JSON invalide :", e)
        return

    # Dictionnaires principaux à extraire
    mapping = {
        "meta": "meta.json",
        "introduction_et_mission": "introduction_et_mission.json",
        "etape_1_observation": "etape_1_observation.json",
        "etape_2_lunettes": "etape_2_lunettes.json",
        "etape_3_lecture_croisee": "etape_3_lecture_croisee.json",
        "etape_4_metadiscernement": "etape_4_metadiscernement.json",
        "etape_5_resonance_finale": "etape_5_resonance_finale.json",
        "compagnons_symboliques": "compagnons_symboliques.json",
        "axes_autistiques": "axes_autistiques.json",
        "lunettes_subjectives": "lunettes_subjectives.json"
    }

    for cle, nom_fichier in mapping.items():
        if cle in data:
            sauvegarder_json(nom_fichier, data[cle])
        else:
            print(f"⚠️ Clé absente dans IA1.json : {cle}")

if __name__ == "__main__":
    main()


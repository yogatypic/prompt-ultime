import json
import os
import requests

# === 1. Définir les chemins ===
DOSSIER_LOCAL = "./public"
FICHIERS = ["structure.json", "meta.json"]  # à compléter selon ton usage

# === 2. Fonction pour charger un fichier local ===
def charger_fichier_local(nom_fichier):
    chemin = os.path.join(DOSSIER_LOCAL, nom_fichier)
    try:
        with open(chemin, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Erreur lecture fichier local {nom_fichier} : {e}")
        return None
# === 3. Fonction pour charger un fichier depuis Render ===
URL_RENDER_BASE = "https://prompt-ultime.onrender.com/public"

def charger_fichier_render(nom_fichier):
    url = f"{URL_RENDER_BASE}/{nom_fichier}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"❌ Erreur lecture fichier Render {nom_fichier} : {e}")
        return None
# === 4. Fonction pour charger un fichier JSON depuis GitHub ===
URL_GITHUB_BASE = "https://raw.githubusercontent.com/yogatypic/prompt-ultime/main/public"

def charger_fichier_github(nom_fichier):
    url = f"{URL_GITHUB_BASE}/{nom_fichier}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"❌ Erreur lecture fichier GitHub {nom_fichier} : {e}")
        return None
# === 5. Sélection du fichier JSON le plus pertinent ===
def choisir_version_pertinente(nom_fichier):
    versions = {
        "local": charger_fichier_local(nom_fichier),
        "render": charger_fichier_render(nom_fichier),
        "github": charger_fichier_github(nom_fichier)
    }

    # Filtrer les versions non nulles et valides (dictionnaire non vide)
    valides = {k: v for k, v in versions.items() if isinstance(v, dict) and v}

    if not valides:
        print(f"⚠️ Aucun fichier valide trouvé pour {nom_fichier}")
        return None

    # Choisir la version la plus complète (en nombre de clés par exemple)
    meilleure_version = max(valides.items(), key=lambda item: len(item[1].keys()))
    print(f"✅ Fichier sélectionné : {nom_fichier} ← {meilleure_version[0]} ({len(meilleure_version[1])} clés)")
    return meilleure_version[1]
def traitement_complet():
    fichiers = charger_structure()
    if not fichiers:
        print("⛔ structure.json introuvable ou vide.")
        return

    for nom in fichiers:
        print(f"\n📂 Traitement de {nom}")
        data = choisir_version_pertinente(nom)
        if data:
            enregistrer_version_local(nom, data)
import os
from datetime import datetime

def enregistrer_version_local(nom_fichier, contenu):
    now = datetime.now().strftime("%Y%m%d-%H%M%S")
    dossier = "restaurations"
    os.makedirs(dossier, exist_ok=True)

    # Sauvegarde avec horodatage
    chemin_sauvegarde = os.path.join(dossier, f"{now}--{nom_fichier}")
    with open(chemin_sauvegarde, "w", encoding="utf-8") as f:
        json.dump(contenu, f, ensure_ascii=False, indent=2)
    
    print(f"💾 Sauvegarde créée : {chemin_sauvegarde}")


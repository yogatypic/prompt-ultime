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


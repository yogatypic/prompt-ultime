import re

# Lecture brute en mode texte pour corriger les erreurs JSON simples
with open("IA1.json", "r", encoding="utf-8-sig") as f:
    contenu = f.read()

# Supprimer les commentaires (non valides en JSON)
contenu = re.sub(r"//.*?$|/\*.*?\*/", "", contenu, flags=re.MULTILINE | re.DOTALL)

# Supprimer les virgules terminales (derrière le dernier champ d’un objet ou tableau)
contenu = re.sub(r",\s*([}\]])", r"\1", contenu)

# Supprimer les éventuelles lignes vides
contenu = "\n".join([l for l in contenu.splitlines() if l.strip() != ""])

# Vérification de validité et réécriture
import json

try:
    data = json.loads(contenu)
    with open("IA1_repare.json", "w", encoding="utf-8") as out:
        json.dump(data, out, indent=2, ensure_ascii=False)
    print("✅ IA1.json corrigé et exporté dans IA1_repare.json")
except json.JSONDecodeError as e:
    print("❌ Erreur de décodage JSON malgré les corrections :")
    print(e)


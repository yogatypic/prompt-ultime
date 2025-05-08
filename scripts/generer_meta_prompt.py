import json
import re
from docx import Document
from pathlib import Path
from datetime import datetime
import sys

def extraire_chapitres(docx_path):
    try:
        doc = Document(docx_path)
    except Exception as e:
        print(f"❌ Erreur d’ouverture du fichier : {e}")
        return []

    texte = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
    pattern = r"(CHAPITRE\s+\d+\s+—[^\n]+)\n((?:(?!CHAPITRE\s+\d+\s+—).|\n)+)"
    matches = re.findall(pattern, texte)

    chapitres = []
    for titre, contenu in matches:
        chapitres.append({
            "titre": titre.strip(),
            "contenu": contenu.strip()
        })

    if not chapitres:
        print("⚠️ Aucun chapitre détecté. Vérifiez le format du document.")
    return chapitres

def generer_meta_prompt(docx_path, output_path="public/meta-prompt.json", archive_dir="public/journal_ia"):
    docx_file = Path(docx_path)
    if not docx_file.exists():
        print(f"❌ Fichier introuvable : {docx_file}")
        return

    chapitres = extraire_chapitres(docx_file)
    if not chapitres:
        print("❌ Aucune donnée extraite.")
        return

    meta = {
        "titre": "Prompt-Ultime V2 - Meta Prompt",
        "version": "V3.08.05.25",
        "chapitres": chapitres
    }

    # Création des répertoires
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    Path(archive_dir).mkdir(parents=True, exist_ok=True)

    # Sauvegarde du fichier principal
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2, ensure_ascii=False)

    # Archivage horodaté
    horodatage = datetime.now().strftime("%Y%m%d-%H%M%S")
    archive_path = Path(archive_dir) / f"meta-prompt_{horodatage}.json"
    with open(archive_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2, ensure_ascii=False)

    print(f"✅ meta-prompt.json généré avec {len(chapitres)} chapitres")
    print(f"🗂️ Archive sauvegardée : {archive_path}")

    # Optionnel : validation JSON avec AJV ici
    # subprocess.run(["node", "validateMeta.js", str(output_path)])

# Point d’entrée
if __name__ == "__main__":
    chemin_docx = sys.argv[1] if len(sys.argv) > 1 else "PromptV3.08.05.25.docx"
    generer_meta_prompt(chemin_docx)


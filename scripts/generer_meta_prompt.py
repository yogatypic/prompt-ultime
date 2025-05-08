import json
import re
from docx import Document
from pathlib import Path

def extraire_chapitres(docx_path):
    doc = Document(docx_path)
    texte = "\n".join([p.text for p in doc.paragraphs if p.text.strip() != ""])

    # Regex : capture les titres de chapitres (CHAPITRE X — Titre)
    pattern = r"(CHAPITRE\s+\d+\s+—[^\n]+)\n((?:(?!CHAPITRE\s+\d+\s+—).|\n)+)"
    matches = re.findall(pattern, texte)

    chapitres = []
    for titre, contenu in matches:
        chapitres.append({
            "titre": titre.strip(),
            "contenu": contenu.strip()
        })

    return chapitres

def generer_meta_prompt(docx_path, output_path="public/meta-prompt.json"):
    chapitres = extraire_chapitres(docx_path)
    meta = {
        "titre": "Prompt-Ultime V2 - Meta Prompt",
        "version": "V3.08.05.25",
        "chapitres": chapitres
    }
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2, ensure_ascii=False)
    print(f"✅ Fichier généré : {output_path}")

# Exécution directe
if __name__ == "__main__":
    chemin_docx = "PromptV3.08.05.25.docx"  # à adapter selon emplacement
    generer_meta_prompt(chemin_docx)


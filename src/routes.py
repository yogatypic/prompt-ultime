from fastapi import APIRouter
from pathlib import Path
import subprocess
import sys

router = APIRouter()

@router.post("/api/generer-meta-prompt")
def generer_meta_prompt():
    chemin_script = Path("scripts/generer_meta_prompt.py")
    
    if not chemin_script.exists():
        return {"status": "erreur", "message": "Script introuvable"}

    try:
        result = subprocess.run(
            [sys.executable, str(chemin_script)],
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            return {
                "status": "ok",
                "message": "meta-prompt.json généré avec succès",
                "stdout": result.stdout.strip()
            }
        else:
            return {
                "status": "erreur",
                "message": "Erreur d’exécution",
                "stderr": result.stderr.strip()
            }

    except Exception as e:
        return {
            "status": "erreur",
            "message": f"Exception système : {str(e)}"
        }


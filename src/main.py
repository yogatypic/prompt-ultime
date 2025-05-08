from fastapi import FastAPI
from fastapi.responses import JSONResponse
import os
import json

from .db import init_db
from .routes import router

app = FastAPI(title="Prompt-Ultime API")

@app.on_event("startup")
def on_startup() -> None:
    init_db()
    print("DB initialisée")

app.include_router(router)

# ✅ Nouvelle route : API pour charger le méta-prompt
@app.get("/api/meta-prompt")
async def get_meta_prompt():
    try:
        meta_prompt_path = os.path.join("public", "meta-prompt.json")
        with open(meta_prompt_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return JSONResponse(content=data)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


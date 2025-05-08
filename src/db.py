import os
from sqlmodel import SQLModel, create_engine

# URL lue dans l’environnement (Internal URL Render en prod)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://base1_7xzt_user:motdepasse@dpg-d0e9dgh5pdvs73at2t3g-a.oregon-postgres.render.com:5432/base1_7xzt?sslmode=require"
)

# Engine global réutilisé partout
engine = create_engine(DATABASE_URL, echo=False)

def init_db() -> None:
    """Crée toutes les tables déclarées dans SQLModel.metadata."""
    SQLModel.metadata.create_all(engine)


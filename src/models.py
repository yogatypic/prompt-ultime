# src/models.py

from datetime import datetime
from typing import Optional, Dict, Any

from sqlmodel import SQLModel, Field
from sqlalchemy import Column, JSON

class Joueur(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    pseudo: str = Field(index=True, unique=True)
    date_inscription: datetime = Field(default_factory=datetime.utcnow)

class Progression(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    joueur_id: int = Field(foreign_key="joueur.id")
    etape: str
    # ↘️ ici on utilise Column(JSON) pour que SQLAlchemy sache gérer le JSONB
    payload: Dict[str, Any] = Field(sa_column=Column(JSON))
    horodatage: datetime = Field(default_factory=datetime.utcnow)


# alembic/env.py

from logging.config import fileConfig
from alembic import context

# Importez l’engine SQLModel défini dans src/db.py
from src.db import engine

# Importez SQLModel et vos modèles pour autogénération
from sqlmodel import SQLModel
from src.models import Joueur, Progression

# MetaData à utiliser pour --autogenerate
target_metadata = SQLModel.metadata

# Configuration du logger via alembic.ini
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode (generate SQL script)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode (apply to the database)."""
    # Utilise directement l’engine défini dans src/db.py
    with engine.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()


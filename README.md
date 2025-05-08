Réflexion durant quelques secondes


````markdown
# 🎭 Prompt-Ultime — Interface Admin & API

[![CI](https://github.com/yogatypic/prompt-ultime/actions/workflows/ci.yml/badge.svg)](https://github.com/yogatypic/prompt-ultime/actions)

Interface d’administration et API pour piloter, valider, corriger et faire évoluer le projet Prompt-Ultime.  
Utilise Express.js, JSON, AJV, FastAPI, SQLModel, Alembic et React.

---

## 📁 Architecture

- `public/` : interface joueur + interface admin (frontend React statique)  
- `src/` : code Python FastAPI + SQLModel + Alembic (API)  
- `schemas/` : schémas JSON AJV pour les étapes narratives  
- `server.js` : serveur Node.js (Express.js) pour l’admin  
- `scripts/` : scripts utilitaires (extraction, audit, versioning)  
- `alembic/` : configuration et versions de migrations  
- `tests/` : tests Pytest pour l’API  

---

## 🚀 Fonctions principales

- 🎲 Jeu narratif modulable (7 étapes) via API FastAPI  
- 🔄 Migrations automatiques avec Alembic  
- ✅ Validation JSON via AJV (`audit_structure.js`)  
- 🧪 Tests automatisés (Pytest) et lint (Black, Flake8)  
- 🔗 Front React isolé, configurable via `VITE_API_URL`  

---

## ⚙️ Installation & Lancement

### 1. Back-end (API Python)

```bash
# Clone et positionne-toi
git clone https://github.com/yogatypic/prompt-ultime.git
cd prompt-ultime

# Crée et active un virtualenv
python3 -m venv .venv
source .venv/bin/activate

# Installe les dépendances
pip install fastapi uvicorn[standard] sqlmodel alembic psycopg2-binary

# Configure la variable d’environnement (ajoute ?sslmode=require si nécessaire)
export DATABASE_URL="postgresql://<USER>:<PWD>@<HOST>:5432/<DB>?sslmode=require"

# Applique les migrations et démarre l’API
alembic upgrade head
uvicorn src.main:app --reload
````

### 2. Front-end (Admin & Joueur)

```bash
cd public
npm install
npm run build      # génère le dossier `build/`
# ou pour le mode développement :
npm run start
```

### 3. Audit JSON & Tests

```bash
# Audit JSON (AJV)
npm run audit-json  # wrapper pour `node audit_structure.js`

# Tests Python
pytest

# Lint Python
black --check src
flake8 src
```

---

## 📘 Documentation

* **API Swagger/OpenAPI** : `http://localhost:8000/docs`
* **Admin UI** : `http://localhost:3000/admin` (ou URL configurée avec VITE\_API\_URL)

---

## 🔄 CI / CD

Le workflow GitHub Actions exécute :

1. 🛠 Migrations Alembic
2. 🧪 Tests Pytest
3. 🔍 Lint (Black + Flake8)
4. 🧪 Audit JSON (`audit_structure.js`)

Le déploiement sur Render est piloté par `render.yaml`, avec :

* Front statique (React)
* API Python (FastAPI + Alembic migrations)
* Injection de `DATABASE_URL` depuis la Base Postgres interne

---

*Ce README.md doit être placé à la racine du projet.*

```
```


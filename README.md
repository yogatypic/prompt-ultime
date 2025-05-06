# 🎭 Prompt Ultime — Interface Admin

Interface d’administration pour piloter, valider, corriger et faire évoluer le projet Prompt Ultime.  
Utilise Express.js, JSON, AJV, API et bientôt OpenAI.

## 📁 Architecture

- `public/` : interface joueur + interface admin
- `schemas/` : schémas JSON AJV
- `server.js` : serveur Node.js (ESM)
- `scripts/` : scripts Python, extraction, réparation, versioning

## 🚀 Fonctions principales

- Scan et validation automatique des fichiers JSON
- Édition et sauvegarde intelligente
- Synchronisation avec API (à venir)
- Pilotage IA (en cours)
- Interface dédiée : [https://prompt-ultime.onrender.com/admin](https://prompt-ultime.onrender.com/admin)

## ✅ Lancer en local

```bash
npm install
node server.js


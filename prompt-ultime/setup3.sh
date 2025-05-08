#!/usr/bin/env bash
set -e

# Ce script applique les corrections React Router v6 et React 18
# Il doit être exécuté depuis le répertoire racine du front (là où se trouve src/)

# Détection du répertoire front
if [ -d "./src" ]; then
  FRONT_DIR="."
elif [ -d "prompt-ultime/src" ]; then
  FRONT_DIR="prompt-ultime"
else
  echo "Erreur : répertoire front introuvable (src/). Exécutez ce script depuis la racine du projet front."
  exit 1
fi

echo "🏗️ Mise à jour dans $FRONT_DIR/src/..."

# 1) src/index.tsx (React 18)
cat > "$FRONT_DIR/src/index.tsx" << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
EOF

echo "✔️ index.tsx mis à jour"

# 2) src/App.tsx (Routes v6)
cat > "$FRONT_DIR/src/App.tsx" << 'EOF'
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/MatrixTranslator';
import Game from './components/Game';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:sessionId" element={<Game />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
EOF

echo "✔️ App.tsx mis à jour"

# 3) src/components/MatrixTranslator.tsx (useNavigate)
cat > "$FRONT_DIR/src/components/MatrixTranslator.tsx" << 'EOF'
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStep1, createSession } from '../api/api';

export default function Home() {
  const [introText, setIntroText] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStep1()
      .then(setIntroText)
      .catch(() => setIntroText('<p>Erreur de chargement.</p>'));
  }, []);

  const startGame = async (mode: 'immersive' | 'simple') => {
    const session = await createSession(mode === 'immersive' ? 'Atypique' : 'NT');
    if (session.sessionId) {
      navigate(`/game/${session.sessionId}`);
    }
  };

  if (!introText) return <div>Chargement du jeu…</div>;

  return (
    <div className="home-container">
      <div className="home-intro" dangerouslySetInnerHTML={{ __html: introText }} />
      <div className="buttons">
        <button onClick={() => startGame('immersive')}>Pilule rouge (immersif)</button>
        <button onClick={() => startGame('simple')}>Pilule bleue (simple)</button>
      </div>
    </div>
  );
}
EOF

echo "✔️ MatrixTranslator.tsx mis à jour"

# 4) src/api/api.ts (backticks ASCII)
API_FILE="$FRONT_DIR/src/api/api.ts"
if [ ! -d "$(dirname $API_FILE)" ]; then
  echo "Répertoire $(dirname $API_FILE) introuvable, création..."
  mkdir -p "$(dirname $API_FILE)"
fi
cat > "$API_FILE" << 'EOF'
export async function fetchStep1(): Promise<string> {
  const res = await fetch('/prompts/step1');
  const { prompt } = await res.json();
  return prompt;
}

export async function createSession(role: 'NT' | 'Atypique') {
  const res = await fetch('/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
  return res.json();
}

export async function getCurrentStep(sessionId: string) {
  const res = await fetch(`/sessions/${sessionId}/current-step`);
  return res.json();
}

export async function postAnswer(sessionId: string, choiceId: string) {
  const res = await fetch(`/sessions/${sessionId}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ choiceId }),
  });
  return res.json();
}
EOF

echo "✔️ api.ts mis à jour"

# 5) src/components/Game.tsx (sécuriser sessionId)
cat > "$FRONT_DIR/src/components/Game.tsx" << 'EOF'
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCurrentStep, postAnswer } from '../api/api';
import StepView from './StepView';

export default function Game() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [step, setStep] = useState<{ prompt: string; choices: { id: string; label: string }[] }>();

  useEffect(() => {
    if (sessionId) getCurrentStep(sessionId).then(setStep);
  }, [sessionId]);

  const handleAnswer = async (choiceId: string) => {
    if (sessionId) {
      const next = await postAnswer(sessionId, choiceId);
      setStep(next);
    }
  };

  if (!step) return <p>Chargement de l’étape…</p>;
  return <StepView promptHtml={step.prompt} choices={step.choices} onAnswer={handleAnswer} />;
}
EOF

echo "✔️ Game.tsx mis à jour"

echo "🎉 setup3 terminé !"


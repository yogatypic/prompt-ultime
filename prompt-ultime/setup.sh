#!/usr/bin/env bash
set -e

#####################################
# 1. Scaffolding du front React TS  #
#####################################
echo "🚀 Création du front React TypeScript…"
npx create-react-app prompt-ultime --template typescript
cd prompt-ultime

echo "🔧 Installation de react-router-dom…"
npm install react-router-dom

# 1.1 Nettoyage de public/index.html
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Prototype Prompt Ultime</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
  <div id="root"></div>
  <script src="/static/js/bundle.js"></script>
</body>
</html>
EOF

#####################################
# 2. Création du point d'entrée      #
#####################################
# 2.1 src/index.tsx
cat > src/index.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
EOF

# 2.2 src/App.tsx
cat > src/App.tsx << 'EOF'
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './components/MatrixTranslator';
import Game from './components/Game';

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/game/:sessionId" component={Game} />
      <Redirect to="/" />
    </Switch>
  );
}
EOF

#####################################
# 3. Composants React               #
#####################################
mkdir -p src/components

# 3.1 src/components/MatrixTranslator.tsx
cat > src/components/MatrixTranslator.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { fetchStep1, createSession } from '../api/api';

export default function Home() {
  const [introText, setIntroText] = useState<string>('');
  const history = useHistory();

  useEffect(() => {
    fetchStep1().then(setIntroText).catch(() => setIntroText('<p>Erreur de chargement.</p>'));
  }, []);

  const startGame = async (mode: 'immersive' | 'simple') => {
    const session = await createSession(mode === 'immersive' ? 'Atypique' : 'NT');
    history.push(\`/game/\${session.sessionId}\`);
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

# 3.2 src/components/Game.tsx
cat > src/components/Game.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCurrentStep, postAnswer } from '../api/api';
import StepView from './StepView';

export default function Game() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [step, setStep] = useState<{ prompt: string; choices: { id: string; label: string }[] }>();

  useEffect(() => {
    getCurrentStep(sessionId).then(setStep);
  }, [sessionId]);

  const handleAnswer = async (choiceId: string) => {
    const next = await postAnswer(sessionId, choiceId);
    setStep(next);
  };

  if (!step) return <p>Chargement de l’étape…</p>;
  return (
    <StepView promptHtml={step.prompt} choices={step.choices} onAnswer={handleAnswer} />
  );
}
EOF

# 3.3 src/components/StepView.tsx
cat > src/components/StepView.tsx << 'EOF'
import React from 'react';

interface Choice { id: string; label: string }
interface Props {
  promptHtml: string;
  choices: Choice[];
  onAnswer: (id: string) => void;
}

export default function StepView({ promptHtml, choices, onAnswer }: Props) {
  return (
    <div className="step-view">
      <div dangerouslySetInnerHTML={{ __html: promptHtml }} />
      <div className="choices">
        {choices.map(c => (
          <button key={c.id} onClick={() => onAnswer(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
EOF

#####################################
# 4. Helper API client              #
#####################################
mkdir -p src/api
cat > src/api/api.ts << 'EOF'
export async function fetchStep1(): Promise<string> {
  const res = await fetch('/prompts/step1');
  const { prompt } = await res.json();
  return prompt;
}

export async function createSession(role: 'NT' | 'Atypique') {
  const res = await fetch('/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role })
  });
  return res.json();
}

export async function getCurrentStep(sessionId: string) {
  const res = await fetch(\`/sessions/\${sessionId}/current-step\`);
  return res.json();
}

export async function postAnswer(sessionId: string, choiceId: string) {
  const res = await fetch(\`/sessions/\${sessionId}/answer\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ choiceId })
  });
  return res.json();
}
EOF

echo "✅ Front ready in prompt-ultime/"

#####################################
# 5. Scaffolding du back-end Express#
#####################################
cd ..
echo "🚀 Création du back-end Express…"
mkdir prompt-ultime-backend
cd prompt-ultime-backend
npm init -y
npm install express cors body-parser

mkdir -p src/routes
# 5.1 src/routes/prompts.js
cat > src/routes/prompts.js << 'EOF'
const express = require('express');
const router = express.Router();

const step1Html = \`
  <h1>🧪 Prototype Prompt Ultime – Version immersive</h1>
  <h2>Seuil d’entrée — Immersion inversée</h2>
  <p>🔬 Interface d’observation inversée : ici, les comportements considérés comme normaux deviennent objets d’étude…</p>
\`;

router.get('/step1', (req, res) => {
  res.json({ prompt: step1Html });
});

module.exports = router;
EOF

# 5.2 src/index.js
cat > src/index.js << 'EOF'
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const prompts = require('./routes/prompts');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// endpoints
app.use('/prompts', prompts);

// stubs sessions
app.post('/sessions', (req, res) => {
  const sessionId = Math.random().toString(36).substr(2, 9);
  res.json({ sessionId });
});
app.get('/sessions/:sid/current-step', (req, res) => {
  res.json({ prompt: '<p>Étape 1 à implémenter...</p>', choices: [{ id: 'a', label: 'Choix A' }, { id: 'b', label: 'Choix B' }] });
});
app.post('/sessions/:sid/answer', (req, res) => {
  res.json({ prompt: '<p>Étape suivante à implémenter...</p>', choices: [] });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(\`Backend running on http://localhost:\${PORT}\`));
EOF

echo "✅ Backend ready in prompt-ultime-backend/"

#####################################
# 6. Instructions finales           #
#####################################
cat << 'EOF'


🎉 Installation terminée !

1. Front : 
   cd prompt-ultime
   npm install
   npm start   # http://localhost:3000

2. Backend :
   cd ../prompt-ultime-backend
   npm install
   node src/index.js   # http://localhost:4000

3. Vérifie que :
   - GET  http://localhost:4000/prompts/step1 
   - POST http://localhost:4000/sessions 
   - GET  http://localhost:4000/sessions/<id>/current-step

Ton projet est prêt pour que tu adaptes les vraies étapes de ton jeu ! 🚀
EOF


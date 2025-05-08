const step1Html = `
<h1>🧪 Prototype Prompt Ultime – Version immersive</h1>
<p>🔬 Interface d’observation inversée : ici, les comportements considérés comme normaux deviennent des objets d’étude.</p>
<ul>
  <li>🌀 Mission douce : initiation ironique à l’étude du neurotypique standard.</li>
  <li>🎭 Enquête poétique : observer les rituels du quotidien avec des lunettes décalées.</li>
  <li>📘 Ce n’est pas un test…</li>
  <li>🔍 Ton rôle : observer, interpréter…</li>
</ul>
`;
const express = require('express');
const router = express.Router();

const step1Html = 
  <h1>🧪 Prototype Prompt Ultime – Version immersive</h1>
  <h2>Seuil d’entrée — Immersion inversée</h2>
  <p>🔬 Interface d’observation inversée : ici, les comportements considérés comme normaux deviennent objets d’étude…</p>
\`;

router.get('/step1', (req, res) => {
  res.json({ prompt: step1Html });
});

module.exports = router;

// compareTrees.js (CommonJS)
const fs = require('fs');

function collect(node, prefix = '') {
  let out = [];
  const name = node.name === node.path ? '' : node.name;
  const rel = prefix + name;
  if (rel) out.push(rel);
  (node.contents || []).forEach(c => {
    out.push(...collect(c, rel + '/'));
  });
  return out;
}

const local  = JSON.parse(fs.readFileSync('tree_local.json', 'utf-8'));
const remote = JSON.parse(fs.readFileSync('tree_remote.json', 'utf-8'));

const L = new Set(collect(local));
const R = new Set(collect(remote));

const added   = [...L].filter(p => !R.has(p));
const removed = [...R].filter(p => !L.has(p));

console.log('→ À ajouter sur le serveur :', added);
console.log('→ À supprimer du serveur :', removed);


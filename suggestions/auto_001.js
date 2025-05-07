Voici un exemple de script Node.js qui lit un fichier JSON, le valide avec AJV (Another JSON Schema Validator) et affiche les erreurs :

```javascript
// Importer les modules nécessaires
const fs = require('fs');
const AJV = require('ajv');
const ajv = new AJV();

// Définir le schéma JSON
let schema = {
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "age": {
      "type": "number"
    }
  },
  "required": ["name", "age"]
};

// Lire le fichier JSON
fs.readFile('data.json', 'utf8', function(err, data) {
  if (err) {
    console.log('Erreur lors de la lecture du fichier JSON : ', err);
    return;
  }

  // Parse le contenu du fichier JSON
  let jsonData = JSON.parse(data);

  // Valider les données JSON avec AJV
  let validate = ajv.compile(schema);
  let valid = validate(jsonData);

  if (!valid) {
    console.log('Validation échouée : ', validate.errors);
  } else {
    console.log('Validation réussie');
  }
});
```

Dans cet exemple, le schéma JSON attend un objet avec deux propriétés : "name" (une chaîne de caractères) et "age" (un nombre). Ces deux propriétés sont requises. Le script lit le fichier "data.json", valide son contenu avec AJV et affiche les erreurs de validation, le cas échéant.
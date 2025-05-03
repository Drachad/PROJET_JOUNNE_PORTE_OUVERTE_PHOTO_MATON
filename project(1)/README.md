# IFNTI-KBU Certificate Generator

Application de génération de certificats pour la Journée Portes Ouvertes IFNTI-KBU.

## Fonctionnalités

- Capture de photo via webcam ou téléchargement
- Formulaire d'inscription des participants
- Génération de certificats personnalisés
- Export des certificats en PNG
- Liste des participants avec recherche
- Export de tous les participants en CSV
- Base de données SQLite pour le stockage persistant

## Installation

1. Cloner le dépôt
\`\`\`bash
git clone https://github.com/votre-utilisateur/ifnti-certificate-generator.git
cd ifnti-certificate-generator
\`\`\`

2. Installer les dépendances
\`\`\`bash
npm install
\`\`\`

3. Lancer l'application
\`\`\`bash
# Lancer le serveur et l'application frontend en même temps
npm run dev:all

# Ou lancer séparément
npm run server # Pour le serveur backend
npm run dev    # Pour l'application frontend
\`\`\`

4. Ouvrir l'application dans le navigateur
\`\`\`
http://localhost:5173
\`\`\`

## Technologies utilisées

- React
- TypeScript
- Vite
- Tailwind CSS
- SQLite (via better-sqlite3)
- Express
- HTML2Canvas pour l'export des certificats

## Structure du projet

- `src/server.ts` - Serveur Express pour l'API
- `src/api.ts` - Client API pour communiquer avec le serveur
- `src/utils/db.ts` - Fonctions d'accès à la base de données SQLite
- `src/components/` - Composants React de l'application

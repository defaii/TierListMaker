# Serveur local Express

J'ai ajouté un petit serveur Express pour gérer l'upload d'images.

- Endpoint POST `/api/upload` (champ FormData `file`).
- Endpoint DELETE `/api/upload/:filename` pour supprimer un fichier uploadé (ex : `DELETE /api/upload/160000-123.png`).
- Serve static files sous `/uploads` (dossier `uploads/` à la racine du projet — **hors** de `public/` pour éviter le rechargement automatique du client). 
- Limite de taille : 5MB.

Notes de migration:
- Si vous avez des fichiers déjà présents dans `public/uploads`, déplacez-les vers `uploads/` (ou supprimez-les) pour éviter d'être rechargé automatiquement par CRA lors des changements de fichiers.
Commandes utiles:

- Installer les dépendances :

```bash
npm install
```

- Lancer le serveur (production):

```bash
npm run server
```

- Lancer en mode développement (reload automatique) :

```bash
npm run dev:server
```

Notes:
- `package.json` contient maintenant `proxy: "http://localhost:5000"` pour que `fetch('/api/upload')` fonctionne depuis le dev server React.
- Ajouté `.gitignore` pour ignorer `/public/uploads`.

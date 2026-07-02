# App de révision — client mobile (Expo)

Voir `docs/cahier-des-charges.md` à la racine du repo pour le contexte complet du projet.

## Démarrer en local

```bash
cd app
npm install
npm start
```

Scanner le QR code affiché avec l'app **Expo Go** (Android/iOS) pour tester sur téléphone sans rien publier sur les stores.

## Connecter Supabase (optionnel pour tester)

Sans configuration, l'appli fonctionne en **mode invité local** : connexion par simple pseudo, progression sauvegardée uniquement sur l'appareil (`AsyncStorage`).

Pour brancher un vrai backend Supabase (comptes email/mot de passe, progression synchronisée) :

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Exécuter `docs/supabase-schema.sql` dans l'éditeur SQL du projet
3. Copier `app/.env.example` en `app/.env` et renseigner `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` (Project Settings > API)
4. Relancer `npm start`

## Structure

```
src/
  context/     AuthContext (session), ProgressContext (progression élève)
  data/        contenu des matières converti en JSON (un fichier par matière/niveau)
  lib/         client Supabase, accès progression avec repli local
  navigation/  navigateur (Login -> Home -> Subject -> Module)
  screens/     écrans de l'appli
```

## Ajouter une nouvelle matière/niveau

1. Créer un fichier JSON dans `src/data/subjects/` en suivant le format de `maths-seconde.json`
2. L'importer et l'ajouter au tableau `subjectFiles` dans `src/data/subjects/index.js`

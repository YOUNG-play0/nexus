# Projet : Appli de révision pour mon école (type Wilgo)

## 1. Vision

Une appli mobile gratuite de révision pour les élèves de mon école, construite à partir des cours déjà créés (Maths, Physique-Chimie, Français, SNT, NSI — Seconde et Première). Objectif : que tous les élèves bénéficient du même niveau de préparation, pas seulement moi.

Inspiration : Wilgo (carte de progression visuelle, quiz courts auto-corrigés, gamification par points, 100% gratuit, sans pub).

## 2. Public cible

Élèves de mon école, à partir de la classe de Seconde/Première. Extensible à d'autres niveaux plus tard.

## 3. Fonctionnalités — Version 1 (MVP, à construire en premier)

- **Comptes élèves** : inscription simple (email + mot de passe, ou juste un pseudo pour aller vite au début)
- **Contenu par matière** : import du contenu déjà créé (cours, vidéos, quiz, exercices) organisé en modules
- **Carte de progression visuelle** : chaque élève voit les modules complétés / en cours / à faire, par matière
- **Quiz auto-corrigés** : réponse vérifiée immédiatement avec indice si faux (déjà le modèle utilisé dans les fichiers actuels — juste besoin de le rendre persistant par utilisateur)
- **Suivi de progression sauvegardé** : la progression de chaque élève est stockée et retrouvée à la reconnexion

## 4. Fonctionnalités — Version 2 (plus tard, pas prioritaire)

- Gamification : points, badges, petit classement entre amis (optionnel, à activer avec prudence pour ne pas créer de pression négative)
- Scanner de devoir / correction par IA d'une photo de copie manuscrite
- Partage de fiches entre élèves
- Notifications de rappel de révision
- Mode hors-ligne

## 5. Stack technique recommandée

- **Application mobile** : React Native + Expo — cross-platform (Android + iOS en un seul code), gratuit, bonne documentation, adapté à un projet solo/étudiant. Testable immédiatement sur téléphone via l'app "Expo Go" pendant le développement, sans attendre une publication sur les stores.
- **Backend / base de données** : Supabase (gratuit jusqu'à un usage raisonnable, gère à la fois l'authentification des comptes et le stockage des données de progression — pas besoin de gérer un serveur soi-même).
- **Contenu** : convertir les modules HTML déjà créés en fichiers de données structurées (JSON) — un fichier par matière/module, avec le texte du cours, les questions de quiz, les réponses acceptées et les indices. Cette conversion peut se faire progressivement, matière par matière.

## 6. Modèle de données simplifié

- **users** : id, pseudo/email, date de création
- **subjects** : id, nom (ex: "Mathématiques"), ordre d'affichage
- **modules** : id, subject_id, titre, niveau (Seconde/Première), contenu du cours, ordre
- **quiz_questions** : id, module_id, question, type (numérique/choix), réponses acceptées, indice
- **progress** : user_id, module_id, statut (à faire / en cours / terminé), date de complétion
- **quiz_attempts** : user_id, question_id, réponse donnée, correcte (oui/non), date

## 7. Plan de démarrage étape par étape (à donner à Claude Code)

1. Initialiser un projet Expo (React Native) avec navigation de base (écran d'accueil, écran matière, écran module)
2. Créer le compte Supabase et configurer l'authentification (inscription/connexion simple)
3. Définir le schéma de base de données (tables ci-dessus) dans Supabase
4. Convertir 1 matière du contenu HTML existant en JSON structuré (commencer petit, par exemple juste les modules Seconde de Maths, pour valider le format avant de tout convertir)
5. Construire l'écran "carte de progression" : liste des matières, chaque matière déroule ses modules avec un indicateur visuel de statut
6. Construire l'écran "module" : affichage du cours, puis le quiz avec vérification immédiate (réutiliser la logique déjà écrite en JavaScript dans les fichiers actuels, adaptée en React Native)
7. Brancher la sauvegarde de la progression dans Supabase à chaque quiz réussi
8. Tester sur téléphone via Expo Go, corriger, itérer
9. Une fois stable : ajouter les autres matières, puis envisager les fonctionnalités V2

## 8. Contenu déjà disponible comme matière première

- **Maths** : Seconde (7 modules) + Première spécialité (9 modules) — cours détaillés, vidéos, quiz, exercices
- **Physique-Chimie** : Seconde (6 modules) + Première spécialité (4 modules)
- **Français** : méthodologie (commentaire, dissertation, oral) + figures de style + fiches sur les 12 œuvres du programme national
- **SNT** : les 7 thèmes officiels (Seconde)
- **NSI** : 6 modules de Première spécialité (représentation des données, Python, algorithmes de tri)

Tout ce contenu existe déjà en HTML/JavaScript autonome — la conversion en JSON pour l'appli est un travail de réorganisation, pas de recréation.

## 8bis. Feuille de route du contenu (ordre de priorité décidé)

L'appli doit couvrir à terme 3 niveaux : **Troisième, Seconde, Terminale** (Première déjà bien avancée). Le modèle de données (voir section 6) supporte déjà plusieurs niveaux par matière — pas de refonte technique nécessaire, juste ajouter du contenu progressivement.

Ordre de construction retenu :
1. **Finir Seconde + Première sur toutes les matières manquantes** — il ne reste que l'**Anglais** à construire pour compléter ces deux niveaux (Maths, Physique-Chimie, Français, SNT, NSI sont déjà faits)
2. **Étendre ensuite à Troisième et Terminale**, matière par matière, en commençant par **Maths** (matière jugée prioritaire par la demande)
3. Poursuivre les autres matières pour ces deux niveaux selon les retours des premiers élèves utilisateurs de l'appli

Ne pas essayer de tout construire d'un coup pour 3 niveaux × 5 matières = 15 blocs de contenu : mieux vaut sortir une V1 solide sur Seconde/Première complet, la tester avec des vrais élèves, puis étendre.

## 9. Point d'attention

Comme l'appli gérera des comptes et des données d'élèves (potentiellement mineurs), il vaut mieux vérifier avec un adulte responsable de l'école (professeur, administration) avant de la déployer largement — pour la confidentialité des données et l'autorisation d'utilisation dans l'établissement.

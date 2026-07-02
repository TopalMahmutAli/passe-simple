# Cahier des charges - Passé Simple

## 1. Présentation

### Idée en une phrase

Passé Simple est une application mobile éducative qui permet d'apprendre l'Histoire avec des fiches courtes, des favoris et des mini-quiz.

### Problème identifié

Les cours d'Histoire peuvent contenir beaucoup de dates, de personnages et d'événements. Les supports traditionnels sont parfois longs à relire et ne donnent pas toujours un retour immédiat sur ce qui a été retenu.

### Solution proposée

Passé Simple découpe une période historique en chapitres et en fiches courtes. Après la lecture, l'utilisateur peut répondre à trois questions, enregistrer son résultat et retrouver ses fiches favorites.

### Public visé

- collégiens et lycéens ;
- étudiants souhaitant réviser rapidement ;
- personnes intéressées par la culture générale.

## 2. Périmètre du MVP

Le MVP se concentre sur la Révolution française avec trois chapitres :

1. Les causes de la Révolution et les États généraux ;
2. L'année 1789 et la Déclaration des droits de l'homme et du citoyen ;
3. La République, la Terreur et la fin de la Révolution.

Chaque chapitre contient quelques fiches courtes. Chaque fiche possède un mini-quiz de trois questions.

### Fonctionnalités obligatoires

- inscription et connexion ;
- consultation des chapitres ;
- consultation des fiches d'un chapitre ;
- lecture d'une fiche ;
- ajout et suppression d'un favori ;
- mini-quiz de trois questions ;
- calcul et affichage du score ;
- sauvegarde de la progression ;
- rappel quotidien facultatif ;
- affichage du profil ;
- déconnexion.

### Fonctionnalités exclues

- frise chronologique interactive ;
- commentaires et messagerie ;
- contenu créé par les utilisateurs ;
- compte professeur ;
- classement public ;
- paiement ;
- intelligence artificielle ;
- capteurs ou géolocalisation ;
- synchronisation hors-ligne complète.

## 3. Besoins utilisateurs

En tant qu'utilisateur :

- je peux créer un compte pour conserver ma progression ;
- je peux me connecter pour retrouver mes favoris et mes scores ;
- je peux parcourir les chapitres disponibles ;
- je peux lire une fiche sans distraction ;
- je peux enregistrer une fiche dans mes favoris ;
- je peux tester mes connaissances avec trois questions ;
- je peux voir si mes réponses sont correctes ;
- je peux consulter ma progression ;
- je peux activer ou désactiver un rappel de révision ;
- je peux me déconnecter.

## 4. Écrans

### Connexion et inscription

Permet de saisir une adresse e-mail et un mot de passe, puis de se connecter ou de créer un compte.

États à gérer : formulaire incomplet, erreur Supabase, compte créé, connexion réussie et chargement.

### Découvrir

Onglet principal présentant les chapitres disponibles.

États à gérer : chargement, liste disponible, liste vide et erreur réseau avec bouton Réessayer.

### Détail d'un chapitre

Présente le titre, une courte introduction et les fiches du chapitre.

### Lecture d'une fiche

Affiche le titre, le contenu historique, les dates importantes et le bouton Favori. Un bouton permet ensuite de commencer le mini-quiz.

### Mini-quiz

Modale contenant trois questions à choix multiple. Une seule question est affichée à la fois.

À la fin, l'utilisateur voit son score sur trois, un message simple et un bouton pour fermer le quiz.

### Favoris

Affiche uniquement les fiches enregistrées par l'utilisateur. Un état vide explique comment ajouter une première fiche.

### Progression

Affiche les fiches terminées et le meilleur score obtenu pour chacune.

### Mon compte

Affiche l'adresse e-mail, le réglage du rappel quotidien et le bouton de déconnexion.

## 5. Navigation

```text
Root Stack
├── (public)
│   └── auth
└── (private)
    ├── (tabs)
    │   ├── Découvrir
    │   ├── Favoris
    │   ├── Progression
    │   └── Mon compte
    ├── chapter/[id]
    ├── lesson/[id]
    └── quiz/[lessonId] — présentation modal
```

Règles :

- un utilisateur non connecté est dirigé vers l'authentification ;
- un utilisateur connecté accède aux onglets privés ;
- le retour natif fonctionne depuis les détails ;
- le quiz s'ouvre au-dessus de la fiche sous forme de modale ;
- la déconnexion ramène à l'écran de connexion.

## 6. Données

### `chapters`

- `id`
- `title`
- `description`
- `position`

### `lessons`

- `id`
- `chapter_id`
- `title`
- `summary`
- `content`
- `position`

### `questions`

- `id`
- `lesson_id`
- `question`
- `choice_a`
- `choice_b`
- `choice_c`
- `correct_choice`
- `position`

### `favorites`

- `user_id`
- `lesson_id`
- `created_at`

### `progress`

- `user_id`
- `lesson_id`
- `best_score`
- `completed_at`

### Sécurité

- les chapitres, fiches et questions sont accessibles en lecture ;
- seuls les responsables du projet ajoutent le contenu pédagogique ;
- chaque utilisateur peut lire et modifier uniquement ses favoris et sa progression ;
- les règles sont appliquées avec la Row Level Security de Supabase.

## 7. État et persistance

- Supabase contient les cours, les favoris et la progression ;
- TanStack Query charge et met en cache les données distantes ;
- un Context conserve l'état temporaire du quiz ;
- Supabase Auth conserve la session ;
- AsyncStorage conserve la préférence et l'identifiant du rappel quotidien.

## 8. Brique avancée choisie

La brique avancée du MVP est la notification locale.

L'utilisateur peut activer un rappel quotidien depuis son compte. L'application demande la permission au moment de l'action. Si la permission est refusée, le réglage reste désactivé et un message explique la situation.

Le GPS, les capteurs et les notifications push serveur ne font pas partie du MVP.

## 9. Direction visuelle

L'interface doit évoquer l'Histoire sans imiter un vieux document difficile à lire.

Direction proposée :

- fond clair légèrement crème ;
- texte principal bleu très sombre ;
- couleur principale bordeaux ;
- couleur secondaire dorée utilisée avec modération ;
- cartes simples avec coins légèrement arrondis ;
- typographie lisible ;
- espacements définis dans un petit design system.

Les animations restent discrètes : apparition des cartes, transition entre les questions, retour visuel sur une réponse et progression animée.

## 10. Gestion des erreurs

L'application doit prévoir :

- un indicateur de chargement ;
- un état vide pour les favoris et la progression ;
- un message en cas d'erreur Supabase ;
- un bouton Réessayer lorsque le chargement échoue ;
- un message si la permission de notification est refusée ;
- un écran clair si une fiche demandée n'existe pas.

## 11. Tests prévus

1. La liste des chapitres s'affiche ;
2. l'état vide des favoris est visible ;
3. ajouter une fiche aux favoris met l'écran à jour ;
4. le score du quiz est calculé correctement ;
5. terminer un quiz enregistre la progression ;
6. un utilisateur non connecté ne peut pas accéder aux écrans privés.

Les tests utilisent des données simulées et ne contactent pas le vrai projet Supabase.

## 12. Critères de validation du MVP

Le MVP est fonctionnel lorsque :

- un utilisateur peut créer un compte et se connecter ;
- les trois chapitres pilotes sont consultables ;
- au moins une fiche complète est disponible par chapitre ;
- chaque fiche possède trois questions ;
- les favoris sont enregistrés ;
- le meilleur score est enregistré ;
- le rappel peut être activé et désactivé ;
- les erreurs et états vides sont affichés ;
- les parcours principaux possèdent des tests ;
- l'application fonctionne sur un véritable appareil ;
- un build Android de production signé est généré.

## 13. Stack technique

- Expo SDK 54 ;
- React Native et TypeScript ;
- Expo Router ;
- React Context ;
- Supabase Database et Supabase Auth ;
- TanStack Query ;
- AsyncStorage ;
- Expo Notifications ;
- React Native Reanimated ;
- Jest et React Native Testing Library.

## 14. Monétisation

Passé Simple adopte un modèle freemium sans publicité. Le programme consacré à la Révolution française ainsi que toutes les fonctionnalités principales sont gratuits.

### Partie gratuite

- les trois chapitres sur la Révolution française ;
- les fiches historiques et les mini-quiz ;
- les favoris et le suivi de progression ;
- les rappels de révision.

Cette partie constitue une expérience complète et permet d'utiliser l'application sans limite artificielle.

### Évolution payante envisagée

De nouvelles périodes historiques pourront être proposées sous forme de packs à acheter une seule fois, par exemple l'Antiquité, le Moyen Âge ou les guerres mondiales.

Le prix envisagé est de 2,99 € par pack. Avec une commission de store estimée entre 15 % et 30 % dans le cadre du cours, le revenu serait d'environ 2,54 € à 2,09 € par vente, avant taxes.

L'achat à l'unité est préféré à l'abonnement, car l'utilisation de l'application peut être ponctuelle et aucun nouveau contenu mensuel n'est garanti. La publicité est écartée afin de préserver la concentration et l'image éducative de l'application.

### Mise en œuvre future

Les packs numériques devront être créés dans Google Play et l'App Store puis achetés avec le système d'achat intégré des stores. RevenueCat pourra simplifier la récupération des produits, la vérification des achats et la restauration des droits sur un nouvel appareil.

Aucun paiement ne sera développé dans le MVP. Seule cette stratégie est documentée pour répondre aux exigences du projet.

## 15. Livrables

- code source ;
- README ;
- cahier des charges ;
- tests ;
- archive ;
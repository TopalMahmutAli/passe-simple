# Passé Simple

Passé Simple est une application mobile éducative pour apprendre l'Histoire avec des fiches courtes, des favoris et des mini-quiz.

## Présentation

- **Idée en une phrase** : réviser la Révolution française avec des fiches courtes, des favoris et des mini-quiz.
- **Public** : collégiens, lycéens, étudiants souhaitant réviser rapidement, et toute personne intéressée par la culture générale.
- **Périmètre** : le MVP couvre uniquement la Révolution française, de la fin de l'Ancien Régime à la naissance de la République en septembre 1792.

## Fonctionnalités du MVP

- inscription et connexion ;
- persistance et restauration de la session Supabase ;
- routes publiques et privées selon l'état de connexion ;
- déconnexion ;
- affichage des chapitres depuis Supabase ;
- affichage des fiches d'un chapitre ;
- lecture d'une fiche complète ;
- ajout et retrait d'une fiche des favoris ;
- écran Favoris ;
- mini-quiz de trois questions avec retour correct/incorrect ;
- score final sur trois et sauvegarde du meilleur score ;
- écran Progression ;
- rappel local quotidien à 18 h, activé depuis Mon compte ;
- permission de notification demandée uniquement après l'action de l'utilisateur, avec gestion propre du refus ;
- chargements, erreurs et états vides gérés sur les écrans connectés, avec bouton Réessayer sur les écrans distants principaux.

## Contenu pédagogique

Le MVP couvre trois chapitres et six fiches :

1. **La fin de l'Ancien Régime**
   - La société d'ordres
   - La crise de la monarchie
2. **L'année 1789**
   - Des États généraux à l'Assemblée nationale
   - La prise de la Bastille
3. **De la monarchie à la République**
   - La monarchie constitutionnelle
   - La naissance de la République

Le contenu s'arrête à la proclamation de la République en septembre 1792. La Terreur et la suite de la Révolution ne sont pas couvertes par ce MVP.

## Navigation

```text
app/
├── _layout.tsx
├── (public)/
│   └── auth/
│       └── index.tsx
└── (private)/
    ├── (tabs)/
    │   ├── index.tsx          # Découvrir
    │   ├── favorites.tsx      # Favoris
    │   ├── progress.tsx       # Progression
    │   └── account.tsx        # Mon compte
    ├── chapter/
    │   └── [id].tsx           # Fiches d'un chapitre
    ├── lesson/
    │   └── [id].tsx           # Lecture d'une fiche
    └── quiz/
        └── [lessonId].tsx     # Mini-quiz en modale
```

## Stack

- Expo SDK 54 ;
- React Native et TypeScript ;
- Expo Router ;
- Supabase (base de données et authentification) ;
- TanStack Query pour les données distantes ;
- React Context pour la session utilisateur (`AuthContext`) ;
- AsyncStorage pour la préférence et l'identifiant du rappel quotidien ;
- Expo Notifications pour le rappel local ;
- React Native Reanimated pour des animations discrètes (apparition des chapitres, transitions entre les questions du quiz) ;
- Jest et React Native Testing Library couvrent les parcours principaux (authentification, chapitres, favoris, fiche, quiz) et les fonctions pures du quiz.

## Installation locale

```powershell
npm install
```

Créer un fichier `.env.local` à partir de `.env.example`, avec les variables suivantes :

```txt
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_KEY
```

Puis démarrer le projet :

```powershell
npx expo start
```

## Initialisation Supabase

1. Ouvrir le SQL Editor du projet Supabase ;
2. exécuter `supabase/schema.sql` ;
3. exécuter `supabase/seed.sql`.

Le seed peut être relancé sans risque : les insertions utilisent `on conflict` pour mettre à jour les lignes existantes plutôt que les dupliquer.

## Scripts

- `npm start` : démarre le serveur Expo ;
- `npm run android` : démarre sur un émulateur ou appareil Android ;
- `npm run ios` : démarre sur un simulateur ou appareil iOS ;
- `npm run web` : démarre la version web ;
- `npm run lint` : lance ESLint ;
- `npm test` : lance les tests Jest.



## Brique avancée : rappel local

Un rappel quotidien à 18 h peut être activé depuis l'écran "Mon compte". La permission de notification est demandée uniquement au moment de l'activation, jamais au lancement de l'application. En cas de refus, le réglage reste désactivé et un message explique la situation.

Le rappel est une notification **locale** : elle est programmée sur l'appareil via `expo-notifications`, sans serveur, sans token push et sans Edge Function. L'identifiant de la notification et la préférence de l'utilisateur sont conservés avec AsyncStorage.

## Monétisation

Passé Simple adopte un modèle freemium : le contenu sur la Révolution française reste gratuit, avec un élargissement payant envisagé vers d'autres périodes historiques. Le détail de la stratégie est décrit dans [CAHIER_DES_CHARGES.md](./CAHIER_DES_CHARGES.md).

## Livrables

- un ZIP propre du code source ;
- un build Android signé (`passe-simple-android-1.0.0.aab`) ;

- voie A de livraison : build de production accompagné d'un plan de publication.

Le périmètre détaillé, les écrans, les données et les critères d'acceptation sont disponibles dans [CAHIER_DES_CHARGES.md](./CAHIER_DES_CHARGES.md).

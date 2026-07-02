# Passé Simple

Passé Simple est une application mobile éducative qui aide à apprendre l'Histoire grâce à des fiches courtes, des favoris et des mini-quiz.

Le MVP est consacré à la Révolution française. Il contient trois chapitres pilotes afin de proposer une application complète sans chercher à couvrir toute l'Histoire.

## Objectif

L'application permet à un étudiant de réviser rapidement, de retrouver ses fiches préférées et de suivre sa progression.

## Fonctionnalités du MVP

- créer un compte et se connecter ;
- consulter les chapitres et les fiches historiques ;
- lire une fiche courte ;
- ajouter ou retirer une fiche des favoris ;
- répondre à un mini-quiz de trois questions ;
- enregistrer le score et la progression ;
- activer un rappel quotidien de révision ;
- consulter son compte et se déconnecter.

## Hors périmètre du MVP

- frise chronologique interactive ;
- création de cours par les utilisateurs ;
- espace professeur ou administration ;
- classement entre utilisateurs ;
- paiement ;
- intelligence artificielle ;
- fonctionnement hors-ligne complet.

## Navigation prévue

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
        └── [lessonId].tsx     # Mini-quiz en modal
```

## Parcours principal

```text
Connexion
  → Découvrir
  → Choisir un chapitre
  → Lire une fiche
  → Ajouter éventuellement aux favoris
  → Faire le mini-quiz
  → Consulter le score et la progression
```

## Stack technique prévue

- Expo SDK 54 et React Native ;
- TypeScript ;
- Expo Router ;
- React Context ;
- Supabase Database et Supabase Auth ;
- TanStack Query ;
- AsyncStorage pour la préférence du rappel ;
- Expo Notifications pour le rappel quotidien ;
- React Native Reanimated pour quelques animations discrètes ;
- Jest et React Native Testing Library pour les parcours principaux.

La brique avancée obligatoire choisie est la notification locale. Aucun capteur n'est nécessaire au MVP.

## Documentation

Le périmètre détaillé, les utilisateurs visés, les écrans et les critères d'acceptation sont disponibles dans [CAHIER_DES_CHARGES.md](./CAHIER_DES_CHARGES.md).

## État du projet

- [x] Idée et périmètre du MVP
- [x] Cahier des charges initial
- [x] Navigation prévue
- [x] Stack choisie
- [ ] Développement
- [ ] Tests
- [ ] Build de production
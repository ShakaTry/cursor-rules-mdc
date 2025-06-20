# 🚀 Système MDC Cursor - Méthodologie Professionnelle Automatique

Ce système transforme Claude dans Cursor en un développeur senior méthodique qui applique automatiquement une méthodologie professionnelle.

## 📁 Structure du projet

```
cursor_rules/
├── .cursor/
│   ├── rules/           # 7 fichiers MDC configurés
│   └── plans/           # Plans d'action (créés automatiquement)
│       └── completed-tasks/
├── memory-bank/         # Contexte persistant (créé automatiquement)
├── documentation/       # Guides et références
└── README.md           # Ce fichier
```

## ⚡ Installation rapide

### 1. Dans Cursor :
- Aller dans **Settings → Rules → Project Rules**
- Pour chaque fichier dans `.cursor/rules/` :
  - Cliquer sur "New Rule"
  - Copier le nom du fichier (ex: `001_workspace`)
  - Copier tout le contenu du fichier MDC
  - Sauvegarder

### 2. C'est tout ! Le système est 100% automatique.

## 🤖 Comment ça marche ?

1. **Vous** : "J'ai besoin d'une API pour gérer des utilisateurs"
2. **Claude** : 
   - Démarre automatiquement en mode RESEARCH
   - Lit la Memory Bank pour comprendre le contexte
   - Passe en mode PLAN et crée un plan structuré
   - Attend votre validation
3. **Vous** : "OK" ou "Approuvé"
4. **Claude** :
   - Implémente le code selon le plan
   - Applique les standards et sécurité
   - Documente et archive automatiquement

## 📊 Impact sur le contexte

- **Total** : ~1,300 tokens (0.65% du contexte)
- **99%+** du contexte reste disponible pour votre code
- **Activation intelligente** : seules les règles pertinentes se chargent

## 📚 Documentation complète

Voir le dossier `documentation/` pour :
- Guide d'utilisation détaillé
- Analyse de l'optimisation
- Fichiers MDC source

---

💡 **Astuce** : Commencez simplement en demandant ce que vous voulez. Claude s'occupe du reste ! 
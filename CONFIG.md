# Configuration - LinkedIn Post Generator v2.0

## Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

### Variables requises

```bash
# Clé API Gemini AI (obligatoire)
# Obtenez votre clé sur : https://makersuite.google.com/app/apikey
GEMINI_API_KEY=votre_cle_api_gemini_ici
```

### Variables optionnelles

```bash
# Token GitHub pour les commits automatiques (GitHub Actions le fournit automatiquement)
GITHUB_TOKEN=votre_token_github_ici
```

## Configuration des secrets GitHub Actions

Dans votre repository GitHub, configurez les secrets suivants :

1. Allez dans `Settings` > `Secrets and variables` > `Actions`
2. Cliquez sur `New repository secret`
3. Ajoutez le secret suivant :
   - **Nom** : `GEMINI_API_KEY`
   - **Valeur** : votre clé API Gemini

## Configuration du workflow

Le workflow GitHub Actions est configuré pour s'exécuter :
- **Automatiquement** : tous les jours à 9h UTC (10h heure française)
- **Manuellement** : via l'interface GitHub Actions
- **Sur push** : à chaque push sur la branche main

## Structure des fichiers de sortie

### `linkedin-post-for-n8n.json`

Fichier JSON structuré contenant :
- **metadata** : informations sur la génération
- **post** : contenu du post généré
- **instructions** : étapes pour la publication

Exemple de structure :

```json
{
  "metadata": {
    "generated_at": "2026-01-03T22:00:00.000Z",
    "generator_version": "2.0.0",
    "timezone": "UTC",
    "status": "ready_for_publication"
  },
  "post": {
    "topic": "Développement professionnel",
    "content": "Contenu du post LinkedIn...",
    "hashtags": ["#Professionnel", "#Développement"],
    "length": 1450,
    "generated_at": "2026-01-03T22:00:00.000Z"
  },
  "instructions": {
    "publication_platform": "LinkedIn",
    "next_steps": [
      "1. Vérifier le contenu du post",
      "2. Personnaliser si nécessaire", 
      "3. Publier via n8n ou interface LinkedIn"
    ]
  }
}
```

### `data.json`

Fichier contenant :
- **topics** : liste des sujets pour la génération
- **history** : historique des posts générés
- **settings** : paramètres de configuration

## Personnalisation

### Modifier les sujets de posts

Éditez le fichier `data.json` et modifiez la section `topics` :

```json
{
  "topics": [
    "Vos sujets personnalisés ici",
    "Développement professionnel",
    "Technologie et innovation"
  ]
}
```

### Ajuster les paramètres

Dans `data.json`, modifiez la section `settings` :

```json
{
  "settings": {
    "maxHistoryLength": 30,
    "postLength": {
      "min": 1300,
      "max": 1500
    },
    "tone": "professionnel",
    "includeHashtags": true,
    "maxHashtags": 5
  }
}
```

## Dépannage

### Erreur "GEMINI_API_KEY est requise"

- Vérifiez que la variable `GEMINI_API_KEY` est définie dans votre `.env`
- Sur GitHub Actions, assurez-vous que le secret `GEMINI_API_KEY` est configuré

### Le post n'est pas généré

- Vérifiez les logs GitHub Actions
- Assurez-vous que votre clé API Gemini est valide
- Vérifiez les quotas de l'API Gemini

### Fichiers non commités

- Le workflow GitHub Actions sauvegarde automatiquement `data.json` et `linkedin-post-for-n8n.json`
- Si les commits échouent, vérifiez les permissions du token GitHub
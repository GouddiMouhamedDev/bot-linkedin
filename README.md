# LinkedIn Post Generator v2.0

🤖 **Générateur automatique de posts LinkedIn avec Gemini AI**

Ce projet génère automatiquement des posts LinkedIn professionnels et engageants en utilisant l'intelligence artificielle Gemini de Google. Les posts sont sauvegardés dans un fichier JSON structuré pour une intégration facile avec n8n ou d'autres outils d'automatisation.

## ✨ Fonctionnalités

- 🤖 **Génération IA** : Utilise Gemini AI pour créer des posts de qualité
- ⏰ **Automatisation** : Exécution quotidienne automatique via GitHub Actions
- 📄 **Sortie JSON** : Fichier structuré pour n8n et autres outils
- 🎯 **Personnalisable** : Sujets et paramètres configurables
- 🇫🇷 **Français** : Posts optimisés pour le marché francophone
- 📊 **Suivi** : Historique des posts générés
- 🔄 **Anti-répétition** : Évite la répétition des sujets

## 🚀 Installation rapide

### 1. Cloner le repository

```bash
git clone <votre-repo>
cd bot-linkedin
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration

Copiez `.env.exemple` vers `.env` et ajoutez votre clé API :

```bash
cp .env.exemple .env
```

Éditez `.env` :
```bash
GEMINI_API_KEY=votre_cle_api_gemini_ici
```

### 4. Test local

```bash
npm run generate
```

## 📋 Utilisation

### Génération manuelle

```bash
npm start
# ou
npm run generate
```

### Sortie automatique

Le fichier `linkedin-post-for-n8n.json` est généré avec la structure suivante :

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

## ⚙️ Configuration GitHub Actions

### 1. Secrets requis

Dans votre repository GitHub, ajoutez le secret :
- **Nom** : `GEMINI_API_KEY`
- **Valeur** : votre clé API Gemini

### 2. Exécution automatique

Le workflow s'exécute :
- **🕘 Tous les jours à 9h UTC** (10h heure française)
- **👆 Manuellement** via GitHub Actions
- **📤 Sur push** vers la branche main

### 3. Logs et monitoring

Les logs GitHub Actions incluent :
- 📊 Statistiques du post généré
- 📄 Contenu complet du fichier JSON
- ✅ Statut de réussite/échec

## 📁 Structure du projet

```
bot-linkedin/
├── 📄 index.js                 # Point d'entrée principal
├── 📁 lib/
│   └── 📄 generator.js         # Logique de génération
├── 📄 data.json                # Configuration et historique
├── 📄 .env                     # Variables d'environnement
├── 📄 package.json             # Dépendances Node.js
├── 📄 CONFIG.md                # Guide de configuration
└── 📁 .github/
    └── 📁 workflows/
        └── 📄 main.yml         # Workflow GitHub Actions
```

## 🎨 Personnalisation

### Modifier les sujets

Éditez `data.json` :

```json
{
  "topics": [
    "Vos sujets personnalisés",
    "Développement professionnel",
    "Innovation technologique"
  ]
}
```

### Ajuster les paramètres

Dans `data.json`, section `settings` :

```json
{
  "settings": {
    "maxHistoryLength": 30,        # Nombre de posts conservés
    "postLength": {
      "min": 1300,                # Longueur minimale
      "max": 1500                 # Longueur maximale
    },
    "tone": "professionnel",       # Ton des posts
    "includeHashtags": true,       # Inclure des hashtags
    "maxHashtags": 5              # Nombre maximum de hashtags
  }
}
```

## 🔧 Dépannage

### Erreur "GEMINI_API_KEY est requise"

✅ **Solution** : Vérifiez que la variable `GEMINI_API_KEY` est définie dans votre `.env` ou dans les secrets GitHub Actions.

### Le post n'est pas généré

✅ **Vérifications** :
1. Clé API Gemini valide
2. Quotas API non dépassés
3. Logs GitHub Actions pour plus de détails

### Commits GitHub échoués

✅ **Solution** : Vérifiez que le secret `GITHUB_TOKEN` a les bonnes permissions.

## 📈 Intégration n8n

### Workflow n8n recommandé

1. **Trigger** : Scheduled Trigger (quotidien à 10h)
2. **Read File** : Lire `linkedin-post-for-n8n.json`
3. **Condition** : Vérifier `metadata.status === "ready_for_publication"`
4. **Action** : Publier sur LinkedIn (via API ou navigateur)
5. **Cleanup** : Marquer le post comme publié

### Exemple de node n8n

```javascript
// Node Function pour extraire le contenu
const data = $input.first().json;
return [{
  json: {
    content: data.post.content,
    hashtags: data.post.hashtags.join(' '),
    topic: data.post.topic,
    length: data.post.length
  }
}];
```

## 🆕 v2.0 - Nouveautés

- ✅ **Architecture simplifiée** : Code plus propre et maintenable
- ✅ **Sortie JSON optimisée** : Structure parfaite pour n8n
- ✅ **Workflow GitHub Actions modernisé** : Meilleure gestion des erreurs
- ✅ **Documentation améliorée** : Guides détaillés
- ✅ **Performance optimisée** : Génération plus rapide
- ✅ **Support français natif** : Posts entièrement en français

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- 🐛 Signaler des bugs
- 💡 Proposer des améliorations
- 📖 Améliorer la documentation

## 📞 Support

Pour toute question ou problème :
1. Consultez la [documentation CONFIG.md](CONFIG.md)
2. Vérifiez les logs GitHub Actions
3. Ouvrez une issue sur le repository
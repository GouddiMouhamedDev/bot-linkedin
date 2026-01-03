# LinkedIn Post Generator v2.0 🤖

**Générateur automatique de posts LinkedIn avec Gemini AI - Optimisé pour n8n**

## 🎯 Fonctionnalités

- ✅ **Génération automatique** : Posts LinkedIn quotidiens via GitHub Actions (9h UTC)
- ✅ **IA powered** : Utilise Google Gemini AI pour un contenu de qualité
- ✅ **Format n8n** : Sortie JSON structurée pour l'automatisation n8n
- ✅ **Sans maintenance** : Solution complètement autonome
- ✅ **Français** : Contenu entièrement en français

## 🚀 Démarrage rapide

### 1. Configuration

Créez un fichier `.env` :
```bash
GEMINI_API_KEY=votre_cle_api_gemini_ici
```

### 2. Installation locale
```bash
npm install
```

### 3. Test
```bash
npm run generate
```

### 4. Configuration GitHub

Dans votre repository GitHub :
1. **Settings** → **Secrets and variables** → **Actions**
2. Ajouter le secret : `GEMINI_API_KEY`
3. Activer **GitHub Actions**

## 📄 Sortie JSON pour n8n

Le système génère un fichier `linkedin-post-for-n8n.json` avec cette structure :

```json
{
  "metadata": {
    "generated_at": "2026-01-03T22:00:00.000Z",
    "generator_version": "2.0.0",
    "status": "ready_for_publication"
  },
  "post": {
    "topic": "Développement professionnel",
    "content": "Contenu du post LinkedIn...",
    "hashtags": ["#Professionnel", "#Développement"],
    "length": 1450
  },
  "instructions": {
    "publication_platform": "LinkedIn",
    "next_steps": [
      "Vérifier le contenu",
      "Personnaliser si nécessaire",
      "Publier via n8n"
    ]
  }
}
```

## ⏰ Automatisation

- **GitHub Actions** : Exécution quotidienne à 9h UTC (10h France)
- **Manual trigger** : Possibilité de déclenchement manuel
- **Auto-commit** : Sauvegarde automatique des données

## 📁 Structure du projet

```
├── index.js              # Point d'entrée principal
├── lib/generator.js      # Générateur IA
├── data.json            # Configuration & historique
├── CONFIG.md            # Guide de configuration
├── .env.example         # Template variables
└── .github/workflows/
    └── main.yml         # Workflow GitHub Actions
```

## 🔧 Personnalisation

Modifiez `data.json` pour :
- Ajouter vos sujets de posts
- Ajuster la longueur (1300-1500 caractères)
- Personnaliser le ton (professionnel)

## 📞 Support

Consultez `CONFIG.md` pour la documentation complète et le dépannage.

---

**Prêt pour la production ! 🚀**
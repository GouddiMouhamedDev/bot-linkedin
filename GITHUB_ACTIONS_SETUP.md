# Configuration GitHub Actions - Publication automatique LinkedIn

## 🎯 Objectif
Configurer le système pour publication automatique sur LinkedIn via GitHub Actions.

## 📋 Étapes de configuration

### 1. Configuration des secrets GitHub

Allez dans votre repository GitHub :
1. **Settings** → **Secrets and variables** → **Actions**
2. Cliquez **"New repository secret"** et ajoutez :

#### Secrets requis :
```
GEMINI_API_KEY=AIzaSyDlS-c23FTNsNsZa2Z1D4B4IvPjY6_PtEM
LINKEDIN_EMAIL=toonmouhamed@gmail.com
LINKEDIN_PASSWORD=168next@168
LINKEDIN_COOKIES=[{...vos cookies LinkedIn ici...}]
```

#### Variables d'environnement (optionnel) :
```
CHROME_PATH=/usr/bin/google-chrome-stable
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
```

### 2. Structure des secrets

#### GEMINI_API_KEY
- Votre clé API Google Gemini AI
- Disponible sur [Google AI Studio](https://makersuite.google.com/app/apikey)

#### LINKEDIN_EMAIL / LINKEDIN_PASSWORD  
- Identifiants LinkedIn (alternative aux cookies)
- ⚠️ **Recommandé** : Utiliser les cookies à la place

#### LINKEDIN_COOKIES
- Cookies LinkedIn au format JSON
- **Méthode recommandée** pour éviter 2FA/captcha
- Format exact :
```json
[
  {
    "domain": ".linkedin.com",
    "name": "li_at",
    "value": "AQ...",
    "secure": true,
    "httpOnly": true
  }
]
```

### 3. Comment obtenir vos cookies LinkedIn

#### Méthode 1 : Extension navigateur
1. Installez [Get cookies.txt](https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndolbocbmafdlcgbefjdmnhfkc) sur Chrome
2. Connectez-vous sur LinkedIn.com
3. Cliquez sur l'extension → "Export"
4. Copiez les cookies de linkedin.com

#### Méthode 2 : Developer Tools
1. Ouvrez LinkedIn.com et connectez-vous
2. F12 → Application/Storage → Cookies → linkedin.com
3. Copiez tous les cookies avec leurs valeurs
4. Formatez en JSON

### 4. Vérification du workflow

Le workflow `.github/workflows/main.yml` est configuré pour :
- ✅ Installer Chrome automatiquement
- ✅ Configurer Puppeteer avec les bons arguments
- ✅ Utiliser les variables d'environnement
- ✅ Générer et publier automatiquement

### 5. Test et utilisation

#### Test manuel :
```bash
# Dans GitHub Actions, déclenchez manuellement le workflow
```

#### Test automatique :
- Le workflow s'exécute quotidiennement à 9h UTC
- Modification du code dans main/ trigger automatiquement

### 6. Logs et debugging

#### En cas de problème :
1. **GitHub Actions** → **Workflow runs** → Cliquez sur l'exécution
2. Consultez les logs détaillés
3. Vérifiez les erreurs Puppeteer/Chrome

#### Erreurs communes :
- `Chrome not found` → Chrome pas installé correctement
- `2FA Required` → Cookies expirés, utilisez nouveaux cookies
- `Network Error` → Problème LinkedIn, réessayez plus tard

### 7. Optimisations

#### Performance :
- Le workflow est optimisé pour GitHub Actions Ubuntu
- Chrome stable préinstallé
- Args Puppeteer optimisés pour CI/CD

#### Sécurité :
- Secrets chiffrés et sécurisés
- Cookies au lieu de mots de passe
- Variables d'environnement locales non exposées

### 8. Résultats attendus

#### ✅ Succès :
```
Starting LinkedIn post generation...
Selected topic: [topic]
Generating post for topic: [topic]
Post generated successfully!
Post content length: XXXX characters
Reading generated post...
Launching browser...
Login successful - reached LinkedIn home
Post published successfully!
LinkedIn posting completed successfully!
```

#### ❌ Échec :
- Vérifiez les secrets GitHub
- Consultez les logs détaillés
- Testez localement d'abord avec `npm run generate-only`

## 🎉 Résultat final

Une fois configuré, votre bot LinkedIn fonctionnera automatiquement :
- **Génération IA** : Posts professionnels avec Gemini AI
- **Publication automatique** : Post sur LinkedIn sans intervention
- **Historique** : Évite les doublons de sujets
- **Planification** : Exécution quotidienne programmée

## 📞 Support

Si problèmes :
1. Consultez `SOLUTIONS.md` pour alternatives
2. Testez avec `npm run generate-only` localement
3. Vérifiez les logs GitHub Actions
4. Mettez à jour les cookies si expirés
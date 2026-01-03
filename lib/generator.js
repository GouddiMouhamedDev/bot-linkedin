/**
 * LinkedIn Post Generator - Version Tech Optimisée
 */

const fs = require('fs').promises;
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class LinkedInPostGenerator {
    constructor() {
        this.dataPath = path.join(__dirname, '..', 'data.json');
        
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('❌ GEMINI_API_KEY manquante');
        }
        
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Utilisation de gemini-1.5-flash : plus rapide, meilleur quota gratuit
        this.model = this.genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash" 
        });
        
        this.config = {
            minLength: 1000,
            maxLength: 1800,
            tone: 'expert mais accessible',
            maxHashtags: 4
        };
    }

    // Système de pause pour éviter l'erreur 429 (Rate Limit)
    sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    generatePrompt(topic) {
        return `
En tant qu'expert Développeur Fullstack (React, Next.js, Node.js, Tailwind CSS), écris un post LinkedIn sur : "${topic}".

STRUCTURE :
1. ACCROCHE : Une phrase courte et percutante pour stopper le scroll (problème de dev ou opinion tranchée).
2. CORPS : Utilise des listes à puces. Donne de la valeur technique réelle (pas de généralités). 
3. STORYTELLING : Si possible, commence par "J'ai testé..." ou "L'autre jour, en codant...".
4. CONCLUSION : Un Call-to-Action avec une question pour les autres dev.

CONTRAINTES :
- Langue : Français
- Style : Professionnel, direct, sans gras inutile.
- Longueur : Environ ${this.config.minLength} caractères.
- Hashtags : 3-4 maximum à la fin.
`;
    }

    async generatePost(topic, retryCount = 0) {
        const prompt = this.generatePrompt(topic);
        
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const content = response.text().trim();
            
            return {
                topic,
                content,
                generated_at: new Date().toISOString()
            };
            
        } catch (error) {
            // Gestion du Quota (Error 429)
            if (error.message.includes('429') && retryCount < 3) {
                console.log(`⚠️ Quota atteint. Pause de 60s avant tentative ${retryCount + 1}...`);
                await this.sleep(60000); 
                return this.generatePost(topic, retryCount + 1);
            }
            throw error;
        }
    }

    /**
     * Charge les données de configuration et l'historique
     */
    async loadData() {
        try {
            const data = await fs.readFile(this.dataPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.log('⚠️ Impossible de charger data.json, utilisation des paramètres par défaut');
            return this.getDefaultData();
        }
    }

    /**
     * Données par défaut si data.json n'existe pas
     */
    getDefaultData() {
        return {
            topics: [
                "Développement professionnel et conseils de carrière",
                "Technologies émergentes et tendances du secteur",
                "Leadership et gestion d'équipe",
                "Innovation et entrepreneurship",
                "Productivité et équilibre vie pro/perso",
                "Apprentissage et développement de compétences",
                "Stratégie d'entreprise et croissance",
                "Retour d'expérience personnel et leçons apprises"
            ],
            history: [],
            settings: {
                maxHistoryLength: 30,
                postLength: { min: 1000, max: 1800 },
                tone: 'expert mais accessible',
                includeHashtags: true,
                maxHashtags: 4
            }
        };
    }

    /**
     * Sélectionne un sujet aléatoire qui n'a pas été utilisé récemment
     */
    selectRandomTopic(data) {
        const availableTopics = data.topics.filter(topic => 
            !data.history.some(h => h.topic === topic)
        );
        
        // Si tous les sujets ont été utilisés, réinitialiser l'historique
        if (availableTopics.length === 0) {
            console.log('🔄 Tous les sujets ont été utilisés, réinitialisation de l\'historique...');
            data.history = [];
            return data.topics[Math.floor(Math.random() * data.topics.length)];
        }
        
        return availableTopics[Math.floor(Math.random() * availableTopics.length)];
    }

    /**
     * Extrait les hashtags d'un texte
     */
    extractHashtags(text) {
        const hashtagRegex = /#[a-zA-Z0-9_À-ÿ]+/g;
        const matches = text.match(hashtagRegex) || [];
        return matches.slice(0, this.config.maxHashtags);
    }

    /**
     * Met à jour l'historique
     */
    async updateHistory(data, postData) {
        const historyEntry = {
            topic: postData.topic,
            content: postData.content,
            hashtags: this.extractHashtags(postData.content),
            timestamp: postData.generated_at,
            length: postData.content.length
        };

        data.history.push(historyEntry);

        // Limiter la taille de l'historique
        const maxHistory = data.settings?.maxHistoryLength || 30;
        if (data.history.length > maxHistory) {
            data.history = data.history.slice(-maxHistory);
        }

        // Sauvegarder les données mises à jour
        await this.saveData(data);
        
        return data;
    }

    /**
     * Sauvegarde les données
     */
    async saveData(data) {
        try {
            await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde des données:', error);
            throw error;
        }
    }

    /**
     * Méthode principale de génération
     */
    async generate() {
        try {
            console.log('🚀 Début de la génération du post LinkedIn...');
            
            // Charger les données existantes
            let data = await this.loadData();
            
            // Sélectionner un sujet
            const topic = this.selectRandomTopic(data);
            console.log(`📋 Sujet sélectionné : ${topic}`);
            
            // Générer le post
            const postData = await this.generatePost(topic);
            
            // Mettre à jour l'historique
            await this.updateHistory(data, postData);
            
            console.log('✅ Post généré avec succès !');
            
            return {
                topic: postData.topic,
                content: postData.content,
                hashtags: this.extractHashtags(postData.content),
                length: postData.content.length,
                generated_at: postData.generated_at
            };
            
        } catch (error) {
            console.error('❌ Erreur dans generate():', error);
            throw error;
        }
    }
}

module.exports = { LinkedInPostGenerator };
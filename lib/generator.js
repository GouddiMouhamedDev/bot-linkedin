/**
 * LinkedIn Post Generator - Générateur simplifié avec Gemini AI
 * Version 2.0 - Refactorisé pour n8n
 */

const fs = require('fs').promises;
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class LinkedInPostGenerator {
    constructor() {
        this.dataPath = path.join(__dirname, '..', 'data.json');
        
        // Vérification de la clé API
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('❌ GEMINI_API_KEY est requise dans les variables d\'environnement');
        }
        
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ 
            model: "gemini-pro" 
        });
        
        // Configuration par défaut
        this.config = {
            minLength: 1300,
            maxLength: 1500,
            maxHashtags: 5,
            tone: 'professionnel',
            includeCallToAction: true
        };
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
                postLength: { min: 1300, max: 1500 },
                tone: 'professionnel',
                includeHashtags: true,
                maxHashtags: 5
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
     * Génère le prompt pour Gemini AI
     */
    generatePrompt(topic) {
        return `
Crée un post LinkedIn engageant et professionnel sur le sujet : "${topic}"

Spécifications :
- Longueur : ${this.config.minLength}-${this.config.maxLength} caractères
- Ton : ${this.config.tone}
- Structure : Accroche + Contenu principal + Appel à l'action
- Inclure des hashtags pertinents (maximum ${this.config.maxHashtags})
- Langue : Français

Exigences de qualité :
- Contenu original et engageant
- Insights actionables
- Éléments de storytelling si pertinents
- Terminer par une question pour encourager l'engagement
- Hashtags en français et anglais si approprié

Génère un post LinkedIn complet qui performe bien sur la plateforme.`;
    }

    /**
     * Génère un post via Gemini AI
     */
    async generatePost(topic) {
        const prompt = this.generatePrompt(topic);
        
        try {
            console.log(`🤖 Génération du post pour le sujet : "${topic}"`);
            console.log(`🔑 Modèle utilisé : gemini-pro`);
            
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const content = response.text().trim();
            
            // Vérifier que le contenu n'est pas vide
            if (!content || content.length < 100) {
                throw new Error('Contenu généré trop court ou vide');
            }
            
            // Extraction des hashtags
            const hashtags = this.extractHashtags(content);
            
            return {
                topic: topic,
                content: content,
                hashtags: hashtags,
                length: content.length,
                generated_at: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('❌ Erreur lors de la génération avec Gemini:', error.message);
            
            // Gestion spécifique des erreurs de modèle
            if (error.message.includes('404 Not Found') || error.message.includes('models/')) {
                throw new Error(`Modèle Gemini invalide ou indisponible. Vérifiez la configuration de l'API.`);
            }
            
            throw new Error(`Échec de la génération du post: ${error.message}`);
        }
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
            hashtags: postData.hashtags,
            timestamp: postData.generated_at,
            length: postData.length
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
            
            return postData;
            
        } catch (error) {
            console.error('❌ Erreur dans generate():', error);
            throw error;
        }
    }
}

module.exports = { LinkedInPostGenerator };
#!/usr/bin/env node

/**
 * LinkedIn Post Generator
 * Générateur automatique de posts LinkedIn avec Gemini AI
 * Sauvegarde le résultat dans un fichier JSON structuré pour n8n
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { LinkedInPostGenerator } = require('./lib/generator');

const OUTPUT_FILE = 'linkedin-post-for-n8n.json';

async function main() {
    try {
        console.log('🚀 LinkedIn Post Generator - Démarrage...');
        
        // Initialisation du générateur
        const generator = new LinkedInPostGenerator();
        
        // Génération du post
        const postData = await generator.generate();
        
        // Sauvegarde pour n8n
        const n8nData = {
            metadata: {
                generated_at: new Date().toISOString(),
                generator_version: '2.0.0',
                timezone: 'UTC',
                status: 'ready_for_publication'
            },
            post: postData,
            instructions: {
                publication_platform: 'LinkedIn',
                next_steps: [
                    '1. Vérifier le contenu du post',
                    '2. Personnaliser si nécessaire',
                    '3. Publier via n8n ou interface LinkedIn'
                ]
            }
        };

        // Écriture du fichier de sortie
        await fs.writeFile(OUTPUT_FILE, JSON.stringify(n8nData, null, 2));
        
        console.log('✅ Post généré avec succès !');
        console.log(`📄 Fichier de sortie: ${OUTPUT_FILE}`);
        console.log(`📊 Longueur: ${postData.content.length} caractères`);
        console.log(`🏷️ Hashtags: ${postData.hashtags.length}`);
        console.log(`📅 Sujet: ${postData.topic}`);
        
        // Affichage du post généré
        console.log('\n--- POST GÉNÉRÉ ---');
        console.log(postData.content);
        console.log('--- FIN DU POST ---\n');
        
    } catch (error) {
        console.error('❌ Erreur lors de la génération:', error.message);
        
        // Sauvegarde de l'erreur pour n8n
        const errorData = {
            metadata: {
                generated_at: new Date().toISOString(),
                status: 'error',
                error_message: error.message
            },
            error: true
        };
        
        await fs.writeFile(OUTPUT_FILE, JSON.stringify(errorData, null, 2));
        process.exit(1);
    }
}

// Exécution si appelé directement
if (require.main === module) {
    main();
}

module.exports = { LinkedInPostGenerator };
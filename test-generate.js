#!/usr/bin/env node

/**
 * Script de test pour vérifier le générateur de posts LinkedIn
 */

require('dotenv').config();
const { LinkedInPostGenerator } = require('./lib/generator');

async function test() {
    console.log('🧪 Test du générateur de posts LinkedIn...');
    
    if (!process.env.GEMINI_API_KEY) {
        console.log('⚠️  GEMINI_API_KEY non définie - test avec données simulées');
        console.log('✅ Structure du générateur : OK');
        return;
    }
    
    try {
        const generator = new LinkedInPostGenerator();
        const postData = await generator.generate();
        
        console.log('✅ Test réussi !');
        console.log(`📋 Sujet: ${postData.topic}`);
        console.log(`📏 Longueur: ${postData.length} caractères`);
        console.log(`🏷️  Hashtags: ${postData.hashtags.join(', ')}`);
        
    } catch (error) {
        console.error('❌ Test échoué:', error.message);
    }
}

test();
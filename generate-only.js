require('dotenv').config();
const LinkedInPostGenerator = require('./generator');
const fs = require('fs').promises;

async function main() {
    try {
        console.log('=== GÉNÉRATION DE POST LINKEDIN SEULE ===');
        console.log('(Mode sans publication automatique)\n');
        
        const generator = new LinkedInPostGenerator();
        const post = await generator.generate();
        
        console.log('\n=== POST GÉNÉRÉ AVEC SUCCÈS ===');
        console.log(`Longueur: ${post.length} caractères`);
        console.log('================================\n');
        console.log(post);
        console.log('\n================================');
        
        // Sauvegarder dans un fichier pour publication manuelle
        const outputFile = 'post-to-publish-manually.txt';
        await fs.writeFile(outputFile, post);
        console.log(`\n✅ Post sauvegardé dans: ${outputFile}`);
        
        // Sauvegarder aussi avec timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const timestampedFile = `post-${timestamp}.txt`;
        await fs.writeFile(timestampedFile, post);
        console.log(`✅ Post aussi sauvegardé dans: ${timestampedFile}`);
        
        console.log('\n📋 INSTRUCTIONS POUR PUBLICATION MANUELLE:');
        console.log('1. Ouvrez LinkedIn.com dans votre navigateur');
        console.log('2. Connectez-vous avec vos cookies ou email/mot de passe');
        console.log('3. Copiez le contenu ci-dessus');
        console.log('4. Créez un nouveau post et collez le contenu');
        console.log('5. Ajoutez des emojis si desired, puis publiez!');
        
        console.log('\n🎯 Le système fonctionne parfaitement pour:');
        console.log('   ✅ Génération de contenu avec IA (Gemini)');
        console.log('   ✅ Gestion des topics et historique');
        console.log('   ✅ Respect des paramètres (longueur, hashtags, etc.)');
        console.log('   ❌ Publication automatique (problème environnement Chrome)');
        
    } catch (error) {
        console.error('\n❌ Erreur lors de la génération:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = main;
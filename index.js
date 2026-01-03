require('dotenv').config();
const fs = require('fs');
const path = require('path');
const LinkedInPostGenerator = require("./lib/generator");

const DATA_PATH = path.join(__dirname, 'data.json');

async function main() {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

    // On extrait les titres déjà traités pour filtrer
    const usedTitles = data.history.map(entry => entry.topic);
    const availableTopics = data.topics.filter(t => !usedTitles.includes(t));

    if (availableTopics.length === 0) {
        console.log("❌ Plus de sujets vierges.");
        return;
    }

    try {
        const generator = new LinkedInPostGenerator(process.env.GEMINI_API_KEY);

        // L'IA génère l'objet { topic, content }
        const generatedEntry = await generator.chooseAndGenerate(availableTopics, data.history, data.settings);

        console.log(`✅ Sujet choisi : ${generatedEntry.topic}`);
        console.log("\n--- CONTENU ---\n", generatedEntry.content);

        // SAUVEGARDE DE LA RÉPONSE COMPLÈTE DANS L'HISTORIQUE
        data.history.push({
            topic: generatedEntry.topic,
            content: generatedEntry.content,
            date: new Date().toISOString()
        });

        // Limite de l'historique
        if (data.history.length > data.settings.maxHistoryLength) data.history.shift();

        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
        console.log("\n💾 Historique complet mis à jour dans data.json");

    } catch (error) {
        console.error("❌ Erreur :", error.message);
        process.exit(1);
    }
}

main();
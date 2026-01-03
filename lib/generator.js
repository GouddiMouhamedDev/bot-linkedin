const { GoogleGenerativeAI } = require("@google/generative-ai");

class LinkedInPostGenerator {
    constructor(apiKey) {
        if (!apiKey) throw new Error("Clé API manquante.");
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.modelPriority = ["gemini-3-flash", "gemini-2.5-flash", "gemini-1.5-flash"];
    }

    async chooseAndGenerate(availableTopics, history, settings) {
        let lastError = null;

        for (const modelName of this.modelPriority) {
            try {
                const model = this.genAI.getGenerativeModel({ model: modelName }, { apiVersion: "v1" });

                const prompt = `
                    Tu es un expert Tech. Voici les sujets disponibles : [${availableTopics.join(", ")}].
                    Voici tes précédentes publications pour éviter les répétitions : ${JSON.stringify(history.slice(-3))}

                    MISSION :
                    1. Choisis un sujet.
                    2. Génère un post LinkedIn unique.

                    CONTRAINTES :
                    - Ton : ${settings.tone}.
                    - Longueur : ${settings.postLength.min} à ${settings.postLength.max} caractères.
                    - Hashtags : ${settings.maxHashtags} max.

                    FORMAT DE RÉPONSE :
                    Ta réponse doit IMPÉRATIVEMENT être un objet JSON brut avec cette structure :
                    {
                        "topic": "Le titre du sujet choisi",
                        "content": "Le texte complet du post"
                    }
                `;

                const result = await model.generateContent(prompt);
                const responseText = result.response.text().replace(/```json|```/g, "").trim();
                return JSON.parse(responseText);

            } catch (error) {
                lastError = error;
                continue;
            }
        }
        throw new Error(`Échec : ${lastError.message}`);
    }
}

module.exports = LinkedInPostGenerator;
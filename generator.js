const fs = require('fs').promises;
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class LinkedInPostGenerator {
    constructor() {
        this.dataPath = path.join(__dirname, 'data.json');
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    async loadData() {
        try {
            const data = await fs.readFile(this.dataPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    async saveData(data) {
        try {
            await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error saving data:', error);
            throw error;
        }
    }

    selectRandomTopic(data) {
        const availableTopics = data.topics.filter(topic => 
            !data.history.some(h => h.topic === topic)
        );
        
        // If all topics have been used, reset history
        if (availableTopics.length === 0) {
            console.log('All topics used, resetting history...');
            data.history = [];
            return data.topics[Math.floor(Math.random() * data.topics.length)];
        }
        
        return availableTopics[Math.floor(Math.random() * availableTopics.length)];
    }

    generatePrompt(topic, history, data) {
        const settings = {
            length: data.settings?.postLength || { min: 1300, max: 1500 },
            tone: data.settings?.tone || 'professional',
            includeHashtags: data.settings?.includeHashtags !== false,
            maxHashtags: data.settings?.maxHashtags || 5
        };

        return `Create a LinkedIn post about "${topic}" with the following specifications:

Requirements:
- Length: ${settings.length.min}-${settings.length.max} characters
- Tone: ${settings.tone}
- Structure: Hook + Main content + Call to action
- Include relevant hashtags (max ${settings.maxHashtags})

Additional context:
- Make it engaging and professional
- Include actionable insights
- Use storytelling elements where appropriate
- End with a question or call to engagement

Please generate a complete LinkedIn post that would perform well on the platform.`;
    }

    async generatePost(topic, history) {
        const prompt = this.generatePrompt(topic, history);
        
        try {
            console.log(`Generating post for topic: ${topic}`);
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const post = response.text().trim();
            
            return post;
        } catch (error) {
            console.error('Error generating post with Gemini:', error);
            throw error;
        }
    }

    async updateHistory(data, topic, post) {
        const historyEntry = {
            topic: topic,
            post: post,
            timestamp: new Date().toISOString(),
            length: post.length,
            hashtags: this.extractHashtags(post)
        };

        data.history.push(historyEntry);

        // Keep history within limits
        if (data.history.length > (data.settings?.maxHistoryLength || 50)) {
            data.history = data.history.slice(-50);
        }

        return data;
    }

    extractHashtags(text) {
        const hashtagRegex = /#[a-zA-Z0-9_]+/g;
        return text.match(hashtagRegex) || [];
    }

    async generate() {
        try {
            console.log('Starting LinkedIn post generation...');
            
            // Load existing data
            let data = await this.loadData();
            
            // Select topic
            const topic = this.selectRandomTopic(data);
            console.log(`Selected topic: ${topic}`);
            
            // Generate post using Gemini
            const post = await this.generatePost(topic, data.history, data);
            
            // Update history
            data = await this.updateHistory(data, topic, post);
            
            // Save updated data
            await this.saveData(data);
            
            console.log('Post generated successfully!');
            console.log(`Post length: ${post.length} characters`);
            console.log('\n--- Generated Post ---');
            console.log(post);
            console.log('--- End of Post ---\n');
            
            return post;
            
        } catch (error) {
            console.error('Error in generate():', error);
            throw error;
        }
    }
}

// Main execution
async function main() {
    try {
        // Check for API key
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY environment variable is required');
        }

        const generator = new LinkedInPostGenerator();
        const post = await generator.generate();
        
        // Write post to output file for the poster script
        await fs.writeFile('generated-post.txt', post);
        console.log('Post saved to generated-post.txt');
        
    } catch (error) {
        console.error('Failed to generate post:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = LinkedInPostGenerator;
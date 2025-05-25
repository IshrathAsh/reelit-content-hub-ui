const { OpenAI } = require('openai');
const fs = require('fs').promises;
const path = require('path');

class ContentGenerator {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async generateContent(transcription) {
        try {
            const prompt = `Based on the following video transcription, generate engaging social media content:\n\n${transcription}\n\nGenerate:\n1. A catchy title\n2. A brief description\n3. 3-5 relevant hashtags\n4. A call to action`;

            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a social media content creator who specializes in creating engaging content from video transcriptions."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            });

            return {
                success: true,
                content: completion.choices[0].message.content
            };
        } catch (error) {
            console.error('Error generating content:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new ContentGenerator(); 
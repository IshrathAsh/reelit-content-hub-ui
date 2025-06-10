import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

class ContentGenerator {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async generateContent(transcription) {
        try {
            console.log('\n=== Content Generation Details ===');
            console.log('📝 Transcription length:', transcription.length);
            
            const prompt = `Analyze this video transcription and generate engaging social media content:

${transcription}

Please provide a detailed analysis including:
1. Main Topic Analysis
2. Key Points Summary
3. Content Structure (title, description, key takeaways, call to action)
4. Social Media Optimization (hashtags, platform recommendations, optimal posting time)
5. Engagement Strategy (suggested questions, engagement hooks, content repurposing ideas)

Format the response in clear sections with actionable items.`;

            console.log('🤖 Sending request to OpenAI...');
            const completion = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert social media content strategist and analyst. Your task is to analyze video content and generate engaging social media content with detailed recommendations."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            });

            console.log('✅ OpenAI response received');
            const content = completion.choices[0].message.content;
            console.log('📊 Content sections found:', this.parseContentIntoSections(content));

            return {
                success: true,
                content: this.parseContentIntoSections(content)
            };
        } catch (error) {
            console.error('❌ Content generation error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    parseContentIntoSections(content) {
        try {
            console.log('\n=== Parsing Content Sections ===');
            const sections = {
                mainTopic: this.extractSection(content, 'Main Topic Analysis'),
                keyPoints: this.extractSection(content, 'Key Points Summary'),
                contentStructure: this.extractSection(content, 'Content Structure'),
                socialMediaOptimization: this.extractSection(content, 'Social Media Optimization'),
                engagementStrategy: this.extractSection(content, 'Engagement Strategy')
            };

            console.log('📋 Sections parsed:', Object.keys(sections).map(key => ({
                section: key,
                hasContent: sections[key] ? '✅' : '❌'
            })));

            return sections;
        } catch (error) {
            console.error('❌ Error parsing content sections:', error);
            throw error;
        }
    }

    extractSection(content, sectionName) {
        try {
            const regex = new RegExp(`${sectionName}[\\s\\S]*?(?=\\n\\d\\.|$)`);
            const match = content.match(regex);
            return match ? match[0].replace(sectionName, '').trim() : null;
        } catch (error) {
            console.error(`❌ Error extracting section ${sectionName}:`, error);
            return null;
        }
    }
}

export default ContentGenerator; 
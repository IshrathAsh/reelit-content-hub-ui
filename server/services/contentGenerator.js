import { OpenAI } from 'openai';
import fs from 'fs/promises';
import path from 'path';

class ContentGenerator {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async generateContent(transcription) {
        try {
            const prompt = `Analyze the following video transcription and generate social media content:\n\n${transcription}\n\nPlease provide:\n1. A catchy caption (1-2 sentences)\n2. 5-7 relevant hashtags\n3. A detailed description (2-3 sentences)`;

            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert social media content strategist. Create engaging, platform-optimized content that captures attention and drives engagement."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            });

            // Parse the response into sections
            const content = completion.choices[0].message.content;
            const sections = content.split('\n\n');
            
            const structuredContent = {
                caption: '',
                hashtags: [],
                description: ''
            };

            sections.forEach(section => {
                if (section.includes('Caption:')) {
                    structuredContent.caption = section.split('Caption:')[1]?.trim() || '';
                } else if (section.includes('Hashtags:')) {
                    const hashtags = section.split('Hashtags:')[1]?.trim() || '';
                    structuredContent.hashtags = hashtags.split(' ')
                        .filter(tag => tag.trim())
                        .map(tag => tag.startsWith('#') ? tag : `#${tag}`);
                } else if (section.includes('Description:')) {
                    structuredContent.description = section.split('Description:')[1]?.trim() || '';
                }
            });

            return {
                success: true,
                content: structuredContent
            };
        } catch (error) {
            console.error('Error generating content:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    parseContentIntoSections(content) {
        try {
            // Split content into sections
            const sections = content.split('\n\n');
            const structuredContent = {
                mainTopic: '',
                keyPoints: [],
                contentStructure: {
                    title: '',
                    description: '',
                    keyTakeaways: [],
                    callToAction: ''
                },
                socialMediaOptimization: {
                    hashtags: [],
                    platformRecommendations: [],
                    optimalPostingTime: ''
                },
                engagementStrategy: {
                    suggestedQuestions: [],
                    engagementHooks: [],
                    repurposingIdeas: []
                }
            };

            let currentSection = '';
            sections.forEach(section => {
                if (section.includes('Main Topic Analysis')) {
                    currentSection = 'mainTopic';
                    structuredContent.mainTopic = section.split('Main Topic Analysis:')[1]?.trim() || '';
                } else if (section.includes('Key Points Summary')) {
                    currentSection = 'keyPoints';
                    const points = section.split('Key Points Summary:')[1]?.trim() || '';
                    structuredContent.keyPoints = points.split('\n').filter(point => point.trim());
                } else if (section.includes('Content Structure')) {
                    currentSection = 'contentStructure';
                    const contentParts = section.split('\n');
                    contentParts.forEach(part => {
                        if (part.includes('Title:')) {
                            structuredContent.contentStructure.title = part.split('Title:')[1]?.trim() || '';
                        } else if (part.includes('Description:')) {
                            structuredContent.contentStructure.description = part.split('Description:')[1]?.trim() || '';
                        } else if (part.includes('Key Takeaways:')) {
                            const takeaways = part.split('Key Takeaways:')[1]?.trim() || '';
                            structuredContent.contentStructure.keyTakeaways = takeaways.split('\n').filter(takeaway => takeaway.trim());
                        } else if (part.includes('Call to Action:')) {
                            structuredContent.contentStructure.callToAction = part.split('Call to Action:')[1]?.trim() || '';
                        }
                    });
                } else if (section.includes('Social Media Optimization')) {
                    currentSection = 'socialMediaOptimization';
                    const optimizationParts = section.split('\n');
                    optimizationParts.forEach(part => {
                        if (part.includes('Hashtags:')) {
                            const hashtags = part.split('Hashtags:')[1]?.trim() || '';
                            structuredContent.socialMediaOptimization.hashtags = hashtags.split(' ').filter(tag => tag.trim());
                        } else if (part.includes('Platform Recommendations:')) {
                            const platforms = part.split('Platform Recommendations:')[1]?.trim() || '';
                            structuredContent.socialMediaOptimization.platformRecommendations = platforms.split('\n').filter(platform => platform.trim());
                        } else if (part.includes('Optimal Posting Time:')) {
                            structuredContent.socialMediaOptimization.optimalPostingTime = part.split('Optimal Posting Time:')[1]?.trim() || '';
                        }
                    });
                } else if (section.includes('Engagement Strategy')) {
                    currentSection = 'engagementStrategy';
                    const strategyParts = section.split('\n');
                    strategyParts.forEach(part => {
                        if (part.includes('Suggested Questions:')) {
                            const questions = part.split('Suggested Questions:')[1]?.trim() || '';
                            structuredContent.engagementStrategy.suggestedQuestions = questions.split('\n').filter(question => question.trim());
                        } else if (part.includes('Engagement Hooks:')) {
                            const hooks = part.split('Engagement Hooks:')[1]?.trim() || '';
                            structuredContent.engagementStrategy.engagementHooks = hooks.split('\n').filter(hook => hook.trim());
                        } else if (part.includes('Repurposing Ideas:')) {
                            const ideas = part.split('Repurposing Ideas:')[1]?.trim() || '';
                            structuredContent.engagementStrategy.repurposingIdeas = ideas.split('\n').filter(idea => idea.trim());
                        }
                    });
                }
            });

            return structuredContent;
        } catch (error) {
            console.error('Error parsing content:', error);
            return {
                error: 'Failed to parse content structure',
                rawContent: content
            };
        }
    }
}

export default new ContentGenerator(); 
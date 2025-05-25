import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Content generation functions
export const generateCaption = async (transcript: string, customPrompt: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a social media expert. Create engaging captions for short-form videos."
        },
        {
          role: "user",
          content: `Generate a caption for this video transcript: ${transcript}\nCustom instructions: ${customPrompt}`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating caption:', error);
    throw new Error('Failed to generate caption');
  }
};

export const generateHashtags = async (transcript: string, customPrompt: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Generate relevant hashtags for social media content. Return only the hashtags, separated by spaces."
        },
        {
          role: "user",
          content: `Generate hashtags for this content: ${transcript}\nCustom instructions: ${customPrompt}`
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    const hashtags = response.choices[0].message.content
      ?.split(' ')
      .filter(tag => tag.startsWith('#'))
      .slice(0, 10); // Limit to 10 hashtags

    return hashtags || [];
  } catch (error) {
    console.error('Error generating hashtags:', error);
    throw new Error('Failed to generate hashtags');
  }
};

export const generateDescription = async (transcript: string, customPrompt: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Create engaging video descriptions for social media platforms."
        },
        {
          role: "user",
          content: `Generate a description for this video: ${transcript}\nCustom instructions: ${customPrompt}`
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating description:', error);
    throw new Error('Failed to generate description');
  }
};

export default openai; 
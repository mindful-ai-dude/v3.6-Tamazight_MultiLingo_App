import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'your-api-key-here';
const genAI = new GoogleGenerativeAI(API_KEY);

// Language mappings for better context
const LANGUAGE_NAMES = {
  tamazight: 'Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ) - Moroccan Berber language',
  arabic: 'Arabic (العربية) - Modern Standard Arabic',
  french: 'French (Français)',
  english: 'English'
};

// Translation service using Gemini API
export class GeminiTranslationService {
  private model;

  constructor() {
    // Use Gemma-3 12B model for high-quality translations
    this.model = genAI.getGenerativeModel({ 
      model: "gemma-3-12b-it",
      generationConfig: {
        temperature: 0.3, // Lower temperature for more consistent translations
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
  }

  /**
   * Translate text between languages using Gemini API
   */
  async translateText(
    text: string, 
    fromLanguage: string, 
    toLanguage: string,
    context?: 'emergency' | 'government' | 'general'
  ): Promise<string> {
    try {
      const fromLangName = LANGUAGE_NAMES[fromLanguage as keyof typeof LANGUAGE_NAMES] || fromLanguage;
      const toLangName = LANGUAGE_NAMES[toLanguage as keyof typeof LANGUAGE_NAMES] || toLanguage;
      
      // Create context-aware prompt
      let contextPrompt = '';
      if (context === 'emergency') {
        contextPrompt = 'This is an emergency/medical translation. Prioritize accuracy and clarity for urgent situations. ';
      } else if (context === 'government') {
        contextPrompt = 'This is an official/government translation. Use formal, official terminology appropriate for legal and administrative contexts. ';
      }

      // Special handling for Tamazight
      let specialInstructions = '';
      if (fromLanguage === 'tamazight' || toLanguage === 'tamazight') {
        specialInstructions = `
Important: Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ) is the indigenous Berber language of Morocco, officially recognized in the 2011 Constitution. 
- Use Tifinagh script (ⵜⵉⴼⵉⵏⴰⵖ) when writing in Tamazight
- Focus on Moroccan Tamazight variants (Tachelhit, Tamazight, Tarifit)
- Preserve cultural context and meaning
- For emergency contexts, ensure translations are immediately understandable to Moroccan Berber speakers
`;
      }

      const prompt = `${contextPrompt}${specialInstructions}

Translate the following text from ${fromLangName} to ${toLangName}:

"${text}"

Provide only the translation without any explanations or additional text. Ensure the translation is:
1. Culturally appropriate for Morocco
2. Accurate and natural-sounding
3. Appropriate for the context (${context || 'general'})
${toLanguage === 'tamazight' ? '4. Written in Tifinagh script when possible' : ''}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const translation = response.text().trim();

      // Clean up the response (remove quotes if present)
      return translation.replace(/^["']|["']$/g, '');
    } catch (error) {
      console.error('Gemini translation error:', error);
      throw new Error('Translation failed. Please check your internet connection and try again.');
    }
  }

  /**
   * Detect the language of input text
   */
  async detectLanguage(text: string): Promise<string> {
    try {
      const prompt = `Detect the language of the following text and respond with only one of these options: "tamazight", "arabic", "french", or "english".

Text: "${text}"

Language:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const detectedLanguage = response.text().trim().toLowerCase();

      // Validate the response
      const validLanguages = ['tamazight', 'arabic', 'french', 'english'];
      if (validLanguages.includes(detectedLanguage)) {
        return detectedLanguage;
      }
      
      // Default fallback
      return 'english';
    } catch (error) {
      console.error('Language detection error:', error);
      return 'english'; // Default fallback
    }
  }

  /**
   * Get translation suggestions for emergency phrases
   */
  async getEmergencyPhrases(targetLanguage: string): Promise<string[]> {
    try {
      const toLangName = LANGUAGE_NAMES[targetLanguage as keyof typeof LANGUAGE_NAMES] || targetLanguage;
      
      const prompt = `Generate 5 essential emergency phrases in ${toLangName} that would be critical for earthquake disaster relief in Morocco. 
      
Focus on phrases that would help Moroccan Berber speakers communicate with rescue workers.
${targetLanguage === 'tamazight' ? 'Use Tifinagh script where possible.' : ''}

Provide only the phrases, one per line, without numbering or explanations:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const phrases = response.text().trim().split('\n').filter(phrase => phrase.trim().length > 0);

      return phrases.slice(0, 5); // Ensure we only return 5 phrases
    } catch (error) {
      console.error('Emergency phrases generation error:', error);
      return []; // Return empty array on error
    }
  }

  /**
   * Check if the API is properly configured
   */
  isConfigured(): boolean {
    return API_KEY !== 'your-api-key-here' && API_KEY.length > 0;
  }
}

// Export a singleton instance
export const geminiService = new GeminiTranslationService();

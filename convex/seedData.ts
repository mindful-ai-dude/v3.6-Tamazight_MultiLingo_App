import { mutation } from "./_generated/server";

// Seed the database with essential emergency phrases and cultural content
export const seedEmergencyPhrases = mutation({
  args: {},
  handler: async (ctx) => {
    // Critical emergency phrases in multiple languages
    const emergencyPhrases = [
      // Medical Emergency - Tamazight
      {
        phrase: "Ɣriɣ tallalt!",
        language: "tamazight",
        category: "medical" as const,
        priority: 10,
        tifinghScript: "ⵖⵔⵉⵖ ⵜⴰⵍⵍⴰⵍⵜ!",
        region: "Atlas",
        isOfficial: true,
      },
      {
        phrase: "I need help!",
        language: "english", 
        category: "medical" as const,
        priority: 10,
        region: "general",
        isOfficial: true,
      },
      {
        phrase: "أحتاج مساعدة!",
        language: "arabic",
        category: "medical" as const, 
        priority: 10,
        region: "general",
        isOfficial: true,
      },
      {
        phrase: "J'ai besoin d'aide!",
        language: "french",
        category: "medical" as const,
        priority: 10, 
        region: "general",
        isOfficial: true,
      },

      // Location/Direction - Tamazight
      {
        phrase: "Manik ara d-tafem?",
        language: "tamazight",
        category: "location" as const,
        priority: 8,
        tifinghScript: "ⵎⴰⵏⵉⴽ ⴰⵔⴰ ⴷ-ⵜⴰⴼⴻⵎ?",
        region: "Rif",
        isOfficial: false,
      },
      {
        phrase: "Where can you find me?",
        language: "english",
        category: "location" as const,
        priority: 8,
        region: "general",
        isOfficial: false,
      },

      // Safety Instructions - Tamazight
      {
        phrase: "Ḥader! Amek!",
        language: "tamazight", 
        category: "safety" as const,
        priority: 9,
        tifinghScript: "ⵃⴰⴷⴻⵔ! ⴰⵎⴻⴽ!",
        region: "Atlas",
        isOfficial: true,
      },
      {
        phrase: "Careful! Stop!",
        language: "english",
        category: "safety" as const,
        priority: 9,
        region: "general", 
        isOfficial: true,
      },

      // Earthquake Specific - Tamazight
      {
        phrase: "Andrar! Ffeɣ-d!",
        language: "tamazight",
        category: "earthquake" as const,
        priority: 10,
        tifinghScript: "ⴰⵏⴷⵔⴰⵔ! ⴼⴼⴻⵖ-ⴷ!",
        region: "Atlas",
        isOfficial: true,
      },
      {
        phrase: "Earthquake! Get out!",
        language: "english",
        category: "earthquake" as const,
        priority: 10,
        region: "general",
        isOfficial: true,
      },

      // Communication - Tamazight
      {
        phrase: "Ur ttiniɣ ara taɛrabt",
        language: "tamazight",
        category: "communication" as const,
        priority: 6,
        tifinghScript: "ⵓⵔ ⵜⵜⵉⵏⵉⵖ ⴰⵔⴰ ⵜⴰⵄⵔⴰⴱⵜ",
        region: "general",
        isOfficial: false,
      },
      {
        phrase: "I don't speak Arabic",
        language: "english",
        category: "communication" as const,
        priority: 6,
        region: "general",
        isOfficial: false,
      },
    ];

    // Insert emergency phrases
    for (const phrase of emergencyPhrases) {
      await ctx.db.insert("emergencyPhrases", {
        ...phrase,
        usageCount: 0,
        lastUsed: Date.now(),
      });
    }

    return { 
      message: "Emergency phrases seeded successfully!",
      count: emergencyPhrases.length 
    };
  },
});

// Seed cultural context data
export const seedCulturalContext = mutation({
  args: {},
  handler: async (ctx) => {
    const culturalData = [
      {
        phrase: "Azul",
        language: "tamazight",
        meaning: "Hello/Peace",
        culturalSignificance: "Traditional Berber greeting meaning 'peace be upon you'",
        region: "Atlas",
        occasion: "Daily greeting, especially important in rural communities",
        category: "greeting" as const,
        contributorId: "system",
        timestamp: Date.now(),
        isVerified: true,
      },
      {
        phrase: "Tanemmirt",
        language: "tamazight", 
        meaning: "Thank you",
        culturalSignificance: "Expression of gratitude deeply rooted in Berber hospitality culture",
        region: "general",
        occasion: "Used to show appreciation and respect",
        category: "traditional" as const,
        contributorId: "system",
        timestamp: Date.now(),
        isVerified: true,
      },
      {
        phrase: "Ar tufat",
        language: "tamazight",
        meaning: "Until we meet again",
        culturalSignificance: "Traditional farewell expressing hope for future reunion",
        region: "Rif",
        occasion: "Parting words, especially for longer separations",
        category: "traditional" as const,
        contributorId: "system", 
        timestamp: Date.now(),
        isVerified: true,
      },
    ];

    for (const item of culturalData) {
      await ctx.db.insert("culturalContext", item);
    }

    return {
      message: "Cultural context seeded successfully!",
      count: culturalData.length
    };
  },
});

// Seed sample translations for testing
export const seedSampleTranslations = mutation({
  args: {},
  handler: async (ctx) => {
    const sampleTranslations = [
      {
        sourceText: "Hello, how are you?",
        sourceLanguage: "english" as const,
        targetLanguage: "tamazight" as const,
        translatedText: "Azul, mamek telliḍ?",
        translationMethod: "gemini" as const,
        context: "general" as const,
        timestamp: Date.now(),
        isVerified: true,
        verificationCount: 3,
        region: "Atlas",
        confidence: 0.95,
        tifinghScript: "ⴰⵣⵓⵍ, ⵎⴰⵎⴻⴽ ⵜⴻⵍⵍⵉⴹ?",
        isEmergency: false,
      },
      {
        sourceText: "Where is the hospital?",
        sourceLanguage: "english" as const,
        targetLanguage: "tamazight" as const,
        translatedText: "Manik ara yili usbiṭar?",
        translationMethod: "tflite" as const,
        context: "emergency" as const,
        timestamp: Date.now(),
        isVerified: true,
        verificationCount: 5,
        region: "general",
        confidence: 0.92,
        tifinghScript: "ⵎⴰⵏⵉⴽ ⴰⵔⴰ ⵢⵉⵍⵉ ⵓⵙⴱⵉⵟⴰⵔ?",
        isEmergency: true,
      },
      {
        sourceText: "Thank you very much",
        sourceLanguage: "english" as const,
        targetLanguage: "tamazight" as const,
        translatedText: "Tanemmirt aṭas",
        translationMethod: "community" as const,
        context: "general" as const,
        timestamp: Date.now(),
        isVerified: true,
        verificationCount: 8,
        region: "Rif",
        confidence: 1.0,
        tifinghScript: "ⵜⴰⵏⴻⵎⵎⵉⵔⵜ ⴰⵟⴰⵙ",
        isEmergency: false,
      },
    ];

    for (const translation of sampleTranslations) {
      await ctx.db.insert("translations", translation);
    }

    return {
      message: "Sample translations seeded successfully!",
      count: sampleTranslations.length
    };
  },
});

// Master seed function to populate all tables
export const seedAllData = mutation({
  args: {},
  handler: async (ctx) => {
    const results = [];
    
    // Seed emergency phrases
    const emergencyResult = await ctx.runMutation("seedData:seedEmergencyPhrases", {});
    results.push(emergencyResult);
    
    // Seed cultural context
    const culturalResult = await ctx.runMutation("seedData:seedCulturalContext", {});
    results.push(culturalResult);
    
    // Seed sample translations
    const translationResult = await ctx.runMutation("seedData:seedSampleTranslations", {});
    results.push(translationResult);
    
    return {
      message: "🚀 All seed data inserted successfully!",
      results,
      totalItems: results.reduce((sum, r) => sum + r.count, 0),
      timestamp: Date.now()
    };
  },
});

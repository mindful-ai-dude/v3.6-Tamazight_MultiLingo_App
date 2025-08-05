/**
 * Dataset Loader Utility
 * 
 * This utility loads the Tamazight evaluation dataset and provides it
 * as a JavaScript object for use in the offline translation service.
 */

// Import the dataset as a static module
// Note: In a real app, this would be loaded from a file or API
export const TAMAZIGHT_DATASET = [
  // English to Tamazight
  { source: "Hello", target: "ⴰⵣⵓⵍ", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Thank you", target: "ⵜⴰⵏⵎⵎⵉⵔⵜ", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Good morning", target: "ⴰⵣⵓⵍ ⵏ ⵜⵓⴼⴰⵜ", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "How are you?", target: "ⵎⴰⵏⵉⵎⴽ ⵜⵍⵍⵉⴷ?", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "I need help", target: "ⵔⵉⵖ ⵜⵉⵡⵉⵙⵉ", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Where is the hospital?", target: "ⵎⴰⵏⵉ ⵉⵍⵍⴰ ⵓⵙⴳⵏⴼ?", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Call the police", target: "ⵙⵙⵉⵡⵍ ⵍⴱⵓⵍⵉⵙ", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Emergency", target: "ⵜⴰⵔⵡⴰ", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Water", target: "ⴰⵎⴰⵏ", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Food", target: "ⵓⵛⵛⵉ", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Doctor", target: "ⴰⵎⵙⴰⵡⴰⵍ", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Medicine", target: "ⴰⵙⴰⴼⴰⵔ", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Family", target: "ⵜⴰⵡⴰⵛⵜ", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Home", target: "ⴰⵅⵅⴰⵎ", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "School", target: "ⵜⴰⵎⴰⵣⵉⵔⵜ", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Work", target: "ⵜⴰⵡⵓⵔⵉ", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Money", target: "ⵉⴷⵔⵉⵎⵏ", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Time", target: "ⴰⴽⵓⴷ", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Today", target: "ⴰⵙⵙⴰ", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Tomorrow", target: "ⴰⵙⴽⴽⴰ", from: "English", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },

  // Arabic to Tamazight
  { source: "مرحبا", target: "ⴰⵣⵓⵍ", from: "Arabic (العربية)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "شكرا", target: "ⵜⴰⵏⵎⵎⵉⵔⵜ", from: "Arabic (العربية)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "صباح الخير", target: "ⴰⵣⵓⵍ ⵏ ⵜⵓⴼⴰⵜ", from: "Arabic (العربية)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "كيف حالك؟", target: "ⵎⴰⵏⵉⵎⴽ ⵜⵍⵍⵉⴷ?", from: "Arabic (العربية)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "أحتاج مساعدة", target: "ⵔⵉⵖ ⵜⵉⵡⵉⵙⵉ", from: "Arabic (العربية)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "أين المستشفى؟", target: "ⵎⴰⵏⵉ ⵉⵍⵍⴰ ⵓⵙⴳⵏⴼ?", from: "Arabic (العربية)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "اتصل بالشرطة", target: "ⵙⵙⵉⵡⵍ ⵍⴱⵓⵍⵉⵙ", from: "Arabic (العربية)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "طوارئ", target: "ⵜⴰⵔⵡⴰ", from: "Arabic (العربية)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "ماء", target: "ⴰⵎⴰⵏ", from: "Arabic (العربية)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "طعام", target: "ⵓⵛⵛⵉ", from: "Arabic (العربية)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "طبيب", target: "ⴰⵎⵙⴰⵡⴰⵍ", from: "Arabic (العربية)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "دواء", target: "ⴰⵙⴰⴼⴰⵔ", from: "Arabic (العربية)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "عائلة", target: "ⵜⴰⵡⴰⵛⵜ", from: "Arabic (العربية)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "بيت", target: "ⴰⵅⵅⴰⵎ", from: "Arabic (العربية)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "مدرسة", target: "ⵜⴰⵎⴰⵣⵉⵔⵜ", from: "Arabic (العربية)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },

  // French to Tamazight
  { source: "Bonjour", target: "ⴰⵣⵓⵍ", from: "French (Français)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Merci", target: "ⵜⴰⵏⵎⵎⵉⵔⵜ", from: "French (Français)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Comment allez-vous?", target: "ⵎⴰⵏⵉⵎⴽ ⵜⵍⵍⵉⴷ?", from: "French (Français)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "J'ai besoin d'aide", target: "ⵔⵉⵖ ⵜⵉⵡⵉⵙⵉ", from: "French (Français)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Où est l'hôpital?", target: "ⵎⴰⵏⵉ ⵉⵍⵍⴰ ⵓⵙⴳⵏⴼ?", from: "French (Français)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Appelez la police", target: "ⵙⵙⵉⵡⵍ ⵍⴱⵓⵍⵉⵙ", from: "French (Français)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Urgence", target: "ⵜⴰⵔⵡⴰ", from: "French (Français)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Eau", target: "ⴰⵎⴰⵏ", from: "French (Français)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Nourriture", target: "ⵓⵛⵛⵉ", from: "French (Français)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Médecin", target: "ⴰⵎⵙⴰⵡⴰⵍ", from: "French (Français)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Médicament", target: "ⴰⵙⴰⴼⴰⵔ", from: "French (Français)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },
  { source: "Famille", target: "ⵜⴰⵡⴰⵛⵜ", from: "French (Français)", to: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)" },

  // Tamazight to English
  { source: "ⴰⵣⵓⵍ", target: "Hello", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "English" },
  { source: "ⵜⴰⵏⵎⵎⵉⵔⵜ", target: "Thank you", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "English" },
  { source: "ⵎⴰⵏⵉⵎⴽ ⵜⵍⵍⵉⴷ?", target: "How are you?", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "English" },
  { source: "ⵔⵉⵖ ⵜⵉⵡⵉⵙⵉ", target: "I need help", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "English" },
  { source: "ⵎⴰⵏⵉ ⵉⵍⵍⴰ ⵓⵙⴳⵏⴼ?", target: "Where is the hospital?", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "English" },
  { source: "ⵙⵙⵉⵡⵍ ⵍⴱⵓⵍⵉⵙ", target: "Call the police", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "English" },
  { source: "ⵜⴰⵔⵡⴰ", target: "Emergency", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "English" },
  { source: "ⴰⵎⴰⵏ", target: "Water", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "English" },
  { source: "ⵓⵛⵛⵉ", target: "Food", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "English" },
  { source: "ⴰⵎⵙⴰⵡⴰⵍ", target: "Doctor", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "English" },

  // Tamazight to Arabic
  { source: "ⴰⵣⵓⵍ", target: "مرحبا", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "Arabic (العربية)" },
  { source: "ⵜⴰⵏⵎⵎⵉⵔⵜ", target: "شكرا", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "Arabic (العربية)" },
  { source: "ⵔⵉⵖ ⵜⵉⵡⵉⵙⵉ", target: "أحتاج مساعدة", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "Arabic (العربية)" },
  { source: "ⵜⴰⵔⵡⴰ", target: "طوارئ", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "Arabic (العربية)" },
  { source: "ⴰⵎⴰⵏ", target: "ماء", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "Arabic (العربية)" },

  // Tamazight to French
  { source: "ⴰⵣⵓⵍ", target: "Bonjour", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "French (Français)" },
  { source: "ⵜⴰⵏⵎⵎⵉⵔⵜ", target: "Merci", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "French (Français)" },
  { source: "ⵔⵉⵖ ⵜⵉⵡⵉⵙⵉ", target: "J'ai besoin d'aide", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "French (Français)" },
  { source: "ⵜⴰⵔⵡⴰ", target: "Urgence", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "French (Français)" },
  { source: "ⴰⵎⴰⵏ", target: "Eau", from: "Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)", to: "French (Français)" }
];

/**
 * Search for translations in the dataset
 */
export function searchDataset(
  sourceText: string,
  fromLanguage: string,
  toLanguage: string
): string | null {
  const normalizedSource = sourceText.toLowerCase().trim();
  
  // Exact match first
  const exactMatch = TAMAZIGHT_DATASET.find(
    item => 
      item.source.toLowerCase() === normalizedSource &&
      item.from === fromLanguage &&
      item.to === toLanguage
  );
  
  if (exactMatch) {
    return exactMatch.target;
  }
  
  // Partial match
  const partialMatch = TAMAZIGHT_DATASET.find(
    item => 
      (item.source.toLowerCase().includes(normalizedSource) || 
       normalizedSource.includes(item.source.toLowerCase())) &&
      item.from === fromLanguage &&
      item.to === toLanguage
  );
  
  if (partialMatch) {
    return partialMatch.target;
  }
  
  return null;
}

/**
 * Get dataset statistics
 */
export function getDatasetStats() {
  const languagePairs = new Map<string, number>();
  
  TAMAZIGHT_DATASET.forEach(item => {
    const pair = `${item.from} → ${item.to}`;
    languagePairs.set(pair, (languagePairs.get(pair) || 0) + 1);
  });
  
  return {
    totalTranslations: TAMAZIGHT_DATASET.length,
    languagePairs: Array.from(languagePairs.entries()).map(([pair, count]) => ({
      pair,
      count
    }))
  };
}

/**
 * Load dataset into local database
 */
export async function loadDatasetToDatabase() {
  const { databaseService } = await import('../services/databaseService');
  
  try {
    await databaseService.initialize();
    
    let imported = 0;
    for (const item of TAMAZIGHT_DATASET) {
      await databaseService.saveTranslation({
        inputText: item.source,
        outputText: item.target,
        fromLanguage: item.from,
        toLanguage: item.to,
        timestamp: Date.now() - Math.random() * 86400000 * 30, // Random timestamp within last 30 days
        isFavorite: false,
        translationMode: 'offline',
        context: 'general'
      });
      imported++;
    }
    
    return { imported, total: TAMAZIGHT_DATASET.length };
  } catch (error) {
    console.error('Failed to load dataset to database:', error);
    throw error;
  }
}

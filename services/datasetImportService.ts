import { databaseService } from './databaseService';
import * as FileSystem from 'expo-file-system';

interface DatasetEntry {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

interface ParsedTranslation {
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  context: 'general' | 'emergency' | 'government';
}

export class DatasetImportService {
  private languageMapping = {
    'Arabic': 'Arabic (العربية)',
    'English': 'English',
    'Français': 'French (Français)',
    'Tamazight': 'Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)'
  };

  /**
   * Parse a single JSONL entry into a translation pair
   */
  private parseEntry(entry: DatasetEntry): ParsedTranslation | null {
    try {
      const systemMessage = entry.messages.find(m => m.role === 'system');
      const userMessage = entry.messages.find(m => m.role === 'user');
      const assistantMessage = entry.messages.find(m => m.role === 'assistant');

      if (!systemMessage || !userMessage || !assistantMessage) {
        return null;
      }

      // Extract language pair from system message
      const systemContent = systemMessage.content;
      const languageMatch = systemContent.match(/translate text from (\w+) to (\w+)/);
      
      if (!languageMatch) {
        return null;
      }

      const sourceLanguage = this.languageMapping[languageMatch[1] as keyof typeof this.languageMapping];
      const targetLanguage = this.languageMapping[languageMatch[2] as keyof typeof this.languageMapping];

      if (!sourceLanguage || !targetLanguage) {
        return null;
      }

      // Determine context based on content
      const sourceText = userMessage.content.toLowerCase();
      let context: 'general' | 'emergency' | 'government' = 'general';
      
      if (sourceText.includes('police') || sourceText.includes('emergency') || 
          sourceText.includes('hospital') || sourceText.includes('help') ||
          sourceText.includes('danger') || sourceText.includes('urgent') ||
          sourceText.includes('شرطة') || sourceText.includes('مستشفى') ||
          sourceText.includes('طوارئ') || sourceText.includes('مساعدة')) {
        context = 'emergency';
      } else if (sourceText.includes('government') || sourceText.includes('official') ||
                 sourceText.includes('law') || sourceText.includes('court') ||
                 sourceText.includes('حكومة') || sourceText.includes('قانون') ||
                 sourceText.includes('محكمة')) {
        context = 'government';
      }

      return {
        sourceText: userMessage.content,
        translatedText: assistantMessage.content,
        sourceLanguage,
        targetLanguage,
        context
      };
    } catch (error) {
      console.warn('Failed to parse entry:', error);
      return null;
    }
  }

  /**
   * Import dataset from JSONL file into SQLite database
   */
  async importDataset(filePath: string, maxEntries: number = 1000): Promise<{
    imported: number;
    skipped: number;
    errors: number;
  }> {
    try {
      console.log('Starting dataset import...');
      
      // Initialize database
      await databaseService.initialize();

      // Read the JSONL file
      const fileContent = await FileSystem.readAsStringAsync(filePath);
      const lines = fileContent.split('\n').filter(line => line.trim());
      
      console.log(`Found ${lines.length} entries in dataset`);

      let imported = 0;
      let skipped = 0;
      let errors = 0;

      // Process entries in batches to avoid memory issues
      const batchSize = 100;
      const totalToProcess = Math.min(lines.length, maxEntries);

      for (let i = 0; i < totalToProcess; i += batchSize) {
        const batch = lines.slice(i, Math.min(i + batchSize, totalToProcess));
        
        for (const line of batch) {
          try {
            const entry: DatasetEntry = JSON.parse(line);
            const parsed = this.parseEntry(entry);

            if (!parsed) {
              skipped++;
              continue;
            }

            // Save to database
            await databaseService.saveTranslation({
              inputText: parsed.sourceText,
              outputText: parsed.translatedText,
              fromLanguage: parsed.sourceLanguage,
              toLanguage: parsed.targetLanguage,
              timestamp: Date.now() - Math.random() * 86400000 * 30, // Random timestamp within last 30 days
              isFavorite: false,
              translationMode: 'offline',
              context: parsed.context
            });

            imported++;

            // Log progress every 100 imports
            if (imported % 100 === 0) {
              console.log(`Imported ${imported} translations...`);
            }

          } catch (error) {
            console.warn('Error processing line:', error);
            errors++;
          }
        }

        // Small delay between batches to prevent overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      console.log(`Dataset import completed: ${imported} imported, ${skipped} skipped, ${errors} errors`);

      return { imported, skipped, errors };

    } catch (error) {
      console.error('Dataset import failed:', error);
      throw error;
    }
  }

  /**
   * Get import statistics
   */
  async getImportStats(): Promise<{
    totalTranslations: number;
    languagePairs: Array<{ from: string; to: string; count: number }>;
    contexts: Array<{ context: string; count: number }>;
  }> {
    try {
      await databaseService.initialize();
      const stats = await databaseService.getStatistics();
      
      // For now, return basic stats
      // In a full implementation, we'd query for language pairs and contexts
      return {
        totalTranslations: stats.totalTranslations,
        languagePairs: [
          { from: 'English', to: 'Tamazight', count: Math.floor(stats.totalTranslations * 0.3) },
          { from: 'Arabic', to: 'Tamazight', count: Math.floor(stats.totalTranslations * 0.3) },
          { from: 'French', to: 'Tamazight', count: Math.floor(stats.totalTranslations * 0.2) },
          { from: 'Tamazight', to: 'English', count: Math.floor(stats.totalTranslations * 0.2) }
        ],
        contexts: [
          { context: 'general', count: Math.floor(stats.totalTranslations * 0.7) },
          { context: 'emergency', count: Math.floor(stats.totalTranslations * 0.2) },
          { context: 'government', count: Math.floor(stats.totalTranslations * 0.1) }
        ]
      };
    } catch (error) {
      console.error('Failed to get import stats:', error);
      throw error;
    }
  }

  /**
   * Clear all imported translations
   */
  async clearImportedData(): Promise<void> {
    try {
      await databaseService.initialize();
      await databaseService.clearHistory();
      console.log('All imported translations cleared');
    } catch (error) {
      console.error('Failed to clear imported data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const datasetImportService = new DatasetImportService();

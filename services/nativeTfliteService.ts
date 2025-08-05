import { NativeModules, Platform } from 'react-native';

// TypeScript interface for the native TFLite module
interface TfliteModuleInterface {
  initializeModel(): Promise<{
    status: string;
    modelVersion: string;
    message: string;
  }>;
  
  translateText(
    inputText: string,
    fromLanguage: string,
    toLanguage: string,
    context: string
  ): Promise<{
    translatedText: string;
    confidence: number;
    processingTime: number;
    modelVersion: string;
    status: string;
  }>;
  
  isModelReady(): Promise<{
    isReady: boolean;
    modelVersion: string;
  }>;
  
  getModelInfo(): Promise<{
    modelVersion: string;
    isLoaded: boolean;
    maxSequenceLength: number;
    vocabSize: number;
    modelFile: string;
  }>;
  
  cleanup(): Promise<{
    status: string;
    message: string;
  }>;
}

// Get the native module
const { TfliteModule } = NativeModules as { TfliteModule: TfliteModuleInterface };

// Service class for native TFLite integration
export class NativeTfliteService {
  private isInitialized = false;
  private modelInfo: any = null;

  /**
   * Initialize the native TFLite model
   */
  async initialize(): Promise<boolean> {
    try {
      if (Platform.OS !== 'android') {
        console.warn('Native TFLite service only available on Android');
        return false;
      }

      if (!TfliteModule) {
        throw new Error('TfliteModule not found. Make sure native module is properly linked.');
      }

      console.log('Initializing native TFLite model...');
      const result = await TfliteModule.initializeModel();
      
      if (result.status === 'success') {
        this.isInitialized = true;
        this.modelInfo = await TfliteModule.getModelInfo();
        console.log(`Native TFLite model initialized: ${result.modelVersion}`);
        return true;
      } else {
        throw new Error(result.message || 'Unknown initialization error');
      }
    } catch (error) {
      console.error('Failed to initialize native TFLite model:', error);
      return false;
    }
  }

  /**
   * Check if the model is ready for inference
   */
  async isReady(): Promise<boolean> {
    try {
      if (!TfliteModule || Platform.OS !== 'android') {
        return false;
      }

      const result = await TfliteModule.isModelReady();
      return result.isReady;
    } catch (error) {
      console.error('Error checking model readiness:', error);
      return false;
    }
  }

  /**
   * Translate text using the native TFLite model
   */
  async translateText(
    text: string,
    fromLanguage: string,
    toLanguage: string,
    context: 'emergency' | 'government' | 'general' = 'general'
  ): Promise<{
    translatedText: string;
    confidence: number;
    processingTime: number;
    modelVersion: string;
  }> {
    try {
      if (!this.isInitialized) {
        throw new Error('Model not initialized. Call initialize() first.');
      }

      if (!TfliteModule) {
        throw new Error('TfliteModule not available');
      }

      // Convert display language names to model format
      const fromLang = this.convertLanguageCode(fromLanguage);
      const toLang = this.convertLanguageCode(toLanguage);

      console.log(`Translating: "${text}" from ${fromLang} to ${toLang} (${context})`);
      
      const result = await TfliteModule.translateText(text, fromLang, toLang, context);
      
      if (result.status === 'success') {
        console.log(`Translation completed in ${result.processingTime}ms with confidence ${result.confidence}`);
        return {
          translatedText: result.translatedText,
          confidence: result.confidence,
          processingTime: result.processingTime,
          modelVersion: result.modelVersion
        };
      } else {
        throw new Error('Translation failed');
      }
    } catch (error) {
      console.error('Native translation error:', error);
      throw new Error(`Native translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get model information and statistics
   */
  async getModelInfo(): Promise<any> {
    try {
      if (!TfliteModule) {
        return null;
      }

      return await TfliteModule.getModelInfo();
    } catch (error) {
      console.error('Error getting model info:', error);
      return null;
    }
  }

  /**
   * Convert display language names to model codes
   */
  private convertLanguageCode(displayLanguage: string): string {
    if (displayLanguage.includes('Tamazight')) return 'tamazight';
    if (displayLanguage.includes('Arabic')) return 'arabic';
    if (displayLanguage.includes('French')) return 'french';
    if (displayLanguage.includes('English')) return 'english';
    return displayLanguage.toLowerCase();
  }

  /**
   * Cleanup native resources
   */
  async cleanup(): Promise<void> {
    try {
      if (TfliteModule && this.isInitialized) {
        await TfliteModule.cleanup();
        this.isInitialized = false;
        this.modelInfo = null;
        console.log('Native TFLite resources cleaned up');
      }
    } catch (error) {
      console.error('Error cleaning up native resources:', error);
    }
  }

  /**
   * Check if native TFLite is available on this platform
   */
  isAvailable(): boolean {
    return Platform.OS === 'android' && !!TfliteModule;
  }

  /**
   * Get initialization status
   */
  getInitializationStatus(): {
    isInitialized: boolean;
    isAvailable: boolean;
    platform: string;
    modelInfo: any;
  } {
    return {
      isInitialized: this.isInitialized,
      isAvailable: this.isAvailable(),
      platform: Platform.OS,
      modelInfo: this.modelInfo
    };
  }
}

// Export singleton instance
export const nativeTfliteService = new NativeTfliteService();

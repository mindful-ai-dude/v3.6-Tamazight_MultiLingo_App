import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { geminiService } from './geminiService';
import { offlineAIService } from './offlineAIService';
import { databaseService } from './databaseService';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TranslationResult {
  translatedText: string;
  confidence?: number;
  method: 'gemini' | 'tflite' | 'cached' | 'community';
  isFromCache?: boolean;
  convexId?: string;
  localId?: string;
}

export interface EmergencyBroadcast {
  id: string;
  message: string;
  location: string;
  urgencyLevel: number;
  timestamp: number;
  translations: Array<{
    language: string;
    text: string;
    audioUrl?: string;
  }>;
}

/**
 * Enhanced translation service that integrates Convex real-time database
 * with existing offline capabilities for emergency communication
 */
export const useConvexTranslation = () => {
  // Convex mutations and queries
  const saveTranslation = useMutation(api.translations.saveTranslation);
  const verifyTranslation = useMutation(api.translations.verifyTranslation);
  const createEmergencyBroadcast = useMutation(api.emergency.createEmergencyBroadcast);
  
  // Real-time queries
  const recentTranslations = useQuery(api.translations.getRecentTranslations, { limit: 50 });
  const emergencyPhrases = useQuery(api.emergency.getEmergencyPhrases, { 
    language: 'tamazight', 
    limit: 20 
  });
  const activeEmergencyBroadcasts = useQuery(api.emergency.getActiveEmergencyBroadcasts, {
    urgencyLevel: 7 // High priority only
  });

  /**
   * Enhanced translation with dual-database storage
   * Tries online first, falls back to offline, always caches locally
   */
  const translateWithCollaboration = async (
    sourceText: string,
    sourceLanguage: string,
    targetLanguage: string,
    context: 'emergency' | 'government' | 'general' | 'cultural' = 'general',
    userId?: string
  ): Promise<TranslationResult> => {
    const isEmergency = context === 'emergency';
    let translatedText = '';
    let confidence = 0;
    let method: 'gemini' | 'tflite' | 'cached' | 'community' = 'cached';

    try {
      // 1. Check for existing community-verified translation first
      if (recentTranslations) {
        const existingTranslation = recentTranslations.find(t => 
          t.sourceText.toLowerCase() === sourceText.toLowerCase() &&
          t.sourceLanguage === sourceLanguage &&
          t.targetLanguage === targetLanguage &&
          t.isVerified
        );
        
        if (existingTranslation) {
          // Use community-verified translation
          await databaseService.saveTranslation({
            sourceText,
            sourceLanguage,
            targetLanguage,
            translatedText: existingTranslation.translatedText,
            translationMethod: 'community',
            context,
            confidence: 1.0,
            isEmergency,
            convexId: existingTranslation._id
          });

          return {
            translatedText: existingTranslation.translatedText,
            confidence: 1.0,
            method: 'community',
            isFromCache: false,
            convexId: existingTranslation._id
          };
        }
      }

      // 2. Check local cache for recent translations
      const cachedTranslation = await databaseService.getCachedTranslation(
        sourceText, sourceLanguage, targetLanguage
      );
      
      if (cachedTranslation && !isEmergency) {
        return {
          translatedText: cachedTranslation.translatedText,
          confidence: cachedTranslation.confidence,
          method: 'cached',
          isFromCache: true,
          localId: cachedTranslation.id
        };
      }

      // 3. Try online translation (Gemini API)
      const networkState = await NetInfo.fetch();
      if (networkState.isConnected) {
        try {
          const geminiResult = await geminiService.translateText(
            sourceText, sourceLanguage, targetLanguage, context
          );
          
          translatedText = geminiResult;
          confidence = 0.95; // High confidence for Gemini
          method = 'gemini';

          // Save to Convex for real-time sharing
          const convexId = await saveTranslation({
            sourceText,
            sourceLanguage,
            targetLanguage,
            translatedText,
            translationMethod: 'gemini',
            context,
            userId,
            confidence,
            isEmergency
          });

          // Cache locally
          const localId = await databaseService.saveTranslation({
            sourceText,
            sourceLanguage,
            targetLanguage,
            translatedText,
            translationMethod: 'gemini',
            context,
            confidence,
            isEmergency,
            convexId: convexId.id
          });

          return {
            translatedText,
            confidence,
            method: 'gemini',
            convexId: convexId.id,
            localId
          };

        } catch (geminiError) {
          console.warn('Gemini translation failed, falling back to offline:', geminiError);
        }
      }

      // 4. Fallback to offline TFLite translation
      const offlineResult = await offlineAIService.translateText(
        sourceText, sourceLanguage, targetLanguage
      );
      
      translatedText = offlineResult;
      confidence = 0.85; // Good confidence for TFLite
      method = 'tflite';

      // Save locally and queue for Convex sync
      const localId = await databaseService.saveTranslation({
        sourceText,
        sourceLanguage,
        targetLanguage,
        translatedText,
        translationMethod: 'tflite',
        context,
        confidence,
        isEmergency
      });

      // Queue for sync when connectivity returns
      await databaseService.queueForSync({
        action: 'create_translation',
        data: {
          sourceText,
          sourceLanguage,
          targetLanguage,
          translatedText,
          translationMethod: 'tflite',
          context,
          userId,
          confidence,
          isEmergency
        },
        priority: isEmergency ? 10 : 5
      });

      return {
        translatedText,
        confidence,
        method: 'tflite',
        localId
      };

    } catch (error) {
      console.error('Translation failed:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }
  };

  /**
   * Verify a translation's accuracy (community feature)
   */
  const verifyTranslationAccuracy = async (
    translationId: string,
    isCorrect: boolean,
    suggestedImprovement?: string,
    expertise: 'native_speaker' | 'linguist' | 'emergency_responder' | 'community_member' = 'community_member',
    userId: string = 'anonymous'
  ) => {
    try {
      await verifyTranslation({
        translationId: translationId as any,
        userId,
        isCorrect,
        suggestedImprovement,
        expertise
      });

      return {
        success: true,
        message: 'Translation verification recorded!'
      };
    } catch (error) {
      console.error('Verification failed:', error);
      throw error;
    }
  };

  /**
   * Broadcast emergency message to community
   */
  const broadcastEmergency = async (
    message: string,
    location: string,
    urgencyLevel: number,
    broadcasterId: string,
    sourceLanguage: string = 'english'
  ): Promise<EmergencyBroadcast> => {
    try {
      // Translate to all supported languages
      const translations = [];
      const targetLanguages = ['tamazight', 'arabic', 'french', 'english'];
      
      for (const targetLang of targetLanguages) {
        if (targetLang !== sourceLanguage) {
          const translation = await translateWithCollaboration(
            message, sourceLanguage, targetLang, 'emergency', broadcasterId
          );
          translations.push({
            language: targetLang,
            text: translation.translatedText
          });
        }
      }

      // Create broadcast in Convex
      const broadcast = await createEmergencyBroadcast({
        message,
        sourceLanguage,
        location,
        urgencyLevel,
        category: 'emergency',
        broadcasterId,
        translations,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      });

      return {
        id: broadcast.id,
        message,
        location,
        urgencyLevel,
        timestamp: Date.now(),
        translations
      };

    } catch (error) {
      console.error('Emergency broadcast failed:', error);
      
      // Fallback: save locally for sync later
      await databaseService.queueForSync({
        action: 'emergency_broadcast',
        data: {
          message,
          sourceLanguage,
          location,
          urgencyLevel,
          category: 'emergency',
          broadcasterId
        },
        priority: 10 // Highest priority
      });

      throw error;
    }
  };

  return {
    // Translation functions
    translateWithCollaboration,
    verifyTranslationAccuracy,
    
    // Emergency functions
    broadcastEmergency,
    
    // Real-time data
    recentTranslations,
    emergencyPhrases,
    activeEmergencyBroadcasts,
    
    // Status
    isConnected: !!recentTranslations, // Simple connectivity check
  };
};

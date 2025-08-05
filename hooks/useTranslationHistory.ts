import { useState, useEffect } from 'react';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { databaseService, TranslationHistory } from '@/services/databaseService';
import { useMode } from '@/app/context/ModeContext';

export interface TranslationItem {
  id: string;
  sourceText: string;
  translatedText: string;
  fromLang: string;
  toLang: string;
  timestamp: Date;
  isFavorite: boolean;
  method?: 'gemini' | 'tflite' | 'community' | 'cached';
  confidence?: number;
}

export const useTranslationHistory = (userId?: string) => {
  const { mode } = useMode();
  const [localHistory, setLocalHistory] = useState<TranslationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user's personal translations from Convex (online mode)
  const convexUserHistory = useQuery(
    api.translations.getUserTranslationHistory,
    userId && mode === 'online' ? { userId, limit: 100 } : "skip"
  );

  // Load local SQLite history
  const loadLocalHistory = async () => {
    try {
      setIsLoading(true);
      await databaseService.initialize();
      const history = await databaseService.getTranslationHistory(100);
      
      const formattedHistory: TranslationItem[] = history.map(item => ({
        id: item.id?.toString() || Date.now().toString(),
        sourceText: item.inputText,
        translatedText: item.outputText,
        fromLang: item.fromLanguage,
        toLang: item.toLanguage,
        timestamp: new Date(item.timestamp),
        isFavorite: item.isFavorite,
        method: item.translationMode === 'online' ? 'gemini' : 'tflite'
      }));

      setLocalHistory(formattedHistory);
      setError(null);
    } catch (err) {
      console.error('Error loading local history:', err);
      setError('Failed to load local history');
    } finally {
      setIsLoading(false);
    }
  };

  // Convert Convex data to TranslationItem format
  const formatConvexHistory = (convexData: any[]): TranslationItem[] => {
    return convexData.map(item => ({
      id: item._id,
      sourceText: item.sourceText,
      translatedText: item.translatedText,
      fromLang: formatLanguageName(item.sourceLanguage),
      toLang: formatLanguageName(item.targetLanguage),
      timestamp: new Date(item.timestamp),
      isFavorite: false, // TODO: Add favorites to Convex schema
      method: item.translationMethod,
      confidence: item.confidence
    }));
  };

  const formatLanguageName = (lang: string): string => {
    switch (lang) {
      case 'tamazight': return 'Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)';
      case 'arabic': return 'Arabic (العربية)';
      case 'french': return 'French (Français)';
      case 'english': return 'English';
      default: return lang;
    }
  };

  // Save translation to appropriate storage
  const saveTranslation = async (translation: Omit<TranslationItem, 'id'>) => {
    try {
      // Always save to local database
      await databaseService.initialize();
      await databaseService.saveTranslation({
        inputText: translation.sourceText,
        outputText: translation.translatedText,
        fromLanguage: translation.fromLang,
        toLanguage: translation.toLang,
        timestamp: translation.timestamp.getTime(),
        isFavorite: translation.isFavorite,
        translationMode: mode,
        context: 'general'
      });

      // Refresh local history
      await loadLocalHistory();
    } catch (err) {
      console.error('Error saving translation:', err);
      setError('Failed to save translation');
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (translationId: string) => {
    try {
      await databaseService.initialize();
      await databaseService.toggleFavorite(parseInt(translationId));
      await loadLocalHistory();
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Failed to update favorite');
    }
  };

  // Clear all history
  const clearHistory = async () => {
    try {
      await databaseService.initialize();
      await databaseService.clearHistory();
      await loadLocalHistory();
    } catch (err) {
      console.error('Error clearing history:', err);
      setError('Failed to clear history');
    }
  };

  // Load local history on mount
  useEffect(() => {
    loadLocalHistory();
  }, []);

  // Get the appropriate history based on mode and tab
  const getHistory = (tab: 'local' | 'community'): TranslationItem[] => {
    if (tab === 'local') {
      // For local tab, show user's personal history
      if (mode === 'online' && convexUserHistory) {
        return formatConvexHistory(convexUserHistory);
      } else {
        return localHistory;
      }
    } else {
      // Community tab will be handled by ConvexTranslationHistory component
      return [];
    }
  };

  return {
    getHistory,
    saveTranslation,
    toggleFavorite,
    clearHistory,
    isLoading,
    error,
    localHistory,
    convexUserHistory: convexUserHistory ? formatConvexHistory(convexUserHistory) : []
  };
};

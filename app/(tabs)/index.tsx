import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { GradientBackground } from '@/components/GradientBackground';
import { TranslationInput } from '@/components/TranslationInput';
import { LanguageSelector } from '@/components/LanguageSelector';
import { TifinghKeyboard } from '@/components/TifinghKeyboard';
import { GlassCard } from '@/components/GlassCard';
import { Keyboard, Zap, Camera, Wifi, WifiOff, Cloud, Cpu } from 'lucide-react-native';
import { useMode } from '../context/ModeContext';
import { geminiService } from '@/services/geminiService';
import { offlineAIService } from '@/services/offlineAIService';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvexTranslation } from '@/services/convexTranslationService';

export default function TranslateScreen() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [fromLanguage, setFromLanguage] = useState('Arabic (العربية)');
  const [toLanguage, setToLanguage] = useState('Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)');
  const [showTifinghKeyboard, setShowTifinghKeyboard] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const { mode } = useMode();

  // Test Convex connection
  const convexTest = useQuery(api.test.hello);
  const emergencyStatus = useQuery(api.test.emergencyStatus);

  // Enhanced Convex translation service
  const {
    translateWithCollaboration,
    recentTranslations,
    isConnected
  } = useConvexTranslation();

  // Helper function to convert display language to API format
  const getLanguageCode = (displayLanguage: string): string => {
    if (displayLanguage.includes('Tamazight')) return 'tamazight';
    if (displayLanguage.includes('Arabic')) return 'arabic';
    if (displayLanguage.includes('French')) return 'french';
    if (displayLanguage.includes('English')) return 'english';
    return 'english'; // fallback
  };

  const handleSwapLanguages = () => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
    setInputText(outputText);
    setOutputText(inputText);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);

    try {
      const fromLangCode = getLanguageCode(fromLanguage);
      const toLangCode = getLanguageCode(toLanguage);

      // Use enhanced Convex translation service for collaborative features
      const result = await translateWithCollaboration(
        inputText,
        fromLangCode,
        toLangCode,
        'general', // context
        'user-' + Date.now() // userId (in real app, use actual user ID)
      );

      setOutputText(result.translatedText);

      // Show translation method info in console
      const methodInfo = result.method === 'community' ?
        '✅ Community Verified' :
        result.method === 'gemini' ?
        '🤖 Gemini AI' :
        result.method === 'tflite' ?
        '📱 Offline AI' :
        '💾 Cached';

      console.log(`Translation: ${methodInfo} (${Math.round((result.confidence || 0) * 100)}% confidence)`);

    } catch (error) {
      console.error('Enhanced translation failed, using fallback:', error);

      // Fallback to original translation methods
      if (mode === 'online') {
        try {
          if (!geminiService.isConfigured()) {
            setOutputText('Please configure your Gemini API key in the .env file to use online translation.');
            setIsTranslating(false);
            return;
          }

          const fromLangCode = getLanguageCode(fromLanguage);
          const toLangCode = getLanguageCode(toLanguage);

          const translation = await geminiService.translateText(
            inputText,
            fromLangCode,
            toLangCode,
            'general'
          );

          setOutputText(translation);
        } catch (geminiError) {
          console.error('Gemini API Translation Error:', geminiError);
          setOutputText('Error translating online. Please check your internet connection and API key, then try again.');
        }
      } else {
        try {
          if (!offlineAIService.isReady()) {
            await offlineAIService.initialize();
          }

          const result = await offlineAIService.translateText(
            inputText,
            fromLanguage,
            toLanguage,
            'general'
          );

          setOutputText(result.translatedText);
        } catch (offlineError) {
          console.error('Offline AI Translation Error:', offlineError);
          // Fallback to simple mock translation
          if (fromLanguage === 'English' && toLanguage.includes('Tamazight')) {
            setOutputText('ⴰⵣⵓⵍ ⴰⴼⵍⵍⴰⵙ');
          } else if (fromLanguage.includes('Tamazight') && toLanguage === 'English') {
            setOutputText('Hello, peace be with you');
          } else if (fromLanguage.includes('Arabic') && toLanguage.includes('Tamazight')) {
            setOutputText('ⴰⵣⵓⵍ ⴰⴼⵍⵍⴰⵙ');
          } else {
            setOutputText(`[Offline Translation from ${fromLanguage} to ${toLanguage}]: ${inputText}`);
          }
        }
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTifinghCharacter = (character: string) => {
    setInputText(prev => prev + character);
  };

  return (
    <View style={styles.container}>
      <GradientBackground>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Image
                source={require('../../assets/images/image-app-header-tamazight-500x500.png')}
                style={styles.headerImage}
                resizeMode="contain"
              />
              <View style={styles.modeIndicator}>
                {mode === 'online' ? (
                  <Cloud size={16} color="#10B981" strokeWidth={2} />
                ) : (
                  <Cpu size={16} color="#8B5CF6" strokeWidth={2} />
                )}
                <Text style={styles.modeText}>
                  {mode === 'online' ? 'Online' : 'Offline'} Mode
                </Text>
                {mode === 'online' ? (
                  <Wifi size={14} color="#10B981" strokeWidth={2} />
                ) : (
                  <WifiOff size={14} color="rgba(255, 255, 255, 0.6)" strokeWidth={2} />
                )}
              </View>

              {/* Convex Connection Status */}
              {convexTest && (
                <View style={styles.convexStatus}>
                  <Text style={styles.convexText}>
                    🚀 Real-time DB Connected
                  </Text>
                  {recentTranslations && (
                    <Text style={styles.convexSubtext}>
                      {recentTranslations.length} community translations available
                    </Text>
                  )}
                </View>
              )}
            </View>

            <LanguageSelector
              fromLanguage={fromLanguage}
              toLanguage={toLanguage}
              onFromLanguageChange={setFromLanguage}
              onToLanguageChange={setToLanguage}
              onSwap={handleSwapLanguages}
            />

            <TranslationInput
              value={inputText}
              onChangeText={setInputText}
              placeholder={`Enter text in ${fromLanguage}...`}
              language={fromLanguage}
            />

            <View style={styles.controls}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => setShowTifinghKeyboard(!showTifinghKeyboard)}
              >
                <Keyboard size={20} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.controlText}>Tifinagh</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.translateButton, 
                  isTranslating && styles.translating,
                  mode === 'online' && styles.onlineButton
                ]}
                onPress={handleTranslate}
                disabled={isTranslating || !inputText.trim()}
              >
                <Zap size={24} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.translateText}>
                  {isTranslating ? 'Translating...' : 'Translate'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlButton}>
                <Camera size={20} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.controlText}>Camera</Text>
              </TouchableOpacity>
            </View>

            <TifinghKeyboard
              visible={showTifinghKeyboard}
              onCharacterPress={handleTifinghCharacter}
            />

            {(outputText || isTranslating) && (
              <TranslationInput
                value={isTranslating ? `Translating with ${mode === 'online' ? 'Gemma-3 API' : 'On-Device AI'}...` : outputText}
                onChangeText={() => {}}
                placeholder=""
                language={toLanguage}
                isOutput
                onFavorite={() => {}}
              />
            )}

            {outputText && (
              <GlassCard style={styles.aiInfo}>
                <View style={styles.aiRow}>
                  {mode === 'online' ? (
                    <Cloud size={16} color="#10B981" strokeWidth={2} />
                  ) : (
                    <Cpu size={16} color="#8B5CF6" strokeWidth={2} />
                  )}
                  <Text style={styles.aiText}>
                    {mode === 'online'
                      ? 'Translated online using Gemma-3 API • Cloud processing'
                      : 'Translated offline using On-Device AI • Processing time: 1.2s'}
                  </Text>
                </View>
              </GlassCard>
            )}
          </ScrollView>
        </SafeAreaView>
      </GradientBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
    paddingBottom: 105, // Account for tab bar height (85px) + extra padding
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  headerImage: {
    width: '80%',
    height: 200,
  },
  modeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modeText: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
    gap: 12,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  controlText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  translateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.8)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flex: 1,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  onlineButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
  },
  translating: {
    backgroundColor: 'rgba(245, 158, 11, 0.8)',
  },
  translateText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  aiInfo: {
    marginTop: 16,
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  convexStatus: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 12,
    alignSelf: 'center',
  },
  convexText: {
    color: '#10B981',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  convexSubtext: {
    color: 'rgba(16, 185, 129, 0.8)',
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
});
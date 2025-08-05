import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { GradientBackground } from '@/components/GradientBackground';
import { GlassCard } from '@/components/GlassCard';
import { Building2, FileText, Users, Scale, Volume2, BookOpen, Music } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { hasAudioForLanguage, getAudioFile } from '@/constants/AudioFiles';

interface GovernmentPhrase {
  id: string;
  category: string;
  english: string;
  tamazight: string;
  arabic: string;
  french: string;
  context: string;
}

const GOVERNMENT_PHRASES: GovernmentPhrase[] = [
  {
    id: '1',
    category: 'Parliament',
    english: 'I request to speak in Tamazight',
    tamazight: 'ⴰⵔⴰⵖ ⴰⴷ ⵙⴰⵡⵍⵖ ⵙ ⵜⵎⴰⵣⵉⵖⵜ',
    arabic: 'أطلب أن أتحدث بالأمازيغية',
    french: 'Je demande à parler en tamazight',
    context: 'Parliamentary proceedings',
  },
  {
    id: '2',
    category: 'Legal',
    english: 'I need an interpreter',
    tamazight: 'ⵔⵉⵖ ⴰⵙⵙⵓⵜⵓⵔ',
    arabic: 'أحتاج مترجم',
    french: "J'ai besoin d'un interprète",
    context: 'Court proceedings',
  },
  {
    id: '3',
    category: 'Administrative',
    english: 'Where can I get official documents translated?',
    tamazight: 'ⵎⴰⵏⵉ ⵖⵉⵖ ⴰⴷ ⵙⵓⵜⵔⵖ ⵜⵉⵔⴰⵙ ⵜⵏⵎⵇⵇⵓⵔⵉⵏ?',
    arabic: 'أين يمكنني ترجمة الوثائق الرسمية؟',
    french: 'Où puis-je faire traduire les documents officiels?',
    context: 'Document processing',
  },
  {
    id: '4',
    category: 'Rights',
    english: 'What are my linguistic rights?',
    tamazight: 'ⵎⴰⵜⵜⴰ ⵏⵜ ⵉⵣⵔⴼⴰⵏ ⵉⵏⵓ ⵏ ⵜⵓⵜⵍⴰⵢⵜ?',
    arabic: 'ما هي حقوقي اللغوية؟',
    french: 'Quels sont mes droits linguistiques?',
    context: 'Constitutional rights',
  },
  {
    id: '5',
    category: 'Education',
    english: 'I want my child to learn Tamazight',
    tamazight: 'ⵔⵉⵖ ⴰⵔⵡⴰ ⵉⵏⵓ ⴰⴷ ⵉⵍⵎⴰⴷ ⵜⴰⵎⴰⵣⵉⵖⵜ',
    arabic: 'أريد أن يتعلم طفلي الأمازيغية',
    french: 'Je veux que mon enfant apprenne le tamazight',
    context: 'Educational system',
  },
  {
    id: '6',
    category: 'Services',
    english: 'Can this form be provided in Tamazight?',
    tamazight: 'ⵉⵖⵢ ⴰⴷ ⵉⵜⵜⵓⵡⵔⴷ ⵓⵙⴳⴷ ⴰⴷ ⵙ ⵜⵎⴰⵣⵉⵖⵜ?',
    arabic: 'هل يمكن توفير هذا النموذج بالأمازيغية؟',
    french: 'Ce formulaire peut-il être fourni en tamazight?',
    context: 'Public services',
  },
];

const CATEGORIES = ['All', 'Parliament', 'Legal', 'Administrative', 'Rights', 'Education', 'Services'];

export default function GovernmentScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [playingPhraseId, setPlayingPhraseId] = useState<string | null>(null);

  const filteredPhrases = GOVERNMENT_PHRASES.filter(phrase => 
    selectedCategory === 'All' || phrase.category === selectedCategory
  );

  const handleSpeak = async (phrase: GovernmentPhrase) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setPlayingPhraseId(phrase.id);

    // Check if we have native audio for the selected language
    const hasNativeAudio = hasAudioForLanguage(phrase.english, selectedLanguage as 'tamazight' | 'french' | 'arabic' | 'english');

    if (hasNativeAudio) {
      const audioFile = getAudioFile(phrase.english, selectedLanguage as 'tamazight' | 'french' | 'arabic' | 'english');
      if (audioFile) {
        try {
          if (Platform.OS === 'web') {
            // For web, create audio from the require() result
            const audio = new Audio(audioFile);
            audio.play();
            setTimeout(() => setPlayingPhraseId(null), 3000);
          } else {
            // For mobile, use expo-av with the required audio file
            const { Audio } = require('expo-av');
            const { sound } = await Audio.Sound.createAsync(audioFile);
            await sound.playAsync();
            setTimeout(() => setPlayingPhraseId(null), 3000);
          }
          return;
        } catch (error) {
          console.error(`Error playing native ${selectedLanguage} audio, falling back to TTS:`, error);
        }
      }
    }

    // Fallback to text-to-speech
    let textToSpeak = '';
    let languageCode = 'en';

    switch (selectedLanguage) {
      case 'tamazight':
        textToSpeak = phrase.tamazight;
        languageCode = 'ar'; // Fallback to Arabic for Tifinagh
        break;
      case 'arabic':
        textToSpeak = phrase.arabic;
        languageCode = 'ar';
        break;
      case 'french':
        textToSpeak = phrase.french;
        languageCode = 'fr';
        break;
      default:
        textToSpeak = phrase.english;
        languageCode = 'en';
    }

    Speech.speak(textToSpeak, {
      language: languageCode,
      pitch: 1.0,
      rate: 0.7,
      onDone: () => setPlayingPhraseId(null),
      onError: () => setPlayingPhraseId(null),
    });
  };

  const getSelectedText = (phrase: GovernmentPhrase) => {
    switch (selectedLanguage) {
      case 'tamazight': return phrase.tamazight;
      case 'arabic': return phrase.arabic;
      case 'french': return phrase.french;
      default: return phrase.english;
    }
  };

  const hasNativeAudio = (phrase: GovernmentPhrase) => {
    return hasAudioForLanguage(phrase.english, selectedLanguage as 'tamazight' | 'french' | 'arabic' | 'english');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Parliament': return <Users size={16} color="#3B82F6" strokeWidth={2} />;
      case 'Legal': return <Scale size={16} color="#8B5CF6" strokeWidth={2} />;
      case 'Administrative': return <FileText size={16} color="#10B981" strokeWidth={2} />;
      case 'Rights': return <Scale size={16} color="#F59E0B" strokeWidth={2} />;
      case 'Education': return <BookOpen size={16} color="#EF4444" strokeWidth={2} />;
      case 'Services': return <Building2 size={16} color="#06B6D4" strokeWidth={2} />;
      default: return <FileText size={16} color="#6B7280" strokeWidth={2} />;
    }
  };

  return (
    <View style={styles.container}>
      <GradientBackground>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Building2 size={32} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.title}>Government</Text>
            </View>
            <Text style={styles.subtitle}>Official terminology and parliamentary phrases</Text>
          </View>

          <GlassCard style={styles.rightsInfo}>
            <View style={styles.infoHeader}>
              <Scale size={20} color="#F59E0B" strokeWidth={2} />
              <Text style={styles.infoTitle}>Constitutional Right</Text>
            </View>
            <Text style={styles.infoText}>
              Tamazight is an official language of Morocco (Constitution 2011, Article 5)
            </Text>
          </GlassCard>

          <View style={styles.controls}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryActive
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageScroll}>
              {['english', 'tamazight', 'arabic', 'french'].map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.languageButton,
                    selectedLanguage === lang && styles.languageActive
                  ]}
                  onPress={() => setSelectedLanguage(lang)}
                >
                  <Text style={[
                    styles.languageText,
                    selectedLanguage === lang && styles.languageTextActive
                  ]}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {filteredPhrases.map((phrase) => (
              <TouchableOpacity 
                key={phrase.id}
                style={styles.phraseButton}
                onPress={() => handleSpeak(phrase)}
              >
                <GlassCard style={styles.phraseCard}>
                  <View style={styles.phraseHeader}>
                    <View style={styles.categoryBadge}>
                      {getCategoryIcon(phrase.category)}
                      <Text style={styles.categoryLabel}>{phrase.category}</Text>
                      {hasNativeAudio(phrase) && (
                        <View style={styles.audioIndicator}>
                          <Music size={14} color="#10B981" strokeWidth={2} />
                        </View>
                      )}
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.speakButton,
                        playingPhraseId === phrase.id && styles.speakButtonActive
                      ]}
                      onPress={() => handleSpeak(phrase)}
                    >
                      <Volume2 size={20} color="#FFFFFF" strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.phraseText}>
                    {getSelectedText(phrase)}
                  </Text>
                  {selectedLanguage !== 'english' && (
                    <Text style={styles.englishText}>
                      {phrase.english}
                    </Text>
                  )}
                  <Text style={styles.contextText}>
                    Context: {phrase.context}
                  </Text>
                  {hasNativeAudio(phrase) && (
                    <Text style={styles.audioNote}>
                      🎵 Professional {
                        selectedLanguage === 'tamazight' ? 'Tamazight' :
                        selectedLanguage === 'french' ? 'French' :
                        selectedLanguage === 'arabic' ? 'Arabic' : 'English'
                      } audio available
                    </Text>
                  )}
                </GlassCard>
              </TouchableOpacity>
            ))}
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  rightsInfo: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  controls: {
    marginBottom: 16,
    gap: 12,
  },
  categoryScroll: {
    paddingHorizontal: 20,
  },
  languageScroll: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
  },
  categoryText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  languageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  languageActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.8)',
  },
  languageText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  languageTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 105, // Account for tab bar height (85px) + extra padding
  },
  phraseButton: {
    marginBottom: 16,
  },
  phraseCard: {
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  phraseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  speakButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phraseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    lineHeight: 24,
    marginBottom: 8,
  },
  englishText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 8,
  },
  contextText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
  },
  audioIndicator: {
    marginLeft: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 8,
    padding: 2,
  },
  speakButtonActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.8)',
  },
  audioNote: {
    color: '#10B981',
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
    textAlign: 'center',
  },
});
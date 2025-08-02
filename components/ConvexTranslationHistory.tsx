import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CheckCircle, XCircle, Clock, Users, Zap, Globe } from 'lucide-react-native';

interface TranslationHistoryProps {
  sourceLanguage?: string;
  targetLanguage?: string;
  context?: string;
  limit?: number;
}

export const ConvexTranslationHistory: React.FC<TranslationHistoryProps> = ({
  sourceLanguage,
  targetLanguage,
  context,
  limit = 20
}) => {
  const [selectedTranslation, setSelectedTranslation] = useState<string | null>(null);

  // Real-time translation data
  const translations = useQuery(api.translations.getRecentTranslations, {
    limit,
    context
  });

  const verifyTranslation = useMutation(api.translations.verifyTranslation);

  // Filter translations if language pair specified
  const filteredTranslations = translations?.filter(translation => {
    if (sourceLanguage && translation.sourceLanguage !== sourceLanguage) return false;
    if (targetLanguage && translation.targetLanguage !== targetLanguage) return false;
    return true;
  }) || [];

  const handleVerifyTranslation = async (translationId: string, isCorrect: boolean) => {
    try {
      await verifyTranslation({
        translationId: translationId as any,
        userId: 'user-' + Date.now(), // In real app, use actual user ID
        isCorrect,
        expertise: 'community_member'
      });

      Alert.alert(
        'Verification Recorded',
        `Thank you for helping improve translation accuracy!`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to record verification. Please try again.');
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'gemini': return <Zap size={16} color="#10B981" />;
      case 'tflite': return <Zap size={16} color="#8B5CF6" />;
      case 'community': return <Users size={16} color="#F59E0B" />;
      case 'user': return <Globe size={16} color="#3B82F6" />;
      default: return <Clock size={16} color="#6B7280" />;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'gemini': return 'Gemini AI';
      case 'tflite': return 'Offline AI';
      case 'community': return 'Community';
      case 'user': return 'User';
      default: return 'Unknown';
    }
  };

  const getLanguageFlag = (language: string) => {
    switch (language) {
      case 'tamazight': return 'ⵜⵎⵣⵖⵜ';
      case 'arabic': return '🇲🇦';
      case 'french': return '🇫🇷';
      case 'english': return '🇺🇸';
      default: return '🌍';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (!translations) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading real-time translations...</Text>
      </View>
    );
  }

  if (filteredTranslations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Globe size={48} color="#6B7280" />
        <Text style={styles.emptyTitle}>No Translations Yet</Text>
        <Text style={styles.emptySubtitle}>
          Be the first to contribute to the community translation database!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Users size={20} color="#10B981" />
        <Text style={styles.headerTitle}>Community Translations</Text>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {filteredTranslations.map((translation) => (
        <View key={translation._id} style={styles.translationCard}>
          {/* Header with languages and method */}
          <View style={styles.translationHeader}>
            <View style={styles.languagePair}>
              <Text style={styles.languageFlag}>
                {getLanguageFlag(translation.sourceLanguage)}
              </Text>
              <Text style={styles.languageCode}>
                {translation.sourceLanguage.toUpperCase()}
              </Text>
              <Text style={styles.arrow}>→</Text>
              <Text style={styles.languageFlag}>
                {getLanguageFlag(translation.targetLanguage)}
              </Text>
              <Text style={styles.languageCode}>
                {translation.targetLanguage.toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.methodBadge}>
              {getMethodIcon(translation.translationMethod)}
              <Text style={styles.methodText}>
                {getMethodLabel(translation.translationMethod)}
              </Text>
            </View>
          </View>

          {/* Translation content */}
          <View style={styles.translationContent}>
            <Text style={styles.sourceText}>{translation.sourceText}</Text>
            <Text style={styles.translatedText}>{translation.translatedText}</Text>
            
            {/* Tifinagh script if available */}
            {translation.tifinghScript && (
              <Text style={styles.tifinghText}>{translation.tifinghScript}</Text>
            )}
          </View>

          {/* Metadata */}
          <View style={styles.metadata}>
            <View style={styles.metadataLeft}>
              {translation.isVerified && (
                <View style={styles.verifiedBadge}>
                  <CheckCircle size={14} color="#10B981" />
                  <Text style={styles.verifiedText}>
                    Verified ({translation.verificationCount})
                  </Text>
                </View>
              )}
              
              {translation.isEmergency && (
                <View style={styles.emergencyBadge}>
                  <Text style={styles.emergencyText}>🆘 EMERGENCY</Text>
                </View>
              )}
              
              {translation.context && (
                <Text style={styles.contextText}>
                  {translation.context.toUpperCase()}
                </Text>
              )}
            </View>
            
            <Text style={styles.timestamp}>
              {formatTimestamp(translation.timestamp)}
            </Text>
          </View>

          {/* Verification buttons */}
          {!translation.isVerified && (
            <View style={styles.verificationButtons}>
              <TouchableOpacity
                style={[styles.verifyButton, styles.correctButton]}
                onPress={() => handleVerifyTranslation(translation._id, true)}
              >
                <CheckCircle size={16} color="#FFFFFF" />
                <Text style={styles.verifyButtonText}>Correct</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.verifyButton, styles.incorrectButton]}
                onPress={() => handleVerifyTranslation(translation._id, false)}
              >
                <XCircle size={16} color="#FFFFFF" />
                <Text style={styles.verifyButtonText}>Needs Work</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
    flex: 1,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  liveText: {
    color: '#10B981',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  translationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  translationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  languagePair: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 16,
    marginRight: 4,
  },
  languageCode: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginRight: 8,
  },
  arrow: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginRight: 8,
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  methodText: {
    color: '#10B981',
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  translationContent: {
    marginBottom: 12,
  },
  sourceText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
    lineHeight: 22,
  },
  translatedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
    lineHeight: 22,
  },
  tifinghText: {
    color: '#F59E0B',
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metadataLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  verifiedText: {
    color: '#10B981',
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  emergencyBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  emergencyText: {
    color: '#EF4444',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  contextText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    fontFamily: 'Inter-Medium',
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  verificationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  verifyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  correctButton: {
    backgroundColor: '#10B981',
  },
  incorrectButton: {
    backgroundColor: '#EF4444',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});

export default ConvexTranslationHistory;

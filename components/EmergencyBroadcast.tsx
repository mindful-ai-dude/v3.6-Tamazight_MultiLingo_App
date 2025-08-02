import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AlertTriangle, Radio, MapPin, Clock, Users, Send, Volume2 } from 'lucide-react-native';

interface EmergencyBroadcastProps {
  userLocation?: string;
  userId?: string;
}

export const EmergencyBroadcast: React.FC<EmergencyBroadcastProps> = ({
  userLocation = 'general',
  userId = 'anonymous'
}) => {
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState(8);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Real-time emergency broadcasts
  const activeBroadcasts = useQuery(api.emergency.getActiveEmergencyBroadcasts, {
    location: userLocation,
    urgencyLevel: 6 // Show medium to high priority
  });

  const createBroadcast = useMutation(api.emergency.createEmergencyBroadcast);
  const acknowledgeBroadcast = useMutation(api.emergency.acknowledgeEmergencyBroadcast);

  const handleBroadcastEmergency = async () => {
    if (!broadcastMessage.trim()) {
      Alert.alert('Error', 'Please enter an emergency message');
      return;
    }

    setIsBroadcasting(true);
    try {
      await createBroadcast({
        message: broadcastMessage,
        sourceLanguage: 'english',
        location: userLocation,
        urgencyLevel,
        category: 'emergency',
        broadcasterId: userId,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      });

      setBroadcastMessage('');
      Alert.alert(
        'Emergency Broadcast Sent',
        'Your emergency message has been broadcast to the community.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send emergency broadcast. Please try again.');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleAcknowledgeBroadcast = async (broadcastId: string) => {
    try {
      await acknowledgeBroadcast({
        broadcastId: broadcastId as any,
        userId
      });
    } catch (error) {
      console.error('Failed to acknowledge broadcast:', error);
    }
  };

  const getUrgencyColor = (level: number) => {
    if (level >= 9) return '#EF4444'; // Critical - Red
    if (level >= 7) return '#F59E0B'; // High - Orange
    if (level >= 5) return '#EAB308'; // Medium - Yellow
    return '#10B981'; // Low - Green
  };

  const getUrgencyLabel = (level: number) => {
    if (level >= 9) return 'CRITICAL';
    if (level >= 7) return 'HIGH';
    if (level >= 5) return 'MEDIUM';
    return 'LOW';
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

  const getTranslationForLanguage = (broadcast: any, language: string) => {
    const translation = broadcast.translations?.find((t: any) => t.language === language);
    return translation?.text || broadcast.message;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Emergency Broadcast Header */}
      <View style={styles.header}>
        <Radio size={24} color="#EF4444" />
        <Text style={styles.headerTitle}>Emergency Broadcast</Text>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* Create Emergency Broadcast */}
      <View style={styles.broadcastForm}>
        <Text style={styles.formTitle}>🆘 Send Emergency Alert</Text>
        
        <TextInput
          style={styles.messageInput}
          placeholder="Describe the emergency situation..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={broadcastMessage}
          onChangeText={setBroadcastMessage}
          multiline
          numberOfLines={3}
        />

        <View style={styles.urgencySelector}>
          <Text style={styles.urgencyLabel}>Urgency Level:</Text>
          <View style={styles.urgencyButtons}>
            {[6, 7, 8, 9, 10].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.urgencyButton,
                  { backgroundColor: urgencyLevel === level ? getUrgencyColor(level) : 'rgba(255, 255, 255, 0.1)' }
                ]}
                onPress={() => setUrgencyLevel(level)}
              >
                <Text style={[
                  styles.urgencyButtonText,
                  { color: urgencyLevel === level ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)' }
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.urgencyDescription}>
            {getUrgencyLabel(urgencyLevel)} Priority
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.broadcastButton, { opacity: isBroadcasting ? 0.6 : 1 }]}
          onPress={handleBroadcastEmergency}
          disabled={isBroadcasting}
        >
          <Send size={20} color="#FFFFFF" />
          <Text style={styles.broadcastButtonText}>
            {isBroadcasting ? 'Broadcasting...' : 'Broadcast Emergency'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Active Emergency Broadcasts */}
      <View style={styles.broadcastsList}>
        <Text style={styles.sectionTitle}>Active Emergency Alerts</Text>
        
        {!activeBroadcasts ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading emergency broadcasts...</Text>
          </View>
        ) : activeBroadcasts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <AlertTriangle size={48} color="#6B7280" />
            <Text style={styles.emptyTitle}>No Active Emergencies</Text>
            <Text style={styles.emptySubtitle}>
              All clear in your area. Stay safe!
            </Text>
          </View>
        ) : (
          activeBroadcasts.map((broadcast) => (
            <View key={broadcast._id} style={styles.broadcastCard}>
              {/* Broadcast Header */}
              <View style={styles.broadcastHeader}>
                <View style={styles.urgencyBadge}>
                  <AlertTriangle size={16} color={getUrgencyColor(broadcast.urgencyLevel)} />
                  <Text style={[styles.urgencyText, { color: getUrgencyColor(broadcast.urgencyLevel) }]}>
                    {getUrgencyLabel(broadcast.urgencyLevel)}
                  </Text>
                </View>
                
                <View style={styles.locationBadge}>
                  <MapPin size={14} color="#3B82F6" />
                  <Text style={styles.locationText}>{broadcast.location}</Text>
                </View>
              </View>

              {/* Broadcast Message */}
              <Text style={styles.broadcastMessage}>{broadcast.message}</Text>

              {/* Translations */}
              {broadcast.translations && broadcast.translations.length > 0 && (
                <View style={styles.translations}>
                  <Text style={styles.translationsTitle}>Translations:</Text>
                  
                  {/* Tamazight Translation */}
                  {broadcast.translations.find((t: any) => t.language === 'tamazight') && (
                    <View style={styles.translationItem}>
                      <Text style={styles.translationLanguage}>ⵜⵎⵣⵖⵜ Tamazight:</Text>
                      <Text style={styles.translationText}>
                        {getTranslationForLanguage(broadcast, 'tamazight')}
                      </Text>
                    </View>
                  )}

                  {/* Arabic Translation */}
                  {broadcast.translations.find((t: any) => t.language === 'arabic') && (
                    <View style={styles.translationItem}>
                      <Text style={styles.translationLanguage}>🇲🇦 العربية:</Text>
                      <Text style={styles.translationText}>
                        {getTranslationForLanguage(broadcast, 'arabic')}
                      </Text>
                    </View>
                  )}

                  {/* French Translation */}
                  {broadcast.translations.find((t: any) => t.language === 'french') && (
                    <View style={styles.translationItem}>
                      <Text style={styles.translationLanguage}>🇫🇷 Français:</Text>
                      <Text style={styles.translationText}>
                        {getTranslationForLanguage(broadcast, 'french')}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Broadcast Metadata */}
              <View style={styles.broadcastFooter}>
                <View style={styles.metadataLeft}>
                  <Clock size={14} color="rgba(255, 255, 255, 0.6)" />
                  <Text style={styles.timestampText}>
                    {formatTimestamp(broadcast.timestamp)}
                  </Text>
                  
                  {broadcast.reachCount && broadcast.reachCount > 0 && (
                    <>
                      <Users size={14} color="rgba(255, 255, 255, 0.6)" />
                      <Text style={styles.reachText}>
                        {broadcast.reachCount} acknowledged
                      </Text>
                    </>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.acknowledgeButton}
                  onPress={() => handleAcknowledgeBroadcast(broadcast._id)}
                >
                  <Text style={styles.acknowledgeButtonText}>Acknowledge</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 4,
  },
  liveText: {
    color: '#EF4444',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  broadcastForm: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  formTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  messageInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  urgencySelector: {
    marginBottom: 16,
  },
  urgencyLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  urgencyButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  urgencyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  urgencyButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  urgencyDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  broadcastButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  broadcastButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  broadcastsList: {
    marginTop: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
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
  },
  broadcastCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  broadcastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgencyText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    marginLeft: 4,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  locationText: {
    color: '#3B82F6',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  broadcastMessage: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    marginBottom: 16,
  },
  translations: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  translationsTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  translationItem: {
    marginBottom: 8,
  },
  translationLanguage: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  translationText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  broadcastFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metadataLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timestampText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  reachText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  acknowledgeButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  acknowledgeButtonText: {
    color: '#10B981',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});

export default EmergencyBroadcast;

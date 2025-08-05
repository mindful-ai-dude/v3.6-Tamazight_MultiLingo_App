import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { GlassCard } from './GlassCard';
import { Database, Download, Trash2, BarChart3 } from 'lucide-react-native';
import { loadDatasetToDatabase, getDatasetStats } from '@/utils/datasetLoader';

interface DatasetImporterProps {
  onImportComplete?: () => void;
}

export function DatasetImporter({ onImportComplete }: DatasetImporterProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importStats, setImportStats] = useState<{
    totalTranslations: number;
    languagePairs: Array<{ from: string; to: string; count: number }>;
  } | null>(null);

  const handleImportDataset = async () => {
    try {
      setIsImporting(true);

      // Load the static dataset into the database
      const result = await loadDatasetToDatabase();

      // Get updated stats
      const stats = getDatasetStats();
      setImportStats({
        totalTranslations: stats.totalTranslations,
        languagePairs: stats.languagePairs.map(item => ({
          from: item.pair.split(' → ')[0],
          to: item.pair.split(' → ')[1],
          count: item.count
        }))
      });
      
      Alert.alert(
        'Import Successful! 🎉',
        `Imported ${result.imported} high-quality translations from the Gemma-3n fine-tuning evaluation dataset.\n\nOffline mode now has access to real Tamazight translations!`,
        [{ text: 'Awesome!' }]
      );
      
      onImportComplete?.();
      
    } catch (error) {
      console.error('Import failed:', error);
      Alert.alert(
        'Import Failed',
        'Failed to import the dataset. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsImporting(false);
    }
  };

  const handleClearDataset = async () => {
    Alert.alert(
      'Clear Dataset',
      'Are you sure you want to clear all imported translations? This will remove the enhanced offline translations.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              const { databaseService } = await import('@/services/databaseService');
              await databaseService.initialize();
              await databaseService.clearHistory();
              setImportStats(null);
              Alert.alert('Cleared', 'All imported translations have been removed.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear dataset.');
            }
          }
        }
      ]
    );
  };

  const handleShowStats = async () => {
    try {
      const stats = getDatasetStats();
      const formattedStats = {
        totalTranslations: stats.totalTranslations,
        languagePairs: stats.languagePairs.map(item => ({
          from: item.pair.split(' → ')[0],
          to: item.pair.split(' → ')[1],
          count: item.count
        }))
      };

      setImportStats(formattedStats);

      const languagePairText = formattedStats.languagePairs
        .map(pair => `• ${pair.from} → ${pair.to}: ${pair.count}`)
        .join('\n');

      Alert.alert(
        'Dataset Statistics',
        `Total Translations: ${formattedStats.totalTranslations}\n\nLanguage Pairs:\n${languagePairText}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to get statistics.');
    }
  };

  return (
    <GlassCard style={styles.container}>
      <View style={styles.header}>
        <Database size={24} color="#FFFFFF" strokeWidth={2} />
        <Text style={styles.title}>Tamazight Dataset</Text>
      </View>
      
      <Text style={styles.description}>
        Import the Gemma-3n fine-tuning evaluation dataset to enhance offline translations with real, high-quality Tamazight translations.
      </Text>

      {importStats && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>📊 Current Dataset</Text>
          <Text style={styles.statsText}>
            {importStats.totalTranslations} translations loaded
          </Text>
          <Text style={styles.statsSubtext}>
            Covering {importStats.languagePairs.length} language pairs
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.importButton, isImporting && styles.buttonDisabled]}
          onPress={handleImportDataset}
          disabled={isImporting}
        >
          <Download size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.buttonText}>
            {isImporting ? 'Importing...' : 'Import Dataset'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.statsButton]}
          onPress={handleShowStats}
        >
          <BarChart3 size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.buttonText}>Statistics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={handleClearDataset}
        >
          <Trash2 size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 20,
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statsSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  importButton: {
    backgroundColor: '#10B981',
  },
  statsButton: {
    backgroundColor: '#3B82F6',
  },
  clearButton: {
    backgroundColor: '#EF4444',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});

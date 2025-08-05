/**
 * Dataset Import Script
 * 
 * This script imports the Tamazight evaluation dataset into the local SQLite database
 * for use in offline translation mode during demos.
 */

import { datasetImportService } from '../services/datasetImportService';
import * as FileSystem from 'expo-file-system';

const DATASET_PATH = 'dataset/10719_Tamazight_Dataset_eval.jsonl';

async function importDataset() {
  try {
    console.log('🚀 Starting Tamazight Dataset Import...');
    console.log('=====================================');
    
    // Check if dataset file exists
    const fileExists = await FileSystem.getInfoAsync(DATASET_PATH);
    if (!fileExists.exists) {
      throw new Error(`Dataset file not found: ${DATASET_PATH}`);
    }
    
    console.log(`📁 Dataset file found: ${DATASET_PATH}`);
    console.log(`📊 File size: ${Math.round(fileExists.size! / 1024)} KB`);
    
    // Import dataset (limit to 1000 entries for demo)
    const result = await datasetImportService.importDataset(DATASET_PATH, 1000);
    
    console.log('\n✅ Import Results:');
    console.log(`   • Imported: ${result.imported} translations`);
    console.log(`   • Skipped: ${result.skipped} entries`);
    console.log(`   • Errors: ${result.errors} entries`);
    
    // Get statistics
    const stats = await datasetImportService.getImportStats();
    
    console.log('\n📈 Database Statistics:');
    console.log(`   • Total translations: ${stats.totalTranslations}`);
    console.log('\n🌍 Language Pairs:');
    stats.languagePairs.forEach(pair => {
      console.log(`   • ${pair.from} → ${pair.to}: ${pair.count} translations`);
    });
    
    console.log('\n📋 Contexts:');
    stats.contexts.forEach(ctx => {
      console.log(`   • ${ctx.context}: ${ctx.count} translations`);
    });
    
    console.log('\n🎉 Dataset import completed successfully!');
    console.log('The offline translation mode now has access to real Tamazight translations.');
    
  } catch (error) {
    console.error('❌ Dataset import failed:', error);
    process.exit(1);
  }
}

async function clearDataset() {
  try {
    console.log('🗑️  Clearing imported dataset...');
    await datasetImportService.clearImportedData();
    console.log('✅ Dataset cleared successfully!');
  } catch (error) {
    console.error('❌ Failed to clear dataset:', error);
    process.exit(1);
  }
}

// Main execution
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'import':
      await importDataset();
      break;
    case 'clear':
      await clearDataset();
      break;
    case 'stats':
      try {
        const stats = await datasetImportService.getImportStats();
        console.log('📊 Current Database Statistics:');
        console.log(`   • Total translations: ${stats.totalTranslations}`);
        console.log('\n🌍 Language Pairs:');
        stats.languagePairs.forEach(pair => {
          console.log(`   • ${pair.from} → ${pair.to}: ${pair.count} translations`);
        });
      } catch (error) {
        console.error('❌ Failed to get stats:', error);
      }
      break;
    default:
      console.log('📖 Usage:');
      console.log('  npm run dataset:import  - Import the evaluation dataset');
      console.log('  npm run dataset:clear   - Clear all imported data');
      console.log('  npm run dataset:stats   - Show database statistics');
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { importDataset, clearDataset };

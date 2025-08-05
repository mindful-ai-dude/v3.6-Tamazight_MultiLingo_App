// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add TypeScript extensions to the resolver
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json', 'mjs'];

// Add .tflite files as assets for AI model support, .wasm for expo-sqlite web support, and audio files
config.resolver.assetExts.push('tflite', 'task', 'wasm', 'mp3', 'MP3', 'wav', 'aac', 'm4a');

// Add resolver configuration for Google Generative AI
config.resolver.alias = {
  '@google/generative-ai': require.resolve('@google/generative-ai'),
};

// Add transformer configuration to handle TypeScript files
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = config;
## Architecture for handling multiple scripts and languages:

## Language Definition Architecture 🌐

````typescript path=components/LanguageSelector.tsx mode=EXCERPT
const LANGUAGES = [
  'Arabic (العربية)',
  'English',
  'French (Français)',
  'Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)'
];
````

## Script Support Implementation 📝

### Tifinagh Script Integration
````typescript path=components/TifinghKeyboard.tsx mode=EXCERPT
const TIFINAGH_CHARACTERS = [
  ['ⴰ', 'ⴱ', 'ⴳ', 'ⴷ', 'ⴹ', 'ⴻ', 'ⴼ', 'ⴳ', 'ⵀ', 'ⵃ'],
  ['ⵉ', 'ⵊ', 'ⴽ', 'ⵍ', 'ⵎ', 'ⵏ', 'ⵓ', 'ⵔ', 'ⵕ', 'ⵖ'],
  ['ⵙ', 'ⵚ', 'ⵛ', 'ⵜ', 'ⵟ', 'ⵡ', 'ⵢ', 'ⵣ', 'ⵥ', 'ⵯ']
];
````

### Language Code Mapping
````typescript path=components/TranslationInput.tsx mode=EXCERPT
const getLanguageCode = (language: string): string => {
  if (language.includes('Arabic')) return 'ar';
  if (language.includes('French')) return 'fr';
  if (language.includes('English')) return 'en';
  if (language.includes('Tamazight')) return 'ar'; // Fallback
  return 'en';
};
````

## Multi-Directional Translation Architecture 🔄

### Translation Matrix Support
````typescript path=app/(tabs)/index.tsx mode=EXCERPT
const handleTranslate = async () => {
  if (fromLanguage === 'English' && toLanguage.includes('Tamazight')) {
    setOutputText('ⴰⵣⵓⵍ ⴰⴼⵍⵍⴰⵙ');
  } else if (fromLanguage.includes('Tamazight') && toLanguage === 'English') {
    setOutputText('Hello, peace be with you');
  } else if (fromLanguage.includes('Arabic') && toLanguage.includes('Tamazight')) {
    setOutputText('ⴰⵣⵓⵍ ⴰⴼⵍⵍⴰⵙ');
  }
};
````

## Specialized Domain Support 🏛️

### Government/Parliamentary Context
````typescript path=app/(tabs)/government.tsx mode=EXCERPT
const GOVERNMENT_PHRASES: GovernmentPhrase[] = [
  {
    english: 'I request to speak in Tamazight',
    tamazight: 'ⴰⵔⴰⵖ ⴰⴷ ⵙⴰⵡⵍⵖ ⵙ ⵜⵎⴰⵣⵉⵖⵜ',
    arabic: 'أطلب أن أتحدث بالأمازيغية',
    french: 'Je demande à parler en tamazight',
    context: 'Parliamentary proceedings',
  }
];
````

### Emergency Context with Audio
````typescript path=constants/AudioFiles.ts mode=EXCERPT
export const TAMAZIGHT_AUDIO_FILES = {
  'I am lost': 'https://raw.githubusercontent.com/tamazightdev/Tamazight_MultiLingo_App/main/assets/audio/tamazight%20i%20am%20lost.MP3',
  'Call the police': 'https://raw.githubusercontent.com/tamazightdev/Tamazight_MultiLingo_App/main/assets/audio/tamazight%20call%20the%20police.MP3',
};
````

## Planned Tamazight Variant Support 🗺️

Based on documentation, the architecture is designed for:

### Current Implementation (v1.0):
- **Tachelhit** - Souss region variant
- **Tifinagh Script** - Native script support
- **Latin Script** - Alternative input method

### Future Expansion (v2.0):
- **Central Atlas Tamazight** - Primary variant
- **Tarifit** - Northern Rif region variant
- **Auto-detection** - Variant identification

## AI Model Architecture 🤖

### Dual Model Strategy:
Offline-first, with two models:
- **Gemma-3n-4b-it**: Multimodal with OCR (4B parameters)

Online Model
- **Gemma-3-12b**

### Script Processing Pipeline:
1. **Input Detection**: Identify script type (Tifinagh/Latin/Arabic)
2. **Language Classification**: Determine source language
3. **Translation Processing**: Route to appropriate model
4. **Output Formatting**: Render in target script

## Current Limitations:
- **TTS Support**: Missing Tamazight language codes
- **Variant Detection**: Not yet implemented
- **Script Conversion**: No automatic Tifinagh ↔ Latin conversion



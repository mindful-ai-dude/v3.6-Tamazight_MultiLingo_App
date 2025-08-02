// Audio files for emergency and government phrases
export const TAMAZIGHT_AUDIO_FILES = {
  // Emergency phrases with their corresponding audio URLs
  'I am lost': 'https://raw.githubusercontent.com/tamazightdev/Tamazight_MultiLingo_App/main/assets/audio/tamazight%20i%20am%20lost.MP3',
  'Call the police': 'https://raw.githubusercontent.com/tamazightdev/Tamazight_MultiLingo_App/main/assets/audio/tamazight%20call%20the%20police.MP3',
  'I need medical help immediately': 'https://raw.githubusercontent.com/tamazightdev/Tamazight_MultiLingo_App/main/assets/audio/tamazight%20i%20need%20medical%20help.MP3',
  'Where is the hospital?': 'https://raw.githubusercontent.com/tamazightdev/Tamazight_MultiLingo_App/main/assets/audio/tamazight%20where%20is%20the%20hospital.MP3',
  'I need an interpreter': 'https://raw.githubusercontent.com/tamazightdev/Tamazight_MultiLingo_App/main/assets/audio/tamazight%20i%20need%20an%20interpreter.m4a',
} as const;

// French audio files for emergency and government phrases
export const FRENCH_AUDIO_FILES = {
  'Call the police': 'https://raw.githubusercontent.com/tamazightdev/Tamazight_MultiLingo_App/main/assets/audio/french%20call%20the%20police.mp3',
  'I need medical help immediately': 'https://raw.githubusercontent.com/tamazightdev/Tamazight_MultiLingo_App/main/assets/audio/french%20i%20need%20medical%20help.mp3',
  'I need an interpreter': 'https://raw.githubusercontent.com/tamazightdev/Tamazight_MultiLingo_App/main/assets/audio/french%20i%20need%20an%20interpreter.mp3',
} as const;

// Helper function to get audio URL for a phrase in a specific language
export function getAudioUrl(englishPhrase: string, language: 'tamazight' | 'french'): string | null {
  if (language === 'tamazight') {
    return TAMAZIGHT_AUDIO_FILES[englishPhrase as keyof typeof TAMAZIGHT_AUDIO_FILES] || null;
  } else if (language === 'french') {
    return FRENCH_AUDIO_FILES[englishPhrase as keyof typeof FRENCH_AUDIO_FILES] || null;
  }
  return null;
}

// Helper function to get Tamazight audio URL (backward compatibility)
export function getTamazightAudioUrl(englishPhrase: string): string | null {
  return getAudioUrl(englishPhrase, 'tamazight');
}

// Helper function to check if audio is available for a phrase in any language
export function hasAudio(englishPhrase: string): boolean {
  return englishPhrase in TAMAZIGHT_AUDIO_FILES || englishPhrase in FRENCH_AUDIO_FILES;
}

// Helper function to check if Tamazight audio is available (backward compatibility)
export function hasTamazightAudio(englishPhrase: string): boolean {
  return englishPhrase in TAMAZIGHT_AUDIO_FILES;
}
// Audio files for emergency and government phrases
export const TAMAZIGHT_AUDIO_FILES = {
  // Emergency phrases with their corresponding local audio files (matching exact filenames)
  'I am lost': require('../assets/audio/tamazight-i am lost.MP3'),
  'Call the police': require('../assets/audio/tamazight-call the police.MP3'),
  'I need medical help immediately': require('../assets/audio/tamazight-i need medical help immediately.MP3'),
  'Where is the hospital?': require('../assets/audio/tamazight-Where is the hospital.MP3'),
  'I am having chest pain': require('../assets/audio/tamazight-I have a chest pain.MP3'),
  'I need an interpreter': require('../assets/audio/tamazight-i need an interpreter.MP3'),
  'I need water': require('../assets/audio/tamazight-i nned water.MP3'), // Note: filename has typo "nned"

  // Government/Official phrases (matching exact filenames)
  'Can this form be provided in Tamazight?': require('../assets/audio/tamazight-can this form be translated into tamazight.MP3'),
  'I request to speak in Tamazight': require('../assets/audio/tamazight-I request to speak in tamazight.MP3'),
  'What are my linguistic rights?': require('../assets/audio/tamazight-what are my linguistic rights.MP3'),
  'Where can I get official documents translated?': require('../assets/audio/tamazight-where can I get official documents translated.MP3'),
  'I want my child to learn Tamazight': require('../assets/audio/tamazight-I want my child to learn tamazight.MP3'),
  'Omar tell us what this means': require('../assets/audio/tamazight-omar tell us what this means.MP3'),
} as const;

// French audio files for emergency and government phrases (Professional Alice voice)
export const FRENCH_AUDIO_FILES = {
  // Emergency phrases (matching simplified filenames without special characters)
  'I am lost': require('../assets/audio/french Je suis perdu.mp3'),
  'Call the police': require('../assets/audio/french Appelez la police (alice).mp3'),
  'I need medical help immediately': require('../assets/audio/french J ai besoin d aide medicale immediatement.mp3'),
  'Where is the hospital?': require('../assets/audio/french Ou est l hopital.mp3'),
  'I need an interpreter': require('../assets/audio/french J ai besoin d un interprete.mp3'),
  'I need water': require('../assets/audio/french J ai besoin d eau.mp3'),
  'I am having chest pain': require('../assets/audio/french Jai mal a la poitrine.mp3'),

  // Government/Official phrases (matching simplified filenames)
  'Can this form be provided in Tamazight?': require('../assets/audio/french Ce formulaire peut-il etre fourni en tamazirt.mp3'),
  'I request to speak in Tamazight': require('../assets/audio/french Je demande a parler en tamazirt.mp3'),
  'What are my linguistic rights?': require('../assets/audio/french Quels sont mes droits linguistiques.mp3'),
  'Where can I get official documents translated?': require('../assets/audio/french Ou puis je faire traduire les documents officiels.mp3'),
  'I want my child to learn Tamazight': require('../assets/audio/french Je veux que mon enfant apprenne le tamazight.mp3'),
} as const;

// Arabic audio files for emergency and government phrases (Professional recordings)
export const ARABIC_AUDIO_FILES = {
  // Emergency phrases (matching exact filenames)
  'I am lost': require('../assets/audio/arabic-i am lost.MP3'),
  'Call the police': require('../assets/audio/arabic-call the police.MP3'),
  'I need medical help immediately': require('../assets/audio/arabic-i need medical help immediately.MP3'),
  'Where is the hospital?': require('../assets/audio/arabic-where is the hospital.MP3'),
  'I am having chest pain': require('../assets/audio/arabic-i am having chest pain.MP3'),
  'I need an interpreter': require('../assets/audio/arabic-i need an interpreter.MP3'),
  'I need water': require('../assets/audio/arabic-i need water.MP3'),

  // Government/Official phrases (matching exact filenames)
  'Can this form be provided in Tamazight?': require('../assets/audio/arabic-can this form be provided in tamazight.MP3'),
  'I request to speak in Tamazight': require('../assets/audio/arabic-i request to speak in tamazight.MP3'),
  'What are my linguistic rights?': require('../assets/audio/arabic-what are my linguistic rights.MP3'),
  'Where can I get official documents translated?': require('../assets/audio/arabic-where can I get official documents translated.MP3'),
  'I want my child to learn Tamazight': require('../assets/audio/arabic-i want my child to learn tamazight.MP3'),
} as const;

// English audio files for emergency and government phrases (Professional recordings)
export const ENGLISH_AUDIO_FILES = {
  // Emergency phrases (matching exact filenames)
  'I am lost': require('../assets/audio/english-i am lost.MP3'),
  'Call the police': require('../assets/audio/english-call the police.MP3'),
  'I need medical help immediately': require('../assets/audio/english-i need medical help immediately.MP3'),
  'Where is the hospital?': require('../assets/audio/english-whre is the hospital.MP3'), // Note: filename has typo "whre"
  'I am having chest pain': require('../assets/audio/english-i am having chest pain.MP3'),
  'I need water': require('../assets/audio/english-i need water.MP3'),

  // Government/Official phrases (matching exact filenames)
  'I need an interpreter': require('../assets/audio/english-i need an interpreter.MP3'),
  'I request to speak in Tamazight': require('../assets/audio/english-i request to speak in Tamazight.MP3'),
  'Can this form be provided in Tamazight?': require('../assets/audio/english-can this form be provided in tamazight.MP3'),
  'What are my linguistic rights?': require('../assets/audio/english-what are my linguistic rights.MP3'),
  'Where can I get official documents translated?': require('../assets/audio/english-where can i get official documents translated.MP3'),
  'I want my child to learn Tamazight': require('../assets/audio/english-i want my child to learn tamazight.MP3'),
} as const;

// Helper function to get audio file for a phrase in a specific language
export function getAudioFile(englishPhrase: string, language: 'tamazight' | 'french' | 'arabic' | 'english'): any | null {
  if (language === 'tamazight') {
    const audioFile = TAMAZIGHT_AUDIO_FILES[englishPhrase as keyof typeof TAMAZIGHT_AUDIO_FILES];
    return audioFile !== undefined && audioFile !== null ? audioFile : null;
  } else if (language === 'french') {
    const audioFile = FRENCH_AUDIO_FILES[englishPhrase as keyof typeof FRENCH_AUDIO_FILES];
    return audioFile !== undefined && audioFile !== null ? audioFile : null;
  } else if (language === 'arabic') {
    const audioFile = ARABIC_AUDIO_FILES[englishPhrase as keyof typeof ARABIC_AUDIO_FILES];
    return audioFile !== undefined && audioFile !== null ? audioFile : null;
  } else if (language === 'english') {
    const audioFile = ENGLISH_AUDIO_FILES[englishPhrase as keyof typeof ENGLISH_AUDIO_FILES];
    return audioFile !== undefined && audioFile !== null ? audioFile : null;
  }
  return null;
}

// Helper function to get audio URL for a phrase in a specific language (backward compatibility)
export function getAudioUrl(englishPhrase: string, language: 'tamazight' | 'french' | 'arabic' | 'english'): string | null {
  const audioFile = getAudioFile(englishPhrase, language);
  return audioFile ? audioFile : null;
}

// Helper function to get Tamazight audio URL (backward compatibility)
export function getTamazightAudioUrl(englishPhrase: string): any | null {
  return getAudioFile(englishPhrase, 'tamazight');
}

// Helper function to get French audio file
export function getFrenchAudioFile(englishPhrase: string): any | null {
  return getAudioFile(englishPhrase, 'french');
}

// Helper function to get Arabic audio file
export function getArabicAudioFile(englishPhrase: string): any | null {
  return getAudioFile(englishPhrase, 'arabic');
}

// Helper function to get English audio file
export function getEnglishAudioFile(englishPhrase: string): any | null {
  return getAudioFile(englishPhrase, 'english');
}

// Helper function to check if audio is available for a phrase in any language
export function hasAudio(englishPhrase: string): boolean {
  return englishPhrase in TAMAZIGHT_AUDIO_FILES ||
         englishPhrase in FRENCH_AUDIO_FILES ||
         englishPhrase in ARABIC_AUDIO_FILES ||
         englishPhrase in ENGLISH_AUDIO_FILES;
}

// Helper function to check if Tamazight audio is available (backward compatibility)
export function hasTamazightAudio(englishPhrase: string): boolean {
  return englishPhrase in TAMAZIGHT_AUDIO_FILES;
}

// Helper function to check if French audio is available
export function hasFrenchAudio(englishPhrase: string): boolean {
  return englishPhrase in FRENCH_AUDIO_FILES;
}

// Helper function to check if Arabic audio is available
export function hasArabicAudio(englishPhrase: string): boolean {
  return englishPhrase in ARABIC_AUDIO_FILES;
}

// Helper function to check if English audio is available
export function hasEnglishAudio(englishPhrase: string): boolean {
  return englishPhrase in ENGLISH_AUDIO_FILES;
}

// Helper function to check if audio is available for a specific language
export function hasAudioForLanguage(englishPhrase: string, language: 'tamazight' | 'french' | 'arabic' | 'english'): boolean {
  if (language === 'tamazight') {
    return hasTamazightAudio(englishPhrase);
  } else if (language === 'french') {
    return hasFrenchAudio(englishPhrase);
  } else if (language === 'arabic') {
    return hasArabicAudio(englishPhrase);
  } else if (language === 'english') {
    return hasEnglishAudio(englishPhrase);
  }
  return false;
}
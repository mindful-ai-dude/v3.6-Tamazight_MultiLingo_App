import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ModeProvider } from './context/ModeContext';
import { databaseService } from '@/services/databaseService';
import { offlineAIService } from '@/services/offlineAIService';

SplashScreen.preventAutoHideAsync();

// Initialize Convex client for real-time database
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize database
        await databaseService.initialize();
        console.log('Database initialized successfully');

        // Initialize offline AI service
        await offlineAIService.initialize();
        console.log('Offline AI service initialized successfully');

        // Preload emergency phrases for faster access
        await offlineAIService.preloadEmergencyPhrases();
      } catch (error) {
        console.error('Failed to initialize app services:', error);
      }

      if (fontsLoaded || fontError) {
        SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ConvexProvider client={convex}>
      <ModeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </ModeProvider>
    </ConvexProvider>
  );
}
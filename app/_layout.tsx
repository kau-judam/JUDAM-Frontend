import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/contexts/AuthContext';
import { CommunityProvider } from '@/contexts/CommunityContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { FundingProvider } from '@/contexts/FundingContext';

export const unstable_settings = {
  // 앱의 시작점을 루트(index)로 고정하여 온보딩이 가장 먼저 뜨게 합니다.
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CommunityProvider>
          <FavoritesProvider>
            <FundingProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ headerShown: false }}>
                  {/* index.tsx가 온보딩 화면입니다. */}
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                </Stack>
              </ThemeProvider>
            </FundingProvider>
          </FavoritesProvider>
        </CommunityProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

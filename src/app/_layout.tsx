import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { ApiKeyProvider } from '@/contexts/ApiKeyContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Customized Navigation Themes
  const lightNavigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#6366f1',
      background: '#f9fafb',
      card: '#ffffff',
      border: '#e5e7eb',
    },
  };

  const darkNavigationTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#6366f1',
      background: '#111827',
      card: '#1f2937',
      border: '#374151',
    },
  };

  return (
    <ApiKeyProvider>
      <ThemeProvider value={isDark ? darkNavigationTheme : lightNavigationTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
            },
            headerTintColor: isDark ? '#ffffff' : '#111827',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ presentation: 'modal', title: '설정' }} />
          <Stack.Screen name="book/[bookId]" options={{ title: '교재 학습' }} />
          <Stack.Screen name="book/lesson/[lessonId]" options={{ title: '레슨 학습' }} />
          <Stack.Screen name="practice/vocabulary" options={{ title: '단어 플래시카드' }} />
          <Stack.Screen name="practice/grammar" options={{ title: '문법 연습' }} />
          <Stack.Screen name="practice/speaking" options={{ title: '스피킹 따라하기' }} />
        </Stack>
      </ThemeProvider>
    </ApiKeyProvider>
  );
}

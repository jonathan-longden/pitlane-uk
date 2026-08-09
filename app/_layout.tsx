import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FiltersProvider } from '../src/state/FiltersContext';
import { PhotosProvider } from '../src/state/PhotosContext';
import { SavedProvider } from '../src/state/SavedContext';
import { colors } from '../src/theme';

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
  },
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <ThemeProvider value={navTheme}>
          <SavedProvider>
            <PhotosProvider>
            <FiltersProvider>
              <StatusBar style="light" />
              <Stack
                screenOptions={{
                  headerStyle: { backgroundColor: colors.bg },
                  headerTintColor: colors.text,
                  headerShadowVisible: false,
                  contentStyle: { backgroundColor: colors.bg },
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="event/[id]"
                  options={{ title: '', headerTransparent: true }}
                />
                <Stack.Screen
                  name="filters"
                  options={{ presentation: 'modal', title: 'Filters' }}
                />
              </Stack>
            </FiltersProvider>
            </PhotosProvider>
          </SavedProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

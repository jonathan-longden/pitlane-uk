# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Things that bite in this project

- **No `babel.config.js`.** SDK 57 supplies its own preset. Adding one breaks
  the Metro transformer with a confusing `Cannot read properties of undefined
  (reading 'transformFile')`.
- **`Tabs` moved.** Import it from `expo-router/js-tabs`; the root export is
  deprecated. `Stack`, `Link`, `ThemeProvider` and `DarkTheme` all come from
  `expo-router` itself — React Navigation is no longer a dependency.
- **`react-native-maps` is native-only.** `EventMap.tsx` is the native map and
  `EventMap.web.tsx` is the web fallback; the shared prop type lives in
  `EventMap.types.ts` so neither file imports the other.
- **Screens never import `seed.ts`.** All data goes through `EventRepository`
  in `src/data/repository.ts`, which is what makes the backend swappable.

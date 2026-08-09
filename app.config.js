/**
 * Dynamic Expo config layered on top of app.json.
 *
 * Its only job is to inject the Android Google Maps API key from the
 * environment instead of hard-coding it in app.json. Without a key,
 * react-native-maps renders a blank grey map on Android — iOS uses Apple Maps
 * and needs nothing.
 *
 * The key is read from GOOGLE_MAPS_ANDROID_API_KEY. Expo loads .env files
 * automatically, so local development only needs a .env file (git-ignored).
 * See .env.example and the README.
 *
 * A note on secrecy: this key ships inside the Android binary and can be
 * extracted from any installed APK, so keeping it out of git is not what
 * protects it — restricting it to the uk.co.pitlane.app package and your
 * signing certificate's SHA-1 is. Keeping it out of git protects you from
 * bots that scrape public repos for unrestricted keys and spend your quota.
 */
module.exports = ({ config }) => {
  const apiKey = process.env.GOOGLE_MAPS_ANDROID_API_KEY;

  if (!apiKey && process.env.EAS_BUILD_PLATFORM === 'android') {
    // Loud during a real Android build, where a blank map would otherwise
    // only be discovered by opening the app.
    console.warn(
      '\n[app.config.js] GOOGLE_MAPS_ANDROID_API_KEY is not set. ' +
        'The Android build will show a blank grey map.\n',
    );
  }

  // GitHub Pages serves project sites from a subpath (/pitlane-uk), so the
  // web export needs to know its base or every asset URL 404s. Set only when
  // building for Pages — leaving it unset keeps the dev server at the root.
  const baseUrl = process.env.PAGES_BASE_URL;

  return {
    ...config,
    android: {
      ...config.android,
      ...(apiKey
        ? { config: { ...config.android?.config, googleMaps: { apiKey } } }
        : {}),
    },
    experiments: {
      ...config.experiments,
      ...(baseUrl ? { baseUrl } : {}),
    },
  };
};

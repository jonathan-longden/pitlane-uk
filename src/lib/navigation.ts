import type { Ionicons } from '@expo/vector-icons';
import { Linking, Platform } from 'react-native';
import type { CarEvent } from '../types';

export interface NavigationApp {
  id: 'apple' | 'google' | 'waze';
  label: string;
  detail: string;
  icon: keyof typeof Ionicons.glyphMap;
  url: (event: CarEvent) => string;
}

/**
 * Every option uses an https/http link rather than a private scheme
 * (`waze://`, `comgooglemaps://`). Those need `canOpenURL`, which in turn needs
 * LSApplicationQueriesSchemes on iOS and a <queries> manifest entry on Android
 * 11+, and silently reports "not installed" when either is missing. The public
 * links open the app when it is installed and the website when it is not, on
 * every platform, with nothing to declare.
 */
const APPS: NavigationApp[] = [
  {
    id: 'waze',
    label: 'Waze',
    detail: 'Live traffic, fastest route',
    icon: 'navigate-circle-outline',
    // navigate=yes starts routing on arrival rather than just dropping a pin,
    // so Waze picks the route itself from live conditions.
    url: (e) => `https://waze.com/ul?ll=${e.latitude},${e.longitude}&navigate=yes`,
  },
  {
    id: 'google',
    label: 'Google Maps',
    detail: 'Driving directions',
    icon: 'map-outline',
    url: (e) =>
      `https://www.google.com/maps/dir/?api=1&destination=${e.latitude},${e.longitude}&travelmode=driving`,
  },
  {
    id: 'apple',
    label: 'Apple Maps',
    detail: 'Driving directions',
    icon: 'compass-outline',
    url: (e) =>
      `http://maps.apple.com/?daddr=${e.latitude},${e.longitude}&dirflg=d&q=${encodeURIComponent(
        e.venue,
      )}`,
  },
];

/** The navigation apps worth offering on the current platform. */
export function navigationApps(): NavigationApp[] {
  return APPS.filter((app) => app.id !== 'apple' || Platform.OS === 'ios');
}

export function openNavigation(app: NavigationApp, event: CarEvent): void {
  Linking.openURL(app.url(event)).catch(() => {});
}

/**
 * Dark-first automotive palette. The app is locked to dark mode (app.json
 * userInterfaceStyle) because meets are overwhelmingly evening events and a
 * dark UI reads better on a phone propped on a dashboard.
 */
export const colors = {
  bg: '#0B0D10',
  surface: '#14171C',
  surfaceHigh: '#1C2027',
  border: '#262B33',
  text: '#F2F4F7',
  textMuted: '#98A2B3',
  textFaint: '#667085',
  accent: '#FF6B2C',
  accentSoft: 'rgba(255, 107, 44, 0.14)',
  success: '#2ECC71',
  danger: '#F04438',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

export const type = {
  display: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5 },
  title: { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.3 },
  heading: { fontSize: 16, fontWeight: '700' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  label: { fontSize: 13, fontWeight: '600' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
} as const;

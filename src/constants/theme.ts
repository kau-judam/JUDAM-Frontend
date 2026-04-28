export const Colors = {
  light: {
    text: '#111111',
    background: '#ffffff',
    primary: '#111111',
    primaryForeground: '#ffffff',
    secondary: '#f3f4f6',
    secondaryForeground: '#111111',
    muted: '#f3f4f6',
    mutedForeground: '#6b7280',
    accent: '#f3f4f6',
    accentForeground: '#111111',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#e5e7eb',
    input: '#ffffff',
    ring: '#111111',
    tint: '#111111',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#111111',
  },
  dark: {
    text: '#F5F1E8',
    background: '#1A0F0A',
    primary: '#8B5A3C',
    primaryForeground: '#F5F1E8',
    secondary: '#3D2415',
    secondaryForeground: '#E8DCC8',
    muted: '#4A2C1D',
    mutedForeground: '#B8A488',
    accent: '#A0522D',
    accentForeground: '#F5F1E8',
    destructive: '#A43820',
    destructiveForeground: '#F5F1E8',
    border: 'rgba(139, 90, 60, 0.2)',
    input: '#3D2415',
    ring: '#8B5A3C',
    tint: '#8B5A3C',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#8B5A3C',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
};

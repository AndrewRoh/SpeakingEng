import { Platform } from 'react-native';

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
}) || { mono: 'monospace' };

export const Theme = {
  colors: {
    light: {
      primary: '#6366f1', // Indigo
      primaryDark: '#4f46e5',
      secondary: '#8b5cf6', // Violet
      background: '#f3f4f6', // Cool gray
      card: '#ffffff',
      border: '#e5e7eb',
      text: '#111827',
      textSecondary: '#4b5563',
      textMuted: '#9ca3af',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#f43f5e',
      info: '#0ea5e9',
    },
    dark: {
      primary: '#6366f1',
      primaryDark: '#818cf8',
      secondary: '#a78bfa',
      background: '#111827', // Slate dark
      card: '#1f2937',
      border: '#374151',
      text: '#f9fafb',
      textSecondary: '#d1d5db',
      textMuted: '#6b7280',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#38bdf8',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: '800' as const,
      lineHeight: 34,
    },
    h2: {
      fontSize: 22,
      fontWeight: '700' as const,
      lineHeight: 28,
    },
    h3: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    body: {
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
    bodyBold: {
      fontSize: 15,
      fontWeight: '700' as const,
      lineHeight: 22,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
    code: {
      fontSize: 13,
      fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    },
  },
};

export const Colors = {
  light: {
    text: '#111827',
    background: '#f3f4f6',
    backgroundElement: '#ffffff',
    backgroundSelected: '#e0e7ff',
    textSecondary: '#4b5563',
  },
  dark: {
    text: '#f9fafb',
    background: '#111827',
    backgroundElement: '#1f2937',
    backgroundSelected: '#312e81',
    textSecondary: '#d1d5db',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

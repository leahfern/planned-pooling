const shared = {
  fonts: {
    primary: 'Roboto, sans-serif',
    secondary: 'Nunito, sans-serif',
  },
  fontSizes: {
    small: '12px',
    medium: '16px',
    large: '24px',
    xlarge: '32px',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
    xlarge: '32px',
  },
  borderRadius: {
    button: '10px',
  },
};

export const lightTheme = {
  ...shared,
  dark: false,
  colors: {
    primary: '#0d9488',
    primaryDark: '#0f766e',
    secondary: '#F5F5DC',
    accent: '#fbbf24',
    text: '#3B2F2F',
    white: '#FFFFFF',
    black: '#000000',
    grey: '#9B9B9B',
    surface: '#fefce8',
    background: '#FFFFFF',
    cardBg: '#FFFFFF',
  },
};

export const darkTheme = {
  ...shared,
  dark: true,
  colors: {
    primary: '#14b8a6',
    primaryDark: '#0d9488',
    secondary: '#475569',
    accent: '#fbbf24',
    text: '#e2e8f0',
    white: '#FFFFFF',
    black: '#0f172a',
    grey: '#94a3b8',
    surface: '#334155',
    background: '#0f172a',
    cardBg: '#1e293b',
  },
};

/** @deprecated Use lightTheme or getThemeFromPreference() */
export const theme = lightTheme;

export type AppTheme = typeof lightTheme;

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}

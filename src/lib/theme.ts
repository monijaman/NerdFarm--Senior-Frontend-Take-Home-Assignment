/**
 * Design tokens for Pearson Specter Litt Command Center.
 * CSS custom properties in globals.css map these to Tailwind utilities.
 */
export const theme = {
  colors: {
    primary: '#1E3A5F',       // Navy blue — brand primary
    primaryHover: '#152d4a',
    secondary: '#F39C12',     // Orange — accent
    success: '#27AE60',       // Green — low urgency / success
    danger: '#E74C3C',        // Red — high urgency / destructive
    dangerHover: '#c0392b',
    warning: '#F39C12',       // Amber — medium urgency
    background: '#FFFFFF',
    surface: '#F9FAFB',       // Subtle off-white panel background
    border: '#E5E7EB',
    text: '#111827',
    textMuted: '#6B7280',
    textInverse: '#FFFFFF',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.1)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
  },
} as const;

export type Theme = typeof theme;

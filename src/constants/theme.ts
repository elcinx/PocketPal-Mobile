export const COLORS = {
  // Sugar Pastel Palette
  primary: '#FF99C8',    // Bright Pastel Pink (Cotton Candy)
  secondary: '#A3C4FC',  // Softer Sky Blue
  accent: '#FCF6BD',     // Pale Lemon Yellow
  background: '#FFF9F1', // Warm Cream
  surface: '#FFFFFF',    // Pure White
  
  // Status Colors (Softer Tones)
  success: '#99E2B4',    // Soft Mint
  warning: '#F9C74F',    // Muted Sunflower
  danger: '#F94144',     // Soft Coral
  
  // Text & UI
  text: '#5D2E46',       // Deep Plum (instead of gray) for better contrast and "cute" feel
  textLight: '#A39391',  // Warm Muted Gray
  white: '#FFFFFF',
  border: '#F0E5E5',
  
  // Gradients (Represented as starts/ends for SVG/Components)
  primaryGradient: ['#FF99C8', '#FCBCB8'],
  secondaryGradient: ['#A3C4FC', '#8ECAE6'],
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 16,     // Increased from 12
  lg: 28,     // Increased from 20
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#5D2E46',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#5D2E46',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};

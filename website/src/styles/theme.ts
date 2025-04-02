export const theme = {
  colors: {
    primary: '#FFD100', // Bright yellow
    primaryHover: '#FFDC33', // Lighter yellow for hover
    secondary: '#000000', // Black
    dark: '#000000', // Pure black
    darkGrey: '#222222', // Dark gray
    light: '#FFFFFF', // White
    lightGrey: '#CCCCCC', // Light gray
    textPrimary: '#FFFFFF', // White text
    textSecondary: '#CCCCCC', // Light gray text
    border: '#333333', // Dark gray border
  },
  fonts: {
    primary: "'Inter', sans-serif",
  },
  fontSizes: {
    small: '0.875rem',
    medium: '1rem',
    large: '1.25rem',
    xl: '1.5rem',
    xxl: '2rem',
    xxxl: '3rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '5rem',
  },
  borderRadius: {
    small: '0.25rem',
    medium: '0.5rem',
    large: '1rem',
    full: '9999px',
  },
  shadows: {
    small: '0 1px 3px rgba(255, 209, 0, 0.1), 0 1px 2px rgba(255, 209, 0, 0.06)',
    medium: '0 4px 6px rgba(255, 209, 0, 0.1), 0 1px 3px rgba(255, 209, 0, 0.08)',
    large: '0 10px 20px rgba(255, 209, 0, 0.15), 0 3px 6px rgba(255, 209, 0, 0.1)',
    glow: '0 0 10px rgba(255, 209, 0, 0.5)',
  },
  transitions: {
    fast: '0.2s ease',
    medium: '0.3s ease',
    slow: '0.5s ease',
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '992px',
    largeDesktop: '1200px',
  },
};

export type Theme = typeof theme;

export default theme; 
import { createGlobalStyle } from 'styled-components';
import 'styled-components';

// Extend the DefaultTheme interface
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
      };
      background: {
        primary: string;
        secondary: string;
      };
      text: {
        primary: string;
        secondary: string;
        tertiary: string;
      };
      success: {
        main: string;
      };
      border: {
        subtle: string;
      };
      secondary: string;
      dark: string;
      darkGrey: string;
      lightGrey: string;
      textPrimary: string;
      textSecondary: string;
      borderColor: string;
      primaryHover: string;
    };
    fonts: {
      body: string;
      heading: string;
      mono: string;
    };
    fontSizes: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
      '6xl': string;
      '7xl': string;
      small: string;
      medium: string;
      large: string;
    };
    fontWeights: {
      hairline: number;
      thin: number;
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
      extrabold: number;
      black: number;
    };
    lineHeights: {
      normal: string;
      none: number;
      shorter: number;
      short: number;
      base: number;
      tall: number;
      taller: string;
    };
    spacing: {
      px: string;
      '0': string;
      '1': string;
      '2': string;
      '3': string;
      '4': string;
      '5': string;
      '6': string;
      '8': string;
      '10': string;
      '12': string;
      '16': string;
      '20': string;
      '24': string;
      '32': string;
      '40': string;
      '48': string;
      '56': string;
      '64': string;
      '80': string;
      '96': string;
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      mobile: string;
      tablet: string;
    };
    borderRadius: {
      none: string;
      small: string;
      medium: string;
      large: string;
      full: string;
    };
    radii: {
      none: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      full: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      medium: string;
      large: string;
    };
    transitions: {
      fast: string;
      medium: string;
      slow: string;
    };
    zIndices: {
      hide: number;
      auto: string;
      base: number;
      docked: number;
      dropdown: number;
      sticky: number;
      banner: number;
      overlay: number;
      modal: number;
      popover: number;
      skipLink: number;
      toast: number;
      tooltip: number;
      header: number;
    };
  }
}

const theme = {
  colors: {
    primary: {
      50: '#FFF6CC',
      100: '#FFEE99',
      200: '#FFE566',
      300: '#FFDC33',
      400: '#FFD300',
      500: '#FFD100',
      600: '#CCA700',
      700: '#997D00',
      800: '#665400',
      900: '#332A00',
    },
    background: {
      primary: '#000000',
      secondary: '#111111',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
      tertiary: '#999999',
    },
    success: {
      main: '#FFD100',
    },
    border: {
      subtle: '#333333',
    },
    secondary: '#111111',
    dark: '#000000',
    darkGrey: '#222222',
    lightGrey: '#999999',
    textPrimary: '#FFFFFF',
    textSecondary: '#CCCCCC',
    borderColor: '#333333',
    primaryHover: '#FFDC33',
  },
  fonts: {
    body: 'Inter, system-ui, sans-serif',
    heading: 'Inter, system-ui, sans-serif',
    mono: 'Menlo, monospace',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    small: '0.875rem',
    medium: '1rem',
    large: '1.125rem',
  },
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeights: {
    normal: 'normal',
    none: 1,
    shorter: 1.25,
    short: 1.375,
    base: 1.5,
    tall: 1.625,
    taller: '2',
  },
  spacing: {
    px: '1px',
    '0': '0',
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '8': '2rem',
    '10': '2.5rem',
    '12': '3rem',
    '16': '4rem',
    '20': '5rem',
    '24': '6rem',
    '32': '8rem',
    '40': '10rem',
    '48': '12rem',
    '56': '14rem',
    '64': '16rem',
    '80': '20rem',
    '96': '24rem',
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '4rem',
    xxl: '6rem',
  },
  breakpoints: {
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em',
    mobile: '30em',
    tablet: '48em',
  },
  borderRadius: {
    none: '0',
    small: '0.125rem',
    medium: '0.375rem',
    large: '0.5rem',
    full: '9999px',
  },
  radii: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  transitions: {
    fast: '0.2s',
    medium: '0.3s',
    slow: '0.5s',
  },
  zIndices: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
    header: 1900,
  },
};

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  html, body {
    font-family: ${({ theme }) => theme.fonts.body};
    background-color: #000000;
    color: #FFFFFF;
    font-size: 16px;
    line-height: 1.5;
  }

  a {
    color: #FFD100;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
      color: #FFDC33;
    }
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    line-height: 1.2;
    margin-bottom: 0.5em;
    color: #FFFFFF;
  }

  p {
    margin-bottom: 1rem;
    color: #CCCCCC;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  ::selection {
    background-color: #FFD100;
    color: #000000;
  }
`;

export default theme; 
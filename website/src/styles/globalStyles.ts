import { createGlobalStyle } from 'styled-components';
import { Theme } from './theme';

const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    background-color: ${({ theme }) => theme.colors.dark};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 16px;
    line-height: 1.6;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  body {
    position: relative;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primaryHover};
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  h1 {
    font-size: ${({ theme }) => theme.fontSizes.xxxl};
  }

  h2 {
    font-size: ${({ theme }) => theme.fontSizes.xxl};
  }

  h3 {
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  img {
    max-width: 100%;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-family: ${({ theme }) => theme.fonts.primary};
  }

  input, textarea, button {
    font-family: ${({ theme }) => theme.fonts.primary};
  }

  ul, ol {
    list-style-position: inside;
  }

  section {
    padding: ${({ theme }) => theme.spacing.xxl} 0;
  }
`;

export default GlobalStyles; 
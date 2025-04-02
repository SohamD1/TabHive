import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

export const Button = styled.a<{ variant?: 'primary' | 'secondary' | 'outline' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  
  ${({ variant, theme }) => {
    if (variant === 'secondary') {
      return `
        background-color: ${theme.colors.secondary};
        color: ${theme.colors.textPrimary};
        border: 1px solid ${theme.colors.borderColor};
        
        &:hover {
          background-color: ${theme.colors.darkGrey};
          color: ${theme.colors.primary};
        }
      `;
    }
    
    if (variant === 'outline') {
      return `
        background-color: transparent;
        color: ${theme.colors.primary};
        border: 1px solid ${theme.colors.primary};
        
        &:hover {
          background-color: rgba(0, 255, 157, 0.1);
          transform: translateY(-2px);
        }
      `;
    }
    
    // Default primary
    return `
      background-color: ${theme.colors.primary};
      color: ${theme.colors.secondary};
      box-shadow: 0 4px 14px rgba(0, 255, 157, 0.4);
      
      &:hover {
        background-color: ${theme.colors.primaryHover};
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 255, 157, 0.6);
      }
    `;
  }}
`;

export const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transition: transform ${({ theme }) => theme.transitions.medium}, 
              box-shadow ${({ theme }) => theme.transitions.medium};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

export const Badge = styled.span`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.darkGrey};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 600;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  margin-right: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const Grid = styled.div<{ columns?: number, gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns || 3}, 1fr);
  gap: ${({ gap, theme }) => gap || theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const Flex = styled.div<{ direction?: string, align?: string, justify?: string, gap?: string }>`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'row'};
  align-items: ${({ align }) => align || 'center'};
  justify-content: ${({ justify }) => justify || 'flex-start'};
  gap: ${({ gap, theme }) => gap || theme.spacing.md};
`;

export const Section = styled.section`
  padding: ${({ theme }) => theme.spacing.xxl} 0;
`;

export const GradientText = styled.span`
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary} 0%, #00FFCC 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
`;

export const GlowingButton = styled(Button)`
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.colors.primary};
    filter: blur(15px);
    opacity: 0.4;
    z-index: -1;
    transition: opacity ${({ theme }) => theme.transitions.medium};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
  }
  
  &:hover::after {
    opacity: 0.7;
  }
`;

export const HeroContainer = styled.div`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  
  img {
    height: 40px;
    margin-right: ${({ theme }) => theme.spacing.sm};
  }
`;

export const BoxShadow = styled.div`
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: 0 0 100px 20px rgba(0, 255, 157, 0.2);
    z-index: -1;
  }
`; 
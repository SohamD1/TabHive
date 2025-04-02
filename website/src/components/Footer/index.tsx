import React from 'react';
import styled from 'styled-components';
import { Container, Logo } from '../../styles/components';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: ${({ theme }) => theme.spacing.xxl} 0 ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.borderColor};
`;

const FooterContent = styled(Container)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xxl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const FooterLogo = styled(Logo)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const LeftColumn = styled.div`
  flex: 1;
  min-width: 250px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 160px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const LinkGroupTitle = styled.h4`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSizes.medium};
`;

const ContactInfo = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Tagline = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const BottomBar = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xxl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.borderColor};
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
  }
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <LeftColumn>
          <FooterLogo>
            <img src="/logo.svg" alt="TabHive Logo" />
            TabHive
          </FooterLogo>
          <Tagline>
            An intelligent Chrome extension for organizing tabs by content and course codes.
          </Tagline>
        </LeftColumn>
        
        <RightColumn>
          <LinkGroupTitle>Contact</LinkGroupTitle>
          <ContactInfo>davesoham14@gmail.com</ContactInfo>
          <FooterLink href="https://github.com/sohamd1/tabhive" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21C9.5 20.77 9.5 20.14 9.5 19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.81 5.03 16.5 5.03 16.5C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26C14.5 19.6 14.5 20.68 14.5 21C14.5 21.27 14.66 21.59 15.17 21.5C19.14 20.16 22 16.42 22 12C22 6.48 17.52 2 12 2Z" fill="currentColor" />
            </svg>
            GitHub
          </FooterLink>
        </RightColumn>
      </FooterContent>
      
      <Container>
        <BottomBar>
          <Copyright>© {new Date().getFullYear()} TabHive. All rights reserved.</Copyright>
        </BottomBar>
      </Container>
    </FooterContainer>
  );
};

export default Footer; 
import React from 'react';
import styled from 'styled-components';
import { FiGithub, FiMail, FiExternalLink } from 'react-icons/fi';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[6]}`};
  border-top: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[8]};
  }
`;

const FooterLeft = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

const FooterLogo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[500]};
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  span {
    margin-left: ${({ theme }) => theme.spacing[2]};
  }
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const FooterDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 400px;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  line-height: 1.6;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.full};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: background-color 0.3s ease, color 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[500]};
    color: white;
  }
`;

const FooterRight = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[12]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing[4]};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[6]};
  }
`;

const FooterColumn = styled.div``;

const ColumnTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FooterLinks = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const FooterLink = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
    transition: color 0.3s ease;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary[500]};
    }
  }
`;

const Copyright = styled.div`
  max-width: 1200px;
  margin: ${({ theme }) => theme.spacing[8]} auto 0;
  padding-top: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.border.subtle};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
    text-align: center;
  }
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLeft>
          <FooterLogo>
            <LogoIcon>TH</LogoIcon>
            <span>TabHive</span>
          </FooterLogo>
          <FooterDescription>
            TabHive helps you organize your browser tabs using intelligent clustering and course code detection.
          </FooterDescription>
          <SocialLinks>
            <SocialLink href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FiGithub />
            </SocialLink>
            <SocialLink href="mailto:contact@example.com">
              <FiMail />
            </SocialLink>
          </SocialLinks>
        </FooterLeft>
        
        <FooterRight>
          <FooterColumn>
            <ColumnTitle>Support</ColumnTitle>
            <FooterLinks>
              <FooterLink>
                <a href="https://docs.google.com" target="_blank" rel="noopener noreferrer">
                  Terms of Service <FiExternalLink size={12} />
                </a>
              </FooterLink>
              <FooterLink>
                <a href="#contact">
                  Contact
                </a>
              </FooterLink>
            </FooterLinks>
          </FooterColumn>
          
          <FooterColumn>
            <ColumnTitle>Connect</ColumnTitle>
            <FooterLinks>
              <FooterLink>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  GitHub <FiExternalLink size={12} />
                </a>
              </FooterLink>
              <FooterLink>
                <a href="mailto:contact@example.com">
                  Email
                </a>
              </FooterLink>
            </FooterLinks>
          </FooterColumn>
        </FooterRight>
      </FooterContent>
      
      <Copyright>
        <div>© {currentYear} TabHive. All rights reserved.</div>
        <div>Made with ❤️ for productive browsing</div>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;

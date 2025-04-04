import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  width: 100%;
  padding: 30px 0;
  background-color: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(251, 251, 4, 0.1);
  margin-top: 20px;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-bottom: 25px;
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  
  &:hover {
    color: var(--accent-color);
  }
`;

const FooterText = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  text-align: center;
  margin: 5px 0;
  letter-spacing: 0.8px;
`;

const HeartIcon = styled.span`
  color: #ff4d4d;
  font-size: 1.1rem;
  display: inline-block;
  transform: translateY(1px);
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0% { transform: scale(1) translateY(1px); }
    50% { transform: scale(1.2) translateY(1px); }
    100% { transform: scale(1) translateY(1px); }
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLinks>
          <FooterLink href="mailto:davesoham14@gmail.com">Contact Us</FooterLink>
        </FooterLinks>
        <FooterText>
          Made with <HeartIcon>❤</HeartIcon> by Soham Dave
        </FooterText>
        <FooterText>
          &copy; {new Date().getFullYear()} TabHive. All rights reserved.
        </FooterText>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 
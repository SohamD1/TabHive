import React from 'react';
import styled from 'styled-components';
import { Container, Logo, Button } from '../../styles/components';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: ${({ theme }) => theme.colors.dark};
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  backdrop-filter: blur(10px);
`;

const HeaderInner = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
  transition: color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const CTA = styled(Button)`
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <HeaderInner>
        <Logo>
          <img src="/logo.svg" alt="TabHive Logo" />
          TabHive
        </Logo>
        
        <Nav>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#how-it-works">How It Works</NavLink>
          <NavLink href="#proof">Proof</NavLink>
          <NavLink href="#faq">FAQ</NavLink>
        </Nav>
        
        <CTA href="#download" variant="primary">Download</CTA>
        
        <MobileMenuButton>☰</MobileMenuButton>
      </HeaderInner>
    </HeaderContainer>
  );
};

export default Header; 
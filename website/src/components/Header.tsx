import React, { useState } from 'react';
import styled from 'styled-components';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[6]}`};
  background-color: ${({ theme }) => theme.colors.background.primary};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndices.header};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  }
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[500]};
  display: flex;
  align-items: center;
  
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

const NavLinks = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing[8]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  position: relative;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  cursor: pointer;
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 70%;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  z-index: ${({ theme }) => theme.zIndices.modal};
`;

const MobileNavLinks = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
  margin-top: ${({ theme }) => theme.spacing[8]};
`;

const MobileNavLink = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  cursor: pointer;
  align-self: flex-end;
`;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <HeaderContainer>
      <Logo>
        <LogoIcon>TH</LogoIcon>
        <span>TabHive</span>
      </Logo>
      
      <NavLinks>
        <NavLink href="#features">Demo</NavLink>
        <NavLink href="#how-it-works">How It Works</NavLink>
        <NavLink href="#download">Download</NavLink>
      </NavLinks>
      
      <MobileMenuButton onClick={toggleMenu}>
        <FiMenu />
      </MobileMenuButton>
      
      <AnimatePresence>
        {isMenuOpen && (
          <MobileMenu
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <CloseButton onClick={toggleMenu}>
              <FiX />
            </CloseButton>
            
            <MobileNavLinks>
              <MobileNavLink href="#features" onClick={toggleMenu}>Features</MobileNavLink>
              <MobileNavLink href="#how-it-works" onClick={toggleMenu}>How It Works</MobileNavLink>
              <MobileNavLink href="#download" onClick={toggleMenu}>Download</MobileNavLink>
              <MobileNavLink href="#contact" onClick={toggleMenu}>Contact</MobileNavLink>
            </MobileNavLinks>
          </MobileMenu>
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
};

export default Header; 
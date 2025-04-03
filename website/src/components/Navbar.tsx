import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const glowAnimation = keyframes`
  0% { box-shadow: 0 4px 20px rgba(255, 215, 0, 0.2); }
  50% { box-shadow: 0 4px 30px rgba(255, 215, 0, 0.4); }
  100% { box-shadow: 0 4px 20px rgba(255, 215, 0, 0.2); }
`;

const NavbarContainer = styled.nav<{ show: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 800px;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  padding: 15px 25px;
  border-radius: 50px;
  margin: 20px 0;
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(${props => props.show ? '0' : '-100px'});
  z-index: 1000;
  border: 1px solid rgba(255, 215, 0, 0.3);
  animation: ${glowAnimation} 4s infinite;
  transition: transform 0.3s ease;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoImg = styled.img`
  height: 45px;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.3));
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.6));
  }
`;

const LogoText = styled.span`
  font-size: 26px;
  font-weight: bold;
  color: var(--accent-color);
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
`;

const NavLinks = styled.div`
  display: flex;
  gap: 25px;
`;

const NavLink = styled.a`
  color: var(--text-color);
  font-weight: 600;
  font-size: 18px;
  padding: 5px 10px;
  transition: all 0.3s ease;
  position: relative;
  letter-spacing: 1.5px;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: var(--accent-color);
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: var(--accent-color);
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
    
    &:after {
      width: 100%;
    }
  }
`;

const Navbar: React.FC = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (window.scrollY > lastScrollY) {
      // Scrolling down
      setShowNavbar(false);
    } else {
      // Scrolling up
      setShowNavbar(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', controlNavbar);
    
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <NavbarContainer show={showNavbar}>
      <Logo>
        <LogoImg src="/tabhive.png" alt="TabHive Logo" />
        <LogoText>TabHive</LogoText>
      </Logo>
      <NavLinks>
        <NavLink href="#home">Home</NavLink>
        <NavLink href="#download">Install</NavLink>
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar; 
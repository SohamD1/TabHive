import React from 'react';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 800px;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: 15px 25px;
  border-radius: 50px;
  margin: 20px 0;
  position: sticky;
  top: 20px;
  z-index: 1000;
  border: 1px solid rgba(255, 221, 0, 0.3);
  box-shadow: 0 4px 20px rgba(255, 221, 0, 0.2);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoImg = styled.img`
  height: 40px;
`;

const LogoText = styled.span`
  font-size: 22px;
  font-weight: bold;
  color: var(--accent-color);
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const NavLink = styled.a`
  color: var(--text-color);
  font-weight: 500;
  padding: 5px 10px;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--accent-color);
  }
`;

const Navbar: React.FC = () => {
  return (
    <NavbarContainer>
      <Logo>
        <LogoImg src="/tabhive.png" alt="TabHive Logo" />
        <LogoText>TabHive</LogoText>
      </Logo>
      <NavLinks>
        <NavLink href="#home">Home</NavLink>
        <NavLink href="#features">Features</NavLink>
        <NavLink href="#demo">Demo</NavLink>
        <NavLink href="#download">Download</NavLink>
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar; 
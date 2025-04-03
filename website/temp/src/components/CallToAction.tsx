import React from 'react';
import styled from 'styled-components';

const CTAContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 60px 0;
  width: 100%;
`;

const Heading = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #FFFFFF 0%, #FFDD00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subheading = styled.p`
  font-size: 1.5rem;
  margin-bottom: 40px;
  max-width: 800px;
  color: rgba(255, 255, 255, 0.8);
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CTAButton = styled.button`
  background-color: var(--accent-color);
  color: black;
  font-size: 1.2rem;
  padding: 15px 40px;
  border-radius: 50px;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(255, 221, 0, 0.3);
  }
`;

const CallToAction: React.FC = () => {
  return (
    <CTAContainer id="home">
      <Heading>Organize Your Tabs Like Never Before</Heading>
      <Subheading>
        TabHive helps you manage browser tabs efficiently, saving time and reducing clutter.
        The smart solution for professionals and multitaskers.
      </Subheading>
      <CTAButton onClick={() => document.getElementById('download')?.scrollIntoView({behavior: 'smooth'})}>
        Get TabHive Now
      </CTAButton>
    </CTAContainer>
  );
};

export default CallToAction; 
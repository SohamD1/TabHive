import React from 'react';
import styled from 'styled-components';

const DownloadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  padding: 80px 0;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 221, 0, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
    top: -50%;
    left: -50%;
    z-index: -1;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: var(--accent-color);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const DownloadDescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 40px;
  max-width: 800px;
  color: rgba(255, 255, 255, 0.8);
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

const DownloadButton = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: var(--accent-color);
  color: black;
  font-size: 1.2rem;
  padding: 15px 30px;
  border-radius: 50px;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid var(--accent-color);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(255, 221, 0, 0.3);
  }
`;

const AlternativeButton = styled(DownloadButton)`
  background-color: transparent;
  color: var(--accent-color);
  
  &:hover {
    background-color: rgba(255, 221, 0, 0.1);
  }
`;

const BrowserIcon = styled.span`
  font-size: 1.5rem;
`;

const Download: React.FC = () => {
  return (
    <DownloadContainer id="download">
      <SectionTitle>Ready to Transform Your Browsing?</SectionTitle>
      <DownloadDescription>
        TabHive is available for all major browsers. 
        Download it now and experience a more organized and productive web browsing experience.
      </DownloadDescription>
      
      <ButtonsContainer>
        <DownloadButton href="#" target="_blank" rel="noopener noreferrer">
          <BrowserIcon>🌐</BrowserIcon>
          Chrome Web Store
        </DownloadButton>
        <AlternativeButton href="#" target="_blank" rel="noopener noreferrer">
          <BrowserIcon>🦊</BrowserIcon>
          Firefox Add-ons
        </AlternativeButton>
      </ButtonsContainer>
    </DownloadContainer>
  );
};

export default Download; 
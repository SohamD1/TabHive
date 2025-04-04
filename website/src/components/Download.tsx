import React from 'react';
import styled, { keyframes } from 'styled-components';

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 10px 2px rgba(251, 251, 4, 0.4); }
  50% { box-shadow: 0 0 20px 5px rgba(251, 251, 4, 0.7); }
  100% { box-shadow: 0 0 10px 2px rgba(251, 251, 4, 0.4); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const DownloadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  padding: 40px 0;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(251, 251, 4, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
    top: -50%;
    left: -50%;
    z-index: -1;
  }
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  margin-bottom: 20px;
  color: var(--accent-color);
  text-shadow: 0 0 15px rgba(251, 251, 4, 0.3);
  position: relative;
  padding-bottom: 15px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background-color: var(--accent-color);
    box-shadow: 0 0 10px rgba(251, 251, 4, 0.5);
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const InstructionsContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  background-color: rgba(20, 20, 20, 0.7);
  padding: 30px;
  border-radius: 12px;
  border: 1px solid rgba(251, 251, 4, 0.2);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    padding: 20px;
    margin: 30px 15px;
  }
`;

const InstallSteps = styled.ol`
  text-align: left;
  color: white;
  font-size: 1.2rem;
  padding-left: 25px;
  
  li {
    margin-bottom: 20px;
    line-height: 1.6;
    
    code {
      background-color: rgba(50, 50, 50, 0.6);
      padding: 3px 6px;
      border-radius: 4px;
      font-family: monospace;
      color: var(--accent-color);
      word-break: break-all;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding-left: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    padding-right: 10px;
    
    li {
      margin-bottom: 15px;
    }
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 30px;
`;

const DownloadButton = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: var(--accent-color);
  color: black;
  font-size: 1.4rem;
  padding: 18px 35px;
  border-radius: 50px;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid var(--accent-color);
  animation: ${glowAnimation} 3s infinite;
  
  &:hover {
    transform: translateY(-5px);
    animation: ${pulseAnimation} 1.5s infinite, ${glowAnimation} 3s infinite;
    box-shadow: 0 15px 30px rgba(251, 251, 4, 0.5);
  }
`;

const Download: React.FC = () => {
  return (
    <DownloadContainer id="download">
      <SectionTitle>How to Install</SectionTitle>
      
      <InstructionsContainer>
        <InstallSteps>
          <li>Clone the repository: <code>git clone https://github.com/sohamd1/tabhive.git</code></li>
          <li>Navigate to the project directory: <code>cd tabhive</code></li>
          <li>Install dependencies: <code>npm install</code></li>
          <li>Build the extension: <code>npm run build</code></li>
          <li>Open Chrome and navigate to <code>chrome://extensions</code></li>
          <li>Enable "Developer mode" in the top right corner</li>
          <li>Click "Load unpacked" and select the <code>dist</code> folder from the project directory</li>
          <li>TabHive extension is now installed and ready to use!</li>
        </InstallSteps>
      </InstructionsContainer>
      
      <ButtonsContainer>
        <DownloadButton href="https://github.com/sohamd1/tabhive" target="_blank" rel="noopener noreferrer">
          View on GitHub
        </DownloadButton>
      </ButtonsContainer>
    </DownloadContainer>
  );
};

export default Download; 
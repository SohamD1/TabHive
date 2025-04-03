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

const VideoContainer = styled.div`
  width: 100%;
  max-width: 800px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  border: 2px solid rgba(251, 251, 4, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
  justify-content: center;
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

const AlternativeButton = styled(DownloadButton)`
  background-color: transparent;
  color: var(--accent-color);
  box-shadow: 0 0 15px 2px rgba(251, 251, 4, 0.2);
  
  &:hover {
    background-color: rgba(251, 251, 4, 0.1);
    box-shadow: 0 0 25px 5px rgba(251, 251, 4, 0.3);
  }
`;

const BrowserIcon = styled.span`
  font-size: 1.8rem;
`;

const Download: React.FC = () => {
  return (
    <DownloadContainer id="download">
      <SectionTitle>How to Install</SectionTitle>
      
      <VideoContainer>
        <iframe 
          width="100%" 
          height="450" 
          src="https://www.youtube.com/embed/JoWLlwdYmEc" 
          title="TabHive Installation Guide" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </VideoContainer>
      
    </DownloadContainer>
  );
};

export default Download; 
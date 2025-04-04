import React from 'react';
import styled, { keyframes } from 'styled-components';

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 10px 2px rgba(255, 245, 0, 0.4); }
  50% { box-shadow: 0 0 20px 5px rgba(255, 245, 0, 0.7); }
  100% { box-shadow: 0 0 10px 2px rgba(255, 245, 0, 0.4); }
`;

const textGlowAnimation = keyframes`
  0% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.4); }
  50% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.4); }
  100% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.4); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const CTAContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 100px 0;
  width: 100%;
`;

const Heading = styled.h1`
  font-size: 5rem;
  margin-bottom: 40px;
  color: white;
  letter-spacing: 2px;
  
  @media (max-width: 768px) {
    font-size: 3.2rem;
    margin-bottom: 30px;
    letter-spacing: 1.5px;
  }
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
    letter-spacing: 1px;
    padding: 0 10px;
  }
`;

const GlowingText = styled.span`
  color: #FFD700;
  animation: ${textGlowAnimation} 3s infinite;
  display: inline;
  font-weight: 700;
  margin-left: 15px;
  
  @media (max-width: 480px) {
    margin-left: 8px;
  }
`;

const Subheading = styled.p`
  font-size: 1.8rem;
  margin-bottom: 60px;
  max-width: 800px;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
    margin-bottom: 40px;
  }
`;

const VideoContainer = styled.div`
  width: 100%;
  max-width: 800px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 60px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  position: relative;
  padding-top: 45.625%; /* Reduced by 10% from 56.25% */
`;

const CTAButton = styled.a`
  background-color: var(--accent-color);
  color: black;
  font-size: 1.4rem;
  padding: 18px 50px;
  border-radius: 50px;
  font-weight: bold;
  transition: all 0.3s ease;
  animation: ${glowAnimation} 3s infinite;
  display: inline-block;
  text-decoration: none;
  margin-bottom: 20px;
  letter-spacing: 1.5px;
  
  &:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 15px 30px rgba(255, 215, 0, 0.5);
  }
`;

const ComingSoonNote = styled.p`
  text-align: center;
  color: black;
  background-color: var(--accent-color);
  font-size: 1.3rem;
  margin-bottom: 40px;
  font-weight: 600;
  padding: 12px 20px;
  border-radius: 8px;
  display: inline-block;
  animation: ${pulseAnimation} 2s infinite;
  box-shadow: 0 0 15px rgba(251, 251, 4, 0.5);
`;

const CallToAction: React.FC = () => {
  const googleDriveLink = "https://drive.google.com/drive/folders/your-folder-id";

  return (
    <CTAContainer id="home">
      <Heading>
        Tab Chaos<GlowingText>Conquered</GlowingText>
      </Heading>
      <Subheading>
        Stop drowning in a sea of browser tabs. TabHive organizes your digital workspace automatically.
      </Subheading>
      
      <VideoContainer>
        <video
          muted
          loop
          playsInline
          preload="auto"
          autoPlay
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onCanPlayThrough={(e) => {
            const video = e.target as HTMLVideoElement;
            video.play().catch(error => {
              console.error('Error playing video:', error);
            });
          }}
        >
          <source src="/tabhive_demo_1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </VideoContainer>
      
      <CTAButton href="https://github.com/sohamd1/tabhive" target="_blank" rel="noopener noreferrer">
        Get TabHive Now
      </CTAButton>
      <ComingSoonNote>Or... Wait a couple days for it to release on the Google Web Store!</ComingSoonNote>
    </CTAContainer>
  );
};

export default CallToAction; 
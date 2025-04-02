import React from 'react';
import styled from 'styled-components';
import { Container, Section, GradientText } from '../../styles/components';
import { motion } from 'framer-motion';

const ProofSection = styled(Section)`
  background-color: ${({ theme }) => theme.colors.secondary};
  position: relative;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const VideoContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  overflow: hidden;
  box-shadow: 0 20px 80px rgba(0, 255, 157, 0.3);
  border: 1px solid rgba(0, 255, 157, 0.2);
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  
  iframe, video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
  }
`;

const VideoPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.dark};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const PlayButton = styled.div`
  width: 80px;
  height: 80px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  box-shadow: 0 0 30px rgba(0, 255, 157, 0.5);
  
  svg {
    width: 30px;
    height: 30px;
    fill: ${({ theme }) => theme.colors.dark};
  }
`;

const VideoText = styled.p`
  text-align: center;
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Description = styled.p`
  text-align: center;
  max-width: 700px;
  margin: ${({ theme }) => theme.spacing.xxl} auto;
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const BackgroundGlow = styled.div`
  position: absolute;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 500px;
  background: radial-gradient(circle at center, rgba(0, 255, 157, 0.1) 0%, rgba(0, 255, 157, 0) 70%);
  border-radius: 50%;
  z-index: 0;
`;

const Proof: React.FC = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  
  const handlePlay = () => {
    setIsPlaying(true);
  };
  
  return (
    <ProofSection id="proof">
      <BackgroundGlow />
      <Container>
        <SectionTitle>
          <GradientText>Proof</GradientText>
        </SectionTitle>
        
        <Description>
          Watch TabHive in action as it instantly organizes dozens of tabs by content and course codes, 
          turning browser chaos into a clean, well-structured workflow.
        </Description>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <VideoContainer>
            <VideoWrapper>
              {isPlaying ? (
                <iframe 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                  title="TabHive in Action" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : (
                <VideoPlaceholder onClick={handlePlay}>
                  <PlayButton>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </PlayButton>
                  <VideoText>Watch TabHive in Action</VideoText>
                </VideoPlaceholder>
              )}
            </VideoWrapper>
          </VideoContainer>
        </motion.div>
        
        <Description>
          TabHive uses advanced AI algorithms to analyze tab content and group similar tabs together,
          making it perfect for students, researchers, and anyone who works with multiple tabs.
        </Description>
      </Container>
    </ProofSection>
  );
};

export default Proof; 
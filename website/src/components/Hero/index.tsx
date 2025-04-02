import React from 'react';
import styled from 'styled-components';
import { Container, GradientText, GlowingButton, HeroContainer } from '../../styles/components';
import { motion } from 'framer-motion';

const HeroSection = styled.section`
  padding-top: 120px;
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled(Container)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xxl};
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const HeroText = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    order: 2;
  }
`;

const HeroHeading = styled.h1`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 3rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const HeroSubheading = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.lightGrey};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: center;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    order: 1;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;

const GlowEffect = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(0, 255, 157, 0.2) 0%, rgba(0, 255, 157, 0) 70%);
  filter: blur(60px);
  z-index: -1;
`;

const ScreenshotImage = styled(motion.img)`
  width: 100%;
  height: auto;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: 0 20px 80px rgba(0, 255, 157, 0.3);
  border: 1px solid rgba(0, 255, 157, 0.2);
`;

const BackgroundCircle = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(0, 255, 157, 0.05) 0%, rgba(0, 255, 157, 0) 70%);
  right: -250px;
  top: -250px;
  z-index: -1;
`;

const Hero: React.FC = () => {
  return (
    <HeroSection>
      <BackgroundCircle />
      <HeroContainer>
        <HeroContent>
          <HeroText>
            <HeroHeading>
              <GradientText>F*ck tab chaos.</GradientText><br />
              Organize your browser tabs with AI.
            </HeroHeading>
            <HeroSubheading>
              TabHive is an intelligent Chrome extension that automatically groups similar tabs, 
              helping you stay focused and organized during research, studying, or work.
            </HeroSubheading>
            <ButtonContainer>
              <GlowingButton href="#download" variant="primary">Download for Chrome</GlowingButton>
              <GlowingButton href="#how-it-works" variant="outline">How It Works</GlowingButton>
            </ButtonContainer>
          </HeroText>
          
          <ImageContainer>
            <GlowEffect />
            <ScreenshotImage 
              src="/browser-screenshot.svg" 
              alt="TabHive in action" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            />
          </ImageContainer>
        </HeroContent>
      </HeroContainer>
    </HeroSection>
  );
};

export default Hero; 
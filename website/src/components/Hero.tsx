import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiDownload, FiArrowRight } from 'react-icons/fi';

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[6]}`};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.background.primary} 0%,
    ${({ theme }) => theme.colors.background.secondary} 100%
  );
  position: relative;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column;
    padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[6]}`};
    gap: ${({ theme }) => theme.spacing[10]};
  }
`;

const HeroContent = styled.div`
  max-width: 550px;
  z-index: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  line-height: 1.2;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.text.primary};
  
  span {
    color: ${({ theme }) => theme.colors.primary[500]};
    position: relative;
    display: inline-block;
    
    &:after {
      content: '';
      position: absolute;
      bottom: 6px;
      left: 0;
      width: 100%;
      height: 10px;
      background-color: ${({ theme }) => theme.colors.primary[200]};
      opacity: 0.3;
      z-index: -1;
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }
`;

const HeroDescription = styled(motion.p)`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  line-height: 1.6;
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
  }
`;

const PrimaryButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
  border-radius: ${({ theme }) => theme.radii.md};
  text-decoration: none;
  transition: background-color 0.3s ease;
  gap: ${({ theme }) => theme.spacing[2]};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const SecondaryButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary[500]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.primary[500]};
  text-decoration: none;
  transition: background-color 0.3s ease;
  gap: ${({ theme }) => theme.spacing[2]};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[50]};
  }
`;

const HeroImage = styled(motion.div)`
  position: relative;
  width: 500px;
  
  img {
    width: 100%;
    height: auto;
    border-radius: ${({ theme }) => theme.radii.lg};
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 100%;
    max-width: 500px;
  }
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[200]} 0%,
    ${({ theme }) => theme.colors.primary[400]} 100%
  );
  opacity: 0.1;
  top: -200px;
  right: -100px;
  z-index: 0;
`;

const Hero: React.FC = () => {
  return (
    <HeroSection>
      <BackgroundDecoration />
      
      <HeroContent>
        <HeroTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Organize Your Browser Tabs with <span>TabHive</span>
        </HeroTitle>
        
        <HeroDescription
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          TabHive is a powerful browser extension that helps you organize tabs by clustering similar content together, making your browsing experience more productive and less cluttered.
        </HeroDescription>
        
        <ButtonGroup
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <PrimaryButton href="#download" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <FiDownload /> Download Extension
          </PrimaryButton>
          <SecondaryButton href="#how-it-works" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Learn More <FiArrowRight />
          </SecondaryButton>
        </ButtonGroup>
      </HeroContent>
      
      <HeroImage
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <img src="/images/hero-screenshot.png" alt="TabHive browser extension" />
      </HeroImage>
    </HeroSection>
  );
};

export default Hero; 
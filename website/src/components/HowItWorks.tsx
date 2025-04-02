import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiSearch, FiCpu, FiLayers, FiCheckCircle } from 'react-icons/fi';

const HowItWorksSection = styled.section`
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[6]}`};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[6]}`};
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto ${({ theme }) => theme.spacing[12]};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: ${({ theme }) => theme.colors.primary[500]};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
  }
`;

const SectionDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[12]};
  max-width: 900px;
  margin: 0 auto;
`;

const Step = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[8]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  &:nth-child(even) {
    flex-direction: row-reverse;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      flex-direction: column;
    }
  }
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepNumber = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[500]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const StepTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const StepDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const StepImageContainer = styled(motion.div)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 250px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    margin-bottom: ${({ theme }) => theme.spacing[6]};
  }
`;

const StepIcon = styled.div`
  font-size: 100px;
  color: ${({ theme }) => theme.colors.primary[400]};
  opacity: 0.8;
`;

const StepFeatures = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const StepFeature = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  
  svg {
    color: ${({ theme }) => theme.colors.success.main};
  }
`;

const HowItWorks: React.FC = () => {
  return (
    <HowItWorksSection id="how-it-works">
      <SectionHeader>
        <SectionTitle>How It Works</SectionTitle>
        <SectionDescription>
          TabHive uses advanced technology to intelligently organize your browser tabs in just a few simple steps.
        </SectionDescription>
      </SectionHeader>
      
      <StepsContainer>
        <Step>
          <StepContent>
            <StepNumber>STEP 01</StepNumber>
            <StepTitle>Tab Analysis</StepTitle>
            <StepDescription>
              When you click the TabHive icon, the extension analyzes the content and titles of all your open tabs in the current window.
            </StepDescription>
            <StepFeatures>
              <StepFeature>
                <FiCheckCircle /> Reads page content and metadata
              </StepFeature>
              <StepFeature>
                <FiCheckCircle /> Detects course codes and keywords
              </StepFeature>
              <StepFeature>
                <FiCheckCircle /> Prepares data for clustering
              </StepFeature>
            </StepFeatures>
          </StepContent>
          
          <StepImageContainer
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <StepIcon>
              <FiSearch />
            </StepIcon>
          </StepImageContainer>
        </Step>
        
        <Step>
          <StepContent>
            <StepNumber>STEP 02</StepNumber>
            <StepTitle>Smart Clustering</StepTitle>
            <StepDescription>
              TabHive applies advanced algorithms to group your tabs based on similarity, prioritizing course codes for academic contexts.
            </StepDescription>
            <StepFeatures>
              <StepFeature>
                <FiCheckCircle /> Groups tabs by course codes first
              </StepFeature>
              <StepFeature>
                <FiCheckCircle /> Applies k-means clustering for remaining tabs
              </StepFeature>
              <StepFeature>
                <FiCheckCircle /> Determines optimal number of groups
              </StepFeature>
            </StepFeatures>
          </StepContent>
          
          <StepImageContainer
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <StepIcon>
              <FiCpu />
            </StepIcon>
          </StepImageContainer>
        </Step>
        
        <Step>
          <StepContent>
            <StepNumber>STEP 03</StepNumber>
            <StepTitle>Tab Organization</StepTitle>
            <StepDescription>
              The extension creates Chrome tab groups with meaningful names based on the content and arranges your tabs accordingly.
            </StepDescription>
            <StepFeatures>
              <StepFeature>
                <FiCheckCircle /> Creates Chrome tab groups
              </StepFeature>
              <StepFeature>
                <FiCheckCircle /> Names groups based on content or course codes
              </StepFeature>
              <StepFeature>
                <FiCheckCircle /> Arranges tabs within each group
              </StepFeature>
            </StepFeatures>
          </StepContent>
          
          <StepImageContainer
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <StepIcon>
              <FiLayers />
            </StepIcon>
          </StepImageContainer>
        </Step>
      </StepsContainer>
    </HowItWorksSection>
  );
};

export default HowItWorks; 
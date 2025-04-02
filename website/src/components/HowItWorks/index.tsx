import React from 'react';
import styled from 'styled-components';
import { Container, Section } from '../../styles/components';
import { motion } from 'framer-motion';

const HowItWorksSection = styled(Section)`
  position: relative;
  overflow: hidden;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xxl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const TextContent = styled.div`
  flex: 1;
`;

const VideoContent = styled.div`
  flex: 1;
  min-height: 400px;
  background-color: ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.large};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
`;

const StepTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const BackgroundAccent = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(0, 255, 157, 0.03) 0%, rgba(0, 255, 157, 0) 70%);
  right: -300px;
  bottom: -300px;
  z-index: -1;
`;

const HowItWorks: React.FC = () => {
  return (
    <HowItWorksSection id="how-it-works">
      <BackgroundAccent />
      <Container>
        <SectionTitle>
          How to Use <span style={{ color: "#00FF9D" }}>TabHive</span>
        </SectionTitle>
        <ContentContainer>
          <TextContent>
            <StepTitle>Smart Tab Organization</StepTitle>
            <StepDescription>
              TabHive intelligently organizes your browser tabs based on content similarity and course codes. 
              It uses advanced algorithms to understand the relationships between your tabs.
            </StepDescription>
            
            <StepTitle>Course Code Detection</StepTitle>
            <StepDescription>
              Automatically detects course codes like "CS 101" or "MATH 118" in your tab titles and groups them accordingly,
              making it perfect for students managing multiple courses.
            </StepDescription>
            
            <StepTitle>One-Click Organization</StepTitle>
            <StepDescription>
              Simply click the TabHive icon in your browser and press "Organize Tabs." That's it!
              No complex setup or configuration required.
            </StepDescription>
          </TextContent>
          
          <VideoContent>
            Video will be placed here
          </VideoContent>
        </ContentContainer>
      </Container>
    </HowItWorksSection>
  );
};

export default HowItWorks; 
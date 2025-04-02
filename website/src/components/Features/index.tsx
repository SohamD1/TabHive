import React from 'react';
import styled from 'styled-components';
import { Container, Section, Card, Grid } from '../../styles/components';
import { motion } from 'framer-motion';

const FeaturesSection = styled(Section)`
  background-color: ${({ theme }) => theme.colors.secondary};
  position: relative;
  overflow: hidden;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const FeatureCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.colors.dark};
  height: 100%;
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: rgba(0, 255, 157, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  svg {
    width: 32px;
    height: 32px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FeatureTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const BackgroundGradient = styled.div`
  position: absolute;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle at center, rgba(0, 255, 157, 0.03) 0%, rgba(0, 255, 157, 0) 70%);
  left: -400px;
  top: -400px;
  z-index: 0;
  border-radius: 50%;
`;

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <FeatureCard>
        <FeatureIcon>{icon}</FeatureIcon>
        <FeatureTitle>{title}</FeatureTitle>
        <FeatureDescription>{description}</FeatureDescription>
      </FeatureCard>
    </motion.div>
  );
};

const Features: React.FC = () => {
  return (
    <FeaturesSection id="features">
      <BackgroundGradient />
      <Container>
        <SectionTitle>
          Works on <span style={{ color: "#00FF9D" }}>Everything</span>
        </SectionTitle>
        <Grid>
          <Feature
            icon={
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            title="Course Code Detection"
            description="Automatically recognizes and groups tabs based on course codes like 'CS101' or 'MATH 118', perfect for students juggling multiple classes."
          />
          
          <Feature
            icon={
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            title="AI-Powered Clustering"
            description="Uses intelligent algorithms to analyze tab content and group similar pages together, even without explicit course codes."
          />
          
          <Feature
            icon={
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            title="One-Click Organization"
            description="Instantly organize all your open tabs with a single click. No configuration required - just click and watch your tabs get organized."
          />
          
          <Feature
            icon={
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            title="Workspace Saving"
            description="Save your organized tab groups as workspaces to quickly restore them later, perfect for switching between different projects or courses."
          />
          
          <Feature
            icon={
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            title="No API Key Required"
            description="Unlike other tools, TabHive works out of the box without requiring any API keys or accounts. Your data stays on your device."
          />
          
          <Feature
            icon={
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2.67001 18.95L7.60001 15.64C8.39001 15.11 9.53001 15.17 10.24 15.78L10.57 16.07C11.35 16.74 12.61 16.74 13.39 16.07L17.55 12.5C18.33 11.83 19.59 11.83 20.37 12.5L22 13.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            title="Beautiful UI"
            description="A clean, modern interface that integrates seamlessly with Chrome. TabHive enhances your browsing experience without getting in the way."
          />
        </Grid>
      </Container>
    </FeaturesSection>
  );
};

export default Features; 
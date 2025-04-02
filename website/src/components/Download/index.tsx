import React from 'react';
import styled from 'styled-components';
import { Container, Section, GlowingButton } from '../../styles/components';
import { motion } from 'framer-motion';

const DownloadSection = styled(Section)`
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto ${({ theme }) => theme.spacing.xxl};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xxl};
  margin: ${({ theme }) => theme.spacing.xxl} 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const BackgroundGlow = styled.div`
  position: absolute;
  bottom: -400px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(circle at center, rgba(0, 255, 157, 0.05) 0%, rgba(0, 255, 157, 0) 70%);
  z-index: -1;
  border-radius: 50%;
`;

const DownloadButton = styled(GlowingButton)`
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xxl}`};
  font-size: ${({ theme }) => theme.fontSizes.large};
  
  svg {
    margin-right: ${({ theme }) => theme.spacing.md};
  }
`;

const CardContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.large};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
`;

const CardTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const SupportBullets = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const SupportItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
`;

const SupportIcon = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  svg {
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SupportLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const Download: React.FC = () => {
  return (
    <DownloadSection id="download">
      <BackgroundGlow />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <SectionTitle>Take the short way.</SectionTitle>
          <Subtitle>Download TabHive today and transform your browsing experience with intelligent tab organization.</Subtitle>
          
          <ButtonRow>
            <DownloadButton href="https://chrome.google.com/webstore" variant="primary">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <circle cx="12" cy="12" r="10" fill="#000" />
                <circle cx="12" cy="12" r="3" stroke="#00FF9D" strokeWidth="2" />
                <path d="M12 9V4" stroke="#00FF9D" strokeWidth="2" strokeLinecap="round" />
                <path d="M14.5 10.5L19 7" stroke="#00FF9D" strokeWidth="2" strokeLinecap="round" />
                <path d="M14.5 13.5L19 17" stroke="#00FF9D" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 15V20" stroke="#00FF9D" strokeWidth="2" strokeLinecap="round" />
                <path d="M9.5 13.5L5 17" stroke="#00FF9D" strokeWidth="2" strokeLinecap="round" />
                <path d="M9.5 10.5L5 7" stroke="#00FF9D" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Download for Chrome
            </DownloadButton>
          </ButtonRow>
          
          <CardContainer>
            <CardTitle>Works with Everything</CardTitle>
            <SupportBullets>
              <SupportItem>
                <SupportIcon>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 3H14V21H10V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 10H21V14H3V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </SupportIcon>
                <SupportLabel>Google Docs</SupportLabel>
              </SupportItem>
              <SupportItem>
                <SupportIcon>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </SupportIcon>
                <SupportLabel>Course Websites</SupportLabel>
              </SupportItem>
              <SupportItem>
                <SupportIcon>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 21V5C15 3.895 14.105 3 13 3H5C3.895 3 3 3.895 3 5V19C3 20.105 3.895 21 5 21H15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 5H19C20.105 5 21 5.895 21 7V19C21 20.105 20.105 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 7H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M9 11H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M9 15H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </SupportIcon>
                <SupportLabel>Research Papers</SupportLabel>
              </SupportItem>
              <SupportItem>
                <SupportIcon>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H20V18H4V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 10H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </SupportIcon>
                <SupportLabel>News Sites</SupportLabel>
              </SupportItem>
              <SupportItem>
                <SupportIcon>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16v16H4V4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 10h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 4v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </SupportIcon>
                <SupportLabel>GitHub</SupportLabel>
              </SupportItem>
            </SupportBullets>
          </CardContainer>
          
          <StatsContainer>
            <StatItem>
              <StatValue>100%</StatValue>
              <StatLabel>Free</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>4.8/5</StatValue>
              <StatLabel>User Rating</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>10k+</StatValue>
              <StatLabel>Downloads</StatLabel>
            </StatItem>
          </StatsContainer>
        </motion.div>
      </Container>
    </DownloadSection>
  );
};

export default Download; 
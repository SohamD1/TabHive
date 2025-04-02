import React from 'react';
import styled from 'styled-components';

const FeaturesSection = styled.section`
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[6]}`};
  background-color: ${({ theme }) => theme.colors.background.primary};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[6]}`};
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
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

const Features: React.FC = () => {
  return (
    <FeaturesSection id="features">
      <SectionHeader>
        <SectionTitle>Demo</SectionTitle>
      </SectionHeader>
    </FeaturesSection>
  );
};

export default Features; 
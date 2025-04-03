import React from 'react';
import styled, { keyframes } from 'styled-components';

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 10px 2px rgba(251, 251, 4, 0.1); }
  50% { box-shadow: 0 0 20px 5px rgba(251, 251, 4, 0.2); }
  100% { box-shadow: 0 0 10px 2px rgba(251, 251, 4, 0.1); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 40px 0;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(251, 251, 4, 0.05) 0%, rgba(0, 0, 0, 0) 70%);
    top: -50%;
    left: -50%;
    z-index: -1;
  }
  
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: transparent;
    background-image: 
      linear-gradient(to right, rgba(251, 251, 4, 0.07) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(251, 251, 4, 0.07) 1px, transparent 1px),
      radial-gradient(circle at 40px 40px, rgba(251, 251, 4, 0.1) 2px, transparent 2px),
      radial-gradient(circle at 80px 120px, rgba(251, 251, 4, 0.1) 2px, transparent 2px),
      radial-gradient(circle at 160px 90px, rgba(251, 251, 4, 0.1) 2px, transparent 2px),
      radial-gradient(circle at 220px 160px, rgba(251, 251, 4, 0.1) 2px, transparent 2px),
      radial-gradient(circle at 280px 30px, rgba(251, 251, 4, 0.1) 2px, transparent 2px),
      linear-gradient(to right, transparent 70px, rgba(251, 251, 4, 0.08) 70px, rgba(251, 251, 4, 0.08) 71px, transparent 71px),
      linear-gradient(to bottom, transparent 110px, rgba(251, 251, 4, 0.08) 110px, rgba(251, 251, 4, 0.08) 111px, transparent 111px),
      linear-gradient(45deg, transparent 190px, rgba(251, 251, 4, 0.07) 190px, rgba(251, 251, 4, 0.07) 192px, transparent 192px);
    background-size: 300px 300px;
    background-position: center;
    z-index: -2;
    opacity: 0.6;
  }
`;

const CircuitLines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -3;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    background-image: 
      linear-gradient(90deg, transparent 97%, rgba(251, 251, 4, 0.1) 97%),
      linear-gradient(0deg, transparent 97%, rgba(251, 251, 4, 0.1) 97%),
      linear-gradient(135deg, transparent 92%, rgba(251, 251, 4, 0.08) 92%);
    background-size: 50px 50px, 50px 50px, 100px 100px;
    opacity: 0.5;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 10%;
    left: 20%;
    width: 60%;
    height: 60%;
    border: 1px solid rgba(251, 251, 4, 0.05);
    border-radius: 50%;
    box-shadow: inset 0 0 50px rgba(251, 251, 4, 0.02);
  }
`;

const RandomLine = styled.div`
  position: absolute;
  background: rgba(251, 251, 4, 0.07);
  
  &:nth-child(1) {
    top: 20%;
    left: 10%;
    width: 30%;
    height: 1px;
    transform: rotate(30deg);
  }
  
  &:nth-child(2) {
    top: 70%;
    left: 65%;
    width: 25%;
    height: 1px;
    transform: rotate(-15deg);
  }
  
  &:nth-child(3) {
    top: 40%;
    left: 80%;
    width: 15%;
    height: 1px;
    transform: rotate(-45deg);
  }
  
  &:nth-child(4) {
    top: 85%;
    left: 30%;
    width: 20%;
    height: 1px;
    transform: rotate(10deg);
  }
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  margin-bottom: 30px;
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

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  width: 100%;
  max-width: 1200px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FeatureCard = styled.div`
  width: 300px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 25px;
  border: 1px solid rgba(251, 251, 4, 0.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    border: 1px solid rgba(251, 251, 4, 0.3);
    animation: ${pulse} 3s infinite, ${glowAnimation} 3s infinite;
  }
  
  @media (max-width: 768px) {
    width: 90%;
    max-width: 300px;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--accent-color);
  margin-bottom: 15px;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const HowItWorks: React.FC = () => {
  return (
    <Container id="how-it-works">
      <CircuitLines>
        <RandomLine />
        <RandomLine />
        <RandomLine />
        <RandomLine />
      </CircuitLines>
      <SectionTitle>How It Works</SectionTitle>
      
      <Content>
        <FeatureCard>
          <FeatureTitle>Smart Detection</FeatureTitle>
          <FeatureDescription>
            TabHive analyzes your open tabs and automatically detects their content, including course codes, project pages, and related topics.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureTitle>AI Clustering</FeatureTitle>
          <FeatureDescription>
            Using AI-powered clustering algorithms, TabHive groups similar tabs together based on content, helping you stay organized even with dozens of tabs open.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureTitle>Automatic Grouping</FeatureTitle>
          <FeatureDescription>
            With a single click, TabHive organizes your tabs into color-coded groups with meaningful names, making it easy to find what you need instantly.
          </FeatureDescription>
        </FeatureCard>
      </Content>
    </Container>
  );
};

export default HowItWorks; 
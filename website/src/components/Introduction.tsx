import React from 'react';
import styled from 'styled-components';

const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 40px 0;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: var(--accent-color);
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  width: 100%;
  margin-top: 40px;
`;

const FeatureCard = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 30px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 221, 0, 0.1);
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 30px rgba(255, 221, 0, 0.1);
    border-color: rgba(255, 221, 0, 0.3);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: var(--accent-color);
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: var(--text-color);
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
`;

const Introduction: React.FC = () => {
  const features = [
    {
      icon: "📊",
      title: "Smart Organization",
      description: "Group related tabs into projects. Access them instantly, even after browser restarts."
    },
    {
      icon: "⚡",
      title: "Boost Productivity",
      description: "Switch between projects seamlessly. No more tab overload slowing you down."
    },
    {
      icon: "🔄",
      title: "Context Switching",
      description: "Switch between work, research, and personal browsing with one click."
    },
    {
      icon: "🧠",
      title: "Memory Saver",
      description: "Save system resources by keeping tabs organized and inactive when not in use."
    }
  ];

  return (
    <IntroContainer id="features">
      <SectionTitle>What is TabHive?</SectionTitle>
      <FeatureDescription style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '20px', fontSize: '1.2rem' }}>
        TabHive is a browser extension that revolutionizes how you manage tabs. 
        It creates a structured environment where you can organize tabs into groups, 
        save sessions, and quickly access your work without the chaos of countless open tabs.
      </FeatureDescription>
      
      <FeaturesGrid>
        {features.map((feature, index) => (
          <FeatureCard key={index}>
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>
    </IntroContainer>
  );
};

export default Introduction; 
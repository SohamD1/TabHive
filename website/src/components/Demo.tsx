import React from 'react';
import styled from 'styled-components';

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 60px 0;
  background-color: rgba(255, 221, 0, 0.05);
  border-radius: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: var(--accent-color);
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const DemoContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  
  @media (min-width: 992px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

const DemoVideo = styled.div`
  width: 100%;
  max-width: 600px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 221, 0, 0.3);
  margin-bottom: 30px;
  
  @media (min-width: 992px) {
    width: 60%;
    margin-bottom: 0;
  }
`;

const VideoPlaceholder = styled.div`
  background-color: #111111;
  width: 100%;
  padding-top: 56.25%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlayIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background-color: rgba(255, 221, 0, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:before {
    content: '';
    width: 0;
    height: 0;
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 25px solid black;
    margin-left: 5px;
  }
`;

const DemoSteps = styled.div`
  width: 100%;
  
  @media (min-width: 992px) {
    width: 35%;
  }
`;

const Step = styled.div`
  margin-bottom: 25px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 10px;
  border-left: 3px solid var(--accent-color);
`;

const StepNumber = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--accent-color);
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
  float: left;
`;

const StepContent = styled.div`
  margin-left: 40px;
`;

const StepTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: var(--text-color);
`;

const StepDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
`;

const Demo: React.FC = () => {
  const steps = [
    {
      title: "Install the Extension",
      description: "Download TabHive from the Chrome Web Store and install it in your browser."
    },
    {
      title: "Create Your First Hive",
      description: "Click the TabHive icon and create a new hive (tab group) for your current project."
    },
    {
      title: "Add Tabs to Your Hive",
      description: "Organize your open tabs into the hive with a single click."
    },
    {
      title: "Switch Between Hives",
      description: "Easily switch contexts by selecting different hives from the dropdown menu."
    }
  ];

  return (
    <DemoContainer id="demo">
      <SectionTitle>See TabHive in Action</SectionTitle>
      
      <DemoContent>
        <DemoVideo>
          <VideoPlaceholder>
            <PlayIcon />
          </VideoPlaceholder>
        </DemoVideo>
        
        <DemoSteps>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepNumber>{index + 1}</StepNumber>
              <StepContent>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </StepContent>
            </Step>
          ))}
        </DemoSteps>
      </DemoContent>
    </DemoContainer>
  );
};

export default Demo; 
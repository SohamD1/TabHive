import React from 'react';
import styled from 'styled-components';
import Navbar from './components/Navbar';
import CallToAction from './components/CallToAction';
import Download from './components/Download';
import Footer from './components/Footer';
import HowItWorks from './components/HowItWorks';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
  background: radial-gradient(circle at top center, #121212 0%, #000000 100%);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(90deg, transparent 95%, rgba(251, 251, 4, 0.05) 95%),
      linear-gradient(0deg, transparent 95%, rgba(251, 251, 4, 0.05) 95%),
      linear-gradient(to right, transparent 80px, rgba(251, 251, 4, 0.03) 80px, rgba(251, 251, 4, 0.03) 81px, transparent 81px),
      linear-gradient(to bottom, transparent 180px, rgba(251, 251, 4, 0.03) 180px, rgba(251, 251, 4, 0.03) 181px, transparent 181px);
    background-size: 120px 120px, 120px 120px, 240px 240px, 240px 240px;
    z-index: -1;
    opacity: 0.4;
    pointer-events: none;
  }
`;

const Section = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 100px; /* Add padding to account for fixed navbar */
  overflow-x: hidden;
`;

function App() {
  return (
    <AppContainer>
      <Navbar />
      <MainContent>
        <Section>
          <CallToAction />
        </Section>
        
        <Section>
          <HowItWorks />
        </Section>
        
        <Section>
          <Download />
        </Section>
      </MainContent>
      <Footer />
    </AppContainer>
  );
}

export default App;

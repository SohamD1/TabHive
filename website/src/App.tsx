import React from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import CTA from './components/CTA';
import Footer from './components/Footer';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
`;

const App: React.FC = () => {
  return (
    <AppContainer>
      <Header />
      <MainContent>
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </MainContent>
      <Footer />
    </AppContainer>
  );
};

export default App; 
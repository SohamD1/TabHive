import React from 'react';
import styled from 'styled-components';
import Navbar from './components/Navbar';
import CallToAction from './components/CallToAction';
import Introduction from './components/Introduction';
import Demo from './components/Demo';
import Download from './components/Download';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;

const Section = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function App() {
  return (
    <AppContainer>
      <Navbar />
      <Section>
        <CallToAction />
      </Section>
      <Section>
        <Introduction />
      </Section>
      <Section>
        <Demo />
      </Section>
      <Section>
        <Download />
      </Section>
    </AppContainer>
  );
}

export default App;

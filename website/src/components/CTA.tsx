import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiDownload, FiChrome } from 'react-icons/fi';

const CTASection = styled.section`
  padding: ${({ theme }) => `${theme.spacing[20]} ${theme.spacing[6]}`};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[600]} 0%,
    ${({ theme }) => theme.colors.primary[800]} 100%
  );
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => `${theme.spacing[12]} ${theme.spacing[6]}`};
  }
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  top: -400px;
  right: -200px;
  
  &:before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    top: 300px;
    left: -300px;
  }
`;

const CTAContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const CTATitle = styled(motion.h2)`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }
`;

const CTADescription = styled(motion.p)`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  max-width: 600px;
  margin: 0 auto ${({ theme }) => theme.spacing[10]};
  opacity: 0.9;
  line-height: 1.6;
`;

const DownloadButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: ${({ theme }) => theme.colors.primary[700]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[8]}`};
  border-radius: ${({ theme }) => theme.radii.md};
  text-decoration: none;
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const BrowserSupport = styled(motion.div)`
  margin-top: ${({ theme }) => theme.spacing[8]};
  opacity: 0.7;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const CTA: React.FC = () => {
  return (
    <CTASection id="download">
      <BackgroundDecoration />
      
      <CTAContainer>
        <CTATitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Ready to Organize Your Browsing Experience?
        </CTATitle>
        
        <CTADescription
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Download TabHive today and experience a more productive and organized way to browse the web. No more tab chaos, just seamless browsing.
        </CTADescription>
        
        <DownloadButton
          href="https://chrome.google.com/webstore/category/extensions"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiDownload size={24} /> Download Extension
        </DownloadButton>
        
        <BrowserSupport
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <FiChrome size={16} /> Compatible with Chrome, Edge, and other Chromium-based browsers
        </BrowserSupport>
      </CTAContainer>
    </CTASection>
  );
};

export default CTA; 
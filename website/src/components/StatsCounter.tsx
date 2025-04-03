import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const digitFlip = keyframes`
  0% { transform: rotateX(0deg); }
  50% { transform: rotateX(90deg); }
  100% { transform: rotateX(0deg); }
`;

const StatsContainer = styled.div`
  width: 100%;
  padding: 80px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(20, 20, 20, 0.5);
  border-top: 1px solid rgba(255, 215, 0, 0.1);
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  margin: 60px 0;
  animation: ${fadeIn} 0.8s ease-out;
`;

const StatsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 120px;
  margin-top: 20px;
  width: 100%;
  max-width: 1000px;
  
  @media (max-width: 768px) {
    gap: 80px;
    flex-direction: column;
    align-items: center;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  padding: 20px;
`;

const StatValue = styled.div`
  font-size: 4rem;
  font-weight: 700;
  color: var(--accent-color);
  display: flex;
  align-items: center;
  perspective: 500px;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
`;

const StatDigit = styled.span<{ animate: boolean }>`
  display: inline-block;
  animation: ${props => props.animate ? digitFlip : 'none'} 0.5s ease;
  transform-style: preserve-3d;
`;

const StatSuffix = styled.span`
  display: inline-block;
  font-size: 3rem;
  margin-left: 5px;
  animation: ${digitFlip} 0.5s ease;
`;

const StatLabel = styled.div`
  font-size: 1.4rem;
  color: var(--text-color);
  margin-top: 15px;
  opacity: 0.9;
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

interface CounterProps {
  end: number;
  duration: number;
  label: string;
  suffix?: string;
}

const Counter: React.FC<CounterProps> = ({ end, duration, label, suffix }) => {
  const [count, setCount] = useState(0);
  const [animate, setAnimate] = useState(false);
  const countRef = useRef<HTMLDivElement>(null);
  
  // Check if element is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startCounter();
        }
      },
      { threshold: 0.1 }
    );
    
    if (countRef.current) {
      observer.observe(countRef.current);
    }
    
    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);
  
  // Counter animation
  const startCounter = () => {
    const startTime = Date.now();
    const step = () => {
      const currentTime = Date.now();
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentCount = Math.floor(progress * end);
      
      if (count !== currentCount) {
        setAnimate(true);
        setCount(currentCount);
        
        setTimeout(() => {
          setAnimate(false);
        }, 500);
      }
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    
    requestAnimationFrame(step);
  };
  
  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  return (
    <StatItem ref={countRef}>
      <StatValue>
        {formatNumber(count).split('').map((digit, i) => (
          <StatDigit key={i} animate={animate}>
            {digit}
          </StatDigit>
        ))}
        {suffix && <StatSuffix>{suffix}</StatSuffix>}
      </StatValue>
      <StatLabel>{label}</StatLabel>
    </StatItem>
  );
};

const StatsCounter: React.FC = () => {
  return (
    <StatsContainer>
      <StatsRow>
        <Counter end={100} duration={2000} suffix="K+" label="Downloads" />
        <Counter end={50} duration={1800} suffix="K+" label="Active Users" />
      </StatsRow>
    </StatsContainer>
  );
};

export default StatsCounter; 
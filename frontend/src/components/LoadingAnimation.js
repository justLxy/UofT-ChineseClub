import React from 'react';
import styled, { keyframes } from 'styled-components';

// 脉冲点动画
const pulse = keyframes`
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
`;

// 波浪动画
const wave = keyframes`
  0%, 60%, 100% {
    transform: initial;
  }
  30% {
    transform: translateY(-10px);
  }
`;

// 淡入淡出动画
const fade = keyframes`
  0%, 80%, 100% {
    opacity: 0.3;
  }
  40% {
    opacity: 1;
  }
`;

// 旋转动画（精致版）
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// 骨架屏闪烁
const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const LoadingContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
`;

// 脉冲点样式
const PulseDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary);
  animation: ${pulse} 1.4s ease-in-out infinite both;
  animation-delay: ${props => props.delay}s;
`;

// 波浪点样式
const WaveDot = styled.div`
  width: 6px;
  height: 20px;
  border-radius: 3px;
  background: linear-gradient(45deg, var(--primary), var(--accent));
  animation: ${wave} 1.2s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

// 淡入淡出点样式
const FadeDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--primary);
  animation: ${fade} 1.4s linear infinite;
  animation-delay: ${props => props.delay}s;
`;

// 精致旋转环
const SpinRing = styled.div`
  width: ${props => props.size || 20}px;
  height: ${props => props.size || 20}px;
  border: 2px solid rgba(224, 43, 32, 0.1);
  border-top: 2px solid var(--primary);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

// 骨架屏样式
const SkeletonBar = styled.div`
  width: ${props => props.width || '100px'};
  height: ${props => props.height || '20px'};
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 400% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  
  [data-theme="dark"] & {
    background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
    background-size: 400% 100%;
  }
`;

const LoadingAnimation = ({ type = 'pulse', size, color, className, ...props }) => {
  switch (type) {
    case 'pulse':
      return (
        <LoadingContainer className={className} {...props}>
          <PulseDot delay={0} />
          <PulseDot delay={0.2} />
          <PulseDot delay={0.4} />
        </LoadingContainer>
      );
    
    case 'wave':
      return (
        <LoadingContainer className={className} {...props}>
          <WaveDot delay={0} />
          <WaveDot delay={0.1} />
          <WaveDot delay={0.2} />
          <WaveDot delay={0.3} />
          <WaveDot delay={0.4} />
        </LoadingContainer>
      );
    
    case 'fade':
      return (
        <LoadingContainer className={className} {...props}>
          <FadeDot delay={0} />
          <FadeDot delay={0.5} />
          <FadeDot delay={1.0} />
        </LoadingContainer>
      );
    
    case 'ring':
      return <SpinRing size={size} className={className} {...props} />;
    
    case 'skeleton':
      return (
        <SkeletonBar 
          width={props.width} 
          height={props.height} 
          className={className} 
        />
      );
    
    default:
      return (
        <LoadingContainer className={className} {...props}>
          <PulseDot delay={0} />
          <PulseDot delay={0.2} />
          <PulseDot delay={0.4} />
        </LoadingContainer>
      );
  }
};

export default LoadingAnimation; 
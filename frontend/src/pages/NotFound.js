import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const StyledNotFound = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  background: var(--background-alt);
  position: relative;
  overflow: hidden;
  
  .container {
    max-width: 700px;
    position: relative;
    z-index: 1;
  }
  
  .error-code {
    font-size: clamp(8rem, 20vw, 15rem);
    font-weight: 800;
    line-height: 1;
    margin-bottom: 1rem;
    background: var(--gradient-1);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    position: relative;
    letter-spacing: -5px;
    
    &:after {
      content: '404';
      position: absolute;
      left: 5px;
      top: 5px;
      z-index: -1;
      background: rgba(224, 43, 32, 0.1);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }
  
  h1 {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    margin-bottom: 1.5rem;
  }
  
  p {
    font-size: 1.1rem;
    color: var(--text-light);
    margin-bottom: 2rem;
  }
  
  .buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .animated-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    
    .circle {
      position: absolute;
      border-radius: 50%;
      opacity: 0.05;
    }
    
    .circle:nth-child(1) {
      width: 300px;
      height: 300px;
      bottom: -100px;
      left: -100px;
      background: var(--primary);
    }
    
    .circle:nth-child(2) {
      width: 200px;
      height: 200px;
      top: -50px;
      right: -50px;
      background: var(--accent);
    }
    
    .circle:nth-child(3) {
      width: 150px;
      height: 150px;
      bottom: 20%;
      right: 20%;
      background: var(--primary-dark);
    }
  }
`;

const NotFound = () => {
  const location = useLocation();
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <StyledNotFound>
      <SEO
        title="页面未找到 | UTChinese Network 多大中文"
        description="您访问的页面不存在，请返回多大中文官网首页。"
        url={`https://www.utchinese.org${location.pathname}`}
      />
      <div className="animated-bg">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
      
      <motion.div 
        className="container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="error-code">404</div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className="buttons">
          <Link to="/" className="button">Back to Home</Link>
          <Link to="/about" className="button secondary">About Us</Link>
        </div>
      </motion.div>
    </StyledNotFound>
  );
};

export default NotFound; 
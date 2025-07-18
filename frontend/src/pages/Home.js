import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ImageCarousel from '../components/ImageCarousel';
import SEO from '../components/SEO';

gsap.registerPlugin(ScrollTrigger);

const StyledHome = styled.div`
  .hero {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: radial-gradient(circle at 50% 50%, rgba(252, 185, 0, 0.1) 0%, rgba(224, 43, 32, 0.05) 50%, rgba(0, 0, 0, 0) 100%);
    overflow: hidden;
    padding-top: 5rem;
  }

  .hero-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    
    .hero-bg-circle {
      position: absolute;
      border-radius: 50%;
      background: var(--primary);
      filter: blur(80px);
      opacity: 0.1;
      animation: float 20s infinite ease-in-out;
    }
    
    .hero-bg-circle:nth-child(1) {
      width: 400px;
      height: 400px;
      left: -100px;
      top: 20%;
      background: var(--primary);
      animation-delay: 0s;
    }
    
    .hero-bg-circle:nth-child(2) {
      width: 300px;
      height: 300px;
      right: -50px;
      top: 10%;
      background: var(--accent);
      animation-delay: -5s;
    }
    
    .hero-bg-circle:nth-child(3) {
      width: 350px;
      height: 350px;
      left: 40%;
      bottom: -100px;
      background: var(--primary-dark);
      animation-delay: -10s;
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(5%, 5%) scale(1.1);
    }
    50% {
      transform: translate(0, 10%) scale(1);
    }
    75% {
      transform: translate(-5%, 5%) scale(0.9);
    }
  }

  .hero-content {
    text-align: center;
    z-index: 1;
    max-width: 900px;
    padding: 0 2rem;
  }

  .hero-title {
    font-size: clamp(3rem, 10vw, 6rem);
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.1;
    position: relative;
    
    .gradient-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--gradient-1);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      opacity: 0.8;
      pointer-events: none;
    }
  }

  .hero-subtitle {
    font-size: clamp(1.2rem, 3vw, 1.8rem);
    margin-bottom: 2.5rem;
    color: var(--text-light);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-cta {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .scroll-indicator {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--text-light);
    font-size: 0.9rem;
    opacity: 0.8;
    
    .mouse {
      width: 26px;
      height: 40px;
      border: 2px solid var(--text-light);
      border-radius: 20px;
      position: relative;
      margin: 0.5rem 0;
      
      &:before {
        content: '';
        position: absolute;
        top: 6px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 8px;
        background: var(--primary);
        border-radius: 2px;
        animation: scroll 2s infinite;
      }
    }
    
    @keyframes scroll {
      0% {
        opacity: 1;
        transform: translate(-50%, 0);
      }
      90% {
        opacity: 0;
        transform: translate(-50%, 15px);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, 0);
      }
    }
  }

  .about-section {
    padding: 8rem 0;
    position: relative;
    overflow: hidden;
    background: var(--background-alt);
  }

  .about-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    
    @media (max-width: 992px) {
      grid-template-columns: 1fr;
      text-align: center;
      
      .about-image {
        order: -1;
        max-width: 600px;
        margin: 0 auto;
      }
    }
  }

  .about-image {
    position: relative;
    max-width: 100%;
    
    @media (max-width: 992px) {
      width: 100%;
      max-width: 600px;
      margin: 0 auto 2rem;
    }
    
    @media (max-width: 480px) {
      max-width: 100%;
      width: 100%;
      padding: 0 1rem;
    }
    
    img {
      width: 100%;
      border-radius: 10px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 30px 50px rgba(0, 0, 0, 0.15);
      }
      
      @media (max-width: 992px) {
        &:hover {
          transform: none;
        }
      }
    }
    
    &:after {
      content: '';
      position: absolute;
      top: -20px;
      left: -20px;
      width: 100px;
      height: 100px;
      background: var(--primary);
      opacity: 0.1;
      border-radius: 20px;
      z-index: -1;
      
      @media (max-width: 768px) {
        width: 70px;
        height: 70px;
        top: -10px;
        left: -10px;
      }
    }
    
    &:before {
      content: '';
      position: absolute;
      bottom: -30px;
      right: -20px;
      width: 150px;
      height: 150px;
      background: var(--accent);
      opacity: 0.1;
      border-radius: 10px;
      z-index: -1;
      
      @media (max-width: 768px) {
        width: 100px;
        height: 100px;
        bottom: -20px;
        right: -10px;
      }
    }
  }

  .about-content {
    h2 {
      margin-bottom: 1.5rem;
      font-size: clamp(2rem, 4vw, 3rem);
    }
    
    p {
      margin-bottom: 1.5rem;
      font-size: 1.1rem;
      color: var(--text-light);
    }
  }

  .features-section {
    padding: 8rem 0;
    position: relative;
  }

  .features-heading {
    text-align: center;
    margin-bottom: 5rem;
    
    h2 {
      font-size: clamp(2rem, 4vw, 3rem);
      margin-bottom: 1rem;
    }
    
    p {
      max-width: 600px;
      margin: 0 auto;
      color: var(--text-light);
      font-size: 1.1rem;
    }
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2.5rem;
  }

  .feature-card {
    background: var(--background);
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
    height: 100%;
    
    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
      
      .feature-image img {
        transform: scale(1.1);
      }
    }
    
    .feature-image {
      height: 200px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ease;
      }
    }
    
    .feature-content {
      padding: 1.5rem;
      
      h3 {
        margin-bottom: 0.8rem;
        font-size: 1.3rem;
      }
      
      p {
        color: var(--text-light);
        margin-bottom: 1rem;
      }
    }
  }

  .cta-section {
    padding: 8rem 0;
    background: var(--gradient-2);
    color: white;
    text-align: center;
    position: relative;
    overflow: hidden;
    will-change: transform;
    
    &:before, &:after {
      content: '';
      position: absolute;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      will-change: transform, opacity;
    }
    
    &:before {
      width: 400px;
      height: 400px;
      left: -200px;
      top: -200px;
    }
    
    &:after {
      width: 300px;
      height: 300px;
      right: -100px;
      bottom: -100px;
    }
    
    .container {
      position: relative;
      z-index: 1;
    }
    
    .cta-title {
      font-size: clamp(2rem, 4vw, 3.5rem);
      margin-bottom: 1.5rem;
      transform: translateZ(0);
    }
    
    .cta-description {
      max-width: 600px;
      margin: 0 auto 2.5rem;
      font-size: 1.2rem;
      opacity: 0.9;
      line-height: 1.6;
      transform: translateZ(0);
    }
    
    .cta-button-wrapper {
      display: inline-block;
    }
    
    .button {
      background: white;
      color: var(--primary);
      font-weight: 600;
      padding: 1rem 2.5rem;
      font-size: 1.1rem;
      transform: translateZ(0);
      
      &:hover {
        background: var(--accent);
        color: var(--primary-dark);
        transform: translateY(-2px) translateZ(0);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      }
    }
  }
`;

const Home = () => {
  const { t } = useTranslation();
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const sectionRefs = useRef([]);
  
  useEffect(() => {
    // Scroll animations
    sectionRefs.current.forEach((section, index) => {
      if (!section) return;
      
      const animatedElements = section.querySelectorAll('.animated-element');
      if (animatedElements && animatedElements.length > 0) {
        if (index === 2) {
          const ctaTitle = section.querySelector('.cta-title');
          if (ctaTitle) {
            gsap.fromTo(
              ctaTitle,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 75%',
                  toggleActions: 'play none none none',
                  once: true
                }
              }
            );
          }
          
          const ctaDescription = section.querySelector('.cta-description');
          if (ctaDescription) {
            gsap.fromTo(
              ctaDescription,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                delay: 0.2,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 75%',
                  toggleActions: 'play none none none',
                  once: true
                }
              }
            );
          }
          
          const ctaButton = section.querySelector('.cta-button-wrapper');
          if (ctaButton) {
            gsap.fromTo(
              ctaButton,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                delay: 0.4,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 75%',
                  toggleActions: 'play none none none',
                  once: true
                }
              }
            );
          }
        } else {
          gsap.fromTo(
            animatedElements,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              stagger: 0.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      }
    });
  }, []);
  
  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  return (
    <StyledHome>
      <SEO
        title="多大中文 | UTChinese Network"
        description="UTChinese Network (多大中文) - Premier Chinese student organization at University of Toronto bringing together culture, career and community."
        url="https://www.utchinese.org/"
      />
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg">
          <div className="hero-bg-circle"></div>
          <div className="hero-bg-circle"></div>
          <div className="hero-bg-circle"></div>
        </div>
        
        <motion.div 
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 className="hero-title" variants={itemVariants}>
            {t('home.hero.title')}
            <span className="gradient-overlay">{t('home.hero.title')}</span>
          </motion.h1>
          
          <motion.p className="hero-subtitle" variants={itemVariants}>
            {t('home.hero.subtitle')}
          </motion.p>
          
          <motion.div className="hero-cta" variants={itemVariants}>
            <Link to="/join" className="button">
              {t('home.hero.cta')}
            </Link>
            <Link to="/about" className="button secondary">
              {t('header.about')}
            </Link>
          </motion.div>
        </motion.div>
        
        <div className="scroll-indicator">
          <span>{t('home.scroll')}</span>
          <div className="mouse"></div>
        </div>
      </section>
      
      {/* About Section */}
      <section 
        className="about-section" 
        ref={el => sectionRefs.current[0] = el}
      >
        <div className="container">
          <div className="about-container">
            <div className="about-content">
              <h2 className="animated-element">{t('home.about.title')}</h2>
              <p className="animated-element">
                {t('home.about.content')}
              </p>
              <Link to="/about" className="button animated-element">
                {t('header.about')}
              </Link>
            </div>
            
            <div className="about-image animated-element">
              <ImageCarousel />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section 
        className="features-section"
        ref={el => sectionRefs.current[1] = el}
      >
        <div className="container">
          <div className="features-heading">
            <h2 className="animated-element">{t('groups.overview.title')}</h2>
            <p className="animated-element">
              {t('groups.overview.description')}
            </p>
          </div>
          
          <div className="features-grid">
            {[
              {
                id: 'arts',
                title: t('groups.arts.title'),
                description: t('groups.arts.description').substring(0, 100) + '...',
                image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
              },
              {
                id: 'career',
                title: t('groups.career.title'),
                description: t('groups.career.description').substring(0, 100) + '...',
                image: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
              },
              {
                id: 'operation',
                title: t('groups.operation.title'),
                description: t('groups.operation.description').substring(0, 100) + '...',
                image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
              },
              {
                id: 'support',
                title: t('groups.support.title'),
                description: t('groups.support.description').substring(0, 100) + '...',
                image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
              }
            ].map((feature, index) => (
              <div className="feature-card animated-element" key={index}>
                <div className="feature-image">
                  <img src={feature.image} alt={feature.title} />
                </div>
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <Link to={`/join#${feature.id}`} className="button secondary">
                    {t('header.viewMore')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        className="cta-section"
        ref={el => sectionRefs.current[2] = el}
      >
        <div className="container">
          <h2 className="animated-element cta-title">
            {t('join.title')}
          </h2>
          <p className="animated-element cta-description">
            {t('join.intro')}
          </p>
          <div className="animated-element cta-button-wrapper">
            <Link to="/join" className="button">
              {t('home.hero.cta')}
            </Link>
          </div>
        </div>
      </section>
    </StyledHome>
  );
};

export default Home; 
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from '../components/SEO';

gsap.registerPlugin(ScrollTrigger);

const StyledAbout = styled.div`
  overflow-x: hidden;
  width: 100%;
  
  .page-header {
    height: 70vh;
    background: linear-gradient(135deg, rgba(224, 43, 32, 0.05) 0%, rgba(252, 185, 0, 0.1) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    overflow: hidden;
    padding-top: 5rem;
    width: 100%;
    
    @media (max-width: 768px) {
      height: 60vh;
      padding-top: 4rem;
    }
    
    .header-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      
      &:after {
        content: '';
        position: absolute;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: var(--primary);
        opacity: 0.05;
        top: 10%;
        right: -100px;
        filter: blur(50px);
      }
      
      &:before {
        content: '';
        position: absolute;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: var(--accent);
        opacity: 0.05;
        bottom: -100px;
        left: -100px;
        filter: blur(60px);
      }
    }
    
    .header-content {
      position: relative;
      z-index: 1;
      max-width: 900px;
      padding: 0 2rem;
      width: 100%;
      
      @media (max-width: 768px) {
        padding: 0 1rem;
      }
    }
    
    h1 {
      font-size: clamp(3rem, 8vw, 5rem);
      margin-bottom: 1.5rem;
      position: relative;
      display: inline-block;
      
      &:after {
        content: '';
        position: absolute;
        bottom: -0.3rem;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 5px;
        background: var(--primary);
        border-radius: 2px;
      }
    }
    
    p {
      font-size: clamp(1.2rem, 3vw, 1.6rem);
      color: var(--text-light);
      max-width: 800px;
      margin: 0 auto;
    }
  }
  
  .story-section {
    padding: 8rem 0;
    position: relative;
    
    .container {
      max-width: 1000px;
    }
  }
  
  .story-timeline {
    position: relative;
    padding: 3rem 0;
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      height: 100%;
      background: rgba(224, 43, 32, 0.1);
      z-index: 0;
      
      @media (max-width: 768px) {
        left: calc(1rem + 9px);
        transform: none;
      }
      
      @media (max-width: 480px) {
        left: calc(0.5rem + 9px);
      }
    }
  }
  
  .timeline-item {
    display: flex;
    margin-bottom: 5rem;
    position: relative;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    &:nth-child(odd) {
      justify-content: flex-start;
      
      .timeline-content {
        margin-left: 2rem;
        
        &:before {
          left: -0.75rem;
        }
      }
    }
    
    &:nth-child(even) {
      justify-content: flex-end;
      
      .timeline-content {
        margin-right: 2rem;
        text-align: right;
        
        &:before {
          right: -0.75rem;
        }
      }
    }
    
    .timeline-dot {
      position: absolute;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--primary);
      z-index: 1;
    }
    
    .timeline-content {
      width: 45%;
      padding: 2rem;
      background: var(--background);
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      position: relative;
      
      &:before {
        content: '';
        position: absolute;
        top: 0.75rem;
        width: 20px;
        height: 20px;
        background: var(--background);
        transform: rotate(45deg);
      }
      
      h3 {
        margin-bottom: 1rem;
        color: var(--primary);
        font-size: 1.4rem;
      }
      
      p {
        margin-bottom: 0;
        color: var(--text-light);
      }
    }
    
    @media (max-width: 768px) {
      flex-direction: column;
      margin-bottom: 3rem;
      padding: 0 1rem;
      
      .timeline-dot {
        left: 1rem;
        top: 0.75rem;
      }
      

      
      &:nth-child(odd), &:nth-child(even) {
        justify-content: flex-start;
        
        .timeline-content {
          width: calc(100% - 3rem);
          margin-left: 3rem;
          margin-right: 0;
          text-align: left;
          
          &:before {
            left: -0.75rem;
            right: auto;
          }
        }
      }
    }
    
    @media (max-width: 480px) {
      padding: 0 0.5rem;
      
      .timeline-dot {
        left: 0.5rem;
      }
      
      
      
      &:nth-child(odd), &:nth-child(even) {
        .timeline-content {
          width: calc(100% - 2rem);
          margin-left: 2rem;
          padding: 1.5rem;
        }
      }
    }
  }
  
  .quote-section {
    padding: 8rem 0;
    background: var(--background-alt);
    text-align: center;
    position: relative;
    overflow: hidden;
    
    &:before, &:after {
      content: '"';
      position: absolute;
      font-family: var(--font-display), sans-serif;
      font-size: 20rem;
      opacity: 0.03;
      color: var(--primary);
    }
    
    &:before {
      top: -5rem;
      left: 2rem;
      
      @media (max-width: 768px) {
        left: 1rem;
        font-size: 10rem;
        top: -3rem;
      }
      
      @media (max-width: 480px) {
        display: none;
      }
    }
    
    &:after {
      bottom: -12rem;
      right: 2rem;
      transform: rotate(180deg);
      
      @media (max-width: 768px) {
        right: 1rem;
        font-size: 10rem;
        bottom: -8rem;
      }
      
      @media (max-width: 480px) {
        display: none;
      }
    }
    
    .container {
      position: relative;
      z-index: 1;
      max-width: 900px;
    }
    
    .quote {
      font-size: clamp(1.5rem, 3vw, 2rem);
      line-height: 1.6;
      font-weight: 500;
      color: var(--text);
      margin-bottom: 2rem;
      font-style: italic;
    }
    
    .author {
      display: inline-block;
      font-size: 1.2rem;
      color: var(--primary);
      position: relative;
      
      &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: -4rem;
        width: 3rem;
        height: 2px;
        background: var(--primary);
        opacity: 0.3;
        
        @media (max-width: 768px) {
          left: -2rem;
          width: 1.5rem;
        }
        
        @media (max-width: 480px) {
          display: none;
        }
      }
      
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        right: -4rem;
        width: 3rem;
        height: 2px;
        background: var(--primary);
        opacity: 0.3;
        
        @media (max-width: 768px) {
          right: -2rem;
          width: 1.5rem;
        }
        
        @media (max-width: 480px) {
          display: none;
        }
      }
    }
  }
  
  .values-section {
    padding: 8rem 0;
    
    .section-heading {
      text-align: center;
      margin-bottom: 4rem;
      
      h2 {
        font-size: clamp(2rem, 4vw, 3rem);
        margin-bottom: 1rem;
      }
      
      p {
        max-width: 600px;
        margin: 0 auto;
        color: var(--text-light);
      }
    }
    
    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      
      @media (max-width: 480px) {
        gap: 1rem;
      }
    }
    
    .value-card {
      padding: 2rem;
      border-radius: 10px;
      background: var(--background);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
      }
      
      .value-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(224, 43, 32, 0.1);
        border-radius: 50%;
        color: var(--primary);
        font-size: 2rem;
        
        svg {
          width: 40px;
          height: 40px;
          stroke: var(--primary);
        }
      }
      
      h3 {
        margin-bottom: 1rem;
        font-size: 1.4rem;
      }
      
      p {
        color: var(--text-light);
        margin-bottom: 0;
      }
    }
  }
`;

const AboutPage = () => {
  const { t } = useTranslation();
  const sectionRefs = useRef([]);
  
  useEffect(() => {
    // Scroll animations
    sectionRefs.current.forEach((section) => {
      if (!section) return;
      
      const animatedElements = section.querySelectorAll('.animated-element');
      if (animatedElements.length > 0) {
        gsap.fromTo(
          animatedElements,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
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
    });
    
    // Timeline animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems && timelineItems.length > 0) {
      timelineItems.forEach((item, index) => {
        if (!item) return;
        
        gsap.fromTo(
          item,
          { 
            opacity: 0,
            x: index % 2 === 0 ? -50 : 50
          },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              end: 'top 60%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    }
  }, []);
  
  const stories = [
    { title: t('about.story1'), content: t('about.story1') },
    { title: t('about.story2'), content: t('about.story2') },
    { title: t('about.story3'), content: t('about.story3') },
    { title: t('about.story4'), content: t('about.story4') },
    { title: t('about.story5'), content: t('about.story5') }
  ];
  
  return (
    <StyledAbout>
      <SEO
        title="关于我们 | UTChinese Network 多大中文"
        description="了解多大中文 (UTChinese Network) 的历史与使命，加入我们的文化、职业与社区活动。"
        url="https://www.utchinese.org/about"
      />
      {/* Header Section */}
      <section className="page-header">
        <div className="header-bg"></div>
        <div className="header-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('about.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('about.story1')}
          </motion.p>
        </div>
      </section>
      
      {/* Story Timeline Section */}
      <section 
        className="story-section"
        ref={el => sectionRefs.current[0] = el}
      >
        <div className="container">
          <div className="story-timeline">
            {stories.map((story, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3>Chapter {index + 1}</h3>
                  <p>{story.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Quote Section */}
      <section 
        className="quote-section"
        ref={el => sectionRefs.current[1] = el}
      >
        <div className="container">
          <div className="quote animated-element">
            "{t('about.quote')}"
          </div>
          <div className="author animated-element">{t('about.authorName')}</div>
        </div>
      </section>
      
      {/* Values Section */}
      <section 
        className="values-section"
        ref={el => sectionRefs.current[2] = el}
      >
        <div className="container">
          <div className="section-heading">
            <h2 className="animated-element">{t('about.values.title')}</h2>
            <p className="animated-element">{t('about.values.description')}</p>
          </div>
          
          <div className="values-grid">
            {[
              {
                title: t('about.values.cultural.title'),
                description: t('about.values.cultural.description'),
                icon: (
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.6 9H20.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.6 15H20.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.5 3C9.9116 5.55023 9 8.70362 9 12C9 15.2964 9.9116 18.4498 11.5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12.5 3C14.0884 5.55023 15 8.70362 15 12C15 15.2964 14.0884 18.4498 12.5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                title: t('about.values.commitment.title'),
                description: t('about.values.commitment.description'),
                icon: (
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C12 2 16 6 16 10C16 12.5 14.5 14 12 14C9.5 14 8 12.5 8 10C8 6 12 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 15L8 20L12 19L16 20L14 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                title: t('about.values.innovation.title'),
                description: t('about.values.innovation.description'),
                icon: (
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.663 17h4.674M12 3v1M12 20v1M3 12h1M20 12h1M18.364 5.636l-.707.707M6.343 17.657l-.707.707M18.364 18.364l-.707-.707M6.343 6.343l-.707-.707" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              }
            ].map((value, index) => (
              <div className="value-card animated-element" key={index}>
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </StyledAbout>
  );
};

export default AboutPage; 
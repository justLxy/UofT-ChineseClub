import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from '../components/SEO';

gsap.registerPlugin(ScrollTrigger);

const StyledJoin = styled.div`
  .join-header {
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: var(--gradient-2);
    color: white;
    padding: 8rem 0 6rem;
    overflow: hidden;
    
    .floating-shapes {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      
      .shape {
        position: absolute;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 20%;
        animation: float 15s infinite linear;
      }
      
      .shape:nth-child(1) {
        width: 150px;
        height: 150px;
        top: 10%;
        left: 10%;
        animation-delay: 0s;
        animation-duration: 25s;
      }
      
      .shape:nth-child(2) {
        width: 100px;
        height: 100px;
        top: 20%;
        right: 20%;
        animation-delay: -5s;
        animation-duration: 20s;
      }
      
      .shape:nth-child(3) {
        width: 200px;
        height: 200px;
        bottom: 15%;
        left: 15%;
        animation-delay: -10s;
        animation-duration: 30s;
      }
      
      .shape:nth-child(4) {
        width: 80px;
        height: 80px;
        bottom: 10%;
        right: 10%;
        animation-delay: -15s;
        animation-duration: 18s;
      }
    }
    
    @keyframes float {
      0% {
        transform: translate(0, 0) rotate(0deg);
      }
      25% {
        transform: translate(10%, 10%) rotate(90deg);
      }
      50% {
        transform: translate(5%, 20%) rotate(180deg);
      }
      75% {
        transform: translate(-10%, 10%) rotate(270deg);
      }
      100% {
        transform: translate(0, 0) rotate(360deg);
      }
    }
    
    .container {
      position: relative;
      z-index: 2;
      text-align: center;
      max-width: 1000px;
    }
    
    h1 {
      font-size: clamp(2.5rem, 8vw, 5rem);
      margin-bottom: 1.5rem;
      line-height: 1.2;
      text-wrap: balance;
      
      @media (max-width: 768px) and (min-width: 481px) {
        line-height: 1.15;
      }
      @media (max-width: 480px) {
        font-size: clamp(2rem, 10vw, 3rem);
        line-height: 1.2;
      }
    }
    
    p {
      font-size: clamp(1.1rem, 3vw, 1.5rem);
      margin-bottom: 2.5rem;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
      opacity: 0.9;
    }
    
    .button {
      background: white;
      color: var(--primary);
      font-weight: 600;
      padding: 1rem 2.5rem;
      font-size: 1.1rem;
      
      &:hover {
        background: var(--accent);
        color: var(--primary-dark);
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      }
    }
  }
  
  .groups-section {
    padding: 8rem 0;
    position: relative;
    
    .section-heading {
      text-align: center;
      margin-bottom: 5rem;
      
      h2 {
        font-size: clamp(2rem, 4vw, 3rem);
        margin-bottom: 1rem;
      }
      
      p {
        max-width: 800px;
        margin: 0 auto 2rem;
        color: var(--text-light);
        font-size: 1.1rem;
      }
    }
  }
  
  .tab-navigation {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;
    
    .tab-button {
      padding: 0.8rem 1.5rem;
      background: var(--background-alt);
      border: none;
      border-radius: var(--border-radius);
      font-size: 1rem;
      font-weight: 500;
      color: var(--text);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: var(--primary);
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.3s ease;
      }
      
      &:hover {
        background: var(--background);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        
        &:after {
          transform: scaleX(0.3);
          transform-origin: left;
        }
      }
      
      &.active {
        background: var(--background);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        
        &:after {
          transform: scaleX(1);
          transform-origin: left;
        }
      }
    }
  }
  
  .group-content {
    opacity: 0;
    height: 0;
    overflow: hidden;
    transition: opacity 0.5s ease;
    
    &.active {
      opacity: 1;
      height: auto;
      overflow: visible;
    }
  }
  
  .group-card {
    background: var(--background);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    margin-bottom: 3rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    
    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
    
    .group-image {
      height: 100%;
      min-height: 400px;
      background-size: cover;
      background-position: center;
      position: relative;
      
      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
      }
      
      @media (max-width: 992px) {
        min-height: 300px;
      }
    }
    
    .group-details {
      padding: 3rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      
      h3 {
        font-size: 1.8rem;
        margin-bottom: 1.2rem;
        color: var(--primary);
      }
      
      p {
        margin-bottom: 1.5rem;
        color: var(--text-light);
      }
      
      ul {
        list-style-type: none;
        padding: 0;
        margin-bottom: 2rem;
        
        li {
          margin-bottom: 0.8rem;
          padding-left: 1.5rem;
          position: relative;
          
          &:before {
            content: '•';
            color: var(--primary);
            position: absolute;
            left: 0;
            font-size: 1.5rem;
            line-height: 1;
          }
        }
      }
    }
  }
  
  .subgroup-card {
    background: var(--background);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    margin-bottom: 2rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }
    
    .subgroup-header {
      padding: 1.5rem;
      background: var(--primary);
      color: white;
      
      h4 {
        margin: 0;
        font-size: 1.4rem;
      }
    }
    
    .subgroup-content {
      padding: 1.5rem;
      
      p {
        color: var(--text-light);
        margin-bottom: 1.5rem;
        white-space: pre-wrap;
      }
      
      h5 {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 1.1rem;
        color: var(--primary);
      }
      
      ul {
        list-style-type: none;
        padding: 0;
        margin-bottom: 1.5rem;
        
        li {
          margin-bottom: 0.7rem;
          padding-left: 1.5rem;
          position: relative;
          
          &:before {
            content: '•';
            color: var(--primary);
            position: absolute;
            left: 0;
            font-size: 1.2rem;
            line-height: 1;
          }
        }
      }
    }
  }
  
  .join-cta {
    padding: 8rem 0;
    background: var(--background-alt);
    text-align: center;
    
    h2 {
      font-size: clamp(2rem, 4vw, 3rem);
      margin-bottom: 1.5rem;
    }
    
    p {
      max-width: 700px;
      margin: 0 auto 2.5rem;
      color: var(--text-light);
      font-size: 1.1rem;
    }
    
    .form-container {
      max-width: 800px;
      margin: 0 auto;
      background: var(--background);
      border-radius: 10px;
      padding: 2.5rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);

      .google-form-container {
        text-align: center;
        
        h3 {
          font-size: 1.6rem;
          margin-bottom: 1rem;
          color: var(--primary);
        }
        
        p {
          margin-bottom: 1.5rem;
        }
        
        .google-form-button {
          display: inline-block;
          margin-bottom: 2rem;
          padding: 1rem 2rem;
          font-weight: 600;
          transition: all 0.3s ease;
          
          &:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(224, 43, 32, 0.2);
            color: white;
          }
        }
        
        .iframe-container {
          position: relative;
          overflow: hidden;
          padding-top: 20px;
          
          iframe {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
          }
        }
      }
    }
  }
`;

const JoinPage = () => {
  const { t } = useTranslation();
  const sectionRefs = useRef([]);
  const groupsSectionRef = useRef(null);
  const [activeGroup, setActiveGroup] = useState('arts');
  const { hash } = window.location;
  
  useEffect(() => {
    // 处理URL锚点，设置活动选项卡
    if (hash) {
      const groupId = hash.replace('#', '');
      if (['arts', 'career', 'operation', 'support'].includes(groupId)) {
        setActiveGroup(groupId);
        
        // 确保在元素渲染后滚动
        const checkAndScroll = () => {
          const groupsSection = groupsSectionRef.current;
          if (groupsSection) {
            groupsSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            setTimeout(checkAndScroll, 100);
          }
        };
        checkAndScroll();
      }
    }
  }, [hash]);
  
  // 仅在组件加载时设置一次性的ScrollTrigger动画（标题和按钮）
  useEffect(() => {
    const headingElements = document.querySelectorAll('.groups-section .section-heading .animated-element, .groups-section .tab-navigation.animated-element');
    if (headingElements && headingElements.length > 0 && groupsSectionRef.current) {
      gsap.fromTo(
        headingElements,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: groupsSectionRef.current, // 使用ref作为触发器
            start: 'top 85%', // 调整触发点
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }, []); // 空依赖数组，确保只运行一次
  
  // 仅处理活动选项卡内容区域的动画
  useEffect(() => {
    const playActiveGroupAnimations = () => {
      const activeElements = document.querySelectorAll(`#${activeGroup} .group-card.animated-element, #${activeGroup} .subgroup-card.animated-element`);
      
      if (!activeElements || activeElements.length === 0) return;

      // 先重置
      gsap.set(activeElements, { y: 50, opacity: 0 });
      
      // 应用动画
      gsap.fromTo(
        activeElements,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          // 不需要ScrollTrigger，因为我们希望它在选项卡激活时立即播放
        }
      );
    };

    // 等待DOM更新和可能的CSS过渡完成
    setTimeout(playActiveGroupAnimations, 50);

  }, [activeGroup]); // 依赖activeGroup，选项卡切换时触发
  
  const groups = [
    {
      id: 'arts',
      title: t('groups.arts.title'),
      description: t('groups.arts.description'),
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      requirements: [
        t('join.arts.req1'),
        t('join.arts.req2'),
        t('join.arts.req3')
      ],
      subgroups: [
        {
          title: t('join.arts.subgroup1.title'),
          description: t('join.arts.subgroup1.description')
        },
        {
          title: t('join.arts.subgroup2.title'),
          description: t('join.arts.subgroup2.description')
        },
        {
          title: t('join.arts.subgroup3.title'),
          description: t('join.arts.subgroup3.description')
        },
        {
          title: t('join.arts.subgroup4.title'),
          description: t('join.arts.subgroup4.description')
        }
      ]
    },
    {
      id: 'career',
      title: t('groups.career.title'),
      description: t('groups.career.description'),
      image: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      requirements: [
        t('join.career.req1'),
        t('join.career.req2'),
        t('join.career.req3'),
        t('join.career.req4'),
        t('join.career.req5')
      ],
      subgroups: [
        {
          title: t('join.career.subgroup1.title'),
          description: t('join.career.subgroup1.description')
        },
        {
          title: t('join.career.subgroup2.title'),
          description: t('join.career.subgroup2.description')
        },
        {
          title: t('join.career.subgroup3.title'),
          description: t('join.career.subgroup3.description')
        }
      ]
    },
    {
      id: 'operation',
      title: t('groups.operation.title'),
      description: t('groups.operation.description'),
      image: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      requirements: [],
      subgroups: [
        {
          title: t('join.operation.subgroup1.title'),
          description: t('join.operation.subgroup1.description')
        },
        {
          title: t('join.operation.subgroup2.title'),
          description: t('join.operation.subgroup2.description')
        }
      ]
    },
    {
      id: 'support',
      title: t('groups.support.title'),
      description: t('groups.support.description'),
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      requirements: [],
      subgroups: [
        {
          title: t('join.support.subgroup1.title'),
          description: t('join.support.subgroup1.description')
        },
        {
          title: t('join.support.subgroup2.title'),
          description: t('join.support.subgroup2.description')
        },
        {
          title: t('join.support.subgroup3.title'),
          description: t('join.support.subgroup3.description')
        }
      ]
    },
    {
      id: 'engagement',
      title: t('groups.engagement.title'),
      description: t('groups.engagement.description'),
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      requirements: [
        t('join.engagement.req1'),
        t('join.engagement.req2'),
        t('join.engagement.req3'),
        t('join.engagement.req4')
      ],
      subgroups: []
    }
  ];
  
  return (
    <StyledJoin>
      <SEO
        title="加入我们 | UTChinese Network 多大中文"
        description="加入多大中文 (UTChinese Network) 社团，探索各种部门并申请成为志愿者，寻找你的舞台。"
        url="https://www.utchinese.org/join"
      />
      {/* Header Section */}
      <section className="join-header">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('join.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('join.intro')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLSd3q_33MfwIt0BLxrI4uUgeN1y397OuVtv80FSXjhus9wavfQ/viewform" 
              target="_blank"
              rel="noopener noreferrer"
              className="button"
            >
              {t('join.form.openForm')}
            </a>
          </motion.div>
        </div>
      </section>
      
      {/* Groups Section */}
      <section 
        className="groups-section"
        ref={groupsSectionRef}
      >
        <div className="container">
          <div className="section-heading">
            <h2 className="animated-element">{t('groups.overview.title')}</h2>
            <p className="animated-element">
              {t('groups.overview.description')}
            </p>
            
            {/* Architecture Diagram */}
            <div className="architecture-diagram animated-element" style={{ margin: '2rem auto', maxWidth: '900px', display: 'flex', justifyContent: 'center' }}>
              <svg width="100%" viewBox="0 0 1200 700" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '100%', height: 'auto' }}>
                <defs>
                  <filter id="shadow2" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(0,0,0,0.18)" />
                  </filter>
                  <style>{`
                    .title { font-size: 20px; font-weight: 700; fill: #333; }
                    .item  { font-size: 14px; fill: #555; }
                    .link  { stroke: #999; stroke-width: 2; }
                  `}</style>
                </defs>

                {/* President */}
                <rect x="120" y="290" width="180" height="90" rx="14" fill="#e9def2" stroke="#a78bc6" strokeWidth="2" filter="url(#shadow2)" />
                <text x="210" y="340" textAnchor="middle" className="title">President</text>

                {/* Executive Committee */}
                <rect x="390" y="200" width="220" height="270" rx="14" fill="#fff5dd" stroke="#e4b749" strokeWidth="2" filter="url(#shadow2)" />
                <text x="500" y="250" textAnchor="middle" className="title" style={{ fontSize: '18px' }}>Executive Committee</text>
                {[
                  'VP Arts & Culture',
                  'VP Career & Academic',
                  'VP Operation',
                  'VP Support',
                  'Finance Executive',
                  'Secretary'
                ].map((txt, idx) => (
                  <text key={idx} x="500" y={280 + idx * 25} textAnchor="middle" className="item">{txt}</text>
                ))}

                {/* Department Data */}
                {[
                  { y: 60,  color:'#fde5e0', stroke:'#d88d85', title:'Art & Culture',      items:['New Year Concert','Book Club','Cultural Exchange','Qin Society'] },
                  { y: 200, color:'#fde5e0', stroke:'#d88d85', title:'Career & Academic', items:['Ace Career Fair','Ace Firm Visit','Excite Conference'] },
                  { y: 320, color:'#fff6c9', stroke:'#e4b749', title:'Operation',         items:['Information Solutions','Human Resources'] },
                  { y: 430, color:'#fff6c9', stroke:'#e4b749', title:'Support',           items:['Sponsorship','Design & Art','Content Marketing'] },
                  { y: 560, color:'#def5e4', stroke:'#7fbf8d', title:'Engagement',       items:[] }
                ].map((dept, di) => (
                  <g key={dept.title}>
                    {/* compute height dynamically */}
                    <rect x="760" y={dept.y} width="260" height={60 + dept.items.length * 26} rx="14" fill={dept.color} stroke={dept.stroke} strokeWidth="2" filter="url(#shadow2)" />
                    <text x="890" y={dept.y + 35} textAnchor="middle" className="title">{dept.title}</text>
                    {dept.items.map((it, ii) => (
                      <text key={ii} x="890" y={dept.y + 60 + ii * 24} textAnchor="middle" className="item">{it}</text>
                    ))}
                  </g>
                ))}

                {/* Links */}
                {/* President -> Exec */}
                <line x1="300" y1="335" x2="390" y2="335" className="link" />
                {/* Exec -> Departments */}
                {[
                  { sy:260, ty:95 },  // Art & Culture
                  { sy:310, ty:235 }, // Career & Academic
                  { sy:360, ty:375 }, // Operation
                  { sy:410, ty:500 }, // Support
                  { sy:450, ty:590 }  // Engagement
                ].map((l, idx) => (
                  <line key={idx} x1="610" y1={l.sy} x2="760" y2={l.ty} className="link" />
                ))}
              </svg>
            </div>
          </div>
          
          <div className="tab-navigation animated-element">
            {groups.map(group => (
              <button
                key={group.id}
                className={`tab-button ${activeGroup === group.id ? 'active' : ''}`}
                onClick={() => setActiveGroup(group.id)}
              >
                {group.title}
              </button>
            ))}
          </div>
          
          {groups.map(group => (
            <div 
              key={group.id}
              id={group.id}
              className={`group-content ${activeGroup === group.id ? 'active' : ''}`}
            >
              <div className="group-card animated-element">
                <div 
                  className="group-image" 
                  style={{ backgroundImage: `url(${group.image})` }}
                ></div>
                <div className="group-details">
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                  
                  {group.requirements.length > 0 && (
                    <>
                      <h4>{t('join.welcomeMembers')}</h4>
                      <ul>
                        {group.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
              
              {group.subgroups && (
                <div className="subgroups">
                  {group.subgroups.map((subgroup, index) => (
                    <div className="subgroup-card animated-element" key={index}>
                      <div className="subgroup-header">
                        <h4>{subgroup.title}</h4>
                      </div>
                      <div className="subgroup-content">
                        <p>{subgroup.description}</p>
                        {group.id === 'operation' && index === 0 && (
                          <div>
                            <h5>{t('join.welcomeMembers')}</h5>
                            <ul>
                              <li>{t('join.operation.req7')}</li>
                              <li>{t('join.operation.req11')}</li>
                              <li>{t('join.operation.req4')}</li>
                              <li>{t('join.operation.req5')}</li>
                              <li>{t('join.operation.req6')}</li>
                            </ul>
                          </div>
                        )}
                        {group.id === 'operation' && index === 1 && (
                          <div>
                            <h5>{t('join.welcomeMembers')}</h5>
                            <ul>
                              <li>{t('join.support.req5')}</li>
                              <li>{t('join.support.req6')}</li>
                              <li>{t('join.support.req7')}</li>
                            </ul>
                          </div>
                        )}
                        {group.id === 'operation' && index === 2 && (
                          <div>
                            <h5>{t('join.welcomeMembers')}</h5>
                            <ul>
                              <li>{t('join.operation.req6')}</li>
                              <li>{t('join.operation.req7')}</li>
                              <li>{t('join.operation.req8')}</li>
                            </ul>
                          </div>
                        )}
                        {group.id === 'support' && index === 0 && (
                          <div>
                            <h5>{t('join.welcomeMembers')}</h5>
                            <ul>
                              <li>{t('join.support.req1')}</li>
                              <li>{t('join.support.req2')}</li>
                              <li>{t('join.support.req3')}</li>
                              <li>{t('join.support.req4')}</li>
                            </ul>
                          </div>
                        )}
                        {group.id === 'support' && index === 1 && (
                          <div>
                            <h5>{t('join.welcomeMembers')}</h5>
                            <ul>
                              <li>{t('join.operation.req8')}</li>
                              <li>{t('join.operation.req9')}</li>
                              <li>{t('join.operation.req10')}</li>
                            </ul>
                          </div>
                        )}
                        {group.id === 'support' && index === 2 && (
                          <div>
                            <h5>{t('join.welcomeMembers')}</h5>
                            <ul>
                              <li>{t('join.operation.req1')}</li>
                              <li>{t('join.operation.req2')}</li>
                              <li>{t('join.operation.req3')}</li>
                            </ul>
                          </div>
                        )}
                        <a 
                          href="https://docs.google.com/forms/d/e/1FAIpQLSd3q_33MfwIt0BLxrI4uUgeN1y397OuVtv80FSXjhus9wavfQ/viewform" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="button secondary"
                        >
                          {t('join.form.openForm')}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      
      {/* Join CTA Section */}
      <section 
        id="join-form"
        className="join-cta"
      >
        <div className="container">
          <h2 className="animated-element">Join Our Team</h2>
          
          <div className="form-container animated-element">
            <div className="google-form-container">
              <h3>{t('join.form.title')}</h3>
              <p>{t('join.form.description')}</p>
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSd3q_33MfwIt0BLxrI4uUgeN1y397OuVtv80FSXjhus9wavfQ/viewform" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="button google-form-button"
              >
                {t('join.form.openForm')}
              </a>
              <div className="iframe-container">
                <iframe 
                  src="https://docs.google.com/forms/d/e/1FAIpQLSd3q_33MfwIt0BLxrI4uUgeN1y397OuVtv80FSXjhus9wavfQ/viewform?embedded=true" 
                  width="100%" 
                  height="600" 
                  frameBorder="0" 
                  marginHeight="0" 
                  marginWidth="0"
                  title="UTChinese Application Form"
                >
                  Loading…
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </StyledJoin>
  );
};

export default JoinPage; 
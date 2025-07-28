import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiMail, FiLinkedin, FiGithub, FiPhone } from 'react-icons/fi';
import { FaWeixin } from 'react-icons/fa';
import { getTeamMembers, getTeamDepartments, getFullAvatarUrl } from '../utils/api';
import StaffDetailModal from '../components/StaffDetailModal';
import LoadingAnimation from '../components/LoadingAnimation';
import i18n from 'i18next';
import SEO from '../components/SEO';

gsap.registerPlugin(ScrollTrigger);

// Skeleton Components for Team Page
const SkeletonBox = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  border-radius: ${props => props.borderRadius || '4px'};
  width: ${props => props.width || '100px'};
  height: ${props => props.height || '20px'};
  
  [data-theme="dark"] & {
    background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
    background-size: 400% 100%;
  }
  
  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
`;

const SkeletonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${props => props.gap || '0px'};
  flex-direction: ${props => props.direction || 'row'};
  
  @media (max-width: 768px) {
    justify-content: center;
    padding: 0 8px;
  }
`;

const SkeletonMemberCard = styled.div`
  background: var(--background);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(224, 43, 32, 0.1);
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 12px;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(135deg, var(--primary), var(--accent));
  }
`;

const StyledTeam = styled.div`
  overflow-x: hidden;
  width: 100%;
  
  .page-header {
    height: 80vh;
    background: linear-gradient(135deg, rgba(224, 43, 32, 0.05) 0%, rgba(252, 185, 0, 0.1) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    overflow: hidden;
    padding-top: 6rem;
    width: 100%;
    
    @media (max-width: 768px) {
      height: auto;
      min-height: 60vh;
      padding: 10rem 0 3rem;
    }
    
    @media (max-width: 480px) {
      height: auto;
      min-height: 50vh;
      padding: 9rem 0 2rem;
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
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: var(--primary);
        opacity: 0.08;
        top: 15%;
        right: -150px;
        filter: blur(80px);
        animation: float 8s ease-in-out infinite;
      }
      
      &:before {
        content: '';
        position: absolute;
        width: 500px;
        height: 500px;
        border-radius: 50%;
        background: var(--accent);
        opacity: 0.06;
        bottom: -200px;
        left: -200px;
        filter: blur(100px);
        animation: float 10s ease-in-out infinite reverse;
      }
    }
    
    .header-content {
      position: relative;
      z-index: 1;
      max-width: 1000px;
      padding: 0 2rem;
      width: 100%;
      
      @media (max-width: 768px) {
        padding: 0 1rem;
      }
      
      @media (max-width: 480px) {
        padding: 0 0.5rem;
      }
    }
    
    h1 {
      font-size: clamp(3.5rem, 8vw, 6rem);
      margin-bottom: 2rem;
      position: relative;
      display: inline-block;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      
      @media (max-width: 768px) {
        font-size: clamp(2.5rem, 8vw, 3.5rem);
        margin-bottom: 1.5rem;
        line-height: 1.1;
      }
      
      @media (max-width: 480px) {
        font-size: clamp(2rem, 10vw, 2.8rem);
        margin-bottom: 1rem;
      }
      
      &:after {
        content: '';
        position: absolute;
        bottom: -0.5rem;
        left: 50%;
        transform: translateX(-50%);
        width: 120px;
        height: 6px;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        border-radius: 3px;
        
        @media (max-width: 768px) {
          width: 80px;
          height: 4px;
          bottom: -0.25rem;
        }
        
        @media (max-width: 480px) {
          width: 60px;
          height: 3px;
          bottom: -0.25rem;
        }
      }
    }
    
    p {
      font-size: clamp(1.3rem, 3vw, 1.8rem);
      color: var(--text-light);
      max-width: 800px;
      margin: 0 auto 3rem;
      line-height: 1.5;
      
      @media (max-width: 768px) {
        font-size: clamp(1.1rem, 3vw, 1.4rem);
        margin: 0 auto 2rem;
        padding: 0 1rem;
      }
      
      @media (max-width: 480px) {
        font-size: clamp(1rem, 4vw, 1.2rem);
        margin: 0 auto 1.5rem;
        padding: 0 0.5rem;
        line-height: 1.4;
      }
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 2rem;
      max-width: 600px;
      margin: 0 auto;
      width: 100%;
      
      @media (max-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        max-width: 100%;
        padding: 0 1rem;
      }
      
      @media (max-width: 480px) {
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
        max-width: 100%;
        padding: 0 0.5rem;
      }
      
      .stat-item {
        padding: 1.5rem;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        text-align: center;
        transition: all 0.3s ease;
        
        @media (max-width: 768px) {
          padding: 1.2rem 0.8rem;
          border-radius: 12px;
        }
        
        @media (max-width: 480px) {
          padding: 1rem 0.5rem;
          border-radius: 10px;
          min-height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(224, 43, 32, 0.15);
        }
        
        .stat-number {
          font-size: 2.5rem;
          font-weight: bold;
          color: var(--primary);
          margin-bottom: 0.5rem;
          line-height: 1;
          
          @media (max-width: 768px) {
            font-size: 2rem;
            margin-bottom: 0.25rem;
          }
          
          @media (max-width: 480px) {
            font-size: 1.8rem;
            margin-bottom: 0.25rem;
          }
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          
          @media (max-width: 768px) {
            font-size: 0.8rem;
            letter-spacing: 0.5px;
          }
          
          @media (max-width: 480px) {
            font-size: 0.7rem;
            letter-spacing: 0.5px;
            line-height: 1.2;
          }
        }
      }
    }
  }
  
  .filter-section {
    padding: 4rem 0 2rem;
    text-align: center;
    
    .filter-controls {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      align-items: center;
      padding: 0 1rem;
      
      @media (max-width: 768px) {
        gap: 0.75rem;
        padding: 0 0.5rem;
      }
      
      @media (max-width: 480px) {
        gap: 0.5rem;
        padding: 0 0.25rem;
      }
      
      .filter-button {
        padding: 0.8rem 1.5rem;
        border: 2px solid transparent;
        background: rgba(224, 43, 32, 0.1);
        color: var(--text);
        border-radius: 25px;
        cursor: pointer;
        transition: box-shadow 0.3s ease, border-color 0.3s ease;
        font-weight: 500;
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        
        @media (max-width: 768px) {
          padding: 0.6rem 1rem;
          font-size: 0.9rem;
        }
        
        @media (max-width: 480px) {
          padding: 0.5rem 0.75rem;
          font-size: 0.8rem;
          border-radius: 20px;
        }
        
        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease;
        }
        
        &:hover {
          box-shadow: 0 10px 25px rgba(224, 43, 32, 0.2);
          
          &:before {
            left: 100%;
          }
        }
        
        &.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        
        .count {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.2rem 0.5rem;
          border-radius: 10px;
          margin-left: 0.5rem;
          font-size: 0.8rem;
        }
      }
    }
  }
  
  .team-grid {
    padding: 2rem 0 8rem;
    
    .container {
      max-width: 1400px;
      padding: 0 2rem;
      
      @media (max-width: 768px) {
        padding: 0 1rem;
      }
      
      @media (max-width: 480px) {
        padding: 0 0.5rem;
      }
    }
    
    .department-section {
      margin-bottom: 6rem;
      
      .department-header {
        text-align: center;
        margin-bottom: 4rem;
        
        h2 {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          margin-bottom: 1rem;
          position: relative;
          display: inline-block;
          word-break: break-word;
          white-space: normal;
          
          &:after {
            content: '';
            position: absolute;
            bottom: -0.5rem;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background: var(--primary);
            border-radius: 2px;
          }
        }
        
        p {
          color: var(--text-light);
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
        }
      }
      
      .members-grid {
        display: grid;
        gap: 2rem;
        justify-content: center;
        max-width: 1200px;
        margin: 0 auto;
        
        /* Default layout */
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        
        /* Special layouts for small member counts */
        &.single-member {
          grid-template-columns: minmax(300px, 400px);
          justify-content: center;
        }
        
        &.two-members {
          grid-template-columns: repeat(2, minmax(300px, 400px));
          justify-content: center;
        }
        
        &.three-members {
          grid-template-columns: repeat(3, minmax(300px, 350px));
          justify-content: center;
        }
        
        @media (max-width: 768px) {
          grid-template-columns: 1fr;
          gap: 1.5rem;
          max-width: 100%;
          padding: 0 1rem;

          /* Override special layouts to enforce single column */
          &.single-member,
          &.two-members,
          &.three-members {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 480px) {
          gap: 1rem;
          padding: 0 0.5rem;

          /* Override special layouts on extra-small screens */
          &.single-member,
          &.two-members,
          &.three-members {
            grid-template-columns: 1fr;
          }
        }
      }
    }
  }
  
  .member-card {
    background: var(--background);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(224, 43, 32, 0.1);
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.2s ease;
    cursor: pointer;
    width: 100%;
    max-width: 100%;
    will-change: transform;
    
    @media (max-width: 768px) {
      padding: 1.5rem;
      border-radius: 15px;
    }
    
    @media (max-width: 480px) {
      padding: 1rem;
      border-radius: 12px;
    }
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 5px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
    }
    
    &:hover {
      box-shadow: 0 20px 40px rgba(224, 43, 32, 0.15);
      
      .member-avatar {
        transform: scale(1.05);
      }
    }
    }
    
    &:active {
      transform: translateY(-5px);
      transition: transform 0.1s ease;
    }
    
    .member-content {
      position: relative;
      z-index: 1;
    }
    
    .member-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin: 0 auto 1.5rem;
      overflow: hidden;
      border: 4px solid rgba(224, 43, 32, 0.1);
      transition: transform 0.2s ease;
      will-change: transform;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.2s ease;
      }
    }
    
    .member-info {
      text-align: center;
      transition: transform 0.2s ease;
      
      .member-name {
        font-size: 1.4rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
        color: var(--text);
        
        .name-zh {
          font-size: 1rem;
          color: var(--text-light);
          font-weight: normal;
          margin-left: 0.5rem;
        }

        .name-en {
          font-size: 1rem;
          color: var(--text-light);
          font-weight: normal;
          margin-left: 0.5rem;
        }
      }
      
      .member-position {
        color: var(--primary);
        font-weight: 600;
        margin-bottom: 1rem;
        font-size: 1.1rem;
      }
      
      .member-department {
        background: rgba(224, 43, 32, 0.1);
        color: var(--primary);
        padding: 0.4rem 1rem;
        border-radius: 15px;
        font-size: 0.9rem;
        font-weight: 500;
        margin-bottom: 1rem;
      }
      
      .member-bio {
        color: var(--text-light);
        font-size: 0.95rem;
        line-height: 1.6;
        margin-bottom: 1.5rem;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .member-links {
        display: flex;
        justify-content: center;
        gap: 1rem;
        
        a, span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(224, 43, 32, 0.1);
          color: var(--primary);
          transition: all 0.3s ease;
          cursor: pointer;
          
          &:hover {
            background: var(--primary);
            color: white;
            transform: translateY(-2px);
          }
        }
      }
    }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
  
  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    
    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(224, 43, 32, 0.1);
      border-top: 3px solid var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Team = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { member: memberParam } = useParams();
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  // Helper: translate department name based on current language
  const getDepartmentLabel = (deptName) => {
    if (i18n.language === 'zh') {
      switch (deptName) {
        case 'ARTS & CULTURE GROUP':
          return i18n.t('groups.arts.title');
        case 'CAREER & ACADEMIC GROUP':
          return i18n.t('groups.career.title');
        case 'OPERATION GROUP':
          return i18n.t('groups.operation.title');
        case 'SUPPORT GROUP':
          return i18n.t('groups.support.title');
        case 'ENGAGEMENT':
          return i18n.t('groups.engagement.title');
        default:
          return deptName;
      }
    }
    return deptName;
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  useEffect(() => {
    if (!loading && teamMembers.length > 0) {
      initializeAnimations();
    }
  }, [loading, teamMembers]);

  // Handle route param / query for staff detail modal (username based)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const staffQuery = urlParams.get('member');
    const usernameKey = memberParam || staffQuery;
    
    if (usernameKey && teamMembers.length > 0) {
      const staff = teamMembers.find(member => member.username === usernameKey);
      if (staff) {
        setSelectedStaff(staff);
      }
    } else if (!usernameKey && selectedStaff) {
      setSelectedStaff(null);
    }
  }, [location.search, memberParam, teamMembers]);

  // Update selected staff when teamMembers change (for language switching)
  useEffect(() => {
    if (selectedStaff && teamMembers.length > 0) {
      const updatedStaff = teamMembers.find(member => member.id === selectedStaff.id);
      if (updatedStaff) {
        setSelectedStaff(updatedStaff);
      }
    }
  }, [teamMembers, selectedStaff?.id]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const [members, departments] = await Promise.all([
        getTeamMembers(),
        getTeamDepartments()
      ]);
      
      setTeamMembers(members);
      setDepartments(departments);
    } catch (err) {
      console.error('Error fetching team data:', err);
      setError('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const initializeAnimations = () => {
    // Header animation
    if (headerRef.current) {
      gsap.fromTo(headerRef.current.children,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.2,
          ease: "power2.out"
        }
      );
    }

    // Cards animation
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(card,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });
  };

  const filteredMembers = selectedDepartment === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.department === selectedDepartment);

  const groupedMembers = filteredMembers.reduce((acc, member) => {
    if (!acc[member.department]) {
      acc[member.department] = [];
    }
    acc[member.department].push(member);
    return acc;
  }, {});

  const totalMembers = teamMembers.length;
  const totalDepartments = departments.length;

  // Handle route param / query for staff detail modal (username based)
  const handleStaffClick = (staffUsername) => {
    const staff = teamMembers.find(member => member.username === staffUsername);
    if (staff) {
      // Set selected staff immediately for faster UI response
      setSelectedStaff(staff);
      
      // Update URL asynchronously using path param and lang query
      setTimeout(() => {
        const langParam = i18n.language;
        navigate(`/team/${staffUsername}?lang=${langParam}`, { replace: true });
      }, 0);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedStaff(null);
    // Remove member parameter from URL
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.delete('member');
    const newUrl = newSearchParams.toString() 
      ? `${location.pathname}?${newSearchParams.toString()}`
      : location.pathname;
    navigate(newUrl, { replace: true });
  };

  // Get appropriate grid class name based on member count
  const getGridClassName = (memberCount) => {
    let className = 'members-grid';
    if (memberCount === 1) {
      className += ' single-member';
    } else if (memberCount === 2) {
      className += ' two-members';
    } else if (memberCount === 3) {
      className += ' three-members';
    }
    return className;
  };

  const handleImageError = (memberId) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [memberId]: true
    }));
  };

  // Reset image load errors when staff data changes
  useEffect(() => {
    setImageLoadErrors({});
  }, [teamMembers]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledTeam>
          <SEO
            title="团队 | UTChinese Network 多大中文"
            description="认识多大中文 (UTChinese Network) 的管理层与志愿者团队成员。"
            url="https://www.utchinese.org/team"
          />
          
          {/* Page Header Skeleton */}
          <section className="page-header">
            <div className="header-bg"></div>
            <div className="header-content">
              {/* Title Skeleton */}
              <SkeletonContainer direction="column" gap="2rem">
                <SkeletonBox 
                  width="min(600px, 80%)" 
                  height="clamp(3.5rem, 8vw, 6rem)" 
                  borderRadius="8px" 
                />
                
                {/* Description Skeleton */}
                <SkeletonBox 
                  width="min(800px, 90%)" 
                  height="clamp(1.3rem, 3vw, 1.8rem)" 
                  borderRadius="4px" 
                  delay="0.1s"
                />
                
                {/* Stats Grid Skeleton */}
                <div className="stats-grid" style={{ marginTop: '2rem' }}>
                  {[...Array(3)].map((_, index) => (
                    <div key={index} style={{ 
                      textAlign: 'center',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <SkeletonBox 
                        width="60px" 
                        height="2.5rem" 
                        borderRadius="4px" 
                        delay={`${0.2 + index * 0.1}s`}
                        style={{ margin: '0 auto 0.5rem' }}
                      />
                      <SkeletonBox 
                        width="80px" 
                        height="0.9rem" 
                        borderRadius="4px" 
                        delay={`${0.3 + index * 0.1}s`}
                        style={{ margin: '0 auto' }}
                      />
                    </div>
                  ))}
                </div>
              </SkeletonContainer>
            </div>
          </section>

          {/* Filter Section Skeleton */}
          <section className="filter-section">
            <div className="container">
              <div className="filter-controls">
                {[
                  { label: '全部', width: '100px' },
                  { label: '文化艺术部门', width: '160px' },
                  { label: '职业学术部门', width: '160px' },
                  { label: '运营部门', width: '140px' },
                  { label: '支持部门', width: '140px' }
                ].map((filter, index) => (
                  <SkeletonBox
                    key={index}
                    width={filter.width}
                    height="45px"
                    borderRadius="25px"
                    delay={`${0.6 + index * 0.05}s`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Team Grid Skeleton */}
          <section className="team-grid">
            <div className="container">
              {/* Generate 4 department sections with varying member counts */}
              {[
                { memberCount: 6, deptName: '文化艺术部门' },
                { memberCount: 4, deptName: '职业学术部门' },
                { memberCount: 5, deptName: '运营部门' },
                { memberCount: 3, deptName: '支持部门' }
              ].map(({ memberCount, deptName }, deptIndex) => (
                <div key={deptIndex} className="department-section">
                  {/* Department Header Skeleton */}
                  <div className="department-header">
                    <SkeletonBox 
                      width={`${180 + deptName.length * 8}px`} 
                      height="clamp(2.5rem, 5vw, 3.5rem)" 
                      borderRadius="8px" 
                      delay={`${1.0 + deptIndex * 0.2}s`}
                      style={{ margin: '0 auto 1rem' }}
                    />
                    <SkeletonBox 
                      width={`${80 + memberCount * 8}px`} 
                      height="1.2rem" 
                      borderRadius="4px" 
                      delay={`${1.1 + deptIndex * 0.2}s`}
                      style={{ margin: '0 auto' }}
                    />
                  </div>

                  {/* Members Grid Skeleton */}
                  <div className={`members-grid ${memberCount <= 3 ? `${memberCount === 1 ? 'single-member' : memberCount === 2 ? 'two-members' : 'three-members'}` : ''}`}>
                    {[...Array(memberCount)].map((_, memberIndex) => {
                      // Generate consistent but varied widths for each member
                      const baseIndex = deptIndex * 10 + memberIndex;
                      const nameWidth = 120 + (baseIndex * 7) % 80;
                      const positionWidth = 100 + (baseIndex * 11) % 60;
                      const deptWidth = 90 + (baseIndex * 13) % 50;
                      const linkCount = 2 + (baseIndex % 4);
                      
                      return (
                        <SkeletonMemberCard key={memberIndex}>
                          <div className="member-content">
                            {/* Avatar Skeleton */}
                            <SkeletonContainer style={{ marginBottom: '1.5rem' }}>
                              <SkeletonBox 
                                width="100px" 
                                height="100px" 
                                borderRadius="50%" 
                                delay={`${1.3 + deptIndex * 0.2 + memberIndex * 0.05}s`}
                              />
                            </SkeletonContainer>

                            {/* Member Info Skeleton */}
                            <div className="member-info" style={{ textAlign: 'center' }}>
                              {/* Name Skeleton */}
                              <SkeletonContainer style={{ marginBottom: '0.5rem' }}>
                                <SkeletonBox 
                                  width={`${nameWidth}px`} 
                                  height="1.4rem" 
                                  borderRadius="4px" 
                                  delay={`${1.4 + deptIndex * 0.2 + memberIndex * 0.05}s`}
                                />
                              </SkeletonContainer>

                              {/* Position Skeleton */}
                              <SkeletonContainer style={{ marginBottom: '1rem' }}>
                                <SkeletonBox 
                                  width={`${positionWidth}px`} 
                                  height="1.1rem" 
                                  borderRadius="4px" 
                                  delay={`${1.5 + deptIndex * 0.2 + memberIndex * 0.05}s`}
                                />
                              </SkeletonContainer>

                              {/* Department Badge Skeleton */}
                              <SkeletonContainer style={{ marginBottom: '1rem' }}>
                                <SkeletonBox 
                                  width={`${deptWidth}px`} 
                                  height="28px" 
                                  borderRadius="15px" 
                                  delay={`${1.6 + deptIndex * 0.2 + memberIndex * 0.05}s`}
                                />
                              </SkeletonContainer>

                              {/* Bio Skeleton - Show for some members only */}
                              {baseIndex % 3 !== 0 && (
                                <SkeletonContainer direction="column" gap="0.3rem" style={{ marginBottom: '1.5rem' }}>
                                  <SkeletonBox 
                                    width="100%" 
                                    height="0.95rem" 
                                    borderRadius="4px" 
                                    delay={`${1.7 + deptIndex * 0.2 + memberIndex * 0.05}s`}
                                  />
                                  <SkeletonBox 
                                    width="85%" 
                                    height="0.95rem" 
                                    borderRadius="4px" 
                                    delay={`${1.75 + deptIndex * 0.2 + memberIndex * 0.05}s`}
                                    style={{ margin: '0 auto' }}
                                  />
                                  <SkeletonBox 
                                    width="70%" 
                                    height="0.95rem" 
                                    borderRadius="4px" 
                                    delay={`${1.8 + deptIndex * 0.2 + memberIndex * 0.05}s`}
                                    style={{ margin: '0 auto' }}
                                  />
                                </SkeletonContainer>
                              )}

                              {/* Social Links Skeleton */}
                              <SkeletonContainer gap="1rem">
                                {[...Array(linkCount)].map((_, linkIndex) => (
                                  <SkeletonBox
                                    key={linkIndex}
                                    width="40px"
                                    height="40px"
                                    borderRadius="50%"
                                    delay={`${1.9 + deptIndex * 0.2 + memberIndex * 0.05 + linkIndex * 0.02}s`}
                                  />
                                ))}
                              </SkeletonContainer>
                            </div>
                          </div>
                        </SkeletonMemberCard>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </StyledTeam>
      </motion.div>
    );
  }

  if (error) {
    return (
      <StyledTeam>
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <h2>Error Loading Team Data</h2>
          <p>{error}</p>
          <button onClick={fetchTeamData}>Retry</button>
        </div>
      </StyledTeam>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledTeam>
        <SEO
          title="团队 | UTChinese Network 多大中文"
          description="认识多大中文 (UTChinese Network) 的管理层与志愿者团队成员。"
          url="https://www.utchinese.org/team"
        />
        {/* Page Header */}
        <section className="page-header">
          <div className="header-bg"></div>
          <div className="header-content" ref={headerRef}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {i18n.language === 'zh' ? '我们的团队' : 'Our Team'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {i18n.language === 'zh' 
                ? '认识多大中文社团背后的优秀团队成员' 
                : 'Meet the amazing team members behind UTChinese Network'}
            </motion.p>
            <motion.div 
              className="stats-grid"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="stat-item">
                <div className="stat-number">{totalMembers}</div>
                <div className="stat-label">
                  {i18n.language === 'zh' ? '团队成员' : 'Members'}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{totalDepartments}</div>
                <div className="stat-label">
                  {i18n.language === 'zh' ? '部门' : 'Departments'}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-number">14</div>
                <div className="stat-label">
                  {i18n.language === 'zh' ? '年' : 'Years'}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="filter-section">
          <div className="container">
            <div className="filter-controls">
              <motion.button
                className={`filter-button ${selectedDepartment === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedDepartment('all')}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.15, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.95 }}
              >
                {i18n.language === 'zh' ? '全部' : 'All'}
                <span className="count">{totalMembers}</span>
              </motion.button>
              
              {departments.map((dept) => (
                <motion.button
                  key={dept.name}
                  className={`filter-button ${selectedDepartment === dept.name ? 'active' : ''}`}
                  onClick={() => setSelectedDepartment(dept.name)}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.15, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {getDepartmentLabel(dept.name)}
                  <span className="count">{dept.count}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="team-grid">
          <div className="container">
            <AnimatePresence mode="wait">
              {selectedDepartment === 'all' ? (
                // Show all departments
                Object.entries(groupedMembers).map(([departmentName, members]) => (
                  <motion.div
                    key={departmentName}
                    className="department-section"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="department-header">
                      <h2>{getDepartmentLabel(departmentName)}</h2>
                      <p>
                        {members.length} {i18n.language === 'zh' ? '位成员' : 'members'}
                      </p>
                    </div>
                    <div className={getGridClassName(members.length)}>
                      {members.map((member, index) => (
                        <motion.div
                          key={member.id}
                          className="member-card"
                          ref={el => cardsRef.current[index] = el}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            duration: 0.5, 
                            delay: index * 0.1,
                            ease: "easeOut" 
                          }}
                          whileHover={{ 
                            y: -8,
                            transition: { duration: 0.2, ease: "easeOut" }
                          }}
                          onClick={() => handleStaffClick(member.username)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="member-content">
                            <div className="member-avatar">
                              {getFullAvatarUrl(member.avatarUrl) && !imageLoadErrors[member.id] ? (
                                <img 
                                  src={getFullAvatarUrl(member.avatarUrl)} 
                                  alt={(i18n.language === 'zh' ? member.name_zh : member.name_en) || t('staff.profile.permissions.noName')}
                                  loading="lazy"
                                  onError={() => handleImageError(member.id)}
                                />
                              ) : (
                                <div style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  borderRadius: '50%', 
                                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '2.5rem'
                                }}>
                                  {((i18n.language === 'zh' ? member.name_zh : member.name_en) || t('staff.profile.permissions.noName'))?.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="member-info">
                              <h3 className="member-name">
                                {(i18n.language === 'zh' ? member.name_zh : member.name_en) || t('staff.profile.permissions.noName')}
                                {i18n.language === 'en' && (
                                  <span className="name-zh">{member.name_zh || t('staff.profile.permissions.noAltName')}</span>
                                )}
                                {i18n.language === 'zh' && (
                                  <span className="name-en">{member.name_en || t('staff.profile.permissions.noAltName')}</span>
                                )}
                              </h3>
                              <div className="member-position">
                                {i18n.language === 'zh' ? member.position_zh : member.position_en}
                              </div>
                              <div className="member-department">
                                {getDepartmentLabel(member.department)}
                              </div>
                              {(member.bio_en || member.bio_zh) && (
                                <p className="member-bio">
                                  {(() => {
                                    const bioText = i18n.language === 'zh' ? member.bio_zh : member.bio_en;
                                    return bioText && bioText.length > 120 
                                      ? bioText.substring(0, 120) + '...' 
                                      : bioText;
                                  })()}
                                </p>
                              )}
                              <div className="member-links">
                                {member.email && (
                                  <a 
                                    href={`mailto:${member.email}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Email"
                                  >
                                    <FiMail />
                                  </a>
                                )}
                                {member.linkedin && (
                                  <a 
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="LinkedIn"
                                  >
                                    <FiLinkedin />
                                  </a>
                                )}
                                {member.github && (
                                  <a 
                                    href={member.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="GitHub"
                                  >
                                    <FiGithub />
                                  </a>
                                )}
                                {member.phone && (
                                  <a 
                                    href={`tel:${member.phone}`}
                                    title="Phone"
                                  >
                                    <FiPhone />
                                  </a>
                                )}
                                {member.wechat && (
                                  <span title={`WeChat: ${member.wechat}`}>
                                    <FaWeixin />
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))
              ) : (
                // Show filtered department
                <motion.div
                  key={selectedDepartment}
                  className="department-section"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="department-header">
                    <h2>{getDepartmentLabel(selectedDepartment)}</h2>
                    <p>
                      {filteredMembers.length} {i18n.language === 'zh' ? '位成员' : 'members'}
                    </p>
                  </div>
                  <div className={getGridClassName(filteredMembers.length)}>
                    {filteredMembers.map((member, index) => (
                      <motion.div
                        key={member.id}
                        className="member-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                           duration: 0.5, 
                           delay: index * 0.1,
                           ease: "easeOut" 
                         }}
                        whileHover={{ 
                          y: -8,
                          transition: { duration: 0.2, ease: "easeOut" }
                        }}
                        onClick={() => handleStaffClick(member.username)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="member-content">
                          <div className="member-avatar">
                            {getFullAvatarUrl(member.avatarUrl) && !imageLoadErrors[member.id] ? (
                              <img 
                                src={getFullAvatarUrl(member.avatarUrl)} 
                                alt={(i18n.language === 'zh' ? member.name_zh : member.name_en) || t('staff.profile.permissions.noName')}
                                loading="lazy"
                                onError={() => handleImageError(member.id)}
                              />
                            ) : (
                              <div style={{ 
                                width: '100%', 
                                height: '100%', 
                                borderRadius: '50%', 
                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '2.5rem'
                              }}>
                                {((i18n.language === 'zh' ? member.name_zh : member.name_en) || t('staff.profile.permissions.noName'))?.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="member-info">
                            <h3 className="member-name">
                              {(i18n.language === 'zh' ? member.name_zh : member.name_en) || t('staff.profile.permissions.noName')}
                              {i18n.language === 'en' && (
                                <span className="name-zh">{member.name_zh || t('staff.profile.permissions.noAltName')}</span>
                              )}
                              {i18n.language === 'zh' && (
                                <span className="name-en">{member.name_en || t('staff.profile.permissions.noAltName')}</span>
                              )}
                            </h3>
                            <div className="member-position">
                              {i18n.language === 'zh' ? member.position_zh : member.position_en}
                            </div>
                            <div className="member-department">
                              {getDepartmentLabel(member.department)}
                            </div>
                            {(member.bio_en || member.bio_zh) && (
                              <p className="member-bio">
                                {(() => {
                                  const bioText = i18n.language === 'zh' ? member.bio_zh : member.bio_en;
                                  return bioText && bioText.length > 120 
                                    ? bioText.substring(0, 120) + '...' 
                                    : bioText;
                                })()}
                              </p>
                            )}
                            <div className="member-links">
                              {member.email && (
                                <a 
                                  href={`mailto:${member.email}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Email"
                                >
                                  <FiMail />
                                </a>
                              )}
                              {member.linkedin && (
                                <a 
                                  href={member.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="LinkedIn"
                                >
                                  <FiLinkedin />
                                </a>
                              )}
                              {member.github && (
                                <a 
                                  href={member.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="GitHub"
                                >
                                  <FiGithub />
                                </a>
                              )}
                              {member.phone && (
                                <a 
                                  href={`tel:${member.phone}`}
                                  title="Phone"
                                >
                                  <FiPhone />
                                </a>
                              )}
                              {member.wechat && (
                                <span title={`WeChat: ${member.wechat}`}>
                                  <FaWeixin />
                                </span>
                              )}
                            </div>
                          </div>
                        </div> {/* close member-content */}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </StyledTeam>

      {selectedStaff && (
        <StaffDetailModal
          staff={selectedStaff}
          onClose={handleCloseModal}
        />
      )}
    </motion.div>
  );
};

export default Team; 
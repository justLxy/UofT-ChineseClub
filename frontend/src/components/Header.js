import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { FiUser, FiLogIn, FiLogOut, FiSettings, FiUsers, FiChevronDown, FiLock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import UnifiedLoginModal from './UnifiedLoginModal';
import ThemeSwitch from './ThemeSwitch';
import LanguageSelector from './LanguageSelector';

const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding: 1.2rem 0;
  backdrop-filter: blur(10px);
  transition: background-color 0.3s ease, padding 0.3s ease;
  
  &.scrolled {
    background-color: rgba(255, 255, 255, 0.85);
    padding: 0.8rem 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  [data-theme="dark"] &.scrolled {
    background-color: rgba(12, 12, 12, 0.85);
  }
  
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    gap: 1rem;
    
    @media (max-width: 1024px) {
      gap: 0.5rem;
    }
    
    @media (max-width: 768px) {
      gap: 0.75rem;
      padding: 0 1rem;
    }
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 101;
    flex-shrink: 0;
    
    img {
      height: 2.5rem;
      transition: height 0.3s ease;
      
      @media (max-width: 768px) {
        height: 2rem;
      }
    }
    
    h1 {
      font-size: 1.3rem;
      margin: 0;
      white-space: nowrap;
      font-weight: 600;
      
      @media (max-width: 768px) {
        font-size: 1.1rem;
      }
    }
  }

  nav {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex: 1;
    justify-content: flex-end;
    
    @media (max-width: 1024px) {
      gap: 0.8rem;
    }
    
    @media (max-width: 768px) {
      flex: 0;
      justify-content: flex-end;
    }
  }

  .header-controls-wrapper {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    padding: 0.1rem;
    transform: translateY(-1px);
    
    [data-theme="dark"] & {
      background: rgba(255, 255, 255, 0.03);
      border-color: rgba(255, 255, 255, 0.08);
    }
    
    @media (max-width: 768px) {
      display: none;
    }
  }

  .nav-links {
    display: flex;
    gap: 1.2rem;
    
    @media (max-width: 1024px) {
      gap: 0.8rem;
    }
    
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  .nav-link {
    color: var(--text);
    font-weight: 500;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      display: block;
      margin-top: 2px;
      right: 0;
      background: var(--primary);
      transition: width 0.3s ease;
    }
    
    &:hover:after, &.active:after {
      width: 100%;
      left: 0;
      right: auto;
    }
  }

  .mobile-menu-btn {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    cursor: pointer;
    z-index: 101;
    
    span {
      display: block;
      width: 30px;
      height: 2px;
      margin-bottom: 5px;
      position: relative;
      background: var(--text);
      border-radius: 3px;
      z-index: 1;
      transform-origin: center;
      transition: transform 0.3s cubic-bezier(0.77, 0.2, 0.05, 1.0),
                  background 0.3s cubic-bezier(0.77, 0.2, 0.05, 1.0),
                  opacity 0.3s ease;
    }
    
    &.open span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    
    &.open span:nth-child(2) {
      opacity: 0;
    }
    
    &.open span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }
    
    @media (max-width: 768px) {
      display: flex;
    }
  }

  .mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    background: var(--background);
    z-index: 100;
    padding: 2rem;
    
    a {
      font-size: 2rem;
      font-weight: 600;
      color: var(--text);
      position: relative;
      transition: color 0.3s ease;
      
      &:after {
        content: '';
        position: absolute;
        width: 0;
        height: 3px;
        display: block;
        margin-top: 5px;
        right: 0;
        background: var(--primary);
        transition: width 0.3s ease;
      }
      
      &:hover {
        color: var(--primary);
        
        &:after {
          width: 100%;
          left: 0;
          right: auto;
        }
      }
    }
    
    .mobile-controls-section {
      background: rgba(255, 255, 255, 0.08) !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      
      [data-theme="dark"] & {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
      }
    }
    
    .mobile-login-button {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-size: 1.2rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 200px;
      justify-content: center;
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(224, 43, 32, 0.3);
      }
    }
  }

  .controls-group {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    
    @media (max-width: 768px) {
      display: none;
    }
  }

  .auth-section {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-left: 0.2rem;
    
    @media (max-width: 1024px) {
      gap: 0.5rem;
      margin-left: 0.1rem;
    }
    
    @media (max-width: 768px) {
      display: none;
    }
  }

  .login-button {
    border: 1px solid rgba(224, 43, 32, 0.2);
    padding: 0.35rem 0.75rem;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    font-size: 0.8rem;
    white-space: nowrap;
    background: rgba(224, 43, 32, 0.08);
    color: var(--primary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    min-width: 90px;
    height: 32px;
    justify-content: center;
    
    &:hover {
      transform: translateY(-1px);
      background: rgba(224, 43, 32, 0.12);
      border-color: rgba(224, 43, 32, 0.3);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }

    [data-theme="dark"] & {
      border-color: rgba(224, 43, 32, 0.3);
      background: rgba(224, 43, 32, 0.1);
      color: var(--primary);
    }

    [data-theme="dark"] &:hover {
      background: rgba(224, 43, 32, 0.15);
      border-color: rgba(224, 43, 32, 0.5);
    }
    
    span {
      font-size: inherit;
      font-weight: inherit;
    }
  }

  .user-menu {
    position: relative;
    
    .user-button {
      background: rgba(224, 43, 32, 0.05);
      color: var(--text);
      border: 1px solid rgba(224, 43, 32, 0.15);
      padding: 0.35rem 0.75rem;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      font-size: 0.8rem;
      box-shadow: 0 2px 8px rgba(224, 43, 32, 0.1);
      min-width: 120px;
      height: 32px;
      justify-content: space-between;
      position: relative;
      
      &:hover {
        border-color: rgba(224, 43, 32, 0.3);
        background: rgba(224, 43, 32, 0.1);
        box-shadow: 0 4px 16px rgba(224, 43, 32, 0.2);
        transform: translateY(-1px);
      }
      
      &.active {
        border-color: rgba(224, 43, 32, 0.4);
        background: rgba(224, 43, 32, 0.12);
        box-shadow: 0 4px 16px rgba(224, 43, 32, 0.25);
      }

      [data-theme="dark"] & {
        border-color: rgba(224, 43, 32, 0.2);
        background: rgba(224, 43, 32, 0.08);
        color: var(--text);
      }

      [data-theme="dark"] &:hover {
        border-color: rgba(224, 43, 32, 0.4);
        background: rgba(224, 43, 32, 0.15);
      }
      
      [data-theme="dark"] &.active {
        border-color: rgba(224, 43, 32, 0.5);
        background: rgba(224, 43, 32, 0.18);
      }
      
      .user-info {
        display: flex;
        align-items: center;
        gap: 0.4rem;
      }
      
      .chevron {
        transition: transform 0.3s ease;
        color: var(--primary);
        opacity: 0.7;
        
        &.rotated {
          transform: rotate(180deg);
        }
      }
    }
    
    .dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(224, 43, 32, 0.15), 0 8px 20px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(224, 43, 32, 0.1);
      min-width: 220px;
      overflow: hidden;
      z-index: 1000;
      backdrop-filter: blur(10px);
      
      [data-theme="dark"] & {
        background: var(--background-secondary);
        border-color: rgba(224, 43, 32, 0.2);
        box-shadow: 0 20px 40px rgba(224, 43, 32, 0.2), 0 8px 20px rgba(0, 0, 0, 0.3);
      }
      
      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.9rem 1.2rem;
        color: var(--text);
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        font-size: 0.9rem;
        font-weight: 500;
        position: relative;
        
        &:not(:last-child) {
          border-bottom: 1px solid rgba(224, 43, 32, 0.05);
        }
        
        &:hover {
          background: rgba(224, 43, 32, 0.08);
          color: var(--primary);
          transform: translateX(2px);
        }
        
        &:active {
          transform: translateX(1px);
        }
        
        &.danger {
          color: #ef4444;
          
          &:hover {
            background: rgba(239, 68, 68, 0.08);
            color: #dc2626;
          }
        }
        
        &.disabled {
          color: var(--text-secondary);
          opacity: 0.5;
          cursor: not-allowed;
          
          &:hover {
            background: none;
            color: var(--text-secondary);
            transform: none;
          }
          
          svg {
            opacity: 0.5;
          }
        }
        
        svg {
          width: 16px;
          height: 16px;
          opacity: 0.7;
        }
        
        [data-theme="dark"] & {
          &:not(:last-child) {
            border-bottom-color: rgba(224, 43, 32, 0.1);
          }
          
          &:hover {
            background: rgba(224, 43, 32, 0.12);
          }
        }
      }
    }
  }
`;

const Header = ({ changeLanguage, theme, toggleTheme }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    isAuthenticated,
    user,
    hasPermission,
    logout
  } = useAuth();
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);
  
  const navLinks = [
    { path: '/', label: t('header.home') },
    { path: '/about', label: t('header.about') },
    { path: '/team', label: t('header.team') },
    { path: '/events', label: t('header.events') },
    { path: '/join', label: t('header.join') }
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        y: { stiffness: 1000 }
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    }
  };

  const linkVariants = {
    closed: { y: 50, opacity: 0 },
    open: i => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        y: { stiffness: 1000, velocity: -100 }
      }
    })
  };

  const handleLoginSuccess = (response) => {
    setShowLoginModal(false);
    
    // 根据用户权限进行适当的跳转
    if (response.user.hasProfile) {
      navigate('/staff/profile');
    } else if (hasPermission('accessAdmin')) {
      navigate('/admin/events');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };
  
  return (
    <StyledHeader className={scrolled ? 'scrolled' : ''}>
      <div className="container">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="UTChinese Network Logo" />
          <h1>
            UTChinese Network
          </h1>
        </Link>

        <nav>
          <div className="nav-links">
            {navLinks.map(({ path, label }) => (
              <Link 
                key={path} 
                to={path} 
                className={`nav-link ${location.pathname === path ? 'active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </div>
          
          <div className="header-controls-wrapper">
            <div className="auth-section">
            {isAuthenticated ? (
              <div className="user-menu">
                <button 
                  className={`user-button ${showUserMenu ? 'active' : ''}`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="user-info">
                    <FiUser />
                    {user?.username || 'User'}
                  </div>
                  <FiChevronDown className={`chevron ${showUserMenu ? 'rotated' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      className="dropdown"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ 
                        duration: 0.2,
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                    >
                      {hasPermission('manageEvents') && (
                        <button 
                          className="dropdown-item"
                          onClick={() => {
                            navigate('/admin/events');
                            setShowUserMenu(false);
                          }}
                        >
                          <FiSettings />
                          {t('header.eventManagement')}
                        </button>
                      )}
                      
                      {(hasPermission('manageStaff') || hasPermission('reviewProfiles')) && (
                        <button 
                          className="dropdown-item"
                          onClick={() => {
                            navigate('/admin/staff');
                            setShowUserMenu(false);
                          }}
                        >
                          <FiUsers />
                          {t('header.staffManagement')}
                        </button>
                      )}
                      
                      <button 
                        className={`dropdown-item ${!user?.isActive ? 'disabled' : ''}`}
                        onClick={() => {
                          if (user?.isActive) {
                            navigate('/staff/profile');
                            setShowUserMenu(false);
                          }
                        }}
                        title={!user?.isActive ? t('accountStatus.notActivated.description') : ''}
                      >
                        {user?.isActive ? <FiUser /> : <FiLock />}
                        {t('header.myProfile')}
                      </button>
                      
                      <button 
                        className="dropdown-item danger"
                        onClick={handleLogout}
                      >
                        <FiLogOut />
                        {t('header.logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                className="login-button unified-login"
                onClick={() => setShowLoginModal(true)}
              >
                <FiLogIn />
                <span>{t('header.login')}</span>
              </button>
            )}
          </div>

            <div className="controls-group">
              <LanguageSelector changeLanguage={changeLanguage} />
              
              <ThemeSwitch theme={theme} toggleTheme={toggleTheme} />
            </div>
          </div>

          <div
            className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            {navLinks.map(({ path, label }, i) => (
              <motion.div
                key={path}
                custom={i}
                variants={linkVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <Link to={path}>
                  {label}
                </Link>
              </motion.div>
            ))}
            
            {/* Settings and Controls Section */}
            <motion.div
              className="mobile-controls-section"
              custom={navLinks.length}
              variants={linkVariants}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                width: '100%',
                maxWidth: '280px'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: '500'
                  }}>
                    Language
                  </span>
                  <LanguageSelector changeLanguage={changeLanguage} />
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: '500'
                  }}>
                    Theme
                  </span>
                  <ThemeSwitch theme={theme} toggleTheme={toggleTheme} />
                </div>
              </div>
            </motion.div>
            
            {/* Mobile Login/User Menu */}
            {isAuthenticated ? (
              <motion.div
                className="mobile-user-section"
                custom={navLinks.length + 1}
                variants={linkVariants}
                                 style={{
                   display: 'flex',
                   flexDirection: 'column',
                   gap: '1rem',
                   padding: '1rem',
                   background: 'var(--card-bg, rgba(224, 43, 32, 0.05))',
                   borderRadius: '15px',
                   border: '1px solid rgba(224, 43, 32, 0.1)',
                   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                 }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--primary)'
                }}>
                  <FiUser />
                  {user?.username || 'User'}
                </div>
                
                {hasPermission('manageEvents') && (
                  <Link 
                    to="/admin/events"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '1rem',
                      color: 'var(--text)',
                      textDecoration: 'none'
                    }}
                  >
                    <FiSettings />
                    {t('header.eventManagement')}
                  </Link>
                )}
                
                {(hasPermission('manageStaff') || hasPermission('reviewProfiles')) && (
                  <Link 
                    to="/admin/staff"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '1rem',
                      color: 'var(--text)',
                      textDecoration: 'none'
                    }}
                  >
                    <FiUsers />
                    {t('header.staffManagement')}
                  </Link>
                )}
                
                <div
                  onClick={() => {
                    if (user?.isActive) {
                      navigate('/staff/profile');
                      setMobileMenuOpen(false);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1rem',
                    color: user?.isActive ? 'var(--text)' : 'var(--text-secondary)',
                    textDecoration: 'none',
                    opacity: user?.isActive ? 1 : 0.5,
                    cursor: user?.isActive ? 'pointer' : 'not-allowed'
                  }}
                  title={!user?.isActive ? t('accountStatus.notActivated.description') : ''}
                >
                  {user?.isActive ? <FiUser /> : <FiLock />}
                  {t('header.myProfile')}
                </div>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1rem',
                    color: '#dc2626',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem 0',
                    textAlign: 'left'
                  }}
                >
                  <FiLogOut />
                  {t('header.logout')}
                </button>
              </motion.div>
            ) : (
              <motion.button
                className="mobile-login-button"
                custom={navLinks.length + 1}
                variants={linkVariants}
                onClick={() => {
                  setShowLoginModal(true);
                  setMobileMenuOpen(false);
                }}
              >
                <FiLogIn />
                {t('header.login')}
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <UnifiedLoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </StyledHeader>
  );
};

export default Header;
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSelector = ({ changeLanguage }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    {
      code: 'en',
      name: 'English',
      icon: (
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 512">
          <g fillRule="nonzero">
            <path fill="#999" d="M256 0c70.68 0 134.69 28.66 181.01 74.99C483.34 121.31 512 185.32 512 256c0 70.68-28.66 134.69-74.99 181.01C390.69 483.34 326.68 512 256 512c-70.68 0-134.69-28.66-181.01-74.99C28.66 390.69 0 326.68 0 256c0-70.68 28.66-134.69 74.99-181.01C121.31 28.66 185.32 0 256 0z"/>
            <path fill="#fff" d="M255.99 19.48c65.31 0 124.46 26.48 167.25 69.27 42.79 42.79 69.28 101.93 69.28 167.24s-26.49 124.46-69.28 167.25c-42.79 42.79-101.94 69.28-167.25 69.28-65.23 0-124.38-26.51-167.18-69.33-42.84-42.74-69.33-101.89-69.33-167.2 0-65.31 26.48-124.45 69.27-167.24 42.79-42.79 101.93-69.27 167.24-69.27z"/>
            <path fill="red" d="M119.93 424.25C70.96 384.58 39.59 323.9 39.59 255.99c0-67.95 31.34-128.59 80.34-168.26v336.52zM392.11 87.76c48.96 39.69 80.3 100.33 80.3 168.23 0 67.94-31.31 128.58-80.3 168.25V87.76zm-136.12 62.07-17.81 33.22c-2.03 3.61-5.64 3.28-9.27 1.27l-12.9-6.68 9.61 51.04c2.03 9.32-4.47 9.32-7.66 5.3l-22.51-25.21-3.66 12.8c-.42 1.67-2.28 3.45-5.05 3.02l-28.47-5.99 7.47 27.2c1.6 6.04 2.85 8.55-1.61 10.15l-10.15 4.76 49.01 39.82c1.93 1.5 2.91 4.21 2.22 6.66l-4.28 14.07c16.87-1.94 31.99-4.87 48.87-6.67 1.49-.16 3.99 2.29 3.98 4.02l-2.24 51.56h8.21l-1.3-51.45c0-1.73 2.26-4.29 3.75-4.13 16.88 1.8 31.99 4.72 48.87 6.67l-4.29-14.08c-.7-2.44.29-5.15 2.23-6.65l49-39.82-10.13-4.76c-4.47-1.6-3.22-4.11-1.62-10.15l7.48-27.2-28.48 5.99c-2.77.43-4.64-1.35-5.05-3.02l-3.66-12.8-22.52 25.21c-3.2 4.02-9.67 4.02-7.66-5.3l9.61-51.04-12.89 6.68c-3.63 2.01-7.25 2.34-9.26-1.27l-17.84-33.22z"/>
          </g>
        </svg>
      )
    },
    {
      code: 'zh',
      name: '中文',
      icon: (
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 512">
          <g fillRule="nonzero">
            <path fill="#999" d="M256 0c70.68 0 134.69 28.66 181.01 74.99C483.34 121.31 512 185.32 512 256c0 70.68-28.66 134.69-74.99 181.01C390.69 483.34 326.68 512 256 512c-70.68 0-134.69-28.66-181.01-74.99C28.66 390.69 0 326.68 0 256c0-70.68 28.66-134.69 74.99-181.01C121.31 28.66 185.32 0 256 0z"/>
            <path fill="#fff" d="M256 19.48c65.3 0 124.46 26.48 167.25 69.27l1.09 1.18c42.14 42.71 68.18 101.37 68.18 166.06 0 65.31-26.49 124.46-69.28 167.25l-1.19 1.09c-42.73 42.16-101.4 68.19-166.05 68.19-65.3 0-124.45-26.49-167.24-69.28-42.79-42.79-69.29-101.95-69.29-167.25 0-65.23 26.51-124.38 69.34-167.18C131.55 45.97 190.7 19.48 256 19.48z"/>
            <path fill="#EE1C25" d="M256 39.59c119.52 0 216.41 96.89 216.41 216.4 0 119.52-96.89 216.42-216.41 216.42-119.51 0-216.41-96.9-216.41-216.42 0-119.51 96.9-216.4 216.41-216.4z"/>
            <path fill="#ff0" d="m156.3 97.57 44.4 136.68-116.27-84.47h143.7l-116.25 84.47L156.3 97.57zm134.8 152.74-2.23 47.84-26.33-40 44.82 16.88-46.19 12.67 29.93-37.39zm65.15-35.44-37.72 29.52 13.16-46.06 16.4 44.99-39.73-26.74 47.89-1.71zm-5.59-84.44-22.38 42.34-6.79-47.43 33.33 34.37-47.17-8.2 43.01-21.08zM292.08 74.4l-4.23 47.71-24.64-41.06L307.3 99.8l-46.69 10.74 31.47-36.14z"/>
          </g>
        </svg>
      )
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <StyledWrapper ref={dropdownRef}>
      <button 
        className="language-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        <span className="icon">{currentLanguage.icon}</span>
        <span className="language-name">{currentLanguage.name}</span>
        <svg 
          className={`chevron ${isOpen ? 'open' : ''}`} 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <path 
            d="M6 9L12 15L18 9" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="language-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {languages.map((language) => (
              <button
                key={language.code}
                className={`language-option ${i18n.language === language.code ? 'active' : ''}`}
                onClick={() => handleLanguageSelect(language.code)}
              >
                <span className="icon">{language.icon}</span>
                <span className="language-name">{language.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: relative;
  display: inline-block;

  .language-selector-trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.75rem;
    background: transparent;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    min-width: 90px;
    height: 32px;
    justify-content: space-between;

    &:hover {
      border-color: rgba(224, 43, 32, 0.2);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      transform: translateY(-1px);
    }

    [data-theme="dark"] & {
      background: transparent;
      border-color: rgba(255, 255, 255, 0.08);
      color: var(--text);
    }

    [data-theme="dark"] &:hover {
      border-color: rgba(224, 43, 32, 0.5);
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      line-height: 1;
      color: currentColor;
      
      svg {
        border-radius: 50%;
        transition: transform 0.2s ease;
      }
      
      &:hover svg {
        transform: scale(1.1);
      }
    }

    .language-name {
      font-size: inherit;
      font-weight: inherit;
      white-space: nowrap;
      flex: 1;
    }

    .chevron {
      transition: transform 0.2s ease;
      color: rgba(0, 0, 0, 0.4);
      flex-shrink: 0;

      [data-theme="dark"] & {
        color: rgba(255, 255, 255, 0.4);
      }

      &.open {
        transform: rotate(180deg);
      }
    }
  }

  .language-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.5rem;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    z-index: 1000;
    min-width: 160px;

    [data-theme="dark"] & {
      background: var(--background-secondary);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }

    .language-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.875rem 1rem;
      background: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text);
      text-align: left;

      &:hover {
        background: rgba(224, 43, 32, 0.06);
        color: var(--primary);
      }

      &.active {
        background: rgba(224, 43, 32, 0.08);
        color: var(--primary);
        font-weight: 600;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--primary);
        }
      }

      [data-theme="dark"] &:hover {
        background: rgba(224, 43, 32, 0.08);
      }

      [data-theme="dark"] &.active {
        background: rgba(224, 43, 32, 0.12);
      }

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        line-height: 1;
        color: currentColor;
        
        svg {
          border-radius: 50%;
          transition: transform 0.2s ease;
        }
      }

      .language-name {
        font-size: inherit;
        font-weight: inherit;
      }
    }
  }

  @media (max-width: 768px) {
    .language-selector-trigger {
      padding: 0.4rem 1rem;
      font-size: 0.875rem;
      min-width: 110px;
      height: 36px;
    }

    .language-dropdown {
      min-width: 150px;
      
      .language-option {
        padding: 0.875rem 1rem;
        font-size: 0.875rem;
      }
    }
  }
`;

export default LanguageSelector; 
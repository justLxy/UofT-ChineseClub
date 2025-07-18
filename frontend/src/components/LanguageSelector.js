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
      flag: '🇨🇦'
    },
    {
      code: 'zh',
      name: '中文',
      flag: '🇨🇳'
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
        <span className="flag">{currentLanguage.flag}</span>
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
                <span className="flag">{language.flag}</span>
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

    .flag {
      font-size: 1rem;
      line-height: 1;
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

      .flag {
        font-size: 1rem;
        line-height: 1;
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
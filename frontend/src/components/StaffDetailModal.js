import React, { useEffect, useState, memo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiX, FiMail, FiLinkedin, FiGithub } from 'react-icons/fi';
import { FaWeixin } from 'react-icons/fa';
import StaffCard from './StaffCard';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
  will-change: opacity;
`;

const ModalContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  will-change: transform, opacity;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(224, 43, 32, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(224, 43, 32, 0.5);
    }
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }
  
  svg {
    color: var(--primary);
    font-size: 24px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  padding: 0 2.5rem;
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
    flex-direction: column;
  }
`;

const ContactButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 10px;
  background: var(--primary);
  color: white;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.2);
  font-size: 0.9rem;
  flex: 1;
  
  &:hover {
    background: var(--primary-dark);
    box-shadow: 0 8px 20px rgba(var(--primary-rgb), 0.3);
    transform: translateY(-2px);
  }
  
  svg {
    margin-right: 8px;
    font-size: 16px;
  }
  
  &.linkedin {
    background: #0077b5;
    
    &:hover {
      background: #005885;
    }
  }
  
  &.github {
    background: #333;
    
    &:hover {
      background: #1a1a1a;
    }
  }
  
  &.wechat {
    background: #07c160;
    
    &:hover {
      background: #059748;
    }
  }
`;

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.2
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.15
    }
  }
};

const modalVariants = {
  hidden: { 
    y: 30,
    opacity: 0,
    scale: 0.98
  },
  visible: { 
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 400,
      damping: 25,
      mass: 0.8
    }
  },
  exit: { 
    y: 30,
    opacity: 0,
    scale: 0.98,
    transition: { 
      duration: 0.15
    }
  }
};

const StaffDetailModal = ({ staff: initialStaff, onClose }) => {
  const { i18n } = useTranslation();
  const [staff, setStaff] = useState(initialStaff);
  
  // Update staff data when initialStaff changes (language switching handled by parent)
  useEffect(() => {
    setStaff(initialStaff);
  }, [initialStaff]);
  
  const { email, linkedin, github, wechat } = staff;

  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <AnimatePresence>
      <Overlay
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <ModalContainer
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
          
          <StaffCard staff={staff} />
          
          {(email || linkedin || github || wechat) && (
            <ActionButtons>
              {email && (
                <ContactButton href={`mailto:${email}`}>
                  <FiMail />
                  {i18n.language === 'zh' ? '发送邮件' : 'Send Email'}
                </ContactButton>
              )}
              {linkedin && (
                <ContactButton href={linkedin} target="_blank" rel="noopener noreferrer" className="linkedin">
                  <FiLinkedin />
                  LinkedIn
                </ContactButton>
              )}
              {github && (
                <ContactButton href={github} target="_blank" rel="noopener noreferrer" className="github">
                  <FiGithub />
                  GitHub
                </ContactButton>
              )}
              {wechat && (
                <ContactButton 
                  as="button" 
                  onClick={() => alert(i18n.language === 'zh' ? `微信号: ${wechat}` : `WeChat ID: ${wechat}`)}
                  className="wechat"
                >
                  <FaWeixin />
                  WeChat
                </ContactButton>
              )}
            </ActionButtons>
          )}
        </ModalContainer>
      </Overlay>
    </AnimatePresence>
  );
};

export default memo(StaffDetailModal); 
import React, { useEffect, useState, memo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FiX, FiCalendar, FiMapPin, FiExternalLink, FiEdit } from 'react-icons/fi';
import { formatEventDateTime } from '../utils/dateUtils';
import { BASE_URL } from '../utils/api';

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
`;

const ModalContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: var(--background);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  transition: background-color 0.3s ease;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  
  svg {
    color: var(--primary);
    font-size: 28px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  }
`;

const ImageSection = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  
  @media (min-width: 768px) {
    width: 45%;
    height: auto;
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ContentSection = styled.div`
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const StatusBadge = styled.div`
  display: inline-block;
  background: ${props => {
    switch (props.status) {
      case 'past':
        return 'linear-gradient(135deg, #434343, #000000)';
      case 'ongoing':
        return 'linear-gradient(135deg, #00B09B, #96C93D)';
      case 'upcoming':
        return 'linear-gradient(135deg, #4776E6, #8E54E9)';
      default:
        return 'linear-gradient(135deg, #4776E6, #8E54E9)';
    }
  }};
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
  min-width: 80px;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 20px 0;
  color: var(--text);
  line-height: 1.2;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 1rem;
  color: var(--text-light);
  
  svg {
    margin-right: 12px;
    color: var(--primary);
    font-size: 18px;
  }
`;

const Description = styled.div`
  margin: 30px 0;
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text-light);
  
  p {
    margin-bottom: 16px;
  }
`;

const LinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  padding: 12px 24px;
  border-radius: 8px;
  background: var(--primary);
  color: white;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  align-self: flex-start;
  box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.2);
  
  &:hover {
    background: var(--primary-dark);
    box-shadow: 0 8px 20px rgba(var(--primary-rgb), 0.3);
    transform: translateY(-2px);
  }
  
  svg {
    margin-left: 8px;
  }
`;

const AdminLink = styled(Link)`
  text-decoration: none;
`;

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.3
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.2
    }
  }
};

const modalVariants = {
  hidden: { 
    y: 50,
    opacity: 0
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 30,
      delay: 0.1
    }
  },
  exit: { 
    y: 50,
    opacity: 0,
    transition: { 
      duration: 0.2
    }
  }
};

const EventDetailModal = ({ event: initialEvent, onClose, isAdmin = false }) => {
  const { t, i18n } = useTranslation();
  const [event, setEvent] = useState(initialEvent);
  
  // Update event data when initialEvent changes (language switching handled by parent)
  useEffect(() => {
    setEvent(initialEvent);
  }, [initialEvent]);
  
  const { 
    id,
    title, 
    description, 
    imageUrl, 
    startDate, 
    endDate, 
    location, 
    status, 
    link
  } = event;

  const dateDisplay = formatEventDateTime(startDate, endDate);

  // Default placeholder image from an external source
  const defaultImage = "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
  
  // Process image URL - add backend server prefix if it's a local path
  const processedImageUrl = !imageUrl ? defaultImage : 
                            imageUrl.startsWith('/') ? `${BASE_URL}${imageUrl}` : imageUrl;

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
          
          <ImageSection>
            <EventImage src={processedImageUrl} alt={title} />
          </ImageSection>
          
          <ContentSection>
            <StatusBadge status={status}>{t(`events.status.${status}`)}</StatusBadge>
            <Title>{title}</Title>
            
            <InfoItem>
              <FiCalendar /> {dateDisplay}
            </InfoItem>
            
            {location && (
              <InfoItem>
                <FiMapPin /> {location}
              </InfoItem>
            )}
            
            <Description>
              {description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </Description>
            
            {link && (
              <LinkButton href={link} target="_blank" rel="noopener noreferrer">
                {t('events.learnMore')} <FiExternalLink />
              </LinkButton>
            )}
          </ContentSection>
        </ModalContainer>
      </Overlay>
    </AnimatePresence>
  );
};

export default memo(EventDetailModal); 
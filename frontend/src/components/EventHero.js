import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiMapPin } from 'react-icons/fi';
import { getFullEventImageUrl, getEvents } from '../utils/api';
import { formatEventDateTime } from '../utils/dateUtils';
import LoadingAnimation from './LoadingAnimation';

const BackButton = styled(motion.button)`
  position: fixed;
  top: 100px;
  left: 2rem;
  z-index: 1000;
  background: var(--primary);
  border: none;
  border-radius: 50px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 30px rgba(var(--primary-rgb), 0.4);
  backdrop-filter: blur(10px);

  &:hover {
    background: var(--primary-dark);
    transform: translateX(-3px) translateY(-2px);
    box-shadow: 0 10px 40px rgba(var(--primary-rgb), 0.6);
  }

  svg {
    color: white;
  }
`;

const Hero = styled.section`
  position: relative;
  height: 70vh;
  background-image: url(${props => props.backgroundImage});
  background-size: cover;
  background-position: center top;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  
  animation: backgroundScroll 40s ease-in-out infinite;
  
  @keyframes backgroundScroll {
    0% {
      background-position: center top;
    }
    50% {
      background-position: center bottom;
    }
    100% {
      background-position: center top;
    }
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 65%,
      rgba(0, 0, 0, 0.6) 100%
    );
  }

  > div {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1rem;
    z-index: 2;
    padding: 0 2rem;
  }
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  margin: 0 0 1.5rem 0;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
    margin: 0 0 1rem 0;
  }
`;

const EventInfo = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  
  @media (max-width: 768px) {
    gap: 0.6rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 500;
  
  svg {
    color: var(--primary-light);
    flex-shrink: 0;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    gap: 0.6rem;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  background: var(--background);
`;

const EventHero = ({ eventSlug, defaultTitle, defaultImage }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isZh = i18n.language === 'zh';
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const events = await getEvents();
        // 根据不同的 slug 查找对应的活动
        let targetEvent = null;
        
        if (eventSlug === 'qin-society') {
          targetEvent = events.find(event => 
            event.title.toLowerCase().includes('qin society') || 
            event.title.includes('琴社') ||
            event.title.includes('古琴会') ||
            event.title.includes('琴会')
          );
        } else if (eventSlug === 'new-year-concert') {
          targetEvent = events.find(event => 
            event.title.toLowerCase().includes('new year concert') || 
            event.title.includes('新年音乐会')
          );
        }
        
        if (targetEvent) {
          setEventData(targetEvent);
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventSlug]);

  if (loading) {
    return (
      <LoadingWrapper>
        <LoadingAnimation />
      </LoadingWrapper>
    );
  }

  const heroImage = defaultImage;
  const displayTitle = eventData ? eventData.title : defaultTitle;

  return (
    <>
      <BackButton
        onClick={() => navigate('/events')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiArrowLeft />
        {isZh ? '返回活动' : 'Back to Events'}
      </BackButton>

      <Hero backgroundImage={heroImage}>
        <div>
          <Title
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {displayTitle}
          </Title>
          
          {eventData && (
            <EventInfo
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <InfoItem>
                <FiCalendar />
                <span>{formatEventDateTime(eventData.startDate, eventData.endDate, i18n.language)}</span>
              </InfoItem>
              {eventData.location && (
                <InfoItem>
                  <FiMapPin />
                  <span>{eventData.location}</span>
                </InfoItem>
              )}
            </EventInfo>
          )}
        </div>
      </Hero>
    </>
  );
};

export default EventHero;

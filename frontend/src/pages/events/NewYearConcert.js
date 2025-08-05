import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiMapPin } from 'react-icons/fi';
import { getFullEventImageUrl, getEvents } from '../../utils/api';
import { formatEventDateTime } from '../../utils/dateUtils';
import SEO from '../../components/SEO';
import LoadingAnimation from '../../components/LoadingAnimation';

const heroImg = getFullEventImageUrl('/uploads/events/NewYearConcert.jpg');

const PageWrapper = styled.div`
  width: 100%;
  overflow-x: hidden;
`;

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
  background-image: url(${heroImg});
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

const ContentSection = styled.section`
  padding: 5rem 2rem;
  max-width: 900px;
  margin: 0 auto;
  line-height: 1.8;
  font-size: 1.15rem;
  background: var(--background);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, var(--primary), var(--primary-light));
    border-radius: 2px;
  }
`;

const Paragraph = styled(motion.p)`
  margin-bottom: 2rem;
  color: var(--text);
  font-weight: 400;
  text-align: justify;
  
  &:first-of-type {
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--primary);
    text-align: center;
    margin-bottom: 3rem;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -1rem;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 2px;
      background: var(--primary-light);
      border-radius: 1px;
    }
  }
  
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const NewYearConcertPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isZh = i18n.language === 'zh';
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const events = await getEvents();
        // 查找新年音乐会相关的活动
        const concertEvent = events.find(event => 
          event.title.toLowerCase().includes('new year concert') || 
          event.title.includes('新年音乐会')
        );
        
        if (concertEvent) {
          setEventData(concertEvent);
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, []);

  // 默认内容（备用）
  const defaultContent = {
    en: {
      title: 'New Year Concert',
      seoTitle: 'New Year Concert | UTChinese Network',
      seoDescription: 'Celebrate the arrival of a new year with music that transcends borders.',
      paragraphs: [
        'Music speaks where words fail. UTChinese Network\'s New Year Concert embraces this universal language to support children\'s education and development around the world.',
        'From traditional Chinese folk tunes to contemporary orchestral pieces, our programme ignites hope and warmth in the heart of winter. Each melody carries a story of love, perseverance, and unity.',
        'Join us for an unforgettable night at the historic Isabel Bader Theatre, and start your year with the inspiring power of music.'
      ]
    },
    zh: {
      title: '新年音乐会',
      seoTitle: '新年音乐会 | UTChinese Network',
      seoDescription: '用跨越边界的音乐庆祝新年的到来。',
      paragraphs: [
        '音乐是没有国界的语言，也是我们支持儿童教育和发展的方式。多大中文新年音乐会拥抱这种通用语言，支持全世界儿童的教育和发展。',
        '从中国传统民谣到现代管弦乐作品，我们的节目在寒冬中点燃希望和温暖。每一段旋律都承载着爱、毅力和团结的故事。',
        '与我们一起在历史悠久的伊莎贝尔·巴德剧院度过难忘的夜晚，用音乐的启发力量开始您的新年。'
      ]
    }
  };

  const currentContent = isZh ? defaultContent.zh : defaultContent.en;

  if (loading) {
    return (
      <PageWrapper>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <LoadingAnimation />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <SEO
        title={currentContent.seoTitle}
        description={currentContent.seoDescription}
        url="https://www.utchinese.org/events/new-year-concert"
      />
      
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

      <Hero>
        <div>
          <Title
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
{eventData ? eventData.title : currentContent.title}
          </Title>
          
          {eventData && (
            <EventInfo
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <InfoItem>
                <FiCalendar />
                <span>{formatEventDateTime(eventData.startDate, eventData.endDate)}</span>
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

      <ContentSection>
        {currentContent.paragraphs.map((paragraph, index) => (
          <Paragraph
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
          >
            {paragraph}
          </Paragraph>
        ))}
      </ContentSection>
    </PageWrapper>
  );
};

export default NewYearConcertPage;

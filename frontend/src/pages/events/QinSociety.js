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

const heroImg = getFullEventImageUrl('/uploads/events/QinSocietyOpenCeremony.png');

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

const QinSocietyPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isZh = i18n.language === 'zh';
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const events = await getEvents();
        // 查找琴社相关的活动
        const qinEvent = events.find(event => 
          event.title.toLowerCase().includes('qin society') || 
          event.title.includes('琴社')
        );
        
        if (qinEvent) {
          setEventData(qinEvent);
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
      title: 'Qin Society',
      seoTitle: 'Qin Society | UTChinese Network',
      seoDescription: 'Experience the elegance of the Guqin with UTChinese Network Qin Society.',
      paragraphs: [
        'UTChinese Network Qin Society is dedicated to reviving the timeless art of the Guqin on campus. From the solemn melodies of ancient dynasties to contemporary interpretations, we provide a platform for both aficionados and newcomers to appreciate, learn, and perform.',
        'Our open ceremony marked the beginning of a new cultural journey at the University of Toronto. Distinguished performers presented classics such as "Guangling San" and "Ai Nai", enchanting the audience with the serene resonance of seven strings. Attendees also enjoyed hands-on sessions, exploring finger techniques and posture under the guidance of experienced mentors.',
        'Looking ahead, Qin Society will host seasonal outdoor gatherings, lecture-recitals, and collaborative concerts with other musical ensembles. Whether you are an absolute beginner or a seasoned qin player, we welcome you to join us and immerse yourself in this poetic soundscape.'
      ]
    },
    zh: {
      title: '多大中文琴社',
      seoTitle: '多大中文琴社 | UTChinese Network',
      seoDescription: '与多大中文古琴社一起感受古琴的优雅魅力。',
      paragraphs: [
        '多大中文古琴社致力于在校园内复兴古琴这一永恒的艺术。从古代王朝的庄严旋律到当代诠释，我们为琴友和新手提供一个欣赏、学习和演奏的平台。',
        '我们的开幕典礼标志着多伦多大学新文化之旅的开始。杰出的演奏者呈现了《广陵散》和《欸乃》等经典曲目，用七弦的宁静共鸣打动观众。参与者还享受了亲身体验，在经验丰富的导师指导下探索指法和姿态。',
        '展望未来，琴社将举办季节性户外雅集、讲座音乐会以及与其他音乐团体的合作音乐会。无论您是绝对的初学者还是经验丰富的琴者，我们都欢迎您加入我们，沉浸在这诗意的音景中。'
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
        url="https://www.utchinese.org/events/qin-society"
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

export default QinSocietyPage;

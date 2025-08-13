import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getFullEventImageUrl } from '../../utils/api';
import SEO from '../../components/SEO';
import EventHero from '../../components/EventHero';
import NYConcertSection from '../../components/NYConcertSection';

const heroImg = getFullEventImageUrl('/uploads/events/NewYearConcert.jpg');

const PageWrapper = styled.div`
  width: 100%;
  overflow-x: hidden;
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
  const isZh = i18n.language === 'zh';

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

  return (
    <PageWrapper>
      <SEO
        title={currentContent.seoTitle}
        description={currentContent.seoDescription}
        url="https://www.utchinese.org/events/new-year-concert"
      />
      
      <EventHero 
        eventSlug="new-year-concert"
        defaultTitle={currentContent.title}
        defaultImage={heroImg}
      />

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
      <NYConcertSection />
    </PageWrapper>
  );
};

export default NewYearConcertPage;

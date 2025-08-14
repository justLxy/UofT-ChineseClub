import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getFullEventImageUrl } from '../../utils/api';
import SEO from '../../components/SEO';
import EventHero from '../../components/EventHero';

const heroImg = getFullEventImageUrl('/uploads/events/NewYearConcert.jpg');

// Modal styles and data
const ModalOverlay = styled.div`
  position: fixed;
  z-index: 9999;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 16px;
  max-width: 95vw;
  max-height: 90vh;
  width: 460px;
  padding: 2rem 1.5rem 2rem 1.5rem;
  box-shadow: 0 8px 40px rgba(0,0,0,0.18);
  overflow-y: auto;
  position: relative;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1rem; right: 1rem;
  background: none;
  border: none;
  font-size: 1.2rem; 
  color: #e74c3c;   
  cursor: pointer;
  padding: 0.15em 0.35em;
  line-height: 1;
  border-radius: 4px;
  transition: background 0.15s;
  &:hover {
    background: rgb(231, 94, 94);
    color: #fff;
  }
`;

const ModalPoster = styled.img`
  width: 100%;
  border-radius: 10px;
  margin-bottom: 1.2rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.7rem;
  color: #2d2d2d;
`;

const ModalDesc = styled.div`
  font-size: 1.05rem;
  color: #555;
  margin-bottom: 1rem;
`;

const ModalHot = styled.div`
  font-size: 0.98rem;
  color: #8c5b1a;
  background: #f7f3ea;
  border-radius: 8px;
  padding: 0.7rem 1rem;
  margin-bottom: 0.5rem;
`;

// Past events data
const pastEvents = [
  {
    img: "/images/2024NYConcert/nyc_edited.jpg",
    title: 'NYConcert.pastTitle1',
    desc: 'NYConcert.pastDesc1',
    fullImg: "/images/2024NYConcert/nyc_edited.jpg",
    detail: "NYConcert.pastDetail1",
    hot: "NYConcert.pastHot1"
  },
  {
    img: "/images/2024NYConcert/poster2.jpg",
    title: 'NYConcert.pastTitle2',
    desc: 'NYConcert.pastDesc2',
    fullImg: "/images/2024NYConcert/poster2.jpg",
    detail: "NYConcert.pastDetail2",
    hot: "NYConcert.pastHot2"
  },
  {
    img: "/images/2024NYConcert/nyc_2016.png",
    title: 'NYConcert.pastTitle3',
    desc: 'NYConcert.pastDesc3',
    fullImg: "/images/2024NYConcert/nyc_2016.png",
    detail: "NYConcert.pastDetail3",
    hot: "NYConcert.pastHot3"
  }
];

// Photo gallery data
const galleryImages = [
  "/images/NYCPhotos/_DSC3416.jpg",
  "/images/NYCPhotos/_DSC3545.jpg",
  "/images/NYCPhotos/_DSC3796.jpg",
  "/images/NYCPhotos/UTChinese合照.jpg",
  "/images/NYCPhotos/100-export-多大中文-DSC08842.jpg",
  "/images/NYCPhotos/114-export-多大中文-DSC08876.jpg",
  "/images/NYCPhotos/161-export-多大中文-DSC08993.jpg",
  "/images/NYCPhotos/203-export-多大中文-DSC09121.jpg",
  "/images/NYCPhotos/209-export-多大中文-DSC09138.jpg",
  "/images/NYCPhotos/212-export-多大中文-DSC09153.jpg",
  "/images/NYCPhotos/294-export-多大中文-DSC09368.jpg",
  "/images/NYCPhotos/302-export-多大中文-DSC09390.jpg"
];

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

// NYConcertSection styles
const ExtraPageWrapper = styled.div`
  background: #f8f6f2;
  min-height: 100vh;
`;

const HeroSection = styled.section`
  background: linear-gradient(120deg, #f7e7d6 0%, #e9e3d1 100%);
  padding: 10rem 3.5rem 10rem 3.5rem;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-weight: 700;
  color: #2d2d2d;
  margin-bottom: 1.2rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  color: #7a6c5d;
  margin-top: 3.5rem;
  margin-bottom: 2.5rem;
  max-width: 900px;
  text-align: center;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #3b2e1a;
  margin-bottom: 1.5rem;
`;

const SectionText = styled.p`
  font-size: 1.15rem;
  color: #444;
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const InfoList = styled.ul`
  margin: 1.5rem 0 2rem 1.5rem;
  color: #5a4b3c;
  font-size: 1.08rem;
  line-height: 1.7;
  li {
    margin-bottom: 0.7rem;
  }
`;

const NewConcertSection = styled.section`
  max-width: 1000px;
  margin: -2rem auto 2.5rem auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  padding: 2.5rem 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2rem;
`;

const NewConcertImage = styled.img`
  width: 320px;
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  flex-shrink: 0;
`;

const NewConcertInfo = styled.div`
  flex: 1;
  min-width: 220px;
`;

const BuyTicketButton = styled.a`
  display: inline-block;
  background: var(--primary);
  color: #fff;
  font-weight: 600;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-size: 1.08rem;
  margin: 1.2rem 0;
  text-decoration: none;
  transition: background 0.2s;
  &:hover {
    background: var(--primary-light);
    color: #fff;
  }
`;

const IntroSection = styled.section`
  width: 100%;
  min-height: 400px;
  margin: 4.5rem auto 4.5rem auto;
  background: linear-gradient(
    90deg,
    rgb(252, 209, 187) 0%,
    rgb(249, 218, 164) 10%,
    #fff 30%,
    #fff 70%,
    rgb(252, 222, 170) 90%,
    rgb(249, 184, 152) 100%
  );
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  padding: 3.5rem 0;
  text-align: center;
  position: relative;
  z-index: 2;
  overflow: hidden;
`;

const IntroContent = styled.div`
  padding: 2.5rem 3.5rem 2.5rem 3.5rem;
  background: transparent;
  border-radius: 32px;
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
`;

const IntroTitle = styled.h2`
  font-size: 2.1rem;
  color: #b85a1c;
  font-weight: 700;
  margin-bottom: 3.1rem;
  letter-spacing: 1px;
  text-shadow: 0 2px 12px rgba(255,255,255,0.18);
`;

const IntroLine = styled.div`
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #e9b97b 0%, #e74c3c 100%);
  border-radius: 2px;
  margin: 0 auto 1.5rem auto;
`;

const IntroText = styled.p`
  font-size: 1.18rem;
  color: #7a4b1c;
  line-height: 1.85;
  margin: 0 auto;
  max-width: 800px;
  min-height: 120px;
  text-shadow: 0 2px 12px rgba(255,255,255,0.12);
`;

const IntroDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 3.0rem auto 0 auto;
  width: 100%;
  max-width: 420px;
  color: #b88a4c;
  font-weight: 600;
  font-size: 1.08rem;
  letter-spacing: 1px;
  opacity: 0.85;
`;

const DividerLine = styled.span`
  flex: 2;
  height: 2px;
  background: linear-gradient(90deg, #e9b97b 0%, #e74c3c 100%);
  border-radius: 1px;
  margin: 0 14px;
`;

const PastEventsSection = styled.section`
  max-width: 1100px;
  margin: 0 auto 2.5rem auto;
  padding: 2.5rem 2rem;
  background: #f7f3ea;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.05);
`;

const PastEventsTitle = styled.h2`
  font-size: 1.7rem;
  color: #3b2e1a;
  margin-bottom: 2rem;
  text-align: center;
`;

const PastEventText = styled.p`
  font-size: 1.15rem;
  color: #444;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const PastEventsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  align-items: stretch;
`;

const PastEventSubTitle = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const PastEventCard = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  padding: 1.2rem;
  max-width: 420px;
  flex: 1 1 320px;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: 
    transform 0.18s cubic-bezier(.4,2,.6,1),
    box-shadow 0.18s cubic-bezier(.4,2,.6,1);

  &:hover {
    transform: translateY(-8px) scale(1.04) rotate(-1deg);
    box-shadow: 0 8px 32px rgba(0,0,0,0.13);
  }

  &:hover ${PastEventSubTitle} {
    color: rgb(220, 26, 26);
    text-shadow: 0 2px 8px rgb(244, 216, 216);
  }
`;

const PastEventImage = styled.img`
  width: 100%;
  border-radius: 10px;
  margin-bottom: 1rem;
  object-fit: cover;
  height: 180px;
`;

const PastEventInfo = styled.div`
  text-align: center;
`;

const PastEventDesc = styled.div`
  font-size: 0.98rem;
  color: #555;
`;

// Photo Gallery Styles
const GallerySection = styled.section`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  background: #fff;
  border-radius: 0;
  box-shadow: 0 2px 16px rgba(0,0,0,0.05);
  padding: 2.5rem 0;
`;

const GalleryTitle = styled.h2`
  font-size: 1.6rem;
  color: #3b2e1a;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const GalleryWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  touch-action: pan-y;
`;

const GallerySlider = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 40vw;
  min-height: 220px;
  max-height: 480px;
  width: 90vw;
  max-width: 1100px;
  margin: 0 auto;
  overflow: visible;

  @media (max-width: 900px) {
    height: 55vw;
    max-width: 98vw;
    width: 98vw;
  }
  @media (max-width: 600px) {
    height: 60vw;
    min-height: 140px;
    max-height: 260px;
    width: 100vw;
  }
`;

const GalleryImageWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  width: 60%;
  height: 100%;
  transform: translateX(-50%) 
    scale(${props => props.active ? 1 : 0.7})
    translateX(${props => props.offset * 60}%);
  z-index: ${props => 10 - Math.abs(props.offset)};
  opacity: ${props => Math.abs(props.offset) > 2 ? 0 : 1};
  transition: 
    transform 0.4s cubic-bezier(.4,2,.6,1),
    opacity 0.3s;
  pointer-events: ${props => props.active ? 'auto' : 'none'};

  @media (max-width: 900px) {
    width: 80%;
    transform: translateX(-50%)
      scale(${props => props.active ? 1 : 0.7})
      translateX(${props => props.offset * 85}%);
  }
  @media (max-width: 600px) {
    width: 95%;
    transform: translateX(-50%)
      scale(${props => props.active ? 1 : 0.7})
      translateX(${props => props.offset * 100}%);
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 14px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  user-select: none;
  background: #eee;
`;

const GalleryNav = styled.button`
  position: absolute;
  top: 50%;
  background: rgba(40,40,40,0.55);
  border: none;
  outline: none;
  border-radius: 50%;
  width: 52px;
  height: 52px;
  font-size: 2.2rem;
  color: #fff;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  left: ${props => props.left ? '18px' : 'unset'};
  right: ${props => props.right ? '18px' : 'unset'};
  opacity: 0.92;
  overflow: visible;
  transition: background 0.18s, box-shadow 0.18s;

  &:hover {
    background: rgba(231, 76, 60, 0.85);
    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
    opacity: 1;
  }

  @media (max-width: 900px) {
    width: 44px;
    height: 44px;
    font-size: 1.7rem;
    left: ${props => props.left ? '6px' : 'unset'};
    right: ${props => props.right ? '6px' : 'unset'};
  }
  @media (max-width: 600px) {
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
    left: ${props => props.left ? '2px' : 'unset'};
    right: ${props => props.right ? '2px' : 'unset'};
  }
`;

const GalleryBar = styled.div`
  width: 70%;
  height: 4px;
  background: #e0d6c6;
  border-radius: 2px;
  margin: 1.5rem auto 0 auto;
  position: relative;
  overflow: hidden;
  display: flex;
  cursor: pointer;
`;

const GalleryBarSegment = styled.button`
  flex: 1 1 0;
  height: 100%;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  outline: none;
  position: relative;
  z-index: 2;

  &:hover,
  &:active,
  &:focus {
    background: transparent;
    box-shadow: none;
  }
`;

const GalleryBarActive = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => 100 / props.total}%;
  background: #e74c3c;
  border-radius: 2px;
  transition: transform 0.4s cubic-bezier(.4,2,.6,1);
  transform: translateX(${props => props.current * 100}%);
  z-index: 1;
`;

// Modal Component
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalClose onClick={onClose}>&times;</ModalClose>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

// Photo Gallery Component
const PhotoGallery = ({ t }) => {
  const [current, setCurrent] = useState(0);
  const total = galleryImages.length;
  const startX = useRef(null);

  const goPrev = () => setCurrent(current === 0 ? total - 1 : current - 1);
  const goNext = () => setCurrent(current === total - 1 ? 0 : current + 1);

  const onTouchStart = e => {
    if (e.touches && e.touches.length === 1) {
      startX.current = e.touches[0].clientX;
    }
  };
  const onTouchMove = e => {
    if (startX.current !== null) e.preventDefault();
  };
  const onTouchEnd = e => {
    if (startX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX.current;
    if (diff > 50) goPrev();
    if (diff < -50) goNext();
    startX.current = null;
  };

  return (
    <GallerySection>
      <GalleryTitle>{t('NYConcert.photoGallery')}</GalleryTitle>
      <GalleryWrapper
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <GalleryNav left onClick={goPrev} aria-label="上一张">&lt;</GalleryNav>
        <GallerySlider>
          {galleryImages.map((src, idx) => {
            let offset = idx - current;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;
            return (
              <GalleryImageWrapper
                key={idx}
                active={offset === 0}
                offset={offset}
                style={{ pointerEvents: offset === 0 ? 'auto' : 'none' }}
              >
                <GalleryImage src={src} alt={`Concert Photo ${idx+1}`} draggable={false} />
              </GalleryImageWrapper>
            );
          })}
        </GallerySlider>
        <GalleryNav right onClick={goNext} aria-label="下一张">&gt;</GalleryNav>
      </GalleryWrapper>
      <GalleryBar>
        <GalleryBarActive current={current} total={total} />
        {galleryImages.map((_, idx) => (
          <GalleryBarSegment
            key={idx}
            aria-label={`跳转到第${idx + 1}张`}
            onClick={() => setCurrent(idx)}
            tabIndex={0}
          />
        ))}
      </GalleryBar>
    </GallerySection>
  );
};

const NewYearConcertPage = () => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === 'zh';
  const [modalEvent, setModalEvent] = useState(null);

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

      {/* Integrated NYConcertSection content */}
      <ExtraPageWrapper>
        <HeroSection>
          <HeroTitle
            as={motion.h1}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >{t('NYConcert.title')}</HeroTitle>
          <HeroSubtitle
            as={motion.p}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >{t('NYConcert.description')}</HeroSubtitle>
        </HeroSection>

        {/* 新音乐会板块 */}
        <NewConcertSection>
          <NewConcertImage src="/images/2024NYConcert/nyc2025.jpg" alt="2025 Concert" />
          <NewConcertInfo>
            <SectionTitle>{t('NYConcert.title2')}</SectionTitle>
            <SectionText>{t('NYConcert.description2')}</SectionText>
            <InfoList>
              <li><strong>Date:</strong> February 1, 2025</li>
              <li><strong>Time:</strong> 7:00 PM - 9:30 PM</li>
              <li><strong>Location:</strong> Isabel Bader Theatre, Toronto</li>
            </InfoList>
            <div style={{ textAlign: 'center' }}>
              <BuyTicketButton href="https://www.eventbrite.com/e/utchinese-new-year-concert-2025-tickets-1141714602109?aff=oddtdtcreator" target="_blank" rel="noopener noreferrer">
                {t('NYConcert.buyTickets')}
              </BuyTicketButton>
            </div>
          </NewConcertInfo>
        </NewConcertSection>

        {/* 音乐会引言板块 */}
        <IntroSection>
          <IntroContent>
            <IntroTitle
              as={motion.h2}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >{t('NYConcert.Introtitle')}</IntroTitle>
            <IntroLine />
            <IntroText
              as={motion.p}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >{t('NYConcert.Introtext')}</IntroText>
            <IntroDivider>
              <DividerLine />
              UTChinese Network
              <DividerLine />
            </IntroDivider>
          </IntroContent>
        </IntroSection>

        {/* 往期活动板块和卡片 */}
        <PastEventsSection>
          <PastEventsTitle>{t('NYConcert.title3')}</PastEventsTitle>
          <PastEventText>{t('NYConcert.description3')}</PastEventText>
          <PastEventsGrid>
            {pastEvents.map((event, idx) => (
              <PastEventCard key={idx} onClick={() => setModalEvent(event)} style={{cursor:'pointer'}}>
                <PastEventImage src={event.img} alt={event.title} />
                <PastEventInfo>
                  <PastEventSubTitle>{t(event.title)}</PastEventSubTitle>
                  <PastEventDesc>{t(event.desc)}</PastEventDesc>
                </PastEventInfo>
              </PastEventCard>
            ))}
          </PastEventsGrid>
        </PastEventsSection>

        {/* 往期活动卡片弹窗 */}
        <Modal open={!!modalEvent} onClose={() => setModalEvent(null)}>
          {modalEvent && (
            <>
              {modalEvent.title === 'NYConcert.pastTitle3' ? (
                <div style={{ width: '100%', aspectRatio: '16/9', marginBottom: '1.2rem' }}>
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/RX_vrxenzBM"
                    title="2016 Concert Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ borderRadius: '10px' }}
                  />
                </div>
              ) : (
                <ModalPoster src={modalEvent.fullImg} alt={modalEvent.title} />
              )}
              <ModalTitle>{t(modalEvent.title)}</ModalTitle>
              <ModalDesc>{t(modalEvent.detail)}</ModalDesc>
              <ModalHot>{t(modalEvent.hot)}</ModalHot>
            </>
          )}
        </Modal>

        {/* 音乐会照片画廊 */}
        <PhotoGallery t={t} />
      </ExtraPageWrapper>
    </PageWrapper>
  );
};

export default NewYearConcertPage;

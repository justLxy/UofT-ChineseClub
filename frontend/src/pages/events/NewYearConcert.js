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
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${props => props.closing ? 'fadeOut' : 'fadeIn'} 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 20px;
  max-width: 95vw;
  max-height: 90vh;
  width: 500px;
  padding: 2.5rem 2rem;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  overflow-y: auto;
  position: relative;
  animation: ${props => props.closing ? 'scaleOut' : 'scaleIn'} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center;

  @keyframes scaleIn {
    from { 
      opacity: 0;
      transform: scale(0.8) translateY(20px);
    }
    to { 
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes scaleOut {
    from { 
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    to { 
      opacity: 0;
      transform: scale(0.8) translateY(20px);
    }
  }
`;

const ModalContentWide = styled(ModalContent)`
  width: min(96vw, 880px);
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1rem; right: 1rem;
  background: rgba(231, 76, 60, 0.1);
  border: none;
  font-size: 1.5rem; 
  color: var(--primary);   
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--primary);
    color: white;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
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

const VideoEmbedBlock = styled.div`
  margin-bottom: 1.5rem;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const VideoEmbedLabel = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #3b2e1a;
`;

const VideoAspect = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  overflow: hidden;
  background: #111;

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
  }
`;

const ModalVideosSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ModalVideosHeading = styled.p`
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 1rem;
  text-align: center;
`;

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

/** 2026 新年音乐会精彩节目（YouTube 视频 ID 与双语标题） */
const NYC_HIGHLIGHT_VIDEOS = [
  { youtubeId: 'j2fpBq5wSAQ', titleEn: 'James', titleZh: 'James' },
  { youtubeId: 'NZRqberAc4I', titleEn: 'Jiming Yue', titleZh: '寄明月' },
  { youtubeId: 'EfSgJuP34-Q', titleEn: 'Allegro', titleZh: 'Allegro' },
  { youtubeId: 'SGOAENpCY40', titleEn: 'Toronto Pops Orchestra', titleZh: 'Toronto Pops Orchestra' },
  { youtubeId: 'oIzH_PlgQ0c', titleEn: 'Piano Solo', titleZh: '钢琴独奏' },
  { youtubeId: 'cXHk01AiDnc', titleEn: 'Guqin', titleZh: '古琴' },
  { youtubeId: '0AfVkqgTLmI', titleEn: 'A cappella', titleZh: '阿卡贝拉' }
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

const ExtraPageWrapper = styled.div`
  background: #f8f6f2;
  min-height: 100vh;
`;

const IntroSection = styled.section`
  width: 100%;
  min-height: 400px;
  margin: 0 auto 4.5rem auto;
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
  transition: all 0.3s ease;
  color: #333;
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
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border-radius: 0;
  box-shadow: 0 4px 32px rgba(0,0,0,0.08);
  padding: 4rem 0;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--primary-light), transparent);
  }
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
    scale(${props => props.active ? 1 : 0.8})
    translateX(${props => props.offset * 65}%)
    rotateY(${props => props.offset * 8}deg);
  z-index: ${props => 10 - Math.abs(props.offset)};
  opacity: ${props => {
    const absOffset = Math.abs(props.offset);
    if (absOffset > 2) return 0;
    if (absOffset === 0) return 1;
    return 1 - (absOffset * 0.3);
  }};
  transition: 
    transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    opacity 0.4s ease-out,
    filter 0.3s ease;
  pointer-events: ${props => props.active ? 'auto' : 'none'};
  filter: ${props => props.active ? 'brightness(1) saturate(1)' : 'brightness(0.7) saturate(0.8)'};
  transform-style: preserve-3d;
  perspective: 1000px;

  @media (max-width: 900px) {
    width: 75%;
    transform: translateX(-50%)
      scale(${props => props.active ? 1 : 0.85})
      translateX(${props => props.offset * 80}%)
      rotateY(${props => props.offset * 5}deg);
  }
  
  @media (max-width: 600px) {
    width: 90%;
    transform: translateX(-50%)
      scale(${props => props.active ? 1 : 0.9})
      translateX(${props => props.offset * 95}%);
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  user-select: none;
  background: linear-gradient(45deg, #f0f0f0, #e8e8e8);
  transition: box-shadow 0.3s ease, transform 0.2s ease;
  
  &:hover {
    box-shadow: 0 12px 48px rgba(0,0,0,0.18);
    transform: translateY(-2px);
  }
`;

const GalleryNav = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(231, 76, 60, 0.2);
  outline: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 1.8rem;
  color: var(--primary);
  cursor: pointer;
  z-index: 15;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  left: ${props => props.left ? '20px' : 'unset'};
  right: ${props => props.right ? '20px' : 'unset'};
  opacity: 0.8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    box-shadow: 0 8px 32px rgba(231, 76, 60, 0.3);
    opacity: 1;
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  @media (max-width: 900px) {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
    left: ${props => props.left ? '12px' : 'unset'};
    right: ${props => props.right ? '12px' : 'unset'};
  }
  
  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    left: ${props => props.left ? '8px' : 'unset'};
    right: ${props => props.right ? '8px' : 'unset'};
  }
`;

const GalleryBar = styled.div`
  width: 60%;
  height: 6px;
  background: rgba(224, 214, 198, 0.3);
  border-radius: 3px;
  margin: 2rem auto 0 auto;
  position: relative;
  overflow: hidden;
  display: flex;
  cursor: pointer;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
  backdrop-filter: blur(5px);
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
  transition: background 0.2s ease;

  &:hover {
    background: rgba(231, 76, 60, 0.1);
  }

  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
`;

const GalleryBarActive = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => 100 / props.total}%;
  background: linear-gradient(90deg, var(--primary), var(--primary-light));
  border-radius: 3px;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: translateX(${props => props.current * 100}%);
  z-index: 1;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    border-radius: inherit;
  }
`;

// Modal Component
const Modal = ({ open, onClose, children, wide }) => {
  if (!open) return null;
  const Content = wide ? ModalContentWide : ModalContent;
  return (
    <ModalOverlay onClick={onClose}>
      <Content onClick={e => e.stopPropagation()}>
        <ModalClose onClick={onClose}>&times;</ModalClose>
        {children}
      </Content>
    </ModalOverlay>
  );
};

// Photo Gallery Component
const PhotoGallery = ({ pageT }) => {
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
      <GalleryTitle>{pageT.photoGallery}</GalleryTitle>
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
  const { i18n } = useTranslation();
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

  // All page translations
  const pageTranslations = {
    en: {
      // Intro Section
      introTitle: 'Introduction to the UTChinese New Year Concert',
      introText: "Music is a language without borders,and it is also our way of supporting children's education and development. Every year during the Chinese New Year, we use music to convey warmth in the snow and ice of Toronto. At the New Year's Concert, the noble pianist and elegant ballet take you to experience the soul resonance between masters and feel the dialogue between performers and composers across time and space. Whether it is classical and romantic works that have resounded for hundreds of years, or modern songs that are spontaneously sung by the audience, you can always find familiar touches here. From 2007 to the present, in the past thirteen years, we have raised more than 110,000 Canadian dollars (about 550,000 RMB), and donated all of them to charitable organizations such as UNICEF Canada (United Nations Children's Fund). Great sound is silent, and great love leaves no trace.",
      
      // Past Events
      pastTitle: 'Past Events',
      pastDescription: `Since 2007, UT Chinese Network has held ${new Date().getFullYear() - 2006} New Year charity concerts.`,
      pastEvent2026Title: '2026 New Year Charity Concert',
      pastEvent2026Desc: 'The 2026 UTChinese New Year Concert was a night to remember, featuring stunning performances and a warm community atmosphere.',
      pastEvent2026Detail: 'The 2026 UTChinese New Year Concert was a night to remember, featuring stunning performances and a warm community atmosphere. The event showcased the talents of our members and celebrated the rich cultural heritage of the Chinese community at UofT.',
      pastEvent2026Hot: 'Hot: 1000+ attendees',
      pastEvent2026VideoHighlights: '2026 performance highlights',

      pastEvent2025Title: '2025 New Year Charity Concert',
      pastEvent2025Desc: 'The 2025 UTChinese New Year Concert was a night to remember, featuring stunning performances and a warm community atmosphere.',
      pastEvent2025Detail: 'The 2025 UTChinese New Year Concert was a night to remember, featuring stunning performances and a warm community atmosphere. The event showcased the talents of our members and celebrated the rich cultural heritage of the Chinese community at UofT.',
      pastEvent2025Hot: 'Hot: 1000+ attendees',

      pastEvent2024Title: '2024 New Year Concert',
      pastEvent2024Desc: '《Huaxu》',
      pastEvent2024Detail: '《Huaxu》 is a musical piece that combines traditional Chinese instruments with modern elements, creating a unique and captivating sound. The performance was well-received by the audience, showcasing the creativity and talent of our musicians.',
      pastEvent2024Hot: 'Hot: 800+ attendees',

      pastEvent2016Title: '2016 New Year Concert',
      pastEvent2016Desc: '《Ten Years A Concert》',
      pastEvent2016Detail: '《Ten Years A Concert》 was a special performance celebrating the 10th anniversary of the UTChinese New Year Concert. It featured a compilation of the best performances from previous years, highlighting the growth and evolution of our concert series.',
      pastEvent2016Hot: 'Hot: 1200+ attendees',
      
      // Photo Gallery
      photoGallery: 'Our Memorable Moments'
    },
    zh: {
      // Intro Section
      introTitle: '音乐会引言',
      introText: "音乐是没有国界的语言，也是我们支持儿童教育和发展的方式。每年春节期间，我们用音乐传递温暖，陪伴多伦多的冰雪。新年音乐会中，琴棋书画、古典芭蕾带你感受大师间的心灵共鸣，体会演奏者与作曲家跨越时空的对话。无论是百年传唱的经典浪漫作品，还是观众自发合唱的现代歌曲，你总能在这里找到熟悉的感动。从2007年至今，过去的十三年里，我们筹集了超过11万加元（约55万人民币）的善款，全数捐赠给联合国儿童基金会等慈善机构。大音希声，大爱无痕。",
      
      // Past Events
      pastTitle: '往期活动回顾',
      pastDescription: `自2007年起，多大中文（UTChineseNetwork）已举办${new Date().getFullYear() - 2006}场新年慈善音乐会`,
      pastEvent2026Title: '2026新年慈善音乐会',
      pastEvent2026Desc: '2026多大中文新年音乐会是一个难忘的夜晚，精彩的表演和温馨的社区氛围让人印象深刻。',
      pastEvent2026Detail: '2026年新年音乐会盛况空前，观众反响热烈，节目精彩纷呈。',
      pastEvent2026Hot: '热点回顾：2026年新年音乐会',
      pastEvent2026VideoHighlights: '2026 精彩节目回放',

      pastEvent2025Title: '2025新年慈善音乐会',
      pastEvent2025Desc: '2025多大中文新年音乐会是一个难忘的夜晚，精彩的表演和温馨的社区氛围让人印象深刻。',
      pastEvent2025Detail: '2025年新年音乐会盛况空前，观众反响热烈，节目精彩纷呈。',
      pastEvent2025Hot: '热点回顾：2025年新年音乐会',

      pastEvent2024Title: '2024新年音乐会',
      pastEvent2024Desc: '《花叙》',
      pastEvent2024Detail: '2024年新年音乐会以《花叙》为主题，展现了中国传统文化的魅力。',
      pastEvent2024Hot: '热点回顾：2024年新年音乐会',

      pastEvent2016Title: '2016新年音乐会',
      pastEvent2016Desc: '《十年为一》',
      pastEvent2016Detail: '2016年新年音乐会《十年为一》庆祝了多大中文十周年，回顾了社团的成长历程。',
      pastEvent2016Hot: '热点回顾：2016年新年音乐会',
      
      // Photo Gallery
      photoGallery: '我们的回忆'
    }
  };

  const t = isZh ? pageTranslations.zh : pageTranslations.en;

  // Past events data（eventKey 用于弹窗：2026 多视频、2016 单场视频，其余海报）
  const pastEvents = [
    {
      eventKey: '2026',
      img: '/images/NYCPhotos/_DSC3416.jpg',
      title: t.pastEvent2026Title,
      desc: t.pastEvent2026Desc,
      fullImg: '/images/NYCPhotos/_DSC3416.jpg',
      detail: t.pastEvent2026Detail,
      hot: t.pastEvent2026Hot
    },
    {
      eventKey: '2025',
      img: '/images/2024NYConcert/nyc_edited.jpg',
      title: t.pastEvent2025Title,
      desc: t.pastEvent2025Desc,
      fullImg: '/images/2024NYConcert/nyc_edited.jpg',
      detail: t.pastEvent2025Detail,
      hot: t.pastEvent2025Hot
    },
    {
      eventKey: '2024',
      img: '/images/2024NYConcert/poster2.jpg',
      title: t.pastEvent2024Title,
      desc: t.pastEvent2024Desc,
      fullImg: '/images/2024NYConcert/poster2.jpg',
      detail: t.pastEvent2024Detail,
      hot: t.pastEvent2024Hot
    },
    {
      eventKey: '2016',
      img: '/images/2024NYConcert/nyc_2016.png',
      title: t.pastEvent2016Title,
      desc: t.pastEvent2016Desc,
      fullImg: '/images/2024NYConcert/nyc_2016.png',
      detail: t.pastEvent2016Detail,
      hot: t.pastEvent2016Hot
    }
  ];

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

      <ExtraPageWrapper>

        {/* 音乐会引言板块 */}
        <IntroSection>
          <IntroContent>
            <IntroTitle
              as={motion.h2}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >{t.introTitle}</IntroTitle>
            <IntroLine />
            <IntroText
              as={motion.p}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >{t.introText}</IntroText>
            <IntroDivider>
              <DividerLine />
              UTChinese Network
              <DividerLine />
            </IntroDivider>
          </IntroContent>
        </IntroSection>

        {/* 往期活动板块和卡片 */}
        <PastEventsSection>
          <PastEventsTitle>{t.pastTitle}</PastEventsTitle>
          <PastEventText>{t.pastDescription}</PastEventText>
          <PastEventsGrid>
            {pastEvents.map((event) => (
              <PastEventCard key={event.eventKey} onClick={() => setModalEvent(event)} style={{cursor:'pointer'}}>
                <PastEventImage src={event.img} alt={event.title} />
                <PastEventInfo>
                  <PastEventSubTitle>{event.title}</PastEventSubTitle>
                  <PastEventDesc>{event.desc}</PastEventDesc>
                </PastEventInfo>
              </PastEventCard>
            ))}
          </PastEventsGrid>
        </PastEventsSection>

        {/* 往期活动卡片弹窗 */}
        <Modal
          open={!!modalEvent}
          onClose={() => setModalEvent(null)}
          wide={modalEvent?.eventKey === '2026'}
        >
          {modalEvent && (
            <>
              {modalEvent.eventKey === '2026' ? (
                <ModalVideosSection>
                  <ModalVideosHeading>{t.pastEvent2026VideoHighlights}</ModalVideosHeading>
                  {NYC_HIGHLIGHT_VIDEOS.map((v) => (
                    <VideoEmbedBlock key={v.youtubeId}>
                      <VideoEmbedLabel>
                        {isZh ? v.titleZh : v.titleEn}
                      </VideoEmbedLabel>
                      <VideoAspect>
                        <iframe
                          src={`https://www.youtube.com/embed/${v.youtubeId}`}
                          title={isZh ? v.titleZh : v.titleEn}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </VideoAspect>
                    </VideoEmbedBlock>
                  ))}
                </ModalVideosSection>
              ) : modalEvent.eventKey === '2016' ? (
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
              <ModalTitle>{modalEvent.title}</ModalTitle>
              <ModalDesc>{modalEvent.detail}</ModalDesc>
              <ModalHot>{modalEvent.hot}</ModalHot>
            </>
          )}
        </Modal>

        {/* 音乐会照片画廊 */}
        <PhotoGallery pageT={t} />
      </ExtraPageWrapper>
    </PageWrapper>
  );
};

export default NewYearConcertPage;

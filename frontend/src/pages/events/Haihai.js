import React, { useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO';
import EventHero from '../../components/EventHero';
import { getFullEventImageUrl } from '../../utils/api';

const heroImg = getFullEventImageUrl('/uploads/events/HaiHai.png');

const PageWrapper = styled.div`
  width: 100%;
  background: var(--background);
  color: var(--text);
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

const EditorialSection = styled.section`
  padding: 6rem 2rem;
  background: var(--background-alt);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  
  [data-theme='dark'] & {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const EditorialInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const StatementBlock = styled(motion.div)`
  max-width: 900px;
  margin-bottom: 6rem;
`;

const Eyebrow = styled.span`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary);
  margin-bottom: 1.5rem;
`;

const StatementTitle = styled.h2`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 1.5rem;
  color: var(--text);
`;

const StatementText = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--text-light);
  max-width: 700px;
  margin: 0;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem 2rem;
  margin-bottom: 6rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
`;

const FeatureItem = styled(motion.div)`
  border-top: 2px solid var(--text);
  padding-top: 1.5rem;
  
  [data-theme='dark'] & {
    border-top: 2px solid rgba(255, 255, 255, 0.2);
  }
`;

const FeatureNumber = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 1rem;
  color: var(--text);
`;

const FeatureDescription = styled.p`
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text-light);
  margin: 0;
`;

const GallerySection = styled.div`
  margin-top: 4rem;
`;

const GalleryHeader = styled(motion.div)`
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const GalleryTitleGroup = styled.div`
  max-width: 100%;
`;

const GalleryTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 1rem;
  color: var(--text);
`;

const GallerySubtitle = styled.p`
  font-size: 1.1rem;
  color: var(--text-light);
  margin: 0;
  line-height: 1.6;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 120px;
  grid-auto-flow: dense;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 160px;
  }
`;

const PhotoCard = styled(motion.button)`
  position: relative;
  grid-column: span ${props => props.$col || 2};
  grid-row: span ${props => props.$row || 2};
  padding: 0;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  overflow: hidden;
  cursor: pointer;

  @media (max-width: 768px) {
    grid-column: span 1 !important;
    grid-row: span 1 !important;
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);

  ${PhotoCard}:hover & {
    transform: scale(1.04);
  }
`;

const PhotoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${PhotoCard}:hover & {
    opacity: 1;
  }
`;

const PhotoCaption = styled.div`
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
`;

const PostersSection = styled.section`
  padding: 6rem 2rem;
  background: var(--background);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  
  [data-theme='dark'] & {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const PostersInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PostersTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 3rem;
  color: var(--text);
  text-align: center;
`;

const PostersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
`;

const PosterImageWrapper = styled(motion.div)`
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  background: rgba(0, 0, 0, 0.02);
  
  [data-theme='dark'] & {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.02);
  }
`;

const PosterImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const LightboxOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
`;

const LightboxPanel = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: var(--background);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--text);
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s ease;
  padding: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  
  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.1);
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const LightboxContent = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 900px) {
    flex-direction: row;
    height: 75vh;
  }
`;

const LightboxImageContainer = styled.div`
  flex: 1;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (min-width: 900px) {
    height: 100%;
  }
`;

const LightboxImage = styled.img`
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  
  @media (min-width: 900px) {
    max-height: 100%;
  }
`;

const LightboxMeta = styled.div`
  padding: 2rem;
  width: 100%;
  background: var(--background);

  @media (min-width: 900px) {
    width: 380px;
    overflow-y: auto;
    border-left: 1px solid rgba(0, 0, 0, 0.05);
    
    [data-theme='dark'] & {
      border-left: 1px solid rgba(255, 255, 255, 0.05);
    }
  }
`;

const LightboxCaptionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: var(--text);
  line-height: 1.4;
`;

const LightboxText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-light);
  margin: 0;
`;

const photoLayout = [
  { col: 4, row: 3 },
  { col: 2, row: 2 },
  { col: 2, row: 2 },
  { col: 3, row: 2 },
  { col: 3, row: 2 },
  { col: 2, row: 2 },
  { col: 4, row: 2 }
];

const posters = [
  '/images/Haihai/Haihai-poster.jpg',
  '/images/Haihai/Haihai-poster-2.jpg',
  '/images/Haihai/Haihai-poster-2024.png',
  '/images/Haihai/Haihai-poster-2025.jpg'
];

const HaihaiPage = () => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh';
  const [activePhoto, setActivePhoto] = useState(null);

  const content = {
    en: {
      title: 'HiHi | Haihai',
      seoTitle: 'HiHi | Haihai | UTChinese Network',
      seoDescription:
        'Step into HiHi, UTChinese Network\'s cross-cultural social event created with the U of T Myanmar Culture Club.',
      slogan: 'Life is vast like the ocean, yet as simple as it is.',
      introText: 'In a world where people come and go, encounters are like ocean currents. Our events bring together people from all corners of the world, who eventually flow toward different futures. Different languages, different cultural backgrounds, yet sharing the same foreign land and the same hopes for the future. In these short four years of university life, we are so lucky to stand at the intersection of these differences, witnessing and embracing the colorfulness of this world together.',
      eyebrow: 'Cross-Cultural Social',
      storyTitle: 'China Meets Myanmar, and strangers quickly became tablemates.',
      storyText:
        'From opening conversations to the last group photo on the steps outside, HiHi turned cultural exchange into something tactile: listen, taste, paint, speak, and laugh together.',
      highlights: [
        {
          title: 'Shared Culture, Not Parallel Booths',
          description:
            'The event was built around exchange, so students moved through the same prompts, stories, and activities together instead of staying inside separate circles.'
        },
        {
          title: 'Language Openers',
          description:
            'Short language interactions gave people easy first lines, making it natural to ask questions, compare expressions, and keep the conversation going.'
        },
        {
          title: 'Hands-On Tables & Warm Atmosphere',
          description:
            'Art-based stations, food, and music kept the afternoon grounded and relaxed. Guests learned through making, staying longer to chat and connect with new friends.'
        }
      ],
      galleryTitle: 'The room in motion',
      gallerySubtitle:
        'These photos capture what made HiHi special: people gathering around the same table, trying something new, and letting culture become conversation.',
      postersTitle: 'Past Posters',
      photos: [
        {
          src: '/images/Haihai/53d2876d1a9fad7ddfd32ccc9c4a1ef9.jpg',
          alt: 'Group photo from HiHi',
          caption: 'A sunlit closing photo after an afternoon of exchange.',
          detail: 'The final group shot says a lot about the event: relaxed, open, and full of new connections.'
        },
        {
          src: '/images/Haihai/eb1a758d05d65c2708d3019ae8c3790e.jpg',
          alt: 'Guests mingling inside the venue',
          caption: 'Conversation flowed across the entire room.',
          detail: 'People moved naturally between stations, making the event feel more like a shared social space than a formal program.'
        },
        {
          src: '/images/Haihai/19785919ba68a17a3a3e896733135f16.jpg',
          alt: 'Students working on a craft table',
          caption: 'Hands-on moments helped the room loosen up fast.',
          detail: 'Interactive tables gave everyone something to do together, which made starting conversations much easier.'
        },
        {
          src: '/images/Haihai/79f649e35134dd78de56442cc210a0f6.jpg',
          alt: 'Food table at HiHi',
          caption: 'Food became part of the cultural exchange too.',
          detail: 'Tea and snacks turned into a natural gathering point, where introductions kept extending into longer chats.'
        },
        {
          src: '/images/Haihai/dff52842c94d4dd00b06a40c3b694790.jpg',
          alt: 'Creative activity table',
          caption: 'Making together created its own rhythm.',
          detail: 'Collaborative creative prompts gave students an easy way to participate even before they knew anyone in the room.'
        },
        {
          src: '/images/Haihai/b6e3ce05a2a1dab8575ddfa9dd8f67b3.jpg',
          alt: 'Students painting at a table',
          caption: 'Small tables became small worlds of exchange.',
          detail: 'The event worked because every corner invited people to stay a little longer and talk a little more.'
        },
        {
          src: '/images/Haihai/efab148a51daadf245149ccb6376ef3b.jpg',
          alt: 'Wide view of the event space',
          caption: 'HiHi felt busy in the best possible way.',
          detail: 'The whole venue carried a soft buzz of making, tasting, listening, and meeting new people.'
        }
      ]
    },
    zh: {
      title: '海海 | HiHi',
      seoTitle: '海海 | HiHi | UTChinese Network',
      seoDescription: '走进海海，体验多大中文与 UofT Myanmar Culture Club 联合策划的跨文化社交活动。',
      slogan: '人生海海，山山而川，不过尔尔。',
      introText: '人来人往的世界里，际遇就像海里的洋流。我们的活动也是，来自五湖四海的人汇集在一起，终又流向不同的远方。不同的语言，不同的文化背景，同样的异国他乡，还有对未来同样的期许。大学生活短短四年，我们好幸运，可以站在这些异同的交汇点，共同见证并拥抱这个世界的多彩。',
      eyebrow: '跨文化社交',
      storyTitle: '中国遇见缅甸，陌生人很快就坐到了同一张桌边。',
      storyText:
        '从开场寒暄到最后走到门口合影，「海海」把文化交流做成了一种可以听、可以尝、可以画、可以聊的共同体验。',
      highlights: [
        {
          title: '不是并排摆摊，而是真的一起交流',
          description:
            '活动围绕“共同参与”来设计，大家在同一批问题、同一张桌子、同一组互动里慢慢认识彼此，而不是停留在各自的小圈子。'
        },
        {
          title: '语言互动成为最自然的破冰',
          description:
            '简短的语言交流给了大家一个非常轻松的开场白，也让不同文化背景的同学更容易延伸出新的话题。'
        },
        {
          title: '手作与茶点，让交流更具温度',
          description:
            '从合作填色到手作互动，加上精心准备的食物与音乐，让整场活动保持松弛的节奏。大家愿意停下来，边做边聊，认识新朋友。'
        }
      ],
      galleryTitle: '那些正在发生的瞬间',
      gallerySubtitle:
        '这些照片记录下了「海海」最动人的部分: 大家围坐、尝试、创作、交谈，让文化真正变成彼此之间的连接。',
      postersTitle: '往期海报',
      photos: [
        {
          src: '/images/Haihai/53d2876d1a9fad7ddfd32ccc9c4a1ef9.jpg',
          alt: '海海活动合影',
          caption: '活动结束后，阳光落在大家的合影里。',
          detail: '最后这张门口合照很像整场活动的缩影: 轻松、自然，也真的让人彼此熟络起来了。'
        },
        {
          src: '/images/Haihai/eb1a758d05d65c2708d3019ae8c3790e.jpg',
          alt: '活动现场全景',
          caption: '整个房间都在流动着交流的声音。',
          detail: '大家会自然地在不同桌之间穿梭，让整场活动更像一个共享社交空间，而不是流程化的项目展示。'
        },
        {
          src: '/images/Haihai/19785919ba68a17a3a3e896733135f16.jpg',
          alt: '同学们围桌互动',
          caption: '一旦动起手来，陌生感就消散得很快。',
          detail: '互动桌让每个人都能迅速参与进来，也让原本不熟悉的同学更容易顺着手边的话题聊下去。'
        },
        {
          src: '/images/Haihai/79f649e35134dd78de56442cc210a0f6.jpg',
          alt: '海海茶点区',
          caption: '食物也成了文化交流的一部分。',
          detail: '茶点区天然就是人群聚集的地方，很多简单的问候都从这里延伸成了更长的聊天。'
        },
        {
          src: '/images/Haihai/dff52842c94d4dd00b06a40c3b694790.jpg',
          alt: '创作互动桌',
          caption: '一起动手，会形成一种特别舒服的节奏。',
          detail: '合作型的创作环节让每位到场同学都能参与其中，即使一开始谁都不认识，也能很快进入状态。'
        },
        {
          src: '/images/Haihai/b6e3ce05a2a1dab8575ddfa9dd8f67b3.jpg',
          alt: '桌边创作细节',
          caption: '每一张桌子都像一个小小的交流现场。',
          detail: '这场活动好看的地方在于每个角落都在发生互动，大家愿意停下来，继续聊，也继续做。'
        },
        {
          src: '/images/Haihai/efab148a51daadf245149ccb6376ef3b.jpg',
          alt: '海海活动空间',
          caption: '忙碌、热闹，但始终很松弛。',
          detail: '整个现场一直保持着柔和而稳定的热度: 有人在做手工，有人在尝茶点，也有人刚刚认识了新朋友。'
        }
      ]
    }
  };

  const currentContent = isZh ? content.zh : content.en;

  return (
    <PageWrapper>
      <SEO
        title={currentContent.seoTitle}
        description={currentContent.seoDescription}
        url="https://www.utchinese.org/events/hihi"
      />

      <EventHero
        eventSlug="hihi"
        defaultTitle={currentContent.title}
        defaultImage={heroImg}
      />

      <ContentSection>
        <Paragraph
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          {currentContent.slogan}
        </Paragraph>
        <Paragraph
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          {currentContent.introText}
        </Paragraph>
      </ContentSection>

      <EditorialSection>
        <EditorialInner>
          <StatementBlock
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Eyebrow>{currentContent.eyebrow}</Eyebrow>
            <StatementTitle>{currentContent.storyTitle}</StatementTitle>
            <StatementText>{currentContent.storyText}</StatementText>
          </StatementBlock>

          <FeatureGrid>
            {currentContent.highlights.map((item, index) => (
              <FeatureItem
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <FeatureNumber>0{index + 1}</FeatureNumber>
                <FeatureTitle>{item.title}</FeatureTitle>
                <FeatureDescription>{item.description}</FeatureDescription>
              </FeatureItem>
            ))}
          </FeatureGrid>

          <GallerySection>
            <GalleryHeader
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <GalleryTitleGroup>
                <GalleryTitle>{currentContent.galleryTitle}</GalleryTitle>
                <GallerySubtitle>{currentContent.gallerySubtitle}</GallerySubtitle>
              </GalleryTitleGroup>
            </GalleryHeader>

            <PhotoGrid>
              {currentContent.photos.map((photo, index) => (
                <PhotoCard
                  key={photo.src}
                  $col={photoLayout[index]?.col}
                  $row={photoLayout[index]?.row}
                  onClick={() => setActivePhoto(photo)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  viewport={{ once: true, amount: 0.1 }}
                  aria-label={photo.caption}
                >
                  <PhotoImage src={photo.src} alt={photo.alt} loading="lazy" />
                  <PhotoOverlay>
                    <PhotoCaption>{photo.caption}</PhotoCaption>
                  </PhotoOverlay>
                </PhotoCard>
              ))}
            </PhotoGrid>
          </GallerySection>
        </EditorialInner>
      </EditorialSection>

      <PostersSection>
        <PostersInner>
          <PostersTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {currentContent.postersTitle}
          </PostersTitle>
          <PostersGrid>
            {posters.map((poster, index) => (
              <PosterImageWrapper
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <PosterImage src={poster} alt={`Haihai Poster ${index + 1}`} loading="lazy" />
              </PosterImageWrapper>
            ))}
          </PostersGrid>
        </PostersInner>
      </PostersSection>

      <AnimatePresence>
        {activePhoto && (
          <LightboxOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
          >
            <LightboxPanel
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.3 }}
              onClick={(event) => event.stopPropagation()}
            >
              <LightboxClose
                onClick={() => setActivePhoto(null)}
                aria-label={isZh ? '关闭图片预览' : 'Close image preview'}
              >
                &times;
              </LightboxClose>
              
              <LightboxContent>
                <LightboxImageContainer>
                  <LightboxImage src={activePhoto.src} alt={activePhoto.alt} />
                </LightboxImageContainer>
                <LightboxMeta>
                  <LightboxCaptionTitle>{activePhoto.caption}</LightboxCaptionTitle>
                  <LightboxText>{activePhoto.detail}</LightboxText>
                </LightboxMeta>
              </LightboxContent>
            </LightboxPanel>
          </LightboxOverlay>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default HaihaiPage;

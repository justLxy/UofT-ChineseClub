import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getFullEventImageUrl } from '../../utils/api';
import SEO from '../../components/SEO';
import EventHero from '../../components/EventHero';

const heroImg = getFullEventImageUrl('/uploads/events/QinSocietyOpenCeremony.png');

// Member Card styles
const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  margin: 1rem;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;
  transition: box-shadow 0.3s;
  &:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  }
`;

const AvatarWrapper = styled.div`
  width: 100%;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: #f5f5f5;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const Avatar = styled.img`
  width: 100%;
  max-width: 400px;
  height: 220px;
  object-fit: cover;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  transition: transform 0.4s cubic-bezier(.23,1.01,.32,1);
  ${Card}:hover & {
    transform: scale(1.08) translateY(-8px);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  width: 100%;
  min-height: 80px;
`;

const MemberName = styled.h3`
  margin: 0.5rem 0 0.2rem 0;
  min-height: 1.5rem;
`;

const Performance = styled.p`
  color: #888;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1rem;
`;

// QinSociety section styles
const SectionWrapper = styled.section`
  background: var(--background);
  background-size: cover;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #000;
  box-shadow: 10px 10px 150px 70px rgba(239, 245, 238) inset;
  object-fit: contain;
  text-align: center;
`;

const InfoBlock = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 7rem auto;
  display: flex;
  align-items: stretch;
  background: var(--background);
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  padding: 0;
  gap: 0;
  overflow: hidden;
`;

const InfoImage = styled.img`
  flex: 1 1 50%;
  width: 50%;
  min-width: 0;
  min-height: 100%;
  height: auto;
  border-radius: 14px 0 0 14px;
  object-fit: cover;
  display: block;
`;

const InfoText = styled.div`
  flex: 1 1 50%;
  width: 50%;
  min-width: 0;
  color: #333;
  font-size: 1.2rem;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2.5rem 2.5rem;
  background: linear-gradient(
    to right,
    rgba(239, 234, 221, 1) 0%,
    rgba(239, 245, 238, 0.85) 60%,
    rgba(239, 245, 238, 1) 100%
  );
  min-height: 100%;
  height: auto;
  word-break: break-word;
  overflow: auto;
`;

const DividerWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background: #f7f5f0;
`;

const Divider = styled.hr`
  width: 10%;
  border: none;
  border-top: 2px solid var(--primary-light);
  border-radius: 2px;
  background: none;
`;

const CardBlock = styled.div`
  width: 100%;
  background: #f7f5f0;
  padding: 2.5rem 0 4rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const CardTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
`;

const VideoBlock = styled.div`
  width: 100%;
  background: #f7f5f0;
  padding: 2.5rem 0 4rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const VideoTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 3rem;
  color: #333;
`;

const VideoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  object-fit: cover;
  width: 100%;
  max-width: 1200px;
`;

const VideoItem = styled.div`
  flex: 1 1 340px;
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const VideoLabel = styled.div`
  margin-top: 1rem;
  font-size: 1.08rem;
  color: #666;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 220px;
  border: none;
  border-radius: 14px;
  background: #000;
`;

const SponsorBlock = styled.div`
  width: 100%;
  background: linear-gradient(180deg, rgba(239, 245, 238) 60%, #f8f8f8 100%);
  padding: 4rem 0 4rem 0; 
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const SponsorGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3rem 2.5rem;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 3rem;
`;

const SponsorCard = styled.div`
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 6px 32px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  padding: 2.2rem 2.0rem;
  min-width: 340px;
  max-width: 720px;
  transition: transform 0.25s, box-shadow 0.25s;
  &:hover {
    transform: translateY(-10px) scale(1.04) rotate(-1deg);
    box-shadow: 0 12px 36px rgba(0,0,0,0.13);
  }
`;

const SponsorLogo = styled.img`
  width: 240px;
  height: 140px;
  object-fit: contain;
  border-radius: 16px;
  margin-right: 2rem;
  background: #f7f5f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
`;

const SponsorInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const SponsorName = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 0.7rem;
`;

const SponsorDesc = styled.div`
  font-size: 1.08rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 0.2rem;
  text-align: left;
`;

// Data
const members = [
  {
    avatar: '/images/Qin_Society/IMG_E8122.JPG',
    name: '彭浩轩 Peter',
    description: 'University of Toronto, Masters in Liguisitics',
    performance:'《阳关三叠》，《鸥鹭忘机》'
  },
  {
    avatar: '/images/Qin_Society/IMG_E8157.JPG',
    name: ' 张映雪 Yingxue Zhang',
    description: 'University of Toronto, MSc.,',
    performance:'《梅花三弄》，《渔樵问答》'
  },
  {
    avatar: '/images/Qin_Society/IMG_E8123.JPG',
    name: ' 汪建策 Atom Wang',
    description: ' University of Toronto, PhD,',
    performance: '《流水》，《白雪》，《沧海龙吟》'
  }
];

const videos = [
  {
    src: 'https://www.youtube.com/embed/8HbfgZVLNHM',
    label: '《良宵引》琴箫合奏'
  },
  {
    src: 'https://www.youtube.com/embed/jX3N0-cZy-g',
    label: '《白雪》'
  },
  {
    src: 'https://www.youtube.com/embed/rpaiLMvL6Oc',
    label: '《阳关三叠》《鸥鹭忘机》'
  },
  {
    src: 'https://www.youtube.com/embed/9aHmHaWz32U',
    label: '《梅花三弄》'
  },
  {
    src: 'https://www.youtube.com/embed/MtEBfZdeTIM',
    label: '《流水》'
  }
];

const sponsors = [
  {
    logo: '/images/Qin_Society/jiamu.jpg',
    name: '嘉木茶室',
    adrs: '地址: 8365 Woodbine Ave, Unit 101 Markham, ON',
    phnm: '电话: (647)869-0915'
  }
];

// Member Card Component
const QinSocietyMemberCard = ({ avatar, name, description, performance }) => (
  <Card>
    <AvatarWrapper>
      <Avatar src={avatar} alt={name} />
    </AvatarWrapper>
    <CardContent>
      <MemberName>{name}</MemberName>
      <Description>{description}</Description>
      <Performance>{performance}</Performance>
    </CardContent>
  </Card>
);

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

const QinSocietyPage = () => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === 'zh';

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

  return (
    <PageWrapper>
      <SEO
        title={currentContent.seoTitle}
        description={currentContent.seoDescription}
        url="https://www.utchinese.org/events/qin-society"
      />
      
      <EventHero 
        eventSlug="qin-society"
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

      {/* Integrated QinSocietySection content */}
      <SectionWrapper className="qin-section">
        {/* 第二左右分区板块 */}
        <InfoBlock>
          <InfoImage src="/images/Qin_Society/UTChinese Network event draft 2.png" alt="Qin Society" />
          <InfoText>
            <h2 style={{marginBottom: '1rem'}}>{t('QinSociety.title2')}</h2>
            <p>{t('QinSociety.performers')}</p>
            <p>{t('QinSociety.pieces')}</p>
            <p>{t('QinSociety.pieces2')}</p>
            <p>{t('QinSociety.pieces3')}</p>
          </InfoText>
        </InfoBlock>

        {/* 批量渲染卡片 */}
        <CardBlock>
          <CardTitle>{t('QinSociety.members')}</CardTitle>
          <CardGrid>
            {members.map((m, i) => (
              <QinSocietyMemberCard key={i} {...m} />
            ))}
          </CardGrid>
        </CardBlock>

        <DividerWrapper>
          <Divider />
        </DividerWrapper>

        {/* 视频板块 */}
        <VideoBlock>
          <VideoTitle>{t('QinSociety.videoTitle')}</VideoTitle>
          <VideoGrid>
            {videos.map((video, idx) => (
              <VideoItem key={idx}>
                <StyledIframe
                  src={video.src}
                  title={video.label}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <VideoLabel>{video.label}</VideoLabel>
              </VideoItem>
            ))}
          </VideoGrid>
        </VideoBlock>

        {/* 赞助商板块 */}
        <SponsorBlock className="qin-sponsor-block">
          <SponsorGrid>
            {sponsors.map((s, idx) => (
              <SponsorCard key={idx}>
                <SponsorLogo src={s.logo} alt={s.name} />
                <SponsorInfo>
                  <SponsorName>{s.name}</SponsorName>
                  <SponsorDesc>{s.adrs}</SponsorDesc>
                  <SponsorDesc>{s.phnm}</SponsorDesc>
                </SponsorInfo>
              </SponsorCard>
            ))}
          </SponsorGrid>
        </SponsorBlock>
      </SectionWrapper>
    </PageWrapper>
  );
};

export default QinSocietyPage;

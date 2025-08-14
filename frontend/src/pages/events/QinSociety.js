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
  border-radius: 20px;
  box-shadow: 0 6px 32px rgba(0,0,0,0.1);
  margin: 1rem;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;
  position: relative;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: 1px solid rgba(231, 76, 60, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--primary-light));
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    border-color: var(--primary-light);
    
    &::before {
      transform: scaleX(1);
    }
  }
`;

const AvatarWrapper = styled.div`
  width: 100%;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: #f8f9fa;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const Avatar = styled.img`
  width: 100%;
  max-width: 400px;
  height: 220px;
  object-fit: cover;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.3s ease;
  filter: brightness(0.95) saturate(0.9);
  
  ${Card}:hover & {
    transform: scale(1.05) translateY(-4px);
    filter: brightness(1) saturate(1);
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
  background: #fff;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #000;
  padding: 2rem 0;
  text-align: center;
`;

const DividerWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background: #f8f9fa;
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
  background: #f8f9fa;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0;
  margin-bottom: 2rem;
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
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0;
  margin-bottom: 2rem;
  border-top: 1px solid rgba(231, 76, 60, 0.1);
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
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: 1px solid rgba(231, 76, 60, 0.1);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.12);
    border-color: var(--primary-light);
  }
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
  border-radius: 16px;
  background: #000;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
`;

const SponsorBlock = styled.div`
  width: 100%;
  background: #fff;
  padding: 5rem 2rem; 
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border-top: 1px solid #e9ecef;
`;

const SponsorTitle = styled.h2`
  font-size: 2.2rem;
  color: #2c2c2c;
  margin-bottom: 1rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const SponsorSubtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  text-align: center;
  margin-bottom: 4rem;
  max-width: 600px;
`;

const SponsorGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  max-width: 700px;
`;

const SponsorCard = styled.div`
  background: linear-gradient(135deg, #fff 0%, #fefefe 100%);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  padding: 2rem;
  width: 100%;
  max-width: 1000px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(231, 76, 60, 0.08);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), #ff6b47, var(--primary));
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(231, 76, 60, 0.15);
    border-color: var(--primary-light);
    
    &::before {
      transform: scaleX(1);
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
`;

const SponsorLogo = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 12px;
  margin-right: 1.5rem;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  padding: 1rem;
  border: 1px solid rgba(231, 76, 60, 0.1);
  transition: transform 0.3s ease;
  
  ${SponsorCard}:hover & {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1rem;
    width: 100px;
    height: 100px;
  }
`;

const SponsorInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const SponsorName = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: #2c2c2c;
  margin-bottom: 0.5rem;
  letter-spacing: -0.3px;
`;

const SponsorDetailItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: #555;
  
  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const SponsorIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-right: 0.5rem;
  color: var(--primary);
  font-size: 0.9rem;
`;

const SponsorText = styled.span`
  color: #666;
  line-height: 1.4;
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
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh';

  const defaultContent = {
    en: {
      title: 'Qin Society',
      seoTitle: 'Qin Society | UTChinese Network',
      seoDescription: 'Experience the elegance of the Guqin with UTChinese Network Qin Society.',
      paragraphs: [
        'UTChinese Network Qin Society is dedicated to reviving the timeless art of the Guqin on campus. From the solemn melodies of ancient dynasties to contemporary interpretations, we provide a platform for both aficionados and newcomers to appreciate, learn, and perform.',
        'Our open ceremony marked the beginning of a new cultural journey at the University of Toronto. Distinguished performers presented classics such as "Guangling San" and "Ai Nai", enchanting the audience with the serene resonance of seven strings. Attendees also enjoyed hands-on sessions, exploring finger techniques and posture under the guidance of experienced mentors.',
        'Looking ahead, Qin Society will host seasonal outdoor gatherings, lecture-recitals, and collaborative concerts with other musical ensembles. Whether you are an absolute beginner or a seasoned qin player, we welcome you to join us and immerse yourself in this poetic soundscape.',
        'Our Performers: Yingxue Zhang, Peters Peng, and Atom Wang. Pieces Performed in Chronological Order: "A Good Time"(Qin(Atom) Xiao(Yingxue)Duet), "Farewell at Yangguan Customs"(Peters), "Herons and Intentions"(Peters), "Flowing Streams"(Atom), "Mei Blossoms"(Yingxue), "Winter Snow"(Atom), "Fishing and Woodcutting - a Reflective Dialogue"(Yingxue), "Dragon Chant from Deep Sea"(Atom). Tea: Aged (10 years) Pu-erh.',
        'The event started with a brief introduction about the instrument: Qin, followed by a tea break then music performance. It was a truly fun event! Unfortunately, it wasn\'t snowing after the song "Winter Snow" was played. The weather forecast was incorrect. Special thanks to Peters and Leslie for videos and photos, Jason for helping to setup, and Jessica and Amora for their marketing guidance, and of course, you for showing up.',
        'Shout out to Jiamu Tea Space for sponsoring biodegradable tea cups for our tea!'
      ]
    },
    zh: {
      title: '多大中文琴社',
      seoTitle: '多大中文琴社 | UTChinese Network',
      seoDescription: '与多大中文古琴社一起感受古琴的优雅魅力。',
      paragraphs: [
        '多大中文古琴社致力于在校园内复兴古琴这一永恒的艺术。从古代王朝的庄严旋律到当代诠释，我们为琴友和新手提供一个欣赏、学习和演奏的平台。',
        '我们的开幕典礼标志着多伦多大学新文化之旅的开始。杰出的演奏者呈现了《广陵散》和《欸乃》等经典曲目，用七弦的宁静共鸣打动观众。参与者还享受了亲身体验，在经验丰富的导师指导下探索指法和姿态。',
        '展望未来，琴社将举办季节性户外雅集、讲座音乐会以及与其他音乐团体的合作音乐会。无论您是绝对的初学者还是经验丰富的琴者，我们都欢迎您加入我们，沉浸在这诗意的音景中。',
        '我们的表演者：张映雪 (Yingxue Zhang)，彭浩轩(Peters) 和 汪建策 (Atom)。演奏曲目按时间顺序：《良宵引》(琴 (Atom)箫(Yingxue)二重奏)、《阳关三叠》(Peters)、《鹤汀凫渚》(Peters)、《流水》(Atom)、《梅花三弄》(Yingxue)、《冬雪》(Atom)、《渔樵问答》(Yingxue)、《龙吟水深》(Atom)。茶为陈皮(10年)普洱。',
        '本次雅集开始先向大家介绍了古琴的相关有趣的小知识。在享用茶水之后，本次雅集以一首琴箫合奏的《良宵引》正式开始，又在《沧海龙吟》的龙吟阵阵中结束。幸甚至哉，歌以咏志！如果真有什么遗憾的话，就是弹完《白雪》之后，没有下雪吧。感谢浩轩和Leslie提供照片和视频还有Jason帮忙setup，以及幕后的Jessica和Amora，还有到场的诸位。',
        '特别鸣谢嘉木茶室提供的环保功夫茶杯！'
      ]
    }
  };

  // All page translations
  const pageTranslations = {
    en: {
      members: 'Qin Society Performers',
      videoTitle: 'Qin Society Event Videos',
      sponsorTitle: 'Partners',
      sponsorSubtitle: 'Thank you to the following partners for their generous support of the Qin Society Opening Ceremony'
    },
    zh: {
      members: '古琴会表演者',
      videoTitle: '古琴会活动视频',
      sponsorTitle: '合作伙伴',
      sponsorSubtitle: '感谢以下合作伙伴对古琴会开社雅集的大力支持'
    }
  };

  const currentContent = isZh ? defaultContent.zh : defaultContent.en;
  const t = isZh ? pageTranslations.zh : pageTranslations.en;

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


        {/* 批量渲染卡片 */}
        <CardBlock>
          <CardTitle>{t.members}</CardTitle>
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
          <VideoTitle>{t.videoTitle}</VideoTitle>
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
          <SponsorTitle>{t.sponsorTitle}</SponsorTitle>
          <SponsorSubtitle>{t.sponsorSubtitle}</SponsorSubtitle>
          <SponsorGrid>
            {sponsors.map((s, idx) => (
              <SponsorCard key={idx}>
                <SponsorLogo src={s.logo} alt={s.name} />
                <SponsorInfo>
                  <SponsorName>{s.name}</SponsorName>
                  <SponsorDetailItem>
                    <SponsorIcon>📍</SponsorIcon>
                    <SponsorText>{s.adrs}</SponsorText>
                  </SponsorDetailItem>
                  <SponsorDetailItem>
                    <SponsorIcon>📞</SponsorIcon>
                    <SponsorText>{s.phnm}</SponsorText>
                  </SponsorDetailItem>
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

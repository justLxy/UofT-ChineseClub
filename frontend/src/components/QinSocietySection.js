import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import QinSocietyMemberCard from './QinSocietyMemberCard';


const SectionWrapper = styled.section`
  background: rgba(239, 234, 221);
  // background: linear-gradient(180deg, rgba(239, 234, 221) 60%, rgba(248, 248, 248) 100%)
  background-size: cover;
  min-height: 100vh;
  width: 100%;
  display:flex;
  flex-direction: column;
  align-items: center;
  color: #000;
  box-shadow: 10px 10px 150px 70px rgba(239, 245, 238) inset;
  object-fit: contain;
  text-align: center;

  h1 {
    margin-bottom: 6rem;
    margin-top: 4rem;
  }

  p {
    font-size: 1.3rem;
    max-width: 800px;
    line-height: 1.6;
  }
`;

// 分隔线和板块
const IntroBlock = styled.div`
  padding: 5rem 2rem 10rem 2rem;
  max-width: 900px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  h1 {
    margin-bottom: 2rem;
    margin-top: 0.5rem;
  }
  p {
    font-size: 1.2rem;
    max-width: 800px;
    line-height: 1.6;
    margin-top: 2rem;
    margin-bottom: 4rem;
  }
`;

// 第二分区
const InfoBlock = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 3rem auto;
  display: flex;
  align-items: stretch;
  background: rgba(239, 234, 221);
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
  height: 100%;
  border-radius: 14px 0 0 14px;
  object-fit: cover;
  display: block;
`;

const InfoText = styled.div`
  flex: 1 1 50%;
  width: 50%;
  min-width: 0;
  color: #333;
  font-size: 1.0rem;
  line-height: 1.8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2.5rem 1.0rem;
  background: linear-gradient(
    to right,
    rgba(239, 234, 221, 1) 0%,
    rgba(239, 245, 238, 0.85) 60%,
    rgba(239, 245, 238, 1) 100%
  );
`;

// 分隔线
const Divider = styled.hr`
  width: 60%;
  border: none;
  border-top: 2px solid #d6cfc2;
  margin: 2.5rem 0 0.5rem 0;
  border-radius: 2px;
`;

// 成员卡片分隔线和卡片板块
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
  // margin-top: 2rem;
`;

const CardTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
`;

// 卡片信息创建
const members = [
  {
    avatar: '/images/Qin_Society/IMG_E8122.JPG', // 确保图片放在 public/images/Qin_Society/ 目录下
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
  },
  // ...添加更多成员
];

// 视频卡片创建
const VideoBlock = styled.div`
  width: 100%;
  background: #f3efe7;
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

// 添加视频数据
// 视频嵌入链接需按照此格式：https://www.youtube.com/embed/视频ID
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
  },
  // ...可继续添加
];

// sponsored by UTChinese Network
const SponsorBlock = styled.div`
  width: 100%;
  background: linear-gradient(180deg, rgba(239, 245, 238) 60%, #f8f8f8 100%);
  // background: #f3efe7;
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

// 赞助商数据
const sponsors = [
  {
    logo: '/images/Qin_Society/jiamu.jpg',
    name: '嘉木茶室',
    adrs: '地址: 8365 Woodbine Ave, Unit 101 Markham, ON',
    phnm: '电话: (647)869-0915'
  },

  // 可继续添加更多赞助商
];


const QinSocietySection = () => {
  const { t } = useTranslation();

  return (
    <SectionWrapper className="qin-section">
      <IntroBlock>
      <h1>{t('QinSociety.title')}</h1>
      <p>{t('QinSociety.description')}</p>
      </IntroBlock>

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

      <Divider />
       {/* 批量渲染卡片 */}
      <CardBlock>
        <CardTitle>{t('QinSociety.members')}</CardTitle>
      <CardGrid>
        {members.map((m, i) => (
          <QinSocietyMemberCard key={i} {...m} />
        ))}
      </CardGrid>
      </CardBlock>
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
        {/* <SponsorTitle>鸣谢赞助 / Sponsors</SponsorTitle> */}
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
  );

};


export default QinSocietySection;
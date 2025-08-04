import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Modal, { pastEvents, ModalPoster, ModalDesc, ModalHot, ModalTitle } from './NYCModal';
import PhotoGallery from './NYCPhotogallery';

const PageWrapper = styled.div`
  background: #f8f6f2;
  min-height: 100vh;
`;

// 第一板块和标题
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

//// 有需要可以添加内容在标题板块
// const ContentSection = styled.section`
//   max-width: 900px;
//   margin: 0 auto;
//   background: #fff;
//   border-radius: 18px;
//   box-shadow: 0 4px 24px rgba(0,0,0,0.07);
//   padding: 3rem 2rem;
//   margin-top: -3rem;
//   position: relative;
//   z-index: 2;
// `;

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

const ConcertImage = styled.img`
  width: 100%;
  max-width: 700px;
  border-radius: 12px;
  margin: 2rem auto;
  display: block;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
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

const StyledButton = styled(Link)`
  display: inline-block;
  background: #e9b97b;
  color: #fff;
  font-weight: 600;
  padding: 0.9rem 2.2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  margin-top: 1.5rem;
  text-decoration: none;
  transition: background 0.2s;
  &:hover {
    background: #d89a4c;
  }
`;

// 新音乐会活动信息板块
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
  background: #e9b97b;
  color: #fff;
  font-weight: 600;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-size: 1.08rem;
  margin: 1.2rem 0;
  text-decoration: none;
  transition: background 0.2s;
  &:hover {
    background: #d89a4c;
  }
`;

//活动介绍和引言板块
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
  padding:3.5rem 0;
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

// 往期活动板块和卡片
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
    color:rgb(220, 26, 26);
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

const NYConcertSection = () => {
  const { t } = useTranslation();
  const [modalEvent, setModalEvent] = useState(null);

  return (
    <PageWrapper>
      <HeroSection>
        <HeroTitle>{t('NYConcert.title')}</HeroTitle>
        <HeroSubtitle>{t('NYConcert.description')}</HeroSubtitle>
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
        <IntroTitle>{t('NYConcert.Introtitle')}</IntroTitle>
        <IntroLine />
        <IntroText>{t('NYConcert.Introtext')}</IntroText>
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

      {/* 往期活动卡片弹窗，在NYCModal.js里可继续添加 */}
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

      {/* 音乐会照片画廊, 在NYCPhotogallery.js可修改 */}
      <PhotoGallery />


      {/* 旧的events highlight板块，可以启用，暂时注释掉 */}
      {/* <ContentSection>
        <ConcertImage src="/images/2024NYConcert/poster2.jpg" alt="New Year Concert Poster" />
        <SectionTitle>Event Highlights</SectionTitle>
        <SectionText>
          The UTChinese New Year Concert is an annual tradition that brings together students, alumni, and friends to enjoy a night of music and cultural performances. Experience the beauty of Chinese music and celebrate the Spring Festival with us!
        </SectionText>
        <InfoList>
          <li><strong>Date:</strong> February 10, 2024</li>
          <li><strong>Time:</strong> 7:00 PM - 9:30 PM</li>
          <li><strong>Location:</strong> Isabel Bader Theatre, 93 Charles St W, Toronto</li>
          <li><strong>Performances:</strong> Chinese orchestra, choir, dance, and more</li>
          <li><strong>Tickets:</strong> Free for UofT students (registration required)</li>
        </InfoList>
        <SectionTitle>How to Join</SectionTitle>
        <SectionText>
          Reserve your seat by registering online. All are welcome! For more details, visit our official WeChat or contact us at utchinese.network@studentorg.utoronto.ca.
        </SectionText>
        <StyledButton to="/join">Register Now</StyledButton>
      </ContentSection> */}
    </PageWrapper>
  );
}

export default NYConcertSection;
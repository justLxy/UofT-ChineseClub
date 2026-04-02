import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO';
import EventHero from '../../components/EventHero';
import { getFullEventImageUrl } from '../../utils/api';

const heroImg = getFullEventImageUrl('/uploads/events/reading.png');

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

const TimelineSection = styled.section`
  padding: 6rem 2rem;
  background: var(--background-alt);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  
  [data-theme='dark'] & {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const TimelineInner = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const TimelineTitle = styled(motion.h2)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 4rem;
  color: var(--text);
  text-align: center;
`;

const EventBlock = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-bottom: 6rem;
  
  &:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 768px) {
    grid-template-columns: ${props => props.$reverse ? '1.2fr 1fr' : '1fr 1.2fr'};
    align-items: center;
  }
`;

const EventImageWrapper = styled.div`
  order: ${props => props.$reverse ? 2 : 1};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.02);
  position: relative;
  aspect-ratio: 3/4;
  
  [data-theme='dark'] & {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.02);
  }

  @media (max-width: 767px) {
    order: 1;
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const EventContent = styled.div`
  order: ${props => props.$reverse ? 1 : 2};
  
  @media (max-width: 767px) {
    order: 2;
  }
`;

const EventYear = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 1rem;
  letter-spacing: 0.1em;
`;

const EventTitle = styled.h3`
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 1.5rem;
  color: var(--text);
`;

const EventText = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-light);
  
  p {
    margin: 0 0 1.5rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const ReadingClubPage = () => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh';

  const content = {
    en: {
      title: 'Reading Club',
      seoTitle: 'Reading Club | UTChinese Network',
      seoDescription: 'Join the UTChinese Network Reading Club to explore literature, share stories, and connect with like-minded friends.',
      slogan: 'Read freely, connect deeply.',
      introText: 'A reading club is like a slow and sincere encounter. Through books, we walk into different cities, eras, and destinies, and in other people\'s stories, we re-understand the human heart, the world, and ourselves. Sometimes we follow suspense and fog to seek the truth, sometimes we gaze at the echoes of the times amidst the lights of old cities and the gathering and parting of crowds; sometimes we also extend reading into a more vivid experience amidst festivals, nights, and imagination. For us, a reading club is not just about "finishing a book", it is more like a journey deep into the text together—exchanging feelings in listening and sharing, discovering new possibilities in discussion and thinking, and letting the stories that originally stayed quietly on the pages slowly grow their own warmth. We hope every gathering can become a brief but real pause: letting reading happen not only in the moments of turning pages alone, but also in the moments of people meeting. May everyone who comes here bring their own feelings and leave with new touches; see the world in stories, see others in communication, and hear the clearer echoes of their own hearts between the lines.',
      timelineTitle: 'Past Events',
      events: [
        {
          year: '2026',
          title: 'Lantern Festival Special',
          image: '/images/reading/lantern.png',
          paragraphs: [
            'This is perhaps one of the rare days in traditional Chinese festivals that is so "outward-looking". New Year\'s Eve is inward-looking, with family reunions and staying behind closed doors; while the Lantern Festival is outward-looking, walking through streets and alleys, brightly lit. People walk out of their homes and merge into the lights.',
            'The steaming tangyuan, the lantern riddles hidden between the lines, the true and false turtle soup that makes people unable to stop, amidst the lights and laughter, the meaning of the festival gradually becomes vivid. We want to use such a night to gently put reunion, curiosity, and fun together, so everyone can get closer to each other in guessing and listening, discover a little new surprise in familiar traditions, and let everyone who comes here take away a little warmth from the lights.',
            'A bowl of tangyuan, a lantern, a night of endless fun.'
          ]
        },
        {
          year: '2024.10',
          title: 'Sleepless Night - Halloween Special',
          image: '/images/reading/halloween.jpg',
          paragraphs: [
            'The Halloween bell has struck at this moment, please listen carefully to its warm invitation. As someone who has been summoned, I believe you are ready to enter the unknown world. Why are you here? You should find the answer yourself, I believe you are ready at this moment. Then please bring some dusty memories and explore the unknown secrets.',
            'In this night that refuses to sleep, the boundary between reality and fiction will become blurred, silence, gaze, footsteps, and whispers may all become part of the story. We welcome you to transform into a character from suspense, horror, or thriller genres, and we also welcome you to weave new origins and secrets for yourself outside the existing characters. Perhaps behind every mask hides another identity, every appearance is like the beginning of a story, and what is truly fascinating is never just the character itself, but how you will tell that "belonging to yourself" night.'
          ]
        },
        {
          year: '2024.04',
          title: 'Tracing the Fog',
          image: '/images/reading/mystery.jpg',
          paragraphs: [
            'For cases that wander in the gray area of law and morality, do individuals have the power to judge? The knight dueling with the devil, at the moment of defeating the devil, stained with the devil\'s blood, also becomes a devil. When you gaze into the abyss, the abyss also gazes into you.',
            'Tracing the fog, what we seek is never just the answer.',
            'Some truths hide behind the calm, some secrets lurk in the most ordinary daily life. The sea fog on the isolated island, the silence in the long night, the undercurrent under the prosperity, the probing and deception between the spy shadow and the chessboard, seemingly separated from each other, but all lead to the same deep place—the human heart.',
            'The reason why suspense is moving is perhaps not just the revelation of the riddle, but after the fog dissipates, we finally see how desire, fear, love, betrayal, and obsession entangle with each other, see how people struggle and sink in the gap between good and evil and destiny, and how they try to find an answer for themselves. Those buried pasts, unspeakable motives, seemingly accidental but long-foreshadowed encounters and deaths, eventually turn into echoes, lingering long after reading.'
          ]
        },
        {
          year: '2024.03',
          title: 'A City, A Group of People',
          image: '/images/reading/one-city.jpg',
          paragraphs: [
            'A city is a scenery, and also a destiny; a group of people are passers-by, and also footnotes of the times.',
            'From Shanghai in "Blossoms", to Taipei in "Taipei People", to the western village written in "Red Poppies", what we read is not only the appearance of different cities, but also people\'s choices, encounters, and partings in the torrent of the times. The city carries memories, people write stories, and the stories eventually become part of the city.',
            'What kind of stories the changes of the times bring us, what kind of enlightenment the transformation of human nature gives us, where are the fragrance and color today, empty branches facing the evening wind.'
          ]
        },
        {
          year: '2023',
          title: 'Please Enter the Bookstore - Valentine\'s Day Special',
          image: '/images/reading/valentine.jpg',
          paragraphs: [
            'Everyone is born with their own unique scent, and we follow the scent to find like-minded people. In the vast crowd, brushing past hundreds of people every day, pedestrians are submerged in the reinforced concrete jungle, hard to trace.',
            'The winter in this city is long, like a railway with no end in sight. We are the trains running on it. Travel-worn people bury their heads in sleep, people holding books plunge into other people\'s stories.',
            'Fortunately, there are still books. Books will find people with similar scents.',
            'Three days, three sessions, we carefully selected different book lists for different themes. Using books as a medium, looking forward to this unexpected encounter with you, with them, and with us.',
            '"Hi, so you are here too."'
          ]
        },
        {
          year: '2022',
          title: 'City',
          image: '/images/reading/city.jpg',
          paragraphs: [
            'We walk in the winter of a foreign land, enjoying and remembering, the cities of hometown, cities of longing, cities of romance, cities of fantasy, and cities of reality in our hearts overlap... We meet, resonate, and then know that we are not alone. All thoughts and imaginations were lit up that night, carrying the thoughts of every heart, exploring the boundless ocean of life and existence, the brilliant starry sky.',
            '【City】 can be starry sky and silver waves, or it can be thousands of lights and all kinds of life.',
            '【City】 is the integration of culture and culture, and the origin that makes us who we are.',
            '【City】 witnesses the passing of years, the long time, and the rushing of years.',
            'One city, one elegance, one book, one world, nice to meet you on this journey.'
          ]
        }
      ]
    },
    zh: {
      title: '任意东西读书会',
      seoTitle: '任意东西读书会 | UTChinese Network',
      seoDescription: '加入多大中文任意东西读书会，以书会友，以文暖心，在阅读中遇见世界与自己。',
      slogan: '任意东西，无问西东。以书会友，以文暖心。',
      introText: '读书会，像是一场缓慢而真诚的相遇。我们借由一本本书走进不同的城市、时代与命运，也在别人的故事里，重新理解人心、世界与自己。有时我们沿着悬疑与迷雾追寻真相，有时在旧城灯火与人群聚散中凝望时代的回声；有时我们也在节日、夜色与想象之中，把阅读延伸成一次更鲜活的体验。对我们而言，读书会并不只是关于“读完一本书”，它更像是一次共同进入文字深处的旅程——在倾听与分享中交换感受，在讨论与思考中发现新的可能，也让原本安静停留在纸页上的故事，慢慢长出属于彼此的温度。我们希望每一次相聚，都能成为一次短暂却真切的停留：让阅读不只发生在独自翻页的时刻，也发生在人与人相遇的瞬间。愿每一个来到这里的人，都能带着自己的感受而来，也带着新的触动离开；在故事之中看见世界，在交流之中看见他人，也在字里行间，听见自己内心更清晰的回响。',
      timelineTitle: '往期活动',
      events: [
        {
          year: '2026',
          title: '《华灯初上》元宵节特别企划',
          image: '/images/reading/lantern.png',
          paragraphs: [
            '这或许是中国传统节日里，少有的如此"出走"的一天。除夕是向内的，阖家团圆，闭门守岁；而元宵是向外的，走街串巷，灯火通明。人们走出家门，汇入灯火之中。',
            '热气氤氲的汤圆、藏在字句之间的灯谜、真假难辨又令人欲罢不能的海龟汤，在一盏盏灯火与一声声笑语之间，节日的意味也渐渐变得鲜活起来。我们想借这样一个夜晚，把团圆、好奇与趣味轻轻放在一起，让每个人都能在猜谜与倾听中靠近彼此，在熟悉的传统里，也发现一点新的惊喜，也让每一个来到这里的人，都能带走一点灯火里的暖意。',
            '一碗汤圆，一盏灯火，一夜未尽的趣味。'
          ]
        },
        {
          year: '2024.10',
          title: '《不眠之夜》万圣节特别企划',
          image: '/images/reading/halloween.jpg',
          paragraphs: [
            '万圣节的钟声已在此刻敲响，请仔细聆听它的盛情邀请。作为受到召唤的人，相信你已经准备好进入未知的世界。为什么来到这里？这应该由您自己找答案，我相信您此刻已经准备好了。那么就请带着些尘封的记忆，探寻不为人知的秘密吧。',
            '在这场不肯入睡的夜里，现实与虚构的边界会变得模糊，沉默、注视、脚步与低语都可能成为故事的一部分。我们欢迎您化身为某一位来自悬疑、恐怖或惊悚题材中的人物，也欢迎您在既有角色之外，为自己编织新的来历与秘密。或许每一张面具背后都藏着另一重身份，每一次亮相都像是一段故事的开端，而真正令人着迷的，从来不只是角色本身，而是你将如何讲述那个“属于自己”的夜晚。'
          ]
        },
        {
          year: '2024.04',
          title: '《迷雾寻踪》',
          image: '/images/reading/mystery.jpg',
          paragraphs: [
            '对于游离于法律和道德灰色地带的案件，个人有没有审判的权力？与恶魔决斗的骑士，在击败恶魔的瞬间，身染恶魔之血的自己，也成为了恶魔。当你在凝视深渊时，深渊也在凝视你。',
            '迷雾寻踪，寻的从来不只是答案。',
            '有些真相藏在风平浪静之后，有些秘密潜伏于最寻常的日常之中。孤岛上的海雾、长夜里的沉默、盛世繁华下的暗流、谍影与棋局之间的试探与欺瞒，看似彼此分离，却都通向同一个幽深之处——人心。',
            '悬疑之所以动人，也许并不只在于谜底的揭晓，而在于迷雾散去之后，我们终于看见欲望、恐惧、爱、背叛与执念如何彼此缠绕，看见人在善恶与命运的缝隙之间如何挣扎、沉沦，又如何试图为自己寻找一个答案。那些被掩埋的往事、无法言说的动机、看似偶然却早有伏笔的相遇与死亡，最终都化作回响，久久停留在阅读之后。'
          ]
        },
        {
          year: '2024.03',
          title: '《一座城，一群人》',
          image: '/images/reading/one-city.jpg',
          paragraphs: [
            '一座城，是风景，也是命运；一群人，是过客，也是时代的注脚。',
            '从《繁花》里的上海，到《台北人》中的台北，再到《尘埃落定》书写的西部村庄，我们读见的不只是不同城市的面貌，更是人在时代洪流中的选择、相逢与离别。城承载记忆，人书写故事，而故事最后也成了城市的一部分。',
            '时代的变化带给我们什么样的故事，人性的变换给我们什么样的启示，香色今何在，空枝对晚风。'
          ]
        },
        {
          year: '2023',
          title: '《请进书店 X 任意东西读书会》情人节特别企划',
          image: '/images/reading/valentine.jpg',
          paragraphs: [
            '每个人生来都会有自己独特的气味，我们循着气味，寻找志同道合的人。茫茫人海，每天与上百人擦肩而过，行人淹没在钢筋丛林之中，踪迹难寻。',
            '这座城市的冬天冗长，像是一条看不到尽头的铁轨。我们是行驶其上的火车。风尘仆仆的人埋头睡觉，捧着书的人一头栽进别人的故事里。',
            '幸好还有书在。书，会找到气味相投的人。',
            '【有情人】，【少年之心】，【新世界】，三天三场，我们为不同的主题精心挑选了不一样的书单。以书为媒介，期待与你与TA与我们的，这一场不期而遇。',
            '“嗨，原来你也在这里。”'
          ]
        },
        {
          year: '2022',
          title: '《城》',
          image: '/images/reading/city.jpg',
          paragraphs: [
            '我们行走在异乡的冬季中，畅享着回忆着，心中的一座座故乡之城、思念之城、浪漫之城、幻想之城、现实之城叠重而至……我们相遇，共鸣而后知道自己并不孤单。所有的想法和脑洞在那晚被点亮，带着每一颗心的思绪，探寻生活和生命的无边海洋，灿烂星空。',
            '【城】可以是繁星碧空和银涛雪浪，也可以是万户灯火和百态人生。',
            '【城】是文化与文化的交融之处，是使我们成为我们的起源。',
            '【城】见证着年年流转、时光悠悠、岁月奔流。',
            '一城一风华，一书一世界，很高兴在这趟旅程中遇到你。'
          ]
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
        url="https://www.utchinese.org/events/reading-club"
      />

      <EventHero
        eventSlug="reading-club"
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

      <TimelineSection>
        <TimelineInner>
          <TimelineTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {currentContent.timelineTitle}
          </TimelineTitle>
          
          {currentContent.events.map((event, index) => (
            <EventBlock 
              key={event.title}
              $reverse={index % 2 !== 0}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <EventImageWrapper>
                <EventImage 
                  src={event.image} 
                  alt={event.title} 
                  loading="lazy" 
                />
              </EventImageWrapper>
              
              <EventContent $reverse={index % 2 !== 0}>
                <EventYear>{event.year}</EventYear>
                <EventTitle>{event.title}</EventTitle>
                <EventText>
                  {event.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </EventText>
              </EventContent>
            </EventBlock>
          ))}
        </TimelineInner>
      </TimelineSection>
    </PageWrapper>
  );
};

export default ReadingClubPage;

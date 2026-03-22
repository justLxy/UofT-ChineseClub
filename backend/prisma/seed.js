const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('开始数据库种子数据填充...');

    // Create or update admin account
    const adminPassword = await bcrypt.hash('123', 10);
    const admin = await prisma.staff.upsert({
      where: { username: 'xuanyi.lyu' },
      update: {
        // 更新时只更新必要的系统字段，保留用户的个人数据
        role: 'admin',
        canManageEvents: true,
        canReviewProfiles: true,
        canManageStaff: true,
        isActive: true
      },
      create: {
        username: 'xuanyi.lyu',
        email: 'xuanyi.lyu@mail.utoronto.ca',
        passwordHash: adminPassword,
        role: 'admin',
        canManageEvents: true,
        canReviewProfiles: true,
        canManageStaff: true,
        isActive: true
      }
    });

    // Create or update admin staff profile
    const existingProfile = await prisma.staffProfile.findUnique({
      where: { staffId: admin.id }
    });

    if (!existingProfile) {
      // 只在不存在时创建新的个人资料
      await prisma.staffProfile.create({
        data: {
          staffId: admin.id,
          name_en: 'Xuanyi Lyu',
          name_zh: '吕宣谊',
          position_en: 'Information Solution Director',
          position_zh: '信息解决方案部负责人',
          department: 'OPERATION GROUP',
          bio_en: 'I am currently pursuing a double major in Computer Science and Statistics at the University of Toronto, with a minor in Economics. My areas of interest include Human-Computer Interaction, Artificial Intelligence, and Machine Learning. I enjoy creating solutions that combine technical excellence with user-centered design. I am committed to academic exploration and technological innovation, hoping to make meaningful contributions to society through my work in computer science and data analysis.',
          bio_zh: '我目前在多伦多大学攻读计算机科学与统计学双专业，辅修经济学。我的兴趣领域包括人机交互、人工智能和机器学习。我喜欢创造结合技术卓越和以用户为中心设计的解决方案。我致力于学术探索和技术创新，希望通过我在计算机科学和数据分析方面的工作为社会做出有意义的贡献。',
          avatarUrl: '/uploads/staff/xuanyilyu.jpg',
          email: 'xuanyi.lyu@mail.utoronto.ca',
          github: 'https://github.com/justLxy',
          linkedin: 'https://linkedin.com/in/xuanyi-lyu',
          wechat: 'yukiyah',
          mbti: 'INFJ-T',
          status: 'approved',
          isVisible: true,
          displayOrder: 1
        }
      });
      console.log('Admin profile created with initial data');
    } else {
      // 如果已存在，只更新必要的系统字段，完全保留用户数据
      await prisma.staffProfile.update({
        where: { staffId: admin.id },
        data: {
          status: 'approved',
          isVisible: true
        }
      });
      console.log('Admin profile exists, preserved user data and updated system fields only');
    }

    console.log('Admin account created/updated successfully');



    // Helper function to calculate event status
    const calculateEventStatus = (startDate, endDate) => {
      const now = new Date();
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : null;
      
      if (end && now > end) {
        return 'past';
      } else if (start > now) {
        return 'upcoming';
      } else {
        return 'ongoing';
      }
    };

    // Add seed events with bilingual content - 只在不存在时才创建
    const events = [
      {
        title_en: 'UNIC Case Competition',
        title_zh: 'UNIC案例分析大赛',
        description_en: 'Case Competition is a vague concept for a team that initially had only four people. We weren\'t fully confident, had no faculty support or resources, and no experience hosting similar events. All we had were hearts determined to make this event happen and succeed.',
        description_zh: 'Case Competition 对于一开始只有四个人的团队来说，是个很缥缈的概念。我们没有十足的把握，也没有任何faculty 的支持或资源，更没有任何主办类似活动的经验。我们所有的只是几颗强烈想把这样一个活动办成、办大的赤子之心。',
        imageUrl: '/uploads/events/UNICCaseCompetition.jpg',
        startDate: new Date('2023-11-15'),
        endDate: new Date('2023-11-20'),
        location_en: 'Room 534, 21 Sussex Ave, Toronto',
        location_zh: '多伦多萨塞克斯大道21号534室',
        featured: false,
      },
      {
        title_en: 'Ace Career Fair',
        title_zh: 'Ace招聘会',
        description_en: 'Since 2015, the UofT Chinese Ace Career Fair has connected students with real career opportunities through a focused, student-first platform that remains free to attend. Join us on March 11 at Hart House Debates Room for info sessions, networking, and one-on-one coffee chat opportunities with employers including Sun Life, Vision Sprint Consulting Group, Definity Financial, and CCNCTO. Registration is free and closes on March 8 at 23:59.',
        description_zh: '多大中文 Ace Career Fair 自 2015 年举办至今，始终坚持为学生免费提供高质量的人才与就业对话平台。今年活动将于 3 月 11 日在 Hart House Debates Room 举行，包含 Info Session、Networking 和一对一 Coffee Chat，部分参展机构包括 Sun Life、Vision Sprint Consulting Group、Definity Financial 和 CCNCTO。活动完全免费，报名截止时间为 3 月 8 日 23:59。',
        imageUrl: '/uploads/events/AceCareerFair.jpg',
        startDate: new Date('2026-03-11T10:30:00'),
        endDate: new Date('2026-03-11T16:30:00'),
        location_en: 'Hart House Debates Room',
        location_zh: 'Hart House Debates Room',
        featured: false,
      },
      {
        title_en: 'UTChinese Reading Club',
        title_zh: '多大中文读书会',
        description_en: 'UTChinese Reading Club creates a relaxed space to slow down from busy academic life and connect through books, conversation, and shared cultural experiences. This year\'s Lantern Festival themed gathering features film sharing, riddles, games, and casual social activities in a warm and welcoming atmosphere.',
        description_zh: '多大中文读书会希望在忙碌的学习生活之余，为大家留出一段可以放慢脚步的时光。读书会不止于阅读，今年将以元宵为主题，带来电影分享、猜灯谜、海龟汤和互动游戏，让大家在轻松愉快的氛围中放松身心、结识朋友。',
        imageUrl: '/uploads/events/reading.png',
        startDate: new Date('2026-03-15T17:00:00'),
        endDate: new Date('2026-03-15T19:00:00'),
        location_en: '3 Gloucester',
        location_zh: '3 Gloucester',
        featured: false,
      },
      {
        title_en: 'EXCITE Panel Talk',
        title_zh: 'EXCITE小组讨论',
        description_en: 'EXCITE Panel Talk is dedicated to providing a platform for peer-to-peer communication. Everyone\'s growth background is very different, and there is no success in the world that can be completely replicated, but EXCITE hopes that every participant can generate new thinking from peers\' growth experiences.',
        description_zh: 'EXCITE Panel Talk致力于提供一个同龄人与同龄人交流的平台。每个人的成长背景大不相同，世界上也没有能完全复制的成功，但EXCITE希望每一位参与者都能从同龄人的成长经历中产生新的思考和思路，发现校园之外无穷的可能。',
        imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        startDate: new Date('2024-03-05T14:00:00'),
        endDate: new Date('2024-03-05T17:00:00'),
        location_en: 'Online',
        location_zh: '线上',
      },
      {
        title_en: 'New Year Concert',
        title_zh: '新年音乐会',
        description_en: 'Music is a language without borders and our way of supporting children\'s education and development. Great sound inspires, great love leaves no trace. Experience winter with music at UTChinese Network\'s New Year Concert.',
        description_zh: '音乐是没有国界的语言，也是我们支持儿童教育和发展的方式。大音希声，大爱无痕。与多大中文新年音乐会一起走过有音乐相伴的寒冬。',
        imageUrl: '/uploads/events/NewYearConcert.jpg',
        startDate: new Date('2024-01-20T19:00:00'),
        endDate: new Date('2024-01-20T21:30:00'),
        location_en: 'Isabel Bader Theatre',
        location_zh: '伊莎贝尔·巴德剧院',
        featured: false,
        link: 'https://www.youtube.com/watch?v=RX_vrxenzBM'
      },
      {
        title_en: 'Ace Firm Visit',
        title_zh: 'Ace企业参观',
        description_en: 'After a three-year-long wait due to the pandemic, Ace Firm Visit is finally meeting with everyone again! In previous events, we have led students to visit and explore renowned companies such as Manulife and Bosch. We are dedicated to creating opportunities for students to observe and communicate in famous enterprises across various industries, encouraging every student and graduate on their career path to bravely explore and break through themselves.',
        description_zh: '在经历了疫情三年漫长的等待之后，Ace Firm Visit终于又和大家见面啦！在往届活动中，我们曾带领学生到Manulife、博世等知名企业进行实地体验与探索。致力于为学生打造在各个领域著名企业中参观和交流的机会，并鼓励每一位在求职路上的在校学生及毕业生勇敢探索，突破自我。',
        imageUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
        startDate: new Date('2024-04-15'),
        endDate: new Date('2024-04-15'),
        location_en: 'Various Company Locations',
        location_zh: '各公司地点',
        featured: false,
      },
      {
        title_en: 'UTChinese Qin Society Anniversary Gathering',
        title_zh: '多大中文古琴会周年雅集',
        description_en: 'One year ago on this day, UTChinese Qin Society was officially established. This year on this day, we cordially invite you to participate in our society\'s anniversary gathering! UofT students and alumni will perform "Xianweng Cao", "Shenren Chang", "Jiu Kuang", "Oulu Wangji", "Wuye Wu Qiufeng", "Meishao Yue", "Zuiyu Changwan", "Liushui", and "Guangling San". Let everyone steal half a day of leisure from their fast-paced study life, listen to an ancient melody, and enjoy a cup of tea. The Guqin is a cultural treasure of our Chinese nation, with more than 3,000 years of history, and is the first of the "four arts" of qin, chess, calligraphy, and painting. Since ancient times, scholars have used the Guqin to honor heaven, earth, people, and spirits, express emotions, cultivate themselves, and nurture their temperament. Understanding and appreciating the Guqin is a continuation of the excellent traditional culture of the Chinese nation.',
        description_zh: '去年的这一天，多大中文古琴会正式成立。今年的这一天，诚邀诸位参加本社周年雅集！届时，多大在读学生和校友们将演奏《仙翁操》，《神人畅》，《酒狂》，《鸥鹭忘机》，《梧叶舞秋风》，《梅梢月》，《醉渔唱晚》，《流水》和《广陵散》。让大家在快节奏学习生活中，听一首古曲，品一杯茶，偷得浮生半日闲。古琴，是我们中华民族的文化瑰宝，有着三千多年的历史，更为「琴棋书画」四艺之首。自古以来，文人志士以古琴礼天地人鬼，抒发情感，修身养性，陶冶情操。对古琴的理解和欣赏，是对中华民族优秀传统文化的延续。',
        imageUrl: '/uploads/events/QinSocietyOpenCeremony.png',
        startDate: new Date('2025-11-27T16:00:00'),
        endDate: new Date('2025-11-27T18:00:00'),
        location_en: 'East Asian Study Lounge, 14th Floor, Robarts Library, 130 St George Street',
        location_zh: '东亚研究休息室，罗巴茨图书馆14楼，圣乔治街130号',
        featured: false,
      },
      {
        title_en: 'Qin Society Summer Outdoor Gathering',
        title_zh: '古琴会夏日户外雅集',
        description_en: 'Join us for our first outdoor gathering of the new academic year! This event will be more vibrant and authentic, truly restoring the atmosphere of ancient gatherings. The activity will focus on social music appreciation, and we are honored to invite qin players from our homeland to join us for exchange. UofT alumni will perform pieces such as "Guangling San" and "Ai Nai". Please come and quietly listen to the beautiful qin music.',
        description_zh: '下午一点，多大中文古琴会诚邀诸位参加新学年的第一次活动 -- 本社的首次室外雅集🎋 此次的雅集跟以往的活动相比会更为生动，更加还原古时雅集的样子 -- 本次活动将会以social欣赏音乐为主，我们更是有幸请到了来自祖国的琴人一起交流。届时，多大校友们将演出《广陵散》，《欸乃》等等雅乐，请诸位静听琴音一曲。',
        imageUrl: '/uploads/events/QinSocietySummerOutdoorGathering.jpg',
        startDate: new Date('2025-06-27T17:00:00'),
        endDate: new Date('2025-06-27T19:00:00'),
        location_en: 'Philosopher\'s Walk, University of Toronto',
        location_zh: '多伦多大学哲学家小径',
        featured: false,
        link: 'https://docs.google.com/forms/d/e/1FAIpQLSdCAaPfNFDTFaFwIEp4cYsugSvLQPhBPo_j2hMVa0UlCZ3Fpw/viewform'
      },
      {
        title_en: 'UTSU Clubs Fair 2025',
        title_zh: '多大学生会社团展览会2025',
        description_en: 'Join us at the annual UTSU Clubs Fair where student organizations showcase their activities and recruit new members! UTChinese Network will be at booth P13 with exclusive merchandise, interactive mini-games, and live Guqin (Chinese traditional instrument) performances. This is a great opportunity to discover new clubs, meet like-minded people, and get involved in campus life. Come visit our booth to learn about our upcoming events, participate in fun activities, and experience the beauty of Chinese culture through music!',
        description_zh: '欢迎参加一年一度的多大学生会社团展览会！多大中文将在P13摊位等您，我们准备了各类精美周边产品、有趣的互动小游戏，还有精彩的古琴表演等您来欣赏。这是发现新社团、结识志同道合的人以及参与校园生活的绝佳机会。快来我们的摊位了解即将举办的活动，参与趣味互动，通过音乐感受中华文化的魅力！',
        imageUrl: '/uploads/events/ClubFair.png',
        startDate: new Date('2025-08-28T12:00:00'),
        endDate: new Date('2025-08-28T16:00:00'),
        location_en: 'Booth P13, King\'s College Circle, University of Toronto',
        location_zh: 'P13摊位，King\'s College Circle，多伦多大学',
        featured: false,
      },
      {
        title_en: 'HiHi | 海海',
        title_zh: '「海海 | HiHi」',
        description_en:
          'A 2026 initiative unlike our usual programming: a campus social built around cultural exchange. Co-hosted with U of T Myanmar Culture Club, HiHi brought Chinese and Myanmar traditions to the same table—China meets Myanmar. Highlights included China–Myanmar trivia, language exchange (Chinese and Burmese), collaborative coloring of landmark scenes, thanaka (traditional Myanmar face paste) try-ons, and Chinese and Myanmar tea, snacks, and a curated playlist. We hoped to connect Chinese students with Toronto\'s diverse communities and share authentic Chinese culture with friends from around the world.',
        description_zh:
          '「海海」是以文化交流为出发点的校内社交活动，与多伦多大学缅甸文化社（UofT Myanmar Culture Club）合作策划。活动包括中缅文化 trivia、语言互动、组队填色中缅特色景点、檀娜卡（thanaka）妆面体验，以及中缅茶点与特别歌单。我们希望连接华人同学与身边不同文化背景的朋友，在课堂之外认识来自五湖四海的同学，也让更多朋友了解真实的中国文化。「人生海海，山山而川」——这一次，我们跨越山海，邀你走进中国与缅甸的传统手艺世界。',
        imageUrl: '/uploads/events/HaiHai.png',
        startDate: new Date('2026-03-27T15:00:00'),
        endDate: new Date('2026-03-27T17:00:00'),
        location_en: 'Cumberland House (33 St. George St.), Toronto',
        location_zh: 'Cumberland House（33 St. George St.）',
        featured: true,
      }
    ];

    // 使用事件的title_en作为唯一标识符来避免重复
    for (const event of events) {
      // Calculate status dynamically based on dates
      const status = calculateEventStatus(event.startDate, event.endDate);
      
      // 检查事件是否已存在
      const existingEvent = await prisma.event.findFirst({
        where: {
          title_en: event.title_en
        }
      });

      if (!existingEvent) {
        await prisma.event.create({
          data: {
            ...event,
            status: status,
          },
        });
        console.log(`Event created: ${event.title_en}`);
      } else {
        console.log(`Event already exists, skipping: ${event.title_en}`);
      }
    }

    console.log('Database has been seeded!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
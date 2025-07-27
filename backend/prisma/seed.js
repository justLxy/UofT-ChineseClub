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

    // Create or update superuser account
    const superuserPassword = adminPassword; // reuse hashed '123'
    const superuser = await prisma.staff.upsert({
      where: { username: 'karenjiujiu.shu' },
      update: {
        // 更新时只更新必要的系统字段，保留用户的个人数据
        role: 'admin',
        canManageEvents: true,
        canReviewProfiles: true,
        canManageStaff: true,
        isActive: true
      },
      create: {
        username: 'karenjiujiu.shu',
        email: 'karenjiujiu.shu@mail.utoronto.ca',
        passwordHash: superuserPassword,
        role: 'admin',
        canManageEvents: true,
        canReviewProfiles: true,
        canManageStaff: true,
        isActive: true
      }
    });

    console.log('Superuser account created/updated successfully');

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
        featured: true,
      },
      {
        title_en: 'Ace Career Fair',
        title_zh: 'Ace招聘会',
        description_en: 'Creating platforms for you to find your dream jobs and realize your full career potential. Extraordinary job opportunities from amazing companies with amazing products and services, and exciting career options that you might not have even thought of.',
        description_zh: '为您提供寻找理想工作并发挥职业潜能的平台。来自拥有优质产品和服务的优秀公司的非凡工作机会，以及您可能从未想过的激动人心的职业选择。',
        imageUrl: '/uploads/events/AceCareerFair.jpg',
        startDate: new Date('2024-02-10T10:00:00'),
        endDate: new Date('2024-02-10T16:00:00'),
        location_en: 'Multi-Faith Centre (Koffler House)',
        location_zh: '多信仰中心（科夫勒楼）',
        featured: true,
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
        featured: true,
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
        title_en: 'UTChinese Network Qin Society Open Ceremony',
        title_zh: '多大中文琴社开幕典礼',
        description_en: 'UTChinese Qin Society Open Ceremony Successfully Concluded. First I would like to say "thank you" to everyone who showed up. Our Qin society successfully held its open ceremony elegant gathering on Nov 27, 2024.',
        description_zh: 'UTChinese琴社开幕典礼圆满结束。首先，我要对所有到场的人表示"感谢"。我们的琴社于2024年11月27日成功举办了开幕典礼雅集。',
        imageUrl: '/uploads/events/QinSocietyOpenCeremony.png',
        startDate: new Date('2024-11-27'),
        endDate: new Date('2024-11-27'),
        location_en: 'Hart House',
        location_zh: '哈特之家',
        featured: true,
        link: 'https://www.youtube.com/watch?v=8HbfgZVLNHM&t=3s'
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
        featured: true,
        link: 'https://docs.google.com/forms/d/e/1FAIpQLSdCAaPfNFDTFaFwIEp4cYsugSvLQPhBPo_j2hMVa0UlCZ3Fpw/viewform'
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
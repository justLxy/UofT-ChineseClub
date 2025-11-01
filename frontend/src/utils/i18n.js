import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  header: {
    about: 'About Us',
    join: 'Join Us',
    team: 'Our Team',
    events: 'Events',
    QinSociety: 'Qin Society',
    NYConcert: 'New Year Concert',
    contact: 'Contact',
    language: 'Language',
    home: 'Home',
    viewMore: 'View More',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    login: 'Login',
    logout: 'Logout',
    eventManagement: 'Events',
    staffManagement: 'Staff',
    myProfile: 'Profile'
  },
  home: {
    hero: {
      title: 'UTChinese',
      subtitle: 'Connecting Chinese culture with UofT community',
      cta: 'Join Our Community'
    },
    about: {
      title: 'What is UTChinese?',
      content: 'UTChinese Network is a student organization dedicated to promoting Chinese culture and providing a platform for cultural exchange at the University of Toronto.'
    },
    scroll: 'Scroll'
  },
  about: {
    title: 'What is UTChinese?',
    story1: `Some say the essence of UTChinese is passion. We've held charity concerts for ${new Date().getFullYear() - 2006} consecutive years, donating hundreds of thousands of dollars to UNICEF.`,
    story2: 'Initially, our members wanted to host entrepreneur forums. They quickly invited Yu Minhong, the founder of Roots, Microsoft Canada\'s CTO, and Coca-Cola\'s Global VP. I admired their resources, but after joining, I realized they had searched the entire internet, found contact information for entrepreneurs and executives, sent hundreds of invitation emails, and finally got lucky with that one percent chance. Later, I joined them.',
    story3: 'Following this approach, we organized the Ace Career Fair. No one expected Apple, Microsoft, and the Big Five banks to become our guests.',
    story4: 'Later, we discovered that as Chinese living in Canada, we sometimes wanted to introduce our homeland but didn\'t know where to start. For this reason, UTChinese\'s founders created the Mulan International Film Festival. We succeeded in "enabling Chinese people to better tell China\'s story, and non-Chinese people to see China comprehensively and objectively" through film.',
    story5: 'We\'ve received praise along the way, even from renowned producer Nai An, who expressed appreciation and admiration for us. After receiving countless encouragement and support, we are more convinced that what we\'re doing is truly meaningful!',
    quote: "We're not a prestigious club - just a group of perfectionists who never compromise on the things we love.",
    authorName: "UTChinese Network",
    values: {
      title: "Our Values",
      description: "The core principles that drive everything we do at UTChinese Network.",
      cultural: {
        title: "Cultural Exchange",
        description: "Fostering mutual understanding between Chinese and Western cultures."
      },
      commitment: {
        title: "Commitment",
        description: "Dedicated to excellence in everything we do."
      },
      innovation: {
        title: "Innovation",
        description: "Constantly exploring new ideas and approaches."
      }
    }
  },
  join: {
    title: 'Are You Ready to Join UTChinese?',
    intro: 'We\'re not a high-end, prestigious club - just a group of perfectionists who never compromise on the things we love. We invite all kinds of friends to join our team and find a sense of belonging in college during your spare time.',
    requirements: 'You don\'t need special skills or outstanding experiences. As long as you like us and are willing to pursue perfection with us, laughing through our youth together, our doors are always open to you!',
    sections: 'The following will introduce UTChinese\'s five departments and their recruitment requirements. We welcome friends to click the link at the end to fill out the application questionnaire. We look forward to your joining us!',
    welcomeMembers: 'What kind of members are we looking for?',
    arts: {
      req1: 'Interested in culture and art, with curiosity and humanistic care',
      req2: 'Responsible for project operations, including but not limited to platform construction and content planning',
      req3: 'Good at communication and expression, with execution ability and responsibility',
      subgroup1: {
        title: 'New Year Concert',
        description: 'New Year Concert is a charity music event meticulously crafted by UTChinese Network, representing our tradition and pride. This concert brings together artists and music lovers from around the world, offering audiences a cross-cultural audiovisual feast through beautiful melodies. Most importantly, all proceeds are donated to UNICEF Canada to provide medical care and living assistance to children in need worldwide, spreading hope and care through music. Since its inception in 2007, the concert has been successfully held for multiple years, raising over $110,000 CAD for UNICEF Canada and other charitable organizations.'
      },
      subgroup2: {
        title: 'Book Club',
        description: 'The Book Club is a cozy intellectual gathering where literature enthusiasts come together to explore the depths of Chinese and international literature. Through regular reading sessions, book discussions, and author meet-and-greets, we create a space for meaningful conversations about books, ideas, and cultural perspectives. Whether you\'re passionate about classical Chinese literature, contemporary fiction, or cross-cultural narratives, our book club offers a platform to share insights, discover new voices, and deepen your understanding of diverse cultures through the power of reading.'
      },
      subgroup3: {
        title: 'Cultural Exchange',
        description: 'In the multicultural landscape of Toronto, we are dedicated to promoting authentic Chinese traditional culture through rich, diverse, and highly interactive activities that build bridges for cross-cultural exchange. Through traditional festival celebrations, handicraft experiences, culinary culture sharing, and themed discussions, we showcase the charm of festivals like Mid-Autumn and Spring Festival, while organizing activities such as paper cutting, calligraphy, and pottery to let more people experience the essence of Chinese culture firsthand. We actively connect with students from different cultural backgrounds, promoting cross-cultural understanding and integration.'
      },
      subgroup4: {
        title: 'Qin Society',
        description: 'The Qin Society is dedicated to preserving and promoting the art of Guqin, a traditional Chinese instrument with over 3,000 years of history. As one of the most ancient and culturally significant instruments in China, the Guqin has long been cherished by Chinese scholars and intellectuals, embodying the profound essence of Chinese aesthetics. Our society provides a platform for students who love Chinese traditional culture to learn about and experience the cultural charm of Guqin through regular workshops, masterclasses with renowned Toronto Guqin artists, and elegant gatherings where members can immerse themselves in the grace and beauty of this ancient art form.'
      }
    },
    career: {
      req1: 'Creative, with novel and bold ideas in the business workplace',
      req2: 'Pay attention to industry dynamics and hot current events, with insight and thinking ability',
      req3: 'Good at communication and expression, able to maintain contact with HR or corporate executives and develop long-term relationships',
      req4: 'Have the ability to solve problems and emergencies, and have execution ability',
      req5: 'Have certain pressure resistance and time management abilities, attend regular meetings and activities on time, and have a sense of responsibility',
      subgroup1: {
        title: 'Ace Career Fair',
        description: 'Ace Career Fair is the largest recruitment fair organized by University of Toronto students. We are committed to creating a win-win platform for companies and students, guiding overseas students to employment, promoting the connection between college students and company supply and demand, and facilitating companies to find suitable candidates.'
      },
      subgroup2: {
        title: 'Ace Firm Visit',
        description: 'After waiting for three long years of the pandemic, Ace Firm Visit is finally meeting with everyone again! In previous activities, we have led students to well-known companies such as Manulife and Bosch for on-site experience and exploration.'
      },
      subgroup3: {
        title: 'EXCITE Panel Talk',
        description: 'EXCITE Panel Talk is dedicated to providing a platform for peer-to-peer communication. Everyone\'s growth background is very different, and there is no success in the world that can be completely replicated, but we hope that every participant can generate new thinking from peers\' growth experiences.'
      }
    },
    operation: {
      req1: 'Love photography and be good at discovering interesting details in life',
      req2: 'Have the necessary photographic equipment',
      req3: 'Have the ability to shoot videos, process images, and edit videos',
      req4: 'Familiar with or interested in diving deep into mainstream full-stack development technologies like JavaScript, React, Express.js, Prisma',
      req5: 'Experience with version control systems (Git/GitHub) and collaborative development workflows',
      req6: 'CSC309 (Programming on the Web) or similar course with B or above grade is preferred',
      req7: 'Passionate about programming, eager to learn, and pursuing code quality and user experience',
      req8: 'Love negotiation and have certain negotiation skills',
      req9: 'Have strong understanding, communication, and coordination abilities, with team awareness',
      req10: 'Are careful and thorough, agile in thinking, with a strong sense of responsibility',
      req11: 'Good at communication, team spirit, innovation, and willing to take initiative',
      subgroup1: {
        title: 'Information Solutions',
        description: 'Information Solutions is the technical engine of UTChinese Network, responsible for supporting and driving the design and development of our official website. We are a young but professional full-stack development team, focusing on using cutting-edge technology to efficiently display and manage campus event information, helping more students conveniently learn about, participate in, and join our community.\n\nHere, you will not only work with mainstream technology stacks (React、Express.js、Prisma), but also deeply participate in the complete product development process: from requirements gathering and architecture design to deployment and maintenance - every step is implemented by your own hands. We believe you are as great as your product, and you are as young as your dreams.\n\nWe encourage efficient collaboration and open discussion, welcoming everyone to hone their skills, accumulate works, and amplify their influence through practice, using code to turn ideas into reality.'
      },
      subgroup2: {
        title: 'Human Resources',
        description: 'The HR department brings together the internal personnel of the organization, organizing online and offline team building activities, ensuring everyone can eat well, drink well, play well, and get to know each other better.'
      }
    },
    support: {
      req1: 'Have good literary literacy and grammatical sensitivity, with certain requirements for typesetting and proofreading',
      req2: 'Willing to accept the constantly changing nature of new media influenced by technology, dare to innovate and persist, and focus on readers',
      req3: 'Interested in self-media platform operation and creative tweet writing is a priority',
      req4: 'Serious and responsible, actively participate in activities, have certain execution ability and strong sense of responsibility',
      req5: 'Have strong communication skills and willingness to make new friends',
      req6: 'Have execution ability and sense of responsibility',
      req7: 'Love organizing club activities, and have strong team awareness and coordination ability',
      subgroup1: {
        title: 'Content Marketing',
        description: 'At UTChinese, there are no marketing experts; we are explorers, learners, and executors. We wrote the freshman manual, built a new media creation platform, held charity classical music concerts, and coordinated job fairs.'
      },
      subgroup2: {
        title: 'Sponsorship',
        description: 'We are the "investment promotion" department of UTChinese. We are responsible for coordinating the social relations between UTChinese and sponsoring institutions, maintaining communication and good cooperation with off-campus enterprises and businesses.'
      },
      subgroup3: {
        title: 'Design and Art',
        description: 'We believe that art, images, and design can provide people with better interactive experiences, and we hope to bring positive and effective energy to society through these methods.'
      }
    },
    engagement: {
      req1: 'Passionate about building community and connecting people',
      req2: 'Have strong interpersonal skills and enjoy organizing social activities',
      req3: 'Able to work independently and take initiative in member engagement activities',
      req4: 'Committed to fostering an inclusive and welcoming environment for all members'
    },
    form: {
      name: 'Your Name',
      namePlaceholder: 'Enter your name',
      email: 'Email Address',
      emailPlaceholder: 'Enter your email',
      group: 'Interested Group',
      message: 'Why do you want to join?',
      messagePlaceholder: 'Tell us a bit about yourself and why you want to join',
      submit: 'Submit Application',
      title: 'UTChinese Network Application Form',
      description: 'Please fill out our official application form to join UTChinese Network. The form will open in a new tab or you can complete it directly below.',
              openForm: 'Open Form in New Tab'
    }
  },
  groups: {
    overview: {
      title: 'UTChinese Departments',
      description: 'UTChinese Network is comprised of five key departments that work together to create a vibrant community. From cultural events and career services to operational support, content creation, and member engagement, each department plays a vital role in our mission to connect Chinese culture with the UofT community.'
    },
    arts: {
      title: 'ARTS & CULTURE GROUP',
      description: `The Arts & Culture Group is dedicated to conveying diverse Eastern and Western cultures through cultural activities. Here, with culture and art as our original intention, we have held charity New Year's concerts for ${new Date().getFullYear() - 2006} consecutive years, with total revenue exceeding 110,000 Canadian dollars. Among them, there are book salons that bring friends together through books, as well as summer-limited Live Houses. We believe these activities deserve to be seen by more people, so every UTChinese member opens a window to present quality content to everyone.`
    },
    career: {
      title: 'CAREER & ACADEMIC GROUP',
      description: 'The Career & Academic Group is dedicated to providing high-quality academic and workplace services to students, encouraging every college student and graduate to bravely break through information cocoons and explore the world as a whole. Here, you have the opportunity to face-to-face exchange with business elites and bigwigs from various industries, as well as the opportunity to meet like-minded friends for in-depth exchanges, and even the opportunity to experience your favorite industry in major companies. Join us, and together with us, we will discover opportunities, broaden horizons, and embrace the future.'
    },
    operation: {
      title: 'OPERATION GROUP',
      description: 'The Operation Group is dedicated to providing technical support and human resources management for the organization. Our team includes Information Solutions and Human Resources divisions, responsible for developing technical tools, managing internal team building, and optimizing operational processes.'
    },
    support: {
      title: 'SUPPORT GROUP',
      description: 'The Support Group is responsible for the organization\'s external image building and resource acquisition. Our team includes Content Marketing, Sponsorship, and Design & Art divisions, committed to promoting the organization\'s brand and activities through creative content, partnerships, and visual design.'
    },
    engagement: {
      title: 'ENGAGEMENT',
      description: 'The Engagement department is an independent division focused on member engagement, community building, and maintaining strong relationships within the organization. We organize team activities, foster member connections, and ensure everyone feels included and valued in our community.'
    },
    executive_committee: {
      title: 'EXECUTIVE COMMITTEE',
      description: 'The Executive Committee is responsible for the overall strategic planning and management of the organization, ensuring the smooth operation of all departments and the achievement of long-term goals.'
    }
  },
  contact: {
    title: 'Join the Community',
    address: 'Room 534, 21 Sussex Ave, Toronto, ON M5S 1J6',
    wechat: 'WeChat (Search for UTChinese in the official account)',
    xiaohongshu: 'Xiaohongshu',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    email: 'Email'
  },


  
  events: {
    title: 'Exciting Events',
    subtitle: 'Explore the various activities organized by UTChinese, from academic lectures to cultural exchanges, from career development to social gatherings. Join us to experience the charm of Chinese culture, expand your horizons, and meet like-minded friends.',
    filters: {
      all: 'All Events',
      upcoming: 'Upcoming',
      ongoing: 'Ongoing',
      past: 'Past'
    },
    status: {
      past: 'Past',
      ongoing: 'Ongoing',
      upcoming: 'Upcoming'
    },
    featured: 'Featured Event',
    learnMore: 'Learn More',
    noEvents: 'No events match your criteria',
    loading: 'Loading events...',
    admin: {
      manage: 'Manage Events',
      edit: 'Edit Event',
      add: 'Add New Event'
    }
  },
  staff: {
    login: {
      title: 'Staff Login',
      subtitle: 'Access your staff account to manage your profile',
      username: 'Username or Email',
      usernamePlaceholder: 'Enter your username or email',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      loginButton: 'Login',
      loggingIn: 'Logging in...',
      error: {
        required: 'Please enter both username and password',
        failed: 'Login failed. Please check your credentials.'
      }
    },
    profile: {
      title: 'Staff Profile',
      subtitle: 'Manage your personal information and profile settings',
      viewPermission: 'View Permission',
      logout: 'Logout',
      status: {
        approved: {
          title: 'Profile Approved',
          message: 'Your profile has been approved and is now visible on the team page.'
        },
        pending: {
          title: 'Profile Pending Review',
          message: 'Your profile is currently under review by administrators.'
        },
        rejected: {
          title: 'Profile Rejected',
          message: 'Your profile was rejected. Please make necessary changes and resubmit.'
        },
        new: {
          title: 'New Profile',
          message: 'Please complete your profile information.'
        }
      },
      changeAvatar: 'Change Avatar',
      uploading: 'Uploading...',
      nameEn: 'English Name',
      nameEnPlaceholder: 'Enter your English name',
      nameZh: 'Chinese Name',
      nameZhPlaceholder: 'Enter your Chinese name',
      positionEn: 'Position (English)',
      positionEnPlaceholder: 'Enter your position in English',
      positionZh: 'Position (Chinese)',
      positionZhPlaceholder: 'Enter your position in Chinese',
      department: 'Department',
      selectDepartment: 'Select a department',
      departments: {
        arts: 'ARTS & CULTURE GROUP',
        career: 'CAREER & ACADEMIC GROUP',
        operation: 'OPERATION GROUP',
        support: 'SUPPORT GROUP',
        engagement: 'ENGAGEMENT',
        executive_committee: 'EXECUTIVE COMMITTEE'
      },
      bioEn: 'Bio (English)',
      bioEnPlaceholder: 'Tell us about yourself in English...',
      bioZh: 'Bio (Chinese)',
      bioZhPlaceholder: 'Tell us about yourself in Chinese...',
      email: 'Email',
      emailPlaceholder: 'Enter your email address',
      phone: 'Phone',
      phonePlaceholder: 'Enter your phone number',
      linkedin: 'LinkedIn',
      linkedinPlaceholder: 'Enter your LinkedIn profile URL',
      github: 'GitHub',
      githubPlaceholder: 'Enter your GitHub profile URL',
      wechat: 'WeChat',
      wechatPlaceholder: 'Enter your WeChat ID',
      mbti: 'MBTI Personality Type',
      mbtiPlaceholder: 'Select your MBTI type',
      save: 'Save Changes',
      saving: 'Saving...',
      saved: 'Profile saved successfully!',
      avatarUploaded: 'Avatar uploaded successfully!',
      error: {
        required: 'Please fill in all required fields',
        invalidFile: 'Please select a valid image file',
        fileTooLarge: 'File size is too large (max 5MB)',
        uploadFailed: 'Failed to upload avatar',
        saveFailed: 'Failed to save profile'
      },
      permissions: {
        title: 'My Permissions',
        manageEvents: 'Event',
        manageEventsDesc: 'Can create, edit, and delete events',
        reviewProfiles: 'Review',
        reviewProfilesDesc: 'Can review and approve staff profiles',
        manageStaff: 'Account',
        manageStaffDesc: 'Can create and manage staff accounts',
        adminNote: 'As an admin, you have all permissions automatically',
        defaultPosition: 'Staff Member',
        noBio: 'This person is quite mysterious and hasn\'t shared anything yet',
        noName: 'Anonymous',
        noAltName: '无名氏',
        notProvided: 'Not provided'
      },
      status: {
        rejected: {
          title: 'Profile Rejected',
          message: 'Your profile has been rejected. Please review the feedback below and make necessary changes.',
          reason: 'Rejection Reason:'
        },
        pending: {
          title: 'Profile Under Review',
          message: 'Your profile is currently under review. Please check back later for updates.',
          lastRejectionReason: 'Previous rejection reason:'
        },
        approved: {
          title: 'Profile Approved',
          message: 'Your profile has been approved and is now visible on the team page.'
        },
        new: {
          title: 'Profile Incomplete',
          message: 'Please complete your profile to be included on the team page.'
        }
      },
      verified: 'Profile Verified',
      unverified: 'Profile Pending Verification'
    }
  },
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    submit: 'Submit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    search: 'Search',
    clear: 'Clear',
    reset: 'Reset',
    create: 'Create',
    update: 'Update',
    view: 'View',
    download: 'Download',
    upload: 'Upload',
    select: 'Select',
    all: 'All',
    none: 'None',
    more: 'More',
    less: 'Less',
    expand: 'Expand',
    collapse: 'Collapse',
    dismiss: 'Dismiss'
  },

  accountStatus: {
    notActivated: {
      title: 'Account Not Activated',
      description: 'Your account has not been activated yet. Profile editing is restricted. Please wait for administrator activation.'
    },
    activated: {
      title: 'Account Activated',
      description: 'Your account has been successfully activated. You now have access to all features.'
    },
    deactivated: {
      title: 'Account Deactivated',
      description: 'Your account has been deactivated. Please contact an administrator for more information.'
    }
  },
  login: {
    title: 'Login',
    subtitle: 'Access your account to manage your profile and content',
    identifier: 'Username / Email',
    identifierPlaceholder: 'Username or email',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    signIn: 'Sign In',
    signingIn: 'Signing In...',
    tabs: {
      password: 'Password',
      email: 'Email Login',
      register: 'Register'
    },
    error: {
      required: 'Please enter username and password',
      failed: 'Login failed. Please check your credentials.'
    }
  },
  email: {
    label: 'Email',
    placeholder: 'Enter your email address',
    prefixPlaceholder: 'Prefix',
    verificationCode: 'Verification Code',
    verificationCodePlaceholder: 'Enter 6-digit code',
    sendCode: 'Send Code',
    sending: 'Sending...',
    signIn: 'Sign In with Code',
    signingIn: 'Signing In...',
    verification: {
      sent: 'Verification code sent to your email'
    },
          error: {
        required: 'Please enter email and verification code',
        sendFailed: 'Failed to send verification code',
        loginFailed: 'Email login failed',
        domainNotAllowed: 'Registration is limited to University of Toronto email (@mail.utoronto.ca). For other emails, please contact administrator to create account manually.',
        emailAlreadyRegistered: 'This email is already registered. Please use a different email or login directly.'
      }
  },
  register: {
    title: 'Register',
    subtitle: 'Create your account to join our community',
    username: 'Username',
    usernamePlaceholder: 'Enter your username',
    autoGenerated: 'Auto-generated from email',
    password: 'Password',
    passwordPlaceholder: 'Enter your password (min 6 characters)',
    signUp: 'Sign Up',
    registering: 'Registering...',
    success: 'Registration successful! Logging you in...',
    successPleaseLogin: 'Registration successful! Please login with your credentials.',
    error: {
      required: 'Please fill in all required fields',
      passwordTooShort: 'Password must be at least 6 characters',
      failed: 'Registration failed. Please try again.'
    }
  },
  changePassword: {
    title: 'Change Password',
    subtitle: 'Update your account password to keep it secure',
    currentPassword: 'Current Password',
    currentPasswordPlaceholder: 'Enter your current password',
    newPassword: 'New Password',
    newPasswordPlaceholder: 'Enter new password',
    confirmPassword: 'Confirm New Password',
    confirmPasswordPlaceholder: 'Confirm new password',
    passwordRequirements: 'Password must be at least 6 characters long',
    changeButton: 'Change Password',
    changing: 'Changing...',
    success: 'Password changed successfully!',
    error: {
      currentPasswordRequired: 'Current password is required',
      newPasswordRequired: 'New password is required',
      confirmPasswordRequired: 'Please confirm your new password',
      passwordTooShort: 'Password must be at least 6 characters long',
      passwordsDoNotMatch: 'New passwords do not match',
      samePassword: 'New password must be different from current password',
      failed: 'Failed to change password. Please try again.'
    }
  },
  admin: {
    login: {
      title: 'Admin Authentication',
      passwordPlaceholder: 'Enter admin password',
      loginButton: 'Login',
      authenticating: 'Authenticating...',
      error: {
        failed: 'Authentication failed',
        serverError: 'Server not responding. Please try again.'
      },
    },
    staff: {
      managementTitle: 'Staff Management',
      managementSubtitle: 'Manage staff accounts and review profile submissions',
      tabs: {
        accounts: 'Staff Accounts',
        profiles: 'Profile Reviews'
      },
      searchPlaceholder: 'Search staff...',
      filters: {
        all: 'All',
        active: 'Active',
        inactive: 'Inactive',
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected'
      },
      createAccount: 'Create Account',
      modal: {
        create: 'Create Staff Account',
        edit: 'Edit Staff Account',
        review: 'Review Profile'
      },
      form: {
        username: 'Username',
        email: 'Email',
        password: 'Password',
        role: 'Role',
        active: 'Active',
        status: 'Status',
        displayOrder: 'Display Order',
        displayOrderDesc: 'Lower numbers appear first in team page',
        reviewNote: 'Review Note',
        reviewNotePlaceholder: 'Add a note about this review...',
        roles: {
          staff: 'Staff',
          admin: 'Admin'
        },
        statuses: {
          pending: 'Pending',
          approved: 'Approved',
          rejected: 'Rejected'
        },
        rejectionReason: 'Rejection Reason',
        requiredForRejection: 'Please provide a reason for rejection',
        buttons: {
          cancel: 'Cancel',
          create: 'Create',
          update: 'Update',
          save: 'Save'
        }
      },
      noPermissions: 'No special permissions',
      emptyStates: {
        noAccounts: 'No staff accounts found',
        noAccountsDesc: 'There are no staff accounts matching your criteria.',
        noProfiles: 'No profiles to review',
        noProfilesDesc: 'There are no pending or rejected profiles at this time.',
        noResults: 'No results found',
        noResultsDesc: 'Try adjusting your search or filter criteria.'
      },
      batchDelete: {
        button: 'Batch Delete',
        noSelection: 'Please select at least one item to delete.',
        confirm: 'Are you sure you want to delete {{count}} staff account(s)? This action cannot be undone.',
        success: 'Successfully deleted {{count}} staff account(s).',
        error: 'Failed to delete selected accounts. Please try again.'
      },
      batchToggle: {
        activate: 'Batch Activate',
        deactivate: 'Batch Deactivate',
        noSelection: 'Please select staff accounts to update.',
        confirmActivate: 'Are you sure you want to activate {{count}} staff account(s)?',
        confirmDeactivate: 'Are you sure you want to deactivate {{count}} staff account(s)?',
        successActivate: 'Successfully activated {{count}} staff account(s).',
        successDeactivate: 'Successfully deactivated {{count}} staff account(s).',
        errorActivate: 'Failed to activate staff accounts.',
        errorDeactivate: 'Failed to deactivate staff accounts.'
      },
      selectAll: {
        selectAll: 'Select All',
        deselectAll: 'Deselect All',
        selected: '{{count}} selected'
      },
      labels: {
        permissions: 'Permissions:',
        created: 'Created:',
        profileStatus: 'Profile Status:',
        lastLogin: 'Last login:',
        never: 'Never',
        noProfile: 'No profile',
        active: 'Active',
        inactive: 'Inactive',
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        unknownUser: 'Unknown User'
      }
    }
  }
};
  

// Chinese translations
const zhTranslations = {
  header: {
    about: '关于我们',
    join: '加入我们',
    team: '我们的团队',
    events: '活动',
    QinSociety: '古琴会',
    NYConcert: '新年音乐会',
    contact: '联系方式',
    language: '语言',
    home: '首页',
    viewMore: '了解更多',
    darkMode: '夜间模式',
    lightMode: '日间模式',
    login: '登录',
    logout: '退出登录',
    eventManagement: '活动运营',
    staffManagement: '成员管理',
    myProfile: '个人资料'
  },
  home: {
    hero: {
      title: '多大中文',
      subtitle: '连接中华文化与多伦多大学社区',
      cta: '加入我们'
    },
    about: {
      title: '什么是多大中文?',
      content: '多大中文是一个致力于促进中华文化传播和交流的学生组织，为多伦多大学的同学们搭建了一个文化交流的平台。'
    },
    scroll: '继续浏览'
  },
  about: {
    title: '什么是多大中文?',
    story1: `有人说多大中文的精髓是情怀，连续${new Date().getFullYear() - 2006}年的慈善音乐会，为联合国儿童基金会带去数十万刀的捐赠。`,
    story2: '起初，社团的大家想要办企业家论坛，结果很快就请到了俞敏洪、Roots的创始人、微软加拿大的CTO、可口可乐的全球副总裁。本羡慕他们手里已有大量资源，加入了才知道，他们是搜遍整个网络、找到各个企业家或者公司高管的联系方式，发出上百封邮件邀请，最终碰上那百分之一的运气。后来我也加入了他们。',
    story3: '循着这个路子，我们办起了Ace Career Fair。谁都没想到苹果、微软、五大行等都成为了我们的座上客。',
    story4: '之后，我们发现作为生活在加拿大的华人，有时想要介绍我们的祖国时, 却不知道该如何讲起。为了这个，多大中文的创始人们挖了史上最大的坑，木兰国际电影节。我们做到了通过电影的形式"让华人可以更好地讲述中国，让非华人全面客观地看到中国"。',
    story5: '我们一路收获好评，就连著名制片人耐安老师也表达了对我们的欣赏和赞美。在收获了无数的鼓励与支持后，我们更加相信我们做的种种事情真的是太有意义了！',
    quote: "我们不是高端大气上档次的社团，只是一群强迫症患者，对自己喜欢的事情从不将就。",
    authorName: "多大中文",
    values: {
      title: "我们的价值观",
      description: "推动多大中文一切工作的核心原则。",
      cultural: {
        title: "文化交流",
        description: "促进中西方文化之间的相互理解。"
      },
      commitment: {
        title: "追求卓越",
        description: "致力于把每一件事做到最好。"
      },
      innovation: {
        title: "创新思维",
        description: "不断探索新想法和新方法。"
      }
    }
  },
  join: {
    title: '你准备好加入多大中文了吗?',
    intro: '我们不是高端大气上档次的社团，只是一群强迫症患者，对自己喜欢的事情从不将就。我们诚邀各路小伙伴加入我们的团队，在课余时间找到大学的归属。',
    requirements: '你不必身怀绝技，也不必有出众的经历。只要你喜欢我们，愿意跟我们强迫症到底，一起笑傲青春，我们的大门永远为你敞开！',
    sections: '以下内容将介绍多大中文五个部门及其招新要求，欢迎小伙伴们点击文末链接填写报名问卷。我们期待你的加入！',
    welcomeMembers: '欢迎什么样的小伙伴？',
    arts: {
      req1: '对文化艺术感兴趣，怀有好奇心与人文关怀',
      req2: '负责项目的运营工作，包括但不限于平台建设、内容规划等',
      req3: '善于沟通和表达，具有执行能力和责任感',
      subgroup1: {
        title: 'New Year Concert',
        description: 'New Year Concert 是多大中文倾力打造的新年慈善音乐会，也是我们社团的传统与骄傲。音乐会汇聚了来自世界各地热爱音乐的艺术家与爱好者，用美妙的旋律为观众带来一场跨越国界的视听盛宴。更重要的是，音乐会的所有盈利将全数捐赠给 UNICEF Canada（联合国儿童基金会），为全球受难的儿童提供医疗和生活援助，用音乐传递希望与关怀。自 2007 年创办以来，New Year Concert 已成功举办多届，共筹集善款超过 11 万加币，并悉数捐赠给 UNICEF Canada 等慈善机构。'
      },
      subgroup2: {
        title: 'Book Club',
        description: 'Book Club 是一个温馨的学术聚会，文学爱好者们聚集在一起，探索中国及国际文学的深度。通过定期的阅读会、书籍讨论和作家见面会，我们为有意义的对话创造了一个交流书籍、思想和文化观点的空间。无论你热爱中国古典文学、当代小说还是跨文化叙事，我们的读书会都为你提供了一个分享见解、发现新声音、通过阅读力量加深对多元文化理解的平台。'
      },
      subgroup3: {
        title: 'Cultural Exchange',
        description: '在多元文化交融的多伦多，我们致力于宣扬真正的中国传统文化，通过丰富多样且互动性强的活动，搭建跨文化交流的桥梁。通过传统节日庆祝、手工艺体验、美食文化分享及主题对话等形式，我们不仅展示中秋、春节等节日的魅力，还组织剪纸、书法、陶艺等手工活动，让更多人亲身感受中国文化的精髓。我们积极与不同文化背景的学子连接，促进跨文化理解与融合，让中国传统文化成为校园里的一抹亮色。'
      },
      subgroup4: {
        title: 'Qin Society',
        description: '古琴会致力于传承和推广古琴艺术，这是一种有着 3000 多年历史的中国传统乐器。古琴拥有中华民族最古老且文化地位最高的地位，承载着中式美学的深厚内涵。多大中文古琴会为热爱中国传统文化的学子提供一个了解古琴艺术的平台，通过定期的工作坊、与多伦多知名琴家的大师班以及优雅的雅集活动，让成员们沉浸在古琴音乐的优雅与美妙中，感受这一古老艺术形式的独特魅力。'
      }
    },
    career: {
      req1: '有创造力，在商业职场方面有新奇，大胆的想法',
      req2: '关注行业动态和热点时事，具备洞察力和思维能力',
      req3: '善于沟通表达，可以与HR或者企业高管保持联系，发展长期关系',
      req4: '有解决问题和突发情况的能力，有执行力',
      req5: '具备一定抗压能力和时间管理能力，按时参加例会和活动，有责任感',
      subgroup1: {
        title: 'Ace Career Fair',
        description: 'Ace Career Fair是由多伦多大学学生组织举办的本校规模最大招聘会。我们致力于为公司和学生创造一个双赢的平台，引导海外留学生就业，促进高校学生与公司供需对接，方便公司寻找到合适的岗位人选。'
      },
      subgroup2: {
        title: 'Ace Firm Visit',
        description: '在经历了疫情三年漫长的等待之后，Ace Firm Visit终于又和大家见面啦！在往届活动中，我们曾带领学生到Manulife、博世等知名企业进行实地体验与探索。'
      },
      subgroup3: {
        title: 'EXCITE Panel Talk',
        description: 'EXCITE Panel Talk致力于提供一个同龄人与同龄人交流的平台。每个人的成长背景大不相同，世界上也没有能完全复制的成功，但我们希望每一位参与者都能从同龄人的成长经历中产生新的思考。'
      }
    },
    operation: {
      req1: '热爱摄影、善于发现生活中有趣的细节',
      req2: '拥有必要的摄影器材',
      req3: '有视频拍摄、图片处理、视频剪辑的能力',
      req4: '熟悉或有兴趣深入 JavaScript、React、Express.js、Prisma 等主流全栈开发技术',
      req5: '具有版本控制系统（Git/GitHub）和协作开发流程的经验',
      req6: 'CSC309（网页编程）或类似课程成绩 B 及以上者优先考虑',
      req7: '热爱编程，乐于钻研，追求代码质量与用户体验',
      req8: '热爱谈判，拥有一定的谈判技巧',
      req9: '有较强的理解、沟通、协调能力，具备团队意识',
      req10: '认真细致，思维敏捷，具有较强的责任感',
      req11: '善于沟通、富有团队精神、敢于创新，愿意主动承担责任',
      subgroup1: {
        title: 'Information Solutions',
        description: 'Information Solutions 是 UTChinese Network 的技术引擎，负责支撑和推动整个官方网站的设计与开发。我们是一支年轻但专业的全栈开发团队，专注用前沿技术实现校园活动信息的高效展示与管理，帮更多同学更方便地了解、参与、加入我们的社团。\n\n在这里，你不仅能用到主流技术栈（React、Express.js、Prisma），还能深度参与完整的产品开发流程：从需求对接、架构设计到上线维护，每一步都由你亲手落地。我们相信，你和你的产品一样伟大，你和你的梦想一样年轻。\n\n我们鼓励高效协作与自由讨论，欢迎每个人在实战中磨炼技术、积累作品、放大影响力，用代码把想法做成现实。'
      },
      subgroup2: {
        title: 'Human Resources',
        description: 'HR 部门凝聚社团的内部人员，组织线上线下团建，让大家吃好喝好玩好的同时对彼此更加熟悉。'
      }
    },
    support: {
      req1: '具有较好的文学素养和语法敏感度，对排版和校对有一定要求',
      req2: '乐于接受新媒体受科技影响不断变革的性质，敢于创新并坚持，专注于读者',
      req3: '对自媒体平台运营和创作推文感兴趣优先',
      req4: '认真负责，积极参与活动，有一定的执行能力和较强的责任感',
      req5: '有较强的沟通能力，愿意结交新朋友',
      req6: '具有执行力和责任感',
      req7: '热爱组织社团活动，并有较强的团队意识和统筹能力',
      subgroup1: {
        title: 'Content Marketing',
        description: '在多大中文，没有 marketing 的专家，我们是探索者、学习者和执行者。我们撰写了新生手册、搭建了新媒体创作平台，举办了慈善古典音乐会，统筹了招聘会，甚至还会举办跟世界级品牌竞争的活动。虽然每一场宣传都是一次巨大的挑战，但这都是走出象牙塔，无比宝贵的机会。'
      },
      subgroup2: {
        title: 'Sponsorship',
        description: '我们是多大中文的"招商引资"部门，我们负责协调多大中文与赞助机构的社会关系，保持与校外企业和商家的沟通以及良好合作。'
      },
      subgroup3: {
        title: 'Design and Art',
        description: '相信艺术、影像和设计能够给人更好的交互体验，希望通过这些方式来给这个社会带来积极且有效的能量。'
      }
    },
    engagement: {
      req1: '热爱社区建设，善于连接人与人之间的关系',
      req2: '具有较强的人际交往能力，喜欢组织社交活动',
      req3: '能够独立工作，在成员参与活动方面积极主动',
      req4: '致力于为所有成员营造包容友好的环境'
    },
    form: {
      name: '您的姓名',
      namePlaceholder: '请输入您的姓名',
      email: '电子邮箱',
      emailPlaceholder: '请输入您的电子邮箱',
      group: '感兴趣的部门',
      message: '为什么想要加入我们？',
      messagePlaceholder: '请简单介绍一下您自己以及为什么想要加入我们',
      submit: '提交申请',
      title: '多大中文招新报名表',
      description: '请填写我们的官方申请表以加入多大中文。表单将在新标签页中打开，或者您可以直接在下方完成。',
              openForm: '在新标签页中打开表单'
    }
  },
  groups: {
    overview: {
      title: '多大中文部门',
      description: '多大中文由五个核心部门组成，共同打造充满活力的社区。从文化活动和职业服务到运营支持、内容创作和成员参与，每个部门都在连接中华文化与多大社区的使命中发挥着重要作用。'
    },
    arts: {
      title: '文化艺术部门',
      description: `Arts & Culture Group 致力于通过文化类的活动，传递中西方多元文化。在这里，以文化艺术为初心，我们连续举办了${new Date().getFullYear() - 2006}年的公益新年音乐晚会，总收入超11万加币。其中，有以书会友的读书沙龙，也有夏日限定的 Live House。我们相信这些活动值得被更多人看见，因此每一位多大中文人都推开了窗口，让优质的内容出现在大家面前。`
    },
    career: {
      title: '职业学术部门',
      description: 'Career & Academic Group 致力于为学生提供高质量的学术及职场类服务，鼓励每一位大学生及毕业生勇敢地突破信息茧房，摸索世界全貌。在这里，你有机会与各行各业的商业精英和大佬面对面交流，也有机会遇到和你志同道合的朋友深入交流，更有机会在各大公司体验自己热爱的行业。加入我们，和我们一起洞察机遇，拓宽视野，拥抱未来。'
    },
    operation: {
      title: '运营部门',
      description: '运营部门致力于为社团提供技术支持和人力资源管理。我们的团队包括信息解决方案和人力资源两个小组，负责开发技术工具、管理内部团队建设和优化运营流程。'
    },
    support: {
      title: '支持部门',
      description: '支持部门负责社团的对外形象建设和资源获取。我们的团队包括内容营销、赞助合作和设计艺术三个小组，致力于通过创意内容、合作伙伴关系和视觉设计来推广社团品牌和活动。'
    },
    engagement: {
      title: '活动部门',
      description: '活动部门是一个独立的部门，专注于成员参与、社区建设和维护组织内部的良好关系。我们组织团队活动，促进成员之间的联系，确保每个人都能在我们的社区中感受到被包容和重视。'
    },
    executive_committee: {
      title: '执行委员会',
      description: '执行委员会负责社团的整体战略规划和管理，确保各部门的顺利运作和长期目标的达成。'
    }
  },
  contact: {
    title: '加入社区',
    address: 'Room 534, 21 Sussex Ave, Toronto, ON M5S 1J6',
    wechat: '微信 (公众号搜索多大中文)',
    xiaohongshu: '小红书',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    email: '邮箱'
  },

  
  events: {
    title: '精彩活动',
    subtitle: '探索多大中文举办的各类活动，从学术讲座到文化交流，从职业发展到社交聚会。加入我们，体验中国文化的魅力，拓展您的视野，结交志同道合的朋友。',
    filters: {
      all: '全部活动',
      upcoming: '即将到来',
      ongoing: '进行中',
      past: '已结束'
    },
    status: {
      past: '已结束',
      ongoing: '进行中',
      upcoming: '即将开始'
    },
    featured: '精选活动',
    learnMore: '了解更多',
    noEvents: '当前没有符合条件的活动',
    loading: '加载中...',
    admin: {
      manage: '管理活动',
      edit: '编辑活动',
      add: '添加新活动'
    }
  },
  staff: {
    login: {
      title: '成员登录',
      subtitle: '登录您的成员账户以管理个人资料',
      username: '用户名或邮箱',
      usernamePlaceholder: '请输入用户名或邮箱',
      password: '密码',
      passwordPlaceholder: '请输入密码',
      loginButton: '登录',
      loggingIn: '登录中...',
      error: {
        required: '请输入用户名和密码',
        failed: '登录失败，请检查您的凭据'
      }
    },
    profile: {
      title: '个人资料',
      subtitle: '管理您的个人信息和资料设置',
      viewPermission: '查看权限',
      logout: '退出登录',
      status: {
        approved: {
          title: '资料已通过审核',
          message: '您的资料已通过审核，现在已在团队页面显示。'
        },
        pending: {
          title: '资料审核中',
          message: '您的资料正在等待管理员审核。'
        },
        rejected: {
          title: '资料被拒绝',
          message: '您的资料被拒绝，请进行必要的修改后重新提交。'
        },
        new: {
          title: '新建资料',
          message: '请完善您的个人资料信息。'
        }
      },
      changeAvatar: '更换头像',
      uploading: '上传中...',
      nameEn: '英文姓名',
      nameEnPlaceholder: '请输入您的英文姓名',
      nameZh: '中文姓名',
      nameZhPlaceholder: '请输入您的中文姓名',
      positionEn: '职位（英文）',
      positionEnPlaceholder: '请输入您的英文职位',
      positionZh: '职位（中文）',
      positionZhPlaceholder: '请输入您的中文职位',
      department: '部门',
      selectDepartment: '请选择部门',
      departments: {
        arts: '文化艺术部门',
        career: '职业学术部门',
        operation: '运营部门',
        support: '支持部门',
        engagement: '活动部门',
        executive_committee: '执行委员会'
      },
      bioEn: '个人简介（英文）',
      bioEnPlaceholder: '请用英文介绍一下您自己...',
      bioZh: '个人简介（中文）',
      bioZhPlaceholder: '请用中文介绍一下您自己...',
      email: '邮箱',
      emailPlaceholder: '请输入您的邮箱地址',
      phone: '电话',
      phonePlaceholder: '请输入您的电话号码',
      linkedin: 'LinkedIn',
      linkedinPlaceholder: '请输入您的 LinkedIn 个人资料链接',
      github: 'GitHub',
      githubPlaceholder: '请输入您的 GitHub 个人资料链接',
      wechat: '微信',
      wechatPlaceholder: '请输入您的微信号',
      mbti: '性格类型（MBTI）',
      mbtiPlaceholder: '请选择您的MBTI类型',
      save: '保存更改',
      saving: '保存中...',
      saved: '资料保存成功！',
      avatarUploaded: '头像上传成功！',
      error: {
        required: '请填写所有必填字段',
        invalidFile: '请选择有效的图片文件',
        fileTooLarge: '文件大小过大（最大5MB）',
        uploadFailed: '头像上传失败',
        saveFailed: '资料保存失败'
      },
      permissions: {
        title: '我的权限',
        manageEvents: '活动运营',
        manageEventsDesc: '可以创建、编辑和管理活动',
        reviewProfiles: '资料审核',
        reviewProfilesDesc: '可以审核和批准成员资料',
        manageStaff: '成员管理',
        manageStaffDesc: '可以创建和管理成员账户',
        adminNote: '作为管理员，您自动拥有所有权限',
        defaultPosition: '团队成员',
        noBio: '这个人很懒，什么都没有留下',
        noName: '无名氏',
        noAltName: 'Anonymous',
        notProvided: '未填写'
      },
      status: {
        rejected: {
          title: '资料被拒绝',
          message: '您的资料已被拒绝。请查看下方反馈并进行必要的修改。',
          reason: '拒绝原因：'
        },
        pending: {
          title: '资料审核中',
          message: '您的资料正在审核中。请稍后查看审核状态。',
          lastRejectionReason: '上次拒绝原因：'
        },
        approved: {
          title: '资料已通过',
          message: '您的资料已通过审核，现在已在团队页面显示。'
        },
        new: {
          title: '资料未完成',
          message: '请完善您的资料以便在团队页面中显示。'
        }
      },
      verified: '资料已认证',
      unverified: '资料待认证'
    }
  },
  common: {
    loading: '加载中...',
    save: '保存',
    cancel: '取消',
    edit: '编辑',
    delete: '删除',
    confirm: '确认',
    yes: '是',
    no: '否',
    manageStaffDesc: '可以创建和管理成员账户',
    adminNote: '作为管理员，您自动拥有所有权限',
    defaultPosition: '团队成员',
    noBio: '暂无个人简介',
    submit: '提交',
    cancel: '取消',
    save: '保存',
    close: '关闭',
    back: '返回',
    next: '下一步',
    confirm: '确认',
    yes: '是',
    no: '否',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    warning: '警告',
    info: '信息',
    search: '搜索',
    clear: '清除',
    reset: '重置',
    edit: '编辑',
    delete: '删除',
    create: '创建',
    update: '更新',
    view: '查看',
    download: '下载',
    upload: '上传',
    select: '选择',
    all: '全部',
    none: '无',
    more: '更多',
    less: '更少',
    expand: '展开',
    collapse: '折叠',
    dismiss: '关闭'
  },

  accountStatus: {
    notActivated: {
      title: '账号未激活',
      description: '您的账号尚未激活，个人资料功能受限，请等待管理员激活。'
    },
    activated: {
      title: '账号已激活',
      description: '您的账号已成功激活。您现在可以访问所有功能。'
    },
    deactivated: {
      title: '账号已停用',
      description: '您的账号已被停用。请联系管理员获取更多信息。'
    }
  },
  login: {
    title: '登录',
    subtitle: '登录您的账户以管理个人资料和内容',
    identifier: '用户名/邮箱',
    identifierPlaceholder: '请输入用户名或邮箱',
    password: '密码',
    passwordPlaceholder: '请输入密码',
    signIn: '登录',
    signingIn: '登录中...',
    tabs: {
      password: '密码登录',
      email: '邮箱登录',
      register: '注册'
    },
    error: {
      required: '请输入用户名和密码',
      failed: '登录失败，请检查您的凭据'
    }
  },
  email: {
    label: '邮箱',
    placeholder: '请输入邮箱地址',
    prefixPlaceholder: '邮箱前缀',
    verificationCode: '验证码',
    verificationCodePlaceholder: '请输入6位验证码',
    sendCode: '发送验证码',
    sending: '发送中...',
    signIn: '验证码登录',
    signingIn: '登录中...',
    verification: {
      sent: '验证码已发送到您的邮箱'
    },
          error: {
        required: '请输入邮箱和验证码',
        sendFailed: '发送验证码失败',
        loginFailed: '邮箱登录失败',
        domainNotAllowed: '注册仅限多伦多大学邮箱 (@mail.utoronto.ca)，其他邮箱请联系管理员手动创建账户',
        emailAlreadyRegistered: '该邮箱已被注册，请使用其他邮箱或直接登录'
      }
  },
  register: {
    title: '注册',
    subtitle: '创建账户以加入我们的社区',
    username: '用户名',
    usernamePlaceholder: '请输入用户名',
    autoGenerated: '从邮箱自动生成',
    password: '密码',
    passwordPlaceholder: '请输入密码（至少6位）',
    signUp: '注册',
    registering: '注册中...',
    success: '注册成功！正在为您登录...',
    successPleaseLogin: '注册成功！请使用您的凭据登录。',
    error: {
      required: '请填写所有必填字段',
      passwordTooShort: '密码长度至少为6位',
      failed: '注册失败，请重试'
    }
  },
  changePassword: {
    title: '更改密码',
    subtitle: '更新您的账户密码以保证安全',
    currentPassword: '当前密码',
    currentPasswordPlaceholder: '请输入当前密码',
    newPassword: '新密码',
    newPasswordPlaceholder: '请输入新密码',
    confirmPassword: '确认新密码',
    confirmPasswordPlaceholder: '请确认新密码',
    passwordRequirements: '密码长度至少为6位',
    changeButton: '更改密码',
    changing: '更改中...',
    success: '密码更改成功！',
    error: {
      currentPasswordRequired: '请输入当前密码',
      newPasswordRequired: '请输入新密码',
      confirmPasswordRequired: '请确认新密码',
      passwordTooShort: '密码长度至少为6位',
      passwordsDoNotMatch: '新密码不一致',
      samePassword: '新密码必须与当前密码不同',
      failed: '更改密码失败，请重试'
    }
  },
  admin: {
    login: {
      title: '管理员认证',
      passwordPlaceholder: '请输入管理员密码',
      loginButton: '登录',
      authenticating: '认证中...',
      error: {
        failed: '认证失败',
        serverError: '服务器无响应，请重试'
      }
    },
    staff: {
      managementTitle: '成员管理',
      managementSubtitle: '管理成员账户并审核个人资料提交',
      tabs: {
        accounts: '成员账户',
        profiles: '资料审核'
      },
      searchPlaceholder: '搜索成员...',
      filters: {
        all: '全部',
        active: '已激活',
        inactive: '未激活',
        pending: '待审核',
        approved: '已通过',
        rejected: '已拒绝'
      },
      createAccount: '创建账户',
      modal: {
        create: '创建成员账户',
        edit: '编辑成员账户',
        review: '审核资料'
      },
      form: {
        username: '用户名',
        email: '邮箱',
        password: '密码',
        role: '角色',
        active: '激活状态',
        status: '状态',
        displayOrder: '显示顺序',
        displayOrderDesc: '数字越小在团队页面中越靠前',
        reviewNote: '审核备注',
        reviewNotePlaceholder: '添加关于此次审核的备注...',
        roles: {
          staff: '成员',
          admin: '管理员'
        },
        statuses: {
          pending: '待审核',
          approved: '已通过',
          rejected: '已拒绝'
        },
        rejectionReason: '拒绝原因',
        requiredForRejection: '拒绝时请提供拒绝原因',
        buttons: {
          cancel: '取消',
          create: '创建',
          update: '更新',
          save: '保存'
        }
      },
      noPermissions: '无特殊权限',
      emptyStates: {
        noAccounts: '未找到成员账户',
        noAccountsDesc: '没有符合您条件的成员账户',
        noProfiles: '暂无资料需要审核',
        noProfilesDesc: '目前没有待审核或被拒绝的资料',
        noResults: '未找到结果',
        noResultsDesc: '请尝试调整您的搜索或筛选条件'
      },
      batchDelete: {
        button: '批量删除',
        noSelection: '请至少选择一个项目进行删除',
        confirm: '您确定要删除 {{count}} 个成员账户吗？此操作无法撤销',
        success: '成功删除了 {{count}} 个成员账户',
        error: '删除选中账户失败，请重试'
      },
      batchToggle: {
        activate: '批量激活',
        deactivate: '批量禁用',
        noSelection: '请选择要更新的成员账户',
        confirmActivate: '您确定要激活 {{count}} 个成员账户吗？',
        confirmDeactivate: '您确定要禁用 {{count}} 个成员账户吗？',
        successActivate: '成功激活了 {{count}} 个成员账户',
        successDeactivate: '成功禁用了 {{count}} 个成员账户',
        errorActivate: '激活成员账户失败',
        errorDeactivate: '禁用成员账户失败'
      },
      selectAll: {
        selectAll: '全选',
        deselectAll: '取消全选',
        selected: '已选择 {{count}} 个'
      },
      labels: {
        permissions: '权限：',
        created: '创建时间：',
        profileStatus: '资料状态：',
        lastLogin: '最后登录：',
        never: '从未登录',
        noProfile: '无资料',
        active: '已激活',
        inactive: '未激活',
        pending: '待审核',
        approved: '已通过',
        rejected: '已拒绝',
        unknownUser: '未知用户'
      }
    }
  }
};

// Function to detect browser language
const detectBrowserLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  
  // First check if user has manually set a language preference
  const savedLanguage = localStorage.getItem('preferredLanguage');
  if (savedLanguage) {
    return savedLanguage;
  }
  
  // If no saved preference, detect from browser
  const browserLang = navigator.language || navigator.userLanguage;
  
  // Check if browser language starts with 'zh' (Chinese variants like zh-CN, zh-TW, etc.)
  if (browserLang.toLowerCase().startsWith('zh')) {
    return 'zh';
  }
  
  // Default to English for all other languages
  return 'en';
};

const initialLanguage = detectBrowserLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      zh: { translation: zhTranslations }
    },
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 
const fs = require('fs');
const path = require('path');

// Helper function to extract filename from imageUrl
const getImageFilenameFromUrl = (imageUrl) => {
  if (!imageUrl) return null;
  const urlParts = imageUrl.split('/');
  return urlParts[urlParts.length - 1];
};

// Helper function to delete image file
const deleteImageFile = (filename, directory = 'events') => {
  if (!filename) return;
  
  const imagePath = path.join(__dirname, `../../uploads/${directory}`, filename);
  if (fs.existsSync(imagePath)) {
    try {
      fs.unlinkSync(imagePath);
      console.log(`Deleted old image: ${filename}`);
    } catch (error) {
      console.error(`Failed to delete image file: ${filename}`, error);
    }
  }
};

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

// Helper function to transform data based on language
const transformEventByLanguage = (event, language = 'en') => {
  return {
    id: event.id,
    title: language === 'zh' ? event.title_zh : event.title_en,
    description: language === 'zh' ? event.description_zh : event.description_en,
    imageUrl: event.imageUrl,
    startDate: event.startDate,
    endDate: event.endDate,
    location: language === 'zh' ? event.location_zh : event.location_en,
    status: event.status,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
    link: event.link,
    featured: event.featured,
    // Include original fields for admin purposes
    title_en: event.title_en,
    title_zh: event.title_zh,
    description_en: event.description_en,
    description_zh: event.description_zh,
    location_en: event.location_en,
    location_zh: event.location_zh
  };
};

// Helper function to transform team member data based on language
const transformTeamMemberByLanguage = (member, language = 'en') => {
  return {
    id: member.id,
    name: language === 'zh' ? member.name_zh : member.name_en,
    position: language === 'zh' ? member.position_zh : member.position_en,
    department: member.department,
    bio: language === 'zh' ? member.bio_zh : member.bio_en,
    avatarUrl: member.avatarUrl,
    email: member.email,
    linkedin: member.linkedin,
    github: member.github,
    wechat: member.wechat,
    phone: member.phone,
    mbti: member.mbti,
    status: member.status,
    // Public identifier
    username: member.staff ? member.staff.username : undefined,
    // Include original fields for admin purposes
    name_en: member.name_en,
    name_zh: member.name_zh,
    position_en: member.position_en,
    position_zh: member.position_zh,
    bio_en: member.bio_en,
    bio_zh: member.bio_zh
  };
};

module.exports = {
  getImageFilenameFromUrl,
  deleteImageFile,
  calculateEventStatus,
  transformEventByLanguage,
  transformTeamMemberByLanguage
}; 
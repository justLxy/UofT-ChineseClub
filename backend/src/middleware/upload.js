const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { FILE_LIMITS } = require('../config/constants');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
const eventImagesDir = path.join(uploadsDir, 'events');
const staffImagesDir = path.join(uploadsDir, 'staff');

[uploadsDir, eventImagesDir, staffImagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage for event images
const eventStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, eventImagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

// Configure storage for staff avatars
const staffStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, staffImagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer instances
const eventUpload = multer({ 
  storage: eventStorage, 
  fileFilter,
  limits: { fileSize: FILE_LIMITS.EVENT_IMAGE_SIZE }
});

const staffUpload = multer({ 
  storage: staffStorage, 
  fileFilter,
  limits: { fileSize: FILE_LIMITS.STAFF_AVATAR_SIZE }
});

module.exports = {
  eventUpload,
  staffUpload,
  uploadsDir
}; 
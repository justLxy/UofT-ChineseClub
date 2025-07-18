const crypto = require('crypto');

// Environment variables
const PORT = process.env.PORT || 8000;
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, '');
const JWT_SECRET = process.env.JWT_SECRET || 'ut-chinese-network-secret-key';

// Default admin password
const DEFAULT_ADMIN_PASSWORD = 'utchinese';
const DEFAULT_PASSWORD_HASH = crypto.createHash('sha256').update(DEFAULT_ADMIN_PASSWORD).digest('hex');

// File upload limits
const FILE_LIMITS = {
  EVENT_IMAGE_SIZE: 20 * 1024 * 1024, // 20MB
  STAFF_AVATAR_SIZE: 10 * 1024 * 1024  // 10MB
};

module.exports = {
  PORT,
  FRONTEND_URL,
  JWT_SECRET,
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_PASSWORD_HASH,
  FILE_LIMITS
}; 
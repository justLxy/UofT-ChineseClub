const multer = require('multer');

// In-memory upload for JSON backup files (avoid writing sensitive data to disk)
const importUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: (req, file, cb) => {
    // Allow .json and generic octet-stream (some browsers)
    const ok =
      file.mimetype === 'application/json' ||
      file.mimetype === 'text/json' ||
      file.mimetype === 'application/octet-stream' ||
      file.originalname.toLowerCase().endsWith('.json');
    if (!ok) {
      return cb(new Error('Only JSON files are allowed'));
    }
    return cb(null, true);
  }
});

module.exports = { importUpload };


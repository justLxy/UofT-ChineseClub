const express = require('express');
const ImportController = require('../controllers/importController');
const { authenticateUser, requireAdminRole } = require('../middleware/auth');
const requireReauth = require('../middleware/requireReauth');
const { importUpload } = require('../middleware/importUpload');

const router = express.Router();

// NOTE: multer (importUpload) must run BEFORE requireReauth so req.body.password is available.
router.post(
  '/events',
  authenticateUser,
  requireAdminRole,
  importUpload.single('file'),
  requireReauth,
  ImportController.importEvents
);

router.post(
  '/staff',
  authenticateUser,
  requireAdminRole,
  importUpload.single('file'),
  requireReauth,
  ImportController.importStaff
);

router.post(
  '/full',
  authenticateUser,
  requireAdminRole,
  importUpload.single('file'),
  requireReauth,
  ImportController.importFullBackup
);

module.exports = router;


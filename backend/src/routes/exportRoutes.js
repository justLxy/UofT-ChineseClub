const express = require('express');
const ExportController = require('../controllers/exportController');
const { authenticateUser, requireAdminRole } = require('../middleware/auth');
const requireReauth = require('../middleware/requireReauth');

const router = express.Router();

// All export endpoints are admin-only and require re-authentication (password re-entry)
router.post('/events', authenticateUser, requireAdminRole, requireReauth, ExportController.exportEvents);
router.post('/staff', authenticateUser, requireAdminRole, requireReauth, ExportController.exportStaff);
router.post('/full', authenticateUser, requireAdminRole, requireReauth, ExportController.exportFullBackup);

module.exports = router;


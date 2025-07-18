const express = require('express');
const StaffController = require('../controllers/staffController');

const router = express.Router();

// Public team routes
router.get('/', StaffController.getTeamMembers);
router.get('/departments', StaffController.getDepartments);
router.get('/:id', StaffController.getTeamMemberById);

module.exports = router; 
const express = require('express');
const EventController = require('../controllers/eventController');
const { authenticateUser, requireEventManagement } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', EventController.getAllEvents);
router.get('/:id', EventController.getEventById);

// Admin routes (需要活动管理权限)
router.post('/', authenticateUser, requireEventManagement, EventController.createEvent);
router.put('/:id', authenticateUser, requireEventManagement, EventController.updateEvent);
router.delete('/:id', authenticateUser, requireEventManagement, EventController.deleteEvent);

module.exports = router; 
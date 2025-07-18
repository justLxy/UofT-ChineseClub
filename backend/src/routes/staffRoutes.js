const express = require('express');
const StaffController = require('../controllers/staffController');
const EventController = require('../controllers/eventController');
const { 
  authenticateUser, 
  requireEventManagement, 
  requireStaffManagement, 
  requireProfileReview 
} = require('../middleware/auth');
const { staffUpload, eventUpload } = require('../middleware/upload');

const router = express.Router();

// Staff profile routes (authenticated users only) - /api/staff/*
router.get('/profile', authenticateUser, StaffController.getStaffProfile);
router.post('/profile', authenticateUser, StaffController.saveStaffProfile);
router.post('/avatar', authenticateUser, staffUpload.single('avatar'), StaffController.uploadStaffAvatar);

// Admin routes - /api/admin/*
// 修改密码现在通过 /api/auth/password 处理

// Admin staff management
router.get('/staff', authenticateUser, requireStaffManagement, StaffController.getAllStaff);
router.post('/staff', authenticateUser, requireStaffManagement, StaffController.createStaffAccount);
router.put('/staff/:id', authenticateUser, requireStaffManagement, StaffController.updateStaffAccount);
router.delete('/staff/:id', authenticateUser, requireStaffManagement, StaffController.deleteStaffAccount);
router.delete('/staff', authenticateUser, requireStaffManagement, StaffController.batchDeleteStaffAccounts);

// Admin profile review
router.get('/profiles', authenticateUser, requireProfileReview, StaffController.getAllProfilesForReview);
router.put('/profiles/:id/review', authenticateUser, requireProfileReview, StaffController.reviewStaffProfile);

// Admin event image upload
router.post('/upload/image', authenticateUser, requireEventManagement, eventUpload.single('image'), EventController.uploadEventImage);

module.exports = router; 
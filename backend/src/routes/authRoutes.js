const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticateUser, requireStaffManagement } = require('../middleware/auth');

const router = express.Router();

// 统一登录
router.post('/login', AuthController.login);

// 用户相关路由
router.get('/me', authenticateUser, AuthController.getCurrentUser);
router.put('/password', authenticateUser, AuthController.changePassword);
router.get('/check-permission/:permission', authenticateUser, AuthController.checkPermission);

// 管理员功能路由
router.post('/users', authenticateUser, requireStaffManagement, AuthController.createUser);
router.put('/users/:userId/permissions', authenticateUser, requireStaffManagement, AuthController.updateUserPermissions);

module.exports = router; 
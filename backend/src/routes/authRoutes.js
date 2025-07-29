const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticateUser, requireStaffManagement } = require('../middleware/auth');

const router = express.Router();

// 统一登录
router.post('/login', AuthController.login);

// 邮箱验证码登录
router.post('/login-email', AuthController.loginWithEmail);

// 注册新用户
router.post('/register', AuthController.register);

// 发送验证码
router.post('/send-verification-code', AuthController.sendVerificationCode);

// 验证验证码
router.post('/verify-code', AuthController.verifyCode);

// 需要认证的路由
router.post('/change-password', authenticateUser, AuthController.changePassword);
router.post('/bind-email', authenticateUser, AuthController.bindEmail);

// 管理员路由 - 用户管理
router.get('/users', authenticateUser, requireStaffManagement, AuthController.getAllUsers);
router.put('/users/:userId/activation', authenticateUser, requireStaffManagement, AuthController.toggleUserActivation);

// 需要管理员权限的路由
router.get('/me', authenticateUser, AuthController.getCurrentUser);
router.get('/check-permission/:permission', authenticateUser, AuthController.checkPermission);

// 管理员功能路由
router.post('/users', authenticateUser, requireStaffManagement, AuthController.createUser);
router.put('/users/:userId/permissions', authenticateUser, requireStaffManagement, AuthController.updateUserPermissions);

module.exports = router; 
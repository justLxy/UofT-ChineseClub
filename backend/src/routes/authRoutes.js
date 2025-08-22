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

// 注销
router.post('/logout', AuthController.logout);

// 发送验证码
router.post('/send-verification-code', AuthController.sendVerificationCode);

// 验证验证码
router.post('/verify-code', AuthController.verifyCode);

// 需要认证的路由
router.post('/change-password', authenticateUser, AuthController.changePassword);

// 需要管理员权限的路由
router.get('/me', authenticateUser, AuthController.getCurrentUser);
router.get('/check-permission/:permission', authenticateUser, AuthController.checkPermission);

module.exports = router;

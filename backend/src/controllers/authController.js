const AuthService = require('../services/authService');

class AuthController {
  // 统一登录
  static async login(req, res) {
    try {
      const { identifier, password } = req.body;
      const result = await AuthService.login(identifier, password);
      res.json(result);
    } catch (error) {
      console.error('登录错误:', error);
      res.status(401).json({ error: error.message });
    }
  }

  // 修改密码
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await AuthService.changePassword(req.userId, currentPassword, newPassword);
      res.json(result);
    } catch (error) {
      console.error('修改密码错误:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // 获取当前用户信息
  static async getCurrentUser(req, res) {
    try {
      const user = await AuthService.getUserInfo(req.userId);
      res.json({ user });
    } catch (error) {
      console.error('获取用户信息错误:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // 检查权限
  static async checkPermission(req, res) {
    try {
      const { permission } = req.params;
      const hasPermission = await AuthService.checkPermission(req.userId, permission);
      res.json({ hasPermission });
    } catch (error) {
      console.error('检查权限错误:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // 创建新用户（管理员功能）
  static async createUser(req, res) {
    try {
      // 检查当前用户是否有管理员权限
      const hasPermission = await AuthService.checkPermission(req.userId, 'manageStaff');
      if (!hasPermission) {
        return res.status(403).json({ error: '权限不足' });
      }

      const user = await AuthService.createUser(req.body);
      res.json({ user, message: '用户创建成功' });
    } catch (error) {
      console.error('创建用户错误:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // 更新用户权限（管理员功能）
  static async updateUserPermissions(req, res) {
    try {
      // 检查当前用户是否有管理员权限
      const hasPermission = await AuthService.checkPermission(req.userId, 'manageStaff');
      if (!hasPermission) {
        return res.status(403).json({ error: '权限不足' });
      }

      const { userId } = req.params;
      const user = await AuthService.updateUserPermissions(parseInt(userId), req.body);
      res.json({ user, message: '权限更新成功' });
    } catch (error) {
      console.error('更新权限错误:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = AuthController; 
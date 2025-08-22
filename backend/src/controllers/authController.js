const AuthService = require('../services/authService');
const EmailService = require('../services/emailService');

class AuthController {
  static async login(req, res) {
    try {
      const { identifier, password } = req.body;
      const { token, user } = await AuthService.login(identifier, password);

      // 为了兼容Safari，同时设置Cookie和返回token
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      // 同时返回token给前端存储
      res.json({ user, token });
    } catch (error) {
      console.error('登录错误:', error);
      res.status(401).json({ error: error.message });
    }
  }

  static async loginWithEmail(req, res) {
    try {
      const { email, verificationCode } = req.body;
      const { token, user } = await AuthService.loginWithEmail(email, verificationCode);

      // 为了兼容Safari，同时设置Cookie和返回token
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      // 同时返回token给前端存储
      res.json({ user, token });
    } catch (error) {
      console.error('邮箱登录错误:', error);
      res.status(401).json({ error: error.message });
    }
  }

  static async logout(req, res) {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      expires: new Date(0)
    });
    res.status(200).json({ message: '注销成功' });
  }

  // 验证邮箱域名是否为允许的域名
  static validateEmailDomain(email) {
    const allowedDomain = '@mail.utoronto.ca';
    return email.toLowerCase().endsWith(allowedDomain);
  }

  // 发送验证码
  static async sendVerificationCode(req, res) {
    try {
      const { email, purpose = 'login' } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: '邮箱不能为空' });
      }

      // 对于注册目的，检查邮箱域名限制
      // if (purpose === 'register' && !AuthController.validateEmailDomain(email)) {
      //   return res.status(400).json({ 
      //     error: '注册仅限多伦多大学邮箱 (@mail.utoronto.ca)，其他邮箱请联系管理员手动创建账户' 
      //   });
      // }

      const result = await EmailService.sendVerificationCode(email, purpose);
      res.json(result);
    } catch (error) {
      console.error('发送验证码错误:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // 验证验证码
  static async verifyCode(req, res) {
    try {
      const { email, verificationCode } = req.body;
      
      if (!email || !verificationCode) {
        return res.status(400).json({ error: '邮箱和验证码不能为空' });
      }

      const result = await EmailService.verifyCode(email, verificationCode);
      res.json(result);
    } catch (error) {
      console.error('验证验证码错误:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // 注册新用户（需要邮箱验证）
  static async register(req, res) {
    try {
      const { email, username, password, verificationCode } = req.body;
      const result = await AuthService.register(email, username, password, verificationCode);
      res.json(result);
    } catch (error) {
      console.error('注册错误:', error);
      res.status(400).json({ error: error.message });
    }
  }



  // 管理员：激活/停用用户账号
  static async toggleUserActivation(req, res) {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;
      const result = await AuthService.toggleUserActivation(userId, isActive, req.userId);
      res.json(result);
    } catch (error) {
      console.error('Toggle user activation error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // 管理员：获取所有用户列表
  static async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 20, search = '' } = req.query;
      const result = await AuthService.getAllUsers(
        parseInt(page), 
        parseInt(limit), 
        search
      );
      res.json(result);
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
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

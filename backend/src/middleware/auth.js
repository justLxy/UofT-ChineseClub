const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');
const prisma = require('../config/database');

// 统一用户认证中间件
const authenticateUser = async (req, res, next) => {
  // 优先从Cookie获取token，如果没有则从Authorization header获取
  let token = req.cookies.token;
  
  // 如果Cookie中没有token，尝试从Authorization header获取
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return res.status(401).json({ error: '需要认证' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // 验证用户是否存在且激活
    const user = await prisma.staff.findUnique({
      where: { id: decoded.id },
      include: {
        profile: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: '用户不存在' });
    }

    // 刷新 Cookie 过期时间（滑动过期）
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 天
    });

    // 将用户信息添加到请求对象
    req.userId = decoded.id;
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      permissions: {
        canManageEvents: user.canManageEvents,
        canReviewProfiles: user.canReviewProfiles,
        canManageStaff: user.canManageStaff
      },
      hasProfile: !!user.profile,
      profileStatus: user.profile?.status || null
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: '无效或过期的token' });
  }
};

// 检查特定权限的中间件
const requirePermission = (permission) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: '需要认证' });
    }

    const { user } = req;

    // 检查用户是否激活（对于需要权限的操作）
    if (!user.isActive) {
      return res.status(403).json({ error: '账号未激活，无法执行此操作' });
    }

    let hasPermission = false;

    // 超级管理员拥有所有权限
    if (user.role === 'admin') {
      hasPermission = true;
    } else {
      // 检查特定权限
      switch (permission) {
        case 'manageEvents':
          hasPermission = user.permissions.canManageEvents;
          break;
        case 'reviewProfiles':
          hasPermission = user.permissions.canReviewProfiles;
          break;
        case 'manageStaff':
          hasPermission = user.permissions.canManageStaff;
          break;
        default:
          hasPermission = false;
      }
    }

    if (!hasPermission) {
      return res.status(403).json({ error: '权限不足' });
    }

    next();
  };
};

// 只允许管理员的中间件
const requireAdminRole = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: '需要认证' });
  }

  // 检查用户是否激活
  if (!req.user.isActive) {
    return res.status(403).json({ error: '账号未激活，无法执行此操作' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '需要管理员权限' });
  }

  next();
};

// 活动管理权限中间件
const requireEventManagement = requirePermission('manageEvents');

// 资料审核权限中间件
const requireProfileReview = requirePermission('reviewProfiles');

// 员工管理权限中间件
const requireStaffManagement = requirePermission('manageStaff');

module.exports = {
  authenticateUser,
  requirePermission,
  requireEventManagement,
  requireProfileReview,
  requireStaffManagement,
  requireAdminRole
};

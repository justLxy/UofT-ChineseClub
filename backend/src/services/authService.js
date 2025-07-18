const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { JWT_SECRET } = require('../config/constants');

class AuthService {

  // 统一登录 - 支持用户名或邮箱登录
  static async login(identifier, password) {
    if (!identifier || !password) {
      throw new Error('用户名/邮箱和密码不能为空');
    }
    
    // 查找用户 - 支持用户名或邮箱登录
    const searchConditions = [
      { username: identifier },
      { email: identifier }
    ];
    
    // 如果输入的不是邮箱格式（不包含@），则尝试补全为多伦多大学邮箱（向后兼容）
    if (!identifier.includes('@')) {
      searchConditions.push({ email: `${identifier}@mail.utoronto.ca` });
    }
    
    const staff = await prisma.staff.findFirst({
      where: {
        AND: [
          { OR: searchConditions },
          { isActive: true }
        ]
      },
      include: {
        profile: true
      }
    });
    
    if (!staff) {
      throw new Error('用户不存在或账户已被禁用');
    }
    
    // 验证密码
    const isValidPassword = await bcrypt.compare(password, staff.passwordHash);
    if (!isValidPassword) {
      throw new Error('密码错误');
    }
    
    // 更新最后登录时间
    await prisma.staff.update({
      where: { id: staff.id },
      data: { lastLogin: new Date() }
    });
    
    // 生成JWT token
    const token = jwt.sign(
      { 
        id: staff.id, 
        username: staff.username,
        email: staff.email,
        role: staff.role,
        permissions: {
          canManageEvents: staff.canManageEvents,
          canManageStaff: staff.canManageStaff,
          canReviewProfiles: staff.canReviewProfiles
        }
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    return { 
      token, 
      user: {
        id: staff.id,
        username: staff.username,
        email: staff.email,
        role: staff.role,
        permissions: {
          canManageEvents: staff.canManageEvents,
          canManageStaff: staff.canManageStaff,
          canReviewProfiles: staff.canReviewProfiles
        },
        hasProfile: !!staff.profile,
        profileStatus: staff.profile?.status || null
      },
      message: '登录成功' 
    };
  }

  // 修改密码
  static async changePassword(userId, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw new Error('当前密码和新密码不能为空');
    }
    
    if (newPassword.length < 6) {
      throw new Error('新密码长度至少为6位');
    }
    
    const staff = await prisma.staff.findUnique({
      where: { id: userId }
    });
    
    if (!staff) {
      throw new Error('用户不存在');
    }
    
    // 验证当前密码
    const isValidPassword = await bcrypt.compare(currentPassword, staff.passwordHash);
    if (!isValidPassword) {
      throw new Error('当前密码错误');
    }
    
    // 加密新密码
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    // 更新密码
    await prisma.staff.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash }
    });
    
    return { message: '密码修改成功' };
  }

  // 验证用户权限
  static async checkPermission(userId, permission) {
    const staff = await prisma.staff.findUnique({
      where: { id: userId }
    });
    
    if (!staff || !staff.isActive) {
      return false;
    }
    
    // 检查特定权限
    switch (permission) {
      case 'manageEvents':
        return staff.canManageEvents || staff.role === 'admin';
      case 'manageStaff':
        return staff.canManageStaff || staff.role === 'admin';
      case 'reviewProfiles':
        return staff.canReviewProfiles || staff.role === 'admin';

      default:
        return false;
    }
  }

  // 获取用户信息
  static async getUserInfo(userId) {
    const staff = await prisma.staff.findUnique({
      where: { id: userId },
      include: {
        profile: true
      }
    });
    
    if (!staff) {
      throw new Error('用户不存在');
    }
    
    return {
      id: staff.id,
      username: staff.username,
      email: staff.email,
      role: staff.role,
      permissions: {
        canManageEvents: staff.canManageEvents,
        canManageStaff: staff.canManageStaff,
        canReviewProfiles: staff.canReviewProfiles
      },
      hasProfile: !!staff.profile,
      profileStatus: staff.profile?.status || null,
      isActive: staff.isActive
    };
  }

  // 创建新用户（管理员功能）
  static async createUser(userData) {
    const { username, email, password, role = 'staff', permissions = {} } = userData;
    
    if (!username || !email || !password) {
      throw new Error('用户名、邮箱和密码不能为空');
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('请输入有效的邮箱格式');
    }
    
    // 检查用户名和邮箱是否已存在
    const existingUser = await prisma.staff.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });
    
    if (existingUser) {
      throw new Error('用户名或邮箱已存在');
    }
    
    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10);
    
    // 创建用户
    const staff = await prisma.staff.create({
      data: {
        username,
        email,
        passwordHash,
        role,
        canManageEvents: permissions.canManageEvents || false,
        canManageStaff: permissions.canManageStaff || false,
        canReviewProfiles: permissions.canReviewProfiles || false,
        isActive: true
      }
    });
    
    return {
      id: staff.id,
      username: staff.username,
      email: staff.email,
      role: staff.role,
      permissions: {
        canManageEvents: staff.canManageEvents,
        canManageStaff: staff.canManageStaff,
        canReviewProfiles: staff.canReviewProfiles
      }
    };
  }

  // 更新用户权限（管理员功能）
  static async updateUserPermissions(userId, permissions) {
    const staff = await prisma.staff.findUnique({
      where: { id: userId }
    });
    
    if (!staff) {
      throw new Error('用户不存在');
    }
    
    const updatedStaff = await prisma.staff.update({
      where: { id: userId },
      data: {
        canManageEvents: permissions.canManageEvents || false,
        canManageStaff: permissions.canManageStaff || false,
        canReviewProfiles: permissions.canReviewProfiles || false,
        role: permissions.role || staff.role
      }
    });
    
    return {
      id: updatedStaff.id,
      username: updatedStaff.username,
      email: updatedStaff.email,
      role: updatedStaff.role,
      permissions: {
        canManageEvents: updatedStaff.canManageEvents,
        canManageStaff: updatedStaff.canManageStaff,
        canReviewProfiles: updatedStaff.canReviewProfiles
      }
    };
  }
}

module.exports = AuthService; 
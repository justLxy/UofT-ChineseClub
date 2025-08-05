const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { JWT_SECRET } = require('../config/constants');
const EmailService = require('./emailService');

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
        OR: searchConditions
      },
      include: {
        profile: true
      }
    });
    
    if (!staff) {
      throw new Error('用户不存在');
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
        profileStatus: staff.profile?.status || null,
        isEmailVerified: staff.isEmailVerified,
        isActive: staff.isActive
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
    let { username, email, password, role = 'staff', permissions = {} } = userData;
    
    // 如果用户名为空，从邮箱中自动生成
    if (!username || !username.trim()) {
      if (!email) {
        throw new Error('邮箱不能为空');
      }
      username = email.split('@')[0];
    }
    
    if (!email) {
      throw new Error('邮箱不能为空');
    }
    
    // 如果密码为空，设置默认密码
    if (!password) {
      password = '123';
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

  // 通过邮箱验证码登录
  static async loginWithEmail(email, verificationCode) {
    if (!email || !verificationCode) {
      throw new Error('邮箱和验证码不能为空');
    }

    // 验证验证码
    const verificationResult = await EmailService.verifyCode(email, verificationCode);
    if (!verificationResult.success) {
      throw new Error('验证码验证失败');
    }

    // 查找用户
    const staff = await prisma.staff.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!staff) {
      throw new Error('用户不存在');
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
        profileStatus: staff.profile?.status || null,
        isEmailVerified: staff.isEmailVerified,
        isActive: staff.isActive  // 添加激活状态
      },
      message: '登录成功' 
    };
  }

  // 注册新用户（需要邮箱验证）
  static async register(email, username, password, verificationCode) {
    if (!email || !verificationCode) {
      throw new Error('邮箱和验证码不能为空');
    }

    // 验证验证码
    const verificationResult = await EmailService.verifyCode(email, verificationCode);
    if (!verificationResult.success) {
      throw new Error('验证码验证失败');
    }

    // 如果用户名为空，从邮箱中自动生成
    if (!username || !username.trim()) {
      username = email.split('@')[0];
    }

    // 如果密码为空，设置默认密码
    if (!password) {
      password = '123456';
    }

    if (password.length < 6) {
      throw new Error('密码长度至少为6位');
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('请输入有效的邮箱格式');
    }

    // // 验证邮箱域名限制（仅限多伦多大学邮箱注册）
    // const allowedDomain = '@mail.utoronto.ca';
    // if (!email.toLowerCase().endsWith(allowedDomain)) {
    //   throw new Error('注册仅限多伦多大学邮箱 (@mail.utoronto.ca)，其他邮箱请联系管理员手动创建账户');
    // }

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
      // 如果邮箱已存在但还没验证，允许重新注册
      if (existingUser.email === email && !existingUser.isEmailVerified) {
        // 更新用户信息
        const passwordHash = await bcrypt.hash(password, 10);
        
        const updatedStaff = await prisma.staff.update({
          where: { id: existingUser.id },
          data: {
            username,
            passwordHash,
            isEmailVerified: true,
            isActive: false  // 注册后默认未激活状态
          }
        });

        return {
          user: {
            id: updatedStaff.id,
            username: updatedStaff.username,
            email: updatedStaff.email,
            role: updatedStaff.role,
            isEmailVerified: updatedStaff.isEmailVerified,
            isActive: updatedStaff.isActive
          },
          message: '注册成功'
        };
      } else {
        throw new Error('用户名或邮箱已存在');
      }
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建新用户
    const staff = await prisma.staff.create({
      data: {
        username,
        email,
        passwordHash,
        role: 'staff',
        isActive: false,  // 注册后默认未激活状态
        isEmailVerified: true,
        canManageEvents: false,
        canManageStaff: false,
        canReviewProfiles: false
      }
    });

    return {
      user: {
        id: staff.id,
        username: staff.username,
        email: staff.email,
        role: staff.role,
        isEmailVerified: staff.isEmailVerified,
        isActive: staff.isActive
      },
      message: '注册成功'
    };
  }



  // 管理员激活/停用用户账号
  static async toggleUserActivation(userId, isActive, adminId) {
    if (typeof isActive !== 'boolean') {
      throw new Error('激活状态参数无效');
    }

    // 验证目标用户是否存在
    const targetUser = await prisma.staff.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        username: true,
        email: true,
        isActive: true,
        role: true
      }
    });

    if (!targetUser) {
      throw new Error('目标用户不存在');
    }

    // 防止停用管理员账号（安全措施）
    if (targetUser.role === 'admin' && !isActive) {
      throw new Error('不能停用管理员账号');
    }

    // 获取操作管理员信息
    const admin = await prisma.staff.findUnique({
      where: { id: adminId },
      select: { username: true }
    });

    // 更新用户激活状态
    const updatedUser = await prisma.staff.update({
      where: { id: parseInt(userId) },
      data: { isActive }
    });

    // 发送激活状态变更通知邮件
    try {
      await EmailService.sendAccountActivationNotification(
        targetUser.email,
        targetUser.username,
        isActive,
        admin?.username || '管理员'
      );
    } catch (emailError) {
      console.error('发送激活通知邮件失败:', emailError);
      // 不阻止激活操作，只记录错误
    }

    return {
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        isActive: updatedUser.isActive
      },
      message: `用户${isActive ? '激活' : '停用'}成功`
    };
  }

  // 获取所有用户列表（管理员功能）
  static async getAllUsers(page = 1, limit = 20, searchTerm = '') {
    const offset = (page - 1) * limit;
    
    const whereClause = searchTerm ? {
      OR: [
        { username: { contains: searchTerm } },
        { email: { contains: searchTerm } }
      ]
    } : {};

    const [users, total] = await Promise.all([
      prisma.staff.findMany({
        where: whereClause,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          isActive: true,
          isEmailVerified: true,
          createdAt: true,
          lastLogin: true,
          profile: {
            select: {
              name_zh: true,
              name_en: true,
              status: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.staff.count({
        where: whereClause
      })
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }
}

module.exports = AuthService; 
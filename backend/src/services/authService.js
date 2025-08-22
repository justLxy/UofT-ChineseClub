const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { JWT_SECRET } = require('../config/constants');
const EmailService = require('./emailService');

class AuthService {

  static async login(identifier, password) {
    if (!identifier || !password) {
      throw new Error('用户名/邮箱和密码不能为空');
    }
    
    const searchConditions = [
      { username: identifier },
      { email: identifier }
    ];
    
    if (!identifier.includes('@')) {
      searchConditions.push({ email: `${identifier}@mail.utoronto.ca` });
    }
    
    const staff = await prisma.staff.findFirst({
      where: { OR: searchConditions },
      include: { profile: true }
    });
    
    if (!staff) {
      throw new Error('用户不存在');
    }
    
    const isValidPassword = await bcrypt.compare(password, staff.passwordHash);
    if (!isValidPassword) {
      throw new Error('密码错误');
    }
    
    await prisma.staff.update({
      where: { id: staff.id },
      data: { lastLogin: new Date() }
    });
    
    const token = jwt.sign({ 
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

  static async changePassword(userId, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw new Error('当前密码和新密码不能为空');
    }
    if (newPassword.length < 6) {
      throw new Error('新密码长度至少为6位');
    }
    
    const staff = await prisma.staff.findUnique({ where: { id: userId } });
    if (!staff) {
      throw new Error('用户不存在');
    }
    
    const isValidPassword = await bcrypt.compare(currentPassword, staff.passwordHash);
    if (!isValidPassword) {
      throw new Error('当前密码错误');
    }
    
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    await prisma.staff.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash }
    });
    
    return { message: '密码修改成功' };
  }

  static async checkPermission(userId, permission) {
    const staff = await prisma.staff.findUnique({ where: { id: userId } });
    if (!staff || !staff.isActive) {
      return false;
    }
    
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

  static async getUserInfo(userId) {
    const staff = await prisma.staff.findUnique({
      where: { id: userId },
      include: { profile: true }
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



  static async updateUserPermissions(userId, permissions) {
    const staff = await prisma.staff.findUnique({ where: { id: userId } });
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

  static async loginWithEmail(email, verificationCode) {
    if (!email || !verificationCode) {
      throw new Error('邮箱和验证码不能为空');
    }

    const verificationResult = await EmailService.verifyCode(email, verificationCode);
    if (!verificationResult.success) {
      throw new Error(verificationResult.message || '验证码验证失败');
    }

    const staff = await prisma.staff.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!staff) {
      throw new Error('用户不存在');
    }

    await prisma.staff.update({
      where: { id: staff.id },
      data: { lastLogin: new Date() }
    });

    const token = jwt.sign({ 
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

  static async register(email, username, password, verificationCode) {
    if (!email || !verificationCode) {
      throw new Error('邮箱和验证码不能为空');
    }

    // 1. 验证验证码
    const verificationResult = await EmailService.verifyCode(email, verificationCode);
    if (!verificationResult.success) {
      throw new Error(verificationResult.message || '验证码验证失败');
    }

    // 2. 验证通过后，处理注册逻辑
    if (!username || !username.trim()) {
      username = email.split('@')[0];
    }

    if (!password || password.length < 6) {
      throw new Error('密码长度至少为6位');
    }

    // 3. 检查用户名和邮箱是否已存在
    const existingUser = await prisma.staff.findFirst({
      where: { OR: [{ username }, { email }] }
    });

    if (existingUser) {
      throw new Error('用户名或邮箱已存在');
    }

    // 4. 加密密码
    const passwordHash = await bcrypt.hash(password, 10);

    // 5. 创建新用户
    const staff = await prisma.staff.create({
      data: {
        username,
        email,
        passwordHash,
        role: 'staff',
        isActive: false,  // 注册后默认未激活状态
        isEmailVerified: true, // 邮箱通过验证码验证，所以为 true
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
      message: '注册成功，等待管理员激活'
    };
  }

  static async toggleUserActivation(userId, isActive, adminId) {
    if (typeof isActive !== 'boolean') {
      throw new Error('激活状态参数无效');
    }

    const parsedUserId = parseInt(userId);

    // **安全校验：防止管理员停用自己**
    if (parsedUserId === adminId && !isActive) {
      throw new Error('您不能停用自己的账户。');
    }

    const targetUser = await prisma.staff.findUnique({
      where: { id: parsedUserId },
      select: { id: true, username: true, email: true, isActive: true, role: true }
    });

    if (!targetUser) {
      throw new Error('目标用户不存在');
    }

    if (targetUser.role === 'admin' && !isActive) {
      throw new Error('不能停用其他管理员账号。');
    }

    const admin = await prisma.staff.findUnique({
      where: { id: adminId },
      select: { username: true }
    });

    const updatedUser = await prisma.staff.update({
      where: { id: parsedUserId },
      data: { isActive }
    });

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

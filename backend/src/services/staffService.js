const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
const prisma = require('../config/database');
const { transformTeamMemberByLanguage } = require('../utils/fileUtils');

class StaffService {
  // Get staff profile (own profile)
  static async getStaffProfile(staffId) {
    const profile = await prisma.staffProfile.findUnique({
      where: { staffId: staffId },
      include: {
        staff: {
          select: {
            username: true,
            email: true,
            role: true
          }
        }
      }
    });

    // Process avatar URL to ensure it's a relative path
    if (profile && profile.avatarUrl) {
      // Check if avatarUrl is not already a relative or complete URL
      if (!profile.avatarUrl.startsWith('/') && !profile.avatarUrl.startsWith('http')) {
        profile.avatarUrl = `/uploads/staff/${profile.avatarUrl}`;
      }
    }

    return profile;
  }

  // Create or update staff profile
  static async saveStaffProfile(staffId, profileData, username) {
    const {
      name_en,
      name_zh,
      position_en,
      position_zh,
      department,
      bio_en,
      bio_zh,
      avatarUrl,
      email,
      linkedin,
      github,
      wechat,
      phone
    } = profileData;
    
    // Validation
    if (!name_en || !name_zh || !position_en || !position_zh || !department) {
      throw new Error('Required fields missing');
    }
    
    // Check if profile exists
    const existingProfile = await prisma.staffProfile.findUnique({
      where: { staffId: staffId }
    });
    
    const profileSaveData = {
      name_en,
      name_zh,
      position_en,
      position_zh,
      department,
      bio_en,
      bio_zh,
      avatarUrl,
      email,
      linkedin,
      github,
      wechat,
      phone,
      status: 'pending', // Reset to pending when updated
      isVisible: false // Hide until approved
    };
    
    let profile;
    if (existingProfile) {
      // Update existing profile
      profile = await prisma.staffProfile.update({
        where: { staffId: staffId },
        data: profileSaveData
      });
      
      // Log history
      await prisma.staffProfileHistory.create({
        data: {
          staffId: staffId,
          profileData: JSON.stringify(profileSaveData),
          action: 'updated',
          actionBy: username
        }
      });
    } else {
      // Create new profile
      profile = await prisma.staffProfile.create({
        data: {
          ...profileSaveData,
          staffId: staffId
        }
      });
      
      // Log history
      await prisma.staffProfileHistory.create({
        data: {
          staffId: staffId,
          profileData: JSON.stringify(profileSaveData),
          action: 'created',
          actionBy: username
        }
      });
    }
    
    return { 
      profile, 
      message: 'Profile submitted for review' 
    };
  }

  // Upload staff avatar
  static async uploadStaffAvatar(req) {
    if (!req.file) {
      throw new Error('No avatar file provided');
    }
    
    const staffId = req.userId;
    
    // Get staff information for username
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: { username: true }
    });
    
    if (!staff) {
      throw new Error('Staff not found');
    }
    
    // Check if staff profile exists first
    const existingProfile = await prisma.staffProfile.findUnique({
      where: { staffId }
    });

    if (!existingProfile) {
      // Delete the uploaded file since we won't use it
      try {
        await fs.unlink(req.file.path);
      } catch (error) {
        console.warn('Warning: Could not delete uploaded file:', error.message);
      }
      throw new Error('请先完善个人资料后再上传头像');
    }
    
    // Delete old avatar file if it exists
    if (existingProfile.avatarUrl) {
      await StaffService.deleteOldAvatar(existingProfile.avatarUrl);
    }
    
    // Generate new filename with username and timestamp
    const fileExtension = path.extname(req.file.originalname);
    const timestamp = Date.now();
    const newFilename = `${staff.username}-${timestamp}${fileExtension}`;
    
    // Move uploaded file to new location with new name
    const oldPath = req.file.path;
    const newPath = path.join(path.dirname(oldPath), newFilename);
    
    try {
      await fs.rename(oldPath, newPath);
    } catch (error) {
      console.error('Error renaming avatar file:', error);
      throw new Error('Failed to process avatar file');
    }
    
    // Generate the avatar relative path
    const avatarUrl = `/uploads/staff/${newFilename}`;

    // Update existing staff profile with the new avatar URL
    await prisma.staffProfile.update({
      where: { staffId },
      data: { 
        avatarUrl,
        updatedAt: new Date()
      }
    });
    
    return { 
      avatarUrl, 
      message: 'Avatar uploaded and saved successfully' 
    };
  }

  // Helper method to delete old avatar file
  static async deleteOldAvatar(avatarUrl) {
    try {
      // Extract filename from URL
      // avatarUrl format: http://localhost:5000/uploads/staff/filename.jpg
      const urlParts = avatarUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      
      // Construct file path
      const filePath = path.join(__dirname, '../../uploads/staff', filename);
      
      // Check if file exists and delete it
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log(`Deleted old avatar: ${filename}`);
      } catch (error) {
        // File doesn't exist or can't be accessed, ignore
        if (error.code !== 'ENOENT') {
          console.warn(`Warning: Could not delete old avatar ${filename}:`, error.message);
        }
      }
    } catch (error) {
      console.warn('Warning: Error processing old avatar deletion:', error.message);
    }
  }

  // Admin: Get all staff accounts
  static async getAllStaff() {
    const staffData = await prisma.staff.findMany({
      include: {
        profile: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Process avatar URLs for all staff profiles
    const processedStaff = staffData.map(staff => {
      if (staff.profile && staff.profile.avatarUrl && !staff.profile.avatarUrl.startsWith('/') && !staff.profile.avatarUrl.startsWith('http')) {
        staff.profile.avatarUrl = `/uploads/staff/${staff.profile.avatarUrl}`;
      }
      return staff;
    });

    return processedStaff;
  }

  // Admin: Create staff account
  static async createStaffAccount(staffData) {
    const { 
      username, 
      email, 
      password, 
      role = 'staff',
      permissions = {}
    } = staffData;
    
    if (!username || !email || !password) {
      throw new Error('用户名、邮箱和密码不能为空');
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('请输入有效的邮箱格式');
    }
    
    // Check if username or email already exists
    const existingStaff = await prisma.staff.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });
    
    if (existingStaff) {
      throw new Error('用户名或邮箱已存在');
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    const newStaff = await prisma.staff.create({
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
    
    // Remove password hash from response
    const { passwordHash: _, ...staffResponse } = newStaff;
    
    return { 
      staff: staffResponse, 
      message: '员工账户创建成功' 
    };
  }

  // Admin: Update staff account
  static async updateStaffAccount(id, updateData) {
    const { 
      username, 
      email, 
      password,
      isActive, 
      role,
      permissions = {},
      profileUpdate = {}
    } = updateData;
    
    const updateFields = {};
    if (username !== undefined) updateFields.username = username;
    if (email !== undefined) updateFields.email = email;
    if (password !== undefined) updateFields.passwordHash = await bcrypt.hash(password, 10);
    if (isActive !== undefined) updateFields.isActive = isActive;
    if (role !== undefined) updateFields.role = role;
    
    // 更新权限字段
    if (permissions.canManageEvents !== undefined) updateFields.canManageEvents = permissions.canManageEvents;
    if (permissions.canManageStaff !== undefined) updateFields.canManageStaff = permissions.canManageStaff;
    if (permissions.canReviewProfiles !== undefined) updateFields.canReviewProfiles = permissions.canReviewProfiles;
    
    const updatedStaff = await prisma.staff.update({
      where: { id: parseInt(id) },
      data: updateFields,
      include: {
        profile: true
      }
    });
    
    // 更新 Staff Profile 信息（如果提供了 profileUpdate）
    if (profileUpdate && Object.keys(profileUpdate).length > 0) {
      const existingProfile = await prisma.staffProfile.findUnique({
        where: { staffId: parseInt(id) }
      });

      if (existingProfile) {
        // 保留原有状态字段，除非调用方显式提供新状态
        const { status: _status, reviewedAt: _ra, reviewedBy: _rb, createdAt: _ca, updatedAt: _ua, id: _pid, staffId: _sid, ...updatableFields } = profileUpdate;

        await prisma.staffProfile.update({
          where: { staffId: parseInt(id) },
          data: {
            ...updatableFields,
            updatedAt: new Date(),
          }
        });
      } else {
        // 如果该员工尚未创建资料，则直接创建
        await prisma.staffProfile.create({
          data: {
            ...profileUpdate,
            staffId: parseInt(id),
            // 新建资料默认设为 approved 并可见，管理员可稍后调整
            status: 'approved',
            isVisible: true,
          }
        });
      }
    }

    // 重新获取更新后的数据（包含 profile）
    const refreshedStaff = await prisma.staff.findUnique({
      where: { id: parseInt(id) },
      include: {
        profile: true,
      },
    });

    return {
      staff: refreshedStaff,
      message: 'Staff account and profile updated successfully',
    };
  }

  // Admin: Delete staff account
  static async deleteStaffAccount(id) {
    // Get staff profile to check for avatar before deletion
    const staffProfile = await prisma.staffProfile.findUnique({
      where: { staffId: parseInt(id) }
    });
    
    // Delete avatar file if it exists
    if (staffProfile?.avatarUrl) {
      await StaffService.deleteOldAvatar(staffProfile.avatarUrl);
    }
    
    // Delete staff and related data (cascade)
    await prisma.staff.delete({
      where: { id: parseInt(id) }
    });
    
    return { message: 'Staff account deleted successfully' };
  }

  // Admin: Batch delete staff accounts
  static async batchDeleteStaffAccounts(ids) {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new Error('Invalid or empty IDs array');
    }

    const intIds = ids.map(id => parseInt(id));
    
    // Get all staff profiles to check for avatars before deletion
    const staffProfiles = await prisma.staffProfile.findMany({
      where: { staffId: { in: intIds } }
    });
    
    // Delete avatar files if they exist
    for (const profile of staffProfiles) {
      if (profile.avatarUrl) {
        await StaffService.deleteOldAvatar(profile.avatarUrl);
      }
    }
    
    // Delete staff accounts and related data (cascade)
    const deleteResult = await prisma.staff.deleteMany({
      where: { id: { in: intIds } }
    });
    
    return { 
      message: `Successfully deleted ${deleteResult.count} staff account(s)`,
      deletedCount: deleteResult.count
    };
  }

  // Admin: Get all staff profiles for review
  static async getAllProfilesForReview(status) {
    let whereCondition = {};
    
    if (status) {
      whereCondition.status = status;
    } else {
      // 默认只显示 pending 和 rejected 状态的资料
      whereCondition.status = {
        in: ['pending', 'rejected']
      };
    }
    
    const profiles = await prisma.staffProfile.findMany({
      where: whereCondition,
      include: {
        staff: {
          select: {
            username: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Process avatar URLs for all profiles
    const processedProfiles = profiles.map(profile => {
      if (profile.avatarUrl && !profile.avatarUrl.startsWith('/') && !profile.avatarUrl.startsWith('http')) {
        profile.avatarUrl = `/uploads/staff/${profile.avatarUrl}`;
      }
      return profile;
    });

    return processedProfiles;
  }

  // Admin: Review staff profile
  static async reviewStaffProfile(id, reviewData) {
    const { status, reviewNote, displayOrder } = reviewData;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      throw new Error('Invalid review status');
    }
    
    const updateData = {
      status,
      reviewNote,
      isVisible: status === 'approved'
    };
    
    // Only update reviewedAt and reviewedBy if status is not pending
    if (status !== 'pending') {
      updateData.reviewedAt = new Date();
      updateData.reviewedBy = 'admin';
    }
    
    if (status === 'approved' && displayOrder !== undefined) {
      updateData.displayOrder = displayOrder;
    }
    
    const updatedProfile = await prisma.staffProfile.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        staff: {
          select: {
            username: true,
            email: true
          }
        }
      }
    });
    
    // Log history
    await prisma.staffProfileHistory.create({
      data: {
        staffId: updatedProfile.staffId,
        profileData: JSON.stringify(updatedProfile),
        action: status,
        actionBy: 'admin',
        actionNote: reviewNote
      }
    });
    
    return { 
      profile: updatedProfile, 
      message: `Profile ${status} successfully` 
    };
  }

  // Public: Get all approved team members
  static async getTeamMembers(department, language = 'en') {
    const whereCondition = {
      status: 'approved',
      isVisible: true,
      staff: {
        isActive: true
      }
    };
    
    if (department) {
      whereCondition.department = department;
    }
    
    const teamMembers = await prisma.staffProfile.findMany({
      where: whereCondition,
      include: {
        staff: {
          select: {
            username: true,
            email: true
          }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });
    
    // Process avatar URLs for all team members
    const processedMembers = teamMembers.map(member => {
      if (member.avatarUrl && !member.avatarUrl.startsWith('/') && !member.avatarUrl.startsWith('http')) {
        member.avatarUrl = `/uploads/staff/${member.avatarUrl}`;
      }
      return member;
    });
    
    return processedMembers.map(member => transformTeamMemberByLanguage(member, language));
  }

  // Public: Get team member by ID
  static async getTeamMemberById(id, language = 'en') {
    const member = await prisma.staffProfile.findUnique({
      where: { 
        id: parseInt(id),
        status: 'approved',
        isVisible: true,
        staff: {
          isActive: true
        }
      },
      include: {
        staff: {
          select: {
            username: true,
            email: true
          }
        }
      }
    });
    
    if (!member) {
      throw new Error('Team member not found');
    }
    
    // Process avatar URL
    if (member.avatarUrl && !member.avatarUrl.startsWith('/') && !member.avatarUrl.startsWith('http')) {
      member.avatarUrl = `/uploads/staff/${member.avatarUrl}`;
    }
    
    return transformTeamMemberByLanguage(member, language);
  }

  // Public: Get unique departments
  static async getDepartments() {
    const departments = await prisma.staffProfile.groupBy({
      by: ['department'],
      where: { 
        status: 'approved',
        isVisible: true,
        staff: {
          isActive: true
        }
      },
      _count: {
        department: true
      },
      orderBy: {
        department: 'asc'
      }
    });
    
    return departments.map(dept => ({
      name: dept.department,
      count: dept._count.department
    }));
  }
}

module.exports = StaffService; 
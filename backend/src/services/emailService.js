const { Resend } = require('resend');
const prisma = require('../config/database');
const crypto = require('crypto');

// 初始化 Resend 客户端npp
const resend = new Resend(process.env.RESEND_API_KEY);

class EmailService {
  // 生成6位数字验证码
  static generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // 发送验证码邮件
  static async sendVerificationCode(email, purpose = 'verification') {
    try {
      // 检查是否是有效的邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('请输入有效的邮箱格式');
      }

      // 查找用户
      let staff = await prisma.staff.findUnique({
        where: { email }
      });

      // 根据用途进行不同的检查
      if (purpose === 'register') {
        if (staff && (staff.isEmailVerified || staff.isActive)) {
          throw new Error('该邮箱已被注册，请使用其他邮箱或直接登录');
        }
        // 如果邮箱不存在，创建一个临时用户记录用于发送验证码
        if (!staff) {
          staff = await prisma.staff.create({
            data: {
              username: email.split('@')[0], // 临时用户名
              email,
              passwordHash: 'temp', // 临时密码，注册时会被覆盖
              isEmailVerified: false,
              isActive: false
            }
          });
        }
      } else {
        // 登录/绑定场景：邮箱必须存在
        if (!staff) {
          throw new Error('邮箱不存在');
        }
      }

      // 检查上次发送验证码的时间（防止频繁发送）
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
      
      if (staff.lastVerificationCodeSent && staff.lastVerificationCodeSent > oneMinuteAgo) {
        throw new Error('验证码发送过于频繁，请1分钟后再试');
      }

      // 生成验证码
      const verificationCode = this.generateVerificationCode();
      const expiryTime = new Date(now.getTime() + 10 * 60 * 1000); // 10分钟有效期

      // 更新数据库中的验证码信息
      await prisma.staff.update({
        where: { email },
        data: {
          verificationCode,
          verificationCodeExpiry: expiryTime,
          verificationCodeAttempts: 0,
          lastVerificationCodeSent: now
        }
      });

      // 根据用途选择邮件模板
      let subject, html;
      switch (purpose) {
        case 'login':
          subject = 'UTChinese Network - 登录验证码';
          html = this.generateLoginEmailTemplate(verificationCode, staff.username);
          break;
        case 'register':
          subject = 'UTChinese Network - 注册验证码';
          html = this.generateRegisterEmailTemplate(verificationCode, staff.username);
          break;
        case 'bind':
          subject = 'UTChinese Network - 邮箱绑定验证码';
          html = this.generateBindEmailTemplate(verificationCode, staff.username);
          break;
        default:
          subject = 'UTChinese Network - 验证码';
          html = this.generateVerificationEmailTemplate(verificationCode, staff.username);
      }

      // 发送邮件
      const { data, error } = await resend.emails.send({
        from: 'UTChinese Network <no-reply@utchinese.ca>',
        to: email,
        subject,
        html
      });

      if (error) {
        console.error('发送邮件失败:', error);
        throw new Error('发送验证码失败，请稍后重试');
      }

      console.log('验证码邮件发送成功:', data);
      return {
        success: true,
        message: '验证码已发送，请查看您的邮箱',
        expiryTime: expiryTime.toISOString()
      };

    } catch (error) {
      console.error('发送验证码错误:', error);
      throw error;
    }
  }

  // 验证验证码
  static async verifyCode(email, code) {
    try {
      const staff = await prisma.staff.findUnique({
        where: { email }
      });

      if (!staff) {
        throw new Error('邮箱不存在');
      }

      // 检查验证码是否存在
      if (!staff.verificationCode) {
        throw new Error('请先获取验证码');
      }

      // 检查验证码是否过期
      const now = new Date();
      if (!staff.verificationCodeExpiry || staff.verificationCodeExpiry < now) {
        // 清空过期的验证码
        await prisma.staff.update({
          where: { email },
          data: {
            verificationCode: null,
            verificationCodeExpiry: null,
            verificationCodeAttempts: 0
          }
        });
        throw new Error('验证码已过期，请重新获取');
      }

      // 检查尝试次数
      if (staff.verificationCodeAttempts >= 3) {
        // 清空验证码（防止暴力破解）
        await prisma.staff.update({
          where: { email },
          data: {
            verificationCode: null,
            verificationCodeExpiry: null,
            verificationCodeAttempts: 0
          }
        });
        throw new Error('验证码尝试次数过多，请重新获取');
      }

      // 验证验证码
      if (staff.verificationCode !== code) {
        // 增加尝试次数
        await prisma.staff.update({
          where: { email },
          data: {
            verificationCodeAttempts: staff.verificationCodeAttempts + 1
          }
        });
        
        const remainingAttempts = 3 - (staff.verificationCodeAttempts + 1);
        throw new Error(`验证码错误，还有${remainingAttempts}次尝试机会`);
      }

      // 验证成功，清空验证码并标记邮箱已验证
      await prisma.staff.update({
        where: { email },
        data: {
          verificationCode: null,
          verificationCodeExpiry: null,
          verificationCodeAttempts: 0,
          isEmailVerified: true
        }
      });

      return {
        success: true,
        message: '验证码验证成功',
        staffId: staff.id
      };

    } catch (error) {
      console.error('验证验证码错误:', error);
      throw error;
    }
  }

  // 登录邮件模板
  static generateLoginEmailTemplate(code, username) {
    return `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 10px;">
            <img src="${process.env.FRONTEND_URL || 'http://localhost:3000'}/logo.png" alt="多大中文 Logo" style="height: 40px; width: auto;" onerror="this.style.display='none'">
            <h1 style="margin: 0; font-size: 28px;">UTChinese Network</h1>
          </div>
          <p style="margin: 10px 0 0; opacity: 0.9;">多大中文</p>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">您好，${username}！</h2>
          <p style="color: #666; margin-bottom: 30px;">您正在尝试登录 UTChinese Network 账户，请使用以下验证码完成登录：</p>
          
          <div style="background: #f8f9fa; border: 2px dashed #dc2626; border-radius: 10px; padding: 25px; text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #dc2626; letter-spacing: 8px;">${code}</span>
          </div>
          
          <p style="color: #666; margin-bottom: 20px;">验证码有效期为 <strong>10分钟</strong>，请尽快使用。</p>
          <p style="color: #999; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            如果您没有尝试登录，请忽略此邮件。为了账户安全，请不要将验证码告知他人。
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">© 2024 UTChinese Network. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
  }

  // 注册邮件模板
  static generateRegisterEmailTemplate(code, username) {
    return `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 10px;">
            <img src="${process.env.FRONTEND_URL || 'http://localhost:3000'}/logo.png" alt="多大中文 Logo" style="height: 40px; width: auto;" onerror="this.style.display='none'">
            <h1 style="margin: 0; font-size: 28px;">欢迎加入 UTChinese Network!</h1>
          </div>
          <p style="margin: 10px 0 0; opacity: 0.9;">多大中文</p>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">您好，${username}！</h2>
          <p style="color: #666; margin-bottom: 30px;">感谢您注册 UTChinese Network 账户！请使用以下验证码完成邮箱验证：</p>
          
          <div style="background: #f8f9fa; border: 2px dashed #dc2626; border-radius: 10px; padding: 25px; text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #dc2626; letter-spacing: 8px;">${code}</span>
          </div>
          
          <p style="color: #666; margin-bottom: 20px;">验证码有效期为 <strong>10分钟</strong>，请尽快使用。</p>
          <p style="color: #999; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            验证成功后，您就可以正常使用所有功能了。为了账户安全，请不要将验证码告知他人。
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">© 2024 UTChinese Network. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
  }

  // 邮箱绑定模板
  static generateBindEmailTemplate(code, username) {
    return `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 10px;">
            <img src="${process.env.FRONTEND_URL || 'http://localhost:3000'}/logo.png" alt="多大中文 Logo" style="height: 40px; width: auto;" onerror="this.style.display='none'">
            <h1 style="margin: 0; font-size: 28px;">UTChinese Network</h1>
          </div>
          <p style="margin: 10px 0 0; opacity: 0.9;">多大中文 - 邮箱绑定验证</p>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">您好，${username}！</h2>
          <p style="color: #666; margin-bottom: 30px;">您正在绑定新的邮箱地址，请使用以下验证码完成绑定：</p>
          
          <div style="background: #f8f9fa; border: 2px dashed #dc2626; border-radius: 10px; padding: 25px; text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #dc2626; letter-spacing: 8px;">${code}</span>
          </div>
          
          <p style="color: #666; margin-bottom: 20px;">验证码有效期为 <strong>10分钟</strong>，请尽快使用。</p>
          <p style="color: #999; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            如果您没有尝试绑定邮箱，请忽略此邮件。为了账户安全，请不要将验证码告知他人。
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">© 2024 UTChinese Network. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
  }

  // 通用验证邮件模板
  static generateVerificationEmailTemplate(code, username) {
    return this.generateLoginEmailTemplate(code, username);
  }

  // 发送个人资料审核通知给管理员
  static async sendProfileReviewNotification(userProfile, userEmail, userName) {
    try {
      // 获取所有管理员邮箱
      const adminEmails = await this.getAdminEmails();
      
      if (adminEmails.length === 0) {
        console.warn('No admin emails found for profile review notification');
        return { success: false, message: 'No admin emails configured' };
      }

      const subject = 'UTChinese Network - 新的个人资料待审核';
      const html = this.generateProfileReviewNotificationTemplate(userProfile, userEmail, userName);

      const sendPromises = adminEmails.map(async (adminEmail) => {
        const { data, error } = await resend.emails.send({
          from: 'UTChinese Network <no-reply@utchinese.ca>',
          to: adminEmail,
          subject,
          html
        });

        if (error) {
          console.error(`发送审核通知给 ${adminEmail} 失败:`, error);
          throw error;
        }
        
        return data;
      });

      await Promise.all(sendPromises);
      
      console.log('个人资料审核通知邮件发送成功');
      return {
        success: true,
        message: '审核通知已发送给管理员',
        adminCount: adminEmails.length
      };

    } catch (error) {
      console.error('发送个人资料审核通知错误:', error);
      throw error;
    }
  }

  // 发送审核结果通知给用户
  static async sendProfileReviewResult(userEmail, userName, reviewResult, reviewNote = '') {
    try {
      const isApproved = reviewResult === 'approved';
      const subject = `UTChinese Network - 个人资料审核${isApproved ? '通过' : '未通过'}`;
      const html = this.generateProfileReviewResultTemplate(userName, isApproved, reviewNote);

      const { data, error } = await resend.emails.send({
        from: 'UTChinese Network <no-reply@utchinese.ca>',
        to: userEmail,
        subject,
        html
      });

      if (error) {
        console.error('发送审核结果通知失败:', error);
        throw error;
      }

      console.log('个人资料审核结果通知邮件发送成功:', data);
      return {
        success: true,
        message: '审核结果通知已发送'
      };

    } catch (error) {
      console.error('发送个人资料审核结果错误:', error);
      throw error;
    }
  }

  // 发送账号激活/停用通知邮件
  static async sendAccountActivationNotification(userEmail, userName, isActivated, adminName) {
    try {
      const status = isActivated ? '激活' : '停用';
      const subject = `UTChinese Network - 账号${status}通知`;
      const html = this.generateAccountActivationTemplate(userName, isActivated, adminName);

      const { data, error } = await resend.emails.send({
        from: 'UTChinese Network <no-reply@utchinese.ca>',
        to: userEmail,
        subject,
        html
      });

      if (error) {
        console.error(`发送账号${status}通知失败:`, error);
        throw error;
      }

      console.log(`账号${status}通知邮件发送成功:`, data);
      return {
        success: true,
        message: `账号${status}通知已发送`
      };

    } catch (error) {
      console.error(`发送账号激活通知错误:`, error);
      throw error;
    }
  }

  // 获取管理员邮箱列表
  static async getAdminEmails() {
    try {
      const admins = await prisma.staff.findMany({
        where: {
          OR: [
            { role: 'admin' },
            { canReviewProfiles: true }
          ],
          isActive: true
        },
        select: {
          email: true
        }
      });

      return admins.map(admin => admin.email);
    } catch (error) {
      console.error('获取管理员邮箱列表错误:', error);
      return [];
    }
  }

  // 个人资料审核通知邮件模板（发给管理员）
  static generateProfileReviewNotificationTemplate(userProfile, userEmail, userName) {
    return `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 10px;">
            <img src="${process.env.FRONTEND_URL || 'http://localhost:3000'}/logo.png" alt="多大中文 Logo" style="height: 40px; width: auto;" onerror="this.style.display='none'">
            <h1 style="margin: 0; font-size: 28px;">UTChinese Network</h1>
          </div>
          <p style="margin: 10px 0 0; opacity: 0.9;">多大中文 - 管理员通知</p>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">📋 新的个人资料待审核</h2>
          <p style="color: #666; margin-bottom: 30px;">用户 <strong>${userName}</strong> 提交了个人资料，请及时审核。</p>
          
          <div style="background: #f8f9fa; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0;">
            <h3 style="color: #dc2626; margin: 0 0 15px;">📊 资料信息</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold; color: #555; width: 120px;">用户邮箱：</td>
                <td style="padding: 8px 0; color: #333;">${userEmail}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold; color: #555;">中文姓名：</td>
                <td style="padding: 8px 0; color: #333;">${userProfile.name_zh || '未填写'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold; color: #555;">英文姓名：</td>
                <td style="padding: 8px 0; color: #333;">${userProfile.name_en || '未填写'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold; color: #555;">部门：</td>
                <td style="padding: 8px 0; color: #333;">${userProfile.department || '未填写'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold; color: #555;">中文职位：</td>
                <td style="padding: 8px 0; color: #333;">${userProfile.position_zh || '未填写'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">英文职位：</td>
                <td style="padding: 8px 0; color: #333;">${userProfile.position_en || '未填写'}</td>
              </tr>
            </table>
          </div>

          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-weight: 500;">
              🔔 请登录管理后台及时处理此审核请求，确保团队信息的及时更新。
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/staff" 
               style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 600; display: inline-block;">
              前往审核
            </a>
          </div>

          <p style="color: #999; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            此邮件由系统自动发送，请及时处理审核请求。如有问题，请联系技术支持。
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">© 2024 UTChinese Network. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
  }

  // 个人资料审核结果邮件模板（发给用户）
  static generateProfileReviewResultTemplate(userName, isApproved, reviewNote) {
    const status = isApproved ? '通过' : '未通过';
    const statusColor = isApproved ? '#10b981' : '#ef4444';
    const statusIcon = isApproved ? '✅' : '❌';
    const bgColor = isApproved ? '#d1fae5' : '#fee2e2';
    const borderColor = isApproved ? '#10b981' : '#ef4444';

    return `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 10px;">
            <img src="${process.env.FRONTEND_URL || 'http://localhost:3000'}/logo.png" alt="多大中文 Logo" style="height: 40px; width: auto;" onerror="this.style.display='none'">
            <h1 style="margin: 0; font-size: 28px;">UTChinese Network</h1>
          </div>
          <p style="margin: 10px 0 0; opacity: 0.9;">多大中文 - 审核结果通知</p>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">您好，${userName}！</h2>
          
          <div style="background: ${bgColor}; border-left: 4px solid ${borderColor}; padding: 25px; margin: 30px 0; border-radius: 0 8px 8px 0;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
              <span style="font-size: 24px;">${statusIcon}</span>
              <h3 style="margin: 0; color: ${statusColor};">个人资料审核${status}</h3>
            </div>
            
            ${isApproved 
              ? '<p style="margin: 0; color: #065f46;">恭喜！您的个人资料已通过审核，现在可以在团队页面中展示了。感谢您的耐心等待！</p>'
              : '<p style="margin: 0; color: #991b1b;">很抱歉，您的个人资料未能通过审核。请根据下方反馈意见修改后重新提交。</p>'
            }
          </div>

          ${reviewNote ? `
            <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h4 style="color: #dc2626; margin: 0 0 10px;">📝 审核意见：</h4>
              <p style="margin: 0; color: #555; font-style: italic;">"${reviewNote}"</p>
            </div>
          ` : ''}

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile" 
               style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 600; display: inline-block;">
              ${isApproved ? '查看我的资料' : '修改个人资料'}
            </a>
          </div>

          ${!isApproved ? `
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-weight: 500;">
                💡 提示：请根据审核意见调整您的个人资料，然后重新提交审核。我们会尽快为您处理。
              </p>
            </div>
          ` : ''}

          <p style="color: #999; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            如有任何疑问，请联系管理员。感谢您对 UTChinese Network 的支持！
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">© 2024 UTChinese Network. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
  }

  // 账号激活/停用通知邮件模板
  static generateAccountActivationTemplate(userName, isActivated, adminName) {
    const status = isActivated ? '激活' : '停用';
    const statusColor = isActivated ? '#10b981' : '#ef4444';
    const statusIcon = isActivated ? '✅' : '⏸️';
    const bgColor = isActivated ? '#d1fae5' : '#fee2e2';
    const borderColor = isActivated ? '#10b981' : '#ef4444';

    return `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 10px;">
            <img src="${process.env.FRONTEND_URL || 'http://localhost:3000'}/logo.png" alt="多大中文 Logo" style="height: 40px; width: auto;" onerror="this.style.display='none'">
            <h1 style="margin: 0; font-size: 28px;">UTChinese Network</h1>
          </div>
          <p style="margin: 10px 0 0; opacity: 0.9;">多大中文 - 账号状态通知</p>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">您好，${userName}！</h2>
          
          <div style="background: ${bgColor}; border-left: 4px solid ${borderColor}; padding: 25px; margin: 30px 0; border-radius: 0 8px 8px 0;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
              <span style="font-size: 24px;">${statusIcon}</span>
              <h3 style="margin: 0; color: ${statusColor};">您的账号已被${status}</h3>
            </div>
            
            ${isActivated 
              ? '<p style="margin: 0; color: #065f46;">恭喜！您的账号已被管理员激活，现在可以使用UTChinese Network的所有功能了。感谢您加入我们的社区！</p>'
              : '<p style="margin: 0; color: #991b1b;">您的账号已被管理员暂时停用。如有疑问，请联系管理员了解详情。</p>'
            }
          </div>

          <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h4 style="color: #dc2626; margin: 0 0 10px;">📋 操作详情：</h4>
            <p style="margin: 5px 0; color: #555;"><strong>操作管理员：</strong> ${adminName}</p>
            <p style="margin: 5px 0; color: #555;"><strong>操作时间：</strong> ${new Date().toLocaleString('zh-CN')}</p>
            <p style="margin: 5px 0; color: #555;"><strong>账号状态：</strong> ${isActivated ? '已激活' : '已停用'}</p>
          </div>

          ${isActivated ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile" 
                 style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 600; display: inline-block;">
                完善个人资料
              </a>
            </div>
          ` : `
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-weight: 500;">
                💡 如对账号状态有疑问，请联系管理员获取更多信息。
              </p>
            </div>
          `}

          <p style="color: #999; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            如有任何问题，请联系管理员。感谢您对 UTChinese Network 的关注！
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">© 2024 UTChinese Network. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
  }
}

module.exports = EmailService; 
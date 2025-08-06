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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('请输入有效的邮箱格式');
      }

      // 检查发送频率
      const existingCode = await prisma.verificationCode.findUnique({ where: { email } });
      const now = new Date();
      if (existingCode) {
        const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
        if (existingCode.lastSentAt > oneMinuteAgo) {
          throw new Error('验证码发送过于频繁，请1分钟后再试');
        }
      }
      
      // 只生成一次验证码
      const verificationCode = this.generateVerificationCode();
      const expiryTime = new Date(now.getTime() + 10 * 60 * 1000); // 10分钟有效期
      
      let subject, html, username;
      
      // 注册流程的特殊处理
      if (purpose === 'register') {
        const existingStaff = await prisma.staff.findUnique({ where: { email } });
        if (existingStaff) {
          throw new Error('该邮箱已被注册，请使用其他邮箱或直接登录');
        }
        username = email.split('@')[0];
        subject = 'UTChinese Network - 欢迎注册！请验证您的邮箱';
        // 使用同一个验证码
        html = this.generateRegisterEmailTemplate(verificationCode, username);
      } else {
        // 登录等其他流程
        const staff = await prisma.staff.findUnique({ where: { email } });
        if (!staff) {
          throw new Error('邮箱不存在');
        }
        if (purpose !== 'login' && !staff.isActive) {
           throw new Error('账号已被停用，无法执行此操作');
        }
        username = staff.username || email.split('@')[0];
        subject = 'UTChinese Network - 登录验证码';
        // 使用同一个验证码
        html = this.generateLoginEmailTemplate(verificationCode, username);
      }

      await prisma.verificationCode.upsert({
        where: { email },
        update: {
          code: verificationCode,
          expiresAt: expiryTime,
          attempts: 0,
          lastSentAt: now,
        },
        create: {
          email,
          code: verificationCode,
          expiresAt: expiryTime,
          lastSentAt: now,
        },
      });

      const { data, error } = await resend.emails.send({
        from: 'UTChinese Network <support@uoft.pairxy.com>',
        to: email,
        subject,
        html,
        text: this.generatePlainTextVersion(subject, verificationCode, username, purpose),
      });

      if (error) {
        console.error('发送邮件失败:', error);
        throw new Error('发送验证码失败，请稍后重试');
      }

      console.log('验证码邮件发送成功:', data);
      return {
        success: true,
        message: '验证码已发送，请查看您的邮箱',
        expiryTime: expiryTime.toISOString(),
      };

    } catch (error) {
      console.error('发送验证码错误:', error);
      throw error;
    }
  }

  // 验证验证码
  static async verifyCode(email, code) {
    try {
      const verificationRecord = await prisma.verificationCode.findUnique({
        where: { email },
      });

      if (!verificationRecord) {
        return { success: false, message: '请先获取验证码' };
      }

      const now = new Date();
      if (verificationRecord.expiresAt < now) {
        await prisma.verificationCode.delete({ where: { email } });
        return { success: false, message: '验证码已过期，请重新获取' };
      }

      if (verificationRecord.attempts >= 3) {
        await prisma.verificationCode.delete({ where: { email } });
        return { success: false, message: '验证码尝试次数过多，请重新获取' };
      }

      if (verificationRecord.code !== code) {
        const newAttempts = verificationRecord.attempts + 1;
        await prisma.verificationCode.update({
          where: { email },
          data: { attempts: newAttempts },
        });
        const remainingAttempts = 3 - newAttempts;
        return { success: false, message: `验证码错误，还有${remainingAttempts}次尝试机会` };
      }

      // 验证成功，删除记录
      await prisma.verificationCode.delete({ where: { email } });

      return {
        success: true,
        message: '验证码验证成功',
      };

    } catch (error) {
      console.error('验证验证码错误:', error);
      throw error;
    }
  }
  
  /**
   * 生成一个现代化的邮件基础模板
   * @param {object} options - 模板选项
   * @param {string} options.title - 邮件标题
   * @param {string} options.preheader - 邮件预览文本
   * @param {string} options.bodyContent - 邮件正文HTML内容
   * @returns {string} - 完整的HTML邮件
   */
  static generateBaseEmailTemplate({ title, preheader, bodyContent }) {
    const brandColor = '#c8102e'; // UTChinese Red
    const textColor = '#1f2937'; // Dark Gray
    const lightTextColor = '#6b7280'; // Medium Gray
    const backgroundColor = '#f3f4f6'; // Light Gray
    const contentBackgroundColor = '#ffffff';
    const fontFamily = `"Inter", "Noto Sans SC", "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
    const headerFontFamily = `"Playfair Display", "Noto Serif SC", serif`; // Same as home page hero title
    const officialSiteUrl = 'https://www.utchinese.org';
    const logoUrl = 'https://www.utchinese.org/logo.png'; // Assuming this is a white/transparent logo suitable for dark backgrounds

    return `
<!DOCTYPE html>
<html lang="zh-CN" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Noto+Sans+SC:wght@400;700&family=Playfair+Display:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!--[if gte mso 9]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  <style>
    :root {
      color-scheme: light dark;
    }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: ${backgroundColor}; font-family: ${fontFamily}; color: ${textColor}; }
    a { color: ${brandColor}; text-decoration: none; }
    h1 { font-size: 24px; font-weight: 700; margin: 0 0 16px; }
    h2 { font-size: 20px; font-weight: 700; margin: 0 0 16px; }
    h3 { font-size: 16px; font-weight: 700; margin: 0 0 8px; }
    p { margin: 0 0 16px; }
    .button-link {
      display: inline-block; padding: 12px 24px; font-size: 16px; font-weight: 700; color: #ffffff !important; background-color: ${brandColor}; border-radius: 8px; text-decoration: none; -webkit-border-radius: 8px; -moz-border-radius: 8px;
    }
    .main-container {
      max-width: 600px; background-color: ${contentBackgroundColor}; border-radius: 12px; -webkit-border-radius: 12px; -moz-border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden;
    }
    .content-cell {
      padding: 40px; font-size: 16px; line-height: 1.6;
    }
    .footer-cell {
      padding: 32px 40px; font-size: 12px; color: ${lightTextColor}; line-height: 1.5; background-color: #f9fafb;
    }
    .light-text { color: ${lightTextColor}; }
    @media (prefers-color-scheme: dark) {
      body { background-color: #111827 !important; color: #f9fafb !important; }
      .main-container { background-color: #1f2937 !important; border-color: #374151 !important; }
      h1, h2, h3, p { color: #f9fafb !important; }
      .content-cell, .footer-cell { color: #d1d5db !important; }
      .footer-cell { background-color: #111827 !important; }
      .light-text { color: #9ca3af !important; }
      .button-link { background-color: #e11d48 !important; }
      .card { background-color: #374151 !important; border-color: #4b5563 !important; }
      .status-approved { border-color: #34d399 !important; background-color: #064e3b !important; }
      .status-rejected { border-color: #f87171 !important; background-color: #991b1b !important; }
      .status-text-approved { color: #d1fae5 !important; }
      .status-text-rejected { color: #fee2e2 !important; }
    }
  </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: ${backgroundColor};">
  <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader}
  </div>
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="main-container" style="max-width: 600px;">
          <tr>
            <td align="center" style="padding: 24px; background-color: ${brandColor};">
              <a href="${officialSiteUrl}" target="_blank" style="text-decoration: none; color: #ffffff; display: inline-block;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center">
                  <tr>
                    <td style="padding-right: 16px; vertical-align: middle;">
                      <img src="${logoUrl}" alt="UTChinese Network Logo" width="60" height="60" style="display: block;">
                    </td>
                    <td style="font-family: ${headerFontFamily}; font-size: 28px; font-weight: 700; color: #ffffff; vertical-align: middle;">
                      UTChinese Network
                    </td>
                  </tr>
                </table>
              </a>
            </td>
          </tr>
          <tr>
            <td class="content-cell" style="padding: 40px; font-size: 16px; line-height: 1.6; color: ${textColor};">
              ${bodyContent}
            </td>
          </tr>
          <tr>
            <td class="footer-cell" align="center" style="padding: 32px 40px; background-color: #f9fafb; font-size: 12px; line-height: 1.5; color: ${lightTextColor};">
              <p style="margin: 0 0 12px;">&copy; ${new Date().getFullYear()} UTChinese Network. All rights reserved.</p>
              <p style="margin: 0;">此邮件为系统自动发送，请勿直接回复。</p>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }
  
    static generateLoginEmailTemplate(code, username) {
    const title = '登录验证';
    const preheader = `您的登录验证码是 ${code}。`;
    const bodyContent = `
      <h1>您好，${username}！</h1>
      <p>您正在尝试登录 UTChinese Network 账户。请使用以下验证码操作：</p>
      <div style="background-color: #f3f4f6; border-radius: 8px; text-align: center; padding: 24px; margin-bottom: 24px;">
        <p style="font-size: 36px; font-weight: 700; color: #c8102e; letter-spacing: 8px; margin: 0;">${code}</p>
      </div>
      <p>此验证码将在 <strong>10分钟</strong> 内失效。请勿与他人分享此代码。</p>
      <p class="light-text" style="font-size: 14px;">如果您未请求此验证码，请忽略此邮件或联系我们的支持团队。</p>
    `;
    return this.generateBaseEmailTemplate({ title, preheader, bodyContent });
  }

  static generateRegisterEmailTemplate(code, username) {
    const title = '欢迎加入 UTChinese Network';
    const preheader = `感谢您的注册！您的验证码是 ${code}。`;
    const bodyContent = `
      <h1>欢迎，${username}！</h1>
      <p>感谢您注册 UTChinese Network。请使用以下验证码完成邮箱验证，激活您的账户：</p>
      <div style="background-color: #f3f4f6; border-radius: 8px; text-align: center; padding: 24px; margin-bottom: 24px;">
        <p style="font-size: 36px; font-weight: 700; color: #c8102e; letter-spacing: 8px; margin: 0;">${code}</p>
      </div>
      <p>此验证码将在 <strong>10分钟</strong> 内失效。</p>
      <p class="light-text" style="font-size: 14px;">验证成功后，您即可开始探索我们的社区。期待您的加入！</p>
    `;
    return this.generateBaseEmailTemplate({ title, preheader, bodyContent });
  }



  // 通用验证邮件模板
  static generateVerificationEmailTemplate(code, username) {
    return this.generateLoginEmailTemplate(code, username);
  }

  // 发送个人资料审核通知给管理员
  static async sendProfileReviewNotification(userProfile, userEmail, userName) {
    try {
      const adminEmails = await this.getAdminEmails();
      if (adminEmails.length === 0) {
        console.warn('No admin emails found for profile review notification');
        return { success: false, message: 'No admin emails configured' };
      }

      const subject = 'UTChinese Network - 新的个人资料待审核';
      const html = this.generateProfileReviewNotificationTemplate(userProfile, userEmail, userName);
      const text = this.generateProfileReviewPlainText(userProfile, userEmail, userName);

      const { data, error } = await resend.emails.send({
        from: 'UTChinese Network <support@uoft.pairxy.com>',
        to: adminEmails,
        subject,
        html,
        text,
      });

      if (error) {
        console.error('发送审核通知邮件失败:', error);
        throw new Error('发送审核通知邮件失败');
      }

      console.log('个人资料审核通知邮件已成功发送给所有管理员。');
      return { success: true, message: '审核通知已发送给管理员', adminCount: adminEmails.length };
    } catch (error) {
      console.error('发送个人资料审核通知错误:', error);
      throw error;
    }
  }

  // 发送审核结果通知给用户
  static async sendProfileReviewResult(userEmail, userName, reviewResult, reviewNote = '') {
    try {
      // 检查用户是否为激活状态
      const user = await prisma.staff.findUnique({
        where: { email: userEmail },
        select: { isActive: true }
      });

      if (!user || !user.isActive) {
        console.log(`跳过发送邮件给停用用户: ${userEmail}`);
        return { success: false, message: '用户未激活，跳过邮件发送' };
      }

      const isApproved = reviewResult === 'approved';
      const subject = `UTChinese Network - 个人资料审核${isApproved ? '通过' : '未通过'}`;
      const html = this.generateProfileReviewResultTemplate(userName, isApproved, reviewNote);
      const text = this.generateProfileReviewResultPlainText(userName, isApproved, reviewNote);

      const { data, error } = await resend.emails.send({
        from: 'UTChinese Network <support@uoft.pairxy.com>',
        to: userEmail,
        subject,
        html,
        text,
      });

      if (error) {
        console.error('发送审核结果通知失败:', error);
        throw error;
      }

      console.log('个人资料审核结果通知邮件发送成功:', data);
      return { success: true, message: '审核结果通知已发送' };
    } catch (error) {
      console.error('发送个人资料审核结果错误:', error);
      throw error;
    }
  }

  // 发送账号激活邮件
  static async sendAccountActivationNotification(userEmail, userName, isActivated, adminName) {
    try {
      // 如果是停用操作，不发送邮件通知
      if (!isActivated) {
        console.log(`跳过发送停用通知给: ${userEmail}`);
        return { success: false, message: '账号停用时不发送邮件通知' };
      }

      const status = isActivated ? '激活' : '停用';
      const subject = `UTChinese Network - 账号${status}通知`;
      const html = this.generateAccountActivationTemplate(userName, isActivated, adminName);
      const text = this.generateAccountActivationPlainText(userName, isActivated, adminName);

      const { data, error } = await resend.emails.send({
        from: 'UTChinese Network <support@uoft.pairxy.com>',
        to: userEmail,
        subject,
        html,
        text,
      });

      if (error) {
        console.error(`发送账号${status}通知失败:`, error);
        throw error;
      }

      console.log(`账号${status}通知邮件发送成功:`, data);
      return { success: true, message: `账号${status}通知已发送` };
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
          OR: [{ role: 'admin' }, { canReviewProfiles: true }],
          isActive: true,
        },
        select: { email: true },
      });
      return admins.map(admin => admin.email);
    } catch (error) {
      console.error('获取管理员邮箱列表错误:', error);
      return [];
    }
  }

  // 个人资料审核通知邮件模板（发给管理员）
  static generateProfileReviewNotificationTemplate(userProfile, userEmail, userName) {
    const title = '新的个人资料待审核';
    const preheader = `用户 ${userName} 提交了新的个人资料待审核。`;
    const bodyContent = `
      <h1>📋 新的个人资料待审核</h1>
      <p>管理员您好，用户 <strong>${userName}</strong> (${userEmail}) 提交了个人资料，请您及时审核。</p>
      <div class="card" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h3>提交内容</h3>
        <p style="margin:0 0 8px;"><strong>中文姓名:</strong> ${userProfile.name_zh || '未填写'}</p>
        <p style="margin:0 0 8px;"><strong>英文姓名:</strong> ${userProfile.name_en || '未填写'}</p>
        <p style="margin:0 0 8px;"><strong>部门:</strong> ${userProfile.department || '未填写'}</p>
        <p style="margin:0 0 8px;"><strong>中文职位:</strong> ${userProfile.position_zh || '未填写'}</p>
        <p style="margin:0;"><strong>英文职位:</strong> ${userProfile.position_en || '未填写'}</p>
      </div>
      <table width="100%" cellspacing="0" cellpadding="0"><tr><td>
        <a href="https://www.utchinese.org/admin/staff" target="_blank" class="button-link">前往审核</a>
      </td></tr></table>
      <p class="light-text" style="font-size: 14px; margin-top: 24px;">为确保团队信息准确，请尽快完成审核。</p>
    `;
    return this.generateBaseEmailTemplate({ title, preheader, bodyContent });
  }

  // 个人资料审核结果邮件模板（发给用户）
  static generateProfileReviewResultTemplate(userName, isApproved, reviewNote) {
    const statusText = isApproved ? '审核通过' : '需要修改';
    const title = `您的个人资料${statusText}`;
    const preheader = `您提交的个人资料已处理，结果为：${statusText}。`;

    const reviewMessage = isApproved 
      ? '恭喜！您的个人资料已通过审核，现在将公开展示在团队页面。' 
      : '很抱歉，您的个人资料需要一些修改才能通过审核。';

    const noteBox = reviewNote ? `
      <div class="card" style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 24px; border-radius: 8px;">
        <h3 style="margin: 0 0 8px;">管理员意见：</h3>
        <p style="margin: 0; color: #6b7280; font-style: italic;">“${reviewNote}”</p>
      </div>
    ` : '';

    const actionButton = `
      <a href="https://www.utchinese.org/staff/profile" target="_blank" class="button-link">
        ${isApproved ? '查看我的资料' : '前往修改'}
      </a>
    `;

    const bodyContent = `
      <h1>您好，${userName}！</h1>
      <p style="margin-bottom: 24px;">${reviewMessage}</p>
      ${noteBox}
      <table width="100%" cellspacing="0" cellpadding="0"><tr><td>${actionButton}</td></tr></table>
      <p class="light-text" style="font-size: 14px; margin-top: 24px;">如有疑问，请联系管理员。</p>
    `;
    return this.generateBaseEmailTemplate({ title, preheader, bodyContent });
  }

  // 账号激活通知邮件模板（只用于激活通知，停用时不发送邮件）
  static generateAccountActivationTemplate(userName, isActivated, adminName) {

    const title = '您的账号已激活';
    const preheader = '您的 UTChinese Network 账号已被激活。';

    const bodyContent = `
      <h1>您好，${userName}！</h1>
      <p style="margin-bottom: 20px;">恭喜您！您的 UTChinese Network 账户已成功激活，现在可以使用我们平台的全部功能。</p>
      
      <p style="margin-bottom: 20px;">通过我们的平台，您可以：</p>
      <ul style="margin-bottom: 24px; padding-left: 20px; line-height: 1.8;">
        <li>完善个人资料，展示您的专业背景</li>
        <li>了解并参与社团活动</li>
        <li>获取职业发展相关资源</li>
        <li>与社团成员建立联系</li>
        <li>及时获取最新资讯和机会</li>
      </ul>
      
      <p style="margin-bottom: 24px;">建议您首先完善个人资料，审核通过后将在团队页面展示：</p>
      
      <table width="100%" cellspacing="0" cellpadding="0"><tr><td>
        <a href="https://www.utchinese.org/staff/profile" target="_blank" class="button-link">完善您的个人资料</a>
      </td></tr></table>
      
      <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">如果您有任何疑问或需要帮助，请随时联系我们的团队。</p>
    `;
    
    return this.generateBaseEmailTemplate({ title, preheader, bodyContent });
  }

  // 生成验证码邮件的纯文本版本
  static generatePlainTextVersion(subject, verificationCode, username, purpose) {
    let greeting, body, closing;
    const commonFooter = `\n\n此验证码将在 10分钟 内失效。请勿与他人分享此代码。\n\n如果您未请求此验证码，请忽略此邮件。\n\n© ${new Date().getFullYear()} UTChinese Network. All rights reserved.`;

    switch (purpose) {
      case 'register':
        greeting = `欢迎，${username}！`;
        body = `感谢您注册 UTChinese Network。请使用以下验证码完成邮箱验证，激活您的账户：\n\n${verificationCode}`;
        closing = `\n\n验证成功后，您即可开始探索我们的社区。期待您的加入！`;
        break;

      case 'login':
      default:
        greeting = `您好，${username}！`;
        body = `您正在尝试登录 UTChinese Network 账户。请使用以下验证码完成操作：\n\n${verificationCode}`;
        closing = ``;
        break;
    }
    
    return `${greeting}\n\n${body}${closing}${commonFooter}`;
  }

  // 生成个人资料审核通知的纯文本版本（给管理员）
  static generateProfileReviewPlainText(userProfile, userEmail, userName) {
    return `📋 新的个人资料待审核
    
管理员您好，用户 ${userName} (${userEmail}) 提交了个人资料，请您及时审核。

提交内容:
- 中文姓名: ${userProfile.name_zh || '未填写'}
- 英文姓名: ${userProfile.name_en || '未填写'}
- 部门: ${userProfile.department || '未填写'}
- 中文职位: ${userProfile.position_zh || '未填写'}
- 英文职位: ${userProfile.position_en || '未填写'}

请前往审核: https://www.utchinese.org/admin/staff

为确保团队信息准确，请尽快完成审核。

© ${new Date().getFullYear()} UTChinese Network. All rights reserved.`;
  }

  // 生成个人资料审核结果的纯文本版本（给用户）
  static generateProfileReviewResultPlainText(userName, isApproved, reviewNote) {
    const statusText = isApproved ? '✅ 审核通过' : '❌ 需要修改';
    const mainMessage = isApproved
      ? '恭喜！您的个人资料已通过审核，现在将公开展示在团队页面。'
      : '很抱歉，您的个人资料需要一些修改才能通过审核。';
    
    let content = `您好，${userName}！\n\n您提交的个人资料已处理完毕。\n\n${statusText}\n${mainMessage}`;
    
    if (reviewNote) {
      content += `\n\n管理员意见：\n“${reviewNote}”`;
    }

    const actionText = isApproved ? '查看我的资料' : '前往修改';
    content += `\n\n${actionText}: https://www.utchinese.org/staff/profile`;
    
    content += `\n\n如有疑问，请联系管理员。\n\n© ${new Date().getFullYear()} UTChinese Network. All rights reserved.`;
    
    return content;
  }

  // 生成账号激活通知的纯文本版本（只用于激活通知）
  static generateAccountActivationPlainText(userName, isActivated, adminName) {
    let content = `您好，${userName}！\n\n恭喜您！您的 UTChinese Network 账户已成功激活，现在可以使用我们平台的全部功能。`;
    
    content += `\n\n通过我们的平台，您可以：`;
    content += `\n• 完善个人资料，展示您的专业背景`;
    content += `\n• 了解并参与社团活动`;
    content += `\n• 获取职业发展相关资源`;
    content += `\n• 与社团成员建立联系`;
    content += `\n• 及时获取最新资讯和机会`;
    
    content += `\n\n建议您首先完善个人资料，审核通过后将在团队页面展示：`;
    content += `\nhttps://www.utchinese.org/staff/profile`;
    
    content += `\n\n如果您有任何疑问或需要帮助，请随时联系我们的团队。`;
    content += `\n\n© ${new Date().getFullYear()} UTChinese Network. All rights reserved.`;
    
    return content;
  }
}

module.exports = EmailService;

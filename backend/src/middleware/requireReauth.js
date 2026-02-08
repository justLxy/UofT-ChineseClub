const bcrypt = require('bcryptjs');
const prisma = require('../config/database');

/**
 * Admin re-authentication middleware.
 * Requires the currently authenticated admin to re-enter their password before
 * performing sensitive operations (like exporting full internal backups).
 *
 * Expected: req.body.password
 */
module.exports = async function requireReauth(req, res, next) {
  try {
    if (!req.userId || !req.user) {
      return res.status(401).json({ error: '需要认证' });
    }

    const { password } = req.body || {};
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: '需要管理员密码二次验证' });
    }

    // Only admins should ever reach this middleware, but we keep a defensive check.
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '需要管理员权限' });
    }

    const staff = await prisma.staff.findUnique({
      where: { id: req.userId },
      select: { passwordHash: true }
    });

    if (!staff) {
      return res.status(401).json({ error: '用户不存在' });
    }

    const ok = await bcrypt.compare(password, staff.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: '管理员密码错误' });
    }

    return next();
  } catch (err) {
    console.error('Reauth middleware error:', err);
    return res.status(500).json({ error: '二次验证失败' });
  }
};


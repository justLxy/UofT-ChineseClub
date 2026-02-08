const ExportService = require('../services/exportService');

function formatTimestampForFilename(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${yyyy}${mm}${dd}-${hh}${mi}${ss}`;
}

function sendJsonAttachment(res, payload, filename) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  // Helpful for CORS + browsers that rely on explicit length
  const body = JSON.stringify(payload, null, 2);
  res.setHeader('Content-Length', Buffer.byteLength(body, 'utf8'));
  return res.status(200).send(body);
}

class ExportController {
  static async exportEvents(req, res) {
    try {
      const payload = await ExportService.exportEvents({ exportedBy: req.user });
      const filename = `events-${formatTimestampForFilename()}.json`;
      console.log(`[export] events exportedBy=${req.user?.username || 'unknown'}`);
      return sendJsonAttachment(res, payload, filename);
    } catch (error) {
      console.error('Error exporting events:', error);
      return res.status(500).json({ error: 'Failed to export events' });
    }
  }

  static async exportStaff(req, res) {
    try {
      const payload = await ExportService.exportStaff({ exportedBy: req.user });
      const filename = `staff-${formatTimestampForFilename()}.json`;
      console.log(`[export] staff exportedBy=${req.user?.username || 'unknown'}`);
      return sendJsonAttachment(res, payload, filename);
    } catch (error) {
      console.error('Error exporting staff:', error);
      return res.status(500).json({ error: 'Failed to export staff data' });
    }
  }

  static async exportFullBackup(req, res) {
    try {
      const payload = await ExportService.exportFullBackup({ exportedBy: req.user });
      const filename = `full-backup-${formatTimestampForFilename()}.json`;
      console.log(`[export] full exportedBy=${req.user?.username || 'unknown'}`);
      return sendJsonAttachment(res, payload, filename);
    } catch (error) {
      console.error('Error exporting full backup:', error);
      return res.status(500).json({ error: 'Failed to export full backup' });
    }
  }
}

module.exports = ExportController;


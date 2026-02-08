const ImportService = require('../services/importService');

class ImportController {
  static async importEvents(req, res) {
    try {
      const mode = (req.body?.mode || 'merge').toLowerCase();
      const result = await ImportService.importEvents({ file: req.file, mode, importedBy: req.user });
      return res.json(result);
    } catch (error) {
      console.error('Error importing events:', error);
      const status = error.statusCode || 500;
      return res.status(status).json({ error: error.message || 'Failed to import events' });
    }
  }

  static async importStaff(req, res) {
    try {
      const mode = (req.body?.mode || 'merge').toLowerCase();
      const result = await ImportService.importStaff({ file: req.file, mode, importedBy: req.user });
      return res.json(result);
    } catch (error) {
      console.error('Error importing staff:', error);
      const status = error.statusCode || 500;
      return res.status(status).json({ error: error.message || 'Failed to import staff' });
    }
  }

  static async importFullBackup(req, res) {
    try {
      const mode = (req.body?.mode || 'merge').toLowerCase();
      const result = await ImportService.importFullBackup({ file: req.file, mode, importedBy: req.user });
      return res.json(result);
    } catch (error) {
      console.error('Error importing full backup:', error);
      const status = error.statusCode || 500;
      return res.status(status).json({ error: error.message || 'Failed to import backup' });
    }
  }
}

module.exports = ImportController;


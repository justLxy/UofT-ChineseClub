const StaffService = require('../services/staffService');

class StaffController {
  // Get staff profile (own profile)
  static async getStaffProfile(req, res) {
    try {
      const profile = await StaffService.getStaffProfile(req.userId);
      res.json(profile);
    } catch (error) {
      console.error('Error fetching staff profile:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  // Create or update staff profile
  static async saveStaffProfile(req, res) {
    try {
      const result = await StaffService.saveStaffProfile(req.userId, req.body, req.user.username);
      res.json(result);
    } catch (error) {
      console.error('Error saving staff profile:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // Upload staff avatar
  static async uploadStaffAvatar(req, res) {
    try {
      const result = await StaffService.uploadStaffAvatar(req);
      res.json(result);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Admin: Get all staff accounts
  static async getAllStaff(req, res) {
    try {
      const staff = await StaffService.getAllStaff();
      res.json(staff);
    } catch (error) {
      console.error('Error fetching staff:', error);
      res.status(500).json({ error: 'Failed to fetch staff' });
    }
  }

  // Admin: Create staff account
  static async createStaffAccount(req, res) {
    try {
      const result = await StaffService.createStaffAccount(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating staff account:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // Admin: Update staff account
  static async updateStaffAccount(req, res) {
    try {
      const { id } = req.params;
      const result = await StaffService.updateStaffAccount(id, req.body);
      res.json(result);
    } catch (error) {
      console.error('Error updating staff account:', error);
      res.status(500).json({ error: 'Failed to update staff account' });
    }
  }

  // Admin: Delete staff account
  static async deleteStaffAccount(req, res) {
    try {
      const { id } = req.params;
      const result = await StaffService.deleteStaffAccount(id);
      res.json(result);
    } catch (error) {
      console.error('Error deleting staff account:', error);
      res.status(500).json({ error: 'Failed to delete staff account' });
    }
  }

  // Admin: Batch delete staff accounts
  static async batchDeleteStaffAccounts(req, res) {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'Invalid or empty IDs array' });
      }
      const result = await StaffService.batchDeleteStaffAccounts(ids);
      res.json(result);
    } catch (error) {
      console.error('Error batch deleting staff accounts:', error);
      res.status(500).json({ error: 'Failed to batch delete staff accounts' });
    }
  }

  // Admin: Get all staff profiles for review
  static async getAllProfilesForReview(req, res) {
    try {
      const { status } = req.query;
      const profiles = await StaffService.getAllProfilesForReview(status);
      res.json(profiles);
    } catch (error) {
      console.error('Error fetching profiles for review:', error);
      res.status(500).json({ error: 'Failed to fetch profiles' });
    }
  }

  // Admin: Review staff profile
  static async reviewStaffProfile(req, res) {
    try {
      const { id } = req.params;
      const result = await StaffService.reviewStaffProfile(id, req.body);
      res.json(result);
    } catch (error) {
      console.error('Error reviewing profile:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // Public: Get all approved team members
  static async getTeamMembers(req, res) {
    try {
      const { department, language = 'en' } = req.query;
      const teamMembers = await StaffService.getTeamMembers(department, language);
      res.json(teamMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
      res.status(500).json({ error: 'Failed to fetch team members' });
    }
  }

  // Public: Get team member by ID
  static async getTeamMemberById(req, res) {
    try {
      const { id } = req.params;
      const { language = 'en' } = req.query;
      const member = await StaffService.getTeamMemberById(id, language);
      res.json(member);
    } catch (error) {
      console.error('Error fetching team member:', error);
      if (error.message === 'Team member not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch team member' });
      }
    }
  }

  // Public: Get unique departments
  static async getDepartments(req, res) {
    try {
      const departments = await StaffService.getDepartments();
      res.json(departments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      res.status(500).json({ error: 'Failed to fetch departments' });
    }
  }


}

module.exports = StaffController; 
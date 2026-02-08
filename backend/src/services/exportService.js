const prisma = require('../config/database');

const EXPORT_SCHEMA_VERSION = 1;

function buildMeta({ exportedBy, counts, exportType }) {
  return {
    exportType,
    schemaVersion: EXPORT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    exportedBy: exportedBy
      ? {
          id: exportedBy.id,
          username: exportedBy.username,
          email: exportedBy.email,
          role: exportedBy.role
        }
      : null,
    counts,
    environment: process.env.NODE_ENV || 'development'
  };
}

class ExportService {
  static async exportEvents({ exportedBy }) {
    const [events] = await prisma.$transaction([
      prisma.event.findMany({
        orderBy: [{ featured: 'desc' }, { startDate: 'desc' }]
      })
    ]);

    const counts = { events: events.length };
    return {
      meta: buildMeta({ exportedBy, counts, exportType: 'events' }),
      events
    };
  }

  static async exportStaff({ exportedBy }) {
    const [staff, staffProfiles, allStaffProfileHistories, verificationCodes] =
      await prisma.$transaction([
        prisma.staff.findMany({ orderBy: { id: 'asc' } }),
        prisma.staffProfile.findMany({ orderBy: { id: 'asc' } }),
        // History can grow very large; export only the latest entry per staffId (most recent audit record)
        prisma.staffProfileHistory.findMany({ orderBy: [{ createdAt: 'desc' }, { id: 'desc' }] }),
        prisma.verificationCode.findMany({ orderBy: { id: 'asc' } })
      ]);

    // Keep only the latest history record per staffId
    const latestHistoryByStaffId = new Map();
    for (const h of allStaffProfileHistories) {
      if (!latestHistoryByStaffId.has(h.staffId)) {
        latestHistoryByStaffId.set(h.staffId, h);
      }
    }
    const staffProfileHistories = Array.from(latestHistoryByStaffId.values()).sort((a, b) => {
      if (a.staffId !== b.staffId) return a.staffId - b.staffId;
      return b.id - a.id;
    });

    const counts = {
      staff: staff.length,
      staffProfiles: staffProfiles.length,
      staffProfileHistories: staffProfileHistories.length,
      verificationCodes: verificationCodes.length
    };

    return {
      meta: buildMeta({ exportedBy, counts, exportType: 'staff' }),
      staff,
      staffProfiles,
      staffProfileHistories,
      verificationCodes
    };
  }

  static async exportFullBackup({ exportedBy }) {
    const [events, staff, staffProfiles, allStaffProfileHistories, verificationCodes] =
      await prisma.$transaction([
        prisma.event.findMany({ orderBy: { id: 'asc' } }),
        prisma.staff.findMany({ orderBy: { id: 'asc' } }),
        prisma.staffProfile.findMany({ orderBy: { id: 'asc' } }),
        // Export only the latest history entry per staffId
        prisma.staffProfileHistory.findMany({ orderBy: [{ createdAt: 'desc' }, { id: 'desc' }] }),
        prisma.verificationCode.findMany({ orderBy: { id: 'asc' } })
      ]);

    const latestHistoryByStaffId = new Map();
    for (const h of allStaffProfileHistories) {
      if (!latestHistoryByStaffId.has(h.staffId)) {
        latestHistoryByStaffId.set(h.staffId, h);
      }
    }
    const staffProfileHistories = Array.from(latestHistoryByStaffId.values()).sort((a, b) => {
      if (a.staffId !== b.staffId) return a.staffId - b.staffId;
      return b.id - a.id;
    });

    const counts = {
      events: events.length,
      staff: staff.length,
      staffProfiles: staffProfiles.length,
      staffProfileHistories: staffProfileHistories.length,
      verificationCodes: verificationCodes.length
    };

    return {
      meta: buildMeta({ exportedBy, counts, exportType: 'full' }),
      events,
      staff,
      staffProfiles,
      staffProfileHistories,
      verificationCodes
    };
  }
}

module.exports = ExportService;


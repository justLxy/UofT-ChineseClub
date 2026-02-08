const prisma = require('../config/database');

function httpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function parseJsonFile(file) {
  if (!file) throw httpError(400, 'Missing backup file');
  if (!file.buffer) throw httpError(400, 'Invalid upload (no file buffer)');
  const text = file.buffer.toString('utf8');
  try {
    return JSON.parse(text);
  } catch (e) {
    throw httpError(400, 'Invalid JSON file');
  }
}

const toDate = (v) => {
  if (v === null || v === undefined || v === '') return null;
  if (v instanceof Date) return v;
  const d = new Date(v);
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(d.getTime())) return null;
  return d;
};

function normalizeEvents(events = []) {
  return events.map((e) => ({
    ...e,
    startDate: toDate(e.startDate),
    endDate: toDate(e.endDate),
    createdAt: toDate(e.createdAt) || undefined,
    updatedAt: toDate(e.updatedAt) || undefined
  }));
}

function normalizeStaff(staff = []) {
  return staff.map((s) => ({
    ...s,
    createdAt: toDate(s.createdAt) || undefined,
    updatedAt: toDate(s.updatedAt) || undefined,
    lastLogin: toDate(s.lastLogin)
  }));
}

function normalizeStaffProfiles(staffProfiles = []) {
  return staffProfiles.map((p) => ({
    ...p,
    reviewedAt: toDate(p.reviewedAt),
    createdAt: toDate(p.createdAt) || undefined,
    updatedAt: toDate(p.updatedAt) || undefined
  }));
}

function normalizeStaffProfileHistories(histories = []) {
  return histories.map((h) => ({
    ...h,
    createdAt: toDate(h.createdAt) || undefined
  }));
}

function normalizeVerificationCodes(codes = []) {
  return codes.map((c) => ({
    ...c,
    expiresAt: toDate(c.expiresAt) || undefined,
    lastSentAt: toDate(c.lastSentAt) || undefined,
    createdAt: toDate(c.createdAt) || undefined,
    updatedAt: toDate(c.updatedAt) || undefined
  }));
}

async function resetPostgresSequencesIfNeeded() {
  const url = process.env.DATABASE_URL || '';
  const isPostgres = url.startsWith('postgres://') || url.startsWith('postgresql://');
  if (!isPostgres) return;

  // Ensure sequences are >= max(id)+1 after inserting explicit IDs
  const tables = ['Event', 'Staff', 'StaffProfile', 'StaffProfileHistory', 'VerificationCode'];
  for (const table of tables) {
    // Safe because table names are hard-coded above
    // Use is_called=false so nextval returns the value we set
    // setval(pg_get_serial_sequence('"Table"','id'), max+1, false)
    // If table empty -> max is null -> COALESCE to 0 -> sets to 1
    // eslint-disable-next-line no-await-in-loop
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"${table}"','id'), COALESCE((SELECT MAX(id) FROM "${table}"), 0) + 1, false);`
    );
  }
}

class ImportService {
  static async importEvents({ file, mode = 'merge', importedBy }) {
    if (!['merge', 'replace'].includes(mode)) {
      throw httpError(400, 'Invalid import mode (use merge or replace)');
    }
    const payload = parseJsonFile(file);
    const events = normalizeEvents(payload.events || payload?.data?.events || []);
    if (!Array.isArray(events)) throw httpError(400, 'Invalid events payload');

    const counts = { events: events.length };

    if (mode === 'replace') {
      await prisma.$transaction(async (tx) => {
        await tx.event.deleteMany({});
        if (events.length) {
          await tx.event.createMany({ data: events });
        }
      });
      await resetPostgresSequencesIfNeeded();
      return {
        message: `Events imported (replace).`,
        counts,
        importedBy: importedBy?.username || null
      };
    }

    // merge: upsert by id
    await prisma.$transaction(async (tx) => {
      for (const e of events) {
        // eslint-disable-next-line no-await-in-loop
        await tx.event.upsert({
          where: { id: e.id },
          create: e,
          update: e
        });
      }
    });
    await resetPostgresSequencesIfNeeded();
    return {
      message: `Events imported (merge).`,
      counts,
      importedBy: importedBy?.username || null
    };
  }

  static async importStaff({ file, mode = 'merge', importedBy }) {
    if (!['merge', 'replace'].includes(mode)) {
      throw httpError(400, 'Invalid import mode (use merge or replace)');
    }
    const payload = parseJsonFile(file);
    const staff = normalizeStaff(payload.staff || []);
    const staffProfiles = normalizeStaffProfiles(payload.staffProfiles || []);
    const staffProfileHistories = normalizeStaffProfileHistories(payload.staffProfileHistories || []);
    const verificationCodes = normalizeVerificationCodes(payload.verificationCodes || []);

    if (!Array.isArray(staff) || !Array.isArray(staffProfiles) || !Array.isArray(staffProfileHistories) || !Array.isArray(verificationCodes)) {
      throw httpError(400, 'Invalid staff payload');
    }

    const counts = {
      staff: staff.length,
      staffProfiles: staffProfiles.length,
      staffProfileHistories: staffProfileHistories.length,
      verificationCodes: verificationCodes.length
    };

    const runReplace = async (tx) => {
      await tx.verificationCode.deleteMany({});
      await tx.staffProfileHistory.deleteMany({});
      await tx.staffProfile.deleteMany({});
      await tx.staff.deleteMany({});

      if (staff.length) await tx.staff.createMany({ data: staff });
      if (staffProfiles.length) await tx.staffProfile.createMany({ data: staffProfiles });
      if (staffProfileHistories.length) await tx.staffProfileHistory.createMany({ data: staffProfileHistories });
      if (verificationCodes.length) await tx.verificationCode.createMany({ data: verificationCodes });
    };

    const runMerge = async (tx) => {
      for (const s of staff) {
        // eslint-disable-next-line no-await-in-loop
        await tx.staff.upsert({ where: { id: s.id }, create: s, update: s });
      }
      for (const p of staffProfiles) {
        // staffId is unique in schema
        // eslint-disable-next-line no-await-in-loop
        await tx.staffProfile.upsert({
          where: { staffId: p.staffId },
          create: p,
          update: p
        });
      }
      for (const h of staffProfileHistories) {
        // history has no unique other than id; upsert by id
        // eslint-disable-next-line no-await-in-loop
        await tx.staffProfileHistory.upsert({ where: { id: h.id }, create: h, update: h });
      }
      for (const c of verificationCodes) {
        // email is unique in schema
        // eslint-disable-next-line no-await-in-loop
        await tx.verificationCode.upsert({
          where: { email: c.email },
          create: c,
          update: c
        });
      }
    };

    try {
      await prisma.$transaction(async (tx) => {
        if (mode === 'replace') return runReplace(tx);
        return runMerge(tx);
      });
    } catch (e) {
      // Most common: unique constraint conflicts when merging into an existing DB
      throw httpError(
        409,
        `Import failed due to conflicts. Try mode=replace on an empty DB. Details: ${e.message}`
      );
    }

    await resetPostgresSequencesIfNeeded();
    return {
      message: `Staff imported (${mode}).`,
      counts,
      importedBy: importedBy?.username || null
    };
  }

  static async importFullBackup({ file, mode = 'merge', importedBy }) {
    if (!['merge', 'replace'].includes(mode)) {
      throw httpError(400, 'Invalid import mode (use merge or replace)');
    }
    const payload = parseJsonFile(file);
    const events = normalizeEvents(payload.events || []);
    const staff = normalizeStaff(payload.staff || []);
    const staffProfiles = normalizeStaffProfiles(payload.staffProfiles || []);
    const staffProfileHistories = normalizeStaffProfileHistories(payload.staffProfileHistories || []);
    const verificationCodes = normalizeVerificationCodes(payload.verificationCodes || []);

    if (!Array.isArray(events) || !Array.isArray(staff)) {
      throw httpError(400, 'Invalid full backup payload');
    }

    const counts = {
      events: events.length,
      staff: staff.length,
      staffProfiles: staffProfiles.length,
      staffProfileHistories: staffProfileHistories.length,
      verificationCodes: verificationCodes.length
    };

    const runReplace = async (tx) => {
      await tx.verificationCode.deleteMany({});
      await tx.staffProfileHistory.deleteMany({});
      await tx.staffProfile.deleteMany({});
      await tx.event.deleteMany({});
      await tx.staff.deleteMany({});

      if (staff.length) await tx.staff.createMany({ data: staff });
      if (events.length) await tx.event.createMany({ data: events });
      if (staffProfiles.length) await tx.staffProfile.createMany({ data: staffProfiles });
      if (staffProfileHistories.length) await tx.staffProfileHistory.createMany({ data: staffProfileHistories });
      if (verificationCodes.length) await tx.verificationCode.createMany({ data: verificationCodes });
    };

    const runMerge = async (tx) => {
      for (const s of staff) {
        // eslint-disable-next-line no-await-in-loop
        await tx.staff.upsert({ where: { id: s.id }, create: s, update: s });
      }
      for (const e of events) {
        // eslint-disable-next-line no-await-in-loop
        await tx.event.upsert({ where: { id: e.id }, create: e, update: e });
      }
      for (const p of staffProfiles) {
        // eslint-disable-next-line no-await-in-loop
        await tx.staffProfile.upsert({ where: { staffId: p.staffId }, create: p, update: p });
      }
      for (const h of staffProfileHistories) {
        // eslint-disable-next-line no-await-in-loop
        await tx.staffProfileHistory.upsert({ where: { id: h.id }, create: h, update: h });
      }
      for (const c of verificationCodes) {
        // eslint-disable-next-line no-await-in-loop
        await tx.verificationCode.upsert({ where: { email: c.email }, create: c, update: c });
      }
    };

    try {
      await prisma.$transaction(async (tx) => {
        if (mode === 'replace') return runReplace(tx);
        return runMerge(tx);
      });
    } catch (e) {
      throw httpError(
        409,
        `Import failed due to conflicts. Try mode=replace on an empty DB. Details: ${e.message}`
      );
    }

    await resetPostgresSequencesIfNeeded();
    return {
      message: `Full backup imported (${mode}).`,
      counts,
      importedBy: importedBy?.username || null
    };
  }
}

module.exports = ImportService;


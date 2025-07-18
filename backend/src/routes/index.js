const express = require('express');
const authRoutes = require('./authRoutes');
const eventRoutes = require('./eventRoutes');
const staffRoutes = require('./staffRoutes');
const teamRoutes = require('./teamRoutes');

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/staff', staffRoutes); // Staff profile routes
router.use('/admin', staffRoutes); // Admin management routes (same controller, different permissions)
router.use('/team', teamRoutes);

module.exports = router; 
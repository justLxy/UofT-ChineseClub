const express = require('express');
const cors = require('cors');
// const path = require('path');
const { PORT, FRONTEND_URL } = require('./config/constants');
// const AuthService = require('./services/authService');
const { uploadsDir } = require('./middleware/upload');
const routes = require('./routes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(uploadsDir));

// Admin password is now managed through the unified user system

// Mount API routes
app.use('/api', routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for: ${FRONTEND_URL}`);
}); 
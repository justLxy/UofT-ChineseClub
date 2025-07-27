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
const staticPath = process.env.UPLOADS_DIR || uploadsDir;
console.log(`📁 Static files served from: ${staticPath}`);
console.log(`🔗 Uploads URL: ${process.env.BACKEND_URL || 'http://localhost:8000'}/uploads`);

app.use('/uploads', express.static(staticPath));

// Mount API routes
app.use('/api', routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for: ${FRONTEND_URL}`);
}); 
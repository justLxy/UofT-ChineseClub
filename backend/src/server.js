const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { PORT, FRONTEND_URL } = require('./config/constants');
// const AuthService = require('./services/authService');
const { uploadsDir } = require('./middleware/upload');
const routes = require('./routes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: [
    FRONTEND_URL, 
    'http://localhost:3000', 
    'https://www.utchinese.org'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files
const staticPath = process.env.UPLOADS_DIR || uploadsDir;
app.use('/uploads', express.static(staticPath));

// Serve static assets from src/assets
const assetsPath = path.join(__dirname, 'assets');
app.use('/static', express.static(assetsPath));

// Mount API routes
app.use('/api', routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for: ${FRONTEND_URL}`);
});

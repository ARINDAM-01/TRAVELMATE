require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const config = require('./config');

const app = express();

// CORS (Configured first to ensure preflight OPTIONS requests always succeed)
const corsOptions = {
  origin: true, // Dynamically reflects request origin; fully compatible with credentials: true
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'x-api-key', 'X-API-KEY'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(config.cookieSecret));

// Rate limiting
app.use('/api/', apiLimiter);

// Health check (before auth)
app.get('/api/health', async (req, res) => {
  let dbStatus = 'unknown';
  try {
    const { prisma } = require('./config/database');
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (e) {
    dbStatus = 'disconnected';
  }
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    database: dbStatus,
    version: '1.0.0',
  });
});

// Seed endpoint to populate demo data (users, destinations, trips)
app.all('/api/seed', async (req, res) => {
  try {
    const { seedDatabase } = require('../prisma/seed');
    await seedDatabase();
    res.json({
      success: true,
      message: 'Database seeded successfully with demo users, destinations, and sample trips!',
      credentials: {
        email: 'demo@travelmate.com',
        password: 'Demo123!',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Routes
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const aiRoutes = require('./routes/ai');
const destinationRoutes = require('./routes/destinations');
const graphRoutes = require('./routes/graph');
const expenseRoutes = require('./routes/expenses');
const analyticsRoutes = require('./routes/analytics');
const favoriteRoutes = require('./routes/favorites');
const mapRoutes = require('./routes/maps');
const shareRoutes = require('./routes/share');

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/graph', graphRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/shared', shareRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use(errorHandler);

module.exports = app;

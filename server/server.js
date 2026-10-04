import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/index.js';
import connectDB, { isMongoConnected } from './config/database.js';

// Route imports
import demoRoutes from './routes/demo.js';
import incidentRoutes from './routes/incidents.js';
import userRoutes from './routes/user.js';
import aiRoutes from './routes/ai.js';
import mapRoutes from './routes/map.js';
import reportRoutes from './routes/reports.js';
import integrationRoutes from './routes/integrations.js';

const app = express();

// ─── Security Middleware ──────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: config.clientUrl,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Body parsing with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/demo', demoRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/integrations', integrationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const mongoConnected = isMongoConnected();
  let dbStatus = 'not configured (in-memory demo mode)';
  if (mongoConnected) {
    dbStatus = 'connected (MongoDB Atlas)';
  } else if (config.hasMongoDb()) {
    dbStatus = 'connecting/failed';
  }

  res.json({
    status: 'ok',
    name: 'CrisisLens API',
    version: '1.0.0',
    demoMode: config.demoMode,
    services: {
      database: dbStatus,
      ai: config.hasAiProvider() ? `${config.aiProvider}` : 'demo mode',
      search: config.hasSerpApi() ? 'configured' : 'not configured',
    },
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: config.isProduction() ? 'Something went wrong' : err.message,
  });
});

// ─── Start Server ─────────────────────────────────────────────
const start = async () => {
  // Connect to MongoDB (optional — app works without it in demo mode)
  await connectDB();

  app.listen(config.port, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║                 CRISISLENS                   ║');
    console.log('║  Emergency Information Synthesis Engine       ║');
    console.log('╚══════════════════════════════════════════════╝');
    console.log('');
    console.log(`🌐 Server running on port ${config.port}`);
    console.log(`📡 Environment: ${config.nodeEnv}`);
    console.log(`🗄️  Database: ${config.hasMongoDb() ? 'MongoDB Atlas' : 'In-memory (demo)'}`);
    console.log(`🤖 AI: ${config.hasAiProvider() ? config.aiProvider : 'Demo mode'}`);
    console.log(`🔍 Search: ${config.hasSerpApi() ? 'SerpApi' : 'Not configured'}`);
    console.log(`🎭 Demo Mode: ${config.demoMode ? 'ENABLED' : 'Disabled'}`);
    console.log('');
    console.log(`Client URL: ${config.clientUrl}`);
    console.log(`API URL: http://localhost:${config.port}/api`);
    console.log('');
  });
};

start().catch(console.error);

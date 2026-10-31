import express from 'express';
import cors from 'cors';
import { config, validateConfig } from './config.js';
import { query } from './db/index.js';

import authRoutes from './routes/auth.js';
import opportunitiesRoutes from './routes/opportunities.js';
import studentsRoutes from './routes/students.js';
import savedRoutes from './routes/saved.js';
import applicationsRoutes from './routes/applications.js';
import notificationsRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js';

const validation = validateConfig();
if (!validation.valid) {
  console.warn('[Server Startup Warning]', validation.issues.join('; '));
}

const app = express();

// Middleware
// CORS Configuration: Supports local dev, custom CLIENT_URL, and Vercel domains
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        origin === config.clientUrl ||
        origin === 'http://localhost:3000' ||
        origin === 'http://localhost:5173' ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in hackathon demo
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/saved-opportunities', savedRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const dbRes = await query('SELECT NOW() AS time');
    return res.json({
      status: 'healthy',
      service: 'ScholarBridge API',
      timestamp: new Date().toISOString(),
      databaseConnected: true,
      dbTime: dbRes.rows[0].time,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'unhealthy',
      databaseConnected: false,
      error: err.message,
    });
  }
});

// Global 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Background Job: Check approaching deadlines and auto-expire closed cycles
async function runDeadlineCycleCheck() {
  try {
    const expiredRes = await query(
      `UPDATE opportunities 
       SET verification_status = 'Expired', updated_at = NOW() 
       WHERE deadline < CURRENT_DATE AND verification_status != 'Expired' 
       RETURNING id, title;`
    );
    if (expiredRes.rows.length > 0) {
      console.log(`[Scheduled Worker] Auto-expired ${expiredRes.rows.length} past-deadline opportunities.`);
    }
  } catch (err) {
    console.error('[Scheduled Worker Error]', err.message);
  }
}

// Start server
app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(` ScholarBridge API Server listening on port ${config.port}`);
  console.log(` Health check: http://localhost:${config.port}/api/health`);
  console.log(` Client URL: ${config.clientUrl}`);
  console.log(`====================================================`);

  // Initial check on boot, then recurring every 60 minutes
  runDeadlineCycleCheck();
  setInterval(runDeadlineCycleCheck, 60 * 60 * 1000);
});

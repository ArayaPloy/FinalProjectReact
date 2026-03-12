const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const port = process.env.PORT || 5000;

// ─── Global crash protection ───────────────────────────────────────────────
// ป้องกัน process crash จาก unhandled errors/rejections
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception (server kept alive):', err.message);
  console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Promise Rejection (server kept alive):');
  console.error('Promise:', promise);
  console.error('Reason:', reason);
});
// ─────────────────────────────────────────────────────────────────────────

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// CORS Configuration - รองรับทั้ง Development และ Production
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      process.env.FRONTEND_URL,
      // เพิ่ม production domains อื่นๆ ถ้ามี                                                                  
    ].filter(Boolean) // กรองค่า undefined/null ออก
  : [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      // Local network IPs for testing
      /^http:\/\/192\.168\.\d+\.\d+:5173$/,
      /^http:\/\/10\.\d+\.\d+\.\d+:5173$/
    ];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (process.env.NODE_ENV === 'production') {
      // Production: strict origin checking
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // Development: more permissive
      const isAllowed = allowedOrigins.some(allowed => {
        if (typeof allowed === 'string') {
          return allowed === origin;
        } else if (allowed instanceof RegExp) {
          return allowed.test(origin);
        }
        return false;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`⚠️  CORS: Origin ${origin} not in whitelist`);
        callback(null, true); // Still allow in development
      }
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Routes setup
const authRoutes = require('./src/routes/auth.user');
const authMeRoutes = require('./src/routes/auth.me');
const profileRoutes = require('./src/routes/profile.route');
const blogRoutes = require('./src/routes/blog.route');
const aboutRoutes = require('./src/routes/about.route');
const commentRoutes = require('./src/routes/comment.route');
const teachersRoutes = require('./src/routes/teachers.route');
const clubsRoutes = require('./src/routes/clubs.route');
const homeVisitRoutes = require('./src/routes/homevisits.route');
const flagpoleAttendanceRoutes = require('./src/routes/flagpole-attendance.route');
const uploadRoutes = require('./src/routes/upload.route');
const behaviorScoreRoutes = require('./src/routes/behavior-score.route');
const studentRoutes = require('./src/routes/student.route');
const academicRoutes = require('./src/routes/academic.route');
const studentPublicRoutes = require('./src/routes/student-public.route');
const classroomsRoutes = require('./src/routes/classrooms.route');
const classSchedulesRoutes = require('./src/routes/classschedules.route');

app.use('/api/auth', authRoutes);
app.use('/api/auth', authMeRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/clubs', clubsRoutes);
app.use('/api/homevisits', homeVisitRoutes);
app.use('/api', flagpoleAttendanceRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/behavior-scores', behaviorScoreRoutes);
app.use('/api/students', studentRoutes);
app.use('/api', academicRoutes);
app.use('/api/students/public', studentPublicRoutes);
app.use('/api/classrooms', classroomsRoutes);
app.use('/api/schedules', classSchedulesRoutes);

const subjectsRoutes = require('./src/routes/subjects.route');
app.use('/api/subjects', subjectsRoutes);

const admissionsRoutes = require('./src/routes/admissions.route');
app.use('/api/admissions', admissionsRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the uploads directory

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  
  // CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy: Origin not allowed'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Health check route (must be before 404 handler)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'School Website API Server',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

async function main() {
  // Server initialization (routes registered above)
}

main()
  .then(() => {
    console.log('✅ Server initialized successfully');
  })
  .catch(err => {
    console.error('❌ Server initialization failed:', err);
    process.exit(1);
  });

const startServer = (tryPort) => {
  const server = app.listen(tryPort, '0.0.0.0', () => {
    console.log('========================================');
    console.log(`🚀 Server running on port ${tryPort}`);
    console.log(`🔗 http://localhost:${tryPort}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);
    console.log('========================================');
  });

  // Graceful shutdown — ทำให้ nodemon restart ได้สะอาด ไม่ค้าง port
  const shutdown = (signal) => {
    console.log(`\n🛑 Received ${signal}. Closing server...`);
    // closeAllConnections() force-closes keep-alive connections (Node 18+)
    if (typeof server.closeAllConnections === 'function') {
      server.closeAllConnections();
    }
    server.close(() => {
      console.log('✅ Server closed.');
      process.exit(0);
    });
    // Fallback: force exit after 3 seconds if connections hang
    setTimeout(() => {
      console.warn('⚠️  Force exit after timeout.');
      process.exit(1);
    }, 3000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      // ไม่วนหา port ถัดไป แต่ exit ให้ nodemon restart ใหม่
      console.error(`❌ Port ${tryPort} is already in use.`);
      console.error(`   Run: npx kill-port ${tryPort}  แล้วลองใหม่อีกครั้ง`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

startServer(port);


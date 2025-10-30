const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 5000;

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

const authRoutes = require('./src/routes/auth.user');
const authMeRoutes = require('./src/routes/auth.me');
const blogRoutes = require('./src/routes/blog.route');
const aboutRoutes = require('./src/routes/about.route');
const commentRoutes = require('./src/routes/comment.route');
const teachersRoutes = require('./src/routes/teachers.route');
const blogRoutesOld = require('./src/routes/blog.route.old');
const clubsRoutes = require('./src/routes/clubs.route');
const homeVisitRoutes = require('./src/routes/homevisits.route');
const flagpoleAttendanceRoutes = require('./src/routes/flagpole-attendance.route');
const uploadRoutes = require('./src/routes/upload.route');
const behaviorScoreRoutes = require('./src/routes/behavior-score.route');
const studentRoutes = require('./src/routes/student.route');
const academicRoutes = require('./src/routes/academic.route');
const studentPublicRoutes = require('./src/routes/student-public.route');
// Routes setup

// app.get('/api/test', isAdmin); // Apply isAdmin middleware to all routes under /api
app.use('/api/auth', authRoutes);
app.use('/api/auth', authMeRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/blogsOld', blogRoutesOld);
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

app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory

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

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

async function main() {
  // MongoDB connection (ถ้าจำเป็น - ปิดไว้ก่อนถ้าไม่ใช้)
  // await mongoose.connect(process.env.MONGODB_URL);
  
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'School Website API Server',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  });
}

main()
  .then(() => {
    console.log('✅ Server initialized successfully');
    // console.log('✅ MongoDB connected'); // ถ้าใช้ MongoDB
  })
  .catch(err => {
    console.error('❌ Server initialization failed:', err);
    process.exit(1);
  });

app.listen(port, () => {
  console.log('========================================');
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);
  console.log('========================================');
});

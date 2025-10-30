const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
require('dotenv').config();
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;

const isAdmin = require('./src/middleware/admin');

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// CORS Configuration - รองรับทั้ง Development และ Production
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      // Production domains (แก้ไขตาม domain จริง)
      'https://your-frontend-domain.com',
      'https://www.your-frontend-domain.com',
      // เพิ่ม production domains อื่นๆ 
    ]
  : [
      // Development origins
      '*',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://192.168.60.230:5173',
      'http://10.52.203.24:5173',
      /^http:\/\/192\.168\.\d+\.\d+:5173$/,
      /^http:\/\/10\.\d+\.\d+\.\d+:5173$/
    ];

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true
}));

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


async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  app.get('/', (req, res) => {
    res.send('School Website Server is Running...!');
  });

  // generateToken = require('./src/middleware/generateToken');
  // generateToken(1)
}


// main().then(() => console.log('Mongodb connected successfully!')).catch(err => console.log(err));



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

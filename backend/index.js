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
app.use(cors({ 
  origin: 'http://localhost:5173',
  credentials: true,
}));

const authRoutes = require('./src/routes/auth.user');
const blogRoutes = require('./src/routes/blog.route');
const commentRoutes = require('./src/routes/comment.route');

const blogRoutesOld = require('./src/routes/blog.route.old');
// Routes setup

// app.get('/api/test', isAdmin); // Apply isAdmin middleware to all routes under /api
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/blogsOld', blogRoutesOld);
app.use('/api/comments', commentRoutes);


async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  app.get('/', (req, res) => {
    res.send('EduWeb-Prototype School Website Server is Running...!');
  });

  // generateToken = require('./src/middleware/generateToken');
  // generateToken(1)
}



main().then(() => console.log('Mongodb connected successfully!')).catch(err => console.log(err));



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

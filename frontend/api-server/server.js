// server.js - Express.js Server สำหรับ React
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5137', 'http://192.168.60.230:5137'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// สร้าง MySQL connection pool
const db = mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'eduweb_project',
  port: process.env.DATABASE_PORT || '3306',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4'
});

// Test database connection
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('✅ เชื่อมต่อฐานข้อมูล MySQL สำเร็จ');
    connection.release();
  } catch (error) {
    console.error('❌ เชื่อมต่อฐานข้อมูลไม่สำเร็จ:', error.message);
  }
}

testConnection();

// API route สำหรับดึงข้อมูล blogs
app.post('/api/blogs', async (req, res) => {
  try {
    console.log('📨 รับ request:', req.body);
    
    const { search = '', category = '', limit } = req.body;

    // สร้าง SQL query
    let sqlQuery = `
      SELECT 
        id, title, description, covering, category, 
        content, author, createdAt, updatedAt
      FROM blogs 
    `;
    const queryParams = [];

    // เพิ่มเงื่อนไขการค้นหา
    if (search && search.trim() !== '') {
      sqlQuery += ' AND (title LIKE ? OR description LIKE ? OR category LIKE ?)';
      const searchTerm = `%${search.trim()}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // เพิ่มเงื่อนไขหมวดหมู่
    if (category && category.trim() !== '') {
      sqlQuery += ' AND category LIKE ?';
      queryParams.push(`%${category.trim()}%`);
    }

    // เรียงลำดับตามวันที่สร้างล่าสุด
    sqlQuery += ' ORDER BY createdAt DESC';

    // เพิ่มการจำกัดจำนวนผลลัพธ์
    if (limit && parseInt(limit) > 0) {
      sqlQuery += ' LIMIT ?';
      queryParams.push(parseInt(limit));
    }

    console.log('🔍 SQL Query:', sqlQuery);
    console.log('📊 Parameters:', queryParams);

    // ดำเนินการ query
    const [rows] = await db.execute(sqlQuery, queryParams);

    console.log('📋 ผลลัพธ์:', `พบ ${rows.length} รายการ`);

    // ส่งผลลัพธ์กลับ
    res.json({
      success: true,
      data: rows,
      count: rows.length,
      message: 'ดึงข้อมูลสำเร็จ'
    });

  } catch (error) {
    console.error('❌ Database error:', error);

    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// API route สำหรับดึงข้อมูล blog เดียว
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const sqlQuery = `
      SELECT 
        id, title, description, covering, category, 
        content, author, createdAt, updatedAt
      FROM blogs 
      WHERE id = ?
    `;

    const [rows] = await db.execute(sqlQuery, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลที่ต้องการ'
      });
    }

    res.json({
      success: true,
      data: rows[0],
      message: 'ดึงข้อมูลสำเร็จ'
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Serve static files from React build (สำหรับ production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const connection = await db.getConnection();
    await connection.execute('SELECT 1');
    connection.release();
    
    res.json({ 
      success: true, 
      message: 'Server and Database are running properly',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `ไม่พบเส้นทาง ${req.originalUrl}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/blogs`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await db.end();
  console.log('✅ Database connections closed');
  process.exit(0);
});
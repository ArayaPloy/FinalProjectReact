const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// สร้างโฟลเดอร์ uploads/blogs ถ้ายังไม่มี
const uploadDir = 'uploads/blogs';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ตั้งค่า Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // สร้างชื่อไฟล์ที่ไม่ซ้ำ: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    // ลบอักขระพิเศษออกจากชื่อไฟล์
    const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9ก-๙]/g, '_');
    cb(null, safeName + '-' + uniqueSuffix + ext);
  }
});

// กรองไฟล์ - รับเฉพาะรูปภาพ
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('อนุญาตเฉพาะไฟล์รูปภาพ (JPEG, JPG, PNG, GIF, WEBP) เท่านั้น'), false);
  }
};

// ตั้งค่า Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Route สำหรับอัพโหลดรูปภาพ
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาเลือกไฟล์รูปภาพ'
      });
    }

    // สร้าง URL ของรูปภาพ
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/blogs/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'อัพโหลดรูปภาพสำเร็จ',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ'
    });
  }
});

// Middleware จัดการ error จาก Multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'ขนาดไฟล์ใหญ่เกินไป (สูงสุด 5MB)'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Multer error: ${error.message}`
    });
  }
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next();
});

module.exports = router;

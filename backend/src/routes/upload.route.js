const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// สร้างโฟลเดอร์ uploads/blogs ถ้ายังไม่มี
const uploadDir = path.join(__dirname, '../../uploads/blogs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// สร้างโฟลเดอร์ uploads/teachers ถ้ายังไม่มี
const teachersUploadDir = path.join(__dirname, '../../uploads/teachers');
if (!fs.existsSync(teachersUploadDir)) {
  fs.mkdirSync(teachersUploadDir, { recursive: true });
}

// ตั้งค่า Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // สร้างชื่อไฟล์ที่ไม่ซ้ำ: timestamp-randomnumber
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    
    // ดึง extension จาก mimetype (แม่นยำกว่า originalname)
    let ext = '';
    
    switch(file.mimetype) {
      case 'image/jpeg':
        ext = '.jpg';
        break;
      case 'image/jpg':
        ext = '.jpg';
        break;
      case 'image/png':
        ext = '.png';
        break;
      case 'image/gif':
        ext = '.gif';
        break;
      case 'image/webp':
        ext = '.webp';
        break;
      default:
        ext = path.extname(file.originalname) || '.jpg';
    }
    
    const nameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));
    
    // ลบอักขระพิเศษออกจากชื่อไฟล์
    let safeName = nameWithoutExt.replace(/[^a-zA-Z0-9ก-๙]/g, '_');
    
    // จำกัดความยาวชื่อไฟล์ไม่เกิน 50 ตัวอักษร (ป้องกันชื่อยาวเกินไป)
    if (safeName.length > 50) {
      safeName = safeName.substring(0, 50);
    }
    
    // ถ้าชื่อไฟล์เป็น underscore ทั้งหมดหรือว่างเปล่า ให้ใช้ชื่อ default
    if (!safeName || safeName.match(/^_+$/)) {
      safeName = 'upload';
    }
    
    const finalFilename = safeName + '-' + uniqueSuffix + ext;
    
    // สร้างชื่อไฟล์สุดท้าย: safename-timestamp-random.ext
    cb(null, finalFilename);
  }
});

// ตั้งค่า Multer storage สำหรับรูปครู
const teacherStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, teachersUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    
    let ext = '';
    switch(file.mimetype) {
      case 'image/jpeg':
      case 'image/jpg':
        ext = '.jpg';
        break;
      case 'image/png':
        ext = '.png';
        break;
      case 'image/gif':
        ext = '.gif';
        break;
      case 'image/webp':
        ext = '.webp';
        break;
      default:
        ext = path.extname(file.originalname) || '.jpg';
    }
    
    const nameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));
    let safeName = nameWithoutExt.replace(/[^a-zA-Z0-9ก-๙]/g, '_');
    
    if (safeName.length > 20) {
      safeName = safeName.substring(0, 20);
    }
    
    if (!safeName || safeName.match(/^_+$/)) {
      safeName = 'teacher';
    }
    
    const finalFilename = safeName + '-' + uniqueSuffix + ext;
    cb(null, finalFilename);
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

// ตั้งค่า Multer สำหรับรูปครู
const teacherUpload = multer({
  storage: teacherStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Route สำหรับอัพโหลดรูปภาพ (Blog)
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาเลือกไฟล์รูปภาพ'
      });
    }

    // ลบรูปเก่าถ้ามี (ยกเว้น default avatar)
    const oldImagePath = req.body.oldImagePath;
    if (oldImagePath) {
      // ตรวจสอบว่าไม่ใช่ default avatar
      if (!oldImagePath.includes('default-avatar') && oldImagePath.includes('/uploads/')) {
        try {
          // ดึงชื่อไฟล์จาก URL
          const urlParts = oldImagePath.split('/uploads/');
          if (urlParts.length > 1) {
            const relativePath = urlParts[1];
            const fullPath = path.join(__dirname, '../../uploads/', relativePath);
            
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
            }
          }
        } catch (deleteError) {
          console.error('⚠️ Failed to delete old image:', deleteError);
          // ไม่ throw error เพื่อไม่ให้ขัดขวางการอัปโหลดรูปใหม่
        }
      }
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

// Route สำหรับอัพโหลดรูปครู
router.post('/teacher-image', teacherUpload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาเลือกไฟล์รูปภาพ'
      });
    }

    // ลบรูปเก่าถ้ามี (ยกเว้น default avatar)
    const oldImagePath = req.body.oldImagePath;
    if (oldImagePath) {
      if (!oldImagePath.includes('default-avatar') && oldImagePath.includes('/uploads/')) {
        try {
          const urlParts = oldImagePath.split('/uploads/');
          if (urlParts.length > 1) {
            const relativePath = urlParts[1];
            const fullPath = path.join(__dirname, '../../uploads/', relativePath);
            
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
            }
          }
        } catch (deleteError) {
          console.error('⚠️ Failed to delete old image:', deleteError);
        }
      }
    }

    // สร้าง URL ของรูปภาพครู
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/teachers/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'อัพโหลดรูปภาพครูสำเร็จ',
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

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/verifyToken');
const adminMiddleware = require('../middleware/admin');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

// ✅ Multer Configuration สำหรับรูปโปรไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/profiles';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // สร้างชื่อไฟล์ที่ไม่ซ้ำ: userId-timestamp.ext
        const ext = path.extname(file.originalname);
        const filename = `user-${req.user.id}-${Date.now()}${ext}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG and WebP are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: fileFilter
});

// ========================================
// 🔹 GET /api/profile - ดึงข้อมูลโปรไฟล์ของ user ที่ login อยู่
// ========================================
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                phone: true,
                profileImage: true,
                lastLogin: true,
                createdAt: true,
                roleId: true,
                teacherId: true,
                userroles: {
                    select: {
                        roleName: true
                    }
                },
                teacher_profile: {
                    select: {
                        id: true,
                        namePrefix: true,
                        firstName: true,
                        lastName: true,
                        position: true,
                        level: true,
                        phoneNumber: true,
                        email: true,
                        education: true,
                        major: true,
                        biography: true,
                        specializations: true,
                        imagePath: true,
                        departments_teachers_departmentIdTodepartments: {
                            select: { name: true }
                        },
                        // ห้องเรียนที่ครูคนนี้เป็นครูประจำชั้น (1 ครู : 1 ห้อง)
                        homeroom_classes: {
                            select: {
                                id: true,
                                className: true,
                                room: true,
                                floor: true,
                                building: true,
                                maxStudents: true,
                                isActive: true,
                                academicYear: {
                                    select: { id: true, year: true, isCurrent: true }
                                },
                                _count: { select: { students: true } }
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // สร้าง fullName computed field สำหรับ teacher_profile
        const responseData = {
            ...user,
            teacher_profile: user.teacher_profile ? {
                ...user.teacher_profile,
                fullName: `${user.teacher_profile.namePrefix || ''}${user.teacher_profile.firstName || ''}${user.teacher_profile.lastName ? ' ' + user.teacher_profile.lastName : ''}`.trim(),
                department: user.teacher_profile.departments_teachers_departmentIdTodepartments?.name || null,
                homeroom_class: user.teacher_profile.homeroom_classes ? {
                    ...user.teacher_profile.homeroom_classes,
                    studentCount: user.teacher_profile.homeroom_classes._count?.students ?? 0
                } : null
            } : null
        };

        res.status(200).json({
            success: true,
            data: responseData
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
});

// ========================================
// 🔹 PATCH /api/profile - แก้ไขข้อมูลโปรไฟล์
// ========================================
router.patch('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, phone } = req.body;

        // Validation
        if (!username || !email) {
            return res.status(400).json({ message: 'Username and email are required' });
        }

        // ตรวจสอบว่า username หรือ email ซ้ำกับคนอื่นหรือไม่
        const existingUser = await prisma.users.findFirst({
            where: {
                AND: [
                    { id: { not: userId } }, // ไม่ใช่ตัวเอง
                    {
                        OR: [
                            { username: username },
                            { email: email }
                        ]
                    }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: existingUser.username === username 
                    ? 'Username already taken' 
                    : 'Email already taken' 
            });
        }

        // อัปเดตข้อมูล users table
        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: {
                username,
                email,
                phone: phone || null
            },
            select: {
                id: true,
                username: true,
                email: true,
                phone: true,
                profileImage: true,
                lastLogin: true,
                teacherId: true
            }
        });

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

// ========================================
// 🔹 PATCH /api/profile/password - เปลี่ยนรหัสผ่าน
// ========================================
router.patch('/password', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New passwords do not match' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // ดึงข้อมูล user พร้อม password
        const user = await prisma.users.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // ตรวจสอบรหัสผ่านเดิม
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash รหัสผ่านใหม่
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // อัปเดตรหัสผ่าน และล้าง mustChangePassword flag ด้วย
        await prisma.users.update({
            where: { id: userId },
            data: { password: hashedPassword, mustChangePassword: false }
        });

        try {
            await prisma.audit_logs.create({
                data: {
                    userId: userId || null,
                    tableName: 'users',
                    recordId: userId,
                    action: 'UPDATE',
                    oldValues: JSON.stringify({ event: 'password_changed' }),
                    newValues: JSON.stringify({ event: 'password_changed', mustChangePassword: false }),
                    ipAddress: req.ip || req.connection?.remoteAddress || null,
                    userAgent: req.get('user-agent') || null
                }
            });
        } catch (auditError) {
            console.error('Error creating audit log:', auditError);
        }

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Failed to change password' });
    }
});

// ========================================
// 🔹 POST /api/profile/upload-image - อัปโหลดรูปโปรไฟล์
// ========================================
router.post('/upload-image', verifyToken, upload.single('profileImage'), async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // ลบรูปเก่าถ้ามี (ยกเว้น default avatar)
        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: { profileImage: true }
        });

        if (user.profileImage && user.profileImage !== '/default-avatar.jpg') {
            const oldImagePath = path.join(__dirname, '../../', user.profileImage);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // บันทึก path ใหม่
        const imagePath = `/uploads/profiles/${req.file.filename}`;
        
        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: { profileImage: imagePath },
            select: {
                id: true,
                username: true,
                profileImage: true
            }
        });
        
        res.status(200).json({
            success: true,
            message: 'Profile image uploaded successfully',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error uploading profile image:', error);
        // ลบไฟล์ที่อัปโหลดถ้าเกิด error
        if (req.file) {
            const filePath = path.join(__dirname, '../../uploads/profiles', req.file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        res.status(500).json({ message: 'Failed to upload image' });
    }
});

// ========================================
// 🔹 PATCH /api/profile/teacher - ครูแก้ไขข้อมูลตัวเองใน teachers table
//    อนุญาตเฉพาะ: phoneNumber, email, biography, specializations
//    ไม่อนุญาต: position, level, departmentId (admin only)
// ========================================
router.patch('/teacher', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // ดึง teacherId จาก users table
        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: { teacherId: true, userroles: { select: { roleName: true } } }
        });

        if (!user || !user.teacherId) {
            return res.status(403).json({ message: 'ไม่พบข้อมูลครูสำหรับผู้ใช้นี้' });
        }

        const { phoneNumber, email, education, major, biography, specializations } = req.body;

        // อนุญาตเฉพาะ fields ที่ครูแก้ไขเองได้
        const updateData = {};
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber || null;
        if (email !== undefined) {
            // ตรวจสอบ email ซ้ำในตาราง teachers (ยกเว้นตัวเอง)
            if (email) {
                const duplicate = await prisma.teachers.findFirst({
                    where: { email, id: { not: user.teacherId }, isDeleted: false }
                });
                if (duplicate) {
                    return res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้วโดยครูท่านอื่น' });
                }
            }
            updateData.email = email || null;
        }
        if (education !== undefined) updateData.education = education || '';
        if (major !== undefined) updateData.major = major || '';
        if (biography !== undefined) updateData.biography = biography || '';
        if (specializations !== undefined) updateData.specializations = specializations || '';

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'ไม่มีข้อมูลที่ต้องการอัปเดต' });
        }

        const updated = await prisma.teachers.update({
            where: { id: user.teacherId },
            data: updateData,
            select: {
                id: true,
                namePrefix: true,
                firstName: true,
                lastName: true,
                position: true,
                level: true,
                phoneNumber: true,
                email: true,
                education: true,
                major: true,
                biography: true,
                specializations: true,
                departments_teachers_departmentIdTodepartments: { select: { name: true } }
            }
        });

        res.status(200).json({
            success: true,
            message: 'อัปเดตข้อมูลครูสำเร็จ',
            data: {
                ...updated,
                fullName: `${updated.namePrefix || ''}${updated.firstName || ''}${updated.lastName ? ' ' + updated.lastName : ''}`.trim(),
                department: updated.departments_teachers_departmentIdTodepartments?.name || null
            }
        });
    } catch (error) {
        console.error('Error updating teacher profile:', error);
        res.status(500).json({ message: 'Failed to update teacher profile' });
    }
});

// ========================================
// 🔹 PATCH /api/profile/admin/reset-password/:userId - Admin รีเซ็ตรหัสผ่าน user อื่น
// ========================================
router.patch('/admin/reset-password/:userId', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // ตรวจสอบว่า user มีอยู่จริง
        const targetUser = await prisma.users.findUnique({
            where: { id: parseInt(userId) }
        });

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash รหัสผ่านใหม่
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // อัปเดตรหัสผ่าน
        await prisma.users.update({
            where: { id: parseInt(userId) },
            data: { password: hashedPassword }
        });

        try {
            await prisma.audit_logs.create({
                data: {
                    userId: req.userId || null,
                    tableName: 'users',
                    recordId: parseInt(userId),
                    action: 'UPDATE',
                    oldValues: JSON.stringify({ event: 'admin_password_reset' }),
                    newValues: JSON.stringify({ event: 'admin_password_reset', resetBy: req.userId, targetUser: targetUser.username }),
                    ipAddress: req.ip || req.connection?.remoteAddress || null,
                    userAgent: req.get('user-agent') || null
                }
            });
        } catch (auditError) {
            console.error('Error creating audit log:', auditError);
        }

        res.status(200).json({
            success: true,
            message: `Password reset successfully for user: ${targetUser.username}`
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
});

module.exports = router;

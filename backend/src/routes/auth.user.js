const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const generateToken = require('../middleware/generateToken');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/admin');
require('dotenv').config();

const prisma = new PrismaClient();

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { email, password, username, roleId = 5 } = req.body; // default to 'user' role (id: 5)
        
        // Check if user already exists
        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).send({ message: 'User with this email or username already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user with default profile image
        const user = await prisma.users.create({
            data: {
                email,
                password: hashedPassword,
                username,
                roleId: parseInt(roleId),
                profileImage: '/default-avatar.jpg', 
                phone: null, 
                lastLogin: null // Will be updated on first login
            },
            include: {
                userroles: true
            }
        });

        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        if (error.code === 'P2002') {
            return res.status(400).send({ message: 'Email or username already exists' });
        }
        res.status(500).send({ message: 'Registration failed' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        
        const user = await prisma.users.findUnique({
            where: { email },
            include: {
                userroles: true
            }
        });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Check if user is deleted
        if (user.isDeleted) {
            return res.status(401).send({ message: 'Account is deactivated' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        // บันทึก lastLogin
        await prisma.users.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        const cookieDays = rememberMe ? 30 : 1;
        const token = await generateToken(user.id, cookieDays); // Generate token with user ID
        
        // ตั้งค่า cookie ให้ปลอดภัย
        res.cookie('token', token, { 
            httpOnly: true,  // ป้องกัน XSS - JavaScript ไม่สามารถอ่านได้
            secure: process.env.NODE_ENV === 'production', // HTTPS only ใน production
            sameSite: 'Lax', // ป้องกัน CSRF - ส่ง cookie เฉพาะ same-site requests
            maxAge: cookieDays * 24 * 60 * 60 * 1000 // 1 วัน ถ้าไม่กด rememberMe  30 วัน ถ้ากด rememberMe
        });

        // Return user data without password
        const { password: _, ...userWithoutPassword } = user;
        
        res.status(200).send({ 
            message: 'Logged in successfully', 
            token, 
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.userroles.roleName,
                roleId: user.roleId,
                profileImage: user.profileImage,
                mustChangePassword: user.mustChangePassword || false
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send({ message: 'Login failed' });
    }
});

// Logout endpoint
router.post('/logout', (req, res) => {
    res.clearCookie('token'); 
    res.status(200).send({ message: 'Logged out successfully' });
});

// =============================================
// PASSWORD RESET SYSTEM
// =============================================

// POST /forgot-password - ผู้ใช้ส่งคำขอรีเซ็ตรหัสผ่าน
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'กรุณาระบุอีเมล' });

        const user = await prisma.users.findUnique({ where: { email } });
        if (!user || user.isDeleted) {
            // ตอบ success เสมอ
            return res.status(200).json({ message: 'ส่งคำขอสำเร็จ' });
        }

        // ตรวจสอบว่ามีคำขอ รอดำเนินการ อยู่แล้วหรือไม่
        const existing = await prisma.password_reset_requests.findFirst({
            where: { userId: user.id, status: 'pending' }
        });
        if (existing) {
            return res.status(200).json({ message: 'มีคำขอรอดำเนินการอยู่แล้ว กรุณารอให้แอดมินดำเนินการ' });
        }

        await prisma.password_reset_requests.create({
            data: { userId: user.id, status: 'pending' }
        });

        res.status(200).json({ message: 'ส่งคำขอสำเร็จ กรุณารอแอดมินดำเนินการ' });
    } catch (error) {
        console.error('forgot-password error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
    }
});

// GET /password-reset-requests - แอดมินดูคำขอทั้งหมด
router.get('/password-reset-requests', verifyToken, async (req, res) => {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึง' });
    }
    try {
        const requests = await prisma.password_reset_requests.findMany({
            where: { status: 'pending' },
            include: {
                user: {
                    select: { id: true, email: true, username: true }
                }
            },
            orderBy: { requestedAt: 'desc' }
        });
        res.status(200).json(requests);
    } catch (error) {
        console.error('get reset requests error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
    }
});

// POST /password-reset-requests/:id/approve - แอดมิน approve + สร้างรหัสชั่วคราว
router.post('/password-reset-requests/:id/approve', verifyToken, async (req, res) => {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึง' });
    }
    try {
        const { id } = req.params;
        const request = await prisma.password_reset_requests.findUnique({
            where: { id: parseInt(id) },
            include: { user: true }
        });
        if (!request || request.status !== 'pending') {
            return res.status(404).json({ message: 'ไม่พบคำขอหรือดำเนินการแล้ว' });
        }

        // สร้างรหัสชั่วคราว 8 ตัว (ตัวอักษร+ตัวเลข)
        const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let tempPassword = '';
        for (let i = 0; i < 8; i++) {
            tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const hashedTemp = await bcrypt.hash(tempPassword, 10);

        await prisma.$transaction([
            prisma.users.update({
                where: { id: request.userId },
                data: { password: hashedTemp, mustChangePassword: true }
            }),
            prisma.password_reset_requests.update({
                where: { id: parseInt(id) },
                data: { status: 'approved', resolvedAt: new Date(), resolvedBy: req.user.id }
            })
        ]);

        res.status(200).json({
            message: 'อนุมัติแล้ว กรุณาแจ้งรหัสชั่วคราวให้ผู้ใช้',
            email: request.user.email,
            tempPassword // แสดงให้แอดมินเห็น 1 ครั้งเท่านั้น
        });
        try {
            await prisma.audit_logs.create({
                data: {
                    userId: req.user.id || null,
                    tableName: 'password_reset_requests',
                    recordId: parseInt(id),
                    action: 'UPDATE',
                    oldValues: JSON.stringify({ status: 'pending' }),
                    newValues: JSON.stringify({ status: 'approved', resolvedBy: req.user.id, targetUserId: request.userId }),
                    ipAddress: req.ip || req.connection?.remoteAddress || null,
                    userAgent: req.get('user-agent') || null
                }
            });
        } catch (auditError) {
            console.error('Error creating audit log:', auditError);
        }    } catch (error) {
        console.error('approve reset error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
    }
});

// POST /password-reset-requests/:id/reject - แอดมิน reject
router.post('/password-reset-requests/:id/reject', verifyToken, async (req, res) => {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึง' });
    }
    try {
        const { id } = req.params;
        const request = await prisma.password_reset_requests.findUnique({ where: { id: parseInt(id) } });
        if (!request || request.status !== 'pending') {
            return res.status(404).json({ message: 'ไม่พบคำขอหรือดำเนินการแล้ว' });
        }
        await prisma.password_reset_requests.update({
            where: { id: parseInt(id) },
            data: { status: 'rejected', resolvedAt: new Date(), resolvedBy: req.user.id }
        });

        try {
            await prisma.audit_logs.create({
                data: {
                    userId: req.user.id || null,
                    tableName: 'password_reset_requests',
                    recordId: parseInt(id),
                    action: 'UPDATE',
                    oldValues: JSON.stringify({ status: 'pending' }),
                    newValues: JSON.stringify({ status: 'rejected', resolvedBy: req.user.id }),
                    ipAddress: req.ip || req.connection?.remoteAddress || null,
                    userAgent: req.get('user-agent') || null
                }
            });
        } catch (auditError) {
            console.error('Error creating audit log:', auditError);
        }

        res.status(200).json({ message: 'ปฏิเสธคำขอแล้ว' });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
    }
});

// POST /change-password - ผู้ใช้เปลี่ยนรหัสผ่านหลัง login ด้วยรหัสชั่วคราว
router.post('/change-password', verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' });
        }

        const user = await prisma.users.findUnique({ where: { id: req.user.id } });
        if (!user) return res.status(404).json({ message: 'ไม่พบผู้ใช้' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });

        const hashed = await bcrypt.hash(newPassword, 10);
        await prisma.users.update({
            where: { id: req.user.id },
            data: { password: hashed, mustChangePassword: false }
        });

        res.status(200).json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
    } catch (error) {
        console.error('change-password error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
    }
});

// Get user role counts (Admin + Teacher can access - no personal data exposed)
router.get('/users/stats', verifyToken, async (req, res) => {
    const allowed = ['admin', 'super_admin', 'teacher'];
    if (!allowed.includes(req.user.role)) {
        return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึง' });
    }
    try {
        // Include both isDeleted:false and isDeleted:null (nullable boolean field)
        const notDeleted = { OR: [{ isDeleted: false }, { isDeleted: null }] };
        const [superAdminCount, adminCount, teacherCount, userCount, totalUsers] = await Promise.all([
            prisma.users.count({ where: { ...notDeleted, userroles: { roleName: 'super_admin' } } }),
            prisma.users.count({ where: { ...notDeleted, userroles: { roleName: 'admin' } } }),
            prisma.users.count({ where: { ...notDeleted, userroles: { roleName: 'teacher' } } }),
            prisma.users.count({ where: { ...notDeleted, userroles: { roleName: 'user' } } }),
            prisma.users.count({ where: notDeleted })
        ]);

        res.status(200).json({
            superAdminCount,
            adminCount,
            teacherCount,
            userCount,
            totalUsers
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: 'Failed to fetch user stats' });
    }
});

// Get all users (Admin only)
router.get('/users', verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            where: {
                isDeleted: false
            },
            select: {
                id: true,
                email: true,
                username: true,
                roleId: true,
                userroles: {
                    select: {
                        roleName: true
                    }
                },
                createdAt: true,
                updatedAt: true
            }
        });

        // Map users to include role as string
        const formattedUsers = users.map(user => ({
            id: user.id,
            email: user.email,
            username: user.username,
            roleId: user.roleId,
            role: user.userroles?.roleName || 'user',
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));

        res.status(200).send(formattedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ message: 'Failed to fetch users' });
    }
});

// Soft delete a user (Admin only)
router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);

        const user = await prisma.users.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        if (user.isDeleted) {
            return res.status(400).send({ message: 'User is already deleted' });
        }

        // Soft delete the user
        await prisma.users.update({
            where: { id: userId },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        });

        try {
            await prisma.audit_logs.create({
                data: {
                    userId: req.userId || null,
                    tableName: 'users',
                    recordId: userId,
                    action: 'DELETE',
                    oldValues: JSON.stringify({ username: user.username, email: user.email }),
                    newValues: null,
                    ipAddress: req.ip || req.connection?.remoteAddress || null,
                    userAgent: req.get('user-agent') || null
                }
            });
        } catch (auditError) {
            console.error('Error creating audit log:', auditError);
        }

        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Failed to delete user' });
    }
});

// Update user role and username
router.put('/users/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { roleId, username } = req.body;
        const userId = parseInt(id);

        // Validate at least one field to update
        if (!roleId && !username) {
            return res.status(400).send({ message: 'No fields to update' });
        }

        // Validate roleId if provided
        if (roleId) {
            if (isNaN(parseInt(roleId))) {
                return res.status(400).send({ message: 'Invalid role ID' });
            }

            // Check if role exists
            const role = await prisma.userroles.findUnique({
                where: { id: parseInt(roleId) }
            });

            if (!role) {
                return res.status(400).send({ message: 'Role not found' });
            }
        }

        // Check if user exists
        const existingUser = await prisma.users.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        if (existingUser.isDeleted) {
            return res.status(400).send({ message: 'Cannot update deleted user' });
        }

        // Check if username is already taken (if username is being updated)
        if (username && username !== existingUser.username) {
            const usernameExists = await prisma.users.findFirst({
                where: {
                    username: username,
                    id: { not: userId },
                    isDeleted: false
                }
            });

            if (usernameExists) {
                return res.status(400).send({ message: 'Username already taken' });
            }
        }

        // Prepare update data
        const updateData = {
            updatedAt: new Date()
        };

        if (roleId) {
            updateData.roleId = parseInt(roleId);
        }

        if (username) {
            updateData.username = username.trim();
        }

        // Update user
        const user = await prisma.users.update({
            where: { id: userId },
            data: updateData,
            include: {
                userroles: true
            }
        });

        res.status(200).send({ 
            message: 'User role updated successfully', 
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                roleId: user.roleId,
                role: user.userroles.roleName
            }
        });

        try {
            await prisma.audit_logs.create({
                data: {
                    userId: req.userId || null,
                    tableName: 'users',
                    recordId: userId,
                    action: 'UPDATE',
                    oldValues: JSON.stringify({ username: existingUser.username, roleId: existingUser.roleId }),
                    newValues: JSON.stringify({ username: user.username, roleId: user.roleId }),
                    ipAddress: req.ip || req.connection?.remoteAddress || null,
                    userAgent: req.get('user-agent') || null
                }
            });
        } catch (auditError) {
            console.error('Error creating audit log:', auditError);
        }
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).send({ message: 'Failed to update user role' });
    }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);

        const user = await prisma.users.findUnique({
            where: { id: userId },
            include: {
                userroles: true,
                students_students_updatedByTousers: true,
                teacher_profile: {
                    include: {
                        departments_teachers_departmentIdTodepartments: true,
                        genders: true
                    }
                },
                superadmin: {
                    include: {
                        genders: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        if (user.isDeleted) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        res.status(200).send(userWithoutPassword);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send({ message: 'Failed to fetch user' });
    }
});

// Restore deleted user (Admin only)
router.patch('/users/:id/restore', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);

        const user = await prisma.users.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        if (!user.isDeleted) {
            return res.status(400).send({ message: 'User is not deleted' });
        }

        // Restore the user
        await prisma.users.update({
            where: { id: userId },
            data: {
                isDeleted: false,
                deletedAt: null // Set to null instead of default date
            }
        });

        try {
            await prisma.audit_logs.create({
                data: {
                    userId: req.userId || null,
                    tableName: 'users',
                    recordId: userId,
                    action: 'UPDATE',
                    oldValues: JSON.stringify({ isDeleted: true }),
                    newValues: JSON.stringify({ isDeleted: false, restoredBy: req.userId }),
                    ipAddress: req.ip || req.connection?.remoteAddress || null,
                    userAgent: req.get('user-agent') || null
                }
            });
        } catch (auditError) {
            console.error('Error creating audit log:', auditError);
        }

        res.status(200).send({ message: 'User restored successfully' });
    } catch (error) {
        console.error('Error restoring user:', error);
        res.status(500).send({ message: 'Failed to restore user' });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const generateToken = require('../middleware/generateToken');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/admin');
const { loginRateLimiter } = require('../middleware/rateLimiter');
const logger = require('../middleware/logger');
require('dotenv').config();

const prisma = new PrismaClient();

// Audit Log Helper 
// Fire-and-forget: เขียน 1 row ลง audit_logs และจัดการ error ของตัวเอง
// ❌ ห้ามส่ง password หรือ hashedPassword เข้าใน oldValues/newValues เด็ดขาด
const createAuditLog = async ({ actorId, tableName, recordId, action, oldValues, newValues, req }) => {
    try {
        await prisma.audit_logs.create({
            data: {
                userId: actorId ?? null,
                tableName,
                recordId,
                action,
                oldValues: oldValues !== undefined ? JSON.stringify(oldValues) : null,
                newValues: newValues !== undefined ? JSON.stringify(newValues) : null,
                ipAddress: req.ip || req.socket?.remoteAddress || null,
                userAgent: req.get?.('user-agent') || null
            }
        });
    } catch (err) {
        logger.error('AUDIT_LOG_WRITE_ERROR', { event: 'AUDIT_LOG_WRITE_ERROR', error: err.message });
    }
};


// endpoint สมัครสมาชิก
router.post('/register', async (req, res) => {
    try {
        const { email, password, username, roleId = 5 } = req.body; // default to 'user' role (id: 5)

        // ตรวจสอบความถูกต้องของข้อมูล
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'รูปแบบ email ไม่ถูกต้อง' });
        }
        if (!password || password.length < 8) {
            return res.status(400).json({ message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' });
        }
        if (!username || username.trim().length < 3 || username.trim().length > 12) {
            return res.status(400).json({ message: 'ชื่อผู้ใช้ต้องมี 3-12 ตัวอักษร' });
        }

        // ตรวจสอบว่ามี user อยู่แล้วหรือไม่
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

        // เข้ารหัส password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // สร้าง user พร้อม profile image ค่าเริ่มต้น
        const user = await prisma.users.create({
            data: {
                email,
                password: hashedPassword,
                username,
                roleId: parseInt(roleId),
                profileImage: '/default-avatar.jpg', 
                phone: null, 
                lastLogin: null // จะถูกอัปเดตตอน login ครั้งแรก
            },
            include: {
                userroles: true
            }
        });

        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
        await createAuditLog({
            actorId: null, // ผู้ใช้สมัครเอง ไม่มี admin ดำเนินการ
            tableName: 'users',
            recordId: user.id,
            action: 'CREATE',
            oldValues: null,
            newValues: { email: user.email, username: user.username, roleId: user.roleId },
            req
        });
        logger.info('USER_REGISTERED', {
            event: 'USER_REGISTERED',
            userId: user.id,
            email: user.email,
            username: user.username,
            ip
        });

        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        logger.error('REGISTER_ERROR', { event: 'REGISTER_ERROR', error: error.message, stack: error.stack });
        if (error.code === 'P2002') {
            return res.status(400).send({ message: 'Email or username already exists' });
        }
        res.status(500).send({ message: 'Registration failed' });
    }
});

// Login endpoint — ใช้ loginRateLimiter นับเฉพาะ request ที่ล้มเหลว
router.post('/login', loginRateLimiter, async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
        
        const user = await prisma.users.findUnique({
            where: { email },
            include: {
                userroles: true
            }
        });

        if (!user) {
            logger.warn('LOGIN_FAILED', { event: 'LOGIN_FAILED', email, reason: 'user_not_found', ip });
            // ไม่บอกว่า email ไม่มีอยู่ เพื่อป้องกัน user enumeration
            const remaining = req.rateLimit?.remaining ?? null;
            return res.status(401).json({
                message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
                ...(remaining !== null && { remainingAttempts: remaining })
            });
        }

        // ตรวจสอบว่า user ถูกลบแล้วหรือไม่
        if (user.isDeleted) {
            logger.warn('LOGIN_FAILED', { event: 'LOGIN_FAILED', email, reason: 'account_deactivated', ip });
            return res.status(401).send({ message: 'Account is deactivated' });
        }

        // ตรวจสอบรหัสผ่าน
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const remaining = req.rateLimit?.remaining ?? null;
            logger.warn('LOGIN_FAILED', { event: 'LOGIN_FAILED', email, reason: 'wrong_password', ip, remainingAttempts: remaining });
            return res.status(401).json({
                message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
                ...(remaining !== null && { remainingAttempts: remaining })
            });
        }

        // บันทึก lastLogin
        await prisma.users.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        // Token expiry และ Cookie maxAge ต้อง sync กัน
        const tokenExpiry = rememberMe ? '7d' : '2h';
        const cookieMaxAge = rememberMe
            ? 7 * 24 * 60 * 60 * 1000  // 7 วัน (ms)
            : 2 * 60 * 60 * 1000;       // 2 ชั่วโมง (ms)
        const token = await generateToken(user.id, tokenExpiry);
        
        // ตั้งค่า cookie ให้ปลอดภัย
        res.cookie('token', token, { 
            httpOnly: true,  // ป้องกัน XSS - JavaScript ไม่สามารถอ่านได้
            secure: process.env.NODE_ENV === 'production', // HTTPS only ใน production
            sameSite: 'Lax', // ป้องกัน CSRF - ส่ง cookie เฉพาะ same-site requests
            maxAge: cookieMaxAge // sync กับ tokenExpiry
        });

        logger.info('LOGIN_SUCCESS', {
            event: 'LOGIN_SUCCESS',
            userId: user.id,
            email: user.email,
            role: user.userroles?.roleName,
            ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip
        });

        // ส่งข้อมูล user กลับโดยไม่รวม password
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
        logger.error('LOGIN_ERROR', { event: 'LOGIN_ERROR', error: error.message, stack: error.stack });
        res.status(500).send({ message: 'Login failed' });
    }
});

// endpoint ออกจากระบบ
router.post('/logout', (req, res) => {
    res.clearCookie('token'); 
    res.status(200).send({ message: 'Logged out successfully' });
});

// =============================================
// ระบบรีเซ็ตรหัสผ่าน
// =============================================

// POST /forgot-password - ผู้ใช้ส่งคำขอรีเซ็ตรหัสผ่าน
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
        if (!email) return res.status(400).json({ message: 'กรุณาระบุอีเมล' });

        const user = await prisma.users.findUnique({ where: { email } });
        if (!user || user.isDeleted) {
            // ตอบ success เสมอ เพื่อป้องกัน user enumeration
            return res.status(200).json({ message: 'ส่งคำขอสำเร็จ' });
        }

        // ตรวจสอบว่ามีคำขอ รอดำเนินการ อยู่แล้วหรือไม่
        const existing = await prisma.password_reset_requests.findFirst({
            where: { userId: user.id, status: 'pending' }
        });
        if (existing) {
            logger.warn('PASSWORD_RESET_DUPLICATE', { event: 'PASSWORD_RESET_DUPLICATE', userId: user.id, ip });
            return res.status(200).json({ message: 'มีคำขอรอดำเนินการอยู่แล้ว กรุณารอให้แอดมินดำเนินการ' });
        }

        await prisma.password_reset_requests.create({
            data: { userId: user.id, status: 'pending' }
        });
        logger.info('PASSWORD_RESET_REQUESTED', { event: 'PASSWORD_RESET_REQUESTED', userId: user.id, ip });

        res.status(200).json({ message: 'ส่งคำขอสำเร็จ กรุณารอแอดมินดำเนินการ' });
    } catch (error) {
        logger.error('FORGOT_PASSWORD_ERROR', { event: 'FORGOT_PASSWORD_ERROR', error: error.message, stack: error.stack });
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
        logger.error('GET_RESET_REQUESTS_ERROR', { event: 'GET_RESET_REQUESTS_ERROR', error: error.message, stack: error.stack });
        res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
    }
});

// POST /password-reset-requests/:id/approve - แอดมินอนุมัติคำขอ และสร้างรหัสผ่านชั่วคราว
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

        await createAuditLog({
            actorId: req.user.id,
            tableName: 'password_reset_requests',
            recordId: parseInt(id),
            action: 'UPDATE',
            oldValues: { status: 'pending' },
            newValues: { status: 'approved', resolvedBy: req.user.id, targetUserId: request.userId },
            req
        });

        return res.status(200).json({
            message: 'อนุมัติแล้ว กรุณาแจ้งรหัสชั่วคราวให้ผู้ใช้',
            email: request.user.email,
            tempPassword // แสดงให้แอดมินเห็น 1 ครั้งเท่านั้น
        });
    } catch (error) {
        logger.error('APPROVE_RESET_ERROR', { event: 'APPROVE_RESET_ERROR', error: error.message, stack: error.stack });
        res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
    }
});

// POST /password-reset-requests/:id/reject - แอดมินปฏิเสธคำขอ
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

        await createAuditLog({
            actorId: req.user.id,
            tableName: 'password_reset_requests',
            recordId: parseInt(id),
            action: 'UPDATE',
            oldValues: { status: 'pending' },
            newValues: { status: 'rejected', resolvedBy: req.user.id },
            req
        });

        return res.status(200).json({ message: 'ปฏิเสธคำขอแล้ว' });
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

        await createAuditLog({
            actorId: req.user.id,
            tableName: 'users',
            recordId: req.user.id,
            action: 'UPDATE',
            oldValues: { mustChangePassword: true },   // ❌ ห้าม log password/hashedPassword
            newValues: { mustChangePassword: false },
            req
        });
        logger.info('PASSWORD_CHANGED', {
            event: 'PASSWORD_CHANGED',
            userId: req.user.id,
            ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip
        });

        return res.status(200).json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
    } catch (error) {
        logger.error('CHANGE_PASSWORD_ERROR', { event: 'CHANGE_PASSWORD_ERROR', userId: req.user?.id, error: error.message, stack: error.stack });
        res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
    }
});

// นับจำนวน user แต่ละ role (Admin และ Teacher เข้าถึงได้ — ไม่เปิดเผยข้อมูลส่วนบุคคล)
router.get('/users/stats', verifyToken, async (req, res) => {
    const allowed = ['admin', 'super_admin', 'teacher'];
    if (!allowed.includes(req.user.role)) {
        return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึง' });
    }
    try {
        // รวมทั้ง isDeleted:false และ isDeleted:null (nullable boolean field)
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
        logger.error('USER_STATS_ERROR', { event: 'USER_STATS_ERROR', error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Failed to fetch user stats' });
    }
});

// ดึงรายชื่อ user ทั้งหมด (Admin เท่านั้น)
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

        // แปลงข้อมูล user ให้มี role เป็น string
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
        logger.error('FETCH_USERS_ERROR', { event: 'FETCH_USERS_ERROR', error: error.message, stack: error.stack });
        res.status(500).send({ message: 'Failed to fetch users' });
    }
});

// ลบ user แบบ Soft Delete (Admin เท่านั้น)
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

        // Soft Delete — ไม่ลบข้อมูลออกจากฐานข้อมูลจริง
        await prisma.users.update({
            where: { id: userId },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        });

        await createAuditLog({
            actorId: req.user.id,
            tableName: 'users',
            recordId: userId,
            action: 'DELETE',
            oldValues: { username: user.username, email: user.email },
            newValues: null,
            req
        });

        logger.info('USER_DELETED', {
            event: 'USER_DELETED',
            adminId: req.user.id,
            targetUserId: userId,
            targetEmail: user.email,
            targetUsername: user.username,
            ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip
        });

        return res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        logger.error('DELETE_USER_ERROR', { event: 'DELETE_USER_ERROR', error: error.message, stack: error.stack });
        res.status(500).send({ message: 'Failed to delete user' });
    }
});

// แก้ไข role และ username ของ user
router.put('/users/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { roleId, username } = req.body;
        const userId = parseInt(id);

        // ต้องส่งอย่างน้อย 1 field มาเพื่ออัปเดต
        if (!roleId && !username) {
            return res.status(400).send({ message: 'No fields to update' });
        }

        // ตรวจสอบ roleId ถ้ามีการส่งมา
        if (roleId) {
            if (isNaN(parseInt(roleId))) {
                return res.status(400).send({ message: 'Invalid role ID' });
            }

            // ตรวจสอบว่า role มีอยู่ในระบบหรือไม่
            const role = await prisma.userroles.findUnique({
                where: { id: parseInt(roleId) }
            });

            if (!role) {
                return res.status(400).send({ message: 'Role not found' });
            }
        }

        // ตรวจสอบว่า user มีอยู่หรือไม่
        const existingUser = await prisma.users.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        if (existingUser.isDeleted) {
            return res.status(400).send({ message: 'Cannot update deleted user' });
        }

        // ตรวจสอบว่า username ซ้ำหรือไม่ (กรณีที่มีการแก้ไข username)
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

        // เตรียมข้อมูลที่จะอัปเดต
        const updateData = {
            updatedAt: new Date()
        };

        if (roleId) {
            updateData.roleId = parseInt(roleId);
        }

        if (username) {
            updateData.username = username.trim();
        }

        // อัปเดต user
        const user = await prisma.users.update({
            where: { id: userId },
            data: updateData,
            include: {
                userroles: true
            }
        });

        await createAuditLog({
            actorId: req.user.id,
            tableName: 'users',
            recordId: userId,
            action: 'UPDATE',
            oldValues: { username: existingUser.username, roleId: existingUser.roleId },
            newValues: { username: user.username, roleId: user.roleId },
            req
        });

        logger.info('USER_ROLE_UPDATED', {
            event: 'USER_ROLE_UPDATED',
            adminId: req.user.id,
            targetUserId: userId,
            targetEmail: existingUser.email,
            oldRoleId: existingUser.roleId,
            newRoleId: user.roleId,
            oldUsername: existingUser.username,
            newUsername: user.username,
            ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip
        });

        return res.status(200).send({ 
            message: 'User role updated successfully', 
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                roleId: user.roleId,
                role: user.userroles.roleName
            }
        });
    } catch (error) {
        logger.error('UPDATE_USER_ERROR', { event: 'UPDATE_USER_ERROR', error: error.message, stack: error.stack });
        res.status(500).send({ message: 'Failed to update user role' });
    }
});

// ดึงข้อมูล user ตาม ID
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

        // ไม่ส่ง password กลับไปใน response
        const { password, ...userWithoutPassword } = user;

        res.status(200).send(userWithoutPassword);
    } catch (error) {
        logger.error('FETCH_USER_ERROR', { event: 'FETCH_USER_ERROR', error: error.message, stack: error.stack });
        res.status(500).send({ message: 'Failed to fetch user' });
    }
});

// คืนสถานะ user ที่ถูกลบ (Admin เท่านั้น)
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

        // คืนสถานะ user
        await prisma.users.update({
            where: { id: userId },
            data: {
                isDeleted: false,
                deletedAt: null // ล้างค่าวันที่ลบ
            }
        });

        await createAuditLog({
            actorId: req.user.id,
            tableName: 'users',
            recordId: userId,
            action: 'UPDATE',
            oldValues: { isDeleted: true },
            newValues: { isDeleted: false, restoredBy: req.user.id },
            req
        });

        return res.status(200).send({ message: 'User restored successfully' });
    } catch (error) {
        logger.error('RESTORE_USER_ERROR', { event: 'RESTORE_USER_ERROR', error: error.message, stack: error.stack });
        res.status(500).send({ message: 'Failed to restore user' });
    }
});

module.exports = router;
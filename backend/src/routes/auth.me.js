// auth.me.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/verifyToken');

const prisma = new PrismaClient();

// Get authenticated user's information
router.get('/me', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;

        const user = await prisma.users.findUnique({
            where: { 
                id: userId
            },
            include: {
                userroles: true,
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
                        departments_teachers_departmentIdTodepartments: true,
                        genders: true
                    }
                }
            }
        });

        // เช็ค user ว่ามีและไม่ได้ถูกลบ
        if (!user || user.isDeleted) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove sensitive information
        const { password, ...userWithoutPassword } = user;

        res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.userroles.roleName,
                roleId: user.roleId,
                teacherId: user.teacherId,
                profileImage: user.profileImage || null,
                mustChangePassword: user.mustChangePassword || false,
                teacher: user.teacher_profile,
                teacher_profile: user.teacher_profile ? {
                    ...user.teacher_profile,
                    fullName: `${user.teacher_profile.namePrefix || ''}${user.teacher_profile.firstName || ''}${user.teacher_profile.lastName ? ' ' + user.teacher_profile.lastName : ''}`.trim()
                } : null
            }
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
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
                students_students_updatedByTousers: true,
                teachers_teachers_teacherIdTousers: {
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
                student: user.students_students_updatedByTousers,
                teacher: user.teachers_teachers_teacherIdTousers,
                superAdmin: user.superadmin
            }
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
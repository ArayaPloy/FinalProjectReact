const jwt = require('jsonwebtoken');
// const User = require('../model/user.model');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Example function to generate JWT token
const generateToken = async (userId) => {
    try {
        const user = await prisma.users.findUnique({
            where: { 
                id: userId,
                isDeleted: false 
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

        if (!user) {
            throw new Error('User not found');
        }

        const payload = {
            userId: user.id,
            email: user.email,
            username: user.username,
            role: user.userroles.roleName,
            roleId: user.roleId
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw error;
    }
};

module.exports = generateToken;

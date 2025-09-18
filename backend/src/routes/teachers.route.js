// routes/teachers.route.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/admin');

const prisma = new PrismaClient();

// Get all teachers grouped by department (public route)
router.get('/by-department', async (req, res) => {
    try {
        const teachers = await prisma.teacher.findMany({
            where: {
                isDeleted: false
            },
            include: {
                department: true,
                gender: true
            },
            orderBy: [
                { departmentId: 'asc' },
                { position: 'asc' },
                { fullName: 'asc' }
            ]
        });

        // Create department mapping for the frontend
        const departmentMapping = {
            1: 'administration', // คณะผู้บริหาร
            2: 'thai',          // กลุ่มสาระภาษาไทย
            3: 'math',          // กลุ่มสาระคณิตศาสตร์
            4: 'science',       // กลุ่มสาระวิทยาศาสตร์และเทคโนโลยี
            5: 'social',        // กลุ่มสาระสังคมศึกษาฯ
            6: 'health',        // กลุ่มสาระสุขศึกษาฯ
            7: 'art',           // กลุ่มสาระศิลปะ
            8: 'foreign',       // กลุ่มสาระภาษาต่างประเทศ
            9: 'support'        // เจ้าหน้าที่สนับสนุน
        };

        // Group teachers by department
        const teachersByDepartment = teachers.reduce((acc, teacher) => {
            const deptKey = departmentMapping[teacher.departmentId] || 'other';
            if (!acc[deptKey]) {
                acc[deptKey] = [];
            }
            acc[deptKey].push({
                id: teacher.id,
                name: teacher.fullName,
                namePrefix: teacher.namePrefix,
                position: teacher.position,
                level: teacher.level,
                email: teacher.email || '',
                phone: teacher.phoneNumber,
                address: teacher.address || '',
                education: teacher.education || '',
                major: teacher.major || '',
                biography: teacher.biography || '',
                specializations: teacher.specializations || '',
                nationality: teacher.nationality,
                image: teacher.imagePath || '',
                department: teacher.department?.name,
                gender: teacher.gender?.genderName,
                dob: teacher.dob
            });
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            data: teachersByDepartment
        });
    } catch (error) {
        console.error('Error fetching teachers by department:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch teachers by department',
            error: error.message
        });
    }
});

// Get all teachers (public route)
router.get('/', async (req, res) => {
    try {
        const { department, search } = req.query;

        const whereClause = {
            isDeleted: false
        };

        if (department) {
            // Map department names to IDs - you'll need to adjust these IDs based on your data
            const departmentIds = {
                'administration': 1,
                'thai': 2,
                'math': 3,
                'science': 4,
                'social': 5,
                'health': 6,
                'art': 7,
                'foreign': 8,
                'support': 9
            };
            whereClause.departmentId = departmentIds[department];
        }

        if (search) {
            whereClause.OR = [
                { fullName: { contains: search } },
                { position: { contains: search } },
                { namePrefix: { contains: search } }
            ];
        }

        const teachers = await prisma.teacher.findMany({
            where: whereClause,
            include: {
                department: true,
                gender: true,
                user: {
                    select: {
                        email: true
                    }
                }
            },
            orderBy: [
                { departmentId: 'asc' },
                { position: 'asc' },
                { fullName: 'asc' }
            ]
        });

        const formattedTeachers = teachers.map(teacher => ({
            id: teacher.id,
            name: teacher.fullName,
            namePrefix: teacher.namePrefix,
            position: teacher.position,
            level: teacher.level,
            email: teacher.email || '',
            phone: teacher.phoneNumber,
            address: teacher.address || '',
            education: teacher.education || '',
            major: teacher.major || '',
            biography: teacher.biography || '',
            specializations: teacher.specializations || '',
            nationality: teacher.nationality,
            image: teacher.imagePath || '',
            department: teacher.department?.name,
            gender: teacher.gender?.genderName,
            dob: teacher.dob
        }));

        res.status(200).json({
            success: true,
            data: formattedTeachers,
            count: formattedTeachers.length
        });
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch teachers',
            error: error.message
        });
    }
});

// Get single teacher (public route)
router.get('/:id', async (req, res) => {
    try {
        const teacherId = parseInt(req.params.id);

        if (isNaN(teacherId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid teacher ID'
            });
        }

        const teacher = await prisma.teacher.findFirst({
            where: {
                id: teacherId,
                isDeleted: false
            },
            include: {
                department: true,
                gender: true
            }
        });

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        const formattedTeacher = {
            id: teacher.id,
            name: teacher.fullName,
            namePrefix: teacher.namePrefix,
            position: teacher.position,
            level: teacher.level,
            email: teacher.email || '',
            phone: teacher.phoneNumber,
            address: teacher.address || '',
            education: teacher.education || '',
            major: teacher.major || '',
            biography: teacher.biography || '',
            specializations: teacher.specializations || '',
            nationality: teacher.nationality,
            image: teacher.imagePath || '',
            department: teacher.department?.name,
            gender: teacher.gender?.genderName,
            dob: teacher.dob
        };

        res.status(200).json({
            success: true,
            data: formattedTeacher
        });
    } catch (error) {
        console.error('Error fetching teacher:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch teacher',
            error: error.message
        });
    }
});

// Create teacher (protected route - admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const {
            userId,
            departmentId,
            namePrefix,
            fullName,
            genderId,
            dob,
            nationality,
            position,
            level,
            phoneNumber
        } = req.body;

        const teacher = await prisma.teacher.create({
            data: {
                userId,
                departmentId,
                namePrefix,
                fullName,
                genderId,
                dob: dob ? new Date(dob) : null,
                nationality,
                position,
                level,
                phoneNumber,
                updatedBy: req.userId
            },
            include: {
                department: true,
                gender: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Teacher created successfully',
            data: teacher
        });
    } catch (error) {
        console.error('Error creating teacher:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create teacher',
            error: error.message
        });
    }
});

// Update teacher (protected route - admin only)
router.patch('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const teacherId = parseInt(req.params.id);
        const updates = req.body;

        if (isNaN(teacherId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid teacher ID'
            });
        }

        // Check if teacher exists
        const existingTeacher = await prisma.teacher.findFirst({
            where: {
                id: teacherId,
                isDeleted: false
            }
        });

        if (!existingTeacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        // Convert dob to Date if provided
        if (updates.dob) {
            updates.dob = new Date(updates.dob);
        }

        const updatedTeacher = await prisma.teacher.update({
            where: {
                id: teacherId
            },
            data: {
                ...updates,
                updatedBy: req.userId,
                updatedAt: new Date()
            },
            include: {
                department: true,
                gender: true
            }
        });

        res.status(200).json({
            success: true,
            message: 'Teacher updated successfully',
            data: updatedTeacher
        });
    } catch (error) {
        console.error('Error updating teacher:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update teacher',
            error: error.message
        });
    }
});

// Delete teacher (soft delete - protected route)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const teacherId = parseInt(req.params.id);

        if (isNaN(teacherId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid teacher ID'
            });
        }

        // Check if teacher exists
        const existingTeacher = await prisma.teacher.findFirst({
            where: {
                id: teacherId,
                isDeleted: false
            }
        });

        if (!existingTeacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        // Soft delete
        await prisma.teacher.update({
            where: {
                id: teacherId
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                updatedBy: req.userId
            }
        });

        res.status(200).json({
            success: true,
            message: 'Teacher deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete teacher',
            error: error.message
        });
    }
});

// Get departments (public route)
router.get('/departments/list', async (req, res) => {
    try {
        const departments = await prisma.department.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        res.status(200).json({
            success: true,
            data: departments
        });
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch departments',
            error: error.message
        });
    }
});

module.exports = router;
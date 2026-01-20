// routes/homevisits.route.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/admin');

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/homevisits/';

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const cleanName = file.originalname.replace(/[^a-zA-Z0-9]/g, '');
        cb(null, `homevisit-${uniqueSuffix}-${cleanName}${extension}`);
    }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
        files: 5 // Maximum 5 files
    }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 2MB per file.'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum 5 files allowed.'
            });
        }
    }
    if (err.message === 'Only image files are allowed!') {
        return res.status(400).json({
            success: false,
            message: 'Only image files (JPG, PNG, GIF) are allowed.'
        });
    }
    next(err);
};

const safeConvert = (value, defaultValue = null) => {
    if (value === undefined || value === null || value === 'undefined' || value === 'null' || value === '') {
        return defaultValue;
    }
    return value;
};

const parseJsonField = (field) => {
    if (!field || field === 'null' || field === 'undefined' || field === '') return null;
    if (typeof field === 'object') return JSON.stringify(field);
    if (typeof field === 'string') {
        if (field.startsWith('[') || field.startsWith('{')) {
            try {
                JSON.parse(field);
                return field;
            } catch {
                return JSON.stringify(field);
            }
        }
        return JSON.stringify(field);
    }
    return JSON.stringify(field);
};

// Get all home visits (admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 10, teacherId, studentId, startDate, endDate, search } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = { isDeleted: false };

        if (teacherId) whereClause.teacherId = parseInt(teacherId);
        if (studentId) whereClause.studentId = parseInt(studentId);
        if (startDate && endDate) {
            whereClause.visitDate = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }
        if (search) {
            whereClause.OR = [
                { studentName: { contains: search } },
                { studentIdNumber: { contains: search } },
                { parentName: { contains: search } },
                { teacherName: { contains: search } }
            ];
        }

        const [homeVisits, total] = await Promise.all([
            prisma.homevisits.findMany({
                where: whereClause,
                include: {
                    teachers: { select: { id: true, fullName: true, namePrefix: true, position: true } },
                    students: { select: { id: true, fullName: true, namePrefix: true, classRoom: true } }
                },
                orderBy: { visitDate: 'desc' },
                skip: offset,
                take: parseInt(limit)
            }),
            prisma.homevisits.count({ where: whereClause })
        ]);

        res.status(200).json({
            success: true,
            data: homeVisits,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching home visits:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch home visits', error: error.message });
    }
});

// Get single home visit (admin only)
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const homeVisitId = parseInt(req.params.id);

        if (isNaN(homeVisitId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid home visit ID'
            });
        }

        const homeVisit = await prisma.homevisits.findFirst({
            where: {
                id: homeVisitId,
                isDeleted: false
            },
            include: {
                teachers: {
                    select: {
                        id: true,
                        fullName: true,
                        namePrefix: true,
                        position: true,
                        level: true,
                        email: true,
                        phoneNumber: true
                    }
                },
                students: {
                    select: {
                        id: true,
                        fullName: true,
                        namePrefix: true,
                        classRoom: true,
                        phoneNumber: true
                    }
                }
            }
        });

        if (!homeVisit) {
            return res.status(404).json({
                success: false,
                message: 'Home visit not found'
            });
        }

        res.status(200).json({
            success: true,
            data: homeVisit
        });

    } catch (error) {
        console.error('Error fetching home visit:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch home visit',
            error: error.message
        });
    }
});

router.post('/', verifyToken, upload.array('images', 5), async (req, res) => {
    try {
        const body = req.body;

        // Convert any checkbox/multiselect fields to JSON
        const jsonField = (val) => {
            if (!val) return null;
            if (typeof val === 'string') {
                try {
                    return JSON.stringify(JSON.parse(val));
                } catch {
                    return JSON.stringify(val);
                }
            }
            return JSON.stringify(val);
        };

        // Handle uploaded images
        const imagePaths = req.files ? req.files.map(f => `/uploads/homevisits/${f.filename}`) : [];

        const data = {
            teacherId: body.teacherId ? parseInt(body.teacherId) : null,
            studentId: body.studentId ? parseInt(body.studentId) : null,
            updatedBy: req.userId,
            visitDate: body.visitDate ? new Date(body.visitDate) : null,
            teacherName: body.teacherName || null,
            studentIdNumber: body.studentIdNumber || null,
            studentName: body.studentName || null,
            studentBirthDate: body.studentBirthDate ? new Date(body.studentBirthDate) : null,
            className: body.className || null,
            parentName: body.parentName || null,
            relationship: body.relationship || null,
            occupation: body.occupation || null,
            monthlyIncome: body.monthlyIncome || null,
            familyStatus: jsonField(body.familyStatus),
            mainAddress: body.mainAddress || null,
            phoneNumber: body.phoneNumber || null,
            emergencyContact: body.emergencyContact || null,
            houseType: jsonField(body.houseType),
            houseMaterial: jsonField(body.houseMaterial),
            utilities: jsonField(body.utilities),
            environmentCondition: body.environmentCondition || null,
            studyArea: body.studyArea || null,
            visitPurpose: jsonField(body.visitPurpose),
            studentBehaviorAtHome: body.studentBehaviorAtHome || null,
            parentCooperation: body.parentCooperation || null,
            problems: body.problems || null,
            recommendations: body.recommendations || null,
            followUpPlan: body.followUpPlan || null,
            summary: body.summary || null,
            notes: body.notes || null,
            imagePath: imagePaths.length ? imagePaths[0] : null,
            imageGallery: imagePaths.length > 1 ? JSON.stringify(imagePaths.slice(1)) : null,
        };

        const newVisit = await prisma.homevisits.create({ data });
        res.status(201).json({ success: true, data: newVisit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create home visit', error: error.message });
    }
});

// Update home visit
router.put('/:id', verifyToken, upload.array('images', 5), handleMulterError, async (req, res) => {
    try {
        const homeVisitId = parseInt(req.params.id);

        if (isNaN(homeVisitId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid home visit ID'
            });
        }

        // Check if home visit exists
        const existingVisit = await prisma.homevisits.findFirst({
            where: {
                id: homeVisitId,
                isDeleted: false
            }
        });

        if (!existingVisit) {
            return res.status(404).json({
                success: false,
                message: 'Home visit not found'
            });
        }

        const updates = { ...req.body };

        // Process uploaded images
        let newImagePaths = [];
        if (req.files && req.files.length > 0) {
            newImagePaths = req.files.map(file => `/uploads/homevisits/${file.filename}`);

            // Delete old images if replace flag is set
            if (updates.replaceImages === 'true') {
                // Delete old files from filesystem
                if (existingVisit.imagePath) {
                    deleteFile(existingVisit.imagePath);
                }
                if (existingVisit.imageGallery && Array.isArray(existingVisit.imageGallery)) {
                    existingVisit.imageGallery.forEach(imagePath => {
                        deleteFile(imagePath);
                    });
                }
            }
        }

        // Helper function
        const deleteFile = (filePath) => {
            const fullPath = path.join(__dirname, '..', filePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        };

        // Parse JSON fields
        const parseJsonField = (field) => {
            if (!field || field === 'null' || field === 'undefined' || field === '') return null;

            if (typeof field === 'string') {
                if (field.startsWith('[') || field.startsWith('{')) {
                    try {
                        JSON.parse(field);
                        return field;
                    } catch (e) {
                        return JSON.stringify(field);
                    }
                } else {
                    return JSON.stringify(field);
                }
            }

            if (typeof field === 'object') {
                return JSON.stringify(field);
            }

            return JSON.stringify(field);
        };

        // Prepare update data
        const updateData = {
            ...updates,
            updatedBy: req.userId,
            updatedAt: new Date()
        };

        // Handle JSON fields -  เพิ่มฟิลด์ที่เป็น JSON
        if (updates.familyStatus) updateData.familyStatus = parseJsonField(updates.familyStatus);
        if (updates.houseType) updateData.houseType = parseJsonField(updates.houseType);
        if (updates.houseMaterial) updateData.houseMaterial = parseJsonField(updates.houseMaterial);
        if (updates.utilities) updateData.utilities = parseJsonField(updates.utilities);
        if (updates.visitPurpose) updateData.visitPurpose = parseJsonField(updates.visitPurpose);

        // Handle simple text fields 
        if (updates.monthlyIncome) updateData.monthlyIncome = updates.monthlyIncome;
        if (updates.phoneNumber) updateData.phoneNumber = updates.phoneNumber;
        if (updates.emergencyContact) updateData.emergencyContact = updates.emergencyContact;
        if (updates.environmentCondition) updateData.environmentCondition = updates.environmentCondition;
        if (updates.studyArea) updateData.studyArea = updates.studyArea;
        if (updates.notes) updateData.notes = updates.notes;

        // Handle image updates
        if (newImagePaths.length > 0) {
            if (updates.replaceImages === 'true') {
                updateData.imagePath = newImagePaths[0]; // First image as main
                updateData.imageGallery = newImagePaths.length > 1 ? JSON.stringify(newImagePaths.slice(1)) : null; // gallery
            } else {
                // Append to existing images
                const existingGallery = existingVisit.imageGallery 
                    ? (typeof existingVisit.imageGallery === 'string' 
                        ? JSON.parse(existingVisit.imageGallery) 
                        : existingVisit.imageGallery)
                    : [];
                
                // ถ้ายังไม่มี imagePath ให้ใช้รูปแรกเป็น imagePath
                if (!existingVisit.imagePath && newImagePaths.length > 0) {
                    updateData.imagePath = newImagePaths[0];
                    // เก็บรูปที่เหลือใน gallery
                    if (newImagePaths.length > 1) {
                        updateData.imageGallery = JSON.stringify([...existingGallery, ...newImagePaths.slice(1)]);
                    }
                } else {
                    // มี imagePath แล้ว เก็บรูปใหม่ทั้งหมดใน gallery
                    updateData.imageGallery = JSON.stringify([...existingGallery, ...newImagePaths]);
                }
            }
        }

        // Handle date fields
        if (updates.visitDate) {
            updateData.visitDate = new Date(updates.visitDate);
        }
        if (updates.studentBirthDate) {
            updateData.studentBirthDate = new Date(updates.studentBirthDate);
        }

        // Remove non-database fields
        delete updateData.replaceImages;

        // Update home visit
        const updatedVisit = await prisma.homevisits.update({
            where: { id: homeVisitId },
            data: updateData,
            include: {
                teachers: {
                    select: {
                        id: true,
                        fullName: true,
                        namePrefix: true,
                        position: true
                    }
                },
                students: {
                    select: {
                        id: true,
                        fullName: true,
                        namePrefix: true,
                        classRoom: true
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            message: 'Home visit updated successfully',
            data: updatedVisit
        });

    } catch (error) {
        console.error('Error updating home visit:', error);

        // Clean up uploaded files if database operation failed
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update home visit',
            error: error.message
        });
    }
});

// Delete home visit (soft delete)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const homeVisitId = parseInt(req.params.id);

        if (isNaN(homeVisitId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid home visit ID'
            });
        }

        // Check if home visit exists
        const existingVisit = await prisma.homevisits.findFirst({
            where: {
                id: homeVisitId,
                isDeleted: false
            }
        });

        if (!existingVisit) {
            return res.status(404).json({
                success: false,
                message: 'Home visit not found'
            });
        }

        // Soft delete
        await prisma.homevisits.update({
            where: { id: homeVisitId },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                updatedBy: req.userId
            }
        });

        res.status(200).json({
            success: true,
            message: 'Home visit deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting home visit:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete home visit',
            error: error.message
        });
    }
});

// Serve uploaded files
router.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads/homevisits/', filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
        res.sendFile(path.resolve(filePath));
    } else {
        res.status(404).json({
            success: false,
            message: 'File not found'
        });
    }
});

// Get home visit statistics
router.get('/stats/overview', verifyToken, isAdmin, async (req, res) => {
    try {
        const { startDate, endDate, teacherId } = req.query;

        const whereClause = {
            isDeleted: false
        };

        if (startDate && endDate) {
            whereClause.visitDate = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        if (teacherId) {
            whereClause.teacherId = parseInt(teacherId);
        }

        const [
            totalVisits,
            visitsWithProblems,
            uniqueStudents,
            uniqueTeachers,
            monthlyStats
        ] = await Promise.all([
            prisma.homevisits.count({ where: whereClause }),
            prisma.homevisits.count({
                where: {
                    ...whereClause,
                    problems: { not: null }
                }
            }),
            prisma.homevisits.findMany({
                where: whereClause,
                select: { studentId: true },
                distinct: ['studentId']
            }),
            prisma.homevisits.findMany({
                where: whereClause,
                select: { teacherId: true },
                distinct: ['teacherId']
            }),
            prisma.$queryRaw`
                SELECT 
                    DATE_FORMAT(visitDate, '%Y-%m') as month,
                    COUNT(*) as visits,
                    COUNT(DISTINCT studentId) as students,
                    COUNT(CASE WHEN problems IS NOT NULL AND problems != '' THEN 1 END) as problemVisits
                FROM homevisits 
                WHERE isDeleted = 0 
                ${whereClause.visitDate ? `AND visitDate BETWEEN '${startDate}' AND '${endDate}'` : ''}
                ${whereClause.teacherId ? `AND teacherId = ${whereClause.teacherId}` : ''}
                GROUP BY DATE_FORMAT(visitDate, '%Y-%m')
                ORDER BY month DESC
                LIMIT 12
            `
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalVisits,
                visitsWithProblems,
                uniqueStudents: uniqueStudents.length,
                uniqueTeachers: uniqueTeachers.length,
                problemRate: totalVisits > 0 ? (visitsWithProblems / totalVisits * 100).toFixed(2) : 0,
                monthlyStats
            }
        });

    } catch (error) {
        console.error('Error fetching home visit statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
});

module.exports = router;
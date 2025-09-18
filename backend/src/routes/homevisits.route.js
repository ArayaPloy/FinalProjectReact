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

// Get all home visits (admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            teacherId,
            studentId,
            startDate,
            endDate,
            search
        } = req.query;

        const offset = (page - 1) * limit;

        const whereClause = {
            isDeleted: false
        };

        if (teacherId) {
            whereClause.teacherId = parseInt(teacherId);
        }

        if (studentId) {
            whereClause.studentId = parseInt(studentId);
        }

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
            prisma.homeVisit.findMany({
                where: whereClause,
                include: {
                    teacher: {
                        select: {
                            id: true,
                            fullName: true,
                            namePrefix: true,
                            position: true
                        }
                    },
                    student: {
                        select: {
                            id: true,
                            fullName: true,
                            namePrefix: true,
                            classRoom: true
                        }
                    }
                },
                orderBy: {
                    visitDate: 'desc'
                },
                skip: offset,
                take: parseInt(limit)
            }),
            prisma.homeVisit.count({ where: whereClause })
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
        res.status(500).json({
            success: false,
            message: 'Failed to fetch home visits',
            error: error.message
        });
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

        const homeVisit = await prisma.homeVisit.findFirst({
            where: {
                id: homeVisitId,
                isDeleted: false
            },
            include: {
                teacher: {
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
                student: {
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

// Create new home visit with file upload

// Create new home visit with file upload
router.post('/', verifyToken, upload.array('images', 5), handleMulterError, async (req, res) => {
    try {
        const {
            studentId,
            teacherId,
            studentIdNumber,
            studentName,
            className,
            teacherName,
            visitDate,
            parentName,
            relationship,
            occupation,
            studentBirthDate,
            monthlyIncome,
            familyStatus,
            mainAddress,
            phoneNumber,
            emergencyContact,
            houseType,
            houseMaterial,
            utilities,
            environmentCondition,
            studyArea,
            visitPurpose,
            studentBehaviorAtHome,
            parentCooperation,
            problems,
            recommendations,
            followUpPlan,
            summary,
            notes
        } = req.body;

        console.log('Raw form data:', req.body); // Debug log
        console.log('visitPurpose raw:', visitPurpose);
        console.log('visitPurpose type:', typeof visitPurpose);

        // Validation
        const requiredFields = ['studentIdNumber', 'studentName', 'className', 'teacherName', 'visitDate', 'parentName', 'relationship', 'occupation', 'mainAddress', 'visitPurpose', 'summary'];
        const missingFields = requiredFields.filter(field => !req.body[field] || req.body[field] === 'null' || req.body[field] === 'undefined');

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Required fields: ${missingFields.join(', ')}`
            });
        }

        // Process uploaded images
        let imagePaths = [];
        let mainImagePath = null;

        if (req.files && req.files.length > 0) {
            imagePaths = req.files.map(file => `/uploads/homevisits/${file.filename}`);
            mainImagePath = imagePaths[0]; // First image as main image
        }

        // Helper function to safely convert values
        const safeConvert = (value, defaultValue = null) => {
            if (value === undefined || value === null || value === 'undefined' || value === 'null' || value === '') {
                return defaultValue;
            }
            return value;
        };

        // Helper function for JSON fields
        // Update parseJsonField to ensure it returns valid JSON or null
        const parseJsonField = (field) => {
            if (!field || field === 'null' || field === 'undefined' || field === '') return null;

            if (typeof field === 'string') {
                // Check if it's already valid JSON
                try {
                    JSON.parse(field);
                    return field; // It's already valid JSON
                } catch (e) {
                    // Not valid JSON, so stringify it
                    return JSON.stringify(field);
                }
            }

            // If it's an object or array, stringify it
            if (typeof field === 'object') {
                return JSON.stringify(field);
            }

            // For any other type, stringify it
            return JSON.stringify(field);
        };

        // Replace the processedVisitPurpose logic with this:
        let processedVisitPurpose = null;
        if (visitPurpose && visitPurpose !== 'null' && visitPurpose !== 'undefined') {
            // If it's a string that looks like an array
            if (typeof visitPurpose === 'string' && visitPurpose.startsWith('[')) {
                // It's already JSON, just use it
                processedVisitPurpose = visitPurpose;
            } else if (typeof visitPurpose === 'string' && visitPurpose.startsWith('"') && visitPurpose.endsWith('"')) {
                // It's already a JSON string
                processedVisitPurpose = visitPurpose;
            } else {
                // Convert to JSON string
                processedVisitPurpose = JSON.stringify(visitPurpose);
            }
        } else {
            processedVisitPurpose = null;
        }

        console.log('processedVisitPurpose:', processedVisitPurpose);
        console.log('processedVisitPurpose length:', processedVisitPurpose?.length);

        // Create the data object
        const createData = {
            studentId: studentId && studentId !== 'null' ? parseInt(studentId) : null,
            teacherId: teacherId && teacherId !== 'null' ? parseInt(teacherId) : null,
            studentIdNumber: safeConvert(studentIdNumber),
            studentName: safeConvert(studentName),
            className: safeConvert(className),
            teacherName: safeConvert(teacherName),
            visitDate: new Date(visitDate),
            parentName: safeConvert(parentName),
            relationship: safeConvert(relationship),
            occupation: safeConvert(occupation),
            monthlyIncome: safeConvert(monthlyIncome),
            studentBirthDate: studentBirthDate && studentBirthDate !== 'null' ? new Date(studentBirthDate) : null,
            familyStatus: parseJsonField(familyStatus),
            mainAddress: safeConvert(mainAddress),
            phoneNumber: safeConvert(phoneNumber),
            emergencyContact: safeConvert(emergencyContact),
            houseType: parseJsonField(houseType),
            houseMaterial: parseJsonField(houseMaterial),
            utilities: parseJsonField(utilities),
            environmentCondition: safeConvert(environmentCondition),
            studyArea: safeConvert(studyArea),
            visitPurpose: visitPurpose ? JSON.stringify(visitPurpose) : null,
            studentBehaviorAtHome: safeConvert(studentBehaviorAtHome),
            parentCooperation: safeConvert(parentCooperation),
            problems: safeConvert(problems),
            recommendations: safeConvert(recommendations),
            followUpPlan: safeConvert(followUpPlan),
            summary: safeConvert(summary),
            notes: safeConvert(notes),
            imagePath: mainImagePath,
            imageGallery: imagePaths.length > 0 ? JSON.stringify(imagePaths) : null,
            updatedBy: req.userId
        };

        console.log('Data to be created:', createData);

        // Create home visit record
        const homeVisit = await prisma.homeVisit.create({
            data: createData,
            include: {
                teacher: {
                    select: {
                        id: true,
                        fullName: true,
                        namePrefix: true,
                        position: true
                    }
                },
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        namePrefix: true,
                        classRoom: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Home visit record created successfully',
            data: homeVisit
        });

    } catch (error) {
        console.error('Error creating home visit:', error);
        console.error('Error details:', error.stack);

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
            message: 'Failed to create home visit record',
            error: error.message
        });
    }
});

// Update home visit with optional new images
router.patch('/:id', verifyToken, upload.array('images', 5), handleMulterError, async (req, res) => {
    try {
        const homeVisitId = parseInt(req.params.id);
        const updates = req.body;

        if (isNaN(homeVisitId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid home visit ID'
            });
        }

        // Check if home visit exists
        const existingVisit = await prisma.homeVisit.findFirst({
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

        // Process new uploaded images
        let newImagePaths = [];
        if (req.files && req.files.length > 0) {
            newImagePaths = req.files.map(file => `/uploads/homevisits/${file.filename}`);

            // Delete old images if replacing
            if (updates.replaceImages === 'true') {
                const deleteFile = (filePath) => {
                    const fullPath = path.join(__dirname, '../', filePath);
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                    }
                };

                // Delete old main image
                if (existingVisit.imagePath) {
                    deleteFile(existingVisit.imagePath);
                }

                // Delete old gallery images
                if (existingVisit.imageGallery && Array.isArray(existingVisit.imageGallery)) {
                    existingVisit.imageGallery.forEach(imagePath => {
                        deleteFile(imagePath);
                    });
                }
            }
        }

        // Parse JSON fields
        const parseJsonField = (field) => {
            if (!field) return undefined;
            try {
                return JSON.parse(field);
            } catch (e) {
                return field;
            }
        };

        // Prepare update data
        const updateData = {
            ...updates,
            updatedBy: req.userId,
            updatedAt: new Date()
        };

        // Handle JSON fields
        if (updates.familyStatus) updateData.familyStatus = parseJsonField(updates.familyStatus);
        if (updates.houseType) updateData.houseType = parseJsonField(updates.houseType);
        if (updates.houseMaterial) updateData.houseMaterial = parseJsonField(updates.houseMaterial);
        if (updates.utilities) updateData.utilities = parseJsonField(updates.utilities);
        if (updates.visitPurpose) updateData.visitPurpose = parseJsonField(updates.visitPurpose);

        // Handle image updates
        if (newImagePaths.length > 0) {
            if (updates.replaceImages === 'true') {
                updateData.imagePath = newImagePaths[0];
                updateData.imageGallery = newImagePaths;
            } else {
                // Append to existing images
                const existingImages = existingVisit.imageGallery || [];
                updateData.imageGallery = [...existingImages, ...newImagePaths];
                if (!existingVisit.imagePath && newImagePaths.length > 0) {
                    updateData.imagePath = newImagePaths[0];
                }
            }
        }

        // Handle date fields
        if (updates.visitDate) {
            updateData.visitDate = new Date(updates.visitDate);
        }

        // Remove non-database fields
        delete updateData.replaceImages;

        // Update home visit
        const updatedVisit = await prisma.homeVisit.update({
            where: { id: homeVisitId },
            data: updateData,
            include: {
                teacher: {
                    select: {
                        id: true,
                        fullName: true,
                        namePrefix: true,
                        position: true
                    }
                },
                student: {
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
        const existingVisit = await prisma.homeVisit.findFirst({
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
        await prisma.homeVisit.update({
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
            prisma.homeVisit.count({ where: whereClause }),
            prisma.homeVisit.count({
                where: {
                    ...whereClause,
                    problems: { not: null }
                }
            }),
            prisma.homeVisit.findMany({
                where: whereClause,
                select: { studentId: true },
                distinct: ['studentId']
            }),
            prisma.homeVisit.findMany({
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
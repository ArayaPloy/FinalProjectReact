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

// Resolve teacherId linked to the authenticated user (if any)
const getUserTeacherId = async (userId) => {
    const user = await prisma.users.findUnique({ where: { id: userId }, select: { teacherId: true } });
    return user ? user.teacherId : null;
};

// Authorization helper (pure) - exported for unit testing
const isTeacherHomeroomMatch = (userRole, userTeacherId, targetHomeroomTeacherId) => {
    if (!userRole) return false;
    if (userRole.toLowerCase() !== 'teacher') return false;
    if (!userTeacherId || !targetHomeroomTeacherId) return false;
    return parseInt(userTeacherId) === parseInt(targetHomeroomTeacherId);
};

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

// Get student by studentNumber (for auto-fill)
router.get('/student/:studentNumber', verifyToken, async (req, res) => {
    try {
        const studentNumber = parseInt(req.params.studentNumber);

        if (isNaN(studentNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid student number'
            });
        }

        const student = await prisma.students.findFirst({
            where: {
                studentNumber: studentNumber,
                isDeleted: false
            },
            include: {
                genders: { select: { genderName: true } },
                homeroomClass: {
                    select: {
                        className: true,
                        homeroomTeacherId: true,
                        homeroomTeacher: {
                            select: {
                                id: true,
                                namePrefix: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                }
            }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });

    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch student data',
            error: error.message
        });
    }
});

// Get all home visits (admin or homeroom teacher - limited)
router.get('/', verifyToken, async (req, res) => {
    try {
        const { page = 1, limit = 10, teacherId, studentId, startDate, endDate, search } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = { isDeleted: false };

        // If requester is a teacher, restrict results to students where they are the homeroom teacher
        if (req.user && req.user.role && req.user.role.toLowerCase() === 'teacher') {
            const userTeacherId = await getUserTeacherId(req.userId);
            if (!userTeacherId) {
                return res.status(403).json({ success: false, message: 'ไม่พบข้อมูลครูของผู้ใช้นี้' });
            }

            // If a teacherId query param is provided but does not match the current teacher, deny
            if (teacherId && parseInt(teacherId) !== userTeacherId) {
                return res.status(403).json({ success: false, message: 'คุณไม่ได้รับอนุญาตให้ดูข้อมูลของครูคนอื่น' });
            }

            // Restrict to students whose homeroom teacher is the current teacher (via normalized homeroomClass)
            whereClause.students = { homeroomClass: { homeroomTeacherId: userTeacherId } };
        }

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
                {
                    students: {
                        OR: [
                            { firstName: { contains: search } },
                            { lastName: { contains: search } },
                            { studentNumber: { equals: parseInt(search) || undefined } }
                        ]
                    }
                },
                {
                    teachers: {
                        OR: [
                            { firstName: { contains: search } },
                            { lastName: { contains: search } }
                        ]
                    }
                },
                { parentFirstName: { contains: search } },
                { parentLastName: { contains: search } }
            ];
        }

        const [homeVisits, total] = await Promise.all([
            prisma.homevisits.findMany({
                where: whereClause,
                include: {
                    teachers: { select: { id: true, firstName: true, lastName: true, namePrefix: true, position: true } },
                    students: { select: { id: true, studentNumber: true, firstName: true, lastName: true, namePrefix: true, address: true, phoneNumber: true, emergencyContact: true, guardianFirstName: true, guardianLastName: true, guardianNamePrefix: true, guardianRelation: true, guardianOccupation: true, guardianMonthlyIncome: true, houseType: true, houseMaterial: true, utilities: true, studyArea: true, homeroomClass: { select: { className: true } } } }
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

// Get single home visit (admin or homeroom teacher)
router.get('/:id', verifyToken, async (req, res) => {
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
                        firstName: true,
                        lastName: true,
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
                        studentNumber: true,
                        firstName: true,
                        lastName: true,
                        namePrefix: true,
                        phoneNumber: true,
                        homeroomClass: { select: { homeroomTeacherId: true, className: true } },
                        emergencyContact: true,
                        address: true,
                        houseType: true,
                        houseMaterial: true,
                        utilities: true,
                        studyArea: true,
                        guardianFirstName: true,
                        guardianLastName: true,
                        guardianNamePrefix: true,
                        guardianRelation: true,
                        guardianOccupation: true,
                        guardianMonthlyIncome: true
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

        // Authorization: if requester is a teacher, allow only if they are the homeroom teacher of this student
        if (req.user && req.user.role && req.user.role.toLowerCase() === 'teacher') {
            const userTeacherId = await getUserTeacherId(req.userId);
            if (!userTeacherId) {
                return res.status(403).json({ success: false, message: 'ไม่พบข้อมูลครูของผู้ใช้นี้' });
            }
            if (!homeVisit.students || homeVisit.students.homeroomClass?.homeroomTeacherId !== userTeacherId) {
                return res.status(403).json({ success: false, message: 'คุณไม่ได้รับอนุญาตให้ดูรายงานของนักเรียนนี้' });
            }
        }

        // Build fallback fullName fields so frontend can use `fullName`
        if (homeVisit.teachers) {
            const t = homeVisit.teachers;
            const teacherFullName = `${t.firstName || ''}${t.lastName ? ' ' + t.lastName : ''}`.trim();
            homeVisit.teachers.fullName = teacherFullName;
        }
        if (homeVisit.students) {
            const s = homeVisit.students;
            const studentFullName = `${s.firstName || ''}${s.lastName ? ' ' + s.lastName : ''}`.trim();
            homeVisit.students.fullName = studentFullName;
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

        // Validate required foreign keys
        if (!body.studentId) {
            return res.status(400).json({ success: false, message: 'studentId is required' });
        }

        // Ensure related records exist
        const studentExists = await prisma.students.findUnique({ where: { id: parseInt(body.studentId) }, include: { homeroomClass: { select: { homeroomTeacherId: true } } } });
        if (!studentExists) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Authorization: Non-admin teachers may only create visits for students where they are the homeroom teacher
        if (req.user && req.user.role && req.user.role.toLowerCase() === 'teacher') {
            const userTeacherId = await getUserTeacherId(req.userId);
            if (!userTeacherId) {
                return res.status(403).json({ success: false, message: 'ไม่พบข้อมูลครูของผู้ใช้นี้' });
            }
            if (studentExists.homeroomClass?.homeroomTeacherId !== userTeacherId) {
                return res.status(403).json({ success: false, message: 'คุณไม่ได้รับอนุญาตให้บันทึกข้อมูลสำหรับนักเรียนนี้' });
            }

            // Force teacherId to the authenticated teacher to prevent spoofing
            body.teacherId = userTeacherId;
        } else if (req.user && req.user.role && (req.user.role.toLowerCase() === 'admin' || req.user.role.toLowerCase() === 'super_admin')) {
            // Admin may provide teacherId; if provided, ensure teacher exists
            if (body.teacherId) {
                const teacherExists = await prisma.teachers.findUnique({ where: { id: parseInt(body.teacherId) } });
                if (!teacherExists) {
                    return res.status(404).json({ success: false, message: 'Teacher not found' });
                }
            }
        } else {
            return res.status(403).json({ success: false, message: 'คุณไม่ได้รับอนุญาตให้ดำเนินการนี้' });
        }

        const data = {
            teacherId: body.teacherId ? parseInt(body.teacherId) : null,
            studentId: body.studentId ? parseInt(body.studentId) : null,
            updatedBy: req.userId,
            visitDate: body.visitDate ? new Date(body.visitDate) : null,
            parentNamePrefix: body.parentNamePrefix || null,
            parentFirstName: body.parentFirstName || null,
            parentLastName: body.parentLastName || null,
            familyStatus: body.familyStatus || null,
            visitPurpose: body.visitPurpose || '',
            studentBehaviorAtHome: body.studentBehaviorAtHome || null,
            parentCooperation: body.parentCooperation || null,
            problems: body.problems || null,
            recommendations: body.recommendations || null,
            followUpPlan: body.followUpPlan || null,
            summary: body.summary || '',
            notes: body.notes || null,
            imagePath: imagePaths.length ? imagePaths[0] : null,
            imageGallery: imagePaths.length > 1 ? JSON.stringify(imagePaths.slice(1)) : null,
        };

        const newVisit = await prisma.homevisits.create({ data });
        try {
            await prisma.audit_logs.create({
                data: {
                    userId: req.userId || null,
                    tableName: 'homevisits',
                    recordId: newVisit.id,
                    action: 'CREATE',
                    oldValues: null,
                    newValues: JSON.stringify({ studentId: data.studentId, visitDate: data.visitDate, teacherId: data.teacherId }),
                    ipAddress: req.ip || req.connection?.remoteAddress || null,
                    userAgent: req.get('user-agent') || null
                }
            });
        } catch (auditError) {
            console.error('Error creating audit log:', auditError);
        }
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

        // Authorization: Non-admin teachers may only update visits for students where they are the homeroom teacher
        if (req.user && req.user.role && req.user.role.toLowerCase() === 'teacher') {
            const userTeacherId = await getUserTeacherId(req.userId);
            if (!userTeacherId) {
                return res.status(403).json({ success: false, message: 'ไม่พบข้อมูลครูของผู้ใช้นี้' });
            }
            // Fetch related student to verify homeroom
            const hv = await prisma.homevisits.findUnique({ where: { id: homeVisitId }, include: { students: { include: { homeroomClass: { select: { homeroomTeacherId: true } } } } } });
            if (!hv || !hv.students || hv.students.homeroomClass?.homeroomTeacherId !== userTeacherId) {
                return res.status(403).json({ success: false, message: 'คุณไม่ได้รับอนุญาตให้แก้ไขรายงานของนักเรียนนี้' });
            }
        }

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
                        firstName: true,
                        lastName: true,
                        namePrefix: true,
                        position: true
                    }
                },
                students: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        namePrefix: true,
                        homeroomClass: { select: { className: true } }
                    }
                }
            }
        });

        try {
            await prisma.audit_logs.create({
                data: {
                    userId: req.userId || null,
                    tableName: 'homevisits',
                    recordId: homeVisitId,
                    action: 'UPDATE',
                    oldValues: JSON.stringify({ visitDate: existingVisit.visitDate, summary: existingVisit.summary }),
                    newValues: JSON.stringify({ visitDate: updateData.visitDate || existingVisit.visitDate, summary: updateData.summary }),
                    ipAddress: req.ip || req.connection?.remoteAddress || null,
                    userAgent: req.get('user-agent') || null
                }
            });
        } catch (auditError) {
            console.error('Error creating audit log:', auditError);
        }
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

        try {
            await prisma.audit_logs.create({
                data: {
                    userId: req.userId || null,
                    tableName: 'homevisits',
                    recordId: homeVisitId,
                    action: 'DELETE',
                    oldValues: JSON.stringify({ studentId: existingVisit.studentId, visitDate: existingVisit.visitDate }),
                    newValues: null,
                    ipAddress: req.ip || req.connection?.remoteAddress || null,
                    userAgent: req.get('user-agent') || null
                }
            });
        } catch (auditError) {
            console.error('Error creating audit log:', auditError);
        }

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

// Export router and auth helpers together
module.exports = router;
module.exports.authHelpers = {
    isTeacherHomeroomMatch
};
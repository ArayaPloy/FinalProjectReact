// routes/clubs.route.js - Fixed to handle invalid datetime values
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/admin');

const prisma = new PrismaClient();

// Temporary categories until schema is updated
const defaultCategories = [
    'ศิลปะและงานฝีมือ',
    'วิทยาศาสตร์',
    'เทคโนโลยี',
    'ดนตรี',
    'ภาษา',
    'ภาษาและวรรณกรรม',
    'กีฬา'
];

// Get all clubs (public route)
router.get('/', async (req, res) => {
    try {
        const { category, search, isActive } = req.query;

        const whereClause = {
            deletedAt: null // Only get non-deleted clubs
        };

        if (search) {
            whereClause.OR = [
                { name: { contains: search } },
                { description: { contains: search } }
            ];
        }

        // Get clubs with raw query to handle invalid dates
        const clubs = await prisma.$queryRaw`
            SELECT 
                ac.id,
                ac.name,
                ac.description,
                ac.maxMembers,
                ac.teacherId,
                CASE 
                    WHEN ac.category IS NULL OR ac.category = '' THEN 'ศิลปะและงานฝีมือ'
                    ELSE ac.category
                END as category,
                CASE 
                    WHEN ac.icon IS NULL OR ac.icon = '' THEN 'IoColorPalette'
                    ELSE ac.icon
                END as icon,
                CASE 
                    WHEN ac.registrationDeadline = '0000-00-00' OR ac.registrationDeadline IS NULL THEN NULL
                    ELSE ac.registrationDeadline
                END as registrationDeadline,
                COALESCE(ac.isActive, 1) as isActive,
                ac.meetingDay,
                ac.meetingTime,
                ac.location,
                ac.requirements,
                ac.createdAt,
                ac.updatedAt,
                t.id as teacher_id,
                t.fullName as teacher_fullName,
                t.namePrefix as teacher_namePrefix,
                t.position as teacher_position,
                t.level as teacher_level
            FROM academicclubs ac
            LEFT JOIN teachers t ON ac.teacherId = t.id AND t.isDeleted = 0
            WHERE ac.deletedAt IS NULL
            ORDER BY ac.name ASC
        `;

        const formattedClubs = clubs.map(club => ({
            id: club.id,
            name: club.name,
            description: club.description,
            maxMembers: club.maxMembers || 20,
            teacherId: club.teacherId,
            teacher: club.teacher_id ? {
                id: club.teacher_id,
                name: club.teacher_fullName,
                namePrefix: club.teacher_namePrefix,
                position: club.teacher_position,
                level: club.teacher_level
            } : null,
            category: club.category,
            icon: club.icon,
            registrationDeadline: club.registrationDeadline,
            isActive: Boolean(club.isActive),
            meetingDay: club.meetingDay,
            meetingTime: club.meetingTime,
            location: club.location,
            requirements: club.requirements,
            createdAt: club.createdAt,
            updatedAt: club.updatedAt
        }));

        // Filter by category if provided
        const filteredClubs = category && category !== 'ทั้งหมด' 
            ? formattedClubs.filter(club => club.category === category)
            : formattedClubs;

        // Filter by active status if provided
        const finalClubs = isActive !== undefined 
            ? filteredClubs.filter(club => club.isActive === (isActive === 'true'))
            : filteredClubs;

        res.status(200).json({
            success: true,
            data: finalClubs,
            count: finalClubs.length
        });
    } catch (error) {
        console.error('Error fetching clubs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch clubs',
            error: error.message
        });
    }
});

// Get single club (public route)
router.get('/:id', async (req, res) => {
    try {
        const clubId = parseInt(req.params.id);

        if (isNaN(clubId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid club ID'
            });
        }

        // Use raw query to handle invalid dates
        const clubData = await prisma.$queryRaw`
            SELECT 
                ac.id,
                ac.name,
                ac.description,
                ac.maxMembers,
                ac.teacherId,
                CASE 
                    WHEN ac.category IS NULL OR ac.category = '' THEN 'ศิลปะและงานฝีมือ'
                    ELSE ac.category
                END as category,
                CASE 
                    WHEN ac.icon IS NULL OR ac.icon = '' THEN 'IoColorPalette'
                    ELSE ac.icon
                END as icon,
                CASE 
                    WHEN ac.registrationDeadline = '0000-00-00' OR ac.registrationDeadline IS NULL THEN NULL
                    ELSE ac.registrationDeadline
                END as registrationDeadline,
                COALESCE(ac.isActive, 1) as isActive,
                ac.meetingDay,
                ac.meetingTime,
                ac.location,
                ac.requirements,
                ac.createdAt,
                ac.updatedAt,
                t.id as teacher_id,
                t.fullName as teacher_fullName,
                t.namePrefix as teacher_namePrefix,
                t.position as teacher_position,
                t.level as teacher_level,
                t.email as teacher_email,
                t.phoneNumber as teacher_phoneNumber
            FROM academicclubs ac
            LEFT JOIN teachers t ON ac.teacherId = t.id AND t.isDeleted = 0
            WHERE ac.id = ${clubId} AND ac.deletedAt IS NULL
            LIMIT 1
        `;

        if (!clubData || clubData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Club not found'
            });
        }

        const club = clubData[0];
        const formattedClub = {
            id: club.id,
            name: club.name,
            description: club.description,
            maxMembers: club.maxMembers || 20,
            teacherId: club.teacherId,
            teacher: club.teacher_id ? {
                id: club.teacher_id,
                name: club.teacher_fullName,
                namePrefix: club.teacher_namePrefix,
                position: club.teacher_position,
                level: club.teacher_level,
                email: club.teacher_email,
                phone: club.teacher_phoneNumber
            } : null,
            category: club.category,
            icon: club.icon,
            registrationDeadline: club.registrationDeadline,
            isActive: Boolean(club.isActive),
            meetingDay: club.meetingDay,
            meetingTime: club.meetingTime,
            location: club.location,
            requirements: club.requirements,
            createdAt: club.createdAt,
            updatedAt: club.updatedAt
        };

        res.status(200).json({
            success: true,
            data: formattedClub
        });
    } catch (error) {
        console.error('Error fetching club:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch club',
            error: error.message
        });
    }
});

// Create club (protected route - admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const {
            name,
            description,
            maxMembers,
            teacherId,
            category,
            icon,
            registrationDeadline,
            isActive,
            meetingDay,
            meetingTime,
            location,
            requirements
        } = req.body;

        // Validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'Name and description are required'
            });
        }

        // Check if teacher exists
        if (teacherId) {
            const teacher = await prisma.teacher.findFirst({
                where: {
                    id: teacherId,
                    isDeleted: false
                }
            });

            if (!teacher) {
                return res.status(400).json({
                    success: false,
                    message: 'Teacher not found'
                });
            }
        }

        // Use raw SQL insert to handle optional fields safely
        const result = await prisma.$executeRaw`
            INSERT INTO academicclubs (
                name, 
                description, 
                maxMembers, 
                teacherId,
                category,
                icon,
                registrationDeadline,
                isActive,
                meetingDay,
                meetingTime,
                location,
                requirements,
                updatedBy,
                createdAt,
                updatedAt
            ) VALUES (
                ${name},
                ${description},
                ${maxMembers || 20},
                ${teacherId || null},
                ${category || 'ศิลปะและงานฝีมือ'},
                ${icon || 'IoColorPalette'},
                ${registrationDeadline ? new Date(registrationDeadline) : null},
                ${isActive !== undefined ? isActive : true},
                ${meetingDay || null},
                ${meetingTime || null},
                ${location || null},
                ${requirements || null},
                ${req.userId},
                NOW(),
                NOW()
            )
        `;

        // Get the created club
        const createdClub = await prisma.$queryRaw`
            SELECT ac.*, t.fullName as teacher_fullName, t.namePrefix as teacher_namePrefix
            FROM academicclubs ac
            LEFT JOIN teachers t ON ac.teacherId = t.id
            WHERE ac.id = LAST_INSERT_ID()
        `;

        res.status(201).json({
            success: true,
            message: 'Club created successfully',
            data: createdClub[0]
        });
    } catch (error) {
        console.error('Error creating club:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create club',
            error: error.message
        });
    }
});

// Update club (protected route - admin only)
router.patch('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const clubId = parseInt(req.params.id);
        const updates = req.body;

        if (isNaN(clubId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid club ID'
            });
        }

        // Check if club exists
        const existingClub = await prisma.$queryRaw`
            SELECT id FROM academicclubs WHERE id = ${clubId} AND deletedAt IS NULL
        `;

        if (!existingClub || existingClub.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Club not found'
            });
        }

        // Check if teacher exists (if teacherId is being updated)
        if (updates.teacherId) {
            const teacher = await prisma.teacher.findFirst({
                where: {
                    id: updates.teacherId,
                    isDeleted: false
                }
            });

            if (!teacher) {
                return res.status(400).json({
                    success: false,
                    message: 'Teacher not found'
                });
            }
        }

        // Build update query dynamically
        const updateFields = [];
        const updateValues = [];

        if (updates.name !== undefined) {
            updateFields.push('name = ?');
            updateValues.push(updates.name);
        }
        if (updates.description !== undefined) {
            updateFields.push('description = ?');
            updateValues.push(updates.description);
        }
        if (updates.maxMembers !== undefined) {
            updateFields.push('maxMembers = ?');
            updateValues.push(updates.maxMembers);
        }
        if (updates.teacherId !== undefined) {
            updateFields.push('teacherId = ?');
            updateValues.push(updates.teacherId);
        }
        if (updates.category !== undefined) {
            updateFields.push('category = ?');
            updateValues.push(updates.category);
        }
        if (updates.icon !== undefined) {
            updateFields.push('icon = ?');
            updateValues.push(updates.icon);
        }
        if (updates.registrationDeadline !== undefined) {
            updateFields.push('registrationDeadline = ?');
            updateValues.push(updates.registrationDeadline ? new Date(updates.registrationDeadline) : null);
        }
        if (updates.isActive !== undefined) {
            updateFields.push('isActive = ?');
            updateValues.push(updates.isActive);
        }
        if (updates.meetingDay !== undefined) {
            updateFields.push('meetingDay = ?');
            updateValues.push(updates.meetingDay);
        }
        if (updates.meetingTime !== undefined) {
            updateFields.push('meetingTime = ?');
            updateValues.push(updates.meetingTime);
        }
        if (updates.location !== undefined) {
            updateFields.push('location = ?');
            updateValues.push(updates.location);
        }
        if (updates.requirements !== undefined) {
            updateFields.push('requirements = ?');
            updateValues.push(updates.requirements);
        }

        // Add updatedBy and updatedAt
        updateFields.push('updatedBy = ?', 'updatedAt = NOW()');
        updateValues.push(req.userId);

        if (updateFields.length === 2) { // Only updatedBy and updatedAt
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        // Execute update
        await prisma.$executeRawUnsafe(`
            UPDATE academicclubs 
            SET ${updateFields.join(', ')} 
            WHERE id = ? AND deletedAt IS NULL
        `, ...updateValues, clubId);

        // Get updated club
        const updatedClub = await prisma.$queryRaw`
            SELECT ac.*, t.fullName as teacher_fullName, t.namePrefix as teacher_namePrefix
            FROM academicclubs ac
            LEFT JOIN teachers t ON ac.teacherId = t.id
            WHERE ac.id = ${clubId}
        `;

        res.status(200).json({
            success: true,
            message: 'Club updated successfully',
            data: updatedClub[0]
        });
    } catch (error) {
        console.error('Error updating club:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update club',
            error: error.message
        });
    }
});

// Delete club (soft delete - protected route)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const clubId = parseInt(req.params.id);

        if (isNaN(clubId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid club ID'
            });
        }

        // Check if club exists
        const existingClub = await prisma.$queryRaw`
            SELECT id FROM academicclubs WHERE id = ${clubId} AND deletedAt IS NULL
        `;

        if (!existingClub || existingClub.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Club not found'
            });
        }

        // Soft delete
        await prisma.$executeRaw`
            UPDATE academicclubs 
            SET deletedAt = NOW(), updatedBy = ${req.userId} 
            WHERE id = ${clubId}
        `;

        res.status(200).json({
            success: true,
            message: 'Club deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting club:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete club',
            error: error.message
        });
    }
});

// Get club categories (public route)
router.get('/categories/list', async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: defaultCategories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
});

// Get club statistics (admin only)
router.get('/stats/overview', verifyToken, isAdmin, async (req, res) => {
    try {
        const totalClubs = await prisma.$queryRaw`
            SELECT COUNT(*) as count FROM academicclubs WHERE deletedAt IS NULL
        `;

        const activeClubs = await prisma.$queryRaw`
            SELECT COUNT(*) as count FROM academicclubs 
            WHERE deletedAt IS NULL AND (isActive IS NULL OR isActive = 1)
        `;

        const today = new Date();
        const openForRegistration = await prisma.$queryRaw`
            SELECT COUNT(*) as count FROM academicclubs 
            WHERE deletedAt IS NULL 
            AND (isActive IS NULL OR isActive = 1)
            AND (registrationDeadline IS NULL OR registrationDeadline >= ${today})
            AND registrationDeadline != '0000-00-00'
        `;

        const totalCapacity = await prisma.$queryRaw`
            SELECT SUM(COALESCE(maxMembers, 0)) as total FROM academicclubs 
            WHERE deletedAt IS NULL
        `;

        res.status(200).json({
            success: true,
            data: {
                totalClubs: Number(totalClubs[0].count),
                activeClubs: Number(activeClubs[0].count),
                openForRegistration: Number(openForRegistration[0].count),
                totalCapacity: Number(totalCapacity[0].total || 0),
                categoryBreakdown: defaultCategories.map(category => ({
                    category,
                    count: Math.floor(Math.random() * 5) + 1,
                    capacity: Math.floor(Math.random() * 100) + 20
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching club statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch club statistics',
            error: error.message
        });
    }
});

module.exports = router;
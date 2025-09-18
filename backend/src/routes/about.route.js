// routes/about.route.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/admin');

const prisma = new PrismaClient();

// Create or Update school information (protected route - admin only)
router.post('/school-info', verifyToken, isAdmin, async (req, res) => {
    try {
        const {
            name,
            location,
            foundedDate,
            currentDirector,
            education_level,
            department,
            description,
            heroImage,
            director_image,
            director_quote
        } = req.body;

        const schoolInfoData = {
            name,
            location,
            currentDirector,
            education_level,
            department,
            description,
            heroImage,
            director_image: director_image,
            director_quote: director_quote,
            foundedDate: foundedDate,
            updatedBy: req.userId,
        };


        // ตรวจสอบว่ามีข้อมูลโรงเรียนอยู่แล้วหรือไม่
        const existingSchoolInfo = await prisma.schoolInfo.findFirst();

        let schoolInfo;

        if (existingSchoolInfo) {
            // อัพเดตข้อมูลที่มีอยู่
            schoolInfo = await prisma.schoolInfo.update({
                where: {
                    id: existingSchoolInfo.id
                },
                data: {
                    ...schoolInfoData,
                    updatedBy: req.userId
                }
            });
        } else {
            // สร้างข้อมูลใหม่
            schoolInfo = await prisma.schoolInfo.create({
                data: {
                    ...schoolInfoData,
                    createdBy: req.userId
                }
            });
        }

        res.status(201).json({
            message: existingSchoolInfo ? 'School information updated successfully' : 'School information created successfully',
            schoolInfo
        });
    } catch (error) {
        console.error('Error saving school information:', error);
        res.status(500).json({ message: 'Failed to save school information', error: error.message });
    }
});

// Get school information (public route)
router.get('/school-info', async (req, res) => {
    try {
        const schoolInfo = await prisma.schoolInfo.findFirst({
            orderBy: {
                updatedAt: 'desc'
            }
        });

        if (!schoolInfo) {
            return res.status(404).json({ message: 'School information not found' });
        }

        res.status(200).json(schoolInfo);
    } catch (error) {
        console.error('Error fetching school information:', error);
        res.status(500).json({ message: 'Failed to fetch school information' });
    }
});

// Create timeline event (protected route - admin only)
router.post('/timeline', verifyToken, isAdmin, async (req, res) => {
    try {
        const { year, date, title, description, sortOrder } = req.body;

        const timelineEvent = await prisma.schoolTimeline.create({
            data: {
                year,
                date,
                title,
                description,
                sortOrder: sortOrder || 0,
                createdBy: req.userId,
                updatedBy: req.userId,
                deletedBy: 0,
                deletedAt: 0,
            }
        });

        res.status(201).json({
            message: 'Timeline event created successfully',
            timelineEvent
        });
    } catch (error) {
        console.error('Error creating timeline event:', error);
        res.status(500).json({ message: 'Failed to create timeline event' });
    }
});

// Get all timeline events (public route)
router.get('/timeline', async (req, res) => {
    try {
        const timelineEvents = await prisma.schoolTimeline.findMany({
            where: {
                deleted: 0
            },
            orderBy: {
                sortOrder: 'asc'
            }
        });

        res.status(200).json(timelineEvents);
    } catch (error) {
        console.error('Error fetching timeline events:', error);
        res.status(500).json({ message: 'Failed to fetch timeline events' });
    }
});

// Get single timeline event (public route)
router.get('/timeline/:id', async (req, res) => {
    try {
        const timelineId = parseInt(req.params.id);

        if (isNaN(timelineId)) {
            return res.status(400).json({ message: 'Invalid timeline ID' });
        }

        const timelineEvent = await prisma.schoolTimeline.findFirst({
            where: {
                id: timelineId,
            }
        });

        if (!timelineEvent) {
            return res.status(404).json({ message: 'Timeline event not found' });
        }

        res.status(200).json(timelineEvent);
    } catch (error) {
        console.error('Error fetching timeline event:', error);
        res.status(500).json({ message: 'Failed to fetch timeline event' });
    }
});

// Update timeline event (protected route - admin only)
router.patch('/timeline/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const timelineId = parseInt(req.params.id);
        const { year, date, title, description, sortOrder } = req.body;

        if (isNaN(timelineId)) {
            return res.status(400).json({ message: 'Invalid timeline ID' });
        }

        // ตรวจสอบว่า timeline event มีอยู่และไม่ถูกลบ
        const existingEvent = await prisma.schoolTimeline.findFirst({
            where: {
                id: timelineId,
            }
        });

        if (!existingEvent) {
            return res.status(404).json({ message: 'Timeline event not found' });
        }

        const updatedEvent = await prisma.schoolTimeline.update({
            where: {
                id: timelineId
            },
            data: {
                year,
                date,
                title,
                description,
                sortOrder: sortOrder || existingEvent.sortOrder,
                updatedBy: req.userId
            }
        });

        res.status(200).json({
            message: 'Timeline event updated successfully',
            timelineEvent: updatedEvent
        });
    } catch (error) {
        console.error('Error updating timeline event:', error);
        res.status(500).json({ message: 'Failed to update timeline event' });
    }
});

// Delete timeline event (soft delete - protected route)
router.delete('/timeline/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const timelineId = parseInt(req.params.id);

        if (isNaN(timelineId)) {
            return res.status(400).json({ message: 'Invalid timeline ID' });
        }

        // ตรวจสอบว่า timeline event มีอยู่
        const existingEvent = await prisma.schoolTimeline.findFirst({
            where: {
                id: timelineId,
            }
        });

        if (!existingEvent) {
            return res.status(404).json({ message: 'Timeline event not found' });
        }

        // Soft delete
        await prisma.schoolTimeline.update({
            where: {
                id: timelineId
            },
            data: {
                deletedAt: 1,
                deletedBy: req.userId
            }
        });

        res.status(200).json({
            message: 'Timeline event deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting timeline event:', error);
        res.status(500).json({ message: 'Failed to delete timeline event' });
    }
});

// Get complete school history (school info + timeline) - public route with fallback
router.get('/complete-history', async (req, res) => {
    try {
        console.log('📍 Fetching complete school history...');

        // ตรวจสอบการเชื่อมต่อฐานข้อมูลก่อน
        await prisma.$queryRaw`SELECT 1`;
        console.log('✅ Database connection successful');

        let schoolInfo = null;
        let timelineEvents = [];

        // ลองใช้ Prisma models ก่อน
        try {
            if (prisma.schoolInfo && typeof prisma.schoolInfo.findFirst === 'function') {
                console.log('📋 Using Prisma SchoolInfo model...');
                schoolInfo = await prisma.schoolInfo.findFirst({
                    orderBy: {
                        updatedAt: 'desc'
                    }
                });
            } else {
                console.log('⚠️ SchoolInfo model not available, using raw SQL...');
                const result = await prisma.$queryRaw`
                    SELECT * FROM school_info 
                    ORDER BY updatedAt DESC 
                    LIMIT 1
                `;
                schoolInfo = result.length > 0 ? result[0] : null;
            }
        } catch (error) {
            console.error('❌ Error with SchoolInfo:', error.message);
            // ลอง raw SQL เป็น fallback
            try {
                const result = await prisma.$queryRaw`
                    SELECT * FROM school_info 
                    ORDER BY updatedAt DESC 
                    LIMIT 1
                `;
                schoolInfo = result.length > 0 ? result[0] : null;
            } catch (rawError) {
                console.error('❌ Raw SQL for school_info failed:', rawError.message);
                schoolInfo = null;
            }
        }

        // ลองใช้ Prisma Timeline model
        try {
            if (prisma.schoolTimeline && typeof prisma.schoolTimeline.findMany === 'function') {
                console.log('📋 Using Prisma SchoolTimeline model...');
                timelineEvents = await prisma.schoolTimeline.findMany({
                    where: {
                        deletedAt: null | 0// หรือ 0 ถ้าใช้ soft delete
                    },
                    orderBy: {
                        sortOrder: 'asc'
                    }
                });
            } else {
                console.log('⚠️ SchoolTimeline model not available, using raw SQL...');
                timelineEvents = await prisma.$queryRaw`
                    SELECT * FROM school_timeline 
                    WHERE deletedAt IS NULL OR deletedAt = 0
                    ORDER BY sortOrder ASC
                `;
            }
        } catch (error) {
            console.error('❌ Error with SchoolTimeline:', error.message);
            // ลอง raw SQL เป็น fallback
            try {
                timelineEvents = await prisma.$queryRaw`
                    SELECT * FROM school_timeline 
                    WHERE deletedAt IS NULL OR deletedAt = 0
                    ORDER BY sortOrder ASC
                `;
            } catch (rawError) {
                console.error('❌ Raw SQL for school_timeline failed:', rawError.message);
                timelineEvents = [];
            }
        }

        console.log('📊 School Info found:', schoolInfo ? 'Yes' : 'No');
        console.log('📊 Timeline events found:', timelineEvents.length);

        // ส่ง response ในรูปแบบที่ตรงกับ API design
        res.status(200).json({
            success: true,
            data: {
                schoolInfo: schoolInfo || null,
                timeline: timelineEvents || []
            },
            message: 'ดึงข้อมูลประวัติโรงเรียนสำเร็จ'
        });
    } catch (error) {
        console.error('❌ Error fetching complete school history:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });

        res.status(500).json({
            success: false,
            message: 'Failed to fetch complete school history',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Reorder timeline events (protected route - admin only)
router.patch('/timeline/reorder', verifyToken, isAdmin, async (req, res) => {
    try {
        const { timelineIds } = req.body; // Array of timeline IDs in new order

        if (!Array.isArray(timelineIds)) {
            return res.status(400).json({ message: 'Timeline IDs must be an array' });
        }

        // Update sortOrderorder for each timeline event
        const updatePromises = timelineIds.map((id, index) =>
            prisma.schoolTimeline.update({
                where: { id: parseInt(id) },
                data: {
                    sortOrder: index + 1,
                    updatedBy: req.userId
                }
            })
        );

        await Promise.all(updatePromises);

        res.status(200).json({
            message: 'Timeline events reordered successfully'
        });
    } catch (error) {
        console.error('Error reordering timeline events:', error);
        res.status(500).json({ message: 'Failed to reorder timeline events' });
    }
});

module.exports = router;
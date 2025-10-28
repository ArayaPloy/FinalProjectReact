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
            director_image,
            director_quote,
            foundedDate,
            updatedBy: req.userId,
        };

        const existingSchoolInfo = await prisma.school_info.findFirst();

        let schoolInfo;

        if (existingSchoolInfo) {
            schoolInfo = await prisma.school_info.update({
                where: {
                    id: existingSchoolInfo.id
                },
                data: {
                    ...schoolInfoData,
                    updatedBy: req.userId
                }
            });
        } else {
            schoolInfo = await prisma.school_info.create({
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

// Get school information
router.get('/school-info', async (req, res) => {
    try {
        const schoolInfo = await prisma.school_info.findFirst({
            where: {
                isDeleted: false
            },
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

// Create timeline event
router.post('/timeline', verifyToken, isAdmin, async (req, res) => {
    try {
        const { year, date, title, description, sortOrder } = req.body;

        const timelineEvent = await prisma.school_timeline.create({
            data: {
                year: parseInt(year),  
                date,
                title,
                description,
                sortOrder: sortOrder ? parseInt(sortOrder) : 0,  
                createdBy: req.userId,
                updatedBy: req.userId,
                isDeleted: false,  
                deletedAt: null,   
                deletedBy: null
            }
        });

        res.status(201).json({
            message: 'Timeline event created successfully',
            timelineEvent
        });
    } catch (error) {
        console.error('Error creating timeline event:', error);
        res.status(500).json({
            message: 'Failed to create timeline event',
            error: error.message  
        });
    }
});

// Get all timeline events
router.get('/timeline', async (req, res) => {
    try {
        const timelineEvents = await prisma.school_timeline.findMany({
            where: {
                isDeleted: false
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

// Update timeline
router.patch('/timeline/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const timelineId = parseInt(req.params.id);
        const { year, date, title, description, sortOrder } = req.body;

        if (isNaN(timelineId)) {
            return res.status(400).json({ message: 'Invalid timeline ID' });
        }

        const existingEvent = await prisma.school_timeline.findFirst({
            where: {
                id: timelineId,
                isDeleted: false
            }
        });

        if (!existingEvent) {
            return res.status(404).json({ message: 'Timeline event not found' });
        }

        const updatedEvent = await prisma.school_timeline.update({
            where: {
                id: timelineId
            },
            data: {
                year: year ? parseInt(year) : existingEvent.year,  
                date,
                title,
                description,
                sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : existingEvent.sortOrder, 
                updatedBy: req.userId
            }
        });

        res.status(200).json({
            message: 'Timeline event updated successfully',
            timelineEvent: updatedEvent
        });
    } catch (error) {
        console.error('Error updating timeline event:', error);
        res.status(500).json({
            message: 'Failed to update timeline event',
            error: error.message  
        });
    }
});

// Soft delete timeline
router.delete('/timeline/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const timelineId = parseInt(req.params.id);

        if (isNaN(timelineId)) {
            return res.status(400).json({ message: 'Invalid timeline ID' });
        }

        const existingEvent = await prisma.school_timeline.findFirst({
            where: {
                id: timelineId,
                isDeleted: false
            }
        });

        if (!existingEvent) {
            return res.status(404).json({ message: 'Timeline event not found' });
        }

        await prisma.school_timeline.update({
            where: {
                id: timelineId
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
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

// Get complete history
router.get('/complete-history', async (req, res) => {
    try {
        const schoolInfo = await prisma.school_info.findFirst({
            where: {
                isDeleted: false
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        const timelineEvents = await prisma.school_timeline.findMany({
            where: {
                isDeleted: false
            },
            orderBy: {
                sortOrder: 'asc'
            }
        });

        res.status(200).json({
            success: true,
            data: {
                schoolInfo: schoolInfo || null,
                timeline: timelineEvents || []
            },
            message: 'ดึงข้อมูลประวัติโรงเรียนสำเร็จ'
        });
    } catch (error) {
        console.error('Error fetching complete school history:', error);
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
// routes/admissions.route.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/admin');

const prisma = new PrismaClient();

// Get admissions information (public)
router.get('/', async (req, res) => {
    try {
        const admissionsInfo = await prisma.admissions_info.findFirst({
            where: { isDeleted: false },
            orderBy: { updatedAt: 'desc' },
        });

        if (!admissionsInfo) {
            return res.status(404).json({ message: 'Admissions information not found' });
        }

        res.status(200).json(admissionsInfo);
    } catch (error) {
        console.error('Error fetching admissions information:', error);
        res.status(500).json({ message: 'Failed to fetch admissions information', error: error.message });
    }
});

// Create or update admissions information (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const {
            bannerImage,
            dateRange,
            duration,
            timeRange,
            lunchBreak,
            location,
            mapUrl,
            grade1Info,
            grade4Info,
            documents,
            conditions,
            contactName,
            contactPhone,
            facebookUrl,
            facebookName,
        } = req.body;

        const admissionsData = {
            bannerImage,
            dateRange,
            duration,
            timeRange,
            lunchBreak,
            location,
            mapUrl,
            grade1Info,
            grade4Info,
            documents,
            conditions,
            contactName,
            contactPhone,
            facebookUrl,
            facebookName,
            updatedBy: req.userId,
        };

        const existing = await prisma.admissions_info.findFirst({
            where: { isDeleted: false },
        });

        let admissionsInfo;

        if (existing) {
            admissionsInfo = await prisma.admissions_info.update({
                where: { id: existing.id },
                data: admissionsData,
            });
        } else {
            admissionsInfo = await prisma.admissions_info.create({
                data: {
                    ...admissionsData,
                    createdBy: req.userId,
                },
            });
        }

        res.status(201).json({
            message: existing ? 'Admissions information updated successfully' : 'Admissions information created successfully',
            admissionsInfo,
        });
    } catch (error) {
        console.error('Error saving admissions information:', error);
        res.status(500).json({ message: 'Failed to save admissions information', error: error.message });
    }
});

module.exports = router;

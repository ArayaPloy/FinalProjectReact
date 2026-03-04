// routes/classrooms.route.js — จัดการห้องเรียน (homeroom_classes)
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/admin');

const prisma = new PrismaClient();

// ========================================
// GET /api/classrooms — ดึงรายการห้องเรียนทั้งหมด
// ========================================
router.get('/', verifyToken, async (req, res) => {
    try {
        const { academicYearId, isActive } = req.query;

        const whereClause = {};
        if (academicYearId) whereClause.academicYearId = parseInt(academicYearId);
        if (isActive !== undefined) whereClause.isActive = isActive === 'true';

        const classrooms = await prisma.homeroom_classes.findMany({
            where: whereClause,
            include: {
                homeroomTeacher: {
                    select: {
                        id: true,
                        namePrefix: true,
                        firstName: true,
                        lastName: true,
                        position: true,
                        imagePath: true
                    }
                },
                academicYear: {
                    select: { id: true, year: true, isCurrent: true }
                },
                _count: { select: { students: true } }
            },
            orderBy: { className: 'asc' }
        });

        const data = classrooms.map(c => ({
            id: c.id,
            className: c.className,
            room: c.room,
            floor: c.floor,
            building: c.building,
            maxStudents: c.maxStudents,
            isActive: c.isActive,
            academicYear: c.academicYear,
            studentCount: c._count.students,
            homeroomTeacher: c.homeroomTeacher ? {
                ...c.homeroomTeacher,
                fullName: `${c.homeroomTeacher.namePrefix || ''}${c.homeroomTeacher.firstName || ''}${c.homeroomTeacher.lastName ? ' ' + c.homeroomTeacher.lastName : ''}`.trim()
            } : null
        }));

        res.status(200).json({ success: true, data, total: data.length });
    } catch (error) {
        console.error('Error fetching classrooms:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch classrooms', error: error.message });
    }
});

// ========================================
// GET /api/classrooms/:id — ดึงห้องเรียนเดียว พร้อมรายชื่อนักเรียน
// ========================================
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

        const classroom = await prisma.homeroom_classes.findUnique({
            where: { id },
            include: {
                homeroomTeacher: {
                    select: {
                        id: true,
                        namePrefix: true,
                        firstName: true,
                        lastName: true,
                        position: true,
                        imagePath: true,
                        phoneNumber: true,
                        email: true
                    }
                },
                academicYear: {
                    select: { id: true, year: true, isCurrent: true }
                },
                students: {
                    where: { isDeleted: false },
                    select: {
                        id: true,
                        studentNumber: true,
                        namePrefix: true,
                        firstName: true,
                        lastName: true,
                        genders: { select: { genderName: true } }
                    },
                    orderBy: { studentNumber: 'asc' }
                }
            }
        });

        if (!classroom) {
            return res.status(404).json({ success: false, message: 'Classroom not found' });
        }

        const data = {
            ...classroom,
            studentCount: classroom.students.length,
            homeroomTeacher: classroom.homeroomTeacher ? {
                ...classroom.homeroomTeacher,
                fullName: `${classroom.homeroomTeacher.namePrefix || ''}${classroom.homeroomTeacher.firstName || ''}${classroom.homeroomTeacher.lastName ? ' ' + classroom.homeroomTeacher.lastName : ''}`.trim()
            } : null
        };

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching classroom:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch classroom', error: error.message });
    }
});

// ========================================
// POST /api/classrooms — สร้างห้องเรียนใหม่ (Admin)
// ========================================
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const { className, homeroomTeacherId, academicYearId, maxStudents, room, floor, building, isActive } = req.body;

        if (!className) {
            return res.status(400).json({ success: false, message: 'className is required' });
        }

        // ตรวจสอบว่าชื่อห้องซ้ำหรือไม่
        const existing = await prisma.homeroom_classes.findUnique({ where: { className } });
        if (existing) {
            return res.status(409).json({ success: false, message: `ห้อง "${className}" มีอยู่แล้วในระบบ` });
        }

        // ตรวจสอบว่าครูคนนี้เป็นครูประจำชั้นอยู่แล้วหรือไม่
        if (homeroomTeacherId) {
            const teacherInUse = await prisma.homeroom_classes.findFirst({
                where: { homeroomTeacherId: parseInt(homeroomTeacherId) }
            });
            if (teacherInUse) {
                return res.status(409).json({
                    success: false,
                    message: `ครูคนนี้เป็นครูประจำชั้นของห้อง "${teacherInUse.className}" อยู่แล้ว`
                });
            }
        }

        const classroom = await prisma.homeroom_classes.create({
            data: {
                className,
                homeroomTeacherId: homeroomTeacherId ? parseInt(homeroomTeacherId) : null,
                academicYearId: academicYearId ? parseInt(academicYearId) : null,
                maxStudents: maxStudents ? parseInt(maxStudents) : 40,
                room: room || null,
                floor: floor ? parseInt(floor) : null,
                building: building || null,
                isActive: isActive !== undefined ? Boolean(isActive) : true
            },
            include: {
                homeroomTeacher: { select: { id: true, namePrefix: true, firstName: true, lastName: true } },
                academicYear: { select: { id: true, year: true } }
            }
        });

        res.status(201).json({ success: true, message: 'สร้างห้องเรียนสำเร็จ', data: classroom });
    } catch (error) {
        console.error('Error creating classroom:', error);
        res.status(500).json({ success: false, message: 'Failed to create classroom', error: error.message });
    }
});

// ========================================
// PUT /api/classrooms/:id — แก้ไขห้องเรียน (Admin)
// ========================================
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

        const { className, homeroomTeacherId, academicYearId, maxStudents, room, floor, building, isActive } = req.body;

        const existing = await prisma.homeroom_classes.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ success: false, message: 'Classroom not found' });

        // ตรวจสอบชื่อห้องซ้ำ (ยกเว้นห้องตัวเอง)
        if (className && className !== existing.className) {
            const nameInUse = await prisma.homeroom_classes.findUnique({ where: { className } });
            if (nameInUse) return res.status(409).json({ success: false, message: `ห้อง "${className}" มีอยู่แล้ว` });
        }

        // ตรวจสอบครูซ้ำ (ยกเว้นห้องตัวเอง)
        if (homeroomTeacherId && parseInt(homeroomTeacherId) !== existing.homeroomTeacherId) {
            const teacherInUse = await prisma.homeroom_classes.findFirst({
                where: {
                    homeroomTeacherId: parseInt(homeroomTeacherId),
                    id: { not: id }
                }
            });
            if (teacherInUse) {
                return res.status(409).json({
                    success: false,
                    message: `ครูคนนี้เป็นครูประจำชั้นของห้อง "${teacherInUse.className}" อยู่แล้ว`
                });
            }
        }

        const updateData = {};
        if (className !== undefined) updateData.className = className;
        if (homeroomTeacherId !== undefined) updateData.homeroomTeacherId = homeroomTeacherId ? parseInt(homeroomTeacherId) : null;
        if (academicYearId !== undefined) updateData.academicYearId = academicYearId ? parseInt(academicYearId) : null;
        if (maxStudents !== undefined) updateData.maxStudents = maxStudents ? parseInt(maxStudents) : null;
        if (room !== undefined) updateData.room = room || null;
        if (floor !== undefined) updateData.floor = floor ? parseInt(floor) : null;
        if (building !== undefined) updateData.building = building || null;
        if (isActive !== undefined) updateData.isActive = Boolean(isActive);

        const updated = await prisma.homeroom_classes.update({
            where: { id },
            data: updateData,
            include: {
                homeroomTeacher: { select: { id: true, namePrefix: true, firstName: true, lastName: true } },
                academicYear: { select: { id: true, year: true } },
                _count: { select: { students: true } }
            }
        });

        res.status(200).json({ success: true, message: 'อัปเดตห้องเรียนสำเร็จ', data: updated });
    } catch (error) {
        console.error('Error updating classroom:', error);
        res.status(500).json({ success: false, message: 'Failed to update classroom', error: error.message });
    }
});

// ========================================
// DELETE /api/classrooms/:id — ลบห้องเรียน (Admin)
// ถ้ามีนักเรียนอยู่ → ปิดใช้งาน (isActive=false) แทนการลบจริง
// ========================================
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

        const classroom = await prisma.homeroom_classes.findUnique({
            where: { id },
            include: { _count: { select: { students: true } } }
        });

        if (!classroom) return res.status(404).json({ success: false, message: 'Classroom not found' });

        if (classroom._count.students > 0) {
            // มีนักเรียนอยู่ → ปิดการใช้งานแทน
            await prisma.homeroom_classes.update({ where: { id }, data: { isActive: false } });
            return res.status(200).json({
                success: true,
                message: `ไม่สามารถลบได้เนื่องจากมีนักเรียน ${classroom._count.students} คน — ปิดการใช้งานห้องแทน`,
                deactivated: true
            });
        }

        await prisma.homeroom_classes.delete({ where: { id } });
        res.status(200).json({ success: true, message: 'ลบห้องเรียนสำเร็จ' });
    } catch (error) {
        console.error('Error deleting classroom:', error);
        res.status(500).json({ success: false, message: 'Failed to delete classroom', error: error.message });
    }
});

module.exports = router;

// routes/classschedules.route.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/admin');

const prisma = new PrismaClient();

// วันในสัปดาห์ตามลำดับที่ถูกต้อง
const DAY_ORDER = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];

// Helper สร้าง teacherName
const buildTeacherName = (teacher) => {
    if (!teacher) return null;
    return `${teacher.namePrefix || ''}${teacher.firstName || ''}${teacher.lastName ? ' ' + teacher.lastName : ''}`.trim();
};

// ============================================================
// GET /api/schedules/classes  — รายชื่อห้องเรียนทั้งหมด (public)
// ============================================================
router.get('/classes', async (req, res) => {
    try {
        const classes = await prisma.homeroom_classes.findMany({
            where: { isActive: true },
            select: { id: true, className: true },
            orderBy: { className: 'asc' },
        });
        res.json({ success: true, data: classes });
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลห้องเรียนได้' });
    }
});

// ============================================================
// GET /api/schedules/subjects  — วิชาทั้งหมด + ครูผู้สอน (public)
// ============================================================
router.get('/subjects', async (req, res) => {
    try {
        const subjects = await prisma.subjects.findMany({
            where: { deletedAt: null },
            include: {
                teachersubjects: {
                    include: {
                        teachers: {
                            select: {
                                id: true,
                                namePrefix: true,
                                firstName: true,
                                lastName: true,
                                imagePath: true,
                            },
                        },
                    },
                },
                departments: { select: { name: true } },
            },
            orderBy: { codeSubject: 'asc' },
        });

        const data = subjects.map((s) => ({
            id: s.id,
            codeSubject: s.codeSubject,
            name: s.name,
            description: s.description,
            department: s.departments?.name || null,
            teachers: s.teachersubjects.map((ts) => ({
                id: ts.teachers.id,
                name: buildTeacherName(ts.teachers),
                imagePath: ts.teachers.imagePath,
            })),
        }));

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลวิชาได้' });
    }
});

// ============================================================
// GET /api/schedules/teachers  — รายชื่อครูทั้งหมด (for dropdown)
// ============================================================
router.get('/teachers', async (req, res) => {
    try {
        const teachers = await prisma.teachers.findMany({
            where: { isDeleted: false },
            select: {
                id: true,
                namePrefix: true,
                firstName: true,
                lastName: true,
                departments_teachers_departmentIdTodepartments: {
                    select: { name: true },
                },
            },
            orderBy: [{ firstName: 'asc' }],
        });

        const data = teachers.map((t) => ({
            id: t.id,
            name: buildTeacherName(t),
            department: t.departments_teachers_departmentIdTodepartments?.name || null,
        }));

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลครูได้' });
    }
});

// ============================================================
// GET /api/schedules?className=X&semesterId=Y  — ตารางเรียน (public)
// ============================================================
router.get('/', async (req, res) => {
    try {
        const { className, semesterId } = req.query;

        const where = { deletedAt: null };
        if (className) where.class = className;
        if (semesterId) where.semesterId = parseInt(semesterId);

        const schedules = await prisma.classschedules.findMany({
            where,
            include: {
                subjects: {
                    select: {
                        id: true,
                        codeSubject: true,
                        name: true,
                        description: true,
                        departments: { select: { name: true } },
                    },
                },
                teachers: {
                    select: {
                        id: true,
                        namePrefix: true,
                        firstName: true,
                        lastName: true,
                        imagePath: true,
                        departments_teachers_departmentIdTodepartments: {
                            select: { name: true },
                        },
                    },
                },
                daysofweek: { select: { id: true, name: true } },
            },
            orderBy: [{ daysofweek: { id: 'asc' } }, { periodNumber: 'asc' }],
        });

        // จัดรูปแบบเป็น { dayName: { periodNumber: cellData } }
        const organized = {};
        let maxPeriod = 7; // ค่าเริ่มต้น

        for (const s of schedules) {
            const dayName = s.daysofweek?.name || 'Unknown';
            if (!organized[dayName]) organized[dayName] = {};

            const pn = s.periodNumber || 0;
            if (pn > maxPeriod) maxPeriod = pn;

            organized[dayName][pn] = {
                id: s.id,
                subjectId: s.subjectId,
                subjectCode: s.subjects?.codeSubject || s.subjectCodeRaw || null,
                subjectName: s.subjects?.name || null,
                subjectDescription: s.subjects?.description || null,
                subjectDepartment: s.subjects?.departments?.name || null,
                teacherId: s.teacherId,
                teacherName: buildTeacherName(s.teachers) || s.guestTeacherName || null,
                guestTeacherName: s.guestTeacherName || null,
                teacherDepartment: s.teachers?.departments_teachers_departmentIdTodepartments?.name || null,
                teacherImagePath: s.teachers?.imagePath || null,
                room: s.room,
                building: s.building,
                periodNumber: pn,
                dayOfWeekId: s.dayOfWeekId,
                dayName,
            };
        }

        res.json({
            success: true,
            data: {
                schedule: organized,
                maxPeriod,
                className: className || null,
                semesterId: semesterId ? parseInt(semesterId) : null,
            },
        });
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลตารางเรียนได้' });
    }
});

// ============================================================
// POST /api/schedules  — เพิ่มคาบเรียน (admin only)
// ============================================================
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const { className, dayOfWeekId, periodNumber, subjectId, teacherId, guestTeacherName, room, building, semesterId } = req.body;

        if (!className || !dayOfWeekId || !periodNumber) {
            return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลให้ครบ (ห้อง, วัน, คาบ)' });
        }

        // ตรวจสอบว่าคาบนี้มีอยู่แล้วหรือไม่
        const existing = await prisma.classschedules.findFirst({
            where: {
                class: className,
                dayOfWeekId: parseInt(dayOfWeekId),
                periodNumber: parseInt(periodNumber),
                semesterId: semesterId ? parseInt(semesterId) : null,
                deletedAt: null,
            },
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: `คาบที่ ${periodNumber} วันนี้มีข้อมูลอยู่แล้ว กรุณาแก้ไขข้อมูลที่มีอยู่แทน`,
            });
        }

        const created = await prisma.classschedules.create({
            data: {
                class: className,
                dayOfWeekId: parseInt(dayOfWeekId),
                periodNumber: parseInt(periodNumber),
                subjectId: subjectId ? parseInt(subjectId) : null,
                teacherId: teacherId ? parseInt(teacherId) : null,
                guestTeacherName: (!teacherId && guestTeacherName) ? guestTeacherName.trim() : null,
                room: room || null,
                building: building || null,
                semesterId: semesterId ? parseInt(semesterId) : null,
                updatedBy: req.user.id,
            },
            include: {
                subjects: { select: { id: true, codeSubject: true, name: true } },
                teachers: { select: { id: true, namePrefix: true, firstName: true, lastName: true } },
                daysofweek: { select: { id: true, name: true } },
            },
        });

        res.status(201).json({
            success: true,
            message: 'เพิ่มคาบเรียนสำเร็จ',
            data: created,
        });
    } catch (error) {
        console.error('Error creating schedule entry:', error);
        res.status(500).json({ success: false, message: 'ไม่สามารถเพิ่มคาบเรียนได้' });
    }
});

// ============================================================
// PUT /api/schedules/:id  — แก้ไขคาบเรียน (admin only)
// ============================================================
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const scheduleId = parseInt(req.params.id);
        const { subjectId, teacherId, guestTeacherName, room, building, periodNumber, dayOfWeekId } = req.body;

        if (isNaN(scheduleId)) {
            return res.status(400).json({ success: false, message: 'ID ไม่ถูกต้อง' });
        }

        const existing = await prisma.classschedules.findFirst({
            where: { id: scheduleId, deletedAt: null },
        });

        if (!existing) {
            return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลคาบเรียน' });
        }

        // ถ้าเปลี่ยน day หรือ period ตรวจสอบการชนกัน
        if (
            (dayOfWeekId && parseInt(dayOfWeekId) !== existing.dayOfWeekId) ||
            (periodNumber && parseInt(periodNumber) !== existing.periodNumber)
        ) {
            const conflict = await prisma.classschedules.findFirst({
                where: {
                    id: { not: scheduleId },
                    class: existing.class,
                    dayOfWeekId: dayOfWeekId ? parseInt(dayOfWeekId) : existing.dayOfWeekId,
                    periodNumber: periodNumber ? parseInt(periodNumber) : existing.periodNumber,
                    semesterId: existing.semesterId,
                    deletedAt: null,
                },
            });

            if (conflict) {
                return res.status(409).json({
                    success: false,
                    message: 'คาบ/วันที่เลือกมีข้อมูลอยู่แล้ว',
                });
            }
        }

        // ถ้ามี teacherId จริง ให้ล้าง guestTeacherName; ถ้าไม่มี teacherId ให้ใช้ guestTeacherName
        const resolvedTeacherId = teacherId !== undefined ? (teacherId ? parseInt(teacherId) : null) : existing.teacherId;
        const resolvedGuestName = resolvedTeacherId
            ? null
            : (guestTeacherName !== undefined ? (guestTeacherName?.trim() || null) : existing.guestTeacherName);

        const updated = await prisma.classschedules.update({
            where: { id: scheduleId },
            data: {
                subjectId: subjectId !== undefined ? (subjectId ? parseInt(subjectId) : null) : existing.subjectId,
                teacherId: resolvedTeacherId,
                guestTeacherName: resolvedGuestName,
                room: room !== undefined ? (room || null) : existing.room,
                building: building !== undefined ? (building || null) : existing.building,
                periodNumber: periodNumber ? parseInt(periodNumber) : existing.periodNumber,
                dayOfWeekId: dayOfWeekId ? parseInt(dayOfWeekId) : existing.dayOfWeekId,
                updatedAt: new Date(),
                updatedBy: req.user.id,
            },
            include: {
                subjects: { select: { id: true, codeSubject: true, name: true } },
                teachers: { select: { id: true, namePrefix: true, firstName: true, lastName: true } },
                daysofweek: { select: { id: true, name: true } },
            },
        });

        res.json({ success: true, message: 'แก้ไขคาบเรียนสำเร็จ', data: updated });
    } catch (error) {
        console.error('Error updating schedule entry:', error);
        res.status(500).json({ success: false, message: 'ไม่สามารถแก้ไขคาบเรียนได้' });
    }
});

// ============================================================
// DELETE /api/schedules/:id  — ลบคาบเรียน (admin only)
// ============================================================
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const scheduleId = parseInt(req.params.id);

        if (isNaN(scheduleId)) {
            return res.status(400).json({ success: false, message: 'ID ไม่ถูกต้อง' });
        }

        const existing = await prisma.classschedules.findFirst({
            where: { id: scheduleId, deletedAt: null },
        });

        if (!existing) {
            return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลคาบเรียน' });
        }

        // Soft delete
        await prisma.classschedules.update({
            where: { id: scheduleId },
            data: { deletedAt: new Date(), updatedBy: req.user.id },
        });

        res.json({ success: true, message: 'ลบคาบเรียนสำเร็จ' });
    } catch (error) {
        console.error('Error deleting schedule entry:', error);
        res.status(500).json({ success: false, message: 'ไม่สามารถลบคาบเรียนได้' });
    }
});

module.exports = router;

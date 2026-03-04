// routes/subjects.route.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/admin');

const prisma = new PrismaClient();

// ============================================================
// GET /api/subjects  — รายวิชาทั้งหมด พร้อมครูผู้สอน (public)
// ============================================================
router.get('/', async (req, res) => {
    try {
        const { search, departmentId } = req.query;

        const where = { deletedAt: null };
        if (search) {
            where.OR = [
                { codeSubject: { contains: search } },
                { name: { contains: search } },
            ];
        }
        if (departmentId) {
            where.departmentId = parseInt(departmentId);
        }

        const subjects = await prisma.subjects.findMany({
            where,
            include: {
                teachersubjects: {
                    where: { deletedAt: null },
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
                departments: { select: { id: true, name: true } },
            },
            orderBy: { codeSubject: 'asc' },
        });

        const formatted = subjects.map((s) => ({
            id: s.id,
            codeSubject: s.codeSubject,
            name: s.name,
            description: s.description,
            department: s.departments ? { id: s.departments.id, name: s.departments.name } : null,
            departmentId: s.departmentId,
            teachers: s.teachersubjects.map((ts) => ({
                id: ts.teachers.id,
                name: `${ts.teachers.namePrefix || ''}${ts.teachers.firstName || ''}${ts.teachers.lastName ? ' ' + ts.teachers.lastName : ''}`.trim(),
                imagePath: ts.teachers.imagePath,
            })),
        }));

        res.json({ success: true, data: formatted });
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลวิชาเรียนได้' });
    }
});

// ============================================================
// GET /api/subjects/departments  — รายชื่อแผนกทั้งหมด (public)
// ============================================================
router.get('/departments', async (req, res) => {
    try {
        const departments = await prisma.departments.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' },
        });
        res.json({ success: true, data: departments });
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลแผนกได้' });
    }
});

// ============================================================
// GET /api/subjects/teachers  — รายชื่อครูทั้งหมดสำหรับ assign (admin)
// ============================================================
router.get('/teachers', verifyToken, isAdmin, async (req, res) => {
    try {
        const teachers = await prisma.teachers.findMany({
            where: { deletedAt: null },
            select: {
                id: true,
                namePrefix: true,
                firstName: true,
                lastName: true,
                imagePath: true,
            },
            orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
        });

        const formatted = teachers.map((t) => ({
            id: t.id,
            name: `${t.namePrefix || ''}${t.firstName || ''}${t.lastName ? ' ' + t.lastName : ''}`.trim(),
            imagePath: t.imagePath,
        }));

        res.json({ success: true, data: formatted });
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลครูได้' });
    }
});

// ============================================================
// GET /api/subjects/:id  — วิชาเดี่ยว (public)
// ============================================================
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const subject = await prisma.subjects.findFirst({
            where: { id, deletedAt: null },
            include: {
                teachersubjects: {
                    where: { deletedAt: null },
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
                departments: { select: { id: true, name: true } },
            },
        });

        if (!subject) {
            return res.status(404).json({ success: false, message: 'ไม่พบวิชาเรียน' });
        }

        res.json({
            success: true,
            data: {
                id: subject.id,
                codeSubject: subject.codeSubject,
                name: subject.name,
                description: subject.description,
                department: subject.departments,
                departmentId: subject.departmentId,
                teachers: subject.teachersubjects.map((ts) => ({
                    id: ts.teachers.id,
                    name: `${ts.teachers.namePrefix || ''}${ts.teachers.firstName || ''}${ts.teachers.lastName ? ' ' + ts.teachers.lastName : ''}`.trim(),
                    imagePath: ts.teachers.imagePath,
                })),
            },
        });
    } catch (error) {
        console.error('Error fetching subject:', error);
        res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลวิชาเรียนได้' });
    }
});

// ============================================================
// POST /api/subjects  — เพิ่มวิชาใหม่ (admin only)
// ============================================================
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const { codeSubject, name, description, departmentId } = req.body;

        if (!codeSubject || !name) {
            return res.status(400).json({ success: false, message: 'กรุณากรอกรหัสวิชาและชื่อวิชา' });
        }

        // ตรวจสอบรหัสวิชาซ้ำ
        const existing = await prisma.subjects.findFirst({
            where: { codeSubject: codeSubject.trim(), deletedAt: null },
        });
        if (existing) {
            return res.status(409).json({ success: false, message: `รหัสวิชา "${codeSubject}" มีอยู่แล้วในระบบ` });
        }

        const subject = await prisma.subjects.create({
            data: {
                codeSubject: codeSubject.trim(),
                name: name.trim(),
                description: description ? description.trim() : null,
                departmentId: departmentId ? parseInt(departmentId) : null,
                updatedBy: req.user?.id || null,
            },
        });

        res.status(201).json({ success: true, message: 'เพิ่มวิชาเรียนสำเร็จ', data: subject });
    } catch (error) {
        console.error('Error creating subject:', error);
        res.status(500).json({ success: false, message: 'ไม่สามารถเพิ่มวิชาเรียนได้' });
    }
});

// ============================================================
// PUT /api/subjects/:id  — แก้ไขวิชา (admin only)
// ============================================================
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { codeSubject, name, description, departmentId } = req.body;

        const subject = await prisma.subjects.findFirst({ where: { id, deletedAt: null } });
        if (!subject) {
            return res.status(404).json({ success: false, message: 'ไม่พบวิชาเรียน' });
        }

        if (codeSubject && codeSubject.trim() !== subject.codeSubject) {
            const duplicate = await prisma.subjects.findFirst({
                where: { codeSubject: codeSubject.trim(), deletedAt: null, NOT: { id } },
            });
            if (duplicate) {
                return res.status(409).json({ success: false, message: `รหัสวิชา "${codeSubject}" มีอยู่แล้วในระบบ` });
            }
        }

        const updated = await prisma.subjects.update({
            where: { id },
            data: {
                codeSubject: codeSubject ? codeSubject.trim() : subject.codeSubject,
                name: name ? name.trim() : subject.name,
                description: description !== undefined ? (description ? description.trim() : null) : subject.description,
                departmentId: departmentId !== undefined ? (departmentId ? parseInt(departmentId) : null) : subject.departmentId,
                updatedBy: req.user?.id || null,
                updatedAt: new Date(),
            },
        });

        res.json({ success: true, message: 'แก้ไขวิชาเรียนสำเร็จ', data: updated });
    } catch (error) {
        console.error('Error updating subject:', error);
        res.status(500).json({ success: false, message: 'ไม่สามารถแก้ไขวิชาเรียนได้' });
    }
});

// ============================================================
// DELETE /api/subjects/:id  — ลบวิชา (soft delete, admin only)
// ============================================================
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const subject = await prisma.subjects.findFirst({ where: { id, deletedAt: null } });
        if (!subject) {
            return res.status(404).json({ success: false, message: 'ไม่พบวิชาเรียน' });
        }

        await prisma.subjects.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        res.json({ success: true, message: 'ลบวิชาเรียนสำเร็จ' });
    } catch (error) {
        console.error('Error deleting subject:', error);
        res.status(500).json({ success: false, message: 'ไม่สามารถลบวิชาเรียนได้' });
    }
});

// ============================================================
// POST /api/subjects/:id/teachers  — เพิ่มครูผู้สอนให้วิชา (admin only)
// ============================================================
router.post('/:id/teachers', verifyToken, isAdmin, async (req, res) => {
    try {
        const subjectId = parseInt(req.params.id);
        const { teacherId } = req.body;

        if (!teacherId) {
            return res.status(400).json({ success: false, message: 'กรุณาระบุ teacherId' });
        }

        const subject = await prisma.subjects.findFirst({ where: { id: subjectId, deletedAt: null } });
        if (!subject) {
            return res.status(404).json({ success: false, message: 'ไม่พบวิชาเรียน' });
        }

        const teacher = await prisma.teachers.findFirst({ where: { id: parseInt(teacherId), deletedAt: null } });
        if (!teacher) {
            return res.status(404).json({ success: false, message: 'ไม่พบครู' });
        }

        // Upsert: ถ้าเคย soft-delete ให้กู้คืน, ถ้าไม่มีให้สร้างใหม่
        await prisma.teachersubjects.upsert({
            where: {
                teacherId_subjectId: {
                    teacherId: parseInt(teacherId),
                    subjectId,
                },
            },
            create: {
                teacherId: parseInt(teacherId),
                subjectId,
                deletedAt: null,
            },
            update: {
                deletedAt: null,
            },
        });

        res.json({ success: true, message: 'เพิ่มครูผู้สอนสำเร็จ' });
    } catch (error) {
        console.error('Error assigning teacher:', error);
        res.status(500).json({ success: false, message: 'ไม่สามารถเพิ่มครูผู้สอนได้' });
    }
});

// ============================================================
// DELETE /api/subjects/:id/teachers/:teacherId  — ลบครูผู้สอนออกจากวิชา (admin only)
// ============================================================
router.delete('/:id/teachers/:teacherId', verifyToken, isAdmin, async (req, res) => {
    try {
        const subjectId = parseInt(req.params.id);
        const teacherId = parseInt(req.params.teacherId);

        const existing = await prisma.teachersubjects.findFirst({
            where: { subjectId, teacherId, deletedAt: null },
        });
        if (!existing) {
            return res.status(404).json({ success: false, message: 'ไม่พบความสัมพันธ์ครู-วิชานี้' });
        }

        await prisma.teachersubjects.update({
            where: { teacherId_subjectId: { teacherId, subjectId } },
            data: { deletedAt: new Date() },
        });

        res.json({ success: true, message: 'ลบครูผู้สอนออกจากวิชาสำเร็จ' });
    } catch (error) {
        console.error('Error removing teacher:', error);
        res.status(500).json({ success: false, message: 'ไม่สามารถลบครูผู้สอนออกจากวิชาได้' });
    }
});

module.exports = router;

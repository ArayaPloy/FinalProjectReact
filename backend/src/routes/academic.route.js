// routes/academic.route.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/admin');

const prisma = new PrismaClient();

// ========================================
// ACADEMIC YEARS ROUTES
// ========================================

// Get all academic years
router.get('/academic-years', async (req, res) => {
    try {
        const academicYears = await prisma.academic_years.findMany({
            orderBy: { year: 'desc' },
            include: {
                semesters: {
                    orderBy: { semesterNumber: 'asc' }
                },
                _count: {
                    select: { semesters: true }
                }
            }
        });

        res.status(200).json(academicYears);
    } catch (error) {
        console.error('Error fetching academic years:', error);
        res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลปีการศึกษาได้' });
    }
});

// Get current academic year
router.get('/academic-years/current', async (req, res) => {
    try {
        const currentYear = await prisma.academic_years.findFirst({
            where: { isCurrent: true, isActive: true },
            include: {
                semesters: {
                    orderBy: { semesterNumber: 'asc' }
                }
            }
        });

        if (!currentYear) {
            return res.status(404).json({ message: 'ไม่พบปีการศึกษาปัจจุบัน' });
        }

        res.status(200).json(currentYear);
    } catch (error) {
        console.error('Error fetching current academic year:', error);
        res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลปีการศึกษาปัจจุบันได้' });
    }
});

// Get single academic year by ID
router.get('/academic-years/:id', async (req, res) => {
    try {
        const yearId = parseInt(req.params.id);

        if (isNaN(yearId)) {
            return res.status(400).json({ message: 'ID ไม่ถูกต้อง' });
        }

        const academicYear = await prisma.academic_years.findUnique({
            where: { id: yearId },
            include: {
                semesters: {
                    orderBy: { semesterNumber: 'asc' }
                }
            }
        });

        if (!academicYear) {
            return res.status(404).json({ message: 'ไม่พบปีการศึกษา' });
        }

        res.status(200).json(academicYear);
    } catch (error) {
        console.error('Error fetching academic year:', error);
        res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลปีการศึกษาได้' });
    }
});

// Create academic year (with auto-create semesters)
router.post('/academic-years', verifyToken, isAdmin, async (req, res) => {
    try {
        const { year, startDate, endDate, isCurrent } = req.body;

        // Validation
        if (!year || !startDate || !endDate) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // ตรวจสอบว่าปีนี้มีอยู่แล้วหรือไม่
        const existingYear = await prisma.academic_years.findUnique({
            where: { year }
        });

        if (existingYear) {
            return res.status(400).json({ message: `ปีการศึกษา ${year} มีอยู่แล้วในระบบ` });
        }

        // ถ้าต้องการตั้งเป็นปีปัจจุบัน ให้ปิดปีเก่า
        if (isCurrent) {
            await prisma.academic_years.updateMany({
                where: { isCurrent: true },
                data: { isCurrent: false }
            });
        }

        // คำนวณวันที่กลางปี สำหรับแบ่งภาคเรียน
        const start = new Date(startDate);
        const end = new Date(endDate);
        const midDate = new Date(start.getTime() + (end.getTime() - start.getTime()) / 2);

        // สร้างปีการศึกษาพร้อมภาคเรียน
        const newAcademicYear = await prisma.academic_years.create({
            data: {
                year,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                isCurrent: isCurrent || false,
                isActive: true,
                createdBy: req.userId,
                updatedBy: req.userId,
                semesters: {
                    create: [
                        {
                            semesterNumber: 1,
                            startDate: new Date(startDate),
                            endDate: midDate,
                            isCurrent: isCurrent ? true : false,
                            isActive: true,
                            createdBy: req.userId,
                            updatedBy: req.userId
                        },
                        {
                            semesterNumber: 2,
                            startDate: midDate,
                            endDate: new Date(endDate),
                            isCurrent: false,
                            isActive: true,
                            createdBy: req.userId,
                            updatedBy: req.userId
                        }
                    ]
                }
            },
            include: {
                semesters: {
                    orderBy: { semesterNumber: 'asc' }
                }
            }
        });

        res.status(201).json({
            message: 'สร้างปีการศึกษาสำเร็จ',
            data: newAcademicYear
        });
    } catch (error) {
        console.error('Error creating academic year:', error);
        res.status(500).json({ message: 'ไม่สามารถสร้างปีการศึกษาได้' });
    }
});

// Update academic year
router.patch('/academic-years/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const yearId = parseInt(req.params.id);
        const { year, startDate, endDate, isCurrent, isActive } = req.body;

        if (isNaN(yearId)) {
            return res.status(400).json({ message: 'ID ไม่ถูกต้อง' });
        }

        // ตรวจสอบว่าปีมีอยู่
        const existingYear = await prisma.academic_years.findUnique({
            where: { id: yearId }
        });

        if (!existingYear) {
            return res.status(404).json({ message: 'ไม่พบปีการศึกษา' });
        }

        // ถ้าเปลี่ยนเป็นปีปัจจุบัน ให้ปิดปีเก่า
        if (isCurrent && !existingYear.isCurrent) {
            await prisma.academic_years.updateMany({
                where: { 
                    isCurrent: true,
                    id: { not: yearId }
                },
                data: { isCurrent: false }
            });
        }

        // ถ้ามีการเปลี่ยนวันที่ของปีการศึกษา ให้อัปเดตภาคเรียนด้วย
        if (startDate || endDate) {
            const newStartDate = startDate ? new Date(startDate) : existingYear.startDate;
            const newEndDate = endDate ? new Date(endDate) : existingYear.endDate;
            const midDate = new Date(newStartDate.getTime() + (newEndDate.getTime() - newStartDate.getTime()) / 2);

            // อัปเดตภาคเรียนที่ 1 และ 2
            const semesters = await prisma.semesters.findMany({
                where: { academicYearId: yearId },
                orderBy: { semesterNumber: 'asc' }
            });

            if (semesters.length >= 2) {
                // อัปเดตภาคเรียนที่ 1
                await prisma.semesters.update({
                    where: { id: semesters[0].id },
                    data: {
                        startDate: newStartDate,
                        endDate: midDate,
                        updatedBy: req.userId
                    }
                });

                // อัปเดตภาคเรียนที่ 2
                await prisma.semesters.update({
                    where: { id: semesters[1].id },
                    data: {
                        startDate: midDate,
                        endDate: newEndDate,
                        updatedBy: req.userId
                    }
                });
            }
        }

        const updatedYear = await prisma.academic_years.update({
            where: { id: yearId },
            data: {
                year: year || existingYear.year,
                startDate: startDate ? new Date(startDate) : existingYear.startDate,
                endDate: endDate ? new Date(endDate) : existingYear.endDate,
                isCurrent: isCurrent !== undefined ? isCurrent : existingYear.isCurrent,
                isActive: isActive !== undefined ? isActive : existingYear.isActive,
                updatedBy: req.userId
            },
            include: {
                semesters: {
                    orderBy: { semesterNumber: 'asc' }
                }
            }
        });

        res.status(200).json({
            message: 'อัปเดตปีการศึกษาและภาคเรียนสำเร็จ',
            data: updatedYear
        });
    } catch (error) {
        console.error('Error updating academic year:', error);
        res.status(500).json({ message: 'ไม่สามารถอัปเดตปีการศึกษาได้' });
    }
});

// Set current academic year
router.patch('/academic-years/:id/set-current', verifyToken, isAdmin, async (req, res) => {
    try {
        const yearId = parseInt(req.params.id);

        if (isNaN(yearId)) {
            return res.status(400).json({ message: 'ID ไม่ถูกต้อง' });
        }

        // ปิดปีปัจจุบันทั้งหมด
        await prisma.academic_years.updateMany({
            where: { isCurrent: true },
            data: { isCurrent: false }
        });

        // ตั้งปีใหม่
        const updatedYear = await prisma.academic_years.update({
            where: { id: yearId },
            data: { 
                isCurrent: true,
                isActive: true,
                updatedBy: req.userId
            },
            include: {
                semesters: {
                    orderBy: { semesterNumber: 'asc' }
                }
            }
        });

        res.status(200).json({
            message: 'ตั้งเป็นปีการศึกษาปัจจุบันสำเร็จ',
            data: updatedYear
        });
    } catch (error) {
        console.error('Error setting current academic year:', error);
        res.status(500).json({ message: 'ไม่สามารถตั้งเป็นปีปัจจุบันได้' });
    }
});

// Delete academic year (hard delete with validation)
router.delete('/academic-years/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const yearId = parseInt(req.params.id);

        if (isNaN(yearId)) {
            return res.status(400).json({ message: 'ID ไม่ถูกต้อง' });
        }

        // ตรวจสอบว่าปีการศึกษามีอยู่จริง
        const academicYear = await prisma.academic_years.findUnique({
            where: { id: yearId },
            include: {
                semesters: {
                    include: {
                        _count: {
                            select: {
                                flagpoleattendance: true,
                                homeroomattendance: true,
                                academicclubattendance: true
                            }
                        }
                    }
                }
            }
        });

        if (!academicYear) {
            return res.status(404).json({ message: 'ไม่พบปีการศึกษา' });
        }

        // ป้องกันลบปีปัจจุบัน
        if (academicYear.isCurrent) {
            return res.status(400).json({ 
                message: 'ไม่สามารถลบปีการศึกษาปัจจุบันได้',
                detail: 'กรุณาเปลี่ยนเป็นปีการศึกษาอื่นก่อนทำการลบ'
            });
        }

        // ตรวจสอบว่าภาคเรียนมีข้อมูลเชื่อมโยงหรือไม่
        const hasRelatedData = academicYear.semesters.some(semester => 
            semester._count.flagpoleattendance > 0 ||
            semester._count.homeroomattendance > 0 ||
            semester._count.academicclubattendance > 0
        );

        if (hasRelatedData) {
            // นับจำนวนข้อมูลทั้งหมด
            const totalRecords = academicYear.semesters.reduce((sum, semester) => 
                sum + 
                semester._count.flagpoleattendance + 
                semester._count.homeroomattendance + 
                semester._count.academicclubattendance
            , 0);

            return res.status(400).json({ 
                message: 'ไม่สามารถลบปีการศึกษาที่มีข้อมูลบันทึกแล้วได้',
                detail: `ปีการศึกษา ${academicYear.year} มีข้อมูลการบันทึกทั้งหมด ${totalRecords} รายการ (การเข้าแถว, เข้าชุมนุม, เข้าห้องโฮมรูม)`,
                suggestion: 'หากต้องการหยุดใช้งานปีนี้ กรุณาใช้ฟังก์ชัน "ปิดใช้งาน" แทน หรือติดต่อผู้ดูแลระบบ'
            });
        }

        // Hard Delete (จะ Cascade ไปยัง semesters อัตโนมัติ)
        await prisma.academic_years.delete({
            where: { id: yearId }
        });

        res.status(200).json({ 
            message: 'ลบปีการศึกษาสำเร็จ',
            detail: `ลบปีการศึกษา ${academicYear.year} และภาคเรียนทั้งหมดแล้ว`
        });
    } catch (error) {
        console.error('Error deleting academic year:', error);
        
        // ตรวจสอบ Foreign Key Constraint Error
        if (error.code === 'P2003') {
            return res.status(400).json({ 
                message: 'ไม่สามารถลบปีการศึกษาได้',
                detail: 'ปีการศึกษานี้มีข้อมูลที่เชื่อมโยงอยู่ กรุณาตรวจสอบและลบข้อมูลที่เกี่ยวข้องก่อน',
                error: 'FOREIGN_KEY_CONSTRAINT'
            });
        }

        res.status(500).json({ 
            message: 'ไม่สามารถลบปีการศึกษาได้',
            detail: error.message 
        });
    }
});

// ========================================
// SEMESTERS ROUTES
// ========================================

// Get current semester
router.get('/semesters/current', async (req, res) => {
    try {
        const currentSemester = await prisma.semesters.findFirst({
            where: { isCurrent: true, isActive: true },
            include: {
                academic_years: true
            }
        });

        if (!currentSemester) {
            return res.status(404).json({ message: 'ไม่พบภาคเรียนปัจจุบัน' });
        }

        res.status(200).json(currentSemester);
    } catch (error) {
        console.error('Error fetching current semester:', error);
        res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลภาคเรียนปัจจุบันได้' });
    }
});

// Update semester
router.patch('/semesters/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const semesterId = parseInt(req.params.id);
        const { startDate, endDate, isCurrent, isActive } = req.body;

        if (isNaN(semesterId)) {
            return res.status(400).json({ message: 'ID ไม่ถูกต้อง' });
        }

        const existingSemester = await prisma.semesters.findUnique({
            where: { id: semesterId },
            include: { academic_years: true }
        });

        if (!existingSemester) {
            return res.status(404).json({ message: 'ไม่พบภาคเรียน' });
        }

        // ถ้าตั้งเป็นภาคปัจจุบัน ให้ปิดภาคเก่า
        if (isCurrent && !existingSemester.isCurrent) {
            await prisma.semesters.updateMany({
                where: { 
                    isCurrent: true,
                    id: { not: semesterId }
                },
                data: { isCurrent: false }
            });
        }

        const updatedSemester = await prisma.semesters.update({
            where: { id: semesterId },
            data: {
                startDate: startDate ? new Date(startDate) : existingSemester.startDate,
                endDate: endDate ? new Date(endDate) : existingSemester.endDate,
                isCurrent: isCurrent !== undefined ? isCurrent : existingSemester.isCurrent,
                isActive: isActive !== undefined ? isActive : existingSemester.isActive,
                updatedBy: req.userId
            },
            include: {
                academic_years: true
            }
        });

        // อัปเดตวันที่ของปีการศึกษาตามภาคเรียน
        const academicYearId = existingSemester.academicYearId;
        const allSemesters = await prisma.semesters.findMany({
            where: { academicYearId: academicYearId },
            orderBy: { semesterNumber: 'asc' }
        });

        if (allSemesters.length > 0) {
            // หาวันเริ่มต้นจากภาคเรียนที่ 1 และวันสิ้นสุดจากภาคเรียนสุดท้าย
            const firstSemester = allSemesters[0];
            const lastSemester = allSemesters[allSemesters.length - 1];

            await prisma.academic_years.update({
                where: { id: academicYearId },
                data: {
                    startDate: firstSemester.startDate,
                    endDate: lastSemester.endDate,
                    updatedBy: req.userId
                }
            });
        }

        res.status(200).json({
            message: 'อัปเดตภาคเรียนและปีการศึกษาสำเร็จ',
            data: updatedSemester
        });
    } catch (error) {
        console.error('Error updating semester:', error);
        res.status(500).json({ message: 'ไม่สามารถอัปเดตภาคเรียนได้' });
    }
});

// Set current semester
router.patch('/semesters/:id/set-current', verifyToken, isAdmin, async (req, res) => {
    try {
        const semesterId = parseInt(req.params.id);

        if (isNaN(semesterId)) {
            return res.status(400).json({ message: 'ID ไม่ถูกต้อง' });
        }

        // ปิดภาคเรียนปัจจุบันทั้งหมด
        await prisma.semesters.updateMany({
            where: { isCurrent: true },
            data: { isCurrent: false }
        });

        // ตั้งภาคเรียนใหม่
        const updatedSemester = await prisma.semesters.update({
            where: { id: semesterId },
            data: { 
                isCurrent: true,
                isActive: true,
                updatedBy: req.userId
            },
            include: {
                academic_years: true
            }
        });

        // อัปเดตปีการศึกษาให้เป็นปัจจุบันด้วย
        await prisma.academic_years.updateMany({
            where: { isCurrent: true },
            data: { isCurrent: false }
        });

        await prisma.academic_years.update({
            where: { id: updatedSemester.academicYearId },
            data: { 
                isCurrent: true,
                isActive: true,
                updatedBy: req.userId
            }
        });

        res.status(200).json({
            message: 'ตั้งเป็นภาคเรียนปัจจุบันสำเร็จ',
            data: updatedSemester
        });
    } catch (error) {
        console.error('Error setting current semester:', error);
        res.status(500).json({ message: 'ไม่สามารถตั้งเป็นภาคเรียนปัจจุบันได้' });
    }
});

// Auto-detect semester by date
router.post('/semesters/detect', verifyToken, async (req, res) => {
    try {
        const { date } = req.body;

        if (!date) {
            return res.status(400).json({ message: 'กรุณาระบุวันที่' });
        }

        const targetDate = new Date(date);

        const semester = await prisma.semesters.findFirst({
            where: {
                startDate: { lte: targetDate },
                endDate: { gte: targetDate },
                isActive: true
            },
            include: {
                academic_years: true
            }
        });

        if (!semester) {
            return res.status(404).json({ 
                message: 'ไม่พบภาคเรียนสำหรับวันที่นี้',
                suggestion: 'กรุณาตรวจสอบว่ามีการตั้งค่าปีการศึกษาและภาคเรียนครอบคลุมวันที่นี้'
            });
        }

        res.status(200).json(semester);
    } catch (error) {
        console.error('Error detecting semester:', error);
        res.status(500).json({ message: 'ไม่สามารถตรวจสอบภาคเรียนได้' });
    }
});

module.exports = router;

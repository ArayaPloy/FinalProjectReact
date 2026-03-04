const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const verifyToken = require('../middleware/verifyToken');

/**
 * GET /api/students/classrooms
 * ดึงรายชื่อห้องเรียนทั้งหมด (unique)
 */
router.get('/classrooms', async (req, res) => {
  try {
    // ดึง className จาก homeroom_classes (normalized)
    const classrooms = await prisma.homeroom_classes.findMany({
      where: { isActive: true },
      select: { className: true },
      orderBy: { className: 'asc' }
    });

    const classRoomList = classrooms.map(c => c.className);

    res.json({
      success: true,
      data: classRoomList
    });

  } catch (error) {
    console.error('Error fetching classrooms:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงรายชื่อห้องเรียน',
      error: error.message
    });
  }
});

/**
 * GET /api/students/with-scores
 * ดึงข้อมูลนักเรียนในห้องพร้อมคะแนนปัจจุบัน
 * Query: classRoom, search
 */
router.get('/with-scores', async (req, res) => {
  try {
    const { classRoom, search } = req.query;

    // Build where clause
    let whereClause = {
      isDeleted: false
    };

    // Filter by classroom (ถ้าไม่ใช่ "ทั้งหมด")
    if (classRoom && classRoom !== 'ทั้งหมด') {
      whereClause.homeroomClass = { className: classRoom };
    }

    // เพิ่มเงื่อนไขค้นหา (ชื่อ, รหัสนักเรียน)
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { studentNumber: parseInt(search) || undefined }
      ].filter(Boolean);
    }

    // ดึงข้อมูลนักเรียน
    const students = await prisma.students.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentNumber: true,
        namePrefix: true,
        homeroomClass: { select: { className: true } }
      },
      orderBy: {
        studentNumber: 'asc'
      }
    });

    // ดึงคะแนนล่าสุดของแต่ละคน
    const studentsWithScores = await Promise.all(
      students.map(async (student) => {
        // คำนวณคะแนนรวม
        const scoreRecords = await prisma.studentbehaviorscores.findMany({
          where: {
            studentId: student.id,
            isDeleted: false
          },
          select: {
            score: true
          }
        });

        // คะแนนเริ่มต้น 100 + ผลรวมของ score ทั้งหมด
        const totalAdjustment = scoreRecords.reduce((sum, record) => sum + record.score, 0);
        const currentScore = 100 + totalAdjustment;

        return {
          id: student.id,
          studentId: student.studentNumber?.toString().padStart(5, '0') || '',
          fullName: `${student.namePrefix || ''}${student.firstName || ''}${student.lastName ? ' ' + student.lastName : ''}`.trim(),
          classRoom: student.homeroomClass?.className || '',
          currentScore: currentScore
        };
      })
    );

    res.json({
      success: true,
      data: studentsWithScores
    });

  } catch (error) {
    console.error('Error fetching students with scores:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลนักเรียน',
      error: error.message
    });
  }
});

/**
 * GET /api/students/all
 * ดึงรายชื่อนักเรียนทั้งหมด (ไม่บังคับ filter) - ใช้สำหรับหน้า AllStudents
 */
router.get('/all', async (req, res) => {
  try {
    const { classRoom, search } = req.query;

    let whereClause = {
      isDeleted: false
    };

    // Filter by classroom (optional)
    if (classRoom) {
      whereClause.homeroomClass = { className: classRoom };
    }

    // Filter by search (optional)
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { studentNumber: parseInt(search) || undefined }
      ].filter(Boolean);
    }

    const students = await prisma.students.findMany({
      where: whereClause,
      select: {
        id: true,
        namePrefix: true,
        firstName: true,
        lastName: true,
        studentNumber: true,
        genderId: true,
        guardianFirstName: true,
        guardianLastName: true,
        guardianNamePrefix: true,
        guardianRelation: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
        homeroomClass: { select: { className: true } },
        genders: {
          select: {
            genderName: true
          }
        }
      },
      orderBy: [
        { homeroomClass: { className: 'asc' } },
        { studentNumber: 'asc' }
      ]
    });

    res.json({
      success: true,
      data: students.map(s => ({
        ...s,
        fullName: `${s.namePrefix || ''}${s.firstName || ''}${s.lastName ? ' ' + s.lastName : ''}`.trim(),
        guardianName: `${s.guardianNamePrefix || ''}${s.guardianFirstName || ''}${s.guardianLastName ? ' ' + s.guardianLastName : ''}`.trim(),
        classRoom: s.homeroomClass?.className || ''
      })),
      total: students.length
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลนักเรียน',
      error: error.message
    });
  }
});

/**
 * GET /api/students
 * ดึงรายชื่อนักเรียนทั้งหมด (รองรับ filter)
 */
router.get('/', async (req, res) => {
  try {
    const { classRoom, search } = req.query;

    let whereClause = {
      isDeleted: false
    };

    // Filter by classroom
    if (classRoom) {
      whereClause.homeroomClass = { className: classRoom };
    }

    // Filter by search
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { studentNumber: parseInt(search) || undefined }
      ].filter(Boolean);
    }

    const students = await prisma.students.findMany({
      where: whereClause,
      select: {
        id: true,
        namePrefix: true,
        firstName: true,
        lastName: true,
        studentNumber: true,
        genderId: true,
        guardianFirstName: true,
        guardianLastName: true,
        guardianNamePrefix: true,
        guardianRelation: true,
        phoneNumber: true,
        homeroomClass: { select: { className: true } },
        genders: {
          select: {
            genderName: true
          }
        }
      },
      orderBy: [
        { homeroomClass: { className: 'asc' } },
        { studentNumber: 'asc' }
      ]
    });

    res.json({
      success: true,
      data: students.map(s => ({
        ...s,
        fullName: `${s.namePrefix || ''}${s.firstName || ''}${s.lastName ? ' ' + s.lastName : ''}`.trim(),
        guardianName: `${s.guardianNamePrefix || ''}${s.guardianFirstName || ''}${s.guardianLastName ? ' ' + s.guardianLastName : ''}`.trim(),
        classRoom: s.homeroomClass?.className || ''
      })),
      total: students.length
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลนักเรียน',
      error: error.message
    });
  }
});

/**
 * GET /api/students/:id
 * ดึงข้อมูลนักเรียนตาม ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const student = await prisma.students.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        genders: true,
        homeroomClass: {
          include: {
            homeroomTeacher: {
              select: { id: true, namePrefix: true, firstName: true, lastName: true }
            }
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลนักเรียน'
      });
    }

    res.json({
      success: true,
      data: student
    });

  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลนักเรียน',
      error: error.message
    });
  }
});

/**
 * PATCH /api/students/:id
 * อัปเดตข้อมูลนักเรียน (ใช้สำหรับการอัปเดตจากฟอร์มการเยี่ยมบ้าน)
 */
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};

    // Only allow a safe subset of fields to be updated from this endpoint
    const allowed = [
      'address', 'phoneNumber', 'emergencyContact',
      'houseType', 'houseMaterial', 'utilities', 'studyArea',
      'guardianFirstName', 'guardianLastName', 'guardianRelation', 'guardianOccupation', 'guardianMonthlyIncome', 'guardianNamePrefix',
      'namePrefix', 'firstName', 'lastName', 'dob'
    ];

    const data = {};
    allowed.forEach((f) => {
      if (Object.prototype.hasOwnProperty.call(updates, f)) {
        const val = updates[f];
        if (val === '') {
          data[f] = null;
        } else if (Array.isArray(val)) {
          // Store array as comma-separated string for backward compatibility
          data[f] = val.map(v => (v || '').toString().trim()).filter(Boolean).join(', ');
        } else {
          data[f] = val;
        }
      }
    });

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }

    const studentId = parseInt(id);
    const existing = await prisma.students.findUnique({ where: { id: studentId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    console.info(`[PATCH /api/students/${studentId}] user=${req.userId} fields=${Object.keys(data).join(',')}`);
    const updated = await prisma.students.update({ where: { id: studentId }, data });

    console.info(`[PATCH /api/students/${studentId}] success`);
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating student:', error.stack || error);
    res.status(500).json({ success: false, message: 'Failed to update student', error: error.message });
  }
});

module.exports = router;


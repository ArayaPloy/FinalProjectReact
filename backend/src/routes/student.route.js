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
 * Query: classRoom, search, includeDeleted (true = รวมที่ปิดใช้งาน)
 */
router.get('/all', async (req, res) => {
  try {
    const { classRoom, search, includeDeleted } = req.query;

    let whereClause = {};
    if (includeDeleted !== 'true') {
      whereClause.isDeleted = false;
    }

    if (classRoom) {
      whereClause.homeroomClass = { className: classRoom };
    }

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
        homeroomClassId: true,
        guardianFirstName: true,
        guardianLastName: true,
        guardianNamePrefix: true,
        guardianRelation: true,
        guardianOccupation: true,
        guardianMonthlyIncome: true,
        emergencyContact: true,
        phoneNumber: true,
        address: true,
        houseType: true,
        houseMaterial: true,
        utilities: true,
        studyArea: true,
        dob: true,
        nationality: true,
        weight: true,
        height: true,
        disease: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        homeroomClass: {
          select: {
            className: true,
            homeroomTeacher: {
              select: { namePrefix: true, firstName: true, lastName: true }
            }
          }
        },
        genders: { select: { genderName: true } }
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
        classRoom: s.homeroomClass?.className || '',
        teacherName: s.homeroomClass?.homeroomTeacher
          ? `${s.homeroomClass.homeroomTeacher.namePrefix || ''}${s.homeroomClass.homeroomTeacher.firstName} ${s.homeroomClass.homeroomTeacher.lastName}`.trim()
          : ''
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
 * GET /api/students/genders
 * ดึงรายการเพศทั้งหมด
 */
router.get('/genders', async (req, res) => {
  try {
    const genders = await prisma.genders.findMany({ orderBy: { id: 'asc' } });
    res.json({ success: true, data: genders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด', error: error.message });
  }
});

/**
 * GET /api/students/classrooms-full
 * ดึงรายชื่อห้องเรียนพร้อมข้อมูลครูประจำชั้น
 */
router.get('/classrooms-full', async (req, res) => {
  try {
    const classes = await prisma.homeroom_classes.findMany({
      where: { isActive: true },
      select: {
        id: true,
        className: true,
        homeroomTeacher: {
          select: { namePrefix: true, firstName: true, lastName: true }
        }
      },
      orderBy: { className: 'asc' }
    });
    const data = classes.map(c => ({
      id: c.id,
      className: c.className,
      teacherName: c.homeroomTeacher
        ? `${c.homeroomTeacher.namePrefix || ''}${c.homeroomTeacher.firstName} ${c.homeroomTeacher.lastName}`.trim()
        : ''
    }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด', error: error.message });
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

    try {
      const oldValues = Object.keys(data).reduce((acc, k) => { acc[k] = existing[k]; return acc; }, {});
      await prisma.audit_logs.create({
        data: {
          userId: req.userId || null,
          tableName: 'students',
          recordId: studentId,
          action: 'UPDATE',
          oldValues: JSON.stringify(oldValues),
          newValues: JSON.stringify(data),
          ipAddress: req.ip || req.connection?.remoteAddress || null,
          userAgent: req.get('user-agent') || null
        }
      });
    } catch (auditError) {
      console.error('Error creating audit log:', auditError);
    }

    console.info(`[PATCH /api/students/${studentId}] success`);
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating student:', error.stack || error);
    res.status(500).json({ success: false, message: 'Failed to update student', error: error.message });
  }
});

/**
 * POST /api/students
 * เพิ่มนักเรียนใหม่
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      namePrefix, firstName, lastName, genderId,
      homeroomClassId, studentNumber,
      guardianNamePrefix, guardianFirstName, guardianLastName,
      guardianRelation, guardianOccupation, guardianMonthlyIncome,
      emergencyContact, address, houseType, houseMaterial,
      utilities, studyArea, dob, nationality, weight, height,
      disease, phoneNumber
    } = req.body;

    if (!firstName || !lastName || !genderId) {
      return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลที่จำเป็น (ชื่อ, นามสกุล, เพศ)' });
    }

    if (studentNumber) {
      const existing = await prisma.students.findFirst({
        where: { studentNumber: parseInt(studentNumber) }
      });
      if (existing) {
        return res.status(409).json({ success: false, message: `รหัสนักเรียน ${studentNumber} มีอยู่ในระบบแล้ว` });
      }
    }

    const student = await prisma.students.create({
      data: {
        namePrefix: namePrefix || null,
        firstName,
        lastName,
        genderId: parseInt(genderId),
        homeroomClassId: homeroomClassId ? parseInt(homeroomClassId) : null,
        studentNumber: studentNumber ? parseInt(studentNumber) : null,
        guardianNamePrefix: guardianNamePrefix || null,
        guardianFirstName: guardianFirstName || null,
        guardianLastName: guardianLastName || null,
        guardianRelation: guardianRelation || null,
        guardianOccupation: guardianOccupation || null,
        guardianMonthlyIncome: guardianMonthlyIncome || null,
        emergencyContact: emergencyContact || null,
        address: address || null,
        houseType: houseType || null,
        houseMaterial: houseMaterial || null,
        utilities: utilities || null,
        studyArea: studyArea || null,
        dob: dob ? new Date(dob) : null,
        nationality: nationality || null,
        weight: weight ? parseInt(weight) : null,
        height: height ? parseInt(height) : null,
        disease: disease || null,
        phoneNumber: phoneNumber || null,
        isDeleted: false,
        updatedBy: req.userId || null,
      }
    });

    res.status(201).json({ success: true, data: student, message: 'เพิ่มนักเรียนสำเร็จ' });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการเพิ่มนักเรียน', error: error.message });
  }
});

/**
 * PUT /api/students/:id
 * อัปเดตข้อมูลนักเรียนทั้งหมด
 */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = parseInt(id);
    const {
      namePrefix, firstName, lastName, genderId,
      homeroomClassId, studentNumber,
      guardianNamePrefix, guardianFirstName, guardianLastName,
      guardianRelation, guardianOccupation, guardianMonthlyIncome,
      emergencyContact, address, houseType, houseMaterial,
      utilities, studyArea, dob, nationality, weight, height,
      disease, phoneNumber
    } = req.body;

    const existing = await prisma.students.findUnique({ where: { id: studentId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลนักเรียน' });
    }

    if (studentNumber) {
      const dupCheck = await prisma.students.findFirst({
        where: { studentNumber: parseInt(studentNumber), NOT: { id: studentId } }
      });
      if (dupCheck) {
        return res.status(409).json({ success: false, message: `รหัสนักเรียน ${studentNumber} มีอยู่ในระบบแล้ว` });
      }
    }

    const updated = await prisma.students.update({
      where: { id: studentId },
      data: {
        namePrefix: namePrefix || null,
        firstName: firstName || existing.firstName,
        lastName: lastName || existing.lastName,
        genderId: genderId ? parseInt(genderId) : existing.genderId,
        homeroomClassId: homeroomClassId ? parseInt(homeroomClassId) : null,
        studentNumber: studentNumber ? parseInt(studentNumber) : existing.studentNumber,
        guardianNamePrefix: guardianNamePrefix || null,
        guardianFirstName: guardianFirstName || null,
        guardianLastName: guardianLastName || null,
        guardianRelation: guardianRelation || null,
        guardianOccupation: guardianOccupation || null,
        guardianMonthlyIncome: guardianMonthlyIncome || null,
        emergencyContact: emergencyContact || null,
        address: address || null,
        houseType: houseType || null,
        houseMaterial: houseMaterial || null,
        utilities: utilities || null,
        studyArea: studyArea || null,
        dob: dob ? new Date(dob) : null,
        nationality: nationality || null,
        weight: weight ? parseInt(weight) : null,
        height: height ? parseInt(height) : null,
        disease: disease || null,
        phoneNumber: phoneNumber || null,
        updatedBy: req.userId || null,
      }
    });

    res.json({ success: true, data: updated, message: 'อัปเดตข้อมูลสำเร็จ' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล', error: error.message });
  }
});

/**
 * PATCH /api/students/:id/toggle
 * เปิด/ปิดการใช้งานนักเรียน
 */
router.patch('/:id/toggle', verifyToken, async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const student = await prisma.students.findUnique({ where: { id: studentId } });
    if (!student) {
      return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลนักเรียน' });
    }

    const newIsDeleted = !student.isDeleted;
    const updated = await prisma.students.update({
      where: { id: studentId },
      data: {
        isDeleted: newIsDeleted,
        deletedAt: newIsDeleted ? new Date() : null,
        updatedBy: req.userId || null,
      }
    });

    res.json({
      success: true,
      data: updated,
      message: newIsDeleted ? 'ปิดการใช้งานนักเรียนสำเร็จ' : 'เปิดการใช้งานนักเรียนสำเร็จ'
    });
  } catch (error) {
    console.error('Error toggling student:', error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด', error: error.message });
  }
});

/**
 * POST /api/students/import
 * นำเข้าข้อมูลนักเรียนแบบ bulk
 */
router.post('/import', verifyToken, async (req, res) => {
  try {
    const { students: studentsData } = req.body;
    if (!Array.isArray(studentsData) || studentsData.length === 0) {
      return res.status(400).json({ success: false, message: 'ไม่มีข้อมูลที่จะนำเข้า' });
    }

    let created = 0, skipped = 0;
    const errors = [];

    for (const row of studentsData) {
      try {
        if (row.studentNumber) {
          const existing = await prisma.students.findFirst({
            where: { studentNumber: parseInt(row.studentNumber) }
          });
          if (existing) { skipped++; continue; }
        }

        let homeroomClassId = null;
        if (row.className) {
          const cls = await prisma.homeroom_classes.findFirst({
            where: { className: row.className, isActive: true }
          });
          if (cls) homeroomClassId = cls.id;
        }

        let genderId = 1;
        if (row.genderName) {
          const gender = await prisma.genders.findFirst({ where: { genderName: row.genderName } });
          if (gender) genderId = gender.id;
        } else if (row.genderId) {
          genderId = parseInt(row.genderId);
        }

        await prisma.students.create({
          data: {
            namePrefix: row.namePrefix || null,
            firstName: row.firstName || '',
            lastName: row.lastName || '',
            genderId,
            homeroomClassId,
            studentNumber: row.studentNumber ? parseInt(row.studentNumber) : null,
            dob: row.dob ? new Date(row.dob) : null,
            nationality: row.nationality || null,
            weight: row.weight ? parseInt(row.weight) : null,
            height: row.height ? parseInt(row.height) : null,
            disease: row.disease || null,
            phoneNumber: row.phoneNumber || null,
            guardianNamePrefix: row.guardianNamePrefix || null,
            guardianFirstName: row.guardianFirstName || null,
            guardianLastName: row.guardianLastName || null,
            guardianRelation: row.guardianRelation || null,
            guardianOccupation: row.guardianOccupation || null,
            guardianMonthlyIncome: row.guardianMonthlyIncome || null,
            emergencyContact: row.emergencyContact || null,
            address: row.address || null,
            houseType: row.houseType || null,
            houseMaterial: row.houseMaterial || null,
            utilities: row.utilities || null,
            studyArea: row.studyArea || null,
            isDeleted: false,
            updatedBy: req.userId || null,
          }
        });
        created++;
      } catch (rowError) {
        errors.push(`รหัส ${row.studentNumber || '?'}: ${rowError.message}`);
      }
    }

    res.json({
      success: true,
      message: `นำเข้าสำเร็จ ${created} รายการ${skipped > 0 ? `, ข้ามซ้ำ ${skipped} รายการ` : ''}${errors.length > 0 ? `, ผิดพลาด ${errors.length} รายการ` : ''}`,
      created, skipped, errors
    });
  } catch (error) {
    console.error('Error importing students:', error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการนำเข้าข้อมูล', error: error.message });
  }
});

module.exports = router;


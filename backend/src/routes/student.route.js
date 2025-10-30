const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/students/classrooms
 * ดึงรายชื่อห้องเรียนทั้งหมด (unique)
 */
router.get('/classrooms', async (req, res) => {
  try {
    // ดึง classRoom ที่ไม่ซ้ำกัน
    const classRooms = await prisma.students.findMany({
      where: {
        isDeleted: false,
        classRoom: {
          not: null
        }
      },
      select: {
        classRoom: true
      },
      distinct: ['classRoom'],
      orderBy: {
        classRoom: 'asc'
      }
    });

    // แปลงเป็น array ของ string
    const classRoomList = classRooms.map(item => item.classRoom);

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
      whereClause.classRoom = classRoom;
    }

    // เพิ่มเงื่อนไขค้นหา (ชื่อ, รหัสนักเรียน)
    if (search) {
      whereClause.OR = [
        { fullName: { contains: search } },
        { studentNumber: parseInt(search) || undefined }
      ].filter(Boolean);
    }

    // ดึงข้อมูลนักเรียน
    const students = await prisma.students.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        classRoom: true,
        studentNumber: true,
        namePrefix: true
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
          fullName: `${student.namePrefix || ''}${student.fullName}`,
          classRoom: student.classRoom,
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
      whereClause.classRoom = classRoom;
    }

    // Filter by search
    if (search) {
      whereClause.OR = [
        { fullName: { contains: search } },
        { studentNumber: parseInt(search) || undefined }
      ].filter(Boolean);
    }

    const students = await prisma.students.findMany({
      where: whereClause,
      select: {
        id: true,
        namePrefix: true,
        fullName: true,
        classRoom: true,
        studentNumber: true,
        genderId: true,
        guardianName: true,
        guardianRelation: true,
        phoneNumber: true,
        genders: {
          select: {
            genderName: true
          }
        }
      },
      orderBy: [
        { classRoom: 'asc' },
        { studentNumber: 'asc' }
      ]
    });

    res.json({
      success: true,
      data: students,
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
        teachers: {
          select: {
            id: true,
            fullName: true,
            namePrefix: true
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

module.exports = router;

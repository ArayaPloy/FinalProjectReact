const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * GET /api/students/public/flagpole-attendance/:studentNumber
 * ดูประวัติการเข้าแถวของนักเรียน (Public - ไม่ต้อง authenticate)
 * Query params: academicYearId, semesterId
 */
router.get('/flagpole-attendance/:studentNumber', async (req, res) => {
  try {
    const { studentNumber } = req.params;
    const { academicYearId, semesterId } = req.query;

    // ตรวจสอบว่ามีนักเรียนคนนี้หรือไม่
    const student = await prisma.students.findFirst({
      where: {
        studentNumber: parseInt(studentNumber),
        isDeleted: false
      },
      select: {
        id: true,
        studentNumber: true,
        namePrefix: true,
        fullName: true,
        classRoom: true
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลนักเรียน'
      });
    }

    // Build where clause
    const whereClause = {
      studentId: student.id
    };

    // Filter by semester
    if (semesterId) {
      whereClause.semesterId = parseInt(semesterId);
    }

    // ดึงประวัติการเข้าแถว
    const attendanceRecords = await prisma.flagpoleattendance.findMany({
      where: whereClause,
      include: {
        attendancestatuses: true,
        semesters: {
          include: {
            academic_years: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    // แปลงชื่อสถานะเป็นภาษาไทย
    const translationMap = {
      'present': 'มา',
      'late': 'สาย',
      'sick leave': 'ลาป่วย',
      'personal leave': 'ลากิจ',
      'absent': 'ขาด'
    };

    const formattedRecords = attendanceRecords.map(record => ({
      id: record.id,
      date: record.date,
      status: translationMap[record.attendancestatuses.name] || record.attendancestatuses.name,
      statusId: record.statusId,
      semester: record.semesters ? {
        id: record.semesters.id,
        semesterNumber: record.semesters.semesterNumber,
        academicYear: record.semesters.academic_years.year
      } : null
    }));

    // คำนวณสถิติ
    const statistics = {};
    Object.values(translationMap).forEach(status => {
      statistics[status] = 0;
    });

    formattedRecords.forEach(record => {
      if (statistics[record.status] !== undefined) {
        statistics[record.status]++;
      }
    });

    res.json({
      success: true,
      data: {
        student: {
          studentNumber: student.studentNumber,
          namePrefix: student.namePrefix,
          fullName: student.fullName,
          classRoom: student.classRoom
        },
        records: formattedRecords,
        statistics: statistics,
        totalRecords: formattedRecords.length
      }
    });

  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      error: error.message
    });
  }
});

/**
 * GET /api/students/public/behavior-score/:studentNumber
 * ดูประวัติคะแนนความประพฤติของนักเรียน (Public - ไม่ต้อง authenticate)
 */
router.get('/behavior-score/:studentNumber', async (req, res) => {
  try {
    const { studentNumber } = req.params;

    // ตรวจสอบว่ามีนักเรียนคนนี้หรือไม่
    const student = await prisma.students.findFirst({
      where: {
        studentNumber: parseInt(studentNumber),
        isDeleted: false
      },
      select: {
        id: true,
        studentNumber: true,
        namePrefix: true,
        fullName: true,
        classRoom: true
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลนักเรียน'
      });
    }

    // ดึงประวัติคะแนนความประพฤติ
    const scoreHistory = await prisma.studentbehaviorscores.findMany({
      where: {
        studentId: student.id,
        isDeleted: false
      },
      include: {
        users_studentbehaviorscores_recorderIdTousers: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // คำนวณคะแนนสะสม (เริ่มต้น 100)
    let runningTotal = 100;
    const historyWithRunningTotal = scoreHistory.reverse().map((record) => {
      runningTotal += record.score;
      return {
        id: record.id,
        date: record.createdAt,
        score: record.score,
        comments: record.comments,
        recordedBy: record.users_studentbehaviorscores_recorderIdTousers?.username || 'ไม่ระบุ',
        currentScore: runningTotal
      };
    }).reverse();

    // คำนวณสถิติ
    const totalAdded = scoreHistory
      .filter(r => r.score > 0)
      .reduce((sum, r) => sum + r.score, 0);
    
    const totalDeducted = scoreHistory
      .filter(r => r.score < 0)
      .reduce((sum, r) => sum + Math.abs(r.score), 0);

    res.json({
      success: true,
      data: {
        student: {
          studentNumber: student.studentNumber,
          namePrefix: student.namePrefix,
          fullName: student.fullName,
          classRoom: student.classRoom
        },
        currentScore: runningTotal,
        history: historyWithRunningTotal,
        statistics: {
          totalRecords: scoreHistory.length,
          totalAdded: totalAdded,
          totalDeducted: totalDeducted,
          hasHistory: scoreHistory.length > 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching student behavior score:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      error: error.message
    });
  }
});

module.exports = router;

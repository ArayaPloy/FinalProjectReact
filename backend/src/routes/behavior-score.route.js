const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/admin');

// ========================================
// TEACHER ENDPOINTS
// ========================================

/**
 * GET /api/behavior-scores/today
 * ดึงคะแนนที่บันทึกไว้วันนี้ (classRoom เป็น optional — ถ้าไม่ระบุหรือ 'ทั้งหมด' จะดึงทุกห้อง)
 * Query params: classRoom (optional), date (YYYY-MM-DD local, required)
 */
router.get('/today', verifyToken, async (req, res) => {
  try {
    const { classRoom, date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'กรุณาระบุวันที่' });
    }

    const [year, month, day] = date.split('-').map(Number);
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    // กรองตามห้อง (ถ้าไม่มี classRoom หรือ 'ทั้งหมด' → ดึงทุกห้อง)
    const studentFilter = (classRoom && classRoom !== 'ทั้งหมด')
      ? { homeroomClass: { className: classRoom }, isDeleted: false }
      : { isDeleted: false };

    const records = await prisma.studentbehaviorscores.findMany({
      where: {
        isDeleted: false,
        createdAt: { gte: startOfDay, lte: endOfDay },
        students: studentFilter
      },
      include: {
        students: {
          select: { id: true, firstName: true, lastName: true, namePrefix: true }
        },
        users_studentbehaviorscores_recorderIdTousers: {
          select: {
            username: true,
            teacher_profile: {
              select: { namePrefix: true, firstName: true, lastName: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = records.map(r => {
      const recorder = r.users_studentbehaviorscores_recorderIdTousers;
      let recorderName = null;
      if (recorder) {
        const t = recorder.teacher_profile;
        recorderName = t
          ? `${t.namePrefix || ''}${t.firstName || ''}${t.lastName ? ' ' + t.lastName : ''}`.trim()
          : recorder.username;
      }
      return { ...r, recorderName };
    });

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Error fetching today behavior scores:', error);
    res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลได้', error: error.message });
  }
});

/**
 * POST /api/behavior-scores
 * บันทึกคะแนนนักเรียน (รองรับ single และ multiple students)
 * สามารถบันทึกซ้ำได้หลายครั้งต่อวัน (append mode) เช่น นักเรียนทำดีและทำผิดซ้ำ
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { records, recorderId } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุข้อมูลการบันทึกคะแนน'
      });
    }

    if (!recorderId) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุผู้บันทึก'
      });
    }

    // บันทึกทีละรายการ (append — ไม่ลบข้อมูลเก่า)
    const createdRecords = await Promise.all(
      records.map(async (record) => {
        const { studentId, score, comments } = record;

        // Validate
        if (!studentId || score === undefined) {
          throw new Error('ข้อมูลไม่ครบถ้วน');
        }

        // สร้างบันทึก
        const newRecord = await prisma.studentbehaviorscores.create({
          data: {
            studentId: studentId,
            score: score,
            comments: comments || null,
            recorderId: recorderId,
            isDeleted: false
          },
          include: {
            students: {
              select: {
                firstName: true,
                lastName: true,
                namePrefix: true,
                homeroomClass: { select: { className: true } }
              }
            },
            users_studentbehaviorscores_recorderIdTousers: {
              select: {
                username: true
              }
            }
          }
        });

        return newRecord;
      })
    );

    res.json({
      success: true,
      message: `บันทึกคะแนนสำเร็จ ${createdRecords.length} รายการ`,
      data: createdRecords
    });

  } catch (error) {
    console.error('Error saving behavior scores:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการบันทึกคะแนน',
      error: error.message
    });
  }
});

/**
 * GET /api/behavior-scores/history/:studentId
 * ดูประวัติการบันทึกคะแนนของนักเรียน
 */
router.get('/history/:studentId', verifyToken, async (req, res) => {
  try {
    const { studentId } = req.params;

    // ดึงข้อมูลนักเรียน
    const student = await prisma.students.findUnique({
      where: { id: parseInt(studentId) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        namePrefix: true,
        studentNumber: true,
        homeroomClass: { select: { className: true } }
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลนักเรียน'
      });
    }

    // ดึงประวัติการบันทึกคะแนน
    const scoreHistory = await prisma.studentbehaviorscores.findMany({
      where: {
        studentId: parseInt(studentId),
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

    // คำนวณคะแนนสะสม
    let runningTotal = 100;
    const historyWithRunningTotal = scoreHistory.reverse().map((record) => {
      runningTotal += record.score;
      return {
        id: record.id,
        score: record.score,
        comments: record.comments,
        currentTotal: runningTotal,
        recordedBy: record.users_studentbehaviorscores_recorderIdTousers?.username || 'ไม่ระบุ',
        recordedAt: record.createdAt,
        updatedAt: record.updatedAt
      };
    }).reverse();

    res.json({
      success: true,
      data: {
        student: {
          id: student.id,
          fullName: `${student.namePrefix || ''}${student.firstName || ''}${student.lastName ? ' ' + student.lastName : ''}`.trim(),
          classRoom: student.homeroomClass?.className || '',
          studentCode: student.studentNumber?.toString().padStart(5, '0') || '',
          currentScore: runningTotal
        },
        history: historyWithRunningTotal
      }
    });

  } catch (error) {
    console.error('Error fetching behavior score history:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงประวัติคะแนน',
      error: error.message
    });
  }
});

// ========================================
// ADMIN ENDPOINTS
// ========================================

/**
 * GET /api/behavior-scores/reports/history
 * รายงานประวัติการบันทึกคะแนน (สำหรับ admin)
 * Query params: classRoom, studentId, search, startDate, endDate
 */
router.get('/reports/history', verifyToken, isAdmin, async (req, res) => {
  try {
    const { classRoom, studentId, search, startDate, endDate } = req.query;

    // Build where clause
    let whereClause = {
      isDeleted: false
    };

    // Filter by date range
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        try {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0); // วันเริ่มต้น
          whereClause.createdAt.gte = start;
        } catch (e) {
          console.error('Invalid startDate:', startDate);
        }
      }
      if (endDate) {
        try {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999); // วันสิ้นสุด
          whereClause.createdAt.lte = end;
        } catch (e) {
          console.error('Invalid endDate:', endDate);
        }
      }
    }

    // Filter by student ID (exact match)
    if (studentId) {
      whereClause.studentId = parseInt(studentId);
    }

    // ดึงข้อมูล
    const records = await prisma.studentbehaviorscores.findMany({
      where: whereClause,
      include: {
        students: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            namePrefix: true,
            homeroomClass: { select: { className: true } },
            studentNumber: true
          }
        },
        users_studentbehaviorscores_recorderIdTousers: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Filter by classRoom and search
    let filteredRecords = records;
    
    // Filter by classroom
    if (classRoom && classRoom !== 'ทั้งหมด') {
      filteredRecords = filteredRecords.filter(r => r.students?.homeroomClass?.className === classRoom);
    }

    // Filter by search (ชื่อนักเรียน หรือ รหัสนักเรียน)
    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      filteredRecords = filteredRecords.filter(r => {
        const fullName = `${r.students?.namePrefix || ''}${r.students?.firstName || ''}${r.students?.lastName ? ' ' + r.students.lastName : ''}`.trim().toLowerCase();
        const studentCode = r.students?.studentNumber?.toString() || '';
        return fullName.includes(searchTerm) || studentCode.includes(searchTerm);
      });
    }

    // Format data with current total
    const formattedRecords = await Promise.all(filteredRecords.map(async (record) => {
      try {
        // Calculate current total for this student
        const allScores = await prisma.studentbehaviorscores.findMany({
          where: {
            studentId: record.studentId,
            isDeleted: false
          },
          select: { score: true }
        });
        const currentTotal = 100 + allScores.reduce((sum, s) => sum + s.score, 0);

        // ดึง audit logs สำหรับบันทึก
        let auditLogs = [];
        try {
          auditLogs = await prisma.audit_logs.findMany({
            where: {
              tableName: 'studentbehaviorscores',
              recordId: record.id,
              action: 'UPDATE'
            },
            include: {
              users: {
                select: {
                  id: true,
                  username: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          });
        } catch (auditError) {
          console.error('Error fetching audit logs:', auditError);
          auditLogs = [];
        }

        // แปลง audit logs เป็นรูปแบบที่ frontend 
        const updateLogs = auditLogs.map(log => {
          let oldValues = {};
          let newValues = {};
          
          try {
            oldValues = log.oldValues ? JSON.parse(log.oldValues) : {};
            newValues = log.newValues ? JSON.parse(log.newValues) : {};
          } catch (e) {
            console.error('Error parsing audit log values:', e);
          }

          return {
            updatedBy: log.users?.username || 'ไม่ระบุ',
            updatedAt: log.createdAt,
            changes: {
              oldScore: oldValues.score || 0,
              newScore: newValues.score || 0,
              oldComments: oldValues.comments || '',
              newComments: newValues.comments || ''
            }
          };
        });

        return {
          id: record.id,
          studentId: record.students?.id,
          studentCode: record.students?.studentNumber?.toString().padStart(5, '0') || '',
          studentName: `${record.students?.namePrefix || ''}${record.students?.firstName || ''}${record.students?.lastName ? ' ' + record.students.lastName : ''}`.trim(),
          classRoom: record.students?.homeroomClass?.className || '',
          score: record.score,
          currentTotal: currentTotal,
          comments: record.comments,
          category: record.score > 0 ? 'เพิ่มคะแนน' : 'หักคะแนน',
          recorderId: record.users_studentbehaviorscores_recorderIdTousers?.id,
          recorderName: record.users_studentbehaviorscores_recorderIdTousers?.username || 'ไม่ระบุ',
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
          updateLogs: updateLogs
        };
      } catch (recordError) {
        console.error('Error formatting record:', recordError);
        return null;
      }
    }));

    // Filter out null records
    const validRecords = formattedRecords.filter(r => r !== null);

    res.json({
      success: true,
      data: validRecords,
      total: validRecords.length
    });

  } catch (error) {
    console.error('Error fetching behavior score reports:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงรายงาน',
      error: error.message
    });
  }
});

/**
 * GET /api/behavior-scores/reports/summary
 * รายงานสรุปคะแนนความประพฤติ
 * Query params: classRoom, search, period (week/month/semester)
 */
router.get('/reports/summary', verifyToken, isAdmin, async (req, res) => {
  try {
    const { classRoom, search, period = 'week', weekDate, monthDate } = req.query;

    // คำนวณ date range ตาม period
    let startDate, endDate;
    const now = new Date();

    if (period === 'semester') {
      // ใช้ภาคเรียนปัจจุบันจากฐานข้อมูล
      const currentSemester = await prisma.semesters.findFirst({
        where: { isCurrent: true, isActive: true }
      });
      if (currentSemester) {
        startDate = new Date(currentSemester.startDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(currentSemester.endDate);
        endDate.setHours(23, 59, 59, 999);
      } else {
        // Fallback: เดือนปัจจุบัน
        startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      }
    } else if (period === 'month') {
      // ใช้เดือนที่ระบุจาก monthDate param (YYYY-MM)
      if (monthDate && /^\d{4}-\d{2}$/.test(monthDate)) {
        const [year, month] = monthDate.split('-').map(Number);
        startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
        endDate = new Date(year, month, 0, 23, 59, 59, 999);
      } else {
        // Fallback: เดือนปัจจุบัน
        startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      }
    } else {
      // week: ใช้ weekDate param (วันใดก็ได้ในสัปดาห์ที่ต้องการ → คำนวณจันทร์-อาทิตย์)
      const d = (weekDate && /^\d{4}-\d{2}-\d{2}$/.test(weekDate)) ? new Date(weekDate) : new Date();
      const day = d.getDay(); // 0=Sun, 1=Mon
      const monday = new Date(d);
      monday.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);
      startDate = monday;
      endDate = sunday;
    }

    // ดึงข้อมูลนักเรียน
    let studentWhere = { isDeleted: false };
    if (classRoom && classRoom !== 'ทั้งหมด') {
      studentWhere.homeroomClass = { className: classRoom };
    }

    const students = await prisma.students.findMany({
      where: studentWhere,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        namePrefix: true,
        studentNumber: true,
        homeroomClass: { select: { className: true } }
      }
    });

    // Filter by search (ชื่อนักเรียน หรือ รหัสนักเรียน)
    let filteredStudents = students;
    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      filteredStudents = students.filter(student => {
        const fullName = `${student.namePrefix || ''}${student.firstName || ''}${student.lastName ? ' ' + student.lastName : ''}`.trim().toLowerCase();
        const studentCode = student.studentNumber?.toString() || '';
        return fullName.includes(searchTerm) || studentCode.includes(searchTerm);
      });
    }

    // คำนวณสถิติแต่ละคน
    const summary = await Promise.all(
      filteredStudents.map(async (student) => {
        // คะแนนรวมทั้งหมด
        const allScores = await prisma.studentbehaviorscores.findMany({
          where: {
            studentId: student.id,
            isDeleted: false
          },
          select: { score: true }
        });

        const totalScore = 100 + allScores.reduce((sum, s) => sum + s.score, 0);

        // คะแนนในช่วงเวลาที่เลือก
        const periodScores = await prisma.studentbehaviorscores.findMany({
          where: {
            studentId: student.id,
            isDeleted: false,
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          select: { score: true }
        });

        const periodAdjustment = periodScores.reduce((sum, s) => sum + s.score, 0);
        const addedPoints = periodScores.filter(s => s.score > 0).reduce((sum, s) => sum + s.score, 0);
        const deductedPoints = Math.abs(periodScores.filter(s => s.score < 0).reduce((sum, s) => sum + s.score, 0));

        return {
          studentId: student.id,
          studentCode: student.studentNumber?.toString().padStart(5, '0') || '',
          studentName: `${student.namePrefix || ''}${student.firstName || ''}${student.lastName ? ' ' + student.lastName : ''}`.trim(),
          classRoom: student.homeroomClass?.className || '',
          currentScore: totalScore,
          periodAdjustment: periodAdjustment,
          addedPoints: addedPoints,
          deductedPoints: deductedPoints,
          recordCount: periodScores.length
        };
      })
    );

    // กรองเฉพาะนักเรียนที่มีการบันทึกคะแนนในช่วงเวลาที่เลือก
    const filteredSummary = summary.filter(s => s.recordCount > 0);

    // สถิติรวม
    const stats = {
      totalStudents: filteredSummary.length,
      averageScore: filteredSummary.length > 0 
        ? (filteredSummary.reduce((sum, s) => sum + s.currentScore, 0) / filteredSummary.length).toFixed(2)
        : 100,
      totalAdded: filteredSummary.reduce((sum, s) => sum + s.addedPoints, 0),
      totalDeducted: filteredSummary.reduce((sum, s) => sum + s.deductedPoints, 0),
      studentsAbove90: filteredSummary.filter(s => s.currentScore >= 90).length,
      studentsBelow70: filteredSummary.filter(s => s.currentScore < 70).length,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      periodLabel: period === 'week'
        ? `สัปดาห์ ${startDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} – ${endDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}`
        : period === 'month'
        ? startDate.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })
        : 'ภาคเรียนปัจจุบัน'
    };

    res.json({
      success: true,
      data: {
        summary: filteredSummary,
        statistics: stats,
        period: period,
        classRoom: classRoom || 'ทั้งหมด'
      }
    });

  } catch (error) {
    console.error('Error fetching summary report:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงรายงานสรุป',
      error: error.message
    });
  }
});

/**
 * PUT /api/behavior-scores/:id
 * แก้ไขคะแนนที่บันทึกไว้ (สำหรับ admin)
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { score, comments, updatedBy } = req.body;

    // ตรวจสอบว่ามีบันทึกนี้อยู่หรือไม่
    const existingRecord = await prisma.studentbehaviorscores.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบบันทึกที่ต้องการแก้ไข'
      });
    }

    // เก็บค่าเก่าสำหรับ audit log
    const oldValues = {
      score: existingRecord.score,
      comments: existingRecord.comments
    };

    const newValues = {
      score: score !== undefined ? score : existingRecord.score,
      comments: comments !== undefined ? comments : existingRecord.comments
    };

    // อัปเดตบันทึก
    const updated = await prisma.studentbehaviorscores.update({
      where: { id: parseInt(id) },
      data: {
        score: newValues.score,
        comments: newValues.comments,
        updatedBy: updatedBy || existingRecord.updatedBy,
        updatedAt: new Date()
      },
      include: {
        students: {
          select: {
            firstName: true,
            lastName: true,
            homeroomClass: { select: { className: true } }
          }
        }
      }
    });

    // บันทึก audit log
    if (updatedBy) {
      try {
        await prisma.audit_logs.create({
          data: {
            userId: updatedBy,
            tableName: 'studentbehaviorscores',
            recordId: parseInt(id),
            action: 'UPDATE',
            oldValues: JSON.stringify(oldValues),
            newValues: JSON.stringify(newValues),
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent')
          }
        });
      } catch (auditError) {
        console.error('Error creating audit log:', auditError);
        // ไม่ให้ error ของ audit log ทำให้การอัปเดตล้มเหลว
      }
    }

    res.json({
      success: true,
      message: 'แก้ไขบันทึกสำเร็จ',
      data: updated
    });

  } catch (error) {
    console.error('Error updating behavior score:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการแก้ไขบันทึก',
      error: error.message
    });
  }
});

/**
 * DELETE /api/behavior-scores/:id
 * ลบบันทึก (soft delete)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { deletedBy } = req.body;

    const deleted = await prisma.studentbehaviorscores.update({
      where: { id: parseInt(id) },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        updatedBy: deletedBy
      }
    });

    try {
      await prisma.audit_logs.create({
        data: {
          userId: deletedBy || req.userId || null,
          tableName: 'studentbehaviorscores',
          recordId: parseInt(id),
          action: 'DELETE',
          oldValues: JSON.stringify({ score: deleted.score, comments: deleted.comments }),
          newValues: null,
          ipAddress: req.ip || req.connection?.remoteAddress || null,
          userAgent: req.get('user-agent') || null
        }
      });
    } catch (auditError) {
      console.error('Error creating audit log:', auditError);
    }

    res.json({
      success: true,
      message: 'ลบบันทึกสำเร็จ',
      data: deleted
    });

  } catch (error) {
    console.error('Error deleting behavior score:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบบันทึก',
      error: error.message
    });
  }
});

module.exports = router;

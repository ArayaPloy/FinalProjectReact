const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ========================================
// TEACHER ENDPOINTS
// ========================================

/**
 * POST /api/behavior-scores
 * บันทึกคะแนนนักเรียน (รองรับ single และ multiple students)
 * Body: {
 *   records: [
 *     { studentId: 1, score: 10, comments: "ช่วยเหลืองาน" }
 *   ],
 *   recorderId: 1 (teacherId)
 * }
 */
router.post('/', async (req, res) => {
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

    // บันทึกทีละรายการ
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
                fullName: true,
                classRoom: true,
                namePrefix: true
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
router.get('/history/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    // ดึงข้อมูลนักเรียน
    const student = await prisma.students.findUnique({
      where: { id: parseInt(studentId) },
      select: {
        id: true,
        fullName: true,
        namePrefix: true,
        classRoom: true,
        studentNumber: true
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
          fullName: `${student.namePrefix || ''}${student.fullName}`,
          classRoom: student.classRoom,
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
router.get('/reports/history', async (req, res) => {
  try {
    const { classRoom, studentId, search, startDate, endDate } = req.query;
    
    console.log('History Query Params:', { classRoom, studentId, search, startDate, endDate });

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
          start.setHours(0, 0, 0, 0); // เริ่มต้นวัน
          whereClause.createdAt.gte = start;
        } catch (e) {
          console.error('Invalid startDate:', startDate);
        }
      }
      if (endDate) {
        try {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999); // สิ้นสุดวัน
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
            fullName: true,
            namePrefix: true,
            classRoom: true,
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

    // Filter by classRoom and search (after include)
    let filteredRecords = records;
    
    // Filter by classroom
    if (classRoom && classRoom !== 'ทั้งหมด') {
      filteredRecords = filteredRecords.filter(r => r.students?.classRoom === classRoom);
    }

    // Filter by search (ชื่อนักเรียน หรือ รหัสนักเรียน)
    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      filteredRecords = filteredRecords.filter(r => {
        const fullName = `${r.students?.namePrefix || ''}${r.students?.fullName || ''}`.toLowerCase();
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

        // ดึง audit logs สำหรับบันทึกนี้
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
                  username: true,
                  fullName: true
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

        // แปลง audit logs เป็นรูปแบบที่ frontend ต้องการ
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
            updatedBy: log.users?.fullName || log.users?.username || 'ไม่ระบุ',
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
          studentName: `${record.students?.namePrefix || ''}${record.students?.fullName || ''}`,
          classRoom: record.students?.classRoom || '',
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
    
    console.log(`Found ${records.length} total records`);
    console.log(`After filtering: ${filteredRecords.length} records`);
    console.log(`After formatting: ${validRecords.length} valid records`);

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
router.get('/reports/summary', async (req, res) => {
  try {
    const { classRoom, search, period = 'week' } = req.query;

    // คำนวณ date range ตาม period
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'semester':
        startDate.setMonth(now.getMonth() - 6);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // ดึงข้อมูลนักเรียน
    let studentWhere = { isDeleted: false };
    if (classRoom && classRoom !== 'ทั้งหมด') {
      studentWhere.classRoom = classRoom;
    }

    const students = await prisma.students.findMany({
      where: studentWhere,
      select: {
        id: true,
        fullName: true,
        namePrefix: true,
        classRoom: true,
        studentNumber: true
      }
    });

    // Filter by search (ชื่อนักเรียน หรือ รหัสนักเรียน)
    let filteredStudents = students;
    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      filteredStudents = students.filter(student => {
        const fullName = `${student.namePrefix || ''}${student.fullName || ''}`.toLowerCase();
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
              lte: now
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
          studentName: `${student.namePrefix || ''}${student.fullName}`,
          classRoom: student.classRoom,
          currentScore: totalScore,
          periodAdjustment: periodAdjustment,
          addedPoints: addedPoints,
          deductedPoints: deductedPoints,
          recordCount: periodScores.length
        };
      })
    );

    // สถิติรวม
    const stats = {
      totalStudents: summary.length,
      averageScore: summary.length > 0 
        ? (summary.reduce((sum, s) => sum + s.currentScore, 0) / summary.length).toFixed(2)
        : 100,
      totalAdded: summary.reduce((sum, s) => sum + s.addedPoints, 0),
      totalDeducted: summary.reduce((sum, s) => sum + s.deductedPoints, 0),
      studentsAbove90: summary.filter(s => s.currentScore >= 90).length,
      studentsBelow70: summary.filter(s => s.currentScore < 70).length
    };

    res.json({
      success: true,
      data: {
        summary: summary,
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

    // อัพเดท
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
            fullName: true,
            classRoom: true
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
        // ไม่ให้ error ของ audit log ทำให้การอัพเดทล้มเหลว
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

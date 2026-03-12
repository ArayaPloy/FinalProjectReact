const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/verifyToken');

const prisma = new PrismaClient();

// Get all attendance statuses
router.get('/attendance-statuses', verifyToken, async (req, res) => {
  try {
    const statuses = await prisma.attendancestatuses.findMany({
      orderBy: {
        id: 'asc'
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
    
    const translatedStatuses = statuses.map(status => ({
      ...status,
      name: translationMap[status.name] || status.name
    }));
    
    res.json({ success: true, data: translatedStatuses });
  } catch (error) {
    console.error('Error fetching attendance statuses:', error);
    res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลสถานะได้' });
  }
});

// Get all unique classrooms
router.get('/students/classrooms', verifyToken, async (req, res) => {
  try {
    const classrooms = await prisma.homeroom_classes.findMany({
      where: { isActive: true },
      select: { className: true },
      orderBy: { className: 'asc' }
    });
    
    const classRoomList = classrooms.map(c => c.className);
    res.json({ success: true, data: classRoomList });
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลห้องเรียนได้' });
  }
});

// Get students by classroom
router.get('/students', verifyToken, async (req, res) => {
  try {
    const { classRoom } = req.query;
    if (!classRoom) {
      return res.status(400).json({ success: false, message: 'กรุณาระบุห้องเรียน' });
    }

    const students = await prisma.students.findMany({
      where: {
        homeroomClass: { className: classRoom },
        isDeleted: false
      },
      orderBy: [
        { studentNumber: 'asc' },
        { firstName: 'asc' }
      ],
      select: {
        id: true,
        studentNumber: true,
        namePrefix: true,
        firstName: true,
        lastName: true,
        homeroomClass: { select: { className: true } },
        genders: true
      }
    });

    const studentsWithFullName = students.map(s => ({
      ...s,
      fullName: `${s.firstName || ''}${s.lastName ? ' ' + s.lastName : ''}`.trim()
    }));

    res.json({ success: true, data: studentsWithFullName });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลนักเรียนได้' });
  }
});

// Get flagpole attendance by date and classroom
router.get('/flagpole-attendance', verifyToken, async (req, res) => {
  try {
    const { date, classRoom } = req.query;
    if (!date || !classRoom) {
      return res.status(400).json({ success: false, message: 'กรุณาระบุวันที่และห้องเรียน' });
    }

    const attendance = await prisma.flagpoleattendance.findMany({
      where: {
        date: new Date(date),
        students: {
          homeroomClass: { className: classRoom },
          isDeleted: false
        }
      },
      include: {
        students: {
          select: {
            id: true,
            studentNumber: true,
            namePrefix: true,
            firstName: true,
            lastName: true,
            homeroomClass: { select: { className: true } }
          }
        },
        attendancestatuses: true,
        semesters: {
          include: {
            academic_years: true
          }
        },
        users_flagpoleattendance_recorderIdTousers: {
          select: {
            username: true,
            teacher_profile: {
              select: { namePrefix: true, firstName: true, lastName: true }
            }
          }
        }
      }
    });

    const formattedAttendance = attendance.map(a => {
      const recorder = a.users_flagpoleattendance_recorderIdTousers;
      let recorderName = null;
      if (recorder) {
        const t = recorder.teacher_profile;
        recorderName = t
          ? `${t.namePrefix || ''}${t.firstName || ''}${t.lastName ? ' ' + t.lastName : ''}`.trim()
          : recorder.username;
      }
      return {
        ...a,
        recorderName,
        students: a.students ? {
          ...a.students,
          fullName: `${a.students.firstName || ''}${a.students.lastName ? ' ' + a.students.lastName : ''}`.trim()
        } : null
      };
    });

    res.json({ success: true, data: formattedAttendance });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลการเช็คชื่อได้' });
  }
});

// Create bulk attendance records
router.post('/flagpole-attendance', verifyToken, async (req, res) => {
  const { date, classRoom, records, semesterId } = req.body;

  if (!date || !classRoom || !records || !Array.isArray(records)) {
    return res.status(400).json({ success: false, message: 'ข้อมูลไม่ถูกต้อง' });
  }

  // ถ้าไม่ได้ส่ง semesterId มา ให้ auto-detect จากวันที่
  let finalSemesterId = semesterId;
  
  if (!finalSemesterId) {
    try {
      const targetDate = new Date(date);
      const semester = await prisma.semesters.findFirst({
        where: {
          startDate: { lte: targetDate },
          endDate: { gte: targetDate },
          isActive: true
        }
      });

      if (semester) {
        finalSemesterId = semester.id;
      }
    } catch (error) {
      console.error('Error detecting semester:', error);
    }
  }

  // ── ดึงข้อมูลเดิมก่อน transaction เพื่อใช้บันทึก audit log ──
  const existingAttendance = await prisma.flagpoleattendance.findMany({
    where: {
      date: new Date(date),
      students: { homeroomClass: { className: classRoom } }
    },
    select: { studentId: true, statusId: true }
  });
  const oldStatusMap = {};
  existingAttendance.forEach(r => { oldStatusMap[r.studentId] = r.statusId; });

  try {
    // Begin transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Delete existing records for this date and class
      await prisma.flagpoleattendance.deleteMany({
        where: {
          date: new Date(date),
          students: {
            homeroomClass: { className: classRoom }
          }
        }
      });

      // Create new records
      const attendance = await Promise.all(
        records.map(record => 
          prisma.flagpoleattendance.create({
            data: {
              date: new Date(date),
              studentId: record.studentId,
              statusId: record.statusId,
              recorderId: req.userId,
              semesterId: finalSemesterId || null
            },
            include: {
              students: true,
              attendancestatuses: true,
              semesters: {
                include: {
                  academic_years: true
                }
              }
            }
          })
        )
      );

      return attendance;
    });

    // ── บันทึก audit log หลัง transaction สำเร็จ ──
    try {
      await prisma.audit_logs.createMany({
        data: result.map(record => ({
          userId: req.userId || null,
          tableName: 'flagpoleattendance',
          recordId: record.id,
          action: oldStatusMap[record.studentId] !== undefined ? 'UPDATE' : 'CREATE',
          oldValues: oldStatusMap[record.studentId] !== undefined
            ? JSON.stringify({ statusId: oldStatusMap[record.studentId] })
            : null,
          newValues: JSON.stringify({ statusId: record.statusId, date, classRoom }),
          ipAddress: req.ip || req.connection?.remoteAddress || null,
          userAgent: req.get('user-agent') || null
        }))
      });
    } catch (auditError) {
      console.error('Error creating audit logs:', auditError);
    }

    res.json({ 
      success: true, 
      data: result,
      message: 'บันทึกการเช็คชื่อเรียบร้อย'
    });
  } catch (error) {
    console.error('Error creating attendance records:', error);
    res.status(500).json({ success: false, message: 'ไม่สามารถบันทึกข้อมูลได้' });
  }
});

// Get attendance statistics (Summary)
router.get('/flagpole-attendance/statistics', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, classRoom } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'กรุณาระบุวันที่เริ่มต้นและสิ้นสุด' });
    }

    const whereCondition = {
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      },
      students: {
        isDeleted: false
      }
    };

    // ถ้าระบุห้องเรียน ให้กรองตามห้อง
    if (classRoom && classRoom !== 'all') {
      whereCondition.students.homeroomClass = { className: classRoom };
    }

    const statistics = await prisma.flagpoleattendance.groupBy({
      by: ['statusId'],
      where: whereCondition,
      _count: {
        statusId: true
      }
    });

    const statuses = await prisma.attendancestatuses.findMany();
    
    // แปลงชื่อสถานะเป็นภาษาไทย
    const translationMap = {
      'present': 'มา',
      'late': 'สาย',
      'sick leave': 'ลาป่วย',
      'personal leave': 'ลากิจ',
      'absent': 'ขาด'
    };
    
    const result = statistics.map(stat => {
      const status = statuses.find(s => s.id === stat.statusId);
      return {
        status: translationMap[status.name] || status.name,
        statusId: status.id,
        count: stat._count.statusId
      };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลสถิติได้' });
  }
});

// Get detailed attendance report (for dashboard charts)
router.get('/flagpole-attendance/report', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, classRoom } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'กรุณาระบุวันที่เริ่มต้นและสิ้นสุด' });
    }

    const whereCondition = {
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      },
      students: {
        isDeleted: false
      }
    };

    // ถ้าระบุห้องเรียน ให้กรองตามห้อง
    if (classRoom && classRoom !== 'all') {
      whereCondition.students.homeroomClass = { className: classRoom };
    }

    // ดึงข้อมูลทั้งหมดพร้อม relation
    const attendanceRecords = await prisma.flagpoleattendance.findMany({
      where: whereCondition,
      include: {
        students: {
          select: {
            id: true,
            studentNumber: true,
            namePrefix: true,
            firstName: true,
            lastName: true,
            homeroomClass: { select: { className: true } }
          }
        },
        attendancestatuses: true,
        users_flagpoleattendance_recorderIdTousers: {
          select: {
            username: true,
            teacher_profile: {
              select: { namePrefix: true, firstName: true, lastName: true }
            }
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { students: { homeroomClass: { className: 'asc' } } },
        { students: { studentNumber: 'asc' } }
      ]
    });

    // แปลงชื่อสถานะเป็นภาษาไทย
    const translationMap = {
      'present': 'มา',
      'late': 'สาย',
      'sick leave': 'ลาป่วย',
      'personal leave': 'ลากิจ',
      'absent': 'ขาด'
    };

    // จัดกรุ๊ปข้อมูลตามวันที่และสถานะ (สำหรับกราฟ)
    const dailyStats = {};
    
    attendanceRecords.forEach(record => {
      const dateStr = record.date.toISOString().split('T')[0];
      const statusName = translationMap[record.attendancestatuses.name] || record.attendancestatuses.name;
      
      if (!dailyStats[dateStr]) {
        dailyStats[dateStr] = {
          date: dateStr,
          มา: 0,
          สาย: 0,
          ลาป่วย: 0,
          ลากิจ: 0,
          ขาด: 0
        };
      }
      
      dailyStats[dateStr][statusName] = (dailyStats[dateStr][statusName] || 0) + 1;
    });

    // แปลงเป็น array และเรียงตามวันที่
    const chartData = Object.values(dailyStats).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    // สรุปรวมทั้งหมด (สำหรับ Pie Chart)
    const totalStats = {
      มา: 0,
      สาย: 0,
      ลาป่วย: 0,
      ลากิจ: 0,
      ขาด: 0
    };

    attendanceRecords.forEach(record => {
      const statusName = translationMap[record.attendancestatuses.name] || record.attendancestatuses.name;
      totalStats[statusName] = (totalStats[statusName] || 0) + 1;
    });

    res.json({ 
      success: true, 
      data: {
        chartData,       // สำหรับกราฟแท่ง
        totalStats,      // สำหรับกราฟวงกลม
        records: attendanceRecords.map(r => {
          const recorder = r.users_flagpoleattendance_recorderIdTousers;
          let recorderName = '-';
          if (recorder) {
            const t = recorder.teacher_profile;
            if (t) {
              recorderName = `${t.namePrefix || ''}${t.firstName || ''}${t.lastName ? ' ' + t.lastName : ''}`.trim();
            } else {
              recorderName = recorder.username;
            }
          }
          return {
            date: r.date.toISOString().split('T')[0],
            recordedAt: r.createdAt ? r.createdAt.toISOString() : null,
            studentNumber: r.students.studentNumber,
            studentName: `${r.students.namePrefix || ''}${r.students.firstName || ''}${r.students.lastName ? ' ' + r.students.lastName : ''}`.trim(),
            classRoom: r.students.homeroomClass?.className || '',
            status: translationMap[r.attendancestatuses.name] || r.attendancestatuses.name,
            recorder: recorderName
          };
        })  // สำหรับตาราง + CSV Export
      }
    });
  } catch (error) {
    console.error('Error fetching attendance report:', error);
    res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลรายงานได้' });
  }
});

// ─── Flagpole Attendance Summary per Student ─────────────────────────────────
// GET /flagpole-attendance/summary?period=week|month|semester&classRoom=...&search=...
router.get('/flagpole-attendance/summary', verifyToken, async (req, res) => {
  try {
    const { period = 'week', classRoom, search } = req.query;

    const translationMap = {
      'present': 'มา',
      'late': 'สาย',
      'sick leave': 'ลาป่วย',
      'personal leave': 'ลากิจ',
      'absent': 'ขาด'
    };

    // ─── Determine date range ────────────────────────────────────────────
    let startDate, endDate;
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (period === 'semester') {
      // Use current active semester dates
      const currentSemester = await prisma.semesters.findFirst({
        where: { isCurrent: true, isActive: true }
      });
      if (currentSemester) {
        startDate = new Date(currentSemester.startDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(currentSemester.endDate);
        endDate.setHours(23, 59, 59, 999);
      } else {
        // Fallback: current month if no active semester
        const now2 = new Date();
        startDate = new Date(now2.getFullYear(), now2.getMonth(), 1, 0, 0, 0, 0);
        endDate = new Date(now2.getFullYear(), now2.getMonth() + 1, 0, 23, 59, 59, 999);
      }
    } else if (period === 'month') {
      // Use specific month from monthDate param (YYYY-MM)
      const monthDate = req.query.monthDate;
      if (monthDate && /^\d{4}-\d{2}$/.test(monthDate)) {
        const [year, month] = monthDate.split('-').map(Number);
        startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
        endDate = new Date(year, month, 0, 23, 59, 59, 999);
      } else {
        // Fallback: current month
        const now2 = new Date();
        startDate = new Date(now2.getFullYear(), now2.getMonth(), 1, 0, 0, 0, 0);
        endDate = new Date(now2.getFullYear(), now2.getMonth() + 1, 0, 23, 59, 59, 999);
      }
    } else {
      // week: use weekDate param (any date in the desired week → compute Mon–Sun)
      const weekDate = req.query.weekDate;
      const d = (weekDate && /^\d{4}-\d{2}-\d{2}$/.test(weekDate)) ? new Date(weekDate) : new Date();
      const day = d.getDay(); // 0=Sun, 1=Mon ... 6=Sat
      const monday = new Date(d);
      monday.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);
      startDate = monday;
      endDate = sunday;
    }

    // ─── Build where condition ───────────────────────────────────────────
    const whereCondition = {
      date: { gte: startDate, lte: endDate },
      students: { isDeleted: false }
    };

    if (classRoom && classRoom !== 'all' && classRoom !== 'ทั้งหมด') {
      whereCondition.students.homeroomClass = { className: classRoom };
    }

    // ─── Fetch all records in range ──────────────────────────────────────
    const records = await prisma.flagpoleattendance.findMany({
      where: whereCondition,
      include: {
        students: {
          select: {
            id: true,
            studentNumber: true,
            namePrefix: true,
            firstName: true,
            lastName: true,
            homeroomClass: { select: { className: true } }
          }
        },
        attendancestatuses: true
      }
    });

    // ─── Aggregate per student ───────────────────────────────────────────
    const studentMap = {};

    records.forEach(r => {
      const s = r.students;
      if (!s) return;

      const key = s.id;
      if (!studentMap[key]) {
        studentMap[key] = {
          studentCode: s.studentNumber,
          studentName: `${s.namePrefix || ''}${s.firstName || ''}${s.lastName ? ' ' + s.lastName : ''}`.trim(),
          classRoom: s.homeroomClass?.className || '',
          มา: 0, สาย: 0, ลาป่วย: 0, ลากิจ: 0, ขาด: 0
        };
      }

      const statusTH = translationMap[r.attendancestatuses.name] || r.attendancestatuses.name;
      if (studentMap[key][statusTH] !== undefined) {
        studentMap[key][statusTH]++;
      }
    });

    // ─── Apply search filter ─────────────────────────────────────────────
    let summaryArray = Object.values(studentMap);

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      summaryArray = summaryArray.filter(st =>
        st.studentCode?.toLowerCase().includes(q) ||
        st.studentName?.toLowerCase().includes(q)
      );
    }

    // ─── Compute totals + attendance rate ────────────────────────────────
    // นับ "มา" และ "สาย" ว่าเข้าแถว  ลาป่วย/ลากิจ/ขาด ถือว่าไม่ได้เข้าแถว
    summaryArray = summaryArray.map(st => {
      const total = st.มา + st.สาย + st.ลาป่วย + st.ลากิจ + st.ขาด;
      const attendanceRate = total > 0 ? (((st.มา + st.สาย) / total) * 100).toFixed(2) : '0.00';
      return { ...st, total, attendanceRate: parseFloat(attendanceRate) };
    });

    // ─── Overall statistics ──────────────────────────────────────────────
    const totalStudents = summaryArray.length;
    const totalPresent = summaryArray.reduce((s, st) => s + st.มา + st.สาย, 0);
    const totalRecords = summaryArray.reduce((s, st) => s + st.total, 0);
    const overallRate = totalRecords > 0 ? ((totalPresent / totalRecords) * 100).toFixed(2) : '0.00';
    const studentsAbove90 = summaryArray.filter(st => st.attendanceRate >= 90).length;
    const studentsBelow70 = summaryArray.filter(st => st.attendanceRate < 70).length;

    res.json({
      success: true,
      data: {
        summary: summaryArray,
        statistics: {
          totalStudents,
          overallAttendanceRate: overallRate,
          studentsAbove90,
          studentsBelow70,
          periodLabel: period === 'week'
            ? `สัปดาห์ ${startDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} – ${endDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}`
            : period === 'month'
            ? startDate.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })
            : 'ภาคเรียนปัจจุบัน',
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        }
      }
    });
  } catch (error) {
    console.error('Error fetching flagpole summary:', error);
    res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลสรุปได้' });
  }
});

module.exports = router;
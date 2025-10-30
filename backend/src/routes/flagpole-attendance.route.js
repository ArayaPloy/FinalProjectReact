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
    const classrooms = await prisma.students.findMany({
      select: {
        classRoom: true
      },
      distinct: ['classRoom'],
      where: {
        isDeleted: false
      },
      orderBy: {
        classRoom: 'asc'
      }
    });
    
    const classRoomList = classrooms.map(c => c.classRoom);
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
        classRoom,
        isDeleted: false
      },
      orderBy: [
        { studentNumber: 'asc' },
        { fullName: 'asc' }
      ],
      select: {
        id: true,
        studentNumber: true,
        namePrefix: true,
        fullName: true,
        classRoom: true,
        genders: true
      }
    });

    res.json({ success: true, data: students });
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
          classRoom,
          isDeleted: false
        }
      },
      include: {
        students: {
          select: {
            id: true,
            studentNumber: true,
            fullName: true,
            classRoom: true
          }
        },
        attendancestatuses: true
      }
    });

    res.json({ success: true, data: attendance });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลการเช็คชื่อได้' });
  }
});

// Create bulk attendance records
router.post('/flagpole-attendance', verifyToken, async (req, res) => {
  const { date, classRoom, records } = req.body;

  if (!date || !classRoom || !records || !Array.isArray(records)) {
    return res.status(400).json({ success: false, message: 'ข้อมูลไม่ถูกต้อง' });
  }

  try {
    // Begin transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Delete existing records for this date and class
      await prisma.flagpoleattendance.deleteMany({
        where: {
          date: new Date(date),
          students: {
            classRoom
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
              recorderId: req.userId
            },
            include: {
              students: true,
              attendancestatuses: true
            }
          })
        )
      );

      return attendance;
    });

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
      whereCondition.students.classRoom = classRoom;
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
      whereCondition.students.classRoom = classRoom;
    }

    // ดึงข้อมูลทั้งหมดพร้อม relation
    const attendanceRecords = await prisma.flagpoleattendance.findMany({
      where: whereCondition,
      include: {
        students: {
          select: {
            id: true,
            studentNumber: true,
            fullName: true,
            classRoom: true
          }
        },
        attendancestatuses: true
      },
      orderBy: [
        { date: 'asc' },
        { students: { classRoom: 'asc' } },
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
        records: attendanceRecords.map(r => ({
          date: r.date.toISOString().split('T')[0],
          studentNumber: r.students.studentNumber,
          studentName: r.students.fullName,
          classRoom: r.students.classRoom,
          status: translationMap[r.attendancestatuses.name] || r.attendancestatuses.name
        }))  // สำหรับตาราง + CSV Export
      }
    });
  } catch (error) {
    console.error('Error fetching attendance report:', error);
    res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลรายงานได้' });
  }
});

module.exports = router;
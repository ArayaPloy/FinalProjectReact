const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const csv = require('csv-parse')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  const csvFilePath = path.join(__dirname, 'student_list_2.csv')
  const fileContent = fs.readFileSync(csvFilePath, 'utf-8').replace(/^\uFEFF/, '')

  // Parse CSV file
  const records = await new Promise((resolve, reject) => {
    csv.parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    }, (err, records) => {
      if (err) reject(err)
      resolve(records)
    })
  })

  console.log(`📋 พบข้อมูลนักเรียนทั้งหมด ${records.length} คน\n`)

  // โหลด classrooms ทั้งหมด เพื่อ map className → id
  const allClassrooms = await prisma.homeroom_classes.findMany({
    select: { id: true, className: true }
  })
  const classroomMap = {}
  for (const c of allClassrooms) {
    classroomMap[c.className] = c.id
  }
  console.log(`🏫 พบห้องเรียนทั้งหมด ${allClassrooms.length} ห้อง\n`)

  let successCount = 0
  let skipCount = 0
  let errorCount = 0

  // Insert students one by one
  for (const record of records) {
    try {
      const studentNumber = parseInt(record.studentNumber)

      // หา homeroomClassId จากชื่อห้อง
      const homeroomClassId = record.classroom ? (classroomMap[record.classroom] || null) : null
      if (record.classroom && !homeroomClassId) {
        console.warn(`⚠️  ไม่พบห้อง "${record.classroom}" สำหรับ ${record.firstName} ${record.lastName}`)
      }

      // ตรวจสอบว่า studentNumber มีอยู่แล้วหรือไม่
      const existingStudent = await prisma.students.findFirst({
        where: {
          studentNumber: studentNumber,
          isDeleted: false
        }
      })

      const fullName = `${record.firstName} ${record.lastName}`.trim()

      if (existingStudent) {
        // อัปเดตข้อมูลรวมถึง homeroomClassId
        await prisma.students.update({
          where: { id: existingStudent.id },
          data: {
            namePrefix: record.namePrefix || null,
            nationality: record.nationality || null,
            homeroomClassId: homeroomClassId,
            updatedAt: new Date()
          }
        })
        console.log(`🔄 อัปเดต: ${fullName} (รหัส ${studentNumber}) ห้อง: ${record.classroom || '-'}`)
        skipCount++
        continue
      }

      const student = await prisma.students.create({
        data: {
          studentNumber: studentNumber,
          namePrefix: record.namePrefix || null,
          firstName: record.firstName,
          lastName: record.lastName,
          genderId: parseInt(record.genderId),
          nationality: record.nationality || null,
          homeroomClassId: homeroomClassId,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      console.log(`✅ เพิ่มสำเร็จ: ${student.firstName} ${student.lastName} (รหัส ${studentNumber})`)
      successCount++
    } catch (error) {
      console.error(`❌ เกิดข้อผิดพลาด ${record.fullName}:`, error.message)
      errorCount++
    }
  }

  console.log('\n📊 สรุปผลการ Import:')
  console.log(`✅ เพิ่มสำเร็จ: ${successCount} คน`)
  console.log(`⏭️  ข้าม (มีอยู่แล้ว): ${skipCount} คน`)
  console.log(`❌ ข้อผิดพลาด: ${errorCount} คน`)
  console.log(`📋 ทั้งหมด: ${records.length} คน`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
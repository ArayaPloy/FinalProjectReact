const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const csv = require('csv-parse')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  const csvFilePath = path.join(__dirname, 'student_list_2.csv')
  const fileContent = fs.readFileSync(csvFilePath, 'utf-8')

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

  let successCount = 0
  let skipCount = 0
  let errorCount = 0

  // Insert students one by one
  for (const record of records) {
    try {
      const studentNumber = parseInt(record.studentNumber)

      // ตรวจสอบว่า studentNumber มีอยู่แล้วหรือไม่
      const existingStudent = await prisma.students.findFirst({
        where: {
          studentNumber: studentNumber,
          isDeleted: false
        }
      })

      if (existingStudent) {
        console.log(`⏭️  ข้าม: ${record.fullName} (รหัส ${studentNumber} มีอยู่แล้ว)`)
        skipCount++
        continue
      }

      const student = await prisma.students.create({
        data: {
          studentNumber: studentNumber,
          namePrefix: record.namePrefix,
          fullName: record.fullName,
          classRoom: record.classroom,
          genderId: parseInt(record.genderId),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      console.log(`✅ เพิ่มสำเร็จ: ${student.fullName} (รหัส ${studentNumber})`)
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
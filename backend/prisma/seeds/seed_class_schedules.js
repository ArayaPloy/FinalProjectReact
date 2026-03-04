const { PrismaClient } = require('@prisma/client')
const csv = require('csv-parse')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Clearing existing class schedules for semesterId=6...')
  const deleted = await prisma.classschedules.deleteMany({ where: { semesterId: 6 } })
  console.log(`   Deleted ${deleted.count} existing records`)

  console.log('📥 Seeding class schedules from class_schedule.csv...')
  const csvPath = path.join(__dirname, 'class_schedule.csv')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')

  const rows = await new Promise((resolve, reject) => {
    csv.parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true
    }, (err, records) => {
      if (err) reject(err)
      else resolve(records)
    })
  })

  let success = 0
  let failed = 0
  for (const row of rows) {
    try {
      const tid = row.teacherId ? parseInt(row.teacherId) : null
      await prisma.classschedules.create({
        data: {
          class:           row.classroom,
          subjectId:       null,
          subjectCodeRaw:  row.subjectCode ? row.subjectCode.trim() : null,
          teacherId:       tid,
          guestTeacherName: (!tid && row.teacherFullName) ? row.teacherFullName.trim() : null,
          dayOfWeekId:     parseInt(row.dayId),
          periodNumber:    parseInt(row.period),
          semesterId:      row.semesterId ? parseInt(row.semesterId) : null,
          createdAt:       new Date(),
          updatedAt:       new Date()
        }
      })
      success++
    } catch (error) {
      console.error(`  ❌ ${row.classroom} day${row.dayId} period${row.period}: ${error.message}`)
      failed++
    }
  }

  console.log(`\n✅ Imported ${success} class schedule records`)
  if (failed > 0) console.log(`⚠️  Failed: ${failed} records`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

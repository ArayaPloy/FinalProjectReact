const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const csv = require('csv-parse')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  const csvFilePath = path.join(__dirname, 'student_list.csv')
  const fileContent = fs.readFileSync(csvFilePath, 'utf-8')

  // Parse CSV file
  const records = await new Promise((resolve, reject) => {
    csv.parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    }, (err, records) => {
      if (err) reject(err)
      resolve(records)
    })
  })

  console.log(`Found ${records.length} students in CSV file`)

  // Insert students one by one
  for (const record of records) {
    try {
      const student = await prisma.students.create({
        data: {
          namePrefix: record.namePrefix,
          fullName: record.fullName,
          classRoom: record.classroom,
          genderId: parseInt(record.genderId),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      console.log(`Created student: ${student.fullName}`)
    } catch (error) {
      console.error(`Error creating student ${record.fullName}:`, error)
    }
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
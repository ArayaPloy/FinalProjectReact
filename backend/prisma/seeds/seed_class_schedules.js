const { PrismaClient } = require('@prisma/client')
const csv = require('csv-parse')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// ── Subject master data ────────────────────────────────────
// departmentId อิงตาม seed.js:
//   2=ภาษาไทย  3=คณิตศาสตร์  4=วิทยาศาสตร์ฯ  5=สังคมศึกษาฯ
//   6=สุขศึกษาฯ  7=ศิลปะ  8=ภาษาต่างประเทศ  null=กิจกรรมพัฒนาผู้เรียน
const SUBJECT_MAP = {
  'ท21102':   { name: 'ภาษาไทยพื้นฐาน',             deptId: 2,  description: 'ศึกษาการอ่าน การเขียน การฟัง และการพูดภาษาไทยอย่างถูกต้อง พร้อมทั้งวิเคราะห์วรรณคดีและการใช้ภาษา' },
  'ท22102':   { name: 'ภาษาไทยพื้นฐาน 2',           deptId: 2,  description: 'ศึกษาการอ่าน การเขียน การฟัง และการพูดภาษาไทยอย่างถูกต้อง พร้อมทั้งวิเคราะห์วรรณคดีและการใช้ภาษาระดับสูง' },
  'ค21102':   { name: 'คณิตศาสตร์พื้นฐาน',          deptId: 3,  description: 'ศึกษาหลักการคำนวณ การแก้ปัญหา และการประยุกต์ใช้คณิตศาสตร์ในชีวิตประจำวัน' },
  'ค21202':   { name: 'คณิตศาสตร์เพิ่มเติม',        deptId: 3,  description: 'ศึกษาคณิตศาสตร์ขั้นสูงเพื่อพัฒนาการคิดวิเคราะห์และการแก้ปัญหา' },
  'ค22102':   { name: 'คณิตศาสตร์พื้นฐาน 2',        deptId: 3,  description: 'ศึกษาหลักการคณิตศาสตร์ขั้นพื้นฐานสำหรับชั้น ม.2 เน้นการแก้ปัญหาและตรรกศาสตร์' },
  'ว21102':   { name: 'วิทยาศาสตร์พื้นฐาน',         deptId: 4,  description: 'ศึกษาหลักการทางวิทยาศาสตร์เกี่ยวกับสิ่งมีชีวิต สาร พลังงาน และปรากฏการณ์ธรรมชาติ' },
  'ว22102':   { name: 'วิทยาศาสตร์กายภาพ',          deptId: 4,  description: 'ศึกษาหลักการทางฟิสิกส์และเคมีเกี่ยวกับแรง พลังงาน และสมบัติของสาร' },
  'ว22104':   { name: 'วิทยาศาสตร์โลกและอวกาศ',     deptId: 4,  description: 'ศึกษาโครงสร้างโลก ระบบสุริยะ และปรากฏการณ์ทางธรรมชาติ' },
  'อ21102':   { name: 'ภาษาอังกฤษพื้นฐาน',          deptId: 8,  description: 'ศึกษาทักษะการฟัง พูด อ่าน และเขียนภาษาอังกฤษเพื่อการสื่อสาร' },
  'อ22102':   { name: 'ภาษาอังกฤษเพื่อการสื่อสาร', deptId: 8,  description: 'พัฒนาทักษะการสื่อสารภาษาอังกฤษในสถานการณ์ต่าง ๆ' },
  'อ22202':   { name: 'ภาษาอังกฤษขั้นสูง',          deptId: 8,  description: 'ฝึกการอ่าน วิเคราะห์ และการสื่อสารภาษาอังกฤษขั้นสูง' },
  'ส21102':   { name: 'หน้าที่พลเมือง',             deptId: 5,  description: 'ศึกษาหน้าที่ของพลเมืองและการอยู่ร่วมกันในสังคม' },
  'ส21103':   { name: 'สังคมศึกษา',                  deptId: 5,  description: 'ศึกษาสังคม วัฒนธรรม เศรษฐกิจ และการเมือง' },
  'ส21104':   { name: 'ประวัติศาสตร์',               deptId: 5,  description: 'ศึกษาเหตุการณ์สำคัญทางประวัติศาสตร์ไทยและโลก' },
  'ส22102':   { name: 'สังคมศึกษา 2',               deptId: 5,  description: 'ศึกษาสังคม วัฒนธรรม เศรษฐกิจ และการเมืองในระดับที่สูงขึ้น' },
  'ส22103':   { name: 'ภูมิศาสตร์',                  deptId: 5,  description: 'ศึกษาภูมิประเทศ ทรัพยากรธรรมชาติ และสิ่งแวดล้อม' },
  'ส22104':   { name: 'เศรษฐศาสตร์เบื้องต้น',       deptId: 5,  description: 'ศึกษาหลักเศรษฐศาสตร์พื้นฐานและการใช้ทรัพยากร' },
  'ส22204':   { name: 'ประวัติศาสตร์ 2',             deptId: 5,  description: 'ศึกษาประวัติศาสตร์ไทยและโลกในเชิงลึก เน้นการวิเคราะห์เหตุและผล' },
  'ส20232':   { name: 'กิจกรรมสังคม ม.1',           deptId: 5,  description: 'กิจกรรมพัฒนาผู้เรียนด้านสังคม คุณธรรม และจิตอาสา สำหรับชั้น ม.1' },
  'ส20234':   { name: 'กิจกรรมสังคม ม.2',           deptId: 5,  description: 'กิจกรรมพัฒนาผู้เรียนด้านสังคม คุณธรรม และจิตอาสา สำหรับชั้น ม.2' },
  'ส20236':   { name: 'กิจกรรมสังคม ม.3',           deptId: 5,  description: 'กิจกรรมพัฒนาผู้เรียนด้านสังคม คุณธรรม และจิตอาสา สำหรับชั้น ม.3' },
  'ศ21102':   { name: 'ศิลปะ',                       deptId: 7,  description: 'ศึกษาการวาดภาพ การออกแบบ และการสร้างสรรค์งานศิลป์' },
  'ศ21103':   { name: 'ดนตรีและนาฏศิลป์',           deptId: 7,  description: 'ศึกษาดนตรี การร้องเพลง และการแสดง' },
  'ศ22102':   { name: 'ศิลปะ 2',                     deptId: 7,  description: 'ฝึกการสร้างสรรค์งานศิลป์ขั้นสูง ทฤษฎีสีและองค์ประกอบศิลป์' },
  'พ21103':   { name: 'สุขศึกษา',                    deptId: 6,  description: 'ศึกษาการดูแลสุขภาพและการป้องกันโรค' },
  'พ21104':   { name: 'พลศึกษา',                     deptId: 6,  description: 'ฝึกทักษะกีฬาและการออกกำลังกายเพื่อสุขภาพ' },
  'พ22102':   { name: 'พลศึกษาขั้นพื้นฐาน',         deptId: 6,  description: 'พัฒนาทักษะกีฬาและสมรรถภาพทางกาย' },
  'พ22104':   { name: 'พลศึกษาและนันทนาการ',        deptId: 6,  description: 'ฝึกกิจกรรมกีฬาและนันทนาการเพื่อสุขภาพ' },
  'ภาษาจีน': { name: 'ภาษาจีนเบื้องต้น',            deptId: 8,  description: 'ศึกษาคำศัพท์ การออกเสียง และการสื่อสารภาษาจีนพื้นฐาน' },
  'ธรรมะ':   { name: 'หลักธรรมในชีวิตประจำวัน',    deptId: 5,  description: 'ศึกษาหลักธรรมทางพระพุทธศาสนาและการนำไปประยุกต์ใช้ในชีวิตประจำวัน' },
  'สส/นน':   { name: 'สร้างเสริมลักษณะนิสัย/การงานพื้นฐานอาชีพ', deptId: null, description: 'สส. (สร้างเสริมลักษณะนิสัย): ปลูกฝังคุณธรรม จริยธรรม ระเบียบวินัย และบุคลิกภาพที่ดี | น.น. (การงานพื้นฐานอาชีพ): ฝึกทักษะการทำงานบ้าน งานฝีมือ และพื้นฐานอาชีพเพื่อการพึ่งพาตนเอง' },
  'PBL':      { name: 'การเรียนรู้แบบโครงงาน',      deptId: null, description: 'การเรียนรู้ผ่านโครงงานเพื่อพัฒนาการคิดวิเคราะห์และการทำงานเป็นทีม' },
  'แนะแนว':  { name: 'แนะแนว',                       deptId: null, description: 'ให้คำแนะนำด้านการเรียน การใช้ชีวิต และการวางแผนอาชีพ' },
  'ชุมนุม':  { name: 'กิจกรรมชุมนุม',               deptId: null, description: 'กิจกรรมเสริมหลักสูตรตามความสนใจของนักเรียน' },
  'เพื่อสังคม': { name: 'กิจกรรมเพื่อสังคม',        deptId: null, description: 'ส่งเสริมกิจกรรมจิตอาสาและการพัฒนาสังคม' },
}

async function main() {
  console.log('🗑️  Clearing existing class schedules for semesterId=6...')
  const deleted = await prisma.classschedules.deleteMany({ where: { semesterId: 6 } })
  console.log(`   Deleted ${deleted.count} existing records`)

  // ── Upsert subjects ──────────────────────────────────────
  console.log('\n📚 Upserting subjects...')
  const subjectIdMap = {} // code → db id
  for (const [code, info] of Object.entries(SUBJECT_MAP)) {
    const subject = await prisma.subjects.upsert({
      where: { codeSubject: code },
      update: { name: info.name, description: info.description, departmentId: info.deptId },
      create: { codeSubject: code, name: info.name, description: info.description, departmentId: info.deptId },
    })
    subjectIdMap[code] = subject.id
  }
  console.log(`   Upserted ${Object.keys(subjectIdMap).length} subjects`)

  // ── Import schedule rows from CSV ────────────────────────
  console.log('\n📥 Seeding class schedules from class_schedule.csv...')
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
      const code = row.subjectCode ? row.subjectCode.trim() : null
      await prisma.classschedules.create({
        data: {
          class:            row.classroom,
          subjectId:        code ? (subjectIdMap[code] ?? null) : null,
          subjectCodeRaw:   code,
          teacherId:        tid,
          guestTeacherName: (!tid && row.teacherFullName) ? row.teacherFullName.trim() : null,
          dayOfWeekId:      parseInt(row.dayId),
          periodNumber:     parseInt(row.period),
          semesterId:       row.semesterId ? parseInt(row.semesterId) : null,
          room:             row.room ? row.room.trim() : null,
          building:         row.building ? row.building.trim() : null,
          createdAt:        new Date(),
          updatedAt:        new Date()
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


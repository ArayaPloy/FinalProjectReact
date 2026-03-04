const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const csv = require('csv-parse')
const path = require('path')
const prisma = new PrismaClient()

async function main() {
  // Blog Categories
  await prisma.$executeRawUnsafe(`
    INSERT INTO blog_categories (id, name, slug, description, icon, sortOrder, createdAt, updatedAt) VALUES
(1, 'ข่าวประชาสัมพันธ์', 'news-announcement', 'ข่าวประกาศและประชาสัมพันธ์ทั่วไป', '📢', 1, NOW(), NOW()),
(2, 'กิจกรรมโรงเรียน', 'school-activities', 'กิจกรรมต่างๆ ภายในโรงเรียน', '🎉', 2, NOW(), NOW()),
(3, 'กิจกรรมเข้าค่ายลูกเสือ', 'scout-camp', 'กิจกรรมค่ายลูกเสือและเนตรนารี', '⛺', 3, NOW(), NOW()),
(4, 'กิจกรรมอาสาพัฒนา', 'volunteer-work', 'กิจกรรมอาสาสมัครและพัฒนาชุมชน', '🤝', 4, NOW(), NOW()),
(5, 'ผลงานนักเรียน', 'student-achievements', 'ผลงานและรางวัลของนักเรียน', '🏆', 5, NOW(), NOW()),
(6, 'ข่าวการศึกษา', 'education-news', 'ข่าวสารด้านการศึกษา', '📚', 6, NOW(), NOW()),
(7, 'สมทบทุนการศึกษา', 'education-fund', 'การระดมทุนและบริจาคเพื่อการศึกษา', '💰', 7, NOW(), NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);
  `);

  // Club Categories
  await prisma.$executeRawUnsafe(`
    INSERT INTO club_categories (id, name, slug, description, icon, sortOrder, relatedDepartmentId, createdAt, updatedAt) VALUES
(1, 'ศิลปะและดนตรี', 'arts-music', 'ชุมนุมด้านศิลปะ ดนตรี และการแสดง', '🎨', 1, NULL, NOW(), NOW()),
(2, 'วิทยาศาสตร์และเทคโนโลยี', 'science-tech', 'ชุมนุมด้านวิทยาศาสตร์ คณิตศาสตร์ และเทคโนโลยี', '🔬', 2, NULL, NOW(), NOW()),
(3, 'กีฬาและนันทนาการ', 'sports-recreation', 'ชุมนุมด้านกีฬาและกิจกรรมนันทนาการ', '⚽', 3, NULL, NOW(), NOW()),
(4, 'ภาษาและวัฒนธรรม', 'language-culture', 'ชุมนุมด้านภาษาต่างประเทศและวัฒนธรรม', '🌏', 4, NULL, NOW(), NOW()),
(5, 'การงานและอาชีพ', 'vocational', 'ชุมนุมด้านการงานอาชีพและทักษะชีวิต', '🔨', 5, NULL, NOW(), NOW()),
(6, 'รักษาดินแดนและลูกเสือ', 'military-scout', 'ชุมนุมรด. ลูกเสือ เนตรนารี และกิจกรรมพิเศษ', '🎖️', 6, NULL, NOW(), NOW()),
(7, 'ชุมนุมพิเศษ', 'special-clubs', 'ชุมนุมกิจกรรมพิเศษอื่นๆ', '⭐', 7, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);
  `);

  // Attendance Statuses
  await prisma.$executeRawUnsafe(`
    INSERT INTO attendancestatuses (id, name, createdAt, updatedAt, isDeleted, deletedAt, updatedBy) VALUES
(1, 'มา', '2025-08-04 19:40:49', '2025-08-04 19:40:49', 0, NULL, NULL),
(2, 'ขาด', '2025-08-04 19:40:49', '2025-08-04 19:40:49', 0, NULL, NULL),
(3, 'สาย', '2025-08-04 19:40:49', '2025-08-04 19:40:49', 0, NULL, NULL),
(4, 'ลาป่วย', '2025-08-04 19:40:49', '2025-08-04 19:40:49', 0, NULL, NULL),
(5, 'ลากิจ', '2025-08-04 19:40:49', '2025-08-04 19:40:49', 0, NULL, NULL)
ON DUPLICATE KEY UPDATE name=VALUES(name);

  `);

  // Academic Years and Semesters
  console.log('Seeding Academic Years and Semesters...');
  
  await prisma.$executeRawUnsafe(`
    INSERT INTO academic_years (id, year, startDate, endDate, isCurrent, isActive, createdAt, updatedAt, createdBy, updatedBy) VALUES
(1, '2566', '2023-05-16', '2024-05-15', 0, 1, NOW(), NOW(), NULL, NULL),
(2, '2567', '2024-05-16', '2025-05-15', 0, 1, NOW(), NOW(), NULL, NULL),
(3, '2568', '2025-05-16', '2026-05-15', 1, 1, NOW(), NOW(), NULL, NULL)
ON DUPLICATE KEY UPDATE 
  year=VALUES(year),
  startDate=VALUES(startDate),
  endDate=VALUES(endDate),
  isCurrent=VALUES(isCurrent),
  isActive=VALUES(isActive);
  `);

  await prisma.$executeRawUnsafe(`
    INSERT INTO semesters (id, academicYearId, semesterNumber, startDate, endDate, isCurrent, isActive, createdAt, updatedAt, createdBy, updatedBy) VALUES
-- ปีการศึกษา 2566
(1, 1, 1, '2023-05-16', '2023-10-15', 0, 1, NOW(), NOW(), NULL, NULL),
(2, 1, 2, '2023-10-16', '2024-05-15', 0, 1, NOW(), NOW(), NULL, NULL),

-- ปีการศึกษา 2567 (ปัจจุบัน)
(3, 2, 1, '2024-05-16', '2024-10-15', 0, 1, NOW(), NOW(), NULL, NULL),
(4, 2, 2, '2024-10-16', '2025-05-15', 0, 1, NOW(), NOW(), NULL, NULL),

-- ปีการศึกษา 2568 (อนาคต)
(5, 3, 1, '2025-05-16', '2025-10-15', 0, 1, NOW(), NOW(), NULL, NULL),
(6, 3, 2, '2025-10-16', '2026-05-15', 1, 1, NOW(), NOW(), NULL, NULL)
ON DUPLICATE KEY UPDATE 
  semesterNumber=VALUES(semesterNumber),
  startDate=VALUES(startDate),
  endDate=VALUES(endDate),
  isCurrent=VALUES(isCurrent),
  isActive=VALUES(isActive);
  `);

  // Days of Week
  await prisma.$executeRawUnsafe(`
    INSERT INTO daysofweek (id, name, createdAt, updatedAt, deletedAt) VALUES
(1, 'จันทร์', '2025-08-04 19:41:08', '2025-08-04 19:41:08', NULL),
(2, 'อังคาร', '2025-08-04 19:41:08', '2025-08-04 19:41:08', NULL),
(3, 'พุธ', '2025-08-04 19:41:08', '2025-08-04 19:41:08', NULL),
(4, 'พฤหัสบดี', '2025-08-04 19:41:08', '2025-08-04 19:41:08', NULL),
(5, 'ศุกร์', '2025-08-04 19:41:08', '2025-08-04 19:41:08', NULL)
ON DUPLICATE KEY UPDATE name=VALUES(name);

  `);

  // Departments
  await prisma.$executeRawUnsafe(`
    INSERT INTO departments (id, name, headTeacherId, createdAt, updatedAt, deletedAt) VALUES
(1, 'ฝ่ายบริหาร', NULL, '2025-08-15 12:14:18', '2025-08-15 12:14:18', NULL),
(2, 'กลุ่มสาระการเรียนรู้ภาษาไทย', NULL, '2025-08-15 13:03:40', '2025-08-15 13:03:40', NULL),
(3, 'กลุ่มสาระการเรียนรู้คณิตศาสตร์', NULL, '2025-08-15 13:03:40', '2025-08-15 13:03:40', NULL),
(4, 'กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี', NULL, '2025-08-15 13:03:40', '2025-08-15 13:03:40', NULL),
(5, 'กลุ่มสาระการเรียนรู้สังคมศึกษาฯ', NULL, '2025-08-15 13:03:40', '2025-08-15 13:03:40', NULL),
(6, 'กลุ่มสาระการเรียนรู้สุขศึกษาฯ', NULL, '2025-08-15 13:03:40', '2025-08-15 13:03:40', NULL),
(7, 'กลุ่มสาระการเรียนรู้ศิลปะ', NULL, '2025-08-15 13:03:40', '2025-08-15 13:03:40', NULL),
(8, 'กลุ่มสาระการเรียนรู้ภาษาต่างประเทศ', NULL, '2025-08-15 13:03:40', '2025-08-15 13:03:40', NULL),
(9, 'ธุรการโรงเรียน', NULL, '2025-08-15 13:03:40', '2025-08-15 13:03:40', NULL),
(10, 'นักการภารโรง', NULL, '2025-08-27 18:46:00', '2025-08-27 18:46:00', NULL)
ON DUPLICATE KEY UPDATE name=VALUES(name);

  `);

  // Genders
  await prisma.$executeRawUnsafe(`
    INSERT INTO genders (id, genderName, createdAt, updatedAt, deletedAt) VALUES
(1, 'male', '2025-08-04 19:41:25', '2025-08-04 19:41:25', NULL),
(2, 'female', '2025-08-04 19:41:25', '2025-08-04 19:41:25', NULL),
(3, 'other', '2025-08-04 19:41:25', '2025-08-04 19:41:25', NULL)
ON DUPLICATE KEY UPDATE genderName=VALUES(genderName);

  `);

  // School Info
  await prisma.$executeRawUnsafe(`
    INSERT INTO school_info (id, name, location, foundedDate, currentDirector, education_level, department, description, heroImage, director_image, director_quote, createdAt, updatedAt, createdBy, updatedBy) VALUES
(1, 'โรงเรียนท่าบ่อพิทยาคม', 'บ้านป่าสัก ตำบลกองนาง อำเภอท่าบ่อ จังหวัดหนองคาย', '14 พฤษภาคม 2534', 'นายชำนาญวิทย์ ประเสริฐ', 'มัธยมศึกษาปีที่ 1-3', 'สำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 21', 'โรงเรียนท่าบ่อพิทยาคม เป็นโรงเรียนมัธยมศึกษาประจำตำบลกองนาง สังกัดสำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 21 เปิดทำการเรียนการสอนครั้งแรกเป็นโรงเรียนสาขาของโรงเรียนท่าบ่อ เริ่มเปิดเรียนเมื่อวันที่ 14 พฤษภาคม 2534  โดยมีนายประพันธ์  พรหมกูล  เป็นผู้ดูแล  โดยขอใช้อาคารเรียนของโรงเรียนบ้านหงส์ทองสามขา เป็นสถานที่เรียนชั่วคราว และมีนักเรียน ทั้งหมด 86 คน จำนวน  2  ห้องเรียน\nต่อมาได้ย้ายมาอยู่  ณ บริเวณที่สาธารณประโยชน์ หมู่ 9 บ้านป่าสัก ตำบลกองนาง อำเภอท่าบ่อ จังหวัดหนองคาย และที่ดินบริจาค จากคุณยายแก่นคำ  มั่งมูล, คุณแม่สุบิน น้อยโสภา  และคุณพ่อสุพล  น้อยโสภา  จำนวน 4.5  ไร่ รวมจำนวนที่ดินทั้งสิ้นประมาณ 65 ไร่ โดยได้รับงบประมาณในการสร้างอาคารจากกรมสามัญศึกษา  กระทรวงศึกษาธิการ  \nเมื่อวันที่ 26 กุมภาพันธ์ 2535 ได้รับประกาศจัดตั้งเป็นเอกเทศ  โดยใช้ชื่อว่า “โรงเรียนท่าบ่อพิทยาคม” กรมสามัญศึกษาได้แต่งตั้งให้ นายศิริ  เพชรคีรี ผู้ช่วยผู้อำนวยการโรงเรียนท่าบ่อ  อ.ท่าบ่อ  จ.หนองคาย มารักษาการในตำแหน่งครูใหญ่ ในปีงบประมาณ 2545  ได้รับจัดสรรงบประมาณจากกรมสามัญศึกษา ให้จัดสร้างอาคารเรียนแบบกึ่งถาวร  1  หลัง และโรงอาหารมาตรฐาน 300 ที่นั่ง  1  หลัง ในวันที่ 7 กรกฎาคม 2546 โรงเรียนท่าบ่อพิทยาคมเปลี่ยนมาสังกัดสำนักงานเขตพื้นที่การศึกษาหนองคาย เขต 1  สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน กระทรวงศึกษาธิการ ตามพระราชบัญญัติระเบียบบริหารราชการกระทรวงศึกษาธิการ พ.ศ.2546 และในวันที่ 23  กรกฎาคม  2553  \nโรงเรียนท่าบ่อพิทยาคม  เปลี่ยนมาสังกัด สำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 21  ตาม พ.ร.บ.การศึกษาแห่งชาติ (ฉบับที่ 3) พ.ร.บ.ระเบียบบริหารราชการกระทรวงศึกษาธิการ (ฉบับที่ 3) และ พ.ร.บ.ระเบียบข้าราชการครูและบุคลากรทางการศึกษา (ฉบับที่ 3) ซึ่งได้มีการประกาศในราชกิจจานุเบกษา เมื่อวันที่  22 กรกฎาคม 2553 และมีผลบังคับใช้ ตั้งแต่วันที่ 23 กรกฎาคม 2553  ปัจจุบันมี นายชำนาญวิทย์ ประเสริฐ เป็นผู้อำนวยการโรงเรียน', 'frontend\\src\\assets\\images\\10.jpg', 'http://www.thabopit.com/_files_school/43100510/person/43100510_0_20241104-160235.jpg', 'โรงเรียนท่าบ่อพิทยาคมมุ่งมั่นพัฒนาผู้เรียนให้มีความรู้คู่คุณธรรม มีทักษะที่จำเป็นในศตวรรษที่ 21 และเป็นพลเมืองที่ดีของสังคม', '2025-08-07 09:05:18', '2025-09-18 02:10:28', 0, 13);

  `);

  // School Timeline
  await prisma.$executeRawUnsafe(`
    INSERT INTO school_timeline (id, year, date, title, description, sortOrder, createdAt, updatedAt, createdBy, updatedBy, deletedBy) VALUES
(1, '2534', '1991-05-14', 'เปิดทำการเรียนการสอนเป็นครั้งแรก', 'เปิดทำการเรียนการสอนครั้งแรกเป็นโรงเรียนสาขาของโรงเรียนท่าบ่อ โดยมีนายประพันธ์ พรหมกูล เป็นผู้ดูแล ใช้อาคารเรียนของโรงเรียนบ้านหงส์ทองสามขาเป็นสถานที่เรียนชั่วคราว มีนักเรียนทั้งหมด 86 คน แบ่งเป็น 2 ห้องเรียน', 1, '2025-08-07 09:05:18', '2025-09-18 03:07:57', 0, 13, 0),
(2, '2535', '2025-09-17', 'จัดตั้งเป็นเอกเทศ', 'โรงเรียนได้รับประกาศจัดตั้งเป็นเอกเทศ โดยใช้ชื่อว่า โรงเรียนท่าบ่อพิทยาคม และกรมสามัญศึกษาได้แต่งตั้งให้นายศิริ เพชรคีรี ผู้ช่วยผู้อำนวยการโรงเรียนท่าบ่อ มารักษาการในตำแหน่งครูใหญ่', 2, '2025-08-07 09:05:18', '2025-09-18 03:05:11', 0, 13, 0),
(3, '2545', '2002-01-01', 'ก่อสร้างอาคารเรียน', 'โรงเรียนได้รับจัดสรรงบประมาณจากกรมสามัญศึกษาเพื่อสร้างอาคารเรียนแบบกึ่งถาวร 1 หลัง และโรงอาหารมาตรฐาน 300 ที่นั่ง 1 หลัง', 3, '2025-08-07 09:05:18', '2025-08-07 09:05:18', 0, 0, 0),
(4, '2546', '2003-04-04', 'เปลี่ยนสังกัด', 'โรงเรียนท่าบ่อพิทยาคมเปลี่ยนมาสังกัดสำนักงานเขตพื้นที่การศึกษาหนองคาย เขต 1 ตามพระราชบัญญัติระเบียบบริหารราชการกระทรวงศึกษาธิการ พ.ศ. 2546', 4, '2025-08-07 09:05:18', '2025-08-27 10:49:56', 0, 13, 0),
(5, '2553', '2010-05-15', 'สังกัดเขตพื้นที่การศึกษามัธยมศึกษา', 'โรงเรียนท่าบ่อพิทยาคมเปลี่ยนมาสังกัดสำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 21 ตามพระราชบัญญัติการศึกษาแห่งชาติ (ฉบับที่ 3) และพระราชบัญญัติระเบียบบริหารราชการกระทรวงศึกษาธิการ (ฉบับที่ 3)', 5, '2025-08-07 09:05:18', '2025-08-07 09:05:18', 0, 0, 0),
(6, '2568', '2025-04-17', 'การพัฒนาอย่างต่อเนื่อง', 'ปัจจุบัน โรงเรียนท่าบ่อพิทยาคมมีนายชำนาญวิทย์ ประเสริฐ ดำรงตำแหน่งผู้อำนวยการโรงเรียน และมีการพัฒนาอย่างต่อเนื่องเพื่อมุ่งสู่ความเป็นเลิศทางวิชาการ', 6, '2025-08-07 09:05:18', '2025-08-07 09:05:18', 0, 0, 0);
  `);

  // Super Admin
  //   await prisma.$executeRawUnsafe(`
  //     INSERT INTO superadmin (id, userId, namePrefix, fullName, genderId, phoneNumber, createdAt, updatedAt, isDeleted, deletedAt) VALUES
  // (1, 1, 'นางสาว', 'อารยา หงษาวงษ์', 2, '0123456789', '2025-08-04 19:47:41', '2025-08-04 19:47:41', 0, NULL);

  //   `);

  // Teachers
  await prisma.$executeRawUnsafe(`
        INSERT INTO teachers (departmentId, namePrefix, firstName, lastName, genderId, dob, nationality, position, level, phoneNumber, createdAt, updatedAt, isDeleted, deletedAt, updatedBy, imagePath, email, address, education, major, biography, specializations) VALUES
    (1, 'นาย', 'ชำนาญวิทย์', 'ประเสริฐ', 1, NULL, 'ไทย', 'ผู้อำนวยการ', 'คศ. 3', '0642466644', '2025-08-27 18:29:44', '2025-08-27 18:29:44', 0, NULL, NULL, '/images/teachers/admin1.jpg', 'Chumnanwit1@gmail.com', '', 'ปริญญาโท', '', '', ''),
    (1, 'นาง', 'พิชญา', 'สุวงศ์', 2, '1972-01-13', 'ไทย', 'รองผู้อำนวยการ', 'คศ. 3', '0872153025', '2025-08-27 18:39:13', '2025-08-27 18:39:13', 0, NULL, NULL, '/images/teachers/admin2.jpg', 'pitchaya2@gmail.com', '277 ต.พานพร้าว อ.ศรีเชียงใหม่ จ.หนองคาย', 'ปริญญาโท', 'คณะมนุษยศาสตร์ เอกภาษาไทย มหาวิทยาลัยพิษณุโลก', '', ''),
    (2, 'นาง', 'อามร', 'คำเสมอ', 2, '1976-04-19', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0882653492', '2025-08-27 18:48:51', '2025-08-27 18:48:51', 0, NULL, NULL, '/images/teachers/thai1.jpg', 'amon3@gmail.com', '', 'ปริญญาโท', 'คณะมนุษยศาสตร์ เอกภาษาไทย', '', ''),
    (2, 'นาง', 'พรศิริ', 'พิมพ์พา', 2, '1985-06-14', 'ไทย', 'ครูชำนาญการพิเศษ', 'คศ. 3', '0645385853', '2025-08-27 19:00:00', '2025-08-27 19:00:00', 0, NULL, NULL, '/images/teachers/thai2.jpg', 'pornsiri4@gmail.com', '', 'ปริญญาตรี', 'คณะมนุษยศาสตร์ เอกภาษาไทย', '', ''),
    (3, 'นาง', 'เกษร', 'ผาสุข', 2, '1987-07-24', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0665432587', '2025-08-27 19:02:31', '2025-08-27 19:02:31', 0, NULL, NULL, '/images/teachers/math1.jpg', 'kesorn5@gmail.com', '', 'ปริญญาโท', 'เอกวิทยาศาสตร์', '', ''),
    (3, 'นาย', 'ณัฐวุฒิ', 'เจริญกุล', 1, '1978-10-22', 'ไทย', 'ครู', 'คศ. 3', '0982653456', '2025-08-27 19:06:12', '2025-08-27 19:06:12', 0, NULL, NULL, '/images/teachers/math2.jpg', 'Nutthawut6@gmail.com', '', 'ปริญญาตรี', '', '', ''),
    (4, 'นางสาว', 'วิไลลักษณ์', 'อ่างแก้ว', 2, '1987-02-27', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0923685489', '2025-08-27 19:09:17', '2025-08-27 19:09:17', 0, NULL, NULL, '/images/teachers/science1.jpg', 'wilailak7@gmail.com', 'ต.กองนาง อ.ท่าบ่อ จ.หนองคาย', 'ปริญญาตรี', '', '', ''),
    (4, 'นางสาว', 'สุรางคณา', 'เหลืองกิจไพบูลย์', 2, NULL, 'ไทย', 'ครู', 'คศ. 1', '0654657895', '2025-08-27 19:11:32', '2025-08-27 19:11:32', 0, NULL, NULL, '/images/teachers/science2.jpg', 'surangkana8@gmail.com', '', 'ปริญญาโท', 'คณะวิทยาศาสตร์ สาขาเทคโนโลยีสารสนเทศ มหาวิทยาลัยขอนแก่น', '', ''),
    (4, 'นางสาว', 'ศรัณยา', 'ดลรัศมี', 2, NULL, 'ไทย', 'ครูผู้ช่วย', NULL, '0889684532', '2025-08-27 19:14:28', '2025-08-27 19:14:28', 0, NULL, NULL, '/images/teachers/science3.jpg', 'sarunya9@gmail.com', '', 'ปริญญาตรี', '', '', ''),
    (4, 'นางสาว', 'จีรนันท์', 'พรหมพิภักดิ์', 2, NULL, 'ไทย', 'พนักงานราชการ', NULL, '0975264855', '2025-08-27 19:18:10', '2025-08-27 19:18:10', 0, NULL, NULL, '/images/teachers/science4.jpg', 'jeeranan10@gmail.com', '', 'ปริญญาตรี', '', '', ''),
    (5, 'นางสาว', 'ศิริกัญญา', 'กาอุปมุง', 2, NULL, 'ไทย', 'หัวหน้ากลุ่มสาระ', 'ครูผู้ช่วย', '0932458765', '2025-08-27 19:27:40', '2025-08-27 19:27:40', 0, NULL, NULL, '/images/teachers/social1.jpg', 'silikanya11@gmail.com', '', 'ปริญญาตรี', '', '', ''),
    (5, 'นางสาว', 'กมลชนก', 'รีวงษา', 2, NULL, 'ไทย', 'ครูอัตราจ้าง', '', '0654678475', '2025-08-27 19:32:37', '2025-08-27 19:32:37', 0, NULL, NULL, '/images/teachers/social2.jpg', 'kamonchanok12@gmail.com', 'ต.กองนาง อ.ท่าบ่อ จ.หนองคาย', 'ปริญญาตรี', 'คณะมนุษยศาตร์ สาขาวิชาสังคมศาสตร์', '', ''),
    (6, 'นาย', 'ทวีศักดิ์', 'มณีรัตน์', 1, '1984-05-23', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0852468592', '2025-08-27 19:39:05', '2025-08-27 19:39:05', 0, NULL, NULL, '/images/teachers/health1.jpg', 'taweesak18@gmail.com', '', 'ปริญญาตรี', '', '', ''),
    (7, 'นาย', 'ศุภชัย', 'โคตรชมภู', 1, '1988-04-23', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0875364854', '2025-08-27 19:41:59', '2025-08-27 19:41:59', 0, NULL, NULL, '/images/teachers/art1.jpg', 'suphachai13@gmail.com', '', 'ปริญญาตรี', '', '', ''),
    (8, 'นาง', 'อุบล', 'แสงโสดา', 2, '1979-08-25', 'ไทย', 'ครู', 'คศ. 3', '0653425859', '2025-08-27 19:44:40', '2025-08-27 19:44:40', 0, NULL, NULL, '/images/teachers/foreign1.jpg', 'ubon14@gmail.com', '', 'ปริญญาตรี', 'คณะมนุษศาสตร์ สาขาวิชาภาษาอังกฤษ', '', ''),
    (8, 'นาง', 'วราภรณ์', 'แสงแก้ว', 2, NULL, 'ไทย', 'พนักงานราชการ', 'คศ. 3', '0854325869', '2025-08-27 19:47:01', '2025-08-27 19:47:01', 0, NULL, NULL, '/images/teachers/foreign2.jpg', 'waraporn15@gmail.com', '', 'ปริญญาตรี', 'คณะมนุษยศาสตร์ เอกวิชาภาษาอังกฤษ', '', ''),
    (9, 'นาย', 'ธีรพงษ์', 'หมอยาเก่า', 1, NULL, 'ไทย', 'พนักงานราชการ', NULL, '0963568745', '2025-08-27 19:50:12', '2025-08-27 19:50:12', 0, NULL, NULL, '/images/teachers/support1.jpg', 'theeraphong16@gmail.com', '', 'ปริญญาตรี', '', '', ''),
    (10, 'นาย', 'ลาญู', 'น้อยโสภา', 1, NULL, 'ไทย', 'พนักงานราชการ', NULL, NULL, '2025-08-27 19:50:12', '2025-08-27 19:50:12', 0, NULL, NULL, '/images/teachers/support2.jpg', 'larn17@gmail.com', '', '', '', '', '');

      `);

  // User Roles
  await prisma.$executeRawUnsafe(`
    INSERT INTO userroles (id, roleName, createdAt, updatedAt, deletedAt) VALUES
(1, 'super_admin', '2025-08-04 19:41:46', '2025-08-04 19:41:46', NULL),
(2, 'admin', '2025-08-04 19:41:46', '2025-08-04 19:41:46', NULL),
(3, 'teacher', '2025-08-04 19:41:46', '2025-08-04 19:41:46', NULL),
(4, 'user', '2025-08-04 19:41:46', '2025-08-04 19:41:46', NULL);
  `);

  await prisma.$executeRawUnsafe(`
    INSERT INTO users (id, username, email, password, roleId, createdAt, updatedAt, isDeleted, deletedAt, updatedBy) VALUES
    (1, 'admin', 'admin@admin.com', '$2b$10$ALgBU8FhrldmP9puwln8a.myb4KBdAQXrwNwI2STEnVPfpbCA9zA6', 1, '2025-10-28 12:22:13', '2025-10-28 12:22:13', 0, NULL, NULL);
`);

  // Additional Users
  await prisma.$executeRawUnsafe(`
    INSERT INTO users (id, username, email, password, roleId, createdAt, updatedAt, isDeleted, deletedAt, updatedBy) VALUES
(2, 'admin1', 'admin1@admin.com', '$2b$10$UgEpibtV9td3fQ4nYR.db.IJdMWy69v4khxa1FUXsfF8CI.G9vHDO', 2, '2025-11-02 22:39:08', '2025-11-02 22:39:08', 0, NULL, NULL),
(3, 'admin2', 'admin2@admin.com', '$2b$10$SaQ7gIcyQUpg8WQYgCjgW.b9N1iUJ6PJQ1RgTEKKZMD9IRJ9jYG7q', 2, '2025-11-02 22:41:06', '2025-11-02 22:41:06', 0, NULL, NULL),
(4, 'admin3', 'admin3@admin.com', '$2b$10$XDEJPJpT4LzNDO7ejxT.eeUGw5x2Cw1l6FjK0ntYuS4SvES3QWUUC', 2, '2025-11-02 22:41:42', '2025-11-02 22:41:42', 0, NULL, NULL),
(5, 'Chumnanwit1', 'Chumnanwit1@gmail.com', '$2b$10$Yn1L3gdHNJlM/pwZlrHVY.r4DXqj72uDWSsSPXzWkJTpxKDH7vp.y', 2, '2025-11-02 22:42:59', '2025-11-02 22:45:10', 0, NULL, NULL),
(6, 'pitchaya2', 'pitchaya2@gmail.com', '$2b$10$eiEPOk7x7vf32jiemcQGZuRtWXp1Br9U1DmTAn4LpLOgc3qVGthlC', 2, '2025-11-02 22:43:26', '2025-11-02 22:45:15', 0, NULL, NULL),
(7, 'amon3', 'amon3@gmail.com', '$2b$10$iAr6qGc8zt5kpvCO/hTduu.hX/Gr0d13GgG.gRrW53UOX1dWMLzgq', 3, '2025-11-02 22:43:51', '2025-11-02 22:45:19', 0, NULL, NULL),
(8, 'pornsiri4', 'pornsiri4@gmail.com', '$2b$10$4sKmmYvmgoX8ROJJEbEeUuJ3icyCAv.yjE/78DxG6sWYoZA9IPdPK', 3, '2025-11-02 22:44:09', '2025-11-02 22:45:22', 0, NULL, NULL),
(9, 'kesorn5', 'kesorn5@gmail.com', '$2b$10$jXy1p7dEs3EU7MgiNSweKOebbQTIm9O.Zy1avpTdpCdTSMUbrlcMa', 3, '2025-11-02 22:44:27', '2025-11-02 22:45:25', 0, NULL, NULL),
(10, 'Nutthawut6', 'Nutthawut6@gmail.com', '$2b$10$QgJ5USJQhliOX4kP1KbE/Oep3vd61WUXN/bFeSoulDEus3QuvfFRG', 3, '2025-11-02 22:45:57', '2025-11-03 08:32:33', 0, NULL, NULL),
(11, 'wilailak7', 'wilailak7@gmail.com', '$2b$10$gHvMOSOTf4nm5nfT0o0Reug0tS9o7VaQ8Wwy/xNcXLe9VhbSGVvI2', 3, '2025-11-02 22:46:27', '2025-11-03 08:32:37', 0, NULL, NULL),
(12, 'surangkana8', 'surangkana8@gmail.com', '$2b$10$lbBwVPCEuaitnLsuJeI0POVojTn0yE15gE1omCtlXy6FyzRflOlG2', 3, '2025-11-02 22:46:46', '2025-11-03 08:32:40', 0, NULL, NULL)
    ON DUPLICATE KEY UPDATE email=VALUES(email);
  `);

  console.log('✅ Imported 11 additional users from existing database');


  // Academic Clubs
  await prisma.$executeRawUnsafe(`
    INSERT INTO academicclubs (id, name, categoryId, description, teacherId, maxMembers, category, icon, registrationDeadline, isActive, meetingDay, meetingTime, location, requirements, createdAt, updatedAt, deletedAt, updatedBy) VALUES
(1, 'ชุมนุมวิทยาศาสตร์', 2, 'ชุมนุมส่งเสริมการเรียนรู้ด้านวิทยาศาสตร์และการทดลอง', 8, 30, 'วิทยาศาสตร์และเทคโนโลยี', '🔬', '2025-06-01', 1, 'พุธ', '15:30-17:00', 'ห้องปฏิบัติการวิทยาศาสตร์', 'สนใจด้านวิทยาศาสตร์', NOW(), NOW(), NULL, NULL),
(2, 'ชุมนุมดนตรีไทย', 1, 'ชุมนุมอนุรักษ์และส่งเสริมดนตรีไทย', 14, 25, 'ศิลปะและดนตรี', '🎵', '2025-06-01', 1, 'พฤหัสบดี', '15:30-17:00', 'ห้องดนตรี', 'รักดนตรีไทย', NOW(), NOW(), NULL, NULL),
(3, 'ชุมนุมภาษาอังกฤษ', 4, 'พัฒนาทักษะภาษาอังกฤษผ่านกิจกรรมสนุกสนาน', 15, 35, 'ภาษาและวัฒนธรรม', '🌍', '2025-06-01', 1, 'อังคาร', '15:30-17:00', 'ห้อง English Club', 'สนใจภาษาอังกฤษ', NOW(), NOW(), NULL, NULL)
    ON DUPLICATE KEY UPDATE name=VALUES(name);
  `);

  console.log('✅ Seeded 3 academic clubs');

  // Home Visits
  await prisma.$executeRawUnsafe(`
    INSERT INTO homevisits (id, teacherId, studentId, updatedBy, visitDate, teacherName, studentIdNumber, studentName, studentBirthDate, className, parentName, relationship, occupation, monthlyIncome, familyStatus, mainAddress, phoneNumber, emergencyContact, houseType, houseMaterial, utilities, environmentCondition, studyArea, visitPurpose, studentBehaviorAtHome, parentCooperation, problems, recommendations, followUpPlan, summary, notes, imagePath, imageGallery, createdAt, updatedAt, isDeleted, deletedAt) VALUES
(1, NULL, NULL, 1, '2025-11-01 00:00:00', 'นาง อามร คำเสมอ', '10001', 'เกรียงศักดิ์ ยะสุนทร', '2012-03-15 00:00:00', 'มัธยม 1/1', 'มานี สุขใจ', 'มารดา', 'ขายของ', '10,001-15,000', '"บิดามารดาอยู่ด้วยกัน"', '145 ม.2 ซ.3', '097 309 97', '0635489658', '"บ้านตัวเอง"', '"ไม้, สังกะสี"', '"ไฟฟ้า, ประปา, โทรศัพท์, อินเทอร์เน็ต, ก๊าซ"', 'ใกล้ถนนใหญ่', 'ใช้โต๊ะร่วมกับครอบครัว', '"ติดตามพฤติกรรม, สร้างความสัมพันธ์"', 'มีความรับผิดชอบ', 'ดี', 'บ้านนักเรียนไม่มี wi-fi', 'ให้ใช้ wi-fi สาธารณะไปก่อน', 'จะมีการเยี่ยมบ้านครั้งที่ 2', 'ดีมาก', '-', '/uploads/homevisits/homevisit-1762020270211-845439599-3png.png', '["/uploads/homevisits/homevisit-1762020270211-845439599-3png.png"]', '2025-11-01 18:04:30', '2025-11-01 18:04:30', 0, NULL),
(2, NULL, NULL, 1, '2025-11-01 00:00:00', 'นางสาว วิไลลักษณ์ อ่างแก้ว', '10002', 'จิรายุทธ เวทไธสง', '2013-06-11 00:00:00', 'ม.1/1', 'ทองดี มาเสม', 'ย่า', 'ขายของ', NULL, NULL, '145 ม.7 ซ.8', NULL, NULL, '"บ้านเดี่ยว"', NULL, NULL, NULL, NULL, '"ติดตามผลการเรียน"', NULL, NULL, NULL, 'ให้นักเรียนหมั่นดูแลผู้ปกครอง', NULL, 'สภาพครอบครัวไม่ดีนัก คุณย่ามีโรคประจำตัว', NULL, '/uploads/homevisits/homevisit-1762022325737-247842494-2jpg.jpg', '["/uploads/homevisits/homevisit-1762022325737-247842494-2jpg.jpg","/uploads/homevisits/homevisit-1762022325738-584836703-1jpg.jpg"]', '2025-11-01 18:38:45', '2025-11-01 18:38:45', 0, NULL),
(3, 8, NULL, 1, '2025-11-01 00:00:00', 'นางสาว สุรางคณา เหลืองกิจไพบูลย์', '10003', 'เด็กชาย จีรภัทร วงษ์บุญจันทร์', '2013-06-04 00:00:00', 'ม.1/1', 'มาลี จันทอง', 'มารดา', 'ขายอาหาร', '10,000 - 20,000 บาท', '"พ่อแม่อยู่ด้วยกัน"', '123 ม.7', '0648975869', '0658975864', '"บ้านเดี่ยว"', '"ไม้"', '"ไฟฟ้า"', 'เงียบ', 'มี (เหมาะสม)', '"พูดคุยทั่วไป"', 'เชื่อฟัง', 'ดี', 'ไม่มี', 'ไม่มี', 'ไม่มี', 'ดีมาก', 'ไม่มี', '/uploads/homevisits/homevisit-1762026945936-754767947-Group7Posterjpg.jpg', '["/uploads/homevisits/homevisit-1762026945936-754767947-Group7Posterjpg.jpg","/uploads/homevisits/homevisit-1762026945943-990441610-2jpg.jpg"]', '2025-11-01 19:55:45', '2025-11-01 19:55:45', 0, NULL),
(4, 9, NULL, 1, '2025-11-02 00:00:00', 'นางสาว ศรัณยา ดลรัศมี', '10001', 'เด็กชาย เกรียงศักดิ์ ยะสุนทร', '2013-07-18 00:00:00', 'ม.1/1', 'มา สีนวล', 'น้า', 'ค้าขาย', '10,000 - 20,000 บาท', '", อยู่กับญาติ"', '123', '0689758698', '0659878967', '"บ้านเดี่ยว"', '", ผสม"', '", ไฟฟ้า, ประปา, โทรศัพท์, ก๊าซ"', 'เงียบ', 'ใช้โต๊ะร่วมกับครอบครัว', '", ติดตามพฤติกรรม, สร้างความสัมพันธ์, ให้คำแนะนำ"', 'ช่วยงานบ้าน', 'ดี', 'ไม่มี', 'ไม่มี', 'ไม่มี', 'ดี', 'ไม่มี', '/uploads/homevisits/homevisit-1762027817636-92371245-2jpg.jpg', '["/uploads/homevisits/homevisit-1762027817636-92371245-2jpg.jpg","/uploads/homevisits/homevisit-1762027817637-701136631-Antoniajpg.jpg"]', '2025-11-01 20:10:17', '2025-11-01 20:10:17', 0, NULL),
(5, 11, NULL, 1, '2025-11-01 00:00:00', 'นางสาว ศิริกัญญา กาอุปมุง', '10001', 'เด็กชาย เกรียงศักดิ์ ยะสุนทร', '2025-11-02 00:00:00', 'ม.1/1', 'มาสร สี', 'ป้า', 'ค้าขาย', '10,000 - 20,000 บาท', '", บิดามารดาอยู่ด้วยกัน"', '123', '0698756895', '0698758975', '"บ้านเดี่ยว"', '", คอนกรีต, ไม้, ผสม"', '", ประปา, ก๊าซ, อินเทอร์เน็ต, ไฟฟ้า"', 'สงบ', 'มีโต๊ะเรียนส่วนตัว', '", สร้างความสัมพันธ์"', '1', '2', '3', '1', '1', '1', '1', '/uploads/homevisits/homevisit-1762028427804-999763174-005jpg.jpg', '["/uploads/homevisits/homevisit-1762028427804-999763174-005jpg.jpg"]', '2025-11-01 20:20:27', '2025-11-01 20:20:27', 0, NULL),
(6, 9, NULL, 1, '2025-10-24 00:00:00', 'นางสาว ศรัณยา ดลรัศมี', '100001', 'เด็กชาย เกรียงศักดิ์ ยะสุนทร', '2025-11-28 00:00:00', 'ม.1/1', 'สี ใจดี', 'ย่า', 'ค้าขาย', 'ต่ำกว่า 10,000 บาท', '", อยู่กับญาติ, มารดาเสียชีวิตแล้ว"', '123', '0958469857', '0689874589', '"บ้านเดี่ยว"', '", ผสม, สังกะสี"', '", ไฟฟ้า, ประปา, ก๊าซ"', 'สงบ', 'ใช้โต๊ะร่วมกับครอบครัว', '", ติดตามพฤติกรรมนักเรียน, สร้างความสัมพันธ์กับผู้ปกครอง, ให้คำแนะนำ"', '1', '3', '3', '4', '5', '1', '8', '/uploads/homevisits/homevisit-1762029810002-231162822-2jpg.jpg', '["/uploads/homevisits/homevisit-1762029810002-231162822-2jpg.jpg"]', '2025-11-01 20:43:30', '2025-11-01 20:43:30', 0, NULL),
(7, 9, NULL, 1, '2025-11-02 00:00:00', 'นางสาว ศรัณยา ดลรัศมี', '100001', 'อำพร มร', '2025-11-02 00:00:00', 'ม.2/1', 'มา สยวย', 'ป้า', '1', '30,001 - 50,000 บาท', '", บิดามารดาอยู่ด้วยกัน"', '123', '0254896666', '0986987588', '"บ้านเดี่ยว"', '", คอนกรีต, ผสม"', '", ไฟฟ้า, ประปา"', '2', 'มีโต๊ะเรียนส่วนตัว', '", สร้างความสัมพันธ์กับผู้ปกครอง"', '1', '2', '3', '6', '9', '6', '5', '/uploads/homevisits/homevisit-1762029993326-10783002-b78f3c90253a11ea96b9fb57831f8879originaljpg.jpg', '["/uploads/homevisits/homevisit-1762029993326-10783002-b78f3c90253a11ea96b9fb57831f8879originaljpg.jpg"]', '2025-11-01 20:46:33', '2025-11-01 20:46:33', 0, NULL),
(8, 3, NULL, 1, '2026-01-08 00:00:00', 'นาง อามร คำเสมอ', '10008', 'เด็กชาย นราธิป ปากมงคล', '2014-09-15 00:00:00', 'ม.1/1', 'นาง พิสมัย สินกำ', 'มารดา', 'ค้าขาย', '20,001 - 30,000 บาท', '", บิดามารดาอยู่ด้วยกัน"', '654/2 ม.8 บ้านไผ่', '0825489678', '0825489678', '"บ้านเดี่ยว"', '", คอนกรีต, ไม้"', '", ไฟฟ้า, ประปา, โทรศัพท์, ทีวี, ก๊าซ"', 'เงียบสงบ', 'ไม่มีโต๊ะเรียน', '", ติดตามพฤติกรรมนักเรียน, แก้ไขปัญหาของนักเรียน"', 'ช่วยงานบ้านพ่อแม่ แต่ติดเล่นโทรศัพท์', 'ดูแลลูกอย่างดี', 'ตามใจลูกมากเกินไป ครอบครัวมีปัญหาส่วนตัว', 'แนะนำนักเรียนให้ใช้เวลาอยู่กับครอบครัวบ่อยๆ มากกว่าการเล่นโทรศัพท์', NULL, 'ครอบครัวสบายดี ไม่มีปัญหาการเงิน', NULL, '/uploads/homevisits/homevisit-1767825606236-715325881-jpg.jpg', '["/uploads/homevisits/homevisit-1767825606236-715325881-jpg.jpg"]', '2026-01-07 22:40:06', '2026-01-07 22:40:06', 0, NULL)
    ON DUPLICATE KEY UPDATE teacherName=VALUES(teacherName);
  `);

  console.log('✅ Imported users, blogs, comments, academic clubs, and home visits from existing database');

  const csvFilePath = path.join(__dirname, 'student_list_2.csv')
  const fileContent = fs.readFileSync(csvFilePath, 'utf-8')

  // Parse CSV file
  const records = await new Promise((resolve, reject) => {
    csv.parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true
    }, (err, records) => {
      if (err) reject(err)
      resolve(records)
    })
  })

  // console.log(`Found ${records.length} students in CSV file`)

  // Insert students one by one
  for (const record of records) {
    try {
      const student = await prisma.students.create({
        data: {
          namePrefix: record.namePrefix,
          firstName: record.firstName,
          lastName: record.lastName,
          classRoom: record.classroom,
          genderId: parseInt(record.genderId),
          studentNumber: parseInt(record.studentNumber),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      // console.log(`Created student: ${student.firstName} ${student.lastName}`)
    } catch (error) {
      console.error(`Error creating student ${record.firstName} ${record.lastName}:`, error)
    }
  }

  console.log('✅ seed.js complete. Run seed_class_schedules.js separately to seed class schedules.')
}

// Run the seed function
main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
    try {
        console.log('🔍 ตรวจสอบข้อมูลพื้นฐานในระบบ...\n');
        console.log('='.repeat(50));

        // Check Users
        const users = await prisma.users.findMany({
            where: { isDeleted: false },
            include: { userroles: true }
        });
        console.log(`\n👤 Users: ${users.length} accounts`);
        users.forEach(u => {
            console.log(`   - ${u.email} (${u.userroles.roleName})`);
        });

        // Check Teachers
        const teachers = await prisma.teachers.findMany({
            where: { isDeleted: false },
            include: { departments_teachers_departmentIdTodepartments: true }
        });
        console.log(`\n👨‍🏫 Teachers: ${teachers.length} คน`);
        teachers.slice(0, 5).forEach(t => {
            console.log(`   - ${t.namePrefix} ${t.fullName} (${t.departments_teachers_departmentIdTodepartments?.name || 'ไม่ระบุ'})`);
        });
        if (teachers.length > 5) console.log(`   ... และอีก ${teachers.length - 5} คน`);

        // Check Students
        const students = await prisma.students.findMany({
            where: { isDeleted: false }
        });
        console.log(`\n🎓 Students: ${students.length} คน`);
        students.slice(0, 5).forEach(s => {
            console.log(`   - ${s.namePrefix} ${s.fullName} (${s.classRoom || 'ไม่ระบุห้อง'})`);
        });
        if (students.length > 5) console.log(`   ... และอีก ${students.length - 5} คน`);

        // Check Academic Clubs
        const clubs = await prisma.academicclubs.findMany({
            include: { teachers: true }
        });
        console.log(`\n🏆 Academic Clubs: ${clubs.length} ชุมนุม`);
        clubs.forEach(c => {
            console.log(`   - ${c.name} (${c.maxMembers} ที่นั่ง) - ครูที่ปรึกษา: ${c.teachers?.fullName || 'ไม่ระบุ'}`);
        });

        // Check Home Visits
        const homevisits = await prisma.homevisits.findMany({
            where: { isDeleted: false }
        });
        console.log(`\n🏠 Home Visits: ${homevisits.length} รายการ`);
        homevisits.forEach(h => {
            console.log(`   - ${h.teacherName} เยี่ยม ${h.studentName} (${new Date(h.visitDate).toLocaleDateString('th-TH')})`);
        });

        // Check Blogs
        const blogs = await prisma.blogs.findMany({
            where: { isDeleted: false }
        });
        console.log(`\n📝 Blogs: ${blogs.length} posts`);
        if (blogs.length > 0) {
            blogs.forEach(b => {
                console.log(`   - ${b.title}`);
            });
        } else {
            console.log('   (ไม่มี blogs - พร้อมสำหรับการสร้างใหม่)');
        }

        // Check Blog Categories
        const blogCategories = await prisma.blog_categories.findMany();
        console.log(`\n📚 Blog Categories: ${blogCategories.length} หมวดหมู่`);

        // Check Club Categories
        const clubCategories = await prisma.club_categories.findMany();
        console.log(`\n🎯 Club Categories: ${clubCategories.length} หมวดหมู่`);

        // Check Departments
        const departments = await prisma.departments.findMany();
        console.log(`\n🏢 Departments: ${departments.length} แผนก`);

        // Check Genders
        const genders = await prisma.genders.findMany();
        console.log(`\n⚧ Genders: ${genders.length} ตัวเลือก`);

        // Check Academic Years
        const academicYears = await prisma.academic_years.findMany();
        const currentYear = academicYears.find(y => y.isCurrent);
        console.log(`\n📅 Academic Years: ${academicYears.length} ปีการศึกษา`);
        if (currentYear) {
            console.log(`   ปีปัจจุบัน: ${currentYear.year}`);
        }

        // Check Semesters
        const semesters = await prisma.semesters.findMany();
        const currentSemester = semesters.find(s => s.isCurrent);
        console.log(`\n📆 Semesters: ${semesters.length} ภาคเรียน`);
        if (currentSemester) {
            console.log(`   ภาคปัจจุบัน: ภาคที่ ${currentSemester.semesterNumber}`);
        }

        console.log('\n' + '='.repeat(50));
        console.log('✅ ตรวจสอบข้อมูลเสร็จสิ้น!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();

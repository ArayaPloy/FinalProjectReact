/**
 * ============================================
 * Blog Categories Checker & Seeder
 * ============================================
 * ไฟล์นี้ใช้สำหรับ:
 * 1. ตรวจสอบหมวดหมู่บทความในระบบ
 * 2. เพิ่มหมวดหมู่เริ่มต้นถ้ายังไม่มี
 * 3. แสดงรายการหมวดหมู่ทั้งหมด
 * 
 * วิธีใช้:
 *   node backend/check-categories.js
 * ============================================
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAndSeedCategories() {
    try {
        console.log('🔍 ตรวจสอบหมวดหมู่ในระบบ...\n');

        // ตรวจสอบหมวดหมู่ที่มีอยู่
        const existingCategories = await prisma.blog_categories.findMany({
            where: { isDeleted: false }
        });

        console.log(`📊 พบหมวดหมู่: ${existingCategories.length} หมวดหมู่`);

        if (existingCategories.length > 0) {
            console.log('\n✅ หมวดหมู่ที่มีอยู่:');
            existingCategories.forEach((cat, index) => {
                console.log(`${index + 1}. ${cat.icon || ''} ${cat.name} (ID: ${cat.id})`);
            });
        } else {
            console.log('\n⚠️  ไม่พบหมวดหมู่! กำลังเพิ่มหมวดหมู่เริ่มต้น...\n');

            // สร้างหมวดหมู่เริ่มต้น
            const defaultCategories = [
                { name: 'ข่าวสาร', slug: 'news', icon: '📰', description: 'ข่าวสารและกิจกรรมต่างๆ', sortOrder: 1 },
                { name: 'กิจกรรม', slug: 'activities', icon: '🎉', description: 'กิจกรรมและโครงการของโรงเรียน', sortOrder: 2 },
                { name: 'การศึกษา', slug: 'education', icon: '📚', description: 'เนื้อหาด้านการศึกษา', sortOrder: 3 },
                { name: 'กีฬา', slug: 'sports', icon: '⚽', description: 'กีฬาและการแข่งขัน', sortOrder: 4 },
                { name: 'ศิลปะ-วัฒนธรรม', slug: 'arts-culture', icon: '🎭', description: 'ศิลปะและวัฒนธรรม', sortOrder: 5 },
                { name: 'ทั่วไป', slug: 'general', icon: '📝', description: 'บทความทั่วไป', sortOrder: 6 }
            ];

            for (const category of defaultCategories) {
                await prisma.blog_categories.create({
                    data: {
                        ...category,
                        isDeleted: false,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                });
                console.log(`✅ เพิ่ม: ${category.icon} ${category.name}`);
            }

            console.log('\n🎉 เพิ่มหมวดหมู่เริ่มต้นเรียบร้อยแล้ว!\n');

            // แสดงหมวดหมู่ที่เพิ่มแล้ว
            const newCategories = await prisma.blog_categories.findMany({
                where: { isDeleted: false },
                orderBy: { sortOrder: 'asc' }
            });

            console.log('📋 หมวดหมู่ทั้งหมด:');
            newCategories.forEach((cat, index) => {
                console.log(`${index + 1}. ${cat.icon} ${cat.name} (ID: ${cat.id}) - ${cat.slug}`);
            });
        }

    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาด:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
        console.log('\n✅ เสร็จสิ้น!');
    }
}

checkAndSeedCategories();

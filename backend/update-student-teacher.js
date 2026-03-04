const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateStudent() {
  try {
    // Check current student data
    const before = await prisma.students.findUnique({
      where: { id: 307 },
      select: {
        id: true,
        studentNumber: true,
        firstName: true,
        lastName: true,
        homeroomTeacherId: true
      }
    });
    
    console.log('\n=== Before Update ===');
    console.log(JSON.stringify(before, null, 2));
    
    // Update student with homeroom teacher
    const updated = await prisma.students.update({
      where: { id: 307 },
      data: {
        homeroomTeacherId: 5
      },
      select: {
        id: true,
        studentNumber: true,
        firstName: true,
        lastName: true,
        homeroomTeacherId: true,
        homeroomTeacher: {
          select: {
            id: true,
            namePrefix: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    console.log('\n=== After Update ===');
    console.log(JSON.stringify(updated, null, 2));
    console.log('\n✅ Student updated successfully!\n');
    
    await prisma.$disconnect();
  } catch(e) {
    console.error('Error:', e.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

updateStudent();

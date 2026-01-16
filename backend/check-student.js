const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkStudent() {
    try {
        // Get first student
        const student = await prisma.students.findFirst();
        
        if (student) {
            console.log('Sample student data:');
            console.log(JSON.stringify(student, null, 2));
            
            console.log('\n\nColumn names:');
            console.log(Object.keys(student).join(', '));
        } else {
            console.log('No students found');
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkStudent();

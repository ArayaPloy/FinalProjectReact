const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function testUser() {
    try {
        const user = await prisma.users.findUnique({
            where: { email: 'admin@admin.com' },
            include: { userroles: true }
        });
        
        if (!user) {
            console.log('❌ User NOT found');
            return;
        }
        
        console.log('✅ User found');
        console.log('Email:', user.email);
        console.log('Username:', user.username);
        console.log('Role:', user.userroles?.roleName);
        console.log('Password hash:', user.password.substring(0, 20) + '...');
        
        // Test password
        const isMatch = await bcrypt.compare('12345678', user.password);
        console.log('Password match:', isMatch ? '✅ YES' : '❌ NO');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

testUser();

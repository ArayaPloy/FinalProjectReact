// โจทย์ 

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const students = await prisma.students.findMany({
        where: { isDeleted: false },
        include: {
            homeroomClass: { select: { className: true } },
            studentbehaviorscores: { where: { isDeleted: false }, select: { score: true } }
        }
    });

    const studentScores = students.map(s => {
        const classRoom = s.homeroomClass?.className || 'ไม่ระบุ';

        const totalScore = 100 + s.studentbehaviorscores.reduce((sum, item) => sum + item.score,0);

        return {
            studentCode: s.studentNumber?.toString().padStart(5, '0') || 'ไม่ระบุ',
            studentName: `${s.namePrefix}${s.firstName} ${s.lastName}`,
            classRoom,
            score: totalScore
        }
    })

    console.log(result);

}
main().finally(() => prisma.$disconnect());
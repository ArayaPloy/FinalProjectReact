const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.$queryRawUnsafe("DESCRIBE teachers")
  .then(r => { r.forEach(c => console.log(c.Field, c.Type)); })
  .finally(() => p.$disconnect());

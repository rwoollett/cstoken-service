import { PrismaClient } from "@prisma/client";

(async () => {
  const prismaTest = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_TEST_URL
      }
    }
  });
  await prismaTest.$executeRaw`
  TRUNCATE TABLE "RequestParent" RESTART IDENTITY CASCADE;
  `;
  prismaTest.$disconnect();

})();

export { };
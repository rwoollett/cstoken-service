import { PrismaClient } from "@prisma/client";

(async () => {
  const prismaTest = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_TEST_URL
      }
    }
  });
  await prismaTest.$executeRaw`TRUNCATE TABLE "Post" RESTART IDENTITY;`;
  await prismaTest.blogComment.deleteMany();
  prismaTest.$disconnect();

})();
  
export {};
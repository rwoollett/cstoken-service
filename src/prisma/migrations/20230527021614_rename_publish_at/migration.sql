/*
  Warnings:

  - You are about to drop the column `publishAt` on the `blogComments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blogComments" DROP COLUMN "publishAt",
ADD COLUMN     "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

/*
  Warnings:

  - Added the required column `categorySlug` to the `blogArticles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blogArticles" ADD COLUMN     "categorySlug" TEXT NOT NULL;

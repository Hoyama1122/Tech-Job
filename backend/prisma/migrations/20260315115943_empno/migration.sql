/*
  Warnings:

  - Made the column `empno` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "empno" SET NOT NULL,
ALTER COLUMN "empno" SET DATA TYPE TEXT;

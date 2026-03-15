/*
  Warnings:

  - A unique constraint covering the columns `[empno]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "empno" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_empno_key" ON "User"("empno");

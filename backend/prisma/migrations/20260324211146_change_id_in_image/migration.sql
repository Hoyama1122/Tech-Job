/*
  Warnings:

  - The primary key for the `JobImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `JobImage` table. All the data in the column will be lost.
  - The primary key for the `JobReport` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `JobReport` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReportImage" DROP CONSTRAINT "ReportImage_reportId_fkey";

-- AlterTable
ALTER TABLE "JobImage" DROP CONSTRAINT "JobImage_pkey",
DROP COLUMN "Id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "JobImage_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "JobReport" DROP CONSTRAINT "JobReport_pkey",
DROP COLUMN "Id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "JobReport_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "ReportImage" ADD CONSTRAINT "ReportImage_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "JobReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

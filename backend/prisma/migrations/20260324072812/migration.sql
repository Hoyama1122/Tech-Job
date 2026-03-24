/*
  Warnings:

  - Added the required column `assignedToId` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "Jobimage" TEXT,
ADD COLUMN     "assignedToId" INTEGER NOT NULL,
ADD COLUMN     "createdById" INTEGER NOT NULL,
ADD COLUMN     "end_available_at" TIMESTAMP(3),
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "location_name" TEXT,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "start_available_at" TIMESTAMP(3),
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "JobReport" (
    "Id" SERIAL NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'COMPLETED',
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "detail" TEXT,
    "repair_operations" TEXT,
    "inspection_results" TEXT,
    "summary" TEXT,
    "images" TEXT,
    "cus_sign" TEXT,
    "jobId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobReport_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobReport" ADD CONSTRAINT "JobReport_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

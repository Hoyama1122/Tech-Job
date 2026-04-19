-- CreateEnum
CREATE TYPE "ReportImageType" AS ENUM ('BEFORE', 'AFTER');

-- AlterTable
ALTER TABLE "ReportImage" ADD COLUMN     "type" "ReportImageType" NOT NULL DEFAULT 'BEFORE';

-- AlterTable
ALTER TABLE "ReportImage" ADD COLUMN     "publicId" TEXT,
ALTER COLUMN "url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ItemUsage" ADD COLUMN     "reportId" INTEGER;

-- AddForeignKey
ALTER TABLE "ItemUsage" ADD CONSTRAINT "ItemUsage_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "JobReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "JobReport" ADD COLUMN     "createdById" INTEGER;

-- AddForeignKey
ALTER TABLE "JobReport" ADD CONSTRAINT "JobReport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

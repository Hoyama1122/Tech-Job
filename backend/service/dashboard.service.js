import { JobStatus } from "../generated/prisma/index.js";
import { prisma } from "../lib/prisma.js";

export async function getJobStats() {
  const counts = await prisma.job.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const map = Object.fromEntries(
    counts.map((c) => [c.status, c._count.status])
  );

  return {
    "รอการตรวจสอบ": map[JobStatus.SUBMITTED] ?? 0,
    "รอการดำเนินงาน": map[JobStatus.PENDING] ?? 0,
    "กำลังทำงาน": map[JobStatus.IN_PROGRESS] ?? 0,
    "สำเร็จ": (map[JobStatus.APPROVED] ?? 0) + (map[JobStatus.COMPLETED] ?? 0),
    "ตีกลับ": map[JobStatus.REJECTED] ?? 0,
  };
}
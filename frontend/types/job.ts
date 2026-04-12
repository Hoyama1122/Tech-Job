export enum JobStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  SUBMITTED = "SUBMITTED",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export const JobStatusThai: Record<JobStatus, string> = {
  [JobStatus.PENDING]: "รอการตรวจสอบ",
  [JobStatus.IN_PROGRESS]: "กำลังทำงาน",
  [JobStatus.SUBMITTED]: "ส่งงานแล้ว",
  [JobStatus.COMPLETED]: "สำเร็จ",
  [JobStatus.REJECTED]: "ตีกลับ",
};

export const getStatusThai = (status: string | JobStatus): string => {
  const s = status?.toUpperCase();
  if (s === "PENDING" || status === "รอการตรวจสอบ") return JobStatusThai[JobStatus.PENDING];
  if (s === "IN_PROGRESS" || status === "กำลังทำงาน") return JobStatusThai[JobStatus.IN_PROGRESS];
  if (s === "SUBMITTED" || status === "ส่งงานแล้ว") return JobStatusThai[JobStatus.SUBMITTED];
  if (s === "COMPLETED" || status === "สำเร็จ") return JobStatusThai[JobStatus.COMPLETED];
  if (s === "REJECTED" || status === "ตีกลับ") return JobStatusThai[JobStatus.REJECTED];
  return status || "ไม่ระบุ";
};

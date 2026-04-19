export enum JobStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum JobReportStatus {
  IN_PROGRESS = "IN_PROGRESS",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export const JobStatusThai: Record<JobStatus, string> = {
  [JobStatus.PENDING]: "รอการดำเนินงาน",
  [JobStatus.IN_PROGRESS]: "กำลังทำงาน",
  [JobStatus.COMPLETED]: "สำเร็จ",
  [JobStatus.CANCELLED]: "ยกเลิก",
  [JobStatus.SUBMITTED]: "รอการตรวจสอบ",
  [JobStatus.APPROVED]: "อนุมัติแล้ว",
  [JobStatus.REJECTED]: "ตีกลับ/แก้ไข",
};

export const JobReportStatusThai: Record<JobReportStatus, string> = {
  [JobReportStatus.IN_PROGRESS]: "กำลังทำงาน",
  [JobReportStatus.SUBMITTED]: "รอการตรวจสอบ",
  [JobReportStatus.APPROVED]: "อนุมัติแล้ว",
  [JobReportStatus.REJECTED]: "ตีกลับ/แก้ไข",
};

export const getStatusThai = (status: string): string => {
  if (!status) return "ไม่ระบุ";
  const s = status.toUpperCase();
  
  // Check JobStatus
  if (JobStatusThai[s as JobStatus]) return JobStatusThai[s as JobStatus];
  
  // Check JobReportStatus
  if (JobReportStatusThai[s as JobReportStatus]) return JobReportStatusThai[s as JobReportStatus];
  
  return status;
};

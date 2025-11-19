export type AdminLogType =
  | "create_job"
  | "edit_job"
  | "update_status"
  | "assign_supervisor"
  | "assign_technician"
  | "upload_file"
  | "cancel_job"
  | "finish_job";
import { 
  File, 
  Pencil, 
  ClipboardList, 
  UserPlus, 
  Users, 
  Image as ImageIcon, 
  XCircle, 
  CheckCircle 
} from "lucide-react";

export const LogIconMap = {
  create_job:       { icon: File,          bg: "bg-blue-100",   text: "text-blue-600" },
  edit_job:         { icon: Pencil,        bg: "bg-amber-100",  text: "text-amber-600" },
  update_status:    { icon: ClipboardList, bg: "bg-purple-100", text: "text-purple-600" },
  assign_supervisor:{ icon: Users,         bg: "bg-green-100",  text: "text-green-600" },
  assign_technician:{ icon: UserPlus,      bg: "bg-teal-100",   text: "text-teal-600" },
  upload_file:      { icon: ImageIcon,     bg: "bg-indigo-100", text: "text-indigo-600" },
  cancel_job:       { icon: XCircle,       bg: "bg-red-100",    text: "text-red-600" },
  finish_job:       { icon: CheckCircle,   bg: "bg-green-100",  text: "text-green-600" },
};

export interface ActivityLog {
  id: number;
  timestamp: string;
  userName: string;
  role: string;
  jobId?: string;
  detail: string;
  type: AdminLogType;
}
export const ActivityLogs: ActivityLog[] = [
  {
    id: 1,
    timestamp: "2025-01-14T08:45:12",
    userName: "Admin A",
    role: "admin",
    jobId: "JOB_001",
    detail: "สร้างใบงานใหม่สำเร็จ",
    type: "create_job",
  },
  {
    id: 2,
    timestamp: "2025-01-14T09:15:10",
    userName: "Supervisor Somchai",
    role: "supervisor",
    jobId: "JOB_001",
    detail: "ส่งงานให้ช่าง เอก",
    type: "assign_technician",
  },
  {
    id: 3,
    timestamp: "2025-01-14T09:30:20",
    userName: "Technician Ek",
    role: "technician",
    jobId: "JOB_001",
    detail: "อัปเดตสถานะงาน: กำลังทำงาน",
    type: "update_status",
  },
  {
    id: 4,
    timestamp: "2025-01-14T10:02:44",
    userName: "Technician Ek",
    role: "technician",
    jobId: "JOB_001",
    detail: "อัปโหลดรูปหลักฐาน 3 รูป",
    type: "upload_file",
  },
  {
    id: 5,
    timestamp: "2025-01-14T10:16:10",
    userName: "Supervisor Somchai",
    role: "supervisor",
    jobId: "JOB_001",
    detail: "ส่งงานกลับเพื่อแก้ไขรายละเอียด",
    type: "edit_job",
  },
  {
    id: 6,
    timestamp: "2025-01-14T10:20:12",
    userName: "Admin A",
    role: "admin",
    jobId: "JOB_001",
    detail: "อัปเดตสถานะรวม: สำเร็จ",
    type: "update_status",
  },
  {
    id: 7,
    timestamp: "2025-01-14T11:40:35",
    userName: "Admin A",
    role: "admin",
    jobId: "JOB_002",
    detail: "แนบไฟล์เอกสารเพิ่มเติม",
    type: "upload_file",
  },
  {
    id: 8,
    timestamp: "2025-01-14T13:02:14",
    userName: "Admin A",
    role: "admin",
    jobId: "JOB_002",
    detail: "ยกเลิกใบงานตามคำขอลูกค้า",
    type: "cancel_job",
  },
  {
    id: 9,
    timestamp: "2025-01-14T10:25:30",
    userName: "Supervisor Somchai",
    role: "supervisor",
    jobId: "JOB_001",
    detail: "ตรวจสอบแล้ว: งานสำเร็จ",
    type: "finish_job",
  },
];

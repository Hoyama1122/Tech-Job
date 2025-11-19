// navLink.ts
import {
  FileText,
  Users,
  HomeIcon,
  CalendarDays,
  LucideIcon,
  Settings,
  LayoutDashboard,
  Wrench,
  AlertTriangle,
  Clock,
  ClipboardCheck,
  UserCog,
  Users2,
  BarChart3,
  Warehouse 
} from "lucide-react";

type NavItem = {
  name: string;
  path: string;
  icon: LucideIcon;
};

export const navLinkAdmin: NavItem[] = [
  { name: "หน้าหลัก", path: "/", icon: HomeIcon },
  { name: "ใบงานทั้งหมด", path: "/work", icon: ClipboardCheck },
  { name: "สร้างใบงาน", path: "/add-work", icon: FileText },
  { name: "ข้อมูลงานเบิก", path: "/material", icon: Warehouse },
  { name: "ผู้ใช้งาน", path: "/user", icon: Users },
];
export const navLinkTechnician: NavItem[] = [
  { name: "หน้าหลัก", path: "/", icon: LayoutDashboard },
  { name: "ใบงานของฉัน ", path: "/work", icon: Wrench },
  { name: "รายงานปัญหา", path: "/user", icon: AlertTriangle },
  { name: "ประวัติงาน", path: "/history", icon: Clock },
  { name: "ปฏิทิน", path: "/calendar", icon: CalendarDays },
  { name: "ตั้งค่า", path: "/settings", icon: Settings },
];

export const navLinkSupervisor: NavItem[] = [
  { name: "หน้าหลัก", path: "/", icon: LayoutDashboard },
  { name: "ใบงานทั้งหมด", path: "/work", icon: ClipboardCheck }, 
  { name: "มอบหมายงาน", path: "/assign", icon: UserCog }, 
  { name: "ตรวจงาน", path: "/review", icon: Wrench }, 
  { name: "ทีมของฉัน", path: "/team", icon: Users2 },
  // { name: "สถิติทีม", path: "/report", icon: BarChart3 }, 
  { name: "ตั้งค่า", path: "/settings", icon: Settings }, 
];

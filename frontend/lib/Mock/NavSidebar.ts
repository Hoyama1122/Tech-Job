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
  Warehouse, 
  Briefcase
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
  { name: "ปฏิทิน", path: "/calendar", icon: CalendarDays },
  { name: "ประวัติงาน", path: "/History", icon: Clock },
  { name: "ตั้งค่า", path: "/settings", icon: Settings },
];

export const navLinkSupervisor: NavItem[] = [
  { name: "หน้าหลัก", path: "/", icon: LayoutDashboard },
  { name: "ใบงานทั้งหมด", path: "/work", icon: ClipboardCheck }, 
  // { name: "มอบหมายงาน", path: "/assign", icon: UserCog }, 
  { name: "ตรวจงาน", path: "/review", icon: Wrench }, 
  { name: "ทีมของฉัน", path: "/team", icon: Users2 },
  // { name: "สถิติทีม", path: "/report", icon: BarChart3 }, 
  // { name: "ตั้งค่า", path: "/settings", icon: Settings }, 
];

export const navLinkExecutive: NavItem[] = [
  { name: "ภาพรวม", path: "/", icon: LayoutDashboard },
  { name: "รายงานและสถิติ", path: "/reports", icon: BarChart3 },
  { name: "ภาพรวมองค์กร", path: "/organization", icon: Users },
  { name: "ใบงานทั้งหมด", path: "/work", icon: Briefcase },
];

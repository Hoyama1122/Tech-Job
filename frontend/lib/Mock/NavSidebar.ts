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
} from "lucide-react";

type NavItem = {
  name: string;
  path: string;
  icon: LucideIcon;
};

export const navLink: NavItem[] = [
  { name: "หน้าหลัก", path: "/", icon: HomeIcon },
  { name: "ใบงาน", path: "/work", icon: FileText },
  { name: "ผู้ใช้งาน", path: "/user", icon: Users },
  { name: "ปฏิทิน", path: "/calendar", icon: CalendarDays },
];
export const navLinkTechnician: NavItem[] = [
  { name: "หน้าหลัก", path: "/", icon: LayoutDashboard },
  { name: "ใบงานของฉัน ", path: "/work", icon: Wrench },
  { name: "รายงานปัญหา", path: "/user", icon: AlertTriangle },
  { name: "ประวัติงาน", path: "/calendar", icon: Clock },
  { name: "ปฏิทิน", path: "/calendar", icon: CalendarDays },
  { name: "ตั้งค่า", path: "/calendar", icon: Settings },
];

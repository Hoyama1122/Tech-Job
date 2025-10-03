// navLink.ts
import { FileText, Users, HomeIcon, CalendarDays, LucideIcon } from "lucide-react";

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

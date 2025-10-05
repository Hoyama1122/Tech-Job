export type User = {
  id: number;
  username: string;
  phone: string;
  department: string;
  area: string;
  status: "ว่าง" | "ทำงาน" | "ไม่ว่าง";
  totalJobs: number;
  lastActive: string;
  role: "Technician" | "Admin";
};

export const UserData: User[] = [
  {
    id: 1,
    username: "สมชาย ใจดี",
    phone: "081-111-2233",
    department: "ช่างไฟฟ้า",
    area: "กรุงเทพฯ",
    status: "ว่าง",
    totalJobs: 24,
    lastActive: "2025-10-03 15:40",
    role: "Technician",
  },
  {
    id: 2,
    username: "กิตติ แสงทอง",
    phone: "082-444-5566",
    department: "ช่างแอร์",
    area: "นนทบุรี",
    status: "ทำงาน",
    totalJobs: 31,
    lastActive: "2025-10-04 10:20",
    role: "Technician",
  },
  {
    id: 3,
    username: "วรพล มีสุข",
    phone: "083-777-8899",
    department: "ช่างประปา",
    area: "สมุทรปราการ",
    status: "ไม่ว่าง",
    totalJobs: 17,
    lastActive: "2025-10-02 18:10",
    role: "Technician",
  },
  {
    id: 4,
    username: "ภาคิน ศรีสม",
    phone: "084-222-3344",
    department: "ช่างไฟฟ้า",
    area: "กรุงเทพฯ",
    status: "ทำงาน",
    totalJobs: 40,
    lastActive: "2025-10-04 08:45",
    role: "Technician",
  },
  {
    id: 5,
    username: "ณัฐพล แก้วดี",
    phone: "085-999-0011",
    department: "ช่างแอร์",
    area: "ปทุมธานี",
    status: "ว่าง",
    totalJobs: 19,
    lastActive: "2025-10-03 12:00",
    role: "Technician",
  },
  {
    id: 6,
    username: "ธีรภัทร พงษ์งาม",
    phone: "086-123-4567",
    department: "ช่างเครื่องกล",
    area: "กรุงเทพฯ",
    status: "ไม่ว่าง",
    totalJobs: 22,
    lastActive: "2025-10-01 17:10",
    role: "Technician",
  },
  {
    id: 7,
    username: "พงศกร ทองแท้",
    phone: "087-654-3210",
    department: "ช่างไฟฟ้า",
    area: "นนทบุรี",
    status: "ทำงาน",
    totalJobs: 37,
    lastActive: "2025-10-04 09:10",
    role: "Technician",
  },
  {
    id: 8,
    username: "อาทิตย์ ศิริรุ่ง",
    phone: "088-789-4321",
    department: "ช่างประปา",
    area: "สมุทรสาคร",
    status: "ว่าง",
    totalJobs: 12,
    lastActive: "2025-10-03 13:30",
    role: "Technician",
  },
  {
    id: 9,
    username: "เจษฎา มณีวงศ์",
    phone: "089-345-6789",
    department: "ช่างแอร์",
    area: "กรุงเทพฯ",
    status: "ทำงาน",
    totalJobs: 29,
    lastActive: "2025-10-04 11:00",
    role: "Technician",
  },
  {
    id: 10,
    username: "อนันต์ ศักดิ์ดี",
    phone: "090-555-6677",
    department: "Admin Center",
    area: "สำนักงานใหญ่",
    status: "ว่าง",
    totalJobs: 0,
    lastActive: "2025-10-04 09:55",
    role: "Admin",
  },
];
    
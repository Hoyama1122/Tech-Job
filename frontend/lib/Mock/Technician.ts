export type TechnicianType = {
  id: number;
  name: string;
  department: string;
  phone: string;
  email: string;
  supervisorId: number;
  status: "ว่าง" | "กำลังทำงาน" | "ออฟไลน์";
  // image: string;
};

export const TechnicianMock: TechnicianType[] = [
  {
    id: 1,
    name: "สมชาย ใจดี",
    department: "ช่างไฟฟ้า",
    phone: "081-234-5678",
    email: "somchai@example.com",
    status: "กำลังทำงาน",
    supervisorId: 1,
    // image: "/uploads/tech1.jpg",
  },
  {
    id: 2,
    name: "นรา สำอัญ",
    department: "ช่างแอร์",
    phone: "082-345-6789",
    email: "nara@example.com",
    status: "ว่าง",
    supervisorId: 1,
    // image: "/uploads/tech2.jpg",
  },
  {
    id: 3,
    name: "สุทธิ มาก",
    department: "ช่างไฟฟ้า",
    phone: "083-456-7890",
    email: "sutti@example.com",
    status: "ออฟไลน์",
    supervisorId: 2,
    // image: "/uploads/tech3.jpg",
  },
  {
    id: 4,
    name: "พัชรินทร์ พานทอง",
    department: "ช่างประปา",
    phone: "084-567-8901",
    email: "patcharin@example.com",
    status: "ว่าง",
    supervisorId: 1,
    // image: "/uploads/tech4.jpg",
  },
  {
    id: 5,
    name: "จักปุ ลิ้มดี",
    department: "ช่างไฟฟ้า",
    phone: "085-678-9012",
    email: "chakpu@example.com",
    status: "กำลังทำงาน",
    supervisorId: 1,
    // image: "/uploads/tech5.jpg",
  },
  {
    id: 6,
    name: "ธันวา มีสุข",
    department: "ช่างประปา",
    phone: "086-789-0123",
    email: "thanwa@example.com",
    status: "ว่าง",
    supervisorId: 2,
    // image: "/uploads/tech6.jpg",
  },
  {
    id: 7,
    name: "ภูมิ คงดี",
    department: "ช่างระบบเครือข่าย",
    phone: "087-890-1234",
    email: "phoom@example.com",
    status: "กำลังทำงาน",
    supervisorId: 1,
    // image: "/uploads/tech7.jpg",
  },
  {
    id: 8,
    name: "ภัทรา ดวงดี",
    department: "ช่างแอร์",
    phone: "088-901-2345",
    email: "phattra@example.com",
    status: "ออฟไลน์",
    supervisorId: 1,
    // image: "/uploads/tech8.jpg",
  },
  {
    id: 9,
    name: "นเรศ สุขสันต์",
    department: "ช่างไฟฟ้า",
    phone: "089-012-3456",
    email: "nares@example.com",
    status: "ว่าง",
    supervisorId: 1,
    // image: "/uploads/tech9.jpg",
  },
  {
    id: 10,
    name: "อัญชัน ชื่นใจ",
    department: "ช่างทั่วไป",
    phone: "080-123-4567",
    email: "anchan@example.com",
    status: "กำลังทำงาน",
    supervisorId: 2,
    // image: "/uploads/tech10.jpg",
  },
];

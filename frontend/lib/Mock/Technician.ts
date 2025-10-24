export type TechnicianType = {
  id: number;
  name: string;
  position: string;
  phone: string;
  email: string;
  status: "ว่าง" | "กำลังทำงาน" | "ออฟไลน์";
  image: string;
};

export const TechnicianMock: TechnicianType[] = [
  {
    id: 1,
    name: "สมชาย ใจดี",
    position: "ช่างไฟฟ้า",
    phone: "081-234-5678",
    email: "somchai@example.com",
    status: "กำลังทำงาน",
    image: "/uploads/tech1.jpg",
  },
  {
    id: 2,
    name: "นรา สำอัญ",
    position: "ช่างแอร์",
    phone: "082-345-6789",
    email: "nara@example.com",
    status: "ว่าง",
    image: "/uploads/tech2.jpg",
  },
  {
    id: 3,
    name: "สุทธิ มาก",
    position: "ช่างไฟฟ้า",
    phone: "083-456-7890",
    email: "sutti@example.com",
    status: "ออฟไลน์",
    image: "/uploads/tech3.jpg",
  },
  {
    id: 4,
    name: "พัชรินทร์ พานทอง",
    position: "ช่างประปา",
    phone: "084-567-8901",
    email: "patcharin@example.com",
    status: "ว่าง",
    image: "/uploads/tech4.jpg",
  },
  {
    id: 5,
    name: "จักปุ ลิ้มดี",
    position: "ช่างไฟฟ้า",
    phone: "085-678-9012",
    email: "chakpu@example.com",
    status: "กำลังทำงาน",
    image: "/uploads/tech5.jpg",
  },
  {
    id: 6,
    name: "ธันวา มีสุข",
    position: "ช่างประปา",
    phone: "086-789-0123",
    email: "thanwa@example.com",
    status: "ว่าง",
    image: "/uploads/tech6.jpg",
  },
  {
    id: 7,
    name: "ภูมิ คงดี",
    position: "ช่างระบบเครือข่าย",
    phone: "087-890-1234",
    email: "phoom@example.com",
    status: "กำลังทำงาน",
    image: "/uploads/tech7.jpg",
  },
  {
    id: 8,
    name: "ภัทรา ดวงดี",
    position: "ช่างแอร์",
    phone: "088-901-2345",
    email: "phattra@example.com",
    status: "ออฟไลน์",
    image: "/uploads/tech8.jpg",
  },
  {
    id: 9,
    name: "นเรศ สุขสันต์",
    position: "ช่างไฟฟ้า",
    phone: "089-012-3456",
    email: "nares@example.com",
    status: "ว่าง",
    image: "/uploads/tech9.jpg",
  },
  {
    id: 10,
    name: "อัญชัน ชื่นใจ",
    position: "ช่างทั่วไป",
    phone: "080-123-4567",
    email: "anchan@example.com",
    status: "กำลังทำงาน",
    image: "/uploads/tech10.jpg",
  },
];

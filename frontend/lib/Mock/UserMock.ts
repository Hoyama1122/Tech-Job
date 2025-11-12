export type UserType = {
  id: number;
  name: string;
  role: "ceo" | "admin" | "supervisor" | "technician";
  department?: string; // สำหรับแผนก เช่น ไฟฟ้า / แอร์ / ประปา
  phone?: string;
  email?: string;
  avatar?: string;
  password?: string;
};

export const Users: UserType[] = [
  // CEO
  {
    id: 100,
    name: "คุณฟ้าใส วิศวกร",
    role: "ceo",
    email: "ceo@techjob.com",
    password: "ceo123",
    phone: "081-100-0001",
  },

  // Admin (ฝ่ายธุรการ)
  {
    id: 1,
    name: "ออย ธุรการ",
    role: "admin",
    email: "admin@techjob.com",
    password: "admin123",
    phone: "081-200-0001",
  },
  // Supervisor (หัวหน้างาน)
  {
    id: 2,
    name: "พงษ์ วงกลม",
    role: "supervisor",
    department: "ไฟฟ้า",
    email: "pong@techjob.com",
    password: "pong123",
    phone: "081-300-0001",
  },
  {
    id: 3,
    name: "ธวัช ชัชฉัย",
    role: "supervisor",
    department: "แอร์",
    email: "thawat@techjob.com",
    password: "thawat123",
    phone: "081-300-0002",
  },
  {
    id: 4,
    name: "ภาคิน พักิน",
    role: "supervisor",
    department: "ประปา",
    email: "phakin@techjob.com",
    password: "phakin123",
    phone: "081-300-0003",
  },

// Technician (ฝ่ายไฟฟ้า)
{
  id: 5,
  name: "ช่างหนึ่ง",
  role: "technician",
  department: "ไฟฟ้า",
  phone: "081-400-0001",
  email: "tech1@techjob.com",
  password: "tech123",
},
{
  id: 6,
  name: "ช่างสอง",
  role: "technician",
  department: "ไฟฟ้า",
  phone: "081-400-0002",
  email: "tech2@techjob.com",
  password: "tech123",
},
{
  id: 7,
  name: "ช่างฟิวส์",
  role: "technician",
  department: "ไฟฟ้า",
  phone: "081-400-0003",
  email: "tech3@techjob.com",
  password: "tech123",
},

//  Technician (ฝ่ายแอร์)
{
  id: 8,
  name: "ช่างบอล",
  role: "technician",
  department: "แอร์",
  phone: "081-500-0001",
  email: "tech4@techjob.com",
  password: "tech123",
},
{
  id: 9,
  name: "ช่างจูน",
  role: "technician",
  department: "แอร์",
  phone: "081-500-0002",
  email: "tech5@techjob.com",
  password: "tech123",
},

//  Technician (ฝ่ายประปา)
{
  id: 10,
  name: "ช่างบาส",
  role: "technician",
  department: "ประปา",
  phone: "081-600-0001",
  email: "tech6@techjob.com",
  password: "tech123",
},
{
  id: 11,
  name: "ช่างเอก",
  role: "technician",
  department: "ประปา",
  phone: "081-600-0002",
  email: "tech7@techjob.com",
  password: "tech123",
},

];

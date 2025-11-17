import Image from "@/uploads/Image.jpg";
import { StaticImageData } from "next/image";

const randomLocation = (
  baseLat: number = 13.85,
  baseLng: number = 100.58,
  range: number = 0.02
) => {
  const lat = baseLat + (Math.random() - 0.5) * range;
  const lng = baseLng + (Math.random() - 0.5) * range;
  return { lat: Number(lat.toFixed(3)), lng: Number(lng.toFixed(3)) };
};

export type CardWorkTypes = {
  id: number;
  JobId: string;
  title: string;
  description: string;

  status:
    | "รอการตรวจสอบ"
    | "กำลังทำงาน"
    | "ว่าง"
    | "สำเร็จ"
    | "ตีกลับ"
    | "รอการมอบหมายงาน";


  createdAt: string;
  assignedAt?: string;
  dueDate?: string;
  completedAt?: string;
  approvedAt?: string;
  sla?: string;


  userId: number | null;
  supervisorId: number;

  technicianId: number[];
  leadTechnicianId?: number; 


  image: StaticImageData;
  imagesBefore?: string[];
  imagesAfter?: string[];


  loc: {
    lat: number;
    lng: number;
  };


  category?: "ไฟฟ้า" | "แอร์" | "ประปา" | "ระบบสื่อสาร" | "ทั่วไป";
  priority?: "low" | "medium" | "high" | "urgent";

  customer?: {
    name: string;
    phone: string;
    room: string;
  };

  technicianReport?: {
    detail: string;
    materialsUsed: string[];
    cost: number;
  } | null;

  rejectReason?: string | null;

  logs?: {
    by: "admin" | "supervisor" | "technician";
    action: string;
    time: string;
  }[];
};



export const CardWork: CardWorkTypes[] = [
  {
    id: 1,
    JobId: "JOB_001",
    title: "ตรวจเช็คระบบไฟฟ้า อาคาร A ชั้น 3",
    description: "ตรวจสอบการทำงานของระบบไฟฟ้าและเปลี่ยนหลอดไฟที่ชำรุด",
    category: "ไฟฟ้า",
    priority: "high",
    status: "รอการตรวจสอบ",
    sla: "20m",

    createdAt: "2025-01-14T08:30",
    assignedAt: "2025-01-14T10:00",
    dueDate: "2025-01-15T18:00",
    completedAt: null,
    approvedAt: null,

    customer: {
      name: "ฝ่ายอาคาร A",
      phone: "0891234567",
      room: "ชั้น 3",
    },

    technicianReport: null,
    rejectReason: null,

    userId: 1,
    supervisorId: 2,
    technicianId: [5, 6],
    
    image: Image,
    loc: randomLocation(),
  },

  {
    id: 2,
    JobId: "JOB_002",
    title: "ซ่อมแอร์ห้องประชุมใหญ่",
    description: "แอร์ไม่เย็น ตรวจสอบระบบคอมเพรสเซอร์และน้ำยาแอร์",
    category: "แอร์",
    priority: "urgent",
    status: "กำลังทำงาน",
    sla: "30m",

    createdAt: "2025-01-13T09:00",
    assignedAt: "2025-01-13T10:15",
    dueDate: "2025-01-14T18:00",
    completedAt: null,
    approvedAt: null,

    customer: {
      name: "ฝ่ายประชุม",
      phone: "0819988776",
      room: "อาคารประชุมใหญ่",
    },

    technicianReport: null,
    rejectReason: null,

    userId: 1,
    supervisorId: 3,
    technicianId: [8, 9],
    image: Image,
    loc: randomLocation(),
  },

  {
    id: 3,
    JobId: "JOB_003",
    title: "เปลี่ยนหลอดไฟโถงกลาง อาคาร B",
    description: "หลอดไฟชั้น 2 ดับทั้งแถว ต้องเปลี่ยนใหม่ทั้งหมด",
    category: "ไฟฟ้า",
    priority: "medium",
    status: "สำเร็จ",

    createdAt: "2025-01-12T10:30",
    assignedAt: "2025-01-12T11:00",
    dueDate: "2025-01-13T17:30",
    completedAt: "2025-01-13T09:15",
    approvedAt: "2025-01-13T10:00",

    customer: {
      name: "นิติบุคคล อาคาร B",
      phone: "0851122334",
      room: "ชั้น 2",
    },

    technicianReport: {
      detail: "เปลี่ยนหลอดไฟครบทุกจุดแล้ว ทดสอบใช้งานปกติ",
      materialsUsed: ["หลอดไฟ 12 ดวง"],
      cost: 0,
    },

    rejectReason: null,

    userId: 3,
    supervisorId: 2,
    technicianId: [7, 5],
    image: Image,
    loc: randomLocation(),
  },

  {
    id: 4,
    JobId: "JOB_004",
    title: "ตรวจสอบระบบน้ำรั่ว อาคาร C",
    description: "น้ำหยดจากเพดาน คาดว่าท่อรั่ว ตรวจหาจุดรั่ว",
    category: "ประปา",
    priority: "high",
    status: "ตีกลับ",

    createdAt: "2025-01-11T09:45",
    assignedAt: "2025-01-11T11:00",
    dueDate: "2025-01-12T18:00",
    completedAt: "2025-01-12T16:00",
    approvedAt: null,

    customer: {
      name: "ฝ่ายอาคาร C",
      phone: "0815552344",
      room: "ชั้น 5",
    },

    technicianReport: {
      detail: "ตรวจพบจุดรั่ว แต่ภาพหลังซ่อมไม่ชัด",
      materialsUsed: ["ซีลกันรั่ว"],
      cost: 0,
    },

    rejectReason: "รูปหลังทำงานไม่ชัด ขอถ่ายใหม่",

    userId: 4,
    supervisorId: 4,
    technicianId: [10, 11],
    image: Image,
    loc: randomLocation(),
  },

  {
    id: 5,
    JobId: "JOB_005",
    title: "ติดตั้งปลั๊กไฟห้องทำงานใหม่",
    description: "เพิ่มปลั๊กไฟสำหรับอุปกรณ์ IT และเครื่องถ่ายเอกสาร",
    category: "ไฟฟ้า",
    priority: "medium",
    status: "รอการตรวจสอบ",

    createdAt: "2025-01-10T14:00",
    assignedAt: "2025-01-10T15:00",
    dueDate: "2025-01-11T18:00",
    completedAt: null,
    approvedAt: null,

    customer: {
      name: "ฝ่าย IT",
      phone: "0895566778",
      room: "ชั้น 4",
    },

    technicianReport: null,
    rejectReason: null,

    userId: 5,
    supervisorId: 2,
    technicianId: [5, 7],
    image: Image,
    loc: randomLocation(),
  },

  {
    id: 6,
    JobId: "JOB_006",
    title: "ตรวจสอบระบบระบายอากาศ ห้อง Server",
    description: "พัดลมระบายอากาศไม่ทำงาน ตรวจสอบและซ่อมแซม",
    category: "แอร์",
    priority: "urgent",
    status: "กำลังทำงาน",

    createdAt: "2025-01-09T13:00",
    assignedAt: "2025-01-09T14:00",
    dueDate: "2025-01-10T18:00",
    completedAt: null,
    approvedAt: null,

    customer: {
      name: "ระบบ Server",
      phone: "0802223344",
      room: "Server Room",
    },

    technicianReport: null,
    rejectReason: null,

    userId: 6,
    supervisorId: 3,
    technicianId: [8],
    image: Image,
    loc: randomLocation(),
  },

  {
    id: 7,
    JobId: "JOB_007",
    title: "ซ่อมระบบ Wi-Fi อาคาร D",
    description: "สัญญาณ Wi-Fi ชั้น 4 ขาด ๆ หาย ๆ ตรวจสอบ Access Point",
    category: "ระบบสื่อสาร",
    priority: "medium",
    status: "รอการตรวจสอบ",

    createdAt: "2025-01-08T08:50",
    assignedAt: "2025-01-08T09:30",
    dueDate: "2025-01-09T18:00",
    completedAt: null,
    approvedAt: null,

    customer: {
      name: "แผนกอาคาร D",
      phone: "0823344556",
      room: "ชั้น 4",
    },

    technicianReport: null,
    rejectReason: null,

    userId: 7,
    supervisorId: 2,
    technicianId: [5, 6],
    image: Image,
    loc: randomLocation(),
  },

  {
    id: 8,
    JobId: "JOB_008",
    title: "ทำความสะอาดระบบปรับอากาศ",
    description: "ล้างแผงคอยล์เย็นและเปลี่ยนกรองอากาศใหม่",
    category: "แอร์",
    priority: "low",
    status: "สำเร็จ",

    createdAt: "2025-01-07T09:00",
    assignedAt: "2025-01-07T10:00",
    dueDate: "2025-01-08T18:00",
    completedAt: "2025-01-08T09:20",
    approvedAt: "2025-01-08T10:00",

    customer: {
      name: "ฝ่ายอาคาร",
      phone: "0856677889",
      room: "ชั้น 1",
    },

    technicianReport: {
      detail: "ล้างคอยล์เย็นเรียบร้อย เปลี่ยนไส้กรองใหม่",
      materialsUsed: ["ไส้กรองอากาศ"],
      cost: 150,
    },

    rejectReason: null,

    userId: 8,
    supervisorId: 3,
    technicianId: [8, 9],
    image: Image,
    loc: randomLocation(),
  },

  {
    id: 9,
    JobId: "JOB_009",
    title: "ตรวจสอบระบบแจ้งเตือนไฟไหม้",
    description: "ทดสอบระบบสัญญาณไฟและเสียงแจ้งเตือน",
    category: "ระบบสื่อสาร",
    priority: "high",
    status: "รอการตรวจสอบ",

    createdAt: "2025-01-06T14:30",
    assignedAt: "2025-01-06T15:00",
    dueDate: "2025-01-07T17:30",
    completedAt: null,
    approvedAt: null,

    customer: {
      name: "ฝ่ายความปลอดภัย",
      phone: "0839975888",
      room: "ชั้น 1",
    },

    technicianReport: null,
    rejectReason: null,

    userId: 9,
    supervisorId: 2,
    technicianId: [5, 7],
    image: Image,
    loc: randomLocation(),
  },

  {
    id: 10,
    JobId: "JOB_010",
    title: "ซ่อมบานประตูห้องน้ำหญิง",
    description: "บานพับหลวมและกลอนประตูไม่ทำงาน",
    category: "ช่างทั่วไป",
    priority: "low",
    status: "ตีกลับ",

    createdAt: "2025-01-05T10:15",
    assignedAt: "2025-01-05T11:00",
    dueDate: "2025-01-06T18:00",
    completedAt: "2025-01-06T11:45",
    approvedAt: null,

    customer: {
      name: "ฝ่ายแม่บ้าน",
      phone: "0814455667",
      room: "ชั้น 2",
    },

    technicianReport: {
      detail: "ซ่อมบานพับแล้ว แต่ภาพหลังซ่อมไม่ครบทุกมุม",
      materialsUsed: ["สกรูใหม่"],
      cost: 25,
    },

    rejectReason: "รูปหลังซ่อมไม่ครบ ขอถ่ายเพิ่ม",

    userId: 10,
    supervisorId: 4,
    technicianId: [10, 11],
    image: Image,
    loc: randomLocation(),
  },
];


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

  // 🕓 เวลาต่าง ๆ
  createdAt: string; // วันที่สร้างใบงาน
  assignedAt?: string; // วันที่หัวหน้ามอบหมาย
  dueDate?: string; // วันครบกำหนด
  completedAt?: string; // วันที่ช่างส่งงาน
  approvedAt?: string; // วันที่อนุมัติปิดงาน
  sla?: string;
  userId: number | null;
  supervisorId: number;
  technicianId: number[];
  image: StaticImageData;
  loc: {
    lat: number;
    lng: number;
  };
};

export const CardWork: CardWorkTypes[] = [
  {
    id: 1,
    JobId: "JOB_001",
    title: "ตรวจเช็คระบบไฟฟ้า อาคาร A ชั้น 3",
    description: "ตรวจสอบการทำงานของระบบไฟฟ้าและเปลี่ยนหลอดไฟที่ชำรุด",
    status: "รอการตรวจสอบ",
    sla: "20m",
    createdAt: "2025-01-14T08:30",
    assignedAt: "2025-01-14T10:00",
    dueDate: "2025-01-15T18:00",
    completedAt: null,
    approvedAt: null,
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
    status: "กำลังทำงาน",
    sla: "30m",
    createdAt: "2025-01-13T09:00",
    assignedAt: "2025-01-13T10:15",
    dueDate: "2025-01-14T18:00",
    completedAt: null,
    approvedAt: null,
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
    status: "สำเร็จ",

    createdAt: "2025-01-12T10:30",
    assignedAt: "2025-01-12T11:00",
    dueDate: "2025-01-13T17:30",
    completedAt: "2025-01-13T09:15",
    approvedAt: "2025-01-13T10:00",
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
    status: "ตีกลับ",

    createdAt: "2025-01-11T09:45",
    assignedAt: "2025-01-11T11:00",
    dueDate: "2025-01-12T18:00",
    completedAt: "2025-01-12T16:00",
    approvedAt: null,
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
    status: "รอการตรวจสอบ",

    createdAt: "2025-01-10T14:00",
    assignedAt: "2025-01-10T15:00",
    dueDate: "2025-01-11T18:00",
    completedAt: null,
    approvedAt: null,
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
    status: "กำลังทำงาน",

    createdAt: "2025-01-09T13:00",
    assignedAt: "2025-01-09T14:00",
    dueDate: "2025-01-10T18:00",
    completedAt: null,
    approvedAt: null,
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
    status: "รอการตรวจสอบ",

    createdAt: "2025-01-08T08:50",
    assignedAt: "2025-01-08T09:30",
    dueDate: "2025-01-09T18:00",
    completedAt: null,
    approvedAt: null,
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
    status: "สำเร็จ",

    createdAt: "2025-01-07T09:00",
    assignedAt: "2025-01-07T10:00",
    dueDate: "2025-01-08T18:00",
    completedAt: "2025-01-08T09:20",
    approvedAt: "2025-01-08T10:00",
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
    status: "รอการตรวจสอบ",

    createdAt: "2025-01-06T14:30",
    assignedAt: "2025-01-06T15:00",
    dueDate: "2025-01-07T17:30",
    completedAt: null,
    approvedAt: null,
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
    status: "ตีกลับ",

    createdAt: "2025-01-05T10:15",
    assignedAt: "2025-01-05T11:00",
    dueDate: "2025-01-06T18:00",
    completedAt: "2025-01-06T11:45",
    approvedAt: null,
    userId: 10,
    supervisorId: 4,
    technicianId: [10, 11],
    image: Image,
    loc: randomLocation(),
  },
];

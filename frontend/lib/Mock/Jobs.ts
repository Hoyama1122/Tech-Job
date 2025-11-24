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
    | "รอการดำเนินงาน";
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
    address: string;
  };
  technicianReport?: {
    detail: string;
    inspectionResults: string;
    materialsUsed: string[];
    cost: number;
    repairOperations: string;
    summaryOfOperatingResults: string;
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
    dueDate: "2025-01-15T18:00",
    completedAt: null,
    customer: {
      name: "ฝ่ายอาคาร A",
      phone: "0891234567",
      address: "ชั้น 3",
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
      address: "อาคารประชุมใหญ่",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 1,
    supervisorId: 3,
    technicianId: [12, 13],
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
      address: "ชั้น 2",
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
      address: "ชั้น 5",
    },
    technicianReport: {
      detail: "ตรวจพบจุดรั่ว แต่ภาพหลังซ่อมไม่ชัด",
      materialsUsed: ["ซีลกันรั่ว"],
      cost: 0,
    },
    rejectReason: "รูปหลังทำงานไม่ชัด ขอถ่ายใหม่",
    userId: 4,
    supervisorId: 4,
    technicianId: [19, 20],
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
      address: "ชั้น 4",
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
      address: "Server address",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 6,
    supervisorId: 3,
    technicianId: [12],
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
      address: "ชั้น 4",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 7,
    supervisorId: 2,
    technicianId: [40, 41],
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
      address: "ชั้น 1",
    },
    technicianReport: {
      detail: "ล้างคอยล์เย็นเรียบร้อย เปลี่ยนไส้กรองใหม่",
      materialsUsed: ["ไส้กรองอากาศ"],
      cost: 150,
    },
    rejectReason: null,
    userId: 8,
    supervisorId: 3,
    technicianId: [14, 15],
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
      address: "ชั้น 1",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 9,
    supervisorId: 2,
    technicianId: [40, 42],
    image: Image,
    loc: randomLocation(),
  },

  {
    id: 10,
    JobId: "JOB_010",
    title: "ซ่อมบานประตูห้องน้ำหญิง",
    description: "บานพับหลวมและกลอนประตูไม่ทำงาน",
    category: "ทั่วไป",
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
      address: "ชั้น 2",
    },
    technicianReport: {
      detail: "ซ่อมบานพับแล้ว แต่ภาพหลังซ่อมไม่ครบทุกมุม",
      materialsUsed: ["สกรูใหม่"],
      cost: 25,
    },
    rejectReason: "รูปหลังซ่อมไม่ครบ ขอถ่ายเพิ่ม",
    userId: 10,
    supervisorId: 4,
    technicianId: [25, 26],
    image: Image,
    loc: randomLocation(),
  },

  {
    id: 11,
    JobId: "JOB_011",
    title: "กระแสไฟตกเป็นช่วง ๆ อาคาร A ฝั่งสำนักงาน",
    description:
      "ไฟตกเป็นระยะ ส่งผลให้คอมพิวเตอร์รีสตาร์ท ต้องตรวจสอบโหลดของตู้เบรกเกอร์และจุดต่อสาย",
    category: "ไฟฟ้า",
    priority: "urgent",
    status: "รอการตรวจสอบ",
    createdAt: "2025-01-15T09:20",
    assignedAt: "2025-01-15T10:00",
    dueDate: "2025-01-15T18:00",
    completedAt: null,
    approvedAt: null,
    customer: {
      name: "แผนกสำนักงาน",
      phone: "0891124578",
      address: "อาคาร A ชั้น 2",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 1,
    supervisorId: 2,
    technicianId: [5, 7, 25],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-15T09:20" },
      { by: "supervisor", action: "รอการตรวจสอบ", time: "2025-01-15T09:30" },
    ],
  },

  {
    id: 12,
    JobId: "JOB_012",
    title: "ล้างและตรวจเช็คแอร์ห้อง Server สำรอง",
    description:
      "แอร์มีเสียงดังและความเย็นลดลง ต้องล้างแผงคอยล์และตรวจเช็คแรงดันน้ำยา",
    category: "แอร์",
    priority: "high",
    status: "รอการดำเนินงาน",
    createdAt: "2025-01-15T13:45",
    assignedAt: null,
    dueDate: "2025-01-16T17:00",
    completedAt: null,
    approvedAt: null,
    customer: {
      name: "ฝ่าย IT",
      phone: "0823345566",
      address: "Server address 2",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 2,
    supervisorId: 3,
    technicianId: [12, 14, 30],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-15T13:45" },
      { by: "admin", action: "รอการดำเนินงาน", time: "2025-01-15T13:46" },
    ],
  },

  {
    id: 13,
    JobId: "JOB_013",
    title: "ท่อน้ำทิ้งตันและมีกลิ่นย้อนกลับ ห้องน้ำอาคาร B",
    description:
      "ท่อน้ำไหลลงช้ามากและมีกลิ่นย้อนขึ้น ต้องล้างท่อด้วยเครื่องเจ็ทและตรวจสอบจุดตัน",
    category: "ประปา",
    priority: "high",
    status: "กำลังทำงาน",
    createdAt: "2025-01-14T16:10",
    assignedAt: "2025-01-14T16:30",
    dueDate: "2025-01-15T17:30",
    completedAt: null,
    approvedAt: null,
    customer: {
      name: "ฝ่ายอาคาร B",
      phone: "0816623455",
      address: "ชั้น 3 ห้องน้ำรวม",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 3,
    supervisorId: 4,
    technicianId: [19, 23, 36],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-14T16:10" },
      { by: "supervisor", action: "มอบหมายทีมประปา", time: "2025-01-14T16:30" },
      { by: "technician", action: "เริ่มงาน", time: "2025-01-14T17:00" },
    ],
  },

  {
    id: 14,
    JobId: "JOB_014",
    title: "ติดตั้ง Access Point ใหม่และเดินสาย LAN เพิ่ม",
    description:
      "ติดตั้ง Access Point เพิ่ม 1 จุด พร้อมเดินสาย LAN CAT6 ยาวประมาณ 15 เมตร",
    category: "ระบบสื่อสาร",
    priority: "medium",
    status: "รอการตรวจสอบ",
    createdAt: "2025-01-15T11:05",
    assignedAt: "2025-01-15T11:40",
    dueDate: "2025-01-16T18:00",
    completedAt: null,
    approvedAt: null,
    customer: {
      name: "ฝ่ายอาคาร D",
      phone: "0832245678",
      address: "ชั้น 4 ห้องทำงานใหม่",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 2,
    supervisorId: 2,
    technicianId: [40, 41, 42],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-15T11:05" },
      { by: "supervisor", action: "รอการตรวจสอบ", time: "2025-01-15T11:40" },
    ],
  },

  {
    id: 15,
    JobId: "JOB_015",
    title: "ซ่อมตู้เก็บของสำนักงาน บานพับหลุด",
    description:
      "ตู้เก็บของหลุดจากบานพับ ต้องขันน็อตใหม่และปรับระดับประตูให้ปิดสนิท",
    category: "ทั่วไป",
    priority: "low",
    status: "รอการตรวจสอบ",
    createdAt: "2025-01-14T15:25",
    assignedAt: "2025-01-14T16:00",
    dueDate: "2025-01-16T18:00",
    completedAt: null,
    approvedAt: null,
    customer: {
      name: "ฝ่ายสำนักงาน",
      phone: "0895566771",
      address: "ชั้น 2 โซนเอกสาร",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 5,
    supervisorId: 4,
    technicianId: [25, 26],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-14T15:25" },
      { by: "supervisor", action: "รอการตรวจสอบ", time: "2025-01-14T16:00" },
    ],
  },

  // 16–30 งานใหม่เพิ่ม

  {
    id: 16,
    JobId: "JOB_016",
    title: "เช็คตู้เมนไฟฟ้าหลัก อาคารกลาง",
    description:
      "ตรวจสอบสภาพตู้เมนไฟฟ้าหลัก ตรวจจุดต่อสายและวัดกระแสรวมของแต่ละเฟส",
    category: "ไฟฟ้า",
    priority: "medium",
    status: "รอการดำเนินงาน",
    createdAt: "2025-01-15T08:10",
    assignedAt: null,
    dueDate: "2025-01-17T18:00",
    completedAt: null,
    approvedAt: null,
    customer: {
      name: "ศูนย์ควบคุมอาคาร",
      phone: "0811234000",
      address: "ห้องควบคุมชั้น 1",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 1,
    supervisorId: 2,
    technicianId: [8, 9],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-15T08:10" },
      { by: "admin", action: "รอการดำเนินงาน", time: "2025-01-15T08:11" },
    ],
  },

  {
    id: 17,
    JobId: "JOB_017",
    title: "ล้างแอร์โถงต้อนรับ อาคาร A",
    description:
      "ทำความสะอาดคอยล์ร้อนและคอยล์เย็น รวมทั้งถอดล้างถาดน้ำทิ้ง เพื่อลดกลิ่นอับ",
    category: "แอร์",
    priority: "medium",
    status: "สำเร็จ",
    createdAt: "2025-01-13T13:00",
    assignedAt: "2025-01-13T14:00",
    dueDate: "2025-01-14T18:00",
    completedAt: "2025-01-14T11:20",
    approvedAt: "2025-01-14T15:00",
    customer: {
      name: "ประชาสัมพันธ์",
      phone: "0829998887",
      address: "โถงต้อนรับ อาคาร A",
    },
    technicianReport: {
      detail:
        "ล้างแอร์ 2 ตัว ตรวจเช็คการทำงานแล้ว เย็นปกติ เสียงเงียบลง",
      materialsUsed: ["น้ำยาล้างคอยล์", "ผ้าทำความสะอาด"],
      cost: 200,
    },
    rejectReason: null,
    userId: 2,
    supervisorId: 3,
    technicianId: [13, 16],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-13T13:00" },
      { by: "supervisor", action: "มอบหมายทีมแอร์", time: "2025-01-13T14:00" },
      { by: "technician", action: "เริ่มงาน", time: "2025-01-14T09:00" },
      { by: "technician", action: "ปิดงาน", time: "2025-01-14T11:20" },
    ],
  },

  {
    id: 18,
    JobId: "JOB_018",
    title: "ตรวจเช็คปั๊มน้ำดาดฟ้า",
    description:
      "แรงดันน้ำในอาคารลดลงเป็นช่วง ตรวจสอบการทำงานของปั๊มน้ำและวาล์วหลัก",
    category: "ประปา",
    priority: "high",
    status: "รอการตรวจสอบ",
    createdAt: "2025-01-15T10:30",
    assignedAt: "2025-01-15T11:00",
    dueDate: "2025-01-16T18:00",
    completedAt: null,
    approvedAt: null,
    customer: {
      name: "ฝ่ายอาคารรวม",
      phone: "0834567890",
      address: "ดาดฟ้าอาคารกลาง",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 3,
    supervisorId: 4,
    technicianId: [21, 22],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-15T10:30" },
      { by: "supervisor", action: "รอการตรวจสอบ", time: "2025-01-15T11:00" },
    ],
  },

  {
    id: 19,
    JobId: "JOB_019",
    title: "สัญญาณอินเทอร์เน็ตห้องประชุมขาดช่วง",
    description:
      "ผู้ใช้แจ้งว่าสัญญาณเน็ตหลุดบ่อยขณะประชุมออนไลน์ ต้องตรวจสอบสวิตช์และสาย LAN",
    category: "ระบบสื่อสาร",
    priority: "high",
    status: "กำลังทำงาน",
    createdAt: "2025-01-15T09:50",
    assignedAt: "2025-01-15T10:10",
    dueDate: "2025-01-15T17:00",
    completedAt: null,
    approvedAt: null,
    customer: {
      name: "ฝ่ายประชุม",
      phone: "0812345670",
      address: "ห้องประชุมใหญ่ ชั้น 2",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 4,
    supervisorId: 2,
    technicianId: [40, 42],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-15T09:50" },
      { by: "supervisor", action: "มอบหมายช่างระบบสื่อสาร", time: "2025-01-15T10:10" },
      { by: "technician", action: "เริ่มตรวจสอบหน้างาน", time: "2025-01-15T10:40" },
    ],
  },

  {
    id: 20,
    JobId: "JOB_020",
    title: "ซ่อมเก้าอี้ห้องประชุมล้อหลุด",
    description:
      "เก้าอี้สำนักงานในห้องประชุมล้อหลุดออกจากขาเก้าอี้ ต้องใส่ล้อใหม่และขันให้แน่น",
    category: "ทั่วไป",
    priority: "low",
    status: "สำเร็จ",
    createdAt: "2025-01-12T09:20",
    assignedAt: "2025-01-12T09:45",
    dueDate: "2025-01-13T18:00",
    completedAt: "2025-01-12T14:10",
    approvedAt: "2025-01-12T16:00",
    customer: {
      name: "ฝ่ายอาคาร",
      phone: "0817776665",
      address: "ห้องประชุมเล็ก ชั้น 3",
    },
    technicianReport: {
      detail: "เปลี่ยนล้อใหม่ 2 จุด ตรวจสอบแล้วใช้งานได้ปกติ",
      materialsUsed: ["ล้อเก้าอี้สำรอง 2 ชิ้น"],
      cost: 80,
    },
    rejectReason: null,
    userId: 2,
    supervisorId: 4,
    technicianId: [26],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-12T09:20" },
      { by: "supervisor", action: "มอบหมายงานช่างทั่วไป", time: "2025-01-12T09:45" },
      { by: "technician", action: "ปิดงาน", time: "2025-01-12T14:10" },
    ],
  },

  {
    id: 21,
    JobId: "JOB_021",
    title: "เบรกเกอร์ย่อยตัดบ่อย ห้องปฏิบัติการคอมพิวเตอร์",
    description:
      "เบรกเกอร์ย่อยวงจรปลั๊กคอมตัดบ่อยเวลาเปิดเครื่องพร้อมกันทุกเครื่อง ต้องตรวจโหลดและจุดต่อสาย",
    category: "ไฟฟ้า",
    priority: "high",
    status: "กำลังทำงาน",
    createdAt: "2025-01-16T09:15",
    assignedAt: "2025-01-16T09:40",
    dueDate: "2025-01-16T18:00",
    completedAt: null,
    approvedAt: null,
    customer: {
      name: "ฝ่ายคอมพิวเตอร์",
      phone: "0819090909",
      address: "ห้อง Lab คอมพิวเตอร์ ชั้น 4",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 1,
    supervisorId: 2,
    technicianId: [9, 10, 27],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-16T09:15" },
      { by: "supervisor", action: "มอบหมายทีมไฟฟ้า", time: "2025-01-16T09:40" },
      { by: "technician", action: "เริ่มงาน", time: "2025-01-16T10:20" },
    ],
  },

  {
    id: 22,
    JobId: "JOB_022",
    title: "แอร์ห้องผู้บริหารมีน้ำหยด",
    description:
      "มีน้ำหยดจากแอร์ลงพื้นห้อง ต้องเช็คท่อน้ำทิ้งแอร์และระดับเครื่อง",
    category: "แอร์",
    priority: "medium",
    status: "รอการตรวจสอบ",
    createdAt: "2025-01-16T11:20",
    assignedAt: "2025-01-16T11:45",
    dueDate: "2025-01-17T18:00",
    completedAt: null,
    approvedAt: null,
    customer: {
      name: "เลขานุการผู้บริหาร",
      phone: "0823332221",
      address: "ห้องผู้บริหาร ชั้น 6",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 2,
    supervisorId: 3,
    technicianId: [15, 31],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-16T11:20" },
      { by: "supervisor", action: "รอการตรวจสอบ", time: "2025-01-16T11:45" },
    ],
  },

  {
    id: 23,
    JobId: "JOB_023",
    title: "ซ่อมก๊อกน้ำอ่างล้างมือหลวม",
    description:
      "ก๊อกน้ำอ่างล้างมือหมุนได้รอบฐาน มีน้ำซึม ต้องถอดอุดเกลียวและขันใหม่",
    category: "ประปา",
    priority: "low",
    status: "ตีกลับ",
    createdAt: "2025-01-14T10:40",
    assignedAt: "2025-01-14T11:00",
    dueDate: "2025-01-15T18:00",
    completedAt: "2025-01-15T09:30",
    approvedAt: null,
    customer: {
      name: "ฝ่ายแม่บ้าน",
      phone: "0815553332",
      address: "ห้องน้ำชั้น 1",
    },
    technicianReport: {
      detail:
        "ขันก๊อกน้ำใหม่และใช้เทปพันเกลียว แต่รูปถ่ายก่อนปิดงานถ่ายไม่ครบทุกมุม",
      materialsUsed: ["เทปพันเกลียว"],
      cost: 15,
    },
    rejectReason: "ขอรูปเพิ่มเติมมุมด้านข้างและด้านล่างอ่าง",
    userId: 3,
    supervisorId: 4,
    technicianId: [23],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-14T10:40" },
      { by: "supervisor", action: "มอบหมายทีมประปา", time: "2025-01-14T11:00" },
      { by: "technician", action: "ปิดงานรอตรวจสอบ", time: "2025-01-15T09:30" },
      { by: "supervisor", action: "ตีกลับขอรูปเพิ่ม", time: "2025-01-15T10:10" },
    ],
  },

  {
    id: 24,
    JobId: "JOB_024",
    title: "ตั้งค่า VLAN แยกเครือข่ายแขกและพนักงาน",
    description:
      "องค์กรต้องการแยกเครือข่าย Wi-Fi สำหรับแขกและพนักงาน ต้องตั้งค่า VLAN บนสวิตช์และ Access Point",
    category: "ระบบสื่อสาร",
    priority: "medium",
    status: "สำเร็จ",
    createdAt: "2025-01-10T09:00",
    assignedAt: "2025-01-10T09:30",
    dueDate: "2025-01-11T18:00",
    completedAt: "2025-01-11T15:20",
    approvedAt: "2025-01-11T16:00",
    customer: {
      name: "ฝ่าย IT",
      phone: "0818887776",
      address: "ศูนย์เครือข่าย ชั้น 2",
    },
    technicianReport: {
      detail:
        "สร้าง VLAN แยกแขกและพนักงาน ทดสอบการเชื่อมต่อแล้วใช้งานได้ปกติ",
      materialsUsed: [],
      cost: 0,
    },
    rejectReason: null,
    userId: 4,
    supervisorId: 2,
    technicianId: [40, 41],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-10T09:00" },
      { by: "supervisor", action: "มอบหมายงาน", time: "2025-01-10T09:30" },
      { by: "technician", action: "ตั้งค่าและทดสอบระบบ", time: "2025-01-11T14:00" },
      { by: "technician", action: "ปิดงาน", time: "2025-01-11T15:20" },
    ],
  },

  {
    id: 25,
    JobId: "JOB_025",
    title: "ซ่อมโต๊ะทำงานขาโยก",
    description:
      "โต๊ะทำงานในห้องบัญชีมีอาการขาโยก ต้องขันน็อตและเสริมโครงเพิ่ม",
    category: "ทั่วไป",
    priority: "medium",
    status: "รอการตรวจสอบ",
    createdAt: "2025-01-16T14:30",
    assignedAt: "2025-01-16T15:00",
    dueDate: "2025-01-18T18:00",
    completedAt: null,
    approvedAt: null,
    customer: {
      name: "ฝ่ายบัญชี",
      phone: "0816665554",
      address: "ห้องบัญชี ชั้น 3",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 2,
    supervisorId: 4,
    technicianId: [28],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-16T14:30" },
      { by: "supervisor", action: "รอการตรวจสอบ", time: "2025-01-16T15:00" },
    ],
  },

  {
    id: 26,
    JobId: "JOB_026",
    title: "เปลี่ยนหลอดไฟฉุกเฉินทางออกหนีไฟ",
    description:
      "หลอดไฟฉุกเฉินโถงบันไดหนีไฟดับ ต้องเปลี่ยนแบตเตอรี่และตรวจเช็คการทำงาน",
    category: "ไฟฟ้า",
    priority: "high",
    status: "กำลังทำงาน",
    createdAt: "2025-01-17T09:00",
    assignedAt: "2025-01-17T09:20",
    dueDate: "2025-01-17T18:00",
    completedAt: null,
    approvedAt: null,
    customer: {
      name: "ฝ่ายความปลอดภัย",
      phone: "0813332221",
      address: "โถงบันไดหนีไฟทุกชั้น",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 1,
    supervisorId: 2,
    technicianId: [5, 11, 29],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-17T09:00" },
      { by: "supervisor", action: "มอบหมายทีมไฟฟ้า", time: "2025-01-17T09:20" },
      { by: "technician", action: "กำลังดำเนินการเปลี่ยนหลอด", time: "2025-01-17T10:10" },
    ],
  },

  {
    id: 27,
    JobId: "JOB_027",
    title: "ล้างคอยล์ร้อนคอมเพรสเซอร์โซนหลังอาคาร",
    description:
      "คอมเพรสเซอร์แอร์โซนหลังอาคารทำงานเสียงดังและร้อนจัด ต้องล้างคอยล์ร้อนและตรวจเช็คพัดลม",
    category: "แอร์",
    priority: "high",
    status: "กำลังทำงาน",
    createdAt: "2025-01-17T10:15",
    assignedAt: "2025-01-17T10:30",
    dueDate: "2025-01-18T18:00",
    completedAt: null,
    approvedAt: null,
    customer: {
      name: "ฝ่ายอาคาร",
      phone: "0821112223",
      address: "โซนคอมเพรสเซอร์หลังอาคาร",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 2,
    supervisorId: 3,
    technicianId: [16, 17, 33],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-17T10:15" },
      { by: "supervisor", action: "มอบหมายทีมแอร์", time: "2025-01-17T10:30" },
      { by: "technician", action: "กำลังล้างคอยล์", time: "2025-01-17T11:20" },
    ],
  },

  {
    id: 28,
    JobId: "JOB_028",
    title: "ซ่อมท่อน้ำดีรั่วฝ้าเพดานโถงกลาง",
    description:
      "พบคราบน้ำซึมบนฝ้าเพดานโถงกลาง ตรวจสอบพบว่าท่อน้ำดีรั่ว ต้องตัดต่อท่อใหม่และเปลี่ยนฝ้าบางส่วน",
    category: "ประปา",
    priority: "urgent",
    status: "รอการดำเนินงาน",
    createdAt: "2025-01-17T08:40",
    assignedAt: null,
    dueDate: "2025-01-18T18:00",
    completedAt: null,
    approvedAt: null,
    customer: {
      name: "ฝ่ายอาคารกลาง",
      phone: "0810009998",
      address: "โถงกลาง ชั้น 1",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 3,
    supervisorId: 4,
    technicianId: [35, 37, 39],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-17T08:40" },
      { by: "admin", action: "รอการดำเนินงาน", time: "2025-01-17T08:41" },
    ],
  },

  {
    id: 29,
    JobId: "JOB_029",
    title: "ตรวจสอบระบบ Wi-Fi โซนคาเฟ่",
    description:
      "ลูกค้าแจ้งว่า Wi-Fi โซนคาเฟ่อินเทอร์เน็ตช้า ต้องตรวจสอบช่องสัญญาณและตำแหน่ง AP",
    category: "ระบบสื่อสาร",
    priority: "medium",
    status: "รอการตรวจสอบ",
    createdAt: "2025-01-16T16:00",
    assignedAt: "2025-01-16T16:30",
    dueDate: "2025-01-17T18:00",
    completedAt: null,
    approvedAt: null,
    customer: {
      name: "คาเฟ่อาคาร A",
      phone: "0829090807",
      address: "ชั้น 1 โซนคาเฟ่",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 4,
    supervisorId: 2,
    technicianId: [41],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-16T16:00" },
      { by: "supervisor", action: "รอการตรวจสอบ", time: "2025-01-16T16:30" },
    ],
  },

  {
    id: 30,
    JobId: "JOB_030",
    title: "ปรับระดับประตูบานเลื่อนห้องเก็บของ",
    description:
      "ประตูบานเลื่อนปิดไม่สนิทและฝืด ต้องปรับรางเลื่อนและตรวจเช็คน็อตยึด",
    category: "ทั่วไป",
    priority: "low",
    status: "กำลังทำงาน",
    createdAt: "2025-01-17T13:10",
    assignedAt: "2025-01-17T13:30",
    dueDate: "2025-01-18T18:00",
    completedAt: null,
    approvedAt: null,
    customer: {
      name: "ฝ่ายคลังอุปกรณ์",
      phone: "0812123434",
      address: "ห้องเก็บของ ชั้นใต้ดิน",
    },
    technicianReport: null,
    rejectReason: null,
    userId: 2,
    supervisorId: 4,
    technicianId: [27, 28],
    image: Image,
    loc: randomLocation(),
    logs: [
      { by: "admin", action: "สร้างใบงาน", time: "2025-01-17T13:10" },
      { by: "supervisor", action: "มอบหมายงาน", time: "2025-01-17T13:30" },
      { by: "technician", action: "กำลังปรับระดับประตู", time: "2025-01-17T14:00" },
    ],
  },
];

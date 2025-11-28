import { StaticImageData } from "next/image";
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
  completedAt?: string;
  dateRange: {
    startAt: string | null;
    endAt: string | null;
  };
  userId: number | null;
  supervisorId: number;
  technicianId: number[];
  image: StaticImageData;
  loc?: {
    lat: number;
    lng: number;
  };
  category?: "ไฟฟ้า" | "แอร์" | "ประปา" | "ระบบสื่อสาร" | "ทั่วไป";
  customer?: {
    name: string;
    phone: string;
    address: string;
    sign: string;
  };
  technicianReport?: {
    detail: string;
    inspectionResults?: string;
    materialsUsed: string[];
    cost?: number;
    repairOperations?: string;
    summaryOfOperatingResults?: string;
    technicianSignature?: string | null;
    customerSignature?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    imagesBefore?: string[];
    imagesAfter?: string[];
  } | null;
  rejectReason?: string | null;
};
export const CardWork: CardWorkTypes[] = [
  {
    id: 1,
    JobId: "JOB_001",
    title: "ไฟชั้น 5 ดับเป็นช่วง ๆ",
    description: "ไฟฟ้าบางจุดติดบ้างดับบ้าง มีเสียงดังจากตู้เมน",
    status: "สำเร็จ",
    createdAt: "2025-11-27T09:10:00.000Z",
    completedAt: "2025-11-28T10:45:00.000Z",
    dateRange: {
      startAt: "2025-11-27T00:00:00",
      endAt: "2025-11-29T00:00:00",
    },
    userId: 100,
    supervisorId: 2,
    technicianId: [5, 6],
    image: "" as any,
    loc: { lat: 13.8554, lng: 100.5855 },
    category: "ไฟฟ้า",
    customer: {
      name: "สมชาย สมบูรณ์",
      phone: "081-234-5678",
      address: "อาคาร A ชั้น 5",
      sign: "",
    },
    technicianReport: {
      detail: "ไฟฟ้าชั้น 5 ดับเป็นช่วง ๆ",
      inspectionResults: "พบจุดต่อสายหลวมในตู้เมน",
      materialsUsed: ["คีมย้ำสาย", "เทปพันสายไฟ"],
      cost: 250,
      repairOperations: "ขันจุดต่อสายใหม่และทำความสะอาดจุดสัมผัส",
      summaryOfOperatingResults: "ระบบไฟทำงานปกติ",
      technicianSignature: "",
      customerSignature: "",
      startTime: "2025-11-28T08:00:00",
      endTime: "2025-11-28T10:30:00",
      imagesBefore: [],
      imagesAfter: [],
    },
  },

  {
    id: 2,
    JobId: "JOB_002",
    title: "แอร์ไม่เย็น ชั้น 3",
    description: "แอร์มีเสียงดังและลมออกเบา",
    status: "กำลังทำงาน",
    createdAt: "2025-11-25T14:20:00.000Z",
    dateRange: {
      startAt: "2025-11-26T00:00:00",
      endAt: "2025-11-28T00:00:00",
    },
    userId: 100,
    supervisorId: 2,
    technicianId: [7],
    image: "" as any,
    loc: { lat: 13.8531, lng: 100.5829 },
    category: "แอร์",
    customer: {
      name: "บริษัท คิวเทค จำกัด",
      phone: "02-123-4567",
      address: "อาคาร B ชั้น 3",
      sign: "",
    },
    technicianReport: null,
  },

  {
    id: 3,
    JobId: "JOB_003",
    title: "น้ำรั่วที่ท่อน้ำทิ้งห้องน้ำ",
    description: "น้ำซึมตามท่อทำให้พื้นเปียก",
    status: "รอการตรวจสอบ",
    createdAt: "2025-11-26T09:50:00.000Z",
    dateRange: {
      startAt: "2025-11-27T00:00:00",
      endAt: "2025-11-30T00:00:00",
    },
    userId: 120,
    supervisorId: 3,
    technicianId: [],
    image: "" as any,
    loc: { lat: 13.8561, lng: 100.5842 },
    category: "ประปา",
    customer: {
      name: "อรวรรณ รุ่งเรือง",
      phone: "089-987-6543",
      address: "ห้องน้ำชั้น 2",
      sign: "",
    },
    technicianReport: null,
  },

  {
    id: 4,
    JobId: "JOB_004",
    title: "ระบบอินเทอร์เน็ตล่ม",
    description: "ไม่สามารถใช้งาน WiFi และ LAN",
    status: "ตีกลับ",
    createdAt: "2025-11-20T12:00:00.000Z",
    dateRange: {
      startAt: "2025-11-20T00:00:00",
      endAt: "2025-11-22T00:00:00",
    },
    userId: 140,
    supervisorId: 4,
    technicianId: [9],
    image: "" as any,
    loc: { lat: 13.8577, lng: 100.5831 },
    category: "ระบบสื่อสาร",
    customer: {
      name: "บริษัท สมาร์ทคอม",
      phone: "02-998-1122",
      address: "ชั้น 7",
      sign: "",
    },
    technicianReport: {
      detail: "เน็ตล่มเป็นระยะ",
      inspectionResults: "สาย LAN ชำรุด",
      materialsUsed: ["สาย LAN CAT6 5m"],
      cost: 150,
      repairOperations: "เปลี่ยนสายใหม่",
      summaryOfOperatingResults: "เชื่อมต่อได้ปกติ",
      technicianSignature: "",
      customerSignature: "",
      startTime: "2025-11-21T10:00:00",
      endTime: "2025-11-21T11:00:00",
      imagesBefore: [],
      imagesAfter: [],
    },
    rejectReason: "ข้อมูลไม่ครบ ต้องแนบรูปก่อน-หลัง",
  },

  {
    id: 5,
    JobId: "JOB_005",
    title: "ไฟสำนักงานกระพริบ",
    description: "หลอดไฟ LED กระพริบตลอดเวลา",
    status: "รอการดำเนินงาน",
    createdAt: "2025-11-28T05:30:00.000Z",
    dateRange: {
      startAt: "2025-11-28T00:00:00",
      endAt: "2025-12-01T00:00:00",
    },
    userId: 141,
    supervisorId: 2,
    technicianId: [],
    image: "" as any,
    loc: { lat: 13.8543, lng: 100.5868 },
    category: "ไฟฟ้า",
    customer: {
      name: "สนง.ฝ่ายบัญชี",
      phone: "02-389-1234",
      address: "ชั้น 4",
      sign: "",
    },
    technicianReport: null,
  },

  {
    id: 6,
    JobId: "JOB_006",
    title: "ประตูห้องเซิร์ฟเวอร์ปิดไม่สนิท",
    description: "บานพับหลวม ทำให้ประตูไม่ปิดแน่น",
    status: "กำลังทำงาน",
    createdAt: "2025-11-26T11:15:00.000Z",
    dateRange: {
      startAt: "2025-11-27T00:00:00",
      endAt: "2025-11-29T00:00:00",
    },
    userId: 150,
    supervisorId: 3,
    technicianId: [12],
    image: "" as any,
    loc: { lat: 13.8537, lng: 100.5879 },
    category: "ทั่วไป",
    customer: {
      name: "ณัฐวุฒิ พันธ์ดี",
      phone: "086-123-9988",
      address: "ห้องเซิร์ฟเวอร์ ชั้น 1",
      sign: "",
    },
    technicianReport: null,
  },
];


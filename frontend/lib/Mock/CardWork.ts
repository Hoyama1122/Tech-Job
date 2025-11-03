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
    | "รอการหมอบหมายงาน";
  date: string;
  supervisorId: number;

  sla: string;
  userId: number;
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
    date: "2025-01-15 15:05",
    sla: "20m",
    userId: 1,
    supervisorId: 1,
    image: Image,
    loc: randomLocation(),
  },
  {
    id: 2,
    JobId: "JOB_002",
    title: "ซ่อมแอร์ห้องประชุมใหญ่",
    description: "แอร์ไม่เย็น ตรวจสอบระบบคอมเพรสเซอร์และน้ำยาแอร์",
    status: "กำลังทำงาน",
    date: "2025-01-14 10:32",
    sla: "30m",
    userId: 2,
    supervisorId: 2,
    image: Image,
    loc: randomLocation(),
  },
  {
    id: 3,
    JobId: "JOB_003",
    title: "เปลี่ยนหลอดไฟโถงกลาง อาคาร B",
    description: "หลอดไฟชั้น 2 ดับทั้งแถว ต้องเปลี่ยนใหม่ทั้งหมด",
    status: "สำเร็จ",
    date: "2025-01-13 09:15",
    sla: "25m",
    userId: 3,
    supervisorId: 1,
    image: Image,
    loc: randomLocation(),
  },
  {
    id: 4,
    JobId: "JOB_004",
    title: "ตรวจสอบระบบน้ำรั่ว อาคาร C",
    description: "น้ำหยดจากเพดาน คาดว่าท่อรั่ว ตรวจหาจุดรั่ว",
    status: "ตีกลับ",
    date: "2025-01-12 16:00",
    sla: "45m",
    userId: 4,
    supervisorId: 1,
    image: Image,
    loc: randomLocation(),
  },
  {
    id: 5,
    JobId: "JOB_005",
    title: "ติดตั้งปลั๊กไฟห้องทำงานใหม่",
    description: "เพิ่มปลั๊กไฟสำหรับอุปกรณ์ IT และเครื่องถ่ายเอกสาร",
    status: "รอการตรวจสอบ",
    date: "2025-01-11 14:25",
    sla: "20m",
    userId: 5,
    supervisorId: 1,
    image: Image,
    loc: randomLocation(),
  },
  {
    id: 6,
    JobId: "JOB_006",
    title: "เปลี่ยนกรองน้ำระบบกลาง",
    description: "ระบบกรองน้ำไม่ผ่าน ต้องเปลี่ยนไส้กรองใหม่ทั้งหมด",
    status: "รอการอนุมัติ",
    date: "2025-01-10 13:00",
    sla: "35m",
    userId: 6,
    supervisorId: 2,
    image: Image,
    loc: randomLocation(),
  },
  {
    id: 7,
    JobId: "JOB_007",
    title: "ซ่อมระบบ Wi-Fi อาคาร D",
    description: "สัญญาณ Wi-Fi ชั้น 4 ขาด ๆ หาย ๆ ตรวจสอบ Access Point",
    status: "รอการตรวจสอบ",
    date: "2025-01-09 10:40",
    sla: "40m",
    userId: 7,
    supervisorId: 2,

    image: Image,
    loc: randomLocation(),
  },
  {
    id: 8,
    JobId: "JOB_008",
    title: "ทำความสะอาดระบบปรับอากาศ",
    description: "ล้างแผงคอยล์เย็นและเปลี่ยนกรองอากาศใหม่",
    status: "สำเร็จ",
    date: "2025-01-08 09:20",
    sla: "25m",
    userId: 8,
    supervisorId: 1,

    image: Image,
    loc: randomLocation(),
  },
  {
    id: 9,
    JobId: "JOB_009",
    title: "ตรวจสอบระบบแจ้งเตือนไฟไหม้",
    description: "ทดสอบระบบสัญญาณไฟและเสียงแจ้งเตือน",
    status: "รอการตรวจสอบ",
    date: "2025-01-07 15:50",
    sla: "15m",
    userId: 9,
    supervisorId: 1,

    image: Image,
    loc: randomLocation(),
  },
  {
    id: 10,
    JobId: "JOB_010",
    title: "ซ่อมบานประตูห้องน้ำหญิง",
    description: "บานพับหลวมและกลอนประตูไม่ทำงาน",
    status: "ตีกลับ",
    date: "2025-01-06 11:45",
    sla: "10m",
    supervisorId: 2,

    userId: 10,
    image: Image,
    loc: randomLocation(),
  },
];

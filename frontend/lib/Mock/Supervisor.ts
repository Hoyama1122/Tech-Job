import  Somchai  from "@/public/supervisor/somchai.jpg";
import  Anucha  from "@/public/supervisor/Anucha.jpg";
import { StaticImageData } from "next/image";
type SupervisorType = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  image: StaticImageData;
};

export const Supervisor: SupervisorType[] = [
  {
    id: 1,
    name: "สมชาย กุลชัย",
    email: "lM6QW@example.com",
    role: "Supervisor",
    department: "IT",
    status: "ว่าง",
    image: Somchai,
  },
  {
    id: 2,
    name: "อนุชา แซ่ลี้",
    email: "anu@example.com",
    role: "Supervisor",
    department: "Maintenance",
    status: "กำลังทำงาน",
    image: Anucha,
  },
];


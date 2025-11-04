import  Somchai  from "@/public/supervisor/somchai.jpg";
import  Anucha  from "@/public/supervisor/Anucha.jpg";
import { StaticImageData } from "next/image";
type SupervisorType = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  image: StaticImageData;
};

export const Supervisor: SupervisorType[] = [
  {
    id: 1,
    name: "สมชาย กุลชัย",
    email: "somchai@gmail.com",
    role: "Supervisor",
    department: "ช่างไฟฟ้า",
    image: Somchai,
  },
  {
    id: 2,
    name: "อนุชา แซ่ลี้",
    email: "anucha@gmail.com",
    role: "Supervisor",
    department: "ช่างแอร์",
    image: Anucha,
  },
];


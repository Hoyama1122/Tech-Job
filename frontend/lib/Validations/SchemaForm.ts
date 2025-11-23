import { z } from "zod";

export const workSchema = z
  .object({
    title: z
      .string()
      .min(3, "กรุณากรอกชื่อใบงานอย่างน้อย 3 ตัวอักษร")
      .max(100, "ชื่อใบงานยาวเกินไป"),
    description: z.string().optional(),

    supervisorId: z.string().min(1, "กรุณาเลือกหัวหน้างาน"),

    date: z.string().min(1, "กรุณาเลือกวันที่นัดหมาย"),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    category: z.string().min(1, "กรุณาเลือกประเภทงาน"),
    technicianId: z.array(z.number()).min(1, "กรุณาเลือกช่างอย่างน้อย 1 คน"),

    customerName: z.string().min(1, "กรุณาระบุชื่อลูกค้า"),
    customerPhone: z
      .string()
      .min(10, "เบอร์โทรต้องมีอย่างน้อย 10 หลัก")
      .regex(/^[0-9-+\s]+$/, "รูปแบบเบอร์โทรไม่ถูกต้อง เช่น 0812345678"),
    address: z.string().min(1, "กรุณาระบุที่อยู่ลูกค้า"),
    image: z.any().optional(),
  })

  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.endTime > data.startTime;
      }
      return true;
    },
    {
      message: "เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น",
      path: ["endTime"],
    }
  );

export type WorkFormValues = z.infer<typeof workSchema>;

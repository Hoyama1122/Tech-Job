import { z } from "zod";

export const workSchema = z
  .object({
    title: z
      .string()
      .min(3, "กรุณากรอกชื่อใบงานอย่างน้อย 3 ตัวอักษร")
      .max(100, "ชื่อใบงานยาวเกินไป"),
    description: z.string().optional(),
    supervisorId: z.string().min(1, "กรุณาเลือกหัวหน้างาน"),
    date: z.string().min(1, "กรุณาเลือกวันที่ทำงาน"),
    startTime: z.string().min(1, "กรุณาเลือกเวลาเริ่มต้น"),
    endTime: z.string().min(1, "กรุณาเลือกเวลาสิ้นสุด"),

    //  เพิ่มส่วนข้อมูลลูกค้า
    customerName: z.string().min(1, "กรุณาระบุชื่อลูกค้า"),
    customerPhone: z
      .string()
      .min(10, "เบอร์โทรต้องมีอย่างน้อย 10 หลัก")
      .regex(/^[0-9-+\s]+$/, "รูปแบบเบอร์โทรไม่ถูกต้อง"),
    address: z.string().min(1, "กรุณาระบุที่อยู่"),

    // เพิ่ม image ให้ zod รู้จัก
    image: z.any().optional(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น",
    path: ["endTime"],
  });

export type WorkFormValues = z.infer<typeof workSchema>;

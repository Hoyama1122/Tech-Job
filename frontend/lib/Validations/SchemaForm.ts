import { z } from "zod";

export const workSchema = z
  .object({
    title: z
      .string()
      .min(3, "กรุณากรอกชื่อใบงานอย่างน้อย 3 ตัวอักษร")
      .max(100, "ชื่อใบงานยาวเกินไป"),
    description: z.string().optional(),
    supervisorId: z.string().min(1, "กรุณาเลือกหัวหน้างาน"),
    dueDate: z.string().min(1, "กรุณาเลือกวันที่ทำงาน"),
    startTime: z.string().min(1, "กรุณาเลือกเวลาเริ่มต้น"),
    endTime: z.string().min(1, "กรุณาเลือกเวลาสิ้นสุด"),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น",
    path: ["endTime"],
  });

export type WorkFormValues = z.infer<typeof workSchema>;

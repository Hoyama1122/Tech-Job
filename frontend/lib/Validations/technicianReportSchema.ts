// lib/Validations/technicianReportSchema.ts
import { z } from "zod";

export const technicianReportSchema = z.object({
  detail: z
    .string()
    .min(1, "กรุณากรอกรายละเอียดอาการ")
    .min(10, "รายละเอียดอาการควรมีอย่างน้อย 10 ตัวอักษร"),
  inspectionResults: z.string().min(1, "กรุณากรอกรายละเอียดผลการตรวจสอบ"),
  repairOperations: z.string().min(1, "กรุณากรอกรายละเอียดการซ่อมแซม"),
  summaryOfOperatingResults: z.string().min(1, "กรุณากรอกรายละเอียดสรุปผลการดำเนินงาน"),
  customerSignature: z
    .string()
    .min(1, "กรุณาเซ็นลายเซ็นลูกค้า"),
  items: z.array(z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
    quantity: z.number().min(1, "จำนวนต้องมากกว่า 0"),
    unit: z.string(),
    type: z.enum(["EQUIPMENT", "MATERIAL"])
  })).optional()
});

export type TechnicianReportForm = z.infer<typeof technicianReportSchema>;

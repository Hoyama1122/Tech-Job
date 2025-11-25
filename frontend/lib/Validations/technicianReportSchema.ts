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
  technicianSignature: z
    .string()
    .min(1, "กรุณาเซ็นลายเซ็นช่าง"),
  customerSignature: z
    .string()
    .min(1, "กรุณาเซ็นลายเซ็นลูกค้า"),
});

export type TechnicianReportForm = z.infer<typeof technicianReportSchema>;

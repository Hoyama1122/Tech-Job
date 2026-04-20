import { z } from "zod";

export const workSchema = z
  .object({
    title: z
      .string()
      .min(3, "กรุณากรอกชื่อใบงานอย่างน้อย 3 ตัวอักษร")
      .max(100, "ชื่อใบงานยาวเกินไป"),
    description: z.string().optional(),
    supervisorId: z.union([z.string(), z.number()]).refine(val => !!val, "กรุณาเลือกหัวหน้างาน"),
    dateRange: z.object({
      startAt: z.string().min(1, "กรุณาเลือกวันเริ่ม"),
      endAt: z.string().min(1, "กรุณาเลือกวันสิ้นสุด"),
    }),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    category: z.union([z.string(), z.number()]).refine(val => !!val, "กรุณาเลือกประเภทงาน"),
    technicianId: z.array(z.number()).min(1, "กรุณาเลือกช่างอย่างน้อย 1 คน"),
    customername: z.string().min(1, "กรุณาระบุชื่อลูกค้า"),
    customerphone: z
      .string()
      .min(10, "เบอร์โทรต้องมีอย่างน้อย 10 หลัก")
      .regex(/^[0-9-+\s]+$/, "รูปแบบเบอร์โทรไม่ถูกต้อง เช่น 0812345678"),
    address: z.string().min(1, "กรุณาระบุที่อยู่ลูกค้า"),
    image: z.any().optional(),
    // location: z
    //   .object({
    //     lat: z.number().nullable(),
    //     lng: z.number().nullable(),
    //   })
    //   .refine((loc) => loc.lat && loc.lng, {
    //     message: "กรุณาเลือกตำแหน่งบนแผนที่",
    //   }),
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

export const equipmentSchema = z.object({
  code: z.string().min(1, "กรุณากรอกรหัสอุปกรณ์ (Code)"),
  name: z.string().min(1, "กรุณากรอกชื่ออุปกรณ์"),
  model: z.string().optional(),
  brand: z.string().optional(),
  type: z.enum(["EQUIPMENT", "MATERIAL"], {
    errorMap: () => ({ message: "กรุณาเลือกประเภทอุปกรณ์" }),
  }),
  quantity: z.coerce.number().min(0, "จำนวนต้องไม่ติดลบ"),
  unit: z.string().min(1, "กรุณากรอกหน่วยนับ"),
  note: z.string().optional(),
});

export type EquipmentFormValues = z.infer<typeof equipmentSchema>;

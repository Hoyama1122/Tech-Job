"use client";

import { FileDiff, FileText, ImageUp, Loader2 } from "lucide-react";
import React, { useState } from "react";
import DropdownSupervisor from "./DropdownSupervisor";
import { FormProvider, useForm } from "react-hook-form";
import { WorkFormValues, workSchema } from "@/lib/Validations/SchemaForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Image from "next/image";
import DropdownCategory from "./DropdownCategory";
import Map from "../Map/Map";
import DatePickerTH from "@/components/DueDate/Date";

const WorkForm = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string[]>([]);
  const methods = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = methods;

  const convertToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    if (files.length > 6) return toast.warning("อัปโหลดได้สูงสุด 6 รูป");
    setValue("image", files);
    setPreview(Array.from(files).map(URL.createObjectURL));
  };

  const removeImage = (index: number) => {
    const newPreviews = preview.filter((_, i) => i !== index);
    setPreview(newPreviews);
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dt = new DataTransfer();
    if (input?.files) {
      Array.from(input.files).forEach(
        (file, i) => i !== index && dt.items.add(file)
      );
      setValue("image", dt.files);
    }
  };

  const handlePhoneInput = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3 && value.length <= 6) {
      value = value.replace(/(\d{3})(\d+)/, "$1-$2");
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3");
    }
    e.target.value = value.slice(0, 12);
  };

const onSubmit = async (data: WorkFormValues) => {
  try {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const current = JSON.parse(localStorage.getItem("CardWork") || "[]");

    // แปลงรูปภาพเป็น base64
    const images = data.image?.length
      ? await Promise.all(Array.from(data.image).map(convertToBase64))
      : [];

    // 🔧 format วันที่นัดหมาย
    let formattedDate = "";
    if (data.date) {
      // ✅ กรณีเป็น yyyy-mm-dd (จาก date picker)
      if (/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
        formattedDate = `${data.date}T${data.startTime || "00:00"}`;
      } else {
        // ✅ กรณีเป็นภาษาไทย (เช่น 15 มกราคม 2568)
        const months: Record<string, number> = {
          มกราคม: 0,
          กุมภาพันธ์: 1,
          มีนาคม: 2,
          เมษายน: 3,
          พฤษภาคม: 4,
          มิถุนายน: 5,
          กรกฎาคม: 6,
          สิงหาคม: 7,
          กันยายน: 8,
          ตุลาคม: 9,
          พฤศจิกายน: 10,
          ธันวาคม: 11,
        };
        const match = data.date.match(/(\d{1,2}) (\S+) (\d{4})/);
        if (match) {
          const [, d, m, y] = match;
          const year = parseInt(y) - 543;
          const month = months[m];
          const day = parseInt(d);
          const hours = data.startTime?.split(":")[0] || "00";
          const minutes = data.startTime?.split(":")[1] || "00";
          formattedDate = new Date(year, month, day, hours, minutes)
            .toISOString()
            .slice(0, 16);
        }
      }
    }

    // 🆕 เวลาสร้างใบงาน
    const now = new Date();

    // 🧩 job object ใหม่
    const newWork = {
      id: current.length + 1,
      JobId: `JOB_${String(current.length + 1).padStart(3, "0")}`,
      title: data.title,
      description: data.description,
     
      date: formattedDate,
      status: "รอการมอบหมายงาน",

      // 🕓 เวลาสำคัญในระบบ
      createdAt: now.toISOString(),
      assignedAt: null,     
      dueDate: null,        
      completedAt: null,
      approvedAt: null,

      // 🧑‍💼 ความสัมพันธ์กับผู้ใช้
      userId: 1, // id ของ admin ที่ login อยู่
      supervisorId: Number(data.supervisorId) || 0,
      technicianId: [],

      // 📷 รูปภาพ + location
      image: images,
      loc: { lat: 13.85, lng: 100.58 },
    };

    // 💾 บันทึกลง localStorage
    localStorage.setItem("CardWork", JSON.stringify([...current, newWork]));

    reset();
    setPreview([]);
    toast.success("เพิ่มใบงานสำเร็จ!");
  } catch (error) {
    console.error(error);
    toast.error("เพิ่มใบงานไม่สำเร็จ!");
  } finally {
    setLoading(false);
  }
};

  console.log(errors);
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {/* Left Column */}
          <div className="bg-white shadow rounded-lg p-6  space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-primary/90 flex items-center gap-2">
                ข้อมูลใบงาน <FileText size={22} />
              </h2>
              <DropdownCategory />
            </div>
            <div className="h-1 w-36 bg-gradient-to-r from-primary to-secondary rounded"></div>

            <div>
              <label className="block text-sm font-medium mb-1">
                ชื่อใบงาน <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title")}
                className="input-field text-sm"
                placeholder="ระบุชื่อใบงาน"
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                คำอธิบายงาน
              </label>
              <textarea
                {...register("description")}
                className="input-field text-sm"
                rows={3}
                placeholder="รายละเอียด"
              />
            </div>

            <DropdownSupervisor />
            {errors.supervisorId && (
              <p className="text-xs text-red-500">
                {errors.supervisorId.message}
              </p>
            )}

            <DatePickerTH/>

            <div>
              <input type="hidden" {...register("image")} />
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <ImageUp size={24} className="text-gray-500" />
                <span className="text-sm font-medium mt-2">กดเพื่ออัปโหลด</span>
                <span className="text-xs text-gray-400">สูงสุด 6 รูป</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </label>

              {preview.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {preview.map((src, i) => (
                    <div key={i} className="relative group">
                      <Image
                        src={src}
                        alt={`preview-${i}`}
                        width={120}
                        height={120}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-white shadow rounded-lg p-6  space-y-4">
            <h2 className="text-xl font-semibold text-primary/90">แผนที่</h2>
            <Map />

            <div>
              <label className="block text-sm font-medium mb-1">
                ชื่อลูกค้า <span className="text-red-500">*</span>
              </label>
              <input
                {...register("customerName")}
                className="input-field text-sm"
                placeholder="กรอกชื่อลูกค้า"
              />
              {errors.customerName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.customerName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                เบอร์โทรศัพท์ลูกค้า <span className="text-red-500">*</span>
              </label>
              <input
                {...register("customerPhone")}
                type="tel"
                className="input-field text-sm"
                placeholder="000-000-0000"
                onInput={handlePhoneInput}
                maxLength={12}
              />
              {errors.customerPhone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.customerPhone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                ที่อยู่ <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("address")}
                className="input-field text-sm"
                rows={3}
                placeholder="กรอกที่อยู่ลูกค้า"
              />
              {errors.address && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button type="submit" disabled={loading} className="button-create">
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <FileDiff size={18} />
            )}
            {loading ? "กำลังสร้าง" : "สร้างใบงาน"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default WorkForm;

"use client";

import {
  AlertCircle,
  FileDiff,
  FileText,
  Home,
  Loader2,
  MapPin,
  Phone,
  Plus,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { WorkFormValues, workSchema } from "@/lib/Validations/SchemaForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Image from "next/image";
import DropdownCategory from "./DropdownCategory";
import Map from "../Map/Map";
import DatePickerTH from "@/components/DueDate/Date";
import DropdownTechnician from "./DropdownTechnician";
import { useRouter } from "next/navigation";

const WorkForm = () => {
  const [loc, setLoc] = useState({ lat: 13.85, lng: 100.58 });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string[]>([]);
  const methods = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      technicianId: [],
    },
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

   
    const images = data.image?.length
      ? await Promise.all(Array.from(data.image).map(convertToBase64))
      : [];

  
    const parseThaiDate = (str: string) => {
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

      const match = str.match(/(\d{1,2}) (\S+) (\d{4})/);
      if (!match) return null;

      const [, d, m, y] = match;

      const year = parseInt(y) - 543;
      const month = months[m];
      const day = parseInt(d);

      return new Date(year, month, day);
    };

    const startDateObj = parseThaiDate(data.date.start);
    const endDateObj = parseThaiDate(data.date.end);

    const startISO = startDateObj
      ? `${startDateObj.toISOString().split("T")[0]}T${
          data.startTime || "00:00"
        }:00`
      : null;

    const endISO = endDateObj
      ? `${endDateObj.toISOString().split("T")[0]}T${
          data.endTime || "00:00"
        }:00`
      : null;

    const now = new Date();

    const newWork = {
      id: current.length + 1,
      JobId: `JOB_${String(current.length + 1).padStart(3, "0")}`,
      title: data.title,
      description: data.description,

    
      dateRange: {
        startAt: startISO,
        endAt: endISO,
      },

      status: "รอการดำเนินงาน",
      createdAt: now.toISOString(),
      assignedAt: null,
      dueDate: null,
      completedAt: null,
      approvedAt: null,

      category: data.category,
      userId: 1,
      supervisorId: Number(data.supervisorId) || 0,
      technicianId: data.technicianId?.map(Number) || [],

      customer: {
        name: data.customerName,
        phone: data.customerPhone,
        address: data.address,
      },

      image: images,
      loc: loc,
    };

 
    localStorage.setItem("CardWork", JSON.stringify([...current, newWork]));

    reset();
    setPreview([]);
    toast.success("เพิ่มใบงานสำเร็จ!");
    router.push("/admin");
  } catch (error) {
    console.error(error);
    toast.error("เพิ่มใบงานไม่สำเร็จ!");
  } finally {
    setLoading(false);
  }
};

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-[1440px] mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {/* Left Column */}
          <div className="bg-white shadow rounded-lg p-4  space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-[12px]">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    ข้อมูลใบงาน
                  </h2>
                  <p className="text-sm text-gray-500">
                    กรอกรายละเอียดงานที่ต้องการสร้าง
                  </p>
                </div>
              </div>
              <DropdownCategory register={register} />
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                ชื่อใบงาน <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title")}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 placeholder-gray-400"
                placeholder="ระบุชื่อใบงานให้ชัดเจน"
              />
              {errors.title && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title.message}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                คำอธิบายงาน
              </label>
              <textarea
                {...register("description")}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 placeholder-gray-400 resize-none"
                rows={4}
                placeholder="รายละเอียดงาน, ข้อมูลเพิ่มเติม, หมายเหตุ..."
              />
            </div>

            <DropdownTechnician />

            <DatePickerTH />
            {errors.date && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
                <AlertCircle className="w-4 h-4" />
                {errors.date.message}
              </div>
            )}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                รูปภาพประกอบ
              </label>
              <input type="hidden" {...register("image")} />

              <label className="inline-flex items-center gap-2 bg-primary px-3 py-1.5 rounded-lg cursor-pointer hover:bg-primary/80 transition text-white text-sm">
                <Plus size={18} />
                เพิ่มรูป
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </label>

              {preview.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {preview.map((src, i) => (
                    <div key={i} className="relative group">
                      <Image
                        src={src}
                        alt={`preview-${i}`}
                        width={120}
                        height={120}
                        className="w-full rounded-lg object-cover shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition"
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
          <div className="bg-white shadow rounded-lg p-4  space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 ">
              <div className="p-[12px]  flex items-center justify-center mt-2">
                <MapPin className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-80 mt-2">
                  ตำแหน่งงาน
                </h2>
                <p className="text-sm text-gray-500">เลือกตำแหน่งในแผนที่</p>
              </div>
            </div>
            <div className="flex ">
              <Map onLocationSelect={(pos) => setLoc(pos)} />
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 text-primary" />
                ชื่อลูกค้า <span className="text-red-500">*</span>
              </label>
              <input
                {...register("customerName")}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 placeholder-gray-400"
                placeholder="กรอกชื่อ-นามสกุลลูกค้า"
              />
              {errors.customerName && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  {errors.customerName.message}
                </div>
              )}
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4 text-primary" />
                เบอร์โทรศัพท์ลูกค้า <span className="text-red-500">*</span>
              </label>
              <input
                {...register("customerPhone")}
                type="tel"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 placeholder-gray-400"
                placeholder="000-000-0000"
                onInput={handlePhoneInput}
                maxLength={12}
              />
              {errors.customerPhone && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  {errors.customerPhone.message}
                </div>
              )}
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Home className="w-4 h-4 text-primary" />
                ที่อยู่ <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("address")}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 placeholder-gray-400 resize-none"
                rows={4}
                placeholder="กรอกที่อยู่ลูกค้า (บ้านเลขที่, หมู่, ซอย, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์)"
              />
              {errors.address && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  {errors.address.message}
                </div>
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

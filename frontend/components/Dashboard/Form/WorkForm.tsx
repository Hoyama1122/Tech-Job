"use client";

import { FileDiff, FileText, ImageUp, Loader2 } from "lucide-react";
import React, { useState } from "react";
import DropdownSupervisor from "./DropdownSupervisor";
import DateField from "@/components/DueDate/Date";
import Time from "@/components/DueDate/Time";
import { FormProvider, useForm } from "react-hook-form";
import { WorkFormValues, workSchema } from "@/lib/Validations/SchemaForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Image from "next/image";
import DropdownCategory from "./DropdownCategory";
import CurrentTime from "@/components/DueDate/CurrentTime";
import Map from "../Map/Map";

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
      const images = data.image?.length
        ? await Promise.all(Array.from(data.image).map(convertToBase64))
        : [];

      const newWork = {
        id: current.length + 1,
        JobId: `หมายใบงาน${current.length + 1}`,
        ...data,
        image: images,
        date: `${data.date} เวลา ${data.startTime} น.`,
        status: "รอการมอบหมายงาน",
        technicianId: [],
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("CardWork", JSON.stringify([...current, newWork]));
      reset();
      setPreview([]);
      toast.success("เพิ่มใบงานสำเร็จ!");
    } catch (error) {
      toast.error("เพิ่มใบงานไม่สำเร็จ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-2">
              <DateField />
              <CurrentTime />
              <Time />
            </div>

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
            <Map/>

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

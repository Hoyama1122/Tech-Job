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

const WorkForm = () => {
  const [Loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string[]>([]); // ✅ สำหรับพรีวิวรูป

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

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const onsubmit = async (data: WorkFormValues) => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1000));

      const current = JSON.parse(localStorage.getItem("CardWork") || "[]");

      //  แปลงรูปภาพทั้งหมดเป็น base64
      const images: string[] = [];
      if (data.image && data.image.length > 0) {
        for (const file of Array.from(data.image)) {
          const base64 = await convertToBase64(file);
          images.push(base64);
        }
      }

      const newWork = {
        id: current.length + 1,
        JobId: "JOB_" + (current.length + 1),
        ...data,
        images,
        status: "รอการมอบหมายงาน",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("CardWork", JSON.stringify([...current, newWork]));
      reset();
      setPreview([]);
      toast.success("เพิ่มใบงานสำเร็จ");
    } catch (error) {
      console.error(error);
      toast.error("เพิ่มใบงานไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onsubmit)}>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="mt-6 bg-white shadow-md rounded-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold mb-2 text-primary/90 flex items-center gap-2">
                  ข้อมูลใบงาน <FileText size={30} />
                </h2>
                <div>
                  <DropdownCategory />
                </div>
              </div>
              <div className="h-[3px] w-[170px] bg-gradient-to-t from-primary to-secondary rounded-full"></div>

              <div className="mt-4 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-lg font-medium text-text mb-1">
                    ชื่อใบงาน <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("title")}
                    type="text"
                    placeholder="โปรดกรอกชื่อใบงาน"
                    className="input-field"
                  />
                  {errors.title ? (
                    <p className="text-xs text-red-500 mt-1 px-2">
                      {errors.title.message}
                    </p>
                  ) : (
                    <p className="text-xs px-2 text-text-secondary mt-1">
                      กรุณาระบุชื่อใบงานให้ชัดเจน
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-lg font-medium text-text mb-1">
                    คำอธิบายงาน
                  </label>
                  <textarea
                    {...register("description")}
                    placeholder="รายละเอียดของงาน"
                    className="input-field"
                  />
                </div>

                {/* Supervisor */}
                <DropdownSupervisor />
                {errors.supervisorId && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.supervisorId.message}
                  </p>
                )}

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <DateField />
                  <Time />
                </div>

                {/* Upload Image */}
                <div className="mt-4">
                  <label className="block text-lg font-medium text-text mb-1">
                    รูปภาพประกอบงาน
                  </label>

                  {/* กล่องอัปโหลด */}
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                      <ImageUp className="text-gray-600" size={32} />
                      <p className="mt-2 text-sm">
                        <span className="font-semibold">
                          กดเพื่ออัปโหลดรูปภาพ
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        (รองรับหลายรูป สูงสุด 6 รูป)
                      </p>
                    </div>

                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          setValue("image", files);
                          const previewURLs = Array.from(files).map((file) =>
                            URL.createObjectURL(file)
                          );
                          setPreview(previewURLs);
                          if (files.length > 6) {
                            toast.warning("อัปโหลดได้สูงสุด 6 รูปเท่านั้น");
                            return;
                          }
                        }
                      }}
                    />
                  </label>

                  {/* แสดงพรีวิวเป็น grid */}
                  {preview.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {preview.map((src, i) => (
                        <div
                          key={i}
                          className="relative group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                        >
                          <Image
                            width={0}
                            height={0}
                            src={src}
                            alt={`preview-${i}`}
                            className="w-full h-40 object-cover"
                          />

                          {/* ปุ่มลบรูป */}
                          <button
                            type="button"
                            onClick={() => {
                              const newPreviews = preview.filter(
                                (_, index) => index !== i
                              );
                              setPreview(newPreviews);
                              // อัปเดตค่าของ react-hook-form ด้วย
                              const dt = new DataTransfer();
                              newPreviews.forEach((_, idx) => {
                                if (e.target?.files && e.target.files[idx]) {
                                  dt.items.add(e.target.files[idx]);
                                }
                              });
                              setValue("image", dt.files);
                            }}
                            className="absolute cursor-pointer top-1 right-1 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                  <button
                    className="button-create mt-4"
                    type="submit"
                    disabled={Loading}
                  >
                    {Loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        กำลังสร้าง
                      </>
                    ) : (
                      <>
                        สร้างใบงาน <FileDiff size={20} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div >
              <h1>Map</h1>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default WorkForm;

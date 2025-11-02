"use client";

import { FileDiff, FileText, Loader2, UserStar } from "lucide-react";
import React, { useState } from "react";
import DropdownSupervisor from "./Dropdown";
import DateField from "@/components/DueDate/Date";
import { FormProvider, useForm } from "react-hook-form";
import { WorkFormValues, workSchema } from "@/lib/Validations/SchemaForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Time from "@/components/DueDate/Time";

const WorkForm = () => {
  const [Loading, setLoading] = useState(false);

  const methods = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;
  const onsubmit = async (data: WorkFormValues) => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1000));
      const current = JSON.parse(localStorage.getItem("CardWork") || "[]");
      const netWork = {
        id: current.length + 1,
        
        JobId: "JOB_" + 1,
        ...data,
        status: "รอการมอบหมายงาน",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("CardWork", JSON.stringify([...current, netWork]));
      reset();
      toast.success("เพิ่มใบงานสําเร็จ");
    } catch (error) {
      console.log(error);
      toast.error("เพิ่มใบงานไม่สําเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-2"
        onSubmit={handleSubmit(onsubmit)}
      >
        <div className="mt-6 bg-white shadow-md rounded-md p-6 border border-gray-100 ">
          <h2 className="text-2xl font-semibold mb-2 text-primary/90 flex items-center gap-2">
            ข้อมูลใบงาน <FileText size={30} />
          </h2>
          <div className="h-[3px] w-[170px] bg-gradient-to-t from-primary to-secondary rounded-full"></div>
          {/* Field */}
          <div className=" mt-4">
            <div>
              <label className="block text-lg font-medium text-text mb-1">
                ชื่อใบงาน <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title")}
                type="text"
                placeholder="โปรดกรอกชื่อใบงาน"
                className="input-field "
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
            <div className="mt-4">
              <label
                htmlFor=""
                className="block text-lg font-medium text-text mb-1"
              >
                คำอธิบายงาน
              </label>
              <textarea
                {...register("description")}
                placeholder="รายละเอียดของงาน"
                className="input-field"
              />
              <p className="text-xs text-text-secondary mt-1 px-2">
                อธิบายรายละเอียดของงานเพื่อให้ทีมช่างเข้าใจตรงกัน
              </p>
            </div>
            {/* Select Supervisor */}
            <DropdownSupervisor />
            {errors.supervisorId && (
              <p className="text-xs text-red-500 mt-1">
                {errors.supervisorId.message}
              </p>
            )}
            {/* Date  */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex flex-col">
                <DateField />
                {errors.dateRange && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.dateRange.message}
                  </p>
                )}
              </div>
              {/* Time */}
              <Time />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="button-create mt-4 "
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
        <div className="mt-6">
          <h1>Map</h1>
        </div>
      </form>
    </FormProvider>
  );
};

export default WorkForm;

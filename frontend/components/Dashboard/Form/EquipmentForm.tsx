"use client";

import { AlertCircle, PackagePlus, Loader2, Save, Tag, Hash, Box, Info } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { EquipmentFormValues, equipmentSchema } from "@/lib/Validations/SchemaForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { itemService } from "@/services/item.service";

const EquipmentForm = ({ 
  onSuccess, 
  isModal = false,
  initialData = null
}: { 
  onSuccess?: () => void, 
  isModal?: boolean,
  initialData?: any
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: initialData || {
      type: "EQUIPMENT",
      quantity: 0,
    },
  });

  // Reset form when initialData changes (for Edit mode)
  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const watchType = watch("type");

  const onSubmit = async (data: EquipmentFormValues) => {
    try {
      setLoading(true);
      if (initialData?.id) {
        await itemService.updateItem(initialData.id, data);
        toast.success("แก้ไขข้อมูลสำเร็จ!");
      } else {
        await itemService.createItem(data);
        toast.success("เพิ่มอุปกรณ์สำเร็จ!");
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/equipment");
      }
    } catch (err: any) {
      console.error("Submit item error:", err);
      toast.error(err?.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        {/* Left Column: Basic Info */}
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100 space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-4 mb-2">
            <Tag className="text-primary w-5 h-5" />
            <h3 className="font-bold text-gray-800">ข้อมูลพื้นฐาน</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <Hash size={14} className="text-gray-400" />
                รหัสอุปกรณ์ / พัสดุ <span className="text-red-500">*</span>
              </label>
              <input
                {...register("code")}
                type="text"
                placeholder="เช่น EQ-2024-001"
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none ${
                    errors.code ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.code && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.code.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <Box size={14} className="text-gray-400" />
                ชื่ออุปกรณ์ <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="ชื่อเรียกอุปกรณ์"
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none ${
                    errors.name ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">ยี่ห้อ (Brand)</label>
                <input
                  {...register("brand")}
                  type="text"
                  placeholder="เช่น Honda, Sony"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">รุ่น (Model)</label>
                <input
                  {...register("model")}
                  type="text"
                  placeholder="รหัสรุ่น"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inventory Info */}
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100 space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-4 mb-2">
            <PackagePlus className="text-primary w-5 h-5" />
            <h3 className="font-bold text-gray-800">การจัดการสต็อก</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ประเภท <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-3">
                {["EQUIPMENT", "MATERIAL"].map((type) => (
                  <label 
                    key={type}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                       errors.type ? "border-red-100" : ""
                    } ${
                      watchType === type 
                        ? "border-primary bg-primary text-white" 
                        : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                    }`}
                  >
                    <input
                      {...register("type")}
                      type="radio"
                      value={type}
                      className="hidden"
                    />
                    <span className="text-sm font-semibold tracking-wide">
                      {type === "EQUIPMENT" ? "อุปกรณ์" : "วัสดุสิ้นเปลือง"}
                    </span>
                  </label>
                ))}
              </div>
              {errors.type && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.type.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">จำนวนเริ่มต้น <span className="text-red-500">*</span></label>
                <input
                  {...register("quantity")}
                  type="number"
                  step="0.01"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none ${
                    errors.quantity ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.quantity && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.quantity.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">หน่วยนับ <span className="text-red-500">*</span></label>
                <input
                  {...register("unit")}
                  type="text"
                  placeholder="เช่น ชิ้น, ชุด, กิโลกรัม"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none ${
                    errors.unit ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.unit && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.unit.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <Info size={14} className="text-gray-400" />
                หมายเหตุเพิ่มเติม
              </label>
              <textarea
                {...register("note")}
                rows={4}
                placeholder="ระบุรายละเอียดเพิ่มเติมเกี่ยวกับอุปกรณ์นี้..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`${isModal ? 'mt-8 flex justify-end gap-3' : 'fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 z-40'}`}>
        <div className={`${isModal ? 'w-full flex gap-3' : 'max-w-4xl mx-auto flex gap-4'}`}>
          <button
            type="button"
            onClick={() => isModal && onSuccess ? onSuccess() : router.back()}
            className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-all"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale tracking-wide"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            {loading ? "กำลังบันทึก..." : "บันทึกอุปกรณ์"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EquipmentForm;

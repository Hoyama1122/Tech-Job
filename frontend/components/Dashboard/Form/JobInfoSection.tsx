import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { WorkFormValues } from "@/lib/Validations/SchemaForm";
import { FileText, AlertCircle } from "lucide-react";
import DropdownCategory from "./DropdownCategory";

interface JobInfoSectionProps {
  register: UseFormRegister<WorkFormValues>;
  errors: FieldErrors<WorkFormValues>;
}

const JobInfoSection: React.FC<JobInfoSectionProps> = ({
  register,
  errors,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-[12px]">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">ข้อมูลใบงาน</h2>
            <p className="text-sm text-gray-500">
              กรอกรายละเอียดงานที่ต้องการสร้าง
            </p>
          </div>
        </div>
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
      <DropdownCategory register={register} />
    </div>
  );
};

export default JobInfoSection;

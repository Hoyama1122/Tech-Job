import { FileText, UserStar } from "lucide-react";
import React from "react";
import DropdownSupervisor from "./Dropdown";
import DateField from "@/components/DueDate/Date";

const WorkForm = () => {
  return (
    <div>
      <form className="mt-6 bg-white shadow-md rounded-md p-6 border border-gray-100 ">
        <h2 className="text-2xl font-semibold mb-2 text-primary/90 flex items-center gap-2">
          ข้อมูลใบงาน <FileText size={30} />
        </h2>
        <div className="h-[3px] w-[170px] bg-gradient-to-t from-primary to-secondary rounded-full"></div>
        {/* Field */}
        <div className="space-y-5 mt-4">
          <div>
            <label className="block text-lg font-medium text-text mb-1">
              ชื่อใบงาน <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="โปรดกรอกชื่อใบงาน"
              className="input-field "
            />
            <p className="text-xs px-2 text-text-secondary mt-1">
              กรุณาระบุชื่อใบงานให้ชัดเจน
            </p>
          </div>
          {/* Description */}
          <div>
            <label
              htmlFor=""
              className="block text-lg font-medium text-text mb-1"
            >
              คำอธิบายงาน
            </label>
            <textarea placeholder="รายละเอียดของงาน" className="input-field" />
            <p className="text-xs text-text-secondary mt-1 px-2">
              อธิบายรายละเอียดของงานเพื่อให้ทีมช่างเข้าใจตรงกัน
            </p>
          </div>
          {/* Select Supervisor */}
          <DropdownSupervisor />
          {/* Date  */}
          <div className="grid grid-cols-2 gap-2">
            <DateField />
            <div>
                dsada
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WorkForm;

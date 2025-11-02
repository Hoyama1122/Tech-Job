import { Clock } from "lucide-react";
import React from "react";

const Time = () => {
  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="" className="flex items-center gap-1 text-gray-700 mb-1">
        <Clock size={16} className="text-primary" />
        <span className="font-medium text-sm">ช่วงเวลา</span>
      </label>

      <div className="flex items-center gap-3">
        {/* เวลาเริ่มต้น */}
        <div className="flex-1">
          <input type="time" className="input-field" />
        </div>

        <div>
          <span className="text-gray-500">ถึง</span>
        </div>

        {/* เวลาสิ้นสุด */}
        <div className="flex-1">
          <input type="time" className="input-field" />
        </div>
      </div>
    </div>
  );
};

export default Time;
